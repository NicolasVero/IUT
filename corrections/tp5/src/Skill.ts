import type { PokemonType } from './types/pokemon.types';
import type { Pokemon } from './Pokemon';
import type { Fighter } from './Fighter';

export abstract class Skill {
  public readonly name: string;
  public readonly type: PokemonType;

  public constructor(name: string, type: PokemonType) {
    this.name = name;
    this.type = type;
  }

  public describe(): string {
    return `${this.name} [${this.type}]`;
  }

  public abstract use(user: Pokemon, target: Fighter): void;
}
