import * as ex from 'excalibur';

// Define Resource folders
export const Resources = {
  Backgrounds: {} as Record<string, ex.ImageSource>,
  Characters: {} as Record<string, ex.ImageSource>,
  UIElements: {} as Record<string, ex.ImageSource>,
}

// A simple helper that forced TypeScript to see the Vite glob as Record<string, string>
const castToAssets = (globResult: Record<string, unknown>): Record<string, string> => {
  return globResult as Record<string, string>;
};

// Define paths to asset folders within the assets folder
const backgroundAssets = castToAssets(import.meta.glob('./assets/backgrounds/background-*.png', { eager: true, import: 'default' }));
const characterAssets = castToAssets(import.meta.glob('./assets/backgrounds/characters-*.png', { eager: true, import: 'default' }));
const uiElementAssets = castToAssets(import.meta.glob('./assets/backgrounds/ui-*.png', { eager: true, import: 'default' }));

// Set the connection between all assets and their Resource folders
const assetConnections = [
  { assets: backgroundAssets, folder: Resources.Backgrounds },
  { assets: characterAssets, folder: Resources.Characters },
  { assets: uiElementAssets, folder: Resources.UIElements },
]

// Load the asset path dynamically using its path and folder
const loadAssetPath = (
  assetPath: Record<string, string>,
  assetFolder: Record<string, ex.ImageSource>
) => {
  // Loop through all the assetPaths
  for (const path in assetPath) {
    // Define the origional path of the asset
    const originalPath = assetPath[path];

    // Define the new clean name of the asset e.g. house || city
    const cleanPath = path
      /** 
       * RegEx / ... / look for text
      * ^ Absolute start of the text which e.g. b in background
      * .* Select all the text until -
      */
      .replace(/^.*-/, '')
      /**
       * \. Looks for a dot
       * [^.]+$ Get all characters that follow until the absolute end of the text
       */
      .replace(/\.[^.]+$/, '');

    // Create a new ImageSource based on the Resource.assetFolder[name]
    assetFolder[cleanPath] = new ex.ImageSource(originalPath);
  }
}

// Loop though all connected assets
for (const connection of assetConnections) {
  // Load the assets based on the connected items
  loadAssetPath(connection.assets, connection.folder);
}

// Turning all Resources into a single flat map
const allResources = Object.values(Resources).flatMap(category => Object.values(category));

// Exporting the Resources as an Excalibur Loader
export const ResourceLoader = new ex.Loader(allResources);

// Backwards-compatible named export used by the main.ts
export const loader = ResourceLoader;

// Setting the ResourceLoader to default export
export default ResourceLoader;