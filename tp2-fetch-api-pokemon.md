# TP 2 : Fetch API, Promesses, API REST & Introduction à TypeScript

## Sommaire

- [TP 2 : Fetch API, Promesses, API REST \& Introduction à TypeScript](#tp-2--fetch-api-promesses-api-rest--introduction-à-typescript)
  - [Sommaire](#sommaire)
  - [Exercice 0 : Mise en place avec Vite et TypeScript](#exercice-0--mise-en-place-avec-vite-et-typescript)
  - [Exercice 1 : Structure du projet](#exercice-1--structure-du-projet)
  - [Exercice 2 : Premier appel `fetch`](#exercice-2--premier-appel-fetch)
  - [Exercice 3 : Paramétrer la fonction et gérer les erreurs HTTP](#exercice-3--paramétrer-la-fonction-et-gérer-les-erreurs-http)
  - [Exercice 4 : Recherche par nom](#exercice-4--recherche-par-nom)
  - [Exercice 5 : Afficher un Pokémon dans le DOM](#exercice-5--afficher-un-pokémon-dans-le-dom)
  - [Exercice 6 : Gestion des erreurs](#exercice-6--gestion-des-erreurs)
  - [Exercice 7 : Timeout de requête](#exercice-7--timeout-de-requête)

Au TP1, toutes les données venaient de l'utilisateur et vivaient dans le navigateur. Ici, elles viennent d'un **serveur distant** : il faut les demander, attendre la réponse, et composer avec le fait qu'elle peut ne jamais arriver. C'est tout l'enjeu de la programmation **asynchrone**. Ce TP introduit également **TypeScript** : un sur-ensemble typé de JavaScript qui détecte les erreurs avant l'exécution et documente le code par ses signatures de fonctions.

L'application à construire : une barre de recherche qui affiche la fiche complète d'un Pokémon (sprite, types, statistiques).

---

## Exercice 0 : Mise en place avec Vite et TypeScript

### Objectif

Initialiser un projet Vite avec le template TypeScript, comprendre la structure générée et lancer le serveur de développement.

### Instructions

1. Dans le terminal, créer un nouveau projet Vite en *Vanilla* avec le template *TypeScript* :

```bash
npm create vite@latest
cd pokedex
npm install
```

2. Ouvrir le dossier `pokedex` dans VS Code. La structure générée est la suivante :

```
pokedex/
├── index.html          ← point d'entrée HTML (à la racine)
├── package.json
├── tsconfig.json       ← configuration TypeScript
├── public/
└── src/
    ├── main.ts         ← point d'entrée TypeScript
    ├── style.css
    └── vite-env.d.ts   ← déclarations de types propres à Vite
```

3. Lancer le serveur de développement :

```bash
npm run dev
```

Vite démarre un serveur local (par défaut `http://localhost:5173`). Il transpile les fichiers `.ts` à la volée et recharge le navigateur automatiquement à chaque sauvegarde.

4. Ouvrir `tsconfig.json` et repérer les options clés :

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

`"strict": true` active un groupe de vérifications strictes : typage obligatoire des paramètres, détection des valeurs potentiellement `null`, interdiction des assertions non sûres. C'est le mode recommandé pour tout nouveau projet TypeScript.

5. Supprimer le contenu généré par défaut dans `src/main.ts` et `src/style.css` ainsi que le fichier `src/counter.ts`

<details>
<summary><strong>Cours : pourquoi TypeScript ?</strong></summary>

> ### Le problème de JavaScript
>
> JavaScript est **dynamiquement typé** : une variable peut contenir n'importe quelle valeur, et aucune erreur n'est signalée si l'on accède à une propriété inexistante, jusqu'à l'exécution.
>
> ```js
> function displayName(pokemon) {
>   console.log(pokemon.nane); // faute de frappe silencieuse
> }
> ```
>
> Cette erreur n'apparaît que quand la fonction est appelée, souvent chez l'utilisateur.
>
> ### Ce qu'apporte TypeScript
>
> TypeScript est un **sur-ensemble de JavaScript** : tout fichier `.js` valide est du TypeScript valide. Il ajoute une couche de **typage statique** analysée avant l'exécution :
>
> ```ts
> interface Pokemon { id: number; name: string; }
>
> function displayName(pokemon: Pokemon): void {
>   console.log(pokemon.nane);
>   //                   ^^^^
>   // Erreur TS2551 : Property 'nane' does not exist on type 'Pokemon'.
>   //                Did you mean 'name'?
> }
> ```
>
> L'erreur s'affiche dans VS Code à la frappe, avec une suggestion de correction. Le code ne peut pas compiler tant qu'elle n'est pas résolue.
>
> ### La transpilation
>
> TypeScript n'existe pas dans le navigateur. Vite le **transpile** vers JavaScript avant de l'envoyer au client :
>
> ```
> src/main.ts  →  Vite  →  JavaScript envoyé au navigateur
> ```
>
> Les annotations de type disparaissent entièrement dans le bundle final, elles n'ont aucun coût à l'exécution.
>
> ### Les avantages concrets
>
> | Avantage | Ce que cela change |
> | --- | --- |
> | **Autocomplétion précise** | VS Code connaît la forme de chaque objet et propose les bonnes propriétés |
> | **Erreurs à la frappe** | Les bugs de type sont détectés avant l'ouverture du navigateur |
> | **Refactoring sûr** | Renommer une propriété met à jour tous ses usages automatiquement |
> | **Documentation vivante** | Les types décrivent ce qu'une fonction attend et retourne, sans commentaire |

</details>

---

## Exercice 1 : Structure du projet

### 1. Fichier HTML

Remplacer le contenu du fichier `index.html` à la racine du projet (généré par Vite) par :

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>PokéAPI Explorer</title>
  </head>
  <body>
    <h1>PokéAPI Explorer</h1>

    <form id="search-form">
      <input
        type="text"
        id="search-input"
        placeholder="Nom ou numéro…"
        autocomplete="off"
      />
      <button type="submit">Rechercher</button>
    </form>

    <div id="pokemon-card-container"></div>

    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### 2. Feuille de style

Copier le contenu du fichier `styles.css` ci-dessous dans fourni dans `src/style.css`.
Importer cette feuille de style en première ligne de `src/main.ts` :

```ts
import './style.css';
```

<details>
<summary>style.css</summary>

```css
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap");

*,
*::before,
*::after {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

body {
	font-family: "Nunito", sans-serif;
	background: #f5f5f5;
	min-height: 100vh;
	padding: 32px 20px;
	color: #222;
}

h1 {
	font-size: 1.6rem;
	font-weight: 800;
	text-align: center;
	color: #cc0000;
	margin-bottom: 28px;
}

h2 {
	font-size: 1rem;
	font-weight: 700;
	color: #444;
	margin: 32px 0 14px;
	max-width: 1600px;
	margin-inline: auto;
	padding-inline: 4px;
}

/* ── Formulaire de recherche ── */
#search-form {
	display: flex;
	gap: 10px;
	max-width: 480px;
	margin: 0 auto 32px;
}

#search-input {
	flex: 1;
	padding: 10px 14px;
	border: 1.5px solid #ddd;
	border-radius: 8px;
	font-family: "Nunito", sans-serif;
	font-size: 0.95rem;
	background: #fff;
	color: #222;
	transition: border-color 0.15s;
}

#search-input:focus {
	outline: none;
	border-color: #cc0000;
}

button[type="submit"] {
	background: #cc0000;
	color: #fff;
	border: none;
	border-radius: 8px;
	padding: 10px 20px;
	font-family: "Nunito", sans-serif;
	font-size: 0.9rem;
	font-weight: 700;
	cursor: pointer;
	transition: background 0.15s;
	white-space: nowrap;
}

button[type="submit"]:hover {
	background: #aa0000;
}

/* ── Carte Pokémon unique ── */
#pokemon-card-container {
	max-width: 420px;
	margin: 0 auto 16px;
}

.pokemon-card {
	background: #fff;
	border-radius: 14px;
	padding: 24px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.09);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
}

.pokemon-card img {
	width: 120px;
	height: 120px;
	object-fit: contain;
	image-rendering: pixelated;
}

.pokemon-card h2 {
	font-size: 1.3rem;
	font-weight: 800;
	text-transform: capitalize;
	margin: 4px 0 0;
	color: #222;
}

.pokemon-card p {
	font-size: 0.85rem;
	color: #666;
	text-transform: capitalize;
}

.stats {
	list-style: none;
	width: 100%;
	margin-top: 8px;
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.stats li {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 0.85rem;
	background: #f5f5f5;
	border-radius: 6px;
	padding: 5px 10px;
	text-transform: capitalize;
}

.stats li span:last-child {
	font-weight: 800;
	color: #cc0000;
}

/* ── Bouton ajout au pokédex ── */
.btn-add {
	display: block;
	width: 100%;
	margin-top: 12px;
	background: #fff;
	color: #cc0000;
	border: 1.5px solid #cc0000;
	border-radius: 8px;
	padding: 10px 20px;
	font-family: "Nunito", sans-serif;
	font-size: 0.9rem;
	font-weight: 700;
	cursor: pointer;
	transition:
		background 0.15s,
		color 0.15s;
}

.btn-add:hover {
	background: #cc0000;
	color: #fff;
}

/* ── Chaîne d'évolution ── */
.pokemon-card .evolution-chain {
	width: 100%;
	margin-top: 12px;
	padding-top: 12px;
	border-top: 1.5px dashed #eee;
	text-align: center;
	font-size: 0.85rem;
	font-weight: 700;
	color: #444;
	text-transform: capitalize;
}

/* ── Message d'erreur / chargement ── */
.error {
	text-align: center;
	color: #cc0000;
	font-weight: 700;
	padding: 16px;
}

.loading {
	text-align: center;
	color: #888;
	font-style: italic;
	padding: 16px;
}

/* ── Liste Pokédex ── */
#pokemon-list {
	list-style: none;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10px;
	max-width: 640px;
	margin: 0 auto;
}

@media (min-width: 800px) {
	#pokemon-list {
		max-width: 1600px;
		grid-template-columns: repeat(3, 1fr);
	}
}

.pokemon-item {
	background: #fff;
	border-radius: 10px;
	padding: 12px;
	box-shadow: 0 1px 6px rgba(0, 0, 0, 0.07);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
	cursor: pointer;
	transition:
		transform 0.1s,
		box-shadow 0.1s;
}

.pokemon-item:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
}

.pokemon-item img {
	width: 80px;
	height: 80px;
	object-fit: contain;
	image-rendering: pixelated;
}

.pokemon-item p {
	font-size: 0.85rem;
	font-weight: 700;
	text-transform: capitalize;
	text-align: center;
}

/* ── Bouton de retrait du pokédex ── */
.btn-remove {
	margin-top: 6px;
	background: transparent;
	border: 1.5px solid #cc0000;
	color: #cc0000;
	border-radius: 6px;
	padding: 4px 12px;
	font-family: "Nunito", sans-serif;
	font-weight: 700;
	font-size: 0.75rem;
	cursor: pointer;
	transition:
		background 0.15s,
		color 0.15s;
}

.btn-remove:hover {
	background: #cc0000;
	color: #fff;
}

/* ── Pokédex vide ── */
#pokemon-list .loading {
	grid-column: 1 / -1;
	list-style: none;
}
```

</details>

### 3. Découvrir l'API

Avant d'écrire la moindre ligne de JS, ouvrir cette URL dans un onglet du navigateur :

```
https://pokeapi.co/api/v2/pokemon/pikachu
```

Repérer dans la réponse les propriétés `id`, `name`, `sprites`, `types` et `stats`. Les navigateurs affichent le JSON sous forme d'arbre repliable : c'est l'outil le plus rapide pour explorer une API que l'on ne connaît pas.

<details>
<summary><strong>Cours : ce qu'est une API REST</strong></summary>

> ### Le principe
>
> Une **API REST** est un serveur qui expose des données à des URL. On lui envoie une requête HTTP sur une URL précise, il répond par des données, le plus souvent au format **JSON**.
>
> Chaque URL désigne une **ressource** :
>
> ```
> https://pokeapi.co/api/v2/pokemon/pikachu    -> un Pokémon précis
> https://pokeapi.co/api/v2/pokemon?limit=20   -> une liste de 20 Pokémon
> https://pokeapi.co/api/v2/type/fire          -> le type Feu
> ```
>
> La partie après le `?` est la **query string** : des paramètres optionnels, sous la forme `clé=valeur`, séparés par des `&`.
>
> ### Le code de statut
>
> Toute réponse HTTP porte un code à trois chiffres qui résume ce qui s'est passé. Les familles à connaître :
>
> | Code  | Famille        | Signification                                       |
> | ----- | -------------- | --------------------------------------------------- |
> | `2xx` | Succès         | `200 OK` : la ressource est dans la réponse         |
> | `3xx` | Redirection    | La ressource se trouve ailleurs                     |
> | `4xx` | Erreur client  | `404 Not Found` : l'URL demandée n'existe pas       |
> | `5xx` | Erreur serveur | `500` : le serveur a échoué en traitant la demande  |
>
> La distinction `4xx` / `5xx` compte : une erreur `4xx` signifie « votre demande est fautive, la refaire à l'identique ne changera rien », une `5xx` signifie « le problème vient de nous, réessayer plus tard peut fonctionner ».
>
> ### JSON
>
> JSON (_JavaScript Object Notation_) est un format **texte** de représentation de données, dont la syntaxe est inspirée des objets JS. Déjà croisé au TP1 avec `JSON.stringify` et `JSON.parse` pour le `localStorage`.
>
> Deux différences avec un objet JS, sources d'erreurs quand on écrit du JSON à la main :
>
> - les clés sont **obligatoirement** entre guillemets doubles : `{ "name": "pikachu" }` ;
> - il n'existe ni fonction, ni commentaire, ni virgule finale.
>
> ### `type="module"` et le DOM
>
> Un script avec l'attribut `type="module"` est **différé par défaut** : il est téléchargé en parallèle et ne s'exécute qu'une fois le DOM entièrement construit. Plus besoin d'ajouter `defer` explicitement. C'est l'un des avantages des modules ES : pas de risque de s'exécuter avant que les éléments HTML n'existent.
>
> Avec Vite, le script est de plus un **module TypeScript** : l'import `import './style.css'` dans `main.ts` suffit à lier la feuille de style, sans balise `<link>` dans le HTML.

</details>

---

## Exercice 2 : Premier appel `fetch`

### Objectif

Dans `src/main.ts`, effectuer un appel réseau vers l'URL de Pikachu et explorer le résultat dans la console.

### Instructions

1. Créer une fonction `fetchPokemon()` qui appelle `fetch("https://pokeapi.co/api/v2/pokemon/pikachu")` et affiche le résultat dans la console. Appeler cette fonction. **Qu'affiche exactement la console ?**
2. Passer `fetchPokemon` en asynchrone (`async`) et placer `await` devant l'appel à `fetch`. Le résultat a changé : les données du Pokémon sont-elles pour autant accessibles ?
3. Utiliser la méthode `json()` sur la réponse pour obtenir les données, et les **retourner** depuis la fonction.
4. Depuis le code appelant, récupérer cet objet et afficher `pokemon.name` dans la console. Attention, une fonction `async` ne retourne pas directement sa valeur. Celle-ci doit être récupérer à l'aide de await.
5. **TypeScript** : Annoter le type de retour de `fetchPokemon` : `async function fetchPokemon(): Promise<unknown>`. Constater que VS Code signale une erreur sur `pokemon.name`, le type `unknown` interdit tout accès de propriété sans vérification préalable. Ce type sera affiné à l'exercice suivant.

<details>
<summary><strong>Cours : les Promesses, <code>fetch</code> et <code>async/await</code></strong></summary>

> ### Le problème que résout l'asynchrone
>
> Une requête réseau prend du temps : quelques dizaines de millisecondes dans le meilleur des cas, plusieurs secondes sur une connexion dégradée. Or JavaScript s'exécute sur un **fil unique** : s'il attendait la réponse sans rien faire, toute la page serait gelée pendant ce temps, plus de clic, plus de défilement, plus d'animation.
>
> La solution retenue : les opérations lentes ne retournent pas un résultat, mais une **promesse de résultat**. Le programme continue, et la valeur sera livrée plus tard.
>
> ### La Promesse
>
> Une `Promise` est un objet qui représente une valeur **future**. Elle se trouve toujours dans l'un de ces trois états :
>
> | État        | Signification                                  |
> | ----------- | ---------------------------------------------- |
> | `pending`   | L'opération est en cours                       |
> | `fulfilled` | L'opération a réussi, la valeur est disponible |
> | `rejected`  | L'opération a échoué avec une erreur           |
>
> C'est ce qu'affiche la console à l'étape 1 :
>
> ```js
> const resultat = fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
> console.log(resultat); // Promise { <pending> }
> ```
>
> La requête est bien partie, l'onglet **Réseau** le confirme, mais la ligne suivante s'exécute sans l'attendre.
>
> ### `await` : attendre la valeur
>
> `await` suspend l'exécution de la fonction jusqu'à ce que la Promesse soit résolue, puis en extrait la valeur. Le reste du programme, lui, n'est pas bloqué.
>
> Deux règles :
>
> - `await` ne s'utilise **qu'à l'intérieur** d'une fonction déclarée `async` ;
> - une fonction `async` retourne **toujours** une Promesse, même lorsqu'elle retourne une valeur ordinaire :
>
> ```js
> async function deux() {
>   return 2;
> }
>
> console.log(deux()); // Promise { 2 }   <- et non 2
> console.log(await deux()); // 2
> ```
>
> C'est le piège de l'étape 4 : pour lire ce que retourne une fonction `async`, il faut l'attendre, donc se trouver soi-même dans une fonction `async`. Le script a donc besoin d'un **point d'entrée asynchrone** : une fonction que l'on définit et que l'on appelle immédiatement.
>
> ### L'objet `Response`
>
> `fetch` résout sa Promesse avec un objet `Response`. Attention : cet objet représente la **réponse HTTP brute**. Il porte le code de statut, les en-têtes… mais **pas le corps décodé**.
>
> Pour obtenir les données, il faut appeler `response.json()`, qui lit le flux et le convertit en objet JS. Cette méthode est **elle aussi asynchrone** : elle retourne une Promesse.
>
> Une requête complète comporte donc **deux** attentes successives. Oublier la seconde est l'erreur la plus fréquente du TP : la console affiche alors `Promise { <pending> }` au lieu des données, et toute lecture de propriété donne `undefined`.
>
> ### L'ancienne syntaxe : `.then()`
>
> Avant `async/await`, on consommait les Promesses en chaînant des appels `.then()`. On rencontre encore très souvent cette écriture dans le code existant et les documentations :
>
> ```js
> fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
>   .then((response) => response.json())
>   .then((pokemon) => console.log(pokemon.name))
>   .catch((error) => console.error(error));
> ```
>
> Chaque `.then()` reçoit la valeur résolue de la Promesse précédente ; `.catch()` joue le rôle du `catch` de `try/catch`. Le résultat est fonctionnellement identique à la version `async/await`, mais l'imbrication des callbacks devient vite difficile à lire sur des chaînes longues, c'est le problème que `async/await` a été conçu pour résoudre. Ce TP utilise exclusivement `async/await`.

</details>

---

## Exercice 3 : Paramétrer la fonction et gérer les erreurs HTTP

### Objectif

Rendre la fonction réutilisable, puis découvrir le comportement de `fetch` face à une ressource inexistante.

### Instructions

1. **TypeScript** : Déclarer les interfaces décrivant la structure de la réponse.

```ts
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
```

Mettre à jour la signature de `fetchPokemon` pour retourner `Promise<Pokemon>`, et utiliser `as Pokemon` lors du décodage JSON :

```ts
async function fetchPokemon(name: string): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${name}`);
  // ...
  const data = await response.json() as Pokemon;
  return data;
}
```

Vérifier que VS Code propose maintenant l'autocomplétion sur les propriétés connues de notre objet.


2. Déclarer en haut du fichier une constante `BASE_URL` valant `"https://pokeapi.co/api/v2"`.
3. Modifier `fetchPokemon` pour qu'elle prenne le nom OU le numéro du Pokémon **en paramètre** et construise l'URL.
4. Afficher dans la console les informations suivantes :

   | Propriété      | Chemin dans l'objet JSON        |
   | -------------- | ------------------------------- |
   | Nom            | `pokemon.name`                  |
   | Numéro         | `pokemon.id`                    |
   | Sprite (image) | `pokemon.sprites.front_default` |
   | Types          | `pokemon.types` (tableau)       |

5. Remplacer `"pikachu"` par `"aaaaa"`. **Le code plante-t-il là où vous l'attendiez ?** Relever le message d'erreur exact.
6. Ouvrir l'onglet **Réseau** des outils de développement et relever le code de statut renvoyé par l'API.
7. Faire en sorte que `fetchPokemon` interrompe son exécution avec une erreur explicite lorsque le Pokémon n'existe pas, en s'appuyant sur `response.ok`.


<details>
<summary><strong>Cours : <code>fetch</code> et les erreurs HTTP</strong></summary>

> ### Le piège central de `fetch`
>
> `fetch` ne rejette sa Promesse que pour les **erreurs réseau** : pas de connexion, DNS introuvable, serveur injoignable, requête bloquée par le navigateur.
>
> Un code `404` ou `403` n'en fait **pas** partie. De son point de vue, l'échange s'est parfaitement déroulé : la requête est partie, le serveur a répondu. Que cette réponse soit une erreur relève de l'application, pas du transport. On obtient donc un objet `Response` parfaitement valide :
>
> ```js
> response.ok; // false, true uniquement si le statut est entre 200 et 299
> response.status; // 404
> response.statusText; // "Not Found"
> ```
>
> Pire : `response.json()` fonctionne quand même. Il retourne le corps de la réponse d'erreur, sans aucun rapport avec ce que l'on attendait.
>
> ### Pourquoi le symptôme est déroutant
>
> Rien n'échoue au moment du `fetch`. L'erreur ne survient que bien plus loin, quand on tente de lire une propriété sur des données qui n'existent pas :
>
> ```
> TypeError: Cannot read properties of undefined (reading 'front_default')
> ```
>
> C'est exactement la même famille d'erreur qu'au TP1 avec `querySelector` renvoyant `null` : l'appel qui échoue ne prévient pas, c'est son résultat qui pose problème plusieurs lignes plus loin. Le réflexe à prendre est le même, remonter du symptôme vers l'appel qui a produit la valeur fautive.
>
> ### Interrompre une fonction avec `throw`
>
> `throw` lève une erreur : la fonction s'arrête immédiatement, le code qui suit n'est jamais exécuté, et l'erreur remonte à l'appelant.
>
> ```js
> function racine(n) {
>   if (n < 0) throw new Error("Nombre négatif");
>   return Math.sqrt(n); // inatteignable si n < 0
> }
> ```
>
> `new Error(message)` construit un objet portant deux propriétés utiles : `error.message`, la chaîne passée au constructeur, et `error.stack`, la pile d'appels.
>
> Dans une fonction `async`, `throw` revient à **rejeter** la Promesse retournée. Non rattrapée, elle produit dans la console un `Uncaught (in promise) Error` : visible pour le développeur, totalement invisible pour l'utilisateur. Le rattrapage propre est l'objet de l'exercice 6.
>
> ### Soigner le message
>
> Un bon message d'erreur contient ce qui a été demandé **et** ce qui s'est passé. `"Erreur"` n'aide personne ; `` `Pokémon "${name}" introuvable (HTTP ${response.status})` `` se lit directement dans la console et peut être affiché tel quel à l'utilisateur.

</details>

<details>
<summary><strong>Cours : interfaces TypeScript et typage des réponses d'API</strong></summary>

> ### Les interfaces
>
> Une `interface` TypeScript décrit la **forme** d'un objet : quelles propriétés il possède et quels types elles ont. C'est une déclaration pure, elle n'existe pas à l'exécution et ne génère aucun code JavaScript.
>
> ```ts
> interface Point {
>   x: number;
>   y: number;
> }
>
> function distance(a: Point, b: Point): number {
>   return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
> }
> ```
>
> ### Typer une réponse d'API
>
> `response.json()` retourne `Promise<any>` : TypeScript n'a aucun moyen de deviner la forme des données. On utilise une **assertion de type** pour indiquer manuellement ce que l'API retourne :
>
> ```ts
> const data = await response.json() as Pokemon;
> ```
>
> Les interfaces ne **valident pas** les données à l'exécution. Si l'API retourne un champ différent de ce qu'on attend, TypeScript ne le détectera pas. Les types décrivent une forme attendue ; c'est au développeur de s'assurer que l'API respecte ce contrat.
>
> ### Les tableaux typés
>
> `PokemonType[]` est un tableau dont chaque élément est de type `PokemonType`. Notation équivalente : `Array<PokemonType>`. La notation `[]` est plus courante pour les types simples.

</details>

---

## Exercice 4 : Recherche par nom

### Objectif

Connecter le formulaire `#search-form` à la logique de recherche.

### Instructions

1. Écouter l'événement `submit` du formulaire et empêcher le rechargement de la page. **TypeScript** : le paramètre `event` est automatiquement inféré comme `SubmitEvent`, vérifier en survolant la variable dans VS Code.
2. Lire la valeur de `#search-input` en la convertissant en minuscules à l'aide de la méthode `toLowerCase()`.
3. Si le champ n'est pas vide, récupérer le Pokémon correspondant grâce à `fetchPokemon` et afficher son nom dans la console. Tester avec `"bulbasaur"` et `"25"`.
4. Etant donné que notre écouteur d'événement n'est pas asynchrone, nous ne recevons que la Promesse émise lors de l'appel API. Changer l'écouteur d'événement en fonction asynchrone.

<details>
<summary><strong>Cours : <code>async</code> dans un écouteur d'événement</strong></summary>

> ### Un écouteur peut être `async`
>
> La fonction passée à `addEventListener` est une fonction comme une autre : elle peut être déclarée `async`, ce qui autorise `await` à l'intérieur.
>
> ```js
> bouton.addEventListener("click", async () => {
>   const donnees = await chargerQuelqueChose();
>   afficher(donnees);
> });
> ```
>
> Le navigateur, lui, n'attend pas : il appelle la fonction, récupère la Promesse qu'elle retourne… et l'ignore. C'est sans conséquence ici, mais cela a une implication importante : **le navigateur ne rattrapera jamais une erreur survenue dans un écouteur `async`**. C'est l'objet de l'exercice 6.
>
> ### Attention à `preventDefault()`
>
> Le comportement par défaut doit être annulé **avant** tout `await`. Une fois la fonction suspendue, le navigateur a déjà repris la main et décidé quoi faire de l'événement : appeler `preventDefault()` après un `await` n'a plus aucun effet.
>
> ```js
> form.addEventListener("submit", async (event) => {
>   const data = await charger(); // le formulaire est déjà parti
>   event.preventDefault(); // trop tard
> });
> ```
>
> ### Sortir tôt d'une fonction
>
> Le cas « champ vide » se traite par un retour anticipé, plutôt qu'en imbriquant tout le reste dans un `if` :
>
> ```js
> if (!query) return;
> ```
>
> `!query` est vrai pour `""` : une chaîne vide est _falsy_, au même titre que `0`, `null`, `undefined` et `NaN`.

</details>

--- 

## Exercice 5 : Afficher un Pokémon dans le DOM

### Objectif

Créer une fonction `displayPokemon(pokemon: Pokemon): void` qui reçoit un objet Pokemon et construit sa fiche dans `#pokemon-card-container` à l'aide de `innerHTML`.

### Structure attendue

```html
<div class="pokemon-card">
  <img src="URL_DU_SPRITE" alt="NOM" />
  <h2>NOM <small>#NUMÉRO</small></h2>
  <p>Types : feu, vol</p>
  <ul class="stats">
    <li><span>hp</span><span>78</span></li>
    <!-- … les 6 statistiques -->
  </ul>
</div>
```

### Instructions

1. Construire la liste des types sous forme de chaîne lisible (`"feu, vol"`) à partir du tableau `pokemon.types`.
2. Construire les six `<li>` de statistiques à partir du tableau `pokemon.stats`.
3. Insérer l'ensemble dans `#pokemon-card-container`.
4. Tester en appelant `displayPokemon` avec le résultat de `fetchPokemon("charizard")`.

<details>
<summary><strong>Cours : naviguer dans un JSON imbriqué et générer du HTML</strong></summary>

> ### Lire une structure imbriquée
>
> Les API REST renvoient rarement des données plates. Chez PokéAPI, un type n'est pas une chaîne mais un objet, lui-même contenu dans un objet, lui-même dans un tableau :
>
> ```js
> pokemon.types;
> // [ { slot: 1, type: { name: "fire", url: "…" } },
> //   { slot: 2, type: { name: "flying", url: "…" } } ]
> ```
>
> Cette forme n'est pas gratuite : chaque `type` porte une `url`, ce qui permet d'aller chercher la ressource complète du type. C'est le principe même d'une API REST, les ressources se référencent entre elles par leur URL, comme des liens hypertexte.
>
> Même logique pour les statistiques :
>
> ```js
> pokemon.stats;
> // [ { base_stat: 78, effort: 0, stat: { name: "hp", url: "…" } }, … ]
> ```
>
> Le réflexe à prendre : ouvrir l'URL dans le navigateur et **lire la structure** avant d'écrire le chemin d'accès. Un `console.log(pokemon.stats[0])` bien placé fait gagner dix minutes.
>
> ### Transformer un tableau en chaîne
>
> `map` produit un nouveau tableau en appliquant une fonction à chaque élément ; `join` assemble un tableau en une chaîne, avec un séparateur :
>
> ```js
> const utilisateurs = [{ nom: "Ada" }, { nom: "Alan" }];
>
> utilisateurs.map((u) => u.nom); // ["Ada", "Alan"]
> utilisateurs.map((u) => u.nom).join(", "); // "Ada, Alan"
> ```
>
> Le même couple sert à générer du HTML, en joignant cette fois sur une chaîne vide pour ne rien intercaler :
>
> ```js
> const html = utilisateurs.map((u) => `<li>${u.nom}</li>`).join("");
> // "<li>Ada</li><li>Alan</li>"
> ```
>
> Sans le `.join("")`, l'insertion d'un tableau dans un template literal produit des virgules parasites entre les éléments : `<li>Ada</li>,<li>Alan</li>`.
>
> ### `innerHTML` ou `createElement` ?
>
> Les deux approches vues au TP1 restent valables, et se combinent très bien :
>
> - `innerHTML` avec un template literal est le plus lisible pour un bloc statique de plusieurs balises ;
> - `createElement` devient indispensable dès qu'il faut attacher un écouteur d'événement à l'élément créé.
>
> Le risque d'`innerHTML` reste le même : la chaîne est **interprétée** comme du HTML. Ici les données viennent d'une API publique et non de l'utilisateur, le risque est donc faible, mais l'habitude à prendre est de se poser la question à chaque usage. Une API tierce n'est pas une source de confiance absolue.
>
> ### Le piège de l'accumulation
>
> Comme au TP1 : `displayPokemon` sera appelée à chaque recherche. Si la fonction se contente d'ajouter, les fiches s'empilent. Le conteneur doit être vidé avant d'être rempli.

</details>

---

## Exercice 6 : Gestion des erreurs

### Objectif

Aucune erreur ne doit remonter à l'utilisateur sous forme de page figée ou de console rouge.

### Instructions

1. Créer une fonction `showError(error: string): void` qui vide `#pokemon-card-container` et y insère un `<p class="error">` contenant le message.
2. Rattraper l'erreur levée par `fetchPokemon` dans l'écouteur du formulaire, et appeler `showError` avec le message de l'erreur.
3. Tester avec `"missingno"`, puis avec `"xxxxxxxxx"`.
4. Afficher un `<p class="loading">Chargement...</p>` dans le conteneur **avant** de lancer la requête. Vérifier qu'il est bien remplacé dans les deux cas, succès comme erreur.
5. Simuler une panne de réseau : dans l'onglet **Réseau**, passer le débit sur _Offline_, puis relancer une recherche. Le message affiché est-il satisfaisant pour l'utilisateur ?

<details>
<summary><strong>Cours : <code>try/catch</code> avec <code>async/await</code></strong></summary>

> ### Le principe
>
> `try/catch` délimite une zone de code où une erreur est attendue et prise en charge :
>
> ```ts
> try {
>   // code susceptible d'échouer
> } catch (error: unknown) {
>   if (error instanceof Error) {
>     console.error(error.message);
>   }
>   // exécuté uniquement si une erreur a été levée
> }
> ```
>
> Dès qu'une ligne du `try` lève une erreur, **les suivantes sont abandonnées** et l'exécution saute directement dans le `catch`. C'est précisément la garantie recherchée ici : ne jamais tenter d'afficher un Pokémon qui n'a pas pu être récupéré.
>
> ### Ce que `catch` intercepte
>
> Un seul `catch` couvre toute la chaîne d'appels placée dans le `try`, quelle que soit la profondeur à laquelle l'erreur est survenue :
>
> - les erreurs réseau, levées par `fetch` lui-même ;
> - les erreurs levées manuellement avec `throw new Error(...)` à l'exercice 3 ;
> - les erreurs de programmation ordinaires, une `TypeError` sur une propriété d'`undefined`, par exemple.
>
> Ce dernier point mérite attention : un `catch` trop large peut **masquer un bug** en le présentant comme un message d'erreur métier. Si `showError` affiche `"Cannot read properties of undefined"`, ce n'est pas un problème d'API, c'est un bug dans le code.
>
> ### `await` et `try/catch`
>
> Sans `await`, l'erreur n'est pas rattrapée : la Promesse est rejetée après que le bloc `try` a été quitté.
>
> ```js
> try {
>   const p = fonctionAsync(); // pas de await : le try se termine aussitôt
> } catch (error) {
>   // ne se déclenchera jamais
> }
> ```
>
> Piège fréquent, et silencieux : le code semble protégé alors qu'il ne l'est pas.
>
> ### Le bloc `finally`
>
> Un troisième bloc, optionnel, s'exécute **dans tous les cas**, succès comme erreur. Il sert au nettoyage : réactiver un bouton, masquer un indicateur, fermer une connexion.
>
> ```js
> bouton.disabled = true;
> try {
>   // …
> } catch (error) {
>   // …
> } finally {
>   bouton.disabled = false; // quoi qu'il arrive
> }
> ```

</details>

---

## Exercice 7 : Timeout de requête

### Objectif

Constater qu'une requête `fetch` peut rester en suspens indéfiniment, puis limiter son temps d'attente avec `AbortSignal.timeout()`.

### Instructions

1. Dans l'onglet **Réseau** des outils de développement, créer un profil réseau personnalisé : latence **5 000 ms**, débit descendant **1 kb/s**. L'activer, lancer une recherche et observer combien de temps le message « Chargement… » reste affiché.

2. `fetch` ne propose aucun timeout natif. Passer l'option `signal` pour définir une limite de 3 secondes :

```ts
const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
```

3. Quand le délai expire, `fetch` lève une erreur. Erreur qui sera attrapée par notre bloc `try/catch` autour de l'appel API.

4. Tester avec le profil lent : le message de timeout doit apparaître au bout de 3 secondes. Passer ensuite en mode **Offline** : l'erreur obtenue est-elle la même ?

<details>
<summary><strong>Cours : <code>AbortSignal.timeout()</code> et annulation de requête</strong></summary>

> ### `AbortSignal.timeout(ms)`
>
> `AbortSignal.timeout(ms)` crée un signal qui s'annule automatiquement après le délai donné. `fetch` surveille ce signal et abandonne la requête dès qu'il se déclenche, même si la réponse était en route.
>
> ### Ce que lève le timeout
>
> L'expiration **rejette la Promesse** avec une erreur dont `name` identifie la cause :
>
> | Situation | `error.name` |
> | --- | --- |
> | Délai dépassé (`AbortSignal.timeout`) | `"TimeoutError"` |
> | Erreur réseau (Offline, DNS…) | `"TypeError"` |
> | Pokémon introuvable (HTTP 404) | `"Error"` (levée manuellement à l'exo 3) |

</details>
