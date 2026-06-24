# Decho

> A cyberpunk detective game about privacy: go undercover to catch a hacker who cracks the chips in people's heads.

`CLE4` · `Team 9` · `Games`

## Contents

- [About this project](#about-this-project)
- [Gameplay concept](#gameplay-concept)
- [Tools and technologies](#tools-and-technologies)
- [Getting started](#getting-started)
- [Controls](#controls)
- [Testing](#testing)
- [Project structure](#project-structure)
- [Building and deployment](#building-and-deployment)

## About this project

This is a school project for the course **CLE4 - Games** at Hogeschool Rotterdam (CMGT). The goal of the course is to design and build a real, playable game while applying object-oriented programming (OOP).

Decho is a 2D singleplayer detective game about privacy, set in a cyberpunk world where everyone has a chip implanted in their head. Those chips constantly share data and memories, and that is exactly what makes people vulnerable, because a hacker is loose who cracks the chips and breaks into people's private data. You play an undercover detective hunting that hacker: you travel across a map, interrogate people, and gather clues about where the hacker is hiding. The privacy theme sits at the core — in a world where data is always available and chips make every thought accessible, you go undercover to stop that exposure.

The codebase is written in **TypeScript** and built on the [Excalibur](https://excaliburjs.com/) game engine, with everything modelled as objects (actors, scenes, resources) to put the course's OOP goals into practice.

- **Social theme:** Privacy (social impact)
- **Player type:** Socializer (interaction-driven, singleplayer dialogue)
- **Fun factor:** Fantasy
- **Setting:** Cyberpunk
- **Engine:** [ExcaliburJS](https://excaliburjs.com/)
- **Tooling:** [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)

## Gameplay concept

You play an undercover detective searching for a hacker who cracks the chips in people's heads. The game opens with a lead: **the hacker was spotted at the black market on 5 August at 12:00.** From there it is up to you to track him down.

The core loop combines map navigation with conversation:

1. **Travel the map** — move across the world and click a location to go there.
2. **Investigate on arrival** — once you reach a location the gameplay switches to a **visual novel**, where you approach people and choose from different conversation options.
3. **Follow the routes** — each choice opens a different route through the conversation, leading to different clues about where the hacker is hiding.

It is a game about **persuasion and building trust** rather than combat, which fits the socializer player type.

### Conversations: respect and trust

Every conversation tracks two values:

- **Respect** — lose it and people close off, so you get less information.
- **Trust** — build it and people open up, so more comes loose.

These points are not a goal in themselves; they act as a **progress indicator** that tracks how far you are in the world.

> **Planned feature:** trust points become a currency in a shop, letting you unlock items.

Everything in the game is modelled as objects (Excalibur actors and scenes): the world map, the locations you travel to, the people you interrogate, and the dialogue system that drives each conversation.

> **Status:** the world map is implemented — a full-screen map with clickable, glowing checkpoints that open an info panel and travel to a (placeholder) visual-novel scene. The visual-novel mode and the conversation system (respect/trust) are the next pieces to build — see the [project structure](#project-structure) for what exists today.

## Tools and technologies

| Area | Choice |
| --- | --- |
| Language | [TypeScript](https://www.typescriptlang.org/) `5.9` (strict mode) |
| Game engine | [Excalibur](https://excaliburjs.com/) `0.32` |
| Build tool & dev server | [Vite](https://vitejs.dev/) `6` |
| Testing | [Playwright](https://playwright.dev/) (visual regression) |
| Runtime | [Node.js](https://nodejs.org/) `22.22.3` (pinned via `.nvmrc`) |
| Dependency updates | [Renovate](https://docs.renovatebot.com/) |

## Getting started

### Requirements

- **Node.js 22.22.3** — the version is pinned in [`.nvmrc`](.nvmrc). If you use [nvm](https://github.com/nvm-sh/nvm), run `nvm use` in the project root to switch to it.
- **npm** (ships with Node.js).

### Install and run

```bash
nvm use            # switch to the project's Node version (optional, if you use nvm)
npm install        # install dependencies
npm run dev        # start the Vite dev server with hot reload
```

The dev server prints a local URL (default `http://localhost:5173`) — open it in your browser to play.

### Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot reload. |
| `npm run build` | Type-check with `tsc`, then bundle the production build to `dist/`. |
| `npm run serve` | Preview the production build locally. |
| `npm test` | Build the project and run the Playwright tests. |
| `npm run test:integration-update` | Re-generate the Playwright visual snapshots. |

## Controls

The game is mouse-driven: you navigate the map and steer conversations by clicking.

| Action | Input |
| --- | --- |
| Travel to a location | Click a location on the map |
| Talk to a person | Click them once you have arrived |
| Choose a conversation option | Click the option |

> Map navigation and dialogue are point-and-click. Any keyboard shortcuts (for example, a key to advance dialogue) will be documented here once they are added.

## Testing

Visual regression tests run with [Playwright](https://playwright.dev/). They build the game, launch it, and compare the rendered page against committed reference screenshots.

```bash
npm test                            # build + run all Playwright tests
npm run test:integration-update     # update reference snapshots after intended visual changes
```

Snapshots live in [`tests/`](tests/) and are stored per platform (e.g. `*-chromium-linux.png`, `*-chromium-win32.png`).

## Project structure

```
Decho/
├─ public/
│  └─ images/                    # Static assets served at the site root (e.g. map-background.png)
├─ src/
│  ├─ main.ts                    # Entry point — configures the engine and starts the map scene
│  ├─ config.ts                  # Logical 16:9 render resolution
│  ├─ theme.ts                   # Design tokens (fonts, colors, glow, motion) + color helpers
│  ├─ resources.ts               # Asset registry and boot loader
│  ├─ map/                       # The world-map feature
│  │  ├─ map-scene.ts            # Scene — background, checkpoints and the info panel
│  │  ├─ checkpoint.ts           # Reusable glowing checkpoint marker (Actor)
│  │  ├─ checkpoint-config.ts    # CheckpointConfig type
│  │  ├─ checkpoints.data.ts     # The checkpoints shown on the map (edit here to add one)
│  │  ├─ info-panel.ts           # Glassmorphism info panel + "travel" button
│  │  └─ geometry.ts             # Small geometry and text-wrapping helpers
│  ├─ scenes/
│  │  └─ vn-placeholder-scene.ts # Placeholder visual-novel destination
│  ├─ files.d.ts                 # Type declarations for imported asset files (*.png)
│  ├─ vite-env.d.ts              # Vite client type declarations
│  ├─ style.css                  # Global page styling
│  └─ scss/                      # SCSS sources (abstracts / base / components)
├─ tests/
│  └─ map.spec.ts                # Playwright visual regression test
├─ index.html                    # HTML host page that boots src/main.ts
├─ vite.config.js                # Vite build and dev configuration
├─ tsconfig.json                 # TypeScript compiler configuration
├─ playwright.config.ts          # Playwright test configuration
├─ .nvmrc                        # Pinned Node.js version
└─ package.json                  # Scripts and dependencies
```

How the pieces fit together: [`index.html`](index.html) boots [`src/main.ts`](src/main.ts), which configures the Excalibur `Engine` and starts the [`MapScene`](src/map/map-scene.ts). The map scene draws the background and creates one [`Checkpoint`](src/map/checkpoint.ts) for each entry in [`checkpoints.data.ts`](src/map/checkpoints.data.ts). Clicking a checkpoint opens the shared [`InfoPanel`](src/map/info-panel.ts); pressing **Reis hierheen** travels to that checkpoint's `targetScene` — for now the shared [`VNPlaceholderScene`](src/scenes/vn-placeholder-scene.ts). Assets are registered once in [`resources.ts`](src/resources.ts) and loaded before the first scene runs.

To add a location, copy an entry in [`checkpoints.data.ts`](src/map/checkpoints.data.ts) and give it a unique `id`, a `position` (a fraction of the map), a `theme` colour and a `targetScene`. Each team member builds their own visual-novel scene under [`src/scenes/`](src/scenes/) and points a checkpoint's `targetScene` at it.

## Building and deployment

```bash
npm run build      # type-checks and outputs the static site to dist/
```

The production build is a static bundle in `dist/` that can be hosted on any static host. Automated deployment (e.g. GitHub Pages) is not yet configured.
