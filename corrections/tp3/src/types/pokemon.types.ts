export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  primaryType: string;
  secondaryType: string | null;
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

// The body of a PUT: every field except the id, which is in the URL
export type PokemonInput = Omit<Pokemon, 'id'>;
