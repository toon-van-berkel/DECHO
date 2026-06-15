import { ImageSource, Loader } from "excalibur";
import { TiledResource } from "@excaliburjs/plugin-tiled";

const Resources = {
  Walking: new ImageSource("/images/male/Walk/walk.png"),
  MapV1: new TiledResource("/images/map/EchoShardsV1.tmx"),
};

const ResourceLoader = new Loader(Object.values(Resources));

export { Resources, ResourceLoader };
