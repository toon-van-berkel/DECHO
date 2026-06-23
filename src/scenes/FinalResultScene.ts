// the label for the final result

import * as ex from 'excalibur';
import { GameState } from '../state/GameState';

export class FinalResultScene extends ex.Scene {
  onActivate() {
    // skills die nodig zijn om te winnen
    const requiredSkills = [
      'Route-Navigation',
      'Firewall-Bypass',
      'Hardware-Hacking',
    ];
    const secured = GameState.securedSkills || [];

    //de niet gesecurde skills worden hier opgehaald
    const missing = requiredSkills.filter((skill) => !secured.includes(skill));

    //controle of missing skills leeg is dus dan heb je alle required skills behaald
    const allSkillsAchieved = missing.length === 0;

    //controle of data echo niet hoger is dan 60
    const dataIsSafe = (GameState.dataEcho ?? 0) <= 60;
    const isVictory = allSkillsAchieved && dataIsSafe;
    const outcome = isVictory
      ? 'Victory: Liberation'
      : 'Defeat: Absorbed by System';

    //label opbouwen
    const label = new ex.Label({
      text: `
    Outcome: ${outcome}
    Final Data Echo: ${GameState.dataEcho ?? 0}
    Required Skills: ${requiredSkills.join(', ')}
    Secured Skills: ${secured.join(', ') || 'None'}
    Missing Skills: ${missing.join(', ') || 'None'}
  `,
      pos: ex.vec(50, 50),
      font: new ex.Font({
        family: 'sans-serif',
        size: 24,
        unit: ex.FontUnit.Px,
        color: ex.Color.White,
      }),
    });
    this.add(label);
    console.log('HUIDIGE GAMESTATE BIJ FINISH:', JSON.stringify(GameState));
  }
}
