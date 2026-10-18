import './style.css';
import { createPokemon, deletePokemon, fetchPokemons, updatePokemon } from './api';
import type { Pokemon, PokemonInput } from './types/pokemon.types';

const FALLBACK_SPRITE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';

function getElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Missing element: ${selector}`);
  }

  return element;
}

const message = getElement<HTMLParagraphElement>('#message');
const form = getElement<HTMLFormElement>('#pokemon-form');
const formTitle = getElement<HTMLHeadingElement>('#form-title');
const idInput = getElement<HTMLInputElement>('input[name="id"]');
const submitButton = getElement<HTMLButtonElement>('#submit-button');
const cancelButton = getElement<HTMLButtonElement>('#cancel-button');
const list = getElement<HTMLUListElement>('#pokemon-list');

let pokemons: Pokemon[] = [];
let editedId: number | null = null;

// Messages

function showMessage(text: string, kind: 'success' | 'error'): void {
  message.textContent = text;
  message.className = kind;
}

async function run(action: () => Promise<void>, successText: string): Promise<void> {
  try {
    await action();
    showMessage(successText, 'success');
  } catch (error) {
    showMessage(error instanceof Error ? error.message : 'Unknown error.', 'error');
  }
}

// List

function createButton(label: string, action: 'edit' | 'delete', id: number): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  // The icon is drawn by the CSS: the label is shown on hover and read by screen readers
  button.className = `icon-button icon-${action}`;
  button.title = label;
  button.setAttribute('aria-label', label);
  button.dataset.action = action;
  button.dataset.id = String(id);
  return button;
}

function createPokemonItem(pokemon: Pokemon): HTMLLIElement {
  const item = document.createElement('li');
  item.className = 'pokemon-card';

  const actions = document.createElement('div');
  actions.className = 'card-actions';
  actions.append(
    createButton(`Edit ${pokemon.name}`, 'edit', pokemon.id),
    createButton(`Remove ${pokemon.name}`, 'delete', pokemon.id),
  );

  const image = document.createElement('img');
  image.src = pokemon.sprite;
  image.alt = pokemon.name;
  // If the sprite cannot be loaded, show a Poké Ball instead (once: no loop if it fails too)
  image.addEventListener('error', () => {
    image.src = FALLBACK_SPRITE;
    image.classList.add('fallback');
  }, { once: true });

  const number = document.createElement('p');
  number.className = 'number';
  number.textContent = `#${String(pokemon.id).padStart(3, '0')}`;

  const name = document.createElement('h3');
  name.textContent = pokemon.name;

  const types = document.createElement('div');
  types.className = 'types';

  for (const type of [pokemon.primaryType, pokemon.secondaryType]) {
    if (type) {
      const badge = document.createElement('span');
      badge.className = 'type';
      badge.dataset.type = type;
      badge.textContent = type;
      types.append(badge);
    }
  }

  const stats = document.createElement('dl');
  stats.className = 'stats';

  const statEntries: [string, number][] = [
    ['HP', pokemon.hp],
    ['Atk', pokemon.attack],
    ['Def', pokemon.defense],
    ['SpA', pokemon.specialAttack],
    ['SpD', pokemon.specialDefense],
    ['Spe', pokemon.speed],
  ];

  for (const [label, value] of statEntries) {
    const stat = document.createElement('div');
    const term = document.createElement('dt');
    term.textContent = label;
    const detail = document.createElement('dd');
    detail.textContent = String(value);
    stat.append(term, detail);
    stats.append(stat);
  }

  item.append(actions, image, number, name, types, stats);
  return item;
}

async function refreshList(): Promise<void> {
  pokemons = await fetchPokemons();
  list.replaceChildren(...pokemons.map(createPokemonItem));
}

// Form

function readForm(): PokemonInput {
  const data = new FormData(form);
  const text = (name: string) => String(data.get(name) ?? '').trim();
  const number = (name: string) => Number(data.get(name));

  return {
    name: text('name'),
    sprite: text('sprite'),
    primaryType: text('primaryType'),
    secondaryType: text('secondaryType') || null,
    hp: number('hp'),
    attack: number('attack'),
    defense: number('defense'),
    specialAttack: number('specialAttack'),
    specialDefense: number('specialDefense'),
    speed: number('speed'),
  };
}

function startEditing(pokemon: Pokemon): void {
  editedId = pokemon.id;
  message.textContent = '';

  for (const [key, value] of Object.entries(pokemon)) {
    const input = form.elements.namedItem(key);

    if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement) {
      input.value = value === null ? '' : String(value);
    }
  }

  idInput.readOnly = true;
  formTitle.textContent = `Edit ${pokemon.name}`;
  submitButton.textContent = 'Save';
  cancelButton.hidden = false;
}

function stopEditing(): void {
  editedId = null;
  form.reset();
  idInput.readOnly = false;
  formTitle.textContent = 'Add a Pokémon';
  submitButton.textContent = 'Add';
  cancelButton.hidden = true;
}

// Events

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = readForm();

  if (editedId === null) {
    const id = Number(idInput.value);

    await run(async () => {
      await createPokemon({ id, ...input });
      stopEditing();
      await refreshList();
    }, `${input.name} added.`);
  } else {
    const id = editedId;

    await run(async () => {
      await updatePokemon(id, input);
      stopEditing();
      await refreshList();
    }, `${input.name} updated.`);
  }
});

cancelButton.addEventListener('click', stopEditing);

// One listener on the list handles the clicks of every edit / remove button
list.addEventListener('click', async (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('button[data-action]');
  const pokemon = pokemons.find((item) => item.id === Number(button?.dataset.id));

  if (!button || !pokemon) {
    return;
  }

  if (button.dataset.action === 'edit') {
    startEditing(pokemon);
    return;
  }

  if (!confirm(`Remove ${pokemon.name}?`)) {
    return;
  }

  await run(async () => {
    await deletePokemon(pokemon.id);

    if (editedId === pokemon.id) {
      stopEditing();
    }

    await refreshList();
  }, `${pokemon.name} removed.`);
});

refreshList().catch(() => showMessage('API unreachable ❌', 'error'));
