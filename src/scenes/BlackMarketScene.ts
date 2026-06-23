import * as ex from 'excalibur';
import { BaseScene } from './BaseScene';
import kaelData from '../data/kael.json';
import { NpcData } from '../types/NpcData';

// extentie van BaseScene
export class BlackMarketScene extends BaseScene {
  constructor(engine: ex.Engine) {
    super(engine, kaelData as NpcData, 'cyberClinic');
  }

  onActivate() {
    super.onActivate();
  }
}
