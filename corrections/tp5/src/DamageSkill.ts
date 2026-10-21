import type { PokemonType } from './types/pokemon.types';
import type { Pokemon } from './Pokemon';
import type { Fighter } from './Fighter';
import { Skill } from './Skill';

export class DamageSkill extends Skill {
  protected readonly power: number;

  public constructor(name: string, type: PokemonType, power: number) {
    super(name, type);

    if (power <= 0) {
      throw new Error(`The power of ${name} must be strictly positive.`);
    }

    this.power = power;
  }

  public override describe(): string {
    return `${super.describe()} - Power: ${this.power}`;
  }

  public override use(user: Pokemon, target: Fighter): void {
    target.takeDamage(this.power);
    console.log(
      `${user.name} uses ${this.name}! ${target.name} loses ${this.power} HP (${target.hp}/${target.maxHp}).`
    );
  }
}
