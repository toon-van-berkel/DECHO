import * as ex from 'excalibur';
import { BaseScene } from './BaseScene';
import drVexData from '../data/dr-vex.json';
import { NpcData } from '../types/NpcData';

// extentie van BaseScene
export class CyberClinicScene extends BaseScene {
  constructor(engine: ex.Engine) {
    super(engine, drVexData as NpcData, 'skyPlatform');
  }

  onActivate() {
    super.onActivate();
  }
}
