import { ImageSource, Sound, Resource, Loader } from "excalibur";

// voeg hier jouw eigen resources toe
const Resources = {
  Walking: new ImageSource("images/male/Walk/walk.png"),
  MapV1: new ImageSource('images/map/EchoShardsV1.tmx')
};

const ResourceLoader = new Loader();
for (let res of Object.values(Resources)) {
  ResourceLoader.addResource(res);
}

export { Resources, ResourceLoader };
