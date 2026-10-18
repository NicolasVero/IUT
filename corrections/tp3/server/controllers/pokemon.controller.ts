import type { Request, Response } from 'express';
import * as pokemonService from '../services/pokemon.service';
import { pokemonSchema, pokemonUpdateSchema } from '../types/pokemon.types';

function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function getPokemons(_request: Request, response: Response) {
  const pokemons = pokemonService.findAll();
  return response.json(pokemons);
}

export function getPokemonById(request: Request<{ id: string }>, response: Response) {
  const id = parseId(request.params.id);

  if (id === null) {
    return response.status(400).json({ error: "The id must be a positive integer." });
  }

  const pokemon = pokemonService.findById(id);

  if (!pokemon) {
    return response.status(404).json({ error: 'Pokemon not found.' });
  }

  return response.json(pokemon);
}

export function postPokemon(request: Request, response: Response) {
  const result = pokemonSchema.safeParse(request.body);

  if (!result.success) {
    return response.status(400).json({ error: 'Invalid Pokemon data.' });
  }

  const pokemon = result.data;

  if (pokemonService.findById(pokemon.id)) {
    return response.status(409).json({ error: 'This Pokemon is already in your Pokédex.' });
  }

  return response.status(201).json(pokemonService.create(pokemon));
}

export function putPokemon(request: Request<{ id: string }>, response: Response) {
  const id = parseId(request.params.id);

  if (id === null) {
    return response.status(400).json({ error: "The id must be a positive integer." });
  }

  const result = pokemonUpdateSchema.safeParse(request.body);

  if (!result.success) {
    return response.status(400).json({ error: 'Invalid Pokemon data.' });
  }

  const input = result.data;

  const pokemon = pokemonService.update(id, input);

  if (!pokemon) {
    return response.status(404).json({ error: 'Pokemon not found.' });
  }

  return response.json(pokemon);
}

export function deletePokemon(request: Request<{ id: string }>, response: Response) {
  const id = parseId(request.params.id);

  if (id === null) {
    return response.status(400).json({ error: "The id must be a positive integer." });
  }

  if (!pokemonService.remove(id)) {
    return response.status(404).json({ error: 'Pokemon not found.' });
  }

  return response.status(204).send();
}
