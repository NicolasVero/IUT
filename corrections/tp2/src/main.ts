import './style.css';

const BASE_URL = "https://pokeapi.co/api/v2";

interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
}

interface Pokemon {
  id: number;
  name: string;
  sprites: { front_default: string };
  types: PokemonType[];
  stats: PokemonStat[];
}

async function fetchPokemon(name: string): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${name}`, { signal: AbortSignal.timeout(3000) });

  if (!response.ok) {
    throw new Error(`Pokémon "${name}" introuvable (HTTP ${response.status})`);
  }

  const data = await response.json() as Pokemon;
  return data;
}

function displayPokemon(pokemon: Pokemon): void {
  const container = document.querySelector("#pokemon-card-container") as HTMLDivElement;

  const types = pokemon.types.map((pokemonType) => pokemonType.type.name).join(", ");

  const stats = pokemon.stats
    .map((pokemonStat) => `<li><span>${pokemonStat.stat.name}</span><span>${pokemonStat.base_stat}</span></li>`)
    .join("");

  container.innerHTML = `
    <div class="pokemon-card">
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
      <h2>${pokemon.name} <small>#${pokemon.id}</small></h2>
      <p>Types : ${types}</p>
      <ul class="stats">
        ${stats}
      </ul>
    </div>
  `;
}

function showError(error: string): void {
  const container = document.querySelector("#pokemon-card-container") as HTMLDivElement;
  container.innerHTML = "";

  const paragraph = document.createElement("p");
  paragraph.className = "error";
  paragraph.textContent = error;
  container.appendChild(paragraph);
}

const form = document.querySelector("#search-form") as HTMLFormElement;
const searchInput = document.querySelector("#search-input") as HTMLInputElement;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = searchInput.value.toLowerCase();

  if (!query) return;

  const container = document.querySelector("#pokemon-card-container") as HTMLDivElement;
  container.innerHTML = `<p class="loading">Chargement...</p>`;

  try {
    const pokemon = await fetchPokemon(query);

    console.log(pokemon.name);
    console.log(pokemon.id);
    console.log(pokemon.sprites.front_default);
    console.log(pokemon.types);

    displayPokemon(pokemon);
  } catch (error: unknown) {
    if (error instanceof Error) {
      showError(error.message);
    }
  }
});
