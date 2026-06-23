import * as ex from 'excalibur';
import { BaseScene } from './BaseScene';
import eliasData from '../data/elias.json';
import { NpcData } from '../types/NpcData';

// extentie van BaseScene
export class SkyPlatformScene extends BaseScene {
  constructor(engine: ex.Engine) {
    super(engine, eliasData as NpcData, 'finalResult');
  }

  onActivate() {
    super.onActivate();
  }
}
