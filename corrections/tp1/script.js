// Exercice 2
// Avec <script src="script.js"></script> dans le <head>, sans defer, le console.log affiche null :
// le script s'exécute avant que le <body> soit lu, donc #pokemon-form n'existe pas encore dans le DOM.
// Solution retenue : l'attribut defer sur la balise <script> (voir index.html).
const form = document.querySelector("#pokemon-form");
console.log("Form :", form);

// Exercice 5 et 6
function pushPokemonToLocalStorage(pokemon) {
  pokemon.id = crypto.randomUUID();

  const pokemons = JSON.parse(localStorage.getItem("pokemons")) ?? [];
  pokemons.push(pokemon);
  localStorage.setItem("pokemons", JSON.stringify(pokemons));
}

// Exercice 6
function removePokemonFromLocalStorage(id) {
  const pokemons = JSON.parse(localStorage.getItem("pokemons")) ?? [];
  const remainingPokemons = pokemons.filter((pokemon) => pokemon.id !== id);
  localStorage.setItem("pokemons", JSON.stringify(remainingPokemons));
}

// Exercice 7
function displayPokemons() {
  const pokemons = JSON.parse(localStorage.getItem("pokemons")) ?? [];
  const list = document.querySelector("#pokemon-list");

  list.innerHTML = "";

  pokemons.forEach((pokemon) => {
    const item = document.createElement("li");
    item.className = "pokemon-item";
    item.innerHTML = `
      <strong>${pokemon.name}</strong> (${pokemon.type})<br />
      PV: ${pokemon.hp}, Attaque: ${pokemon.attack}
      <button onclick="removePokemonFromLocalStorage('${pokemon.id}'); displayPokemons()">Supprimer</button>
      <img
        src="${pokemon.image_url}"
        alt="${pokemon.name}"
        onerror="this.src='https://www.pokepedia.fr/images/b/b1/Miniature_Pok%C3%A9_Ball_EV.png'"
      />
    `;
    list.appendChild(item);
  });
}

// Exercice 3 et 4
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Exercice 3
  console.log(document.querySelector("#name").value);

  // Exercice 4
  const fields = form.querySelectorAll("input, select");
  const pokemon = {};

  fields.forEach((field) => {
    pokemon[field.id] = field.value;
  });

  console.log(pokemon);

  // Exercice 5
  pushPokemonToLocalStorage(pokemon);

  // Exercice 7
  displayPokemons();
});

// Exercice 7 : affichage au chargement de la page
displayPokemons();
