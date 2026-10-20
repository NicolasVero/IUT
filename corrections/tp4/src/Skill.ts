import type { PokemonType } from './types/pokemon.types';

export class Skill {
  public readonly name: string;
  public readonly type: PokemonType;
  public readonly power: number;

  public constructor(name: string, type: PokemonType, power: number) {
    if (power <= 0) {
      throw new Error(`The power of ${name} must be strictly positive.`);
    }

    this.name = name;
    this.type = type;
    this.power = power;
  }

  public describe(): string {
    return `${this.name} [${this.type}] - Power: ${this.power}`;
  }
}
