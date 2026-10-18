import { z } from 'zod';

const typeSchema = z.string().trim().min(1);
const statSchema = z.number().int().positive();

export const pokemonSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1),
  sprite: z.url({ protocol: /^https?$/ }),
  primaryType: typeSchema,
  secondaryType: typeSchema.nullable(),
  hp: statSchema,
  attack: statSchema,
  defense: statSchema,
  specialAttack: statSchema,
  specialDefense: statSchema,
  speed: statSchema,
});

export type Pokemon = z.infer<typeof pokemonSchema>;

export const pokemonUpdateSchema = pokemonSchema.omit({ id: true });

export type PokemonUpdate = z.infer<typeof pokemonUpdateSchema>;
