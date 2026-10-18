import { Router } from 'express';
import {
  deletePokemon,
  getPokemonById,
  getPokemons,
  postPokemon,
  putPokemon,
} from '../controllers/pokemon.controller';

export const pokemonRouter = Router();

pokemonRouter.get('/', getPokemons);
pokemonRouter.get('/:id', getPokemonById);
pokemonRouter.post('/', postPokemon);
pokemonRouter.put('/:id', putPokemon);
pokemonRouter.delete('/:id', deletePokemon);
