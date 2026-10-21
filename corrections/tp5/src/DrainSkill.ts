import type { Pokemon } from './Pokemon';
import type { Fighter } from './Fighter';
import { DamageSkill } from './DamageSkill';

export class DrainSkill extends DamageSkill {
  public override describe(): string {
    return `${super.describe()} - Drain: 50%`;
  }

  public override use(user: Pokemon, target: Fighter): void {
    super.use(user, target);

    const drained = Math.floor(this.power / 2);
    user.heal(drained);
    console.log(`${user.name} drains ${drained} HP (${user.hp}/${user.maxHp}).`);
  }
}
