import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';

const gameUrl = 'http://127.0.0.1:4173/';
const blockedMessagesArray = [
  'background-map is missing',
  'Error during scene initialization',
  'Scene update called before initialize',
  'Scene draw called before initialize',
];

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitForServer(serverProcess, serverOutputArray) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 30000) {
    if (serverProcess.exitCode !== null) {
      throw new Error(
        `Vite preview exited early.\n${serverOutputArray.join('')}`,
      );
    }

    try {
      const response = await fetch(gameUrl);
      if (response.ok) {
        return;
      }
    } catch {
      await wait(250);
    }
  }

  throw new Error(`Timed out waiting for ${gameUrl}`);
}

async function stopServer(serverProcess) {
  if (serverProcess.exitCode !== null) {
    return;
  }

  serverProcess.kill();
  await wait(1000);

  if (serverProcess.exitCode === null) {
    serverProcess.kill('SIGKILL');
  }
}

function assertNoBlockedMessages(browserMessagesArray) {
  const blockedMessage = browserMessagesArray.find((message) =>
    blockedMessagesArray.some((blockedText) => message.includes(blockedText)),
  );

  if (blockedMessage) {
    throw new Error(`Blocked browser message found: ${blockedMessage}`);
  }
}

async function waitForRenderedCanvas(page) {
  let lastScreenshotLength = 0;

  for (let attemptIndex = 0; attemptIndex < 20; attemptIndex += 1) {
    const mapScreenshot = await page.locator('canvas').screenshot();
    lastScreenshotLength = mapScreenshot.length;

    if (mapScreenshot.length >= 10000) {
      return;
    }

    await page.waitForTimeout(250);
  }

  throw new Error(
    `Map canvas screenshot is ${lastScreenshotLength} bytes; background may not be visible.`,
  );
}

async function runSmokeTest() {
  const serverOutputArray = [];
  const serverProcess = spawn(
    process.execPath,
    [
      './node_modules/vite/bin/vite.js',
      'preview',
      '--host',
      '127.0.0.1',
      '--port',
      '4173',
      '--strictPort',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );

  serverProcess.stdout.on('data', (data) => {
    serverOutputArray.push(data.toString());
  });
  serverProcess.stderr.on('data', (data) => {
    serverOutputArray.push(data.toString());
  });

  let browser;

  try {
    await waitForServer(serverProcess, serverOutputArray);

    browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-web-security', '--use-angle=gl'],
    });
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    const browserMessagesArray = [];

    page.on('console', (message) => {
      browserMessagesArray.push(`${message.type()}: ${message.text()}`);
    });
    page.on('pageerror', (error) => {
      browserMessagesArray.push(`pageerror: ${error.message}`);
    });

    await page.goto(gameUrl);
    await page.locator('canvas').waitFor({ state: 'visible' });

    // Main menu (fresh, no save): New Game -> slot panel -> pick empty slot 1.
    await page.mouse.click(640, 327);
    await page.waitForTimeout(400);
    await page.mouse.click(640, 285);
    await waitForRenderedCanvas(page);

    // Map: select a checkpoint, then Travel into the location scene.
    await page.mouse.click(640, 216);
    await page.waitForTimeout(500);
    await page.mouse.click(170, 230);
    await page.waitForTimeout(800);

    // Escape pause -> Back to Menu (autosaves and fades to the main menu).
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await page.mouse.click(640, 459);
    await page.waitForTimeout(900);

    // Main menu now has a save: Continue reloads it and fades back to the map.
    await page.mouse.click(640, 294);
    await waitForRenderedCanvas(page);

    assertNoBlockedMessages(browserMessagesArray);
    console.log('Runtime smoke passed.');
  } finally {
    await browser?.close();
    await stopServer(serverProcess);
  }
}

runSmokeTest().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
