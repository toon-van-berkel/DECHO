import * as ex from 'excalibur';
import { BaseScene } from './BaseScene';
import miraData from '../data/mira.json';
import { NpcData } from '../types/NpcData';

// extentie van BaseScene
export class DocksScene extends BaseScene {
  constructor(engine: ex.Engine) {
    super(engine, miraData as NpcData, 'blackMarket');
  }

  onActivate() {
    super.onActivate();
  }
}
