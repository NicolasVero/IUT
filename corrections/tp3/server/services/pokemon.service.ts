import { database } from '../database';
import type { Pokemon, PokemonUpdate } from '../types/pokemon.types';

export function findAll(): Pokemon[] {
  return database
    .prepare('SELECT * FROM pokemons ORDER BY id')
    .all() as Pokemon[];
}

export function findById(id: number): Pokemon | undefined {
  return database
    .prepare('SELECT * FROM pokemons WHERE id = ?')
    .get(id) as Pokemon | undefined;
}

export function create(pokemon: Pokemon): Pokemon {
  database
    .prepare(`
      INSERT INTO pokemons (
        id, name, sprite, primaryType, secondaryType,
        hp, attack, defense, specialAttack, specialDefense, speed
      ) VALUES (
        @id, @name, @sprite, @primaryType, @secondaryType,
        @hp, @attack, @defense, @specialAttack, @specialDefense, @speed
      )
    `)
    .run(pokemon);

  return findById(pokemon.id) as Pokemon;
}

export function update(id: number, input: PokemonUpdate): Pokemon | undefined {
  const result = database
    .prepare(`
      UPDATE pokemons SET
        name = @name, sprite = @sprite,
        primaryType = @primaryType, secondaryType = @secondaryType,
        hp = @hp, attack = @attack, defense = @defense,
        specialAttack = @specialAttack, specialDefense = @specialDefense, speed = @speed
      WHERE id = @id
    `)
    .run({ ...input, id });

  if (result.changes === 0) {
    return undefined;
  }

  return findById(id);
}

export function remove(id: number): boolean {
  const result = database
    .prepare('DELETE FROM pokemons WHERE id = ?')
    .run(id);

  return result.changes > 0;
}
