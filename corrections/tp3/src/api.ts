import type { Pokemon, PokemonInput } from './types/pokemon.types';

const API_URL = 'http://localhost:3000/api';

async function getErrorMessage(response: Response): Promise<string> {
  // An Express 500 error is sent as HTML: do not assume the body is JSON
  const body = await response.json().catch(() => ({}));
  return body.error ?? `HTTP Error ${response.status}`;
}

export async function fetchPokemons(): Promise<Pokemon[]> {
  const response = await fetch(`${API_URL}/pokemons`);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function deletePokemon(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/pokemons/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export async function createPokemon(pokemon: Pokemon): Promise<Pokemon> {
  const response = await fetch(`${API_URL}/pokemons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pokemon),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function updatePokemon(id: number, input: PokemonInput): Promise<Pokemon> {
  const response = await fetch(`${API_URL}/pokemons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}
