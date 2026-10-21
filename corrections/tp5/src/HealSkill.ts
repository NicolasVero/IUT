import type { PokemonType } from './types/pokemon.types';
import type { Pokemon } from './Pokemon';
import type { Fighter } from './Fighter';
import { Skill } from './Skill';

export class HealSkill extends Skill {
  public readonly amount: number;

  public constructor(name: string, type: PokemonType, amount: number) {
    super(name, type);

    if (amount <= 0) {
      throw new Error(`The amount of ${name} must be strictly positive.`);
    }

    this.amount = amount;
  }

  public override describe(): string {
    return `${super.describe()} - Heal: ${this.amount}`;
  }

  public override use(user: Pokemon, _target: Fighter): void {
    user.heal(this.amount);
    console.log(
      `${user.name} uses ${this.name}! ${user.name} recovers ${this.amount} HP (${user.hp}/${user.maxHp}).`
    );
  }
}
