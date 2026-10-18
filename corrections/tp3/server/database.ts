import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import type { Pokemon } from './types/pokemon.types';

mkdirSync('data', { recursive: true });

export const database = new Database('data/pokedex.db');

database.exec(`
  CREATE TABLE IF NOT EXISTS pokemons (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    sprite TEXT NOT NULL,
    primaryType TEXT NOT NULL,
    secondaryType TEXT,
    hp INTEGER NOT NULL CHECK (hp > 0),
    attack INTEGER NOT NULL,
    defense INTEGER NOT NULL,
    specialAttack INTEGER NOT NULL,
    specialDefense INTEGER NOT NULL,
    speed INTEGER NOT NULL
  )
`);

const pokemons: Pokemon[] = [
  {
    id: 25,
    name: 'pikachu',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    primaryType: 'electric',
    secondaryType: null,
    hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90,
  },
  {
    id: 1,
    name: 'bulbasaur',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    primaryType: 'grass',
    secondaryType: 'poison',
    hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45,
  },
  {
    id: 4,
    name: 'charmander',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    primaryType: 'fire',
    secondaryType: null,
    hp: 39, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65,
  },
];

const existingPokemon = database
  .prepare('SELECT id FROM pokemons LIMIT 1')
  .get();

if (!existingPokemon) {
  const insertPokemon = database.prepare(`
    INSERT INTO pokemons (
      id, name, sprite, primaryType, secondaryType,
      hp, attack, defense, specialAttack, specialDefense, speed
    ) VALUES (
      @id, @name, @sprite, @primaryType, @secondaryType,
      @hp, @attack, @defense, @specialAttack, @specialDefense, @speed
    )
  `);

  for (const pokemon of pokemons) {
    insertPokemon.run(pokemon);
  }
}
