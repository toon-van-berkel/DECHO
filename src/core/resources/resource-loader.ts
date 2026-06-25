/**
 * Resource loader for DECHO.
 *
 * Main responsibility:
 * - Registers image assets and exposes the Excalibur loader.
 *
 * Made by: Richie
 */

import * as excalibur from 'excalibur';

const backgroundAssetsObject = import.meta.glob<string>(
  '../../assets/backgrounds/background-*.{png,webp}',
  { eager: true, import: 'default' },
);

const characterAssetsObject = import.meta.glob<string>(
  '../../assets/characters/**/character-*.png',
  { eager: true, import: 'default' },
);

const uiAssetsObject = import.meta.glob<string>('../../assets/ui/ui-*.png', {
  eager: true,
  import: 'default',
});

export const resourcesObject = {
  backgrounds: {} as Record<string, excalibur.ImageSource>,
  characters: {} as Record<string, excalibur.ImageSource>,
  ui: {} as Record<string, excalibur.ImageSource>,
};

function registerAssets(
  assetPathsObject: Record<string, string>,
  assetTargetObject: Record<string, excalibur.ImageSource>,
): void {
  Object.entries(assetPathsObject).forEach(([assetPath, resolvedPath]) => {
    const fileName = assetPath.split('/').at(-1) ?? assetPath;
    const resourceKey = fileName.replace(/\.[^.]+$/, '').replaceAll('_', '-');
    assetTargetObject[resourceKey] = new excalibur.ImageSource(resolvedPath);
  });
}

registerAssets(backgroundAssetsObject, resourcesObject.backgrounds);
registerAssets(characterAssetsObject, resourcesObject.characters);
registerAssets(uiAssetsObject, resourcesObject.ui);

const allResourcesArray = Object.values(resourcesObject).flatMap((assetGroup) =>
  Object.values(assetGroup),
);

export const resourceLoader = new excalibur.Loader(allResourcesArray);

export function getBackgroundResource(
  resourceKey: string,
): excalibur.ImageSource | undefined {
  return resourcesObject.backgrounds[resourceKey];
}

export function getCharacterResource(
  resourceKey: string,
): excalibur.ImageSource | undefined {
  return resourcesObject.characters[resourceKey];
}
