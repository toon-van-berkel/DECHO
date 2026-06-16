import { ImageSource, Loader } from 'excalibur';

/** All game assets, registered in one place. Files are served from `public/`. */
export const Resources = {
  MapBackground: new ImageSource('./images/map-background.png'),
} as const;

/** Boot loader; every resource above is added automatically. */
export const loader = new Loader();
for (const resource of Object.values(Resources)) {
  loader.addResource(resource);
}
