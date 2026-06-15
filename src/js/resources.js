import { ImageSource, Sound, Resource, Loader } from "excalibur";

// voeg hier jouw eigen resources toe
const Resources = {
  Walking: new ImageSource("images/male/Walk/walk.png"),
  House: new ImageSource("images/TILESET VILLAGE TOP DOWN/HOUSE 1 - DAY.png"),
  Terrain: new ImageSource("images/TILESET VILLAGE TOP DOWN/TERRAIN SET 1 - DAY.png"),
  Water: new ImageSource("images/TILESET VILLAGE TOP DOWN/WATER TILE - DAY.png"),
};

const ResourceLoader = new Loader();
for (let res of Object.values(Resources)) {
  ResourceLoader.addResource(res);
}

export { Resources, ResourceLoader };
