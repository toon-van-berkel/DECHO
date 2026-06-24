import * as ex from 'excalibur';
import { BaseScene } from './BaseScene';
import jaxData from '../data/jax.json';
import { NpcData } from '../types/NpcData';

// extentie van BaseScene
export class MarketSquareScene extends BaseScene {
  constructor(engine: ex.Engine) {
    super(engine, jaxData as NpcData, 'theDocks');
  }

  onActivate() {
    super.onActivate();
  }
}
