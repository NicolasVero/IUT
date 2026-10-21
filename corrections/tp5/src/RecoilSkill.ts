import type { PokemonType } from './types/pokemon.types';
import type { Pokemon } from './Pokemon';
import type { Fighter } from './Fighter';
import { DamageSkill } from './DamageSkill';

export class RecoilSkill extends DamageSkill {
  public readonly recoilRatio: number; // part de la puissance subie par le lanceur

  public constructor(name: string, type: PokemonType, power: number, recoilRatio: number) {
    super(name, type, power);
    this.recoilRatio = recoilRatio;
  }

  public override describe(): string {
    return `${super.describe()} - Recoil: ${this.recoilRatio * 100}%`;
  }

  public override use(user: Pokemon, target: Fighter): void {
    super.use(user, target);

    const recoil = Math.floor(this.power * this.recoilRatio);
    user.takeDamage(recoil);
    console.log(`${user.name} is hurt by recoil and loses ${recoil} HP (${user.hp}/${user.maxHp}).`);
  }
}
