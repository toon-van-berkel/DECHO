import * as ex from 'excalibur';

const backgroundAssets = import.meta.glob<string>('../assets/backgrounds/background-*.{png,webp}', {
  eager: true,
  import: 'default',
});
const characterAssets = import.meta.glob<string>('../assets/character/**/character-*.png', {
  eager: true,
  import: 'default',
});
const uiElementAssets = import.meta.glob<string>('../assets/ui/ui-*.png', {
  eager: true,
  import: 'default',
});

export const Resources = {
  Backgrounds: {} as Record<string, ex.ImageSource>,
  Characters: {} as Record<string, ex.ImageSource>,
  UIElements: {} as Record<string, ex.ImageSource>,
};

const assetConnections = [
  { assets: backgroundAssets, folder: Resources.Backgrounds },
  { assets: characterAssets, folder: Resources.Characters },
  { assets: uiElementAssets, folder: Resources.UIElements },
];

const loadAssetPaths = (
  assetPaths: Record<string, string>,
  assetFolder: Record<string, ex.ImageSource>,
): void => {
  for (const [path, resolvedPath] of Object.entries(assetPaths)) {
    const fileName = path.split('/').at(-1) ?? path;
    const resourceName = fileName.replace(/\.[^.]+$/, '').replaceAll('_', '-');
    assetFolder[resourceName] = new ex.ImageSource(resolvedPath);
  }
};

for (const connection of assetConnections) {
  loadAssetPaths(connection.assets, connection.folder);
}

const allResources = Object.values(Resources).flatMap((category) =>
  Object.values(category),
);

export const ResourceLoader = new ex.Loader(allResources);
export const loader = ResourceLoader;

export function getBackgroundResource(key: string): ex.ImageSource | undefined {
  return Resources.Backgrounds[key];
}

export function getCharacterResource(key: string): ex.ImageSource | undefined {
  return Resources.Characters[key];
}

export default ResourceLoader;
