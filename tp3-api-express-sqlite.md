# TP3 : API REST TypeScript avec Express et SQLite

## Sommaire

- [Objectif](#objectif)
- [Exercice 0 : Comprendre l'architecture et préparer les projets](#exercice-0--comprendre-larchitecture-et-préparer-les-projets)
- [Exercice 1 : Premier serveur Express](#exercice-1--premier-serveur-express)
- [Exercice 2 : Lire des Pokémon stockés en mémoire](#exercice-2--lire-des-pokémon-stockés-en-mémoire)
- [Exercice 3 : Enregistrer les données dans SQLite](#exercice-3--enregistrer-les-données-dans-sqlite)
- [Exercice 4 : Créer un Pokémon dans SQLite](#exercice-4--créer-un-pokémon-dans-sqlite)
- [Exercice 5 : Valider les données avec Zod](#exercice-5--valider-les-données-avec-zod)
- [Exercice 6 : Découper le code en routes, controllers et services](#exercice-6--découper-le-code-en-routes-controllers-et-services)
- [Exercice 7 : Modifier et supprimer un Pokémon](#exercice-7--modifier-et-supprimer-un-pokémon)
- [Exercice 8 : Construire le front du Pokédex](#exercice-8--construire-le-front-du-pokédex)

## Objectif

Au TP2, vous avez consommé la PokéAPI avec `fetch`. Cette fois, vous allez passer de l'autre côté : construire **votre propre API**, qui stocke **votre Pokédex**, et une page Vite qui l'utilise. À la fin du TP, cette page permettra d'afficher, d'ajouter, de modifier et de supprimer les Pokémon de votre Pokédex.

Chaque Pokémon de votre Pokédex est décrit par les informations de la fiche du TP2 :

| Champ | Exemple | Description |
| --- | --- | --- |
| `id` | `25` | Numéro dans le Pokédex national |
| `name` | `pikachu` | Nom en minuscules |
| `sprite` | `https://…/25.png` | URL de l'image |
| `primaryType` | `electric` | Type principal |
| `secondaryType` | `null` | Type secondaire, ou `null` si inexistant |
| `hp`, `attack`, `defense`, `specialAttack`, `specialDefense`, `speed` | `35`, `55`... | Les six statistiques de base |


À la fin du TP, l'API offrira ce CRUD complet :

| Action | Méthode | URL | Réponse attendue |
| --- | --- | --- | --- |
| Lister | `GET` | `/api/pokemons` | Tous les Pokémon |
| Lire | `GET` | `/api/pokemons/:id` | Un Pokémon |
| Créer | `POST` | `/api/pokemons` | Le Pokémon créé (`201`), ou un conflit s'il existe déjà (`409`) |
| Modifier | `PUT` | `/api/pokemons/:id` | Le Pokémon modifié |
| Supprimer | `DELETE` | `/api/pokemons/:id` | Aucun contenu (`204`) |

---

## Exercice 0 : Comprendre l'architecture et préparer les projets

### Objectif

Identifier le rôle du front Vite, de l'API Express et de la base de données, puis créer les deux projets.

### Architecture finale

```text
Vite (port 5173) ----- sert la page -----> Navigateur
                                               |
                                               | fetch('http://localhost:3000/api/pokemons')
                                               v
                                   Express (port 3000) -- SQL --> server/data/pokedex.db
```

Vite ne fait que fournir la page (HTML, CSS, TypeScript) au navigateur. Ensuite, c'est le navigateur qui appelle directement l'API, sur un **autre port**.

Le TP contient **deux projets indépendants**, rangés dans le même dossier :

```text
tp3/
├── server/   <- le back : l'API Express (Node.js), avec son propre package.json
├── src/      <- le front : le code TypeScript exécuté dans le navigateur
├── index.html
└── package.json   <- le package.json du front (Vite)
```

- Le **back** (`server/`) reçoit les requêtes HTTP et gère les données. Il peut fonctionner seul, sans le front.
- Le **front** (la racine, avec `src/`) affiche une page dans le navigateur et appelle l'API avec `fetch`, exactement comme votre page du TP2 appelait la PokéAPI.

Chaque projet a son propre `package.json`, ses propres dépendances (`node_modules`) et se lance dans son propre terminal.

### 1. Créer le projet Vite (le front)

Dans le dossier qui contient vos TP, créer un projet Vite :

```bash
npm create vite@latest tp3 -- --template vanilla-ts --no-install
cd tp3
npm install
```

Supprimer le contenu de `src/main.ts` et le fichier `src/counter.ts`.

### 2. Créer le projet `server` (le back)

Toujours dans `tp3`, créer le dossier `server` et y initialiser un second projet Node.js :

```bash
mkdir server
cd server
npm init -y
```

`npm init -y` crée un fichier `server/package.json` avec des valeurs par défaut. Ouvrir ce fichier et :

1. ajouter la ligne `"type": "module"` (ou remplacer `"type": "commonjs"` si elle existe déjà) ;
2. remplacer le bloc `"scripts"` par :

```json
"scripts": {
  "dev": "tsx watch index.ts",
  "typecheck": "tsc"
},
```

Installer ensuite les paquets, **depuis le dossier `server`** :

```bash
npm install express
npm install -D typescript tsx @types/express @types/node
```

| Paquet | Rôle |
| --- | --- |
| `express` | Le framework qui crée le serveur HTTP |
| `typescript` | Le compilateur, utilisé ici pour vérifier les types (`npm run typecheck`) |
| `tsx` | Exécute directement un fichier `.ts` avec Node.js, et le relance à chaque modification (`watch`) |
| `@types/express`, `@types/node` | Les types TypeScript d'Express et de Node.js |

L'option `-D` installe un paquet en **dépendance de développement** : il sert à écrire et vérifier le code, pas à le faire tourner en production.

Créer le fichier `server/tsconfig.json` :

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["node"],
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["."]
}
```

### 3. Préparer les tests de l'API

Dans VS Code, installer l'extension **REST Client** (éditeur : Huachao Mao). Elle permet d'envoyer des requêtes HTTP depuis un simple fichier texte, y compris des `POST`, `PUT` et `DELETE` qu'un navigateur ne sait pas envoyer depuis la barre d'adresse.

Créer le fichier `server/requests.http` :

```http
@baseUrl = http://localhost:3000/api

### Check that the server responds
GET {{baseUrl}}/health
```

Un lien **Send Request** apparaît au-dessus de chaque requête. Vous compléterez ce fichier tout au long du TP : il deviendra la liste de tous les tests de votre API.

Chaque requête doit être précédée d'une ligne qui commence par `###`. Ce n'est pas un simple titre : c'est le **séparateur** entre deux requêtes. Sans lui, REST Client considère que tout le fichier forme une seule requête, et n'affiche qu'un seul lien **Send Request**. Le texte après `###` est facultatif et sert seulement à nommer la requête.

> **Attention** : ne pas envoyer cette requête tout de suite. L'API n'existe pas encore (vous l'écrirez à l'exercice 1) : REST Client afficherait « The connection was rejected… ». C'est l'erreur que vous obtiendrez chaque fois que l'API n'est pas lancée.

> À ce stade, votre dossier contient au moins ces éléments.
>
> ```text
> tp3/
> ├── node_modules/          <- dépendances du front
> ├── server/
> │   ├── node_modules/      <- dépendances du back
> │   ├── package.json
> │   ├── requests.http
> │   └── tsconfig.json
> ├── src/
> │   ├── main.ts
> │   └── style.css
> ├── index.html
> ├── package.json
> └── tsconfig.json
> ```

<details>
<summary><strong>Cours : une API REST en pratique</strong></summary>

> Une API REST expose des **ressources** à des URLs. Ici, la ressource est un Pokémon :
>
> ```text
> /api/pokemons       -> la collection de Pokémon
> /api/pokemons/25    -> le Pokémon dont l'identifiant est 25 (Pikachu)
> ```
>
> La méthode HTTP indique l'intention :
>
> | Méthode | Intention |
> | --- | --- |
> | `GET` | Lire une ou plusieurs ressources |
> | `POST` | Créer une ressource |
> | `PUT` | Remplacer une ressource existante |
> | `DELETE` | Supprimer une ressource |
>
> L'URL identifie donc la ressource ; la méthode décrit l'action. Éviter des URLs comme `/api/createPokemon` : l'action est déjà portée par `POST`.
>
> Chaque réponse porte un **code de statut** qui résume le résultat :
>
> | Code | Signification |
> | --- | --- |
> | `200 OK` | Tout s'est bien passé |
> | `201 Created` | Une ressource a été créée |
> | `204 No Content` | Succès, mais rien à renvoyer |
> | `400 Bad Request` | La requête du client est invalide |
> | `404 Not Found` | La ressource n'existe pas |
> | `409 Conflict` | La requête entre en conflit avec l'état actuel (par exemple, la ressource existe déjà) |

</details>

---

## Exercice 1 : Premier serveur Express

### Objectif

Écrire le plus petit serveur Express possible : une route qui répond seulement avec le statut `200`. Puis vérifier que le front arrive à la joindre.

### 1. Une route qui répond « OK »

Créer le fichier `server/index.ts` :

```ts
import express from 'express';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.get('/api/health', (_request, response) => {
  return response.sendStatus(200);
});

app.listen(port, () => {
  console.log(`API available at http://localhost:${port}`);
});
```

Dans un terminal placé dans le dossier `server`, lancer l'API :

```bash
npm run dev
```

Le terminal doit afficher `API available at http://localhost:3000`. Laisser ce terminal ouvert : l'API doit tourner pendant tout le TP.

### 2. Observer la réponse

1. Dans `server/requests.http`, cliquer sur **Send Request** au-dessus de `GET {{baseUrl}}/health`. Observer la première ligne de la réponse : `HTTP/1.1 200 OK`. Si REST Client affiche « The connection was rejected », vérifier que le terminal de l'API affiche bien `API available at http://localhost:3000`.
2. Ouvrir `http://localhost:3000/api/health` dans le navigateur, puis l'onglet **Réseau** des outils de développement (F12). Retrouver la requête et son statut.
3. Remplacer temporairement `200` par `404`, enregistrer, et refaire les deux tests. Remettre ensuite `200`.

### 3. Répondre avec du JSON

Une API renvoie en général des données. Ajouter une route `GET /api/about` qui retourne l'objet suivant avec `response.json(...)` :

```ts
{ name: 'Pokemon API', version: 1 }
```

Ajouter la requête correspondante dans `requests.http`, sans oublier le séparateur `###`, puis la tester :

```http
### API information
GET {{baseUrl}}/about
```

<details>
<summary><strong>Cours : requête et réponse Express</strong></summary>

> Une route Express associe une **méthode** et une **URL** à une fonction. Cette fonction reçoit deux objets :
>
> - `request` contient ce que le client a envoyé (URL, paramètres, corps…) ;
> - `response` sert à construire la réponse.
>
> ```ts
> app.get('/foo', (request, response) => {
>   return response.json({ message: 'Hello World' });
> });
> ```
>
> - `response.sendStatus(200)` envoie uniquement un statut (avec son libellé `OK` comme corps, en texte brut).
> - `response.json(...)` transforme l'objet JavaScript en JSON, ajoute l'en-tête `Content-Type: application/json` et renvoie par défaut le statut `200`.
> - `response.status(404).json(...)` choisit un autre statut avant d'envoyer le JSON.
>
> **Règle du TP : on répond toujours avec `return response`.** Le `return` arrête la fonction dès que la réponse est envoyée. C'est indispensable dès qu'une fonction peut répondre de plusieurs façons (une erreur `400`, une erreur `404`, ou le résultat) : sans `return`, la fonction continuerait après la première réponse et tenterait d'en envoyer une deuxième. Express afficherait alors dans le terminal l'erreur `Cannot set headers after they are sent to the client`.
>
> Le `return` sert uniquement à arrêter la fonction : Express ignore la valeur renvoyée.
>
> Le préfixe `_` dans `_request` indique que le paramètre n'est pas utilisé.

</details>

### 4. Côté front : afficher l'état de l'API

Ouvrir un **deuxième terminal**, à la racine de `tp3` (et non dans `server`), et lancer Vite :

```bash
npm run dev
```

Dans `src/main.ts`, écrire une fonction `checkApi(): Promise<void>` qui appelle `GET /api/health` avec `fetch`, comme au TP2, puis :

- affiche « API connected ✅ » dans la console si `response.ok` est vrai ;
- affiche « API unreachable ❌ » sinon.

Attention : `fetch` ne renvoie une réponse que si la requête a abouti. Si elle n'a pas pu aboutir (API arrêtée, réseau coupé, requête bloquée par le navigateur), `fetch` **lève une erreur** : il faut donc aussi l'intercepter avec `try/catch` pour afficher « API unreachable ❌ ».

Déclarer l'adresse de l'API dans une constante en haut du fichier : vous la réutiliserez dans tout le TP.

```ts
const API_URL = 'http://localhost:3000/api';
```

Attention : `/api/health` renvoie du texte (`OK`), pas du JSON. Inutile d'appeler `response.json()` : seul le statut nous intéresse.

<details>
<summary><strong>Besoin d'aide ?</strong></summary>

```ts
const API_URL = 'http://localhost:3000/api';

async function checkApi(): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/health`);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    console.log('API connected ✅');
  } catch (error) {
    console.error('API unreachable ❌', error);
  }
}

checkApi();
```

</details>

Ouvrir la page (`http://localhost:5173`). Alors que l'API tourne, la console affiche « API unreachable ❌ ». C'est normal, et c'est l'objet de l'étape suivante.

### 5. Comprendre l'erreur CORS

1. Ouvrir la **console** des outils de développement (F12). Un message rouge ressemble à ceci :

```text
Access to fetch at 'http://localhost:3000/api/health' from origin 'http://localhost:5173'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
on the requested resource.
```

2. Dans l'onglet **Réseau**, retrouver la requête `health` : elle est marquée comme une erreur CORS.
3. Envoyer de nouveau `GET {{baseUrl}}/health` depuis `requests.http`, puis ouvrir `http://localhost:3000/api/health` dans un onglet : les deux fonctionnent.

**Question** : la même requête fonctionne dans REST Client et dans la barre d'adresse, mais pas depuis la page. Qui bloque : le serveur ou le navigateur ?

C'est le **navigateur**. La page vient de l'origine `http://localhost:5173`, et elle essaie de lire une réponse venant d'une autre origine, `http://localhost:3000`. Par sécurité, le navigateur ne le permet que si le serveur l'autorise explicitement, avec l'en-tête `Access-Control-Allow-Origin`. Notre API n'envoie pas cette en-tête : le navigateur cache donc la réponse au script.

### 6. Autoriser le front avec `cors`

Arrêter l'API (Ctrl+C dans son terminal), puis, dans le dossier `server`, installer le middleware `cors` et ses types :

```bash
npm install cors
npm install -D @types/cors
```

Dans `server/index.ts`, ajouter l'import en haut du fichier :

```ts
import cors from 'cors';
```

Puis, juste après `const app = express();`, autoriser l'origine du front :

```ts
app.use(cors({ origin: 'http://localhost:5173' }));
```

Relancer l'API avec `npm run dev`, puis recharger la page : la console affiche « API connected ✅ ».

Dans l'onglet **Réseau**, cliquer sur la requête `health` et observer les **en-têtes de réponse** : `Access-Control-Allow-Origin: http://localhost:5173` est apparu.

Attention : l'origine doit correspondre **exactement**. Si Vite démarre sur un autre port ou si vous ouvrez la page avec `http://127.0.0.1:5173`, l'erreur CORS revient.

<details>
<summary><strong>Cours : origine, same-origin policy et CORS</strong></summary>

> Une **origine**, c'est la combinaison **protocole + domaine + port**. `http://localhost:5173` et `http://localhost:3000` sont deux origines différentes, uniquement à cause du port.
>
> Par défaut, le navigateur applique la **same-origin policy** : le JavaScript d'une page ne peut pas lire les réponses d'une autre origine. Cette règle protège l'utilisateur : sans elle, n'importe quel site ouvert dans votre navigateur pourrait interroger votre webmail ou votre banque avec vos cookies, et lire les réponses.
>
> **CORS** (*Cross-Origin Resource Sharing*) permet à un serveur d'assouplir cette règle, en indiquant dans ses réponses quelles origines ont le droit de les lire :
>
> ```text
> Access-Control-Allow-Origin: http://localhost:5173
> ```
>
> Au TP2, vos appels à la PokéAPI fonctionnaient sans rien faire, parce que la PokéAPI renvoie `Access-Control-Allow-Origin: *` : elle autorise toutes les origines, car c'est une API publique.
>
> Deux points importants :
>
> - **CORS ne protège pas l'API.** C'est le navigateur qui applique la règle. REST Client, `curl` ou un autre serveur l'ignorent complètement. Pour empêcher des appels non autorisés, il faut une **authentification**, pas CORS.
> - **Une autre solution consiste à supprimer le problème** : si la page et l'API sont servies depuis la même origine, CORS n'intervient plus. C'est ce que font souvent les applications en production, grâce à un *reverse proxy*.

</details>

---

## Exercice 2 : Lire des Pokémon stockés en mémoire

### Objectif

Créer la route `GET /api/pokemons` avec un tableau en mémoire, la tester, puis afficher la liste dans le front avant de brancher l'API sur SQLite.

### 1. Décrire les types

Créer `server/types/pokemon.types.ts` :

```ts
export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  primaryType: string;
  secondaryType: string | null;
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}
```

Ce fichier décrit la forme des données que l'API manipule.

`id` est le numéro du Pokémon dans le Pokédex. `secondaryType` vaut `null` pour les Pokémon qui n'ont qu'un type : le type `string | null` l'indique à TypeScript.

### 2. Lister les Pokémon

Dans `server/index.ts`, ajouter l'import du type et un tableau de départ :

```ts
import type { Pokemon } from './types/pokemon.types';

// ...

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
```

Implémenter la route `GET /api/pokemons` qui renvoie le tableau avec `response.json(pokemons)`, ainsi que la requête correspondante dans `requests.http` :

```http
### List the Pokémon
GET {{baseUrl}}/pokemons
```

### 3. Côté front : afficher la liste

Le front et le serveur sont deux projets indépendants : `src/main.ts` ne peut pas importer `server/types/pokemon.types.ts`. Le front a donc ses propres types, rangés comme côté serveur : créer le dossier `src/types`, puis le fichier `src/types/pokemon.types.ts`, et y copier l'interface `Pokemon` :

```ts
export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  primaryType: string;
  secondaryType: string | null;
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}
```

Dans `src/main.ts`, importer ce type :

```ts
import type { Pokemon } from './types/pokemon.types';
```

Écrire ensuite l'appel à l'endpoint `/api/pokemons` à l'aide de la fonction `fetch`, et afficher le résultat dans la console.

<details>
<summary><strong>Besoin d'aide ?</strong></summary>

```ts
async function getPokemons(): Promise<Pokemon[]> {
  const response = await fetch(`${API_URL}/pokemons`);
  return response.json();
}

console.log(await getPokemons());
```

</details>

> **Point de contrôle** : `GET {{baseUrl}}/pokemons` renvoie les trois Pokémon, et la console du navigateur les affiche.

---

## Exercice 3 : Enregistrer les données dans SQLite

### Objectif

Après avoir testé `GET /api/pokemons` avec un tableau en mémoire, remplacer ce tableau par une table SQLite. Ajouter ensuite la lecture d'un Pokémon par son identifiant, directement depuis la base.

### Pourquoi SQLite ?

SQLite stocke toute la base dans un seul fichier, sans serveur à installer. La bibliothèque `better-sqlite3` est **synchrone** : ce choix serait à rediscuter pour une API très sollicitée, mais il rend le code de ce TP plus simple et plus lisible.

### 1. Installer SQLite

Arrêter l'API (Ctrl+C dans son terminal), puis, toujours dans le dossier `server`, installer la bibliothèque et ses types TypeScript :

```bash
npm install better-sqlite3
npm install -D @types/better-sqlite3
```

Installer également l'extension VS Code `SQLite Viewer` (éditeur : Florian Klampfer). Elle permet de consulter les données de notre base directement depuis l'IDE.

### 2. Ouvrir la base et créer la table

Créer `server/database.ts` :

```ts
import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';

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
```

La première exécution générera le fichier `server/data/pokedex.db`. Les exécutions suivantes conservent les données, grâce à `IF NOT EXISTS`.

### 3. Ajouter des données de départ une seule fois

Les trois Pokémon du tableau de l'exercice 2 vont servir de données de départ. Dans `server/index.ts`, **couper** le tableau `pokemons`, et le coller à la fin de `server/database.ts`. Importer aussi le type `Pokemon`.

Puis ajouter, toujours à la fin de `server/database.ts` :

```ts
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
```

### 4. Brancher la liste sur la base

Les étapes suivantes utilisent les méthodes `prepare`, `all` et `get` de `better-sqlite3`. Elles sont résumées dans le bloc « Cours : table, ligne et clé primaire », à la fin de cet exercice : l'ouvrir maintenant si besoin.

Dans `server/index.ts` :

1. Ajouter l'import de la base :

```ts
import { database } from './database';
```

Grâce à cet import, le fichier sera lu au démarrage de l'API et notre base pourra se créer.

2. Remplacer le contenu de la route `GET /api/pokemons` :

```ts
app.get('/api/pokemons', (_request, response) => {
  const pokemons = database
    .prepare('SELECT * FROM pokemons ORDER BY id')
    .all() as Pokemon[];

  return response.json(pokemons);
});
```

3. Relancer l'API et vérifier que la base de données a été créée et que le comportement reste identique à ce que nous avions avant.

### 5. Lire un Pokémon par son identifiant

Créer maintenant la route `GET /api/pokemons/:id`. Elle retournera le Pokémon dont l'identifiant correspond. Pour une URL comme `/api/pokemons/2`, la valeur de `:id` se trouve dans `request.params.id`, **sous forme de texte**.

Comme toute valeur venant d'une URL, il faut la vérifier et la convertir. Ajouter dans `server/index.ts`, avant les routes, cette fonction qui renvoie l'identifiant converti en nombre, ou `null` s'il n'est pas un entier strictement positif :

```ts
function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
```

Écrire la route :

1. si `parseId` renvoie `null`, répondre `400` avec `{ error: "The id must be a positive integer." }` : `response.status(400).json({ ... });` ;
2. sinon, chercher le Pokémon dans SQLite avec :

```ts
const pokemon = database
  .prepare('SELECT * FROM pokemons WHERE id = ?')
  .get(id) as Pokemon | undefined;
```

3. si aucun Pokémon n'est trouvé (undefined), répondre `404` avec `{ error: 'Pokemon not found.' }` ;
4. sinon, renvoyer le Pokémon.

Le `return` devant chaque réponse est important : sans lui, après avoir répondu `400`, la fonction continuerait et tenterait d'envoyer une deuxième réponse (erreur `Cannot set headers after they are sent to the client` dans le terminal de l'API).

<details>
<summary><strong>Besoin d'aide ?</strong></summary>

```ts
app.get('/api/pokemons/:id', (request, response) => {
  const id = parseId(request.params.id);

  if (id === null) {
    return response.status(400).json({ error: "The id must be a positive integer." });
  }

  const pokemon = database
    .prepare('SELECT * FROM pokemons WHERE id = ?')
    .get(id) as Pokemon | undefined;

  if (!pokemon) {
    return response.status(404).json({ error: 'Pokemon not found.' });
  }

  return response.json(pokemon);
});
```

</details>

Ajouter ces tests dans `requests.http` :

```http
### Get an existing Pokémon
GET {{baseUrl}}/pokemons/25

### Get a Pokémon that does not exist
GET {{baseUrl}}/pokemons/999

### Get with an invalid id
GET {{baseUrl}}/pokemons/abc
```

Regarder pour chacun de ces trois cas que l'API retourne bien le code http et le json attendu.

> **Point de contrôle** :
> - les requêtes de `requests.http` donnent les codes attendus (`200`, `404`, `400`) ;
> - le front fonctionne **sans aucune modification** : il ne sait pas comment l'API stocke ses données ;
> - les trois Pokémon de départ ne sont pas dupliqués au redémarrage ;
> - supprimer volontairement `server/data/pokedex.db`, relancer l'API : la base est recréée avec les trois Pokémon de départ.

<details>
<summary><strong>Cours : table, ligne et clé primaire</strong></summary>

> Une base relationnelle organise les données en tables. Une table ressemble à un tableau : chaque **ligne** est une donnée et chaque **colonne** décrit une propriété.
>
> ```text
> pokemons (extrait)
> id | name       | primaryType | secondaryType | hp
> 1  | bulbasaur  | grass       | poison        | 45
> 25 | pikachu    | electric    | NULL          | 35
> ```
>
> `id INTEGER PRIMARY KEY` définit une **clé primaire** : sa valeur identifie chaque ligne, et SQLite refuse deux lignes avec la même. Ici, la clé est le numéro du Pokédex, une donnée qui identifie déjà chaque Pokémon de façon unique et stable : c'est une **clé naturelle**.
>
> Quand rien de tel n'existe (un utilisateur, une commande…), on laisse la base attribuer un identifiant **technique**, avec `INTEGER PRIMARY KEY AUTOINCREMENT` : à chaque insertion, SQLite choisit un nouveau numéro, et le serveur n'a pas besoin de gérer lui-même un compteur. C'est le cas le plus courant.
>
> Avec `better-sqlite3` :
>
> - `.prepare(sql)` prépare une requête ;
> - `.all(...)` renvoie toutes les lignes (tableau) ;
> - `.get(...)` renvoie la première ligne, ou `undefined` ;
> - `.run(...)` exécute une écriture et renvoie notamment `changes` (nombre de lignes touchées) et `lastInsertRowid` (id de la ligne insérée).

</details>

<details>
<summary><strong>Cours : requêtes SQL paramétrées</strong></summary>

> Ne jamais écrire ceci :
>
> ```ts
> database.exec(`INSERT INTO pokemons (name) VALUES ('${name}')`);
> ```
>
> La concaténation permettrait à une donnée malveillante de modifier la requête SQL (injection SQL). Les paramètres `?` séparent la requête de ses valeurs :
>
> ```ts
> database.prepare('INSERT INTO pokemons (name) VALUES (?)').run(name);
> ```
>
> Les paramètres peuvent aussi être **nommés** : `@name` est remplacé par la propriété `name` de l'objet passé à `run`.
>
> ```ts
> database.prepare('INSERT INTO pokemons (name) VALUES (@name)').run({ name });
> ```
>
> Cette règle s'applique à chaque valeur qui vient d'un utilisateur, d'une URL ou d'un fichier.

</details>

---

## Exercice 4 : Créer un Pokémon dans SQLite

### Objectif

Accepter un corps JSON et créer un Pokémon directement dans SQLite. Vérifier que la création survit au redémarrage de l'API, puis constater ce qui se passe quand on fait confiance aux données reçues.

### 1. Décoder le JSON reçu

Pour lire le corps JSON d'une requête, Express a besoin d'un middleware. Ajouter cette ligne juste après `app.use(cors(...));` dans `server/index.ts` :

```ts
app.use(express.json());
```

Sans cette ligne, `request.body` vaut `undefined`.

### 2. Ajouter la route POST, sans validation

Dans `server/index.ts`, ajouter cette route. Elle insère dans la base ce que le client a envoyé : grâce aux paramètres nommés, le corps de la requête est donné **tel quel** à `run`. L'`id` fait partie des données envoyées : c'est le numéro du Pokédex.

```ts
app.post('/api/pokemons', (request, response) => {
  const insert = database
    .prepare(`
      INSERT INTO pokemons (
        id, name, sprite, primaryType, secondaryType,
        hp, attack, defense, specialAttack, specialDefense, speed
      ) VALUES (
        @id, @name, @sprite, @primaryType, @secondaryType,
        @hp, @attack, @defense, @specialAttack, @specialDefense, @speed
      )
    `)
    .run(request.body);

  const pokemon = database
    .prepare('SELECT * FROM pokemons WHERE id = ?')
    .get(insert.lastInsertRowid) as Pokemon;

  return response.status(201).json(pokemon);
});
```

Ajouter ces requêtes dans `server/requests.http` (une ligne vide est obligatoire entre les en-têtes et le corps) :

```http
### Create a Pokémon
POST {{baseUrl}}/pokemons
Content-Type: application/json

{
  "id": 7,
  "name": "squirtle",
  "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
  "primaryType": "water",
  "secondaryType": null,
  "hp": 44, "attack": 48, "defense": 65,
  "specialAttack": 50, "specialDefense": 64, "speed": 43
}

### Create an invalid Pokémon: empty name, hp is not a number
POST {{baseUrl}}/pokemons
Content-Type: application/json

{
  "id": 19,
  "name": "",
  "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png",
  "primaryType": "normal",
  "secondaryType": null,
  "hp": "abc", "attack": 56, "defense": 35,
  "specialAttack": 25, "specialDefense": 35, "speed": 72
}

### Create an invalid Pokémon: missing name
POST {{baseUrl}}/pokemons
Content-Type: application/json

{
  "id": 19,
  "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png",
  "primaryType": "normal",
  "secondaryType": null,
  "hp": 30, "attack": 56, "defense": 35,
  "specialAttack": 25, "specialDefense": 35, "speed": 72
}

### Create an invalid Pokémon: negative hp
POST {{baseUrl}}/pokemons
Content-Type: application/json

{
  "id": 19,
  "name": "rattata",
  "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png",
  "primaryType": "normal",
  "secondaryType": null,
  "hp": -3, "attack": 56, "defense": 35,
  "specialAttack": 25, "specialDefense": 35, "speed": 72
}
```

Envoyer la première requête : elle renvoie `201` et le Pokémon créé, avec son `id`. Arrêter puis relancer l'API : `GET {{baseUrl}}/pokemons` contient toujours Squirtle, et la liste affichée dans la console du navigateur aussi.

### 3. Observer : faire confiance au client est une mauvaise idée

Envoyer maintenant les trois requêtes invalides, puis **une seconde fois** la requête qui crée Squirtle. Noter pour chacune le code de réponse et ce qui apparaît dans le terminal de l'API.

- **Nom vide et `hp: "abc"`** : `201`. Le Pokémon est créé ! Ouvrir `pokedex.db` avec SQLite Viewer : la colonne `hp` contient le texte `abc`. SQLite est très permissif : une colonne `INTEGER` accepte du texte, et la contrainte `CHECK (hp > 0)` le laisse passer.
- **Nom manquant** : `500`, avec l'erreur `Missing named parameter "name"` dans le terminal. La requête SQL n'a même pas pu s'exécuter, et l'API répond « erreur du serveur » alors que c'est le client qui s'est trompé : la bonne réponse serait `400`.
- **HP négatifs** : `500` également (`CHECK constraint failed`).
- **Squirtle une seconde fois** : `500` (`UNIQUE constraint failed: pokemons.id`). La base refuse un second Pokémon avec le même `id`, mais là encore, l'API devrait répondre proprement au client : ce sera un `409 Conflict`.

**Question** : pourquoi TypeScript n'a-t-il signalé aucune de ces erreurs ?

Parce que `request.body` est de type `any` : TypeScript ne sait pas ce que le client enverra, et il ne vérifie de toute façon rien **à l'exécution**. Les types décrivent ce que l'on *espère* recevoir, seul un contrôle écrit dans le code vérifie ce que l'on reçoit *réellement*.

Pour repartir d'une base propre avant l'exercice suivant : arrêter l'API, supprimer `server/data/pokedex.db`, puis relancer l'API. La base est recréée avec les trois Pokémon de départ, sans Squirtle ni le Pokémon invalide.

> **Point de contrôle** :
> - `POST {{baseUrl}}/pokemons` avec Squirtle renvoie `201`, et Squirtle est toujours là après un redémarrage de l'API ;
> - vous savez expliquer pourquoi les trois requêtes invalides donnent `201`, `500` et `500`, pourquoi le second Squirtle donne `500`, et pourquoi ce n'est pas acceptable.
>
> L'exercice suivant corrige ce problème.

---

## Exercice 5 : Valider les données avec Zod

### Objectif

Refuser proprement les données invalides avec un `400`, en les validant avec la bibliothèque **Zod** avant d'écrire dans la base.

### 1. Valider le corps avec Zod

Avant d'écrire dans la base, il faut contrôler chaque champ envoyé par le client. Écrire ces contrôles à la main (« `name` est-il une chaîne ? non vide ? `hp` est-il un entier ? positif ? ») serait long et répétitif. La bibliothèque **Zod** permet de les décrire sous forme de **schéma**.

Arrêter l'API, puis, dans le dossier `server`, installer Zod :

```bash
npm install zod
```

Remplacer **tout le contenu** de `server/types/pokemon.types.ts` par un schéma Zod :

```ts
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
```

Le schéma se lit presque comme une phrase : `name` est une chaîne, sans espaces autour, d'au moins un caractère ; chaque statistique est un nombre entier positif ; `sprite` est une URL en `http` ou `https`. Quelques détails :

- `typeSchema` et `statSchema` sont des morceaux de schéma réutilisables : on décrit une fois ce qu'est un type ou une statistique valide ;
- `.nullable()` accepte aussi `null` : c'est la traduction de `string | null` ;
- `z.infer` en déduit le type TypeScript `Pokemon`.

L'interface `Pokemon` de l'exercice 2 a disparu : les données ne sont plus décrites qu'**une seule fois**, dans le schéma, et les types ne peuvent plus être en désaccord avec la validation.

### 2. Découvrir `safeParse`

Un schéma ne fait rien tout seul : il faut lui donner une valeur à vérifier. C'est le rôle de `safeParse` :

```ts
const result = pokemonSchema.safeParse(request.body);
```

`safeParse` ne lève jamais d'erreur, et ne renvoie **pas** un simple booléen : il renvoie un **objet**, dont la propriété `success` indique si la validation a réussi.

| Cas | Ce que renvoie `safeParse` |
| --- | --- |
| Données valides | `{ success: true, data: { id: 7, name: 'squirtle', ... } }` |
| Données invalides | `{ success: false, error: ... }` |

- `result.data` n'existe que si `success` vaut `true` : ce sont les données **validées**, typées `Pokemon` ;
- `result.error` n'existe que si `success` vaut `false` : il décrit chaque problème trouvé (champ concerné, message).

Pour l'observer, dans `server/index.ts`, importer le schéma à côté de l'import du type `Pokemon` :

```ts
import { pokemonSchema } from './types/pokemon.types';
```

Puis ajouter **temporairement** ces deux lignes au tout début de la route `POST`, avant `const insert = ...` :

```ts
const result = pokemonSchema.safeParse(request.body);
console.log(result);
```

Relancer l'API, puis envoyer depuis `requests.http` :

1. la requête qui crée Squirtle : le terminal de l'API affiche `success: true` et les données dans `data` ;
2. la requête « nom vide, `hp` n'est pas un nombre » : le terminal affiche `success: false`, et l'erreur mentionne les champs `name` et `hp`.

**Question** : dans le second cas, Zod a bien détecté que les données sont invalides. Le Pokémon a-t-il pourtant été inséré ? Pourquoi ?

Oui (`201`). `safeParse` se contente de **renvoyer** un résultat : il n'arrête pas la route. C'est à nous de tester `result.success` et de répondre `400` avant d'arriver à l'`INSERT`.

Repartir d'une base propre : arrêter l'API, supprimer `server/data/pokedex.db`, puis relancer l'API.

### 3. Refuser les données invalides

Supprimer le `console.log(result)`. La route `POST` doit maintenant suivre ces étapes, **dans cet ordre** :

1. **Valider le corps** avec `pokemonSchema.safeParse(request.body)`.
2. **Si la validation échoue**, c'est-à-dire si `result.success` vaut `false`, répondre `400` avec `{ error: 'Invalid Pokemon data.' }`.
   Attention : tester `result.success`, et non `result`. `result` est un objet, et un objet est toujours « vrai » en JavaScript : `if (!result)` ne serait jamais vrai.
3. **Récupérer les données validées** : `const input = result.data;`. À partir de cette ligne, ne plus utiliser `request.body` : `input` ne contient que des données vérifiées.
4. **Vérifier que le Pokémon n'existe pas déjà** : réutiliser la requête de l'exercice 3, `SELECT * FROM pokemons WHERE id = ?`, avec `input.id`. Si elle renvoie une ligne, répondre `409` avec `{ error: 'This Pokemon is already in your Pokédex.' }`.
5. **Insérer** : dans l'`INSERT` existant, remplacer `.run(request.body)` par `.run(input)`. La fin de la route (relire le Pokémon, répondre `201`) ne change pas.

<details>
<summary><strong>Besoin d'aide ?</strong></summary>

```ts
app.post('/api/pokemons', (request, response) => {
  const result = pokemonSchema.safeParse(request.body);

  if (!result.success) {
    return response.status(400).json({ error: 'Invalid Pokemon data.' });
  }

  const input = result.data;

  const existing = database
    .prepare('SELECT id FROM pokemons WHERE id = ?')
    .get(input.id);

  if (existing) {
    return response.status(409).json({ error: 'This Pokemon is already in your Pokédex.' });
  }

  const insert = database
    .prepare(`
      INSERT INTO pokemons (
        id, name, sprite, primaryType, secondaryType,
        hp, attack, defense, specialAttack, specialDefense, speed
      ) VALUES (
        @id, @name, @sprite, @primaryType, @secondaryType,
        @hp, @attack, @defense, @specialAttack, @specialDefense, @speed
      )
    `)
    .run(input);

  const pokemon = database
    .prepare('SELECT * FROM pokemons WHERE id = ?')
    .get(insert.lastInsertRowid) as Pokemon;

  return response.status(201).json(pokemon);
});
```

</details>

Relancer l'API, puis renvoyer les requêtes de l'exercice 4 : Squirtle renvoie `201` la première fois, puis `409` ; les trois requêtes invalides renvoient maintenant `400` ; et plus rien n'apparaît dans le terminal.

`400` et `409` sont deux erreurs du client, mais pas la même : `400` signifie que la requête est mal formée, `409` qu'elle est correcte mais entre en conflit avec l'état de la base.

<details>
<summary><strong>Cours : valider les données avec Zod</strong></summary>

> Le corps d'une requête est envoyé par le client : il peut contenir **n'importe quoi**. Les types TypeScript disparaissent à l'exécution ; il faut donc un contrôle qui, lui, s'exécute. C'est le rôle d'un schéma Zod.
>
> - `schema.safeParse(valeur)` ne lève jamais d'erreur. Il renvoie soit `{ success: true, data }`, avec les données validées et typées, soit `{ success: false, error }`.
> - `result.error.issues` détaille chaque problème (champ concerné, message) : on pourrait les renvoyer au client pour lui dire précisément ce qui ne va pas.
> - `z.infer<typeof schema>` produit le type TypeScript correspondant au schéma.
> - Les propriétés inconnues sont **retirées** de `result.data` : si un client envoie en plus un champ `isAdmin`, il n'atteint jamais la base.
>
> La contrainte `CHECK (hp > 0)` de la table reste utile : c'est un second filet de sécurité, au plus près des données. Mais c'est à l'API de refuser proprement une requête invalide, avec un `400` et un message clair.

</details>

### 4. Prendre du recul

Faire défiler `server/index.ts`. Il mélange maintenant :

- la configuration du serveur Express ;
- la déclaration des URLs ;
- la validation des données reçues et le choix des codes HTTP ;
- des requêtes SQL (dont `SELECT ... WHERE id = ?`, écrite plusieurs fois).

**Question** : si l'on ajoutait les routes `PUT` et `DELETE`, puis une deuxième ressource (par exemple des dresseurs, `/api/trainers`) avec son propre CRUD, que deviendrait ce fichier ? Et si l'on voulait remplacer SQLite par une autre base, combien d'endroits faudrait-il modifier ?

C'est ce que l'exercice suivant va régler.

---

## Exercice 6 : Découper le code en routes, controllers et services

### Objectif

Réorganiser l'API en trois couches **sans changer son comportement** : à la fin, chaque requête de `requests.http` doit donner exactement la même réponse qu'avant (même code HTTP, même corps).

### Les trois couches

```text
Requête HTTP
    |
    v
routes/       -> quelle URL + quelle méthode appelle quelle fonction ?
    |
    v
controllers/  -> lire la requête, valider, choisir le code HTTP, répondre
    |
    v
services/     -> accéder aux données (le SQL est uniquement ici)
    |
    v
database.ts   -> connexion SQLite
```

Règles à respecter :

- un **service** ne connaît pas Express : pas de `request`, pas de `response`, pas de code HTTP ;
- un **controller** ne contient pas de SQL ;
- un fichier de **routes** ne contient que des associations URL → controller.

Ces trois règles suffisent pour décider où va chaque ligne de code. Gardez-les sous les yeux pendant tout l'exercice.

### Structure cible

```text
tp3/server/
├── controllers/
│   └── pokemon.controller.ts
├── data/
│   └── pokedex.db
├── routes/
│   └── pokemon.routes.ts
├── services/
│   └── pokemon.service.ts
├── types/
│   └── pokemon.types.ts
├── database.ts
├── index.ts
└── requests.http
```

### 1. Classer le code existant

Avant de déplacer quoi que ce soit, ouvrir `server/index.ts` et indiquer, pour chacun de ces éléments, où il devra se trouver : `index.ts`, route, controller ou service.

1. `app.use(cors({ origin: 'http://localhost:5173' }))`
2. `app.get('/api/pokemons/:id', ...)` : l'association entre l'URL et la fonction
3. la fonction `parseId`
4. `pokemonSchema.safeParse(request.body)`
5. `database.prepare('SELECT * FROM pokemons WHERE id = ?').get(id)`
6. `response.status(409).json({ error: 'This Pokemon is already in your Pokédex.' })`
7. « refuser la création si ce Pokémon existe déjà »

<details>
<summary><strong>Correction</strong></summary>

1. `index.ts` : c'est la configuration du serveur.
2. Route.
3. Controller : elle lit une valeur de la requête (`request.params.id`) et sert à décider d'un `400`.
4. Controller : valider ce qu'envoie le client, c'est préparer la réponse HTTP.
5. Service : c'est du SQL.
6. Controller : c'est un code HTTP.
7. **Les deux.** *Chercher* si le Pokémon existe est un accès aux données : c'est le service. *Décider* d'en faire un `409` est un choix HTTP : c'est le controller. Le service répond à « ce Pokémon existe-t-il ? », le controller décide quoi faire de la réponse.

</details>

### 2. Un exemple complet : la liste des Pokémon

On commence par la route la plus simple, `GET /api/pokemons`, en suivant les trois couches de bas en haut.

Créer `server/services/pokemon.service.ts` et y déplacer le SQL de la liste :

```ts
import { database } from '../database';
import type { Pokemon } from '../types/pokemon.types';

export function findAll(): Pokemon[] {
  return database
    .prepare('SELECT * FROM pokemons ORDER BY id')
    .all() as Pokemon[];
}
```

Créer `server/controllers/pokemon.controller.ts` :

```ts
import type { Request, Response } from 'express';
import * as pokemonService from '../services/pokemon.service';

export function getPokemons(_request: Request, response: Response) {
  const pokemons = pokemonService.findAll();
  return response.json(pokemons);
}
```

Créer `server/routes/pokemon.routes.ts` :

```ts
import { Router } from 'express';
import { getPokemons } from '../controllers/pokemon.controller';

export const pokemonRouter = Router();

pokemonRouter.get('/', getPokemons);
```

Dans `server/index.ts` :

1. importer `pokemonRouter` ;
2. **supprimer** l'ancienne route `app.get('/api/pokemons', ...)` ;
3. ajouter, juste avant `app.listen(...)` :

```ts
app.use('/api/pokemons', pokemonRouter);
```

Les URLs du routeur sont **relatives** à ce préfixe : `'/'` correspond à `/api/pokemons`, et `'/:id'` correspondra à `/api/pokemons/:id`.

La suppression de l'étape 2 est indispensable. Express essaie les routes **dans l'ordre où elles sont déclarées** et s'arrête à la première qui répond. Le routeur étant branché après les anciennes routes, une ancienne route laissée en place répondrait toujours à sa place : votre nouveau code ne serait jamais exécuté, et pourtant tout aurait l'air de fonctionner.

Vérifier que `GET {{baseUrl}}/pokemons` et le front fonctionnent toujours.

### 3. Lire un Pokémon par son identifiant

Déplacer maintenant `GET /api/pokemons/:id` en suivant le même procédé que la liste. Les noms et la signature de la fonction du service sont imposés, car l'exercice 7 s'en servira :

| Fichier | À écrire |
| --- | --- |
| `pokemon.service.ts` | `findById(id: number): Pokemon \| undefined` |
| `pokemon.controller.ts` | `getPokemonById`, ainsi que `parseId` |
| `pokemon.routes.ts` | l'association `GET '/:id'` → `getPokemonById` |
| `index.ts` | supprimer l'ancienne route |

Un point de TypeScript : dans un controller séparé, Express ne sait pas que l'URL contient `:id`. Il type donc `request.params.id` de façon très large (`string | string[]`), ce que `parseId` (qui attend une `string`) refuse. Il faut indiquer le paramètre de route dans le type de la requête :

```ts
export function getPokemonById(request: Request<{ id: string }>, response: Response) {
  // ...
}
```

Relancer les trois requêtes `GET` par identifiant de `requests.http` : elles doivent donner les mêmes réponses (`200`, `404`, `400`) qu'avant.

<details>
<summary><strong>Solution</strong></summary>

Dans le service :

```ts
export function findById(id: number): Pokemon | undefined {
  return database
    .prepare('SELECT * FROM pokemons WHERE id = ?')
    .get(id) as Pokemon | undefined;
}
```

Dans le controller :

```ts
function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
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
```

Dans le routeur :

```ts
pokemonRouter.get('/:id', getPokemonById);
```

</details>

### 4. Créer un Pokémon

Déplacer enfin `POST /api/pokemons`.

| Fichier | À écrire |
| --- | --- |
| `pokemon.service.ts` | `create(pokemon: Pokemon): Pokemon`, qui insère le Pokémon et renvoie la ligne relue dans la base |
| `pokemon.controller.ts` | `postPokemon` (importer `pokemonSchema` depuis `../types/pokemon.types`) |
| `pokemon.routes.ts` | l'association `POST '/'` → `postPokemon` |
| `index.ts` | supprimer l'ancienne route |

Pour le `409`, appliquer la réponse à la question 7 du §1 : le controller ne doit pas contenir de `SELECT`. Il **demande au service** si le Pokémon existe, avec la fonction `findById` que vous venez d'écrire, puis décide lui-même de répondre `409`. Inutile d'écrire une nouvelle fonction dans le service.

De même, pour que `create` renvoie « la ligne relue dans la base », pas besoin de réécrire le `SELECT` : `create` peut appeler `findById`, qui se trouve dans le même fichier.

Relancer les requêtes `POST` de `requests.http` : Squirtle donne `201`, puis `409` ; les trois requêtes invalides donnent `400`. Pour rejouer le `201`, supprimer `data/pokedex.db` et relancer l'API.

<details>
<summary><strong>Solution</strong></summary>

Dans le service :

```ts
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
```

Dans le controller :

```ts
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
```

Dans le routeur :

```ts
pokemonRouter.post('/', postPokemon);
```

</details>

### 5. Faire le ménage et vérifier

`server/index.ts` ne doit plus contenir que la configuration Express (`cors`, `express.json()`), les routes `/api/health` et `/api/about`, et le branchement du routeur. Supprimer :

- la fonction `parseId`, qui se trouve maintenant dans le controller ;
- les imports devenus inutiles (`database`, le type `Pokemon`, `pokemonSchema`) : c'est le service qui importe maintenant la base, et le controller qui importe le schéma.

Attention : `npm run typecheck` ne signale pas une fonction ou un import inutilisé. C'est à vous de faire ce ménage.

Vérifier que les règles sont respectées, avec la recherche globale de l'IDE :

- `prepare` n'apparaît que dans `services/` (et dans `database.ts`) ;
- `response` et `status` n'apparaissent pas dans `services/` ;
- `pokemon.routes.ts` ne contient que des appels `pokemonRouter.get(...)` et `pokemonRouter.post(...)`.

> **Point de contrôle** : `npm run typecheck` ne signale aucune erreur ; toutes les requêtes de `requests.http` donnent exactement les mêmes réponses qu'avant l'exercice.

---

## Exercice 7 : Modifier et supprimer un Pokémon

### Objectif

Terminer le CRUD avec `PUT` et `DELETE`, directement dans l'organisation en couches.

### 1. Modifier avec `PUT`

Le corps d'un `PUT` ne contient pas d'`id` : c'est l'URL qui désigne le Pokémon à modifier, et un Pokémon ne change jamais de numéro. Dans `server/types/pokemon.types.ts`, ajouter un schéma pour ce corps :

```ts
export const pokemonUpdateSchema = pokemonSchema.omit({ id: true });

export type PokemonUpdate = z.infer<typeof pokemonUpdateSchema>;
```

`.omit({ id: true })` crée un schéma identique à `pokemonSchema`, sans le champ `id`.

Ajouter ensuite `update` dans `server/services/pokemon.service.ts`, en complétant l'import des types avec `PokemonUpdate`. La fonction doit modifier la ligne puis renvoyer le Pokémon relu, ou `undefined` si l'identifiant n'existe pas :

```ts
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
```

`{ ...input, id }` crée un nouvel objet qui contient tous les champs de `input`, plus l'`id` : c'est lui qui remplit `@id`.

Dans `pokemon.controller.ts`, écrire `putPokemon`, en important aussi `pokemonUpdateSchema`. Elle combine `getPokemonById` et `postPokemon`, et doit, **dans cet ordre** :

1. valider l'identifiant avec `parseId` : s'il est invalide, répondre `400` (comme dans `getPokemonById`) ;
2. valider le corps avec `pokemonUpdateSchema.safeParse(...)` : s'il est invalide, répondre `400` (comme dans `postPokemon`) ;
3. appeler `pokemonService.update(id, result.data)` ;
4. si `update` renvoie `undefined`, répondre `404` avec `{ error: 'Pokemon not found.' }` ;
5. sinon, répondre `200` avec le Pokémon modifié.

Comme pour `getPokemonById`, la requête doit être typée `Request<{ id: string }>`.

Ajouter ensuite cette association dans `pokemon.routes.ts` :

```ts
pokemonRouter.put('/:id', putPokemon);
```

<details>
<summary><strong>Besoin d'aide ?</strong></summary>

```ts
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
```

</details>

Ajouter la requête dans `requests.http` : elle remplace l'image de Squirtle par sa version chromatique (*shiny*). Si Squirtle n'est plus dans votre base, le recréer d'abord avec la requête de l'exercice 4.

```http
### Update a Pokémon
PUT {{baseUrl}}/pokemons/7
Content-Type: application/json

{
  "name": "squirtle",
  "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/7.png",
  "primaryType": "water",
  "secondaryType": null,
  "hp": 44, "attack": 48, "defense": 65,
  "specialAttack": 50, "specialDefense": 64, "speed": 43
}
```

Ajouter aussi deux requêtes :

- une avec un identifiant inexistant (par exemple `999`), qui doit donner `404`. Attention : son corps doit être **complet et valide** (copier celui de Squirtle). Le corps est validé à l'étape 2, avant de chercher le Pokémon : avec un corps vide ou incomplet, l'API répond `400` sans jamais arriver à l'étape 4 ;
- une sur Squirtle (`7`) avec un corps invalide (par exemple un nom vide), qui doit donner `400`.

Recharger le front : la liste affichée dans la console contient la modification.

Votre page utilisera cette route à l'exercice 8 ; pour l'instant, elle se teste avec `requests.http`.

<details>
<summary><strong>Cours : PUT ou PATCH ?</strong></summary>

> `PUT` remplace une ressource : le client fournit donc ici tous les champs, sauf l'`id`, qui est dans l'URL. `PATCH` sert à modifier seulement certaines propriétés ; il demanderait un schéma où chaque champ est facultatif (Zod le fournit avec `pokemonUpdateSchema.partial()`) et une requête SQL plus complexe : ce n'est pas nécessaire pour ce premier CRUD.
>
> `result.changes` compte les lignes trouvées par le `WHERE`, même si leurs valeurs ne changent pas : renvoyer un Pokémon identique donne donc `1`. S'il vaut `0`, c'est que l'identifiant n'existe pas : c'est un `404`, pas un `200`.

</details>

### 2. Supprimer avec `DELETE`

Dans `pokemon.service.ts`, écrire `remove(id: number): boolean`. Elle exécute `DELETE FROM pokemons WHERE id = ?` et renvoie `true` si une ligne a été supprimée, `false` sinon.

Dans `pokemon.controller.ts`, écrire `deletePokemon`. Elle doit :

1. répondre `400` si l'identifiant est invalide ;
2. appeler `pokemonService.remove(id)` ;
3. répondre `404` si aucune ligne n'a été supprimée ;
4. sinon, répondre `204` **sans corps**.

Indices : inspirez-vous de `putPokemon` ; pour répondre sans corps, utilisez `return response.status(204).send();`.

Ajouter la route dans `pokemon.routes.ts` :

```ts
pokemonRouter.delete('/:id', deletePokemon);
```

Ajouter la requête dans `requests.http` :

```http
### Delete a Pokémon
DELETE {{baseUrl}}/pokemons/7
```

Tester la suppression, vérifier que le Pokémon n'est plus dans la liste, puis relancer la même suppression : elle doit répondre `404`.

<details>
<summary><strong>Besoin d'aide ?</strong></summary>

```ts
export function remove(id: number): boolean {
  const result = database
    .prepare('DELETE FROM pokemons WHERE id = ?')
    .run(id);

  return result.changes > 0;
}
```

```ts
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
```

</details>

---

## Exercice 8 : Construire le front du Pokédex

### Objectif

Construire une page qui utilise tout le CRUD de votre API : afficher les Pokémon, en ajouter, en modifier et en supprimer.

L'interface (HTML, CSS et manipulation du DOM) vous est fournie. Vous écrivez la partie qui parle à l'API : le fichier `src/api.ts`.

```text
src/main.ts  -> le DOM : afficher la liste, lire le formulaire, réagir aux clics   (fourni)
    |
    v
src/api.ts   -> les appels fetch : URL, méthode, en-têtes, corps, erreurs         (à écrire)
    |
    v
Votre API (port 3000)

src/types/   -> la forme des données, partagée par main.ts et api.ts
```

C'est le même découpage qu'à l'exercice 6, côté navigateur : `main.ts` ne contient aucun `fetch`, et `api.ts` ne touche jamais au DOM. `api.ts` est le seul fichier qui connaît les URLs de l'API. Les types, eux, restent dans `src/types/`, comme dans `server/types/`.

### 1. Mettre en place la page

L'API doit tourner (`npm run dev` dans `server`), ainsi que Vite (`npm run dev` à la racine de `tp3`).

Remplacer **tout le contenu** de `index.html` :

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pokédex</title>
  </head>
  <body>
    <main>
      <h1>Pokédex</h1>
      <p id="message" role="status"></p>

      <form id="pokemon-form" novalidate>
        <h2 id="form-title">Add a Pokémon</h2>

        <div class="fields">
          <label>Id <input name="id" type="number" /></label>
          <label>Name <input name="name" /></label>
          <label class="wide">Sprite URL <input name="sprite" type="url" /></label>
          <label>
            Primary type
            <select name="primaryType">
              <option value="normal" selected>Normal</option>
              <option value="fire">Fire</option>
              <option value="water">Water</option>
              <option value="electric">Electric</option>
              <option value="grass">Grass</option>
              <option value="ice">Ice</option>
              <option value="fighting">Fighting</option>
              <option value="poison">Poison</option>
              <option value="ground">Ground</option>
              <option value="flying">Flying</option>
              <option value="psychic">Psychic</option>
              <option value="bug">Bug</option>
              <option value="rock">Rock</option>
              <option value="ghost">Ghost</option>
              <option value="dragon">Dragon</option>
              <option value="dark">Dark</option>
              <option value="steel">Steel</option>
              <option value="fairy">Fairy</option>
            </select>
          </label>
          <label>
            Secondary type
            <select name="secondaryType">
              <option value="">None</option>
              <option value="normal">Normal</option>
              <option value="fire">Fire</option>
              <option value="water">Water</option>
              <option value="electric">Electric</option>
              <option value="grass">Grass</option>
              <option value="ice">Ice</option>
              <option value="fighting">Fighting</option>
              <option value="poison">Poison</option>
              <option value="ground">Ground</option>
              <option value="flying">Flying</option>
              <option value="psychic">Psychic</option>
              <option value="bug">Bug</option>
              <option value="rock">Rock</option>
              <option value="ghost">Ghost</option>
              <option value="dragon">Dragon</option>
              <option value="dark">Dark</option>
              <option value="steel">Steel</option>
              <option value="fairy">Fairy</option>
            </select>
          </label>
          <label>HP <input name="hp" type="number" /></label>
          <label>Attack <input name="attack" type="number" /></label>
          <label>Defense <input name="defense" type="number" /></label>
          <label>Sp. attack <input name="specialAttack" type="number" /></label>
          <label>Sp. defense <input name="specialDefense" type="number" /></label>
          <label>Speed <input name="speed" type="number" /></label>
        </div>

        <div class="actions">
          <button type="submit" id="submit-button">Add</button>
          <button type="button" id="cancel-button" hidden>Cancel</button>
        </div>
      </form>

      <h2>My Pokémon</h2>
      <ul id="pokemon-list"></ul>
    </main>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Remplacer **tout le contenu** de `src/style.css` par la feuille de style ci-dessous.

<details>
<summary><strong>src/style.css</strong></summary>

```css
:root {
  color-scheme: light dark;
  --text: #18181b;
  --muted: #71717a;
  --bg: #f4f4f5;
  --surface: #fff;
  --surface-muted: #f4f4f5;
  --border: #e4e4e7;
  --accent: #ef4444;
  --accent-hover: #dc2626;
  --success: #15803d;
  --success-bg: #dcfce7;
  --error: #b91c1c;
  --error-bg: #fee2e2;
  --shadow: 0 1px 2px rgb(0 0 0 / 0.04), 0 4px 12px rgb(0 0 0 / 0.06);
  --shadow-hover: 0 2px 4px rgb(0 0 0 / 0.06), 0 12px 24px rgb(0 0 0 / 0.1);
  --chevron: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");

  font: 16px/1.5 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: var(--text);
  background: var(--bg);
}

@media (prefers-color-scheme: dark) {
  :root {
    --text: #fafafa;
    --muted: #a1a1aa;
    --bg: #09090b;
    --surface: #18181b;
    --surface-muted: #27272a;
    --border: #27272a;
    --accent: #f87171;
    --accent-hover: #ef4444;
    --success: #86efac;
    --success-bg: #14532d;
    --error: #fca5a5;
    --error-bg: #7f1d1d;
    --shadow: 0 1px 2px rgb(0 0 0 / 0.4);
    --shadow-hover: 0 8px 24px rgb(0 0 0 / 0.5);
    --chevron: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

main {
  max-width: 1040px;
  margin: 0 auto;
  padding: 32px 16px 64px;
}

h1 {
  margin: 0 0 16px;
  font-size: 2rem;
  letter-spacing: -0.02em;
}

h2 {
  margin: 0 0 16px;
  font-size: 1.25rem;
}

/* ---------- Message ---------- */

#message {
  margin: 0 0 16px;
  border-radius: 8px;
}

#message.success,
#message.error {
  padding: 10px 14px;
}

#message.success {
  color: var(--success);
  background: var(--success-bg);
}

#message.error {
  color: var(--error);
  background: var(--error-bg);
}

/* ---------- Form ---------- */

form {
  padding: 24px;
  margin-bottom: 40px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow);
}

.fields {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.fields .wide {
  grid-column: 1 / -1;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--muted);
}

input,
select {
  padding: 8px 12px;
  font: inherit;
  font-size: 0.95rem;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: border-color 0.15s, box-shadow 0.15s;
}

/* The native arrow cannot be moved: it is hidden and replaced by a chevron 12px from the edge */
select {
  appearance: none;
  padding-right: 36px;
  background: var(--surface) var(--chevron) no-repeat right 12px center / 16px;
  cursor: pointer;
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.2);
}

input:read-only {
  color: var(--muted);
  background: var(--surface-muted);
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 24px;
}

button {
  padding: 8px 18px;
  font: inherit;
  font-weight: 500;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s, border-color 0.15s;
}

button:hover {
  background: var(--surface-muted);
}

button[type='submit'] {
  color: #fff;
  background: var(--accent);
  border-color: var(--accent);
}

button[type='submit']:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* ---------- List ---------- */

#pokemon-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.pokemon-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 44px 16px 16px;
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow);
  transition: transform 0.15s, box-shadow 0.15s;
}

.pokemon-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.pokemon-card img {
  width: 104px;
  height: 104px;
  padding: 4px;
  background: var(--surface-muted);
  border-radius: 50%;
  image-rendering: pixelated;
}

/* The Poké Ball is smaller than a Pokémon sprite: same circle, more padding */
.pokemon-card img.fallback {
  padding: 32px;
}

.pokemon-card .number {
  margin: 12px 0 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.pokemon-card h3 {
  margin: 0 0 8px;
  font-size: 1.15rem;
  text-transform: capitalize;
  overflow-wrap: anywhere;
}

/* ---------- Edit / Remove icons ---------- */

.card-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 4px;
}

.icon-button {
  width: 34px;
  height: 34px;
  padding: 0;
  color: var(--muted);
  background: transparent;
  border: none;
  border-radius: 8px;
}

/* The SVG is used as a mask: the icon takes the color of the text (currentColor) */
.icon-button::before {
  content: '';
  display: block;
  width: 18px;
  height: 18px;
  margin: auto;
  background: currentColor;
  -webkit-mask: var(--icon) center / contain no-repeat;
  mask: var(--icon) center / contain no-repeat;
}

.icon-edit {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'/%3E%3Cpath d='M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z'/%3E%3C/svg%3E");
}

.icon-delete {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 6h18'/%3E%3Cpath d='M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2'/%3E%3Cpath d='M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6'/%3E%3Cpath d='M10 11v6'/%3E%3Cpath d='M14 11v6'/%3E%3C/svg%3E");
}

.icon-button:hover {
  color: var(--text);
  background: var(--surface-muted);
}

.icon-delete:hover {
  color: var(--error);
  background: var(--error-bg);
}

/* ---------- Types ---------- */

.types {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}

.type {
  padding: 2px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  text-transform: capitalize;
  background: #9ca3af;
  border-radius: 999px;
}

.type[data-type='normal'] { background: #a8a77a; }
.type[data-type='fire'] { background: #ee8130; }
.type[data-type='water'] { background: #6390f0; }
.type[data-type='electric'] { background: #e0b100; }
.type[data-type='grass'] { background: #5fb33f; }
.type[data-type='ice'] { background: #5ec5c0; }
.type[data-type='fighting'] { background: #c22e28; }
.type[data-type='poison'] { background: #a33ea1; }
.type[data-type='ground'] { background: #c9a43f; }
.type[data-type='flying'] { background: #8f7be6; }
.type[data-type='psychic'] { background: #f95587; }
.type[data-type='bug'] { background: #94a516; }
.type[data-type='rock'] { background: #b6a136; }
.type[data-type='ghost'] { background: #735797; }
.type[data-type='dragon'] { background: #6f35fc; }
.type[data-type='dark'] { background: #705746; }
.type[data-type='steel'] { background: #9a9ab5; }
.type[data-type='fairy'] { background: #d685ad; }

/* ---------- Stats ---------- */

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  width: 100%;
  margin: 16px 0 0;
}

.stats div {
  padding: 6px 0;
  background: var(--surface-muted);
  border-radius: 8px;
}

.stats dt {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.stats dd {
  margin: 0;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
```

</details>

Dans `src/types/pokemon.types.ts`, créé à l'exercice 2, ajouter à la suite de l'interface `Pokemon` le type du corps d'un `PUT` :

```ts
// The body of a PUT: every field except the id, which is in the URL
export type PokemonInput = Omit<Pokemon, 'id'>;
```

`Omit<Pokemon, 'id'>` crée un type identique à `Pokemon`, sans la propriété `id` : c'est l'équivalent TypeScript du `pokemonSchema.omit({ id: true })` de l'exercice 7. `PokemonInput` décrit donc exactement la même chose que le type `PokemonUpdate` du serveur ; on l'appelle ici « input », car c'est aussi ce que la page lit dans le formulaire.

Créer `src/api.ts`. Seule `fetchPokemons` est écrite : c'est celle de l'exercice 2, qui vérifie maintenant `response.ok`. Les trois autres fonctions lèvent une erreur en attendant que vous les écriviez.

```ts
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

export async function deletePokemon(_id: number): Promise<void> {
  throw new Error('deletePokemon is not implemented yet.');
}

export async function createPokemon(_pokemon: Pokemon): Promise<Pokemon> {
  throw new Error('createPokemon is not implemented yet.');
}

export async function updatePokemon(_id: number, _input: PokemonInput): Promise<Pokemon> {
  throw new Error('updatePokemon is not implemented yet.');
}
```

`getErrorMessage` lit le corps d'une réponse en erreur et renvoie le **message** envoyé par votre API (par exemple `'Invalid Pokemon data.'`). Si le corps n'est pas du JSON, comme pour une erreur `500` d'Express, elle renvoie `HTTP Error 500`. Comme elle lit le corps de la réponse, elle est `async` : il faut l'appeler avec `await`.

Toutes les fonctions de ce fichier traitent les erreurs de la même façon, comme `fetchPokemons` :

```ts
if (!response.ok) {
  throw new Error(await getErrorMessage(response));
}
```

C'est ce message que la page affichera en rouge. Si vous oubliez le `await`, TypeScript le signale : `getErrorMessage` renvoie une promesse, et `new Error(...)` attend un texte.

Remplacer **tout le contenu** de `src/main.ts` par le code ci-dessous. Il remplace `checkApi` : si l'API ne répond pas, la page affiche « API unreachable ❌ ».

<details>
<summary><strong>src/main.ts</strong></summary>

```ts
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
```

</details>

> **Point de contrôle** : la page affiche les Pokémon de votre base. Un clic sur l'icône de poubelle affiche en rouge « deletePokemon is not implemented yet. ». Si l'on arrête l'API puis recharge la page, elle affiche « API unreachable ❌ ».

### 2. Supprimer un Pokémon

Dans `src/api.ts`, écrire `deletePokemon(id)` (renommer le paramètre `_id` en `id` : le `_` indique seulement à TypeScript qu'un paramètre n'est pas encore utilisé). Elle doit :

1. envoyer `DELETE /api/pokemons/:id`. Pour appeler une méthode autre que `GET`, on la précise dans l'objet passé en second paramètre de `fetch` : `fetch(url, { method: 'DELETE' })` ;
2. si `response.ok` est faux, lever une erreur avec le message de l'API, comme dans `fetchPokemons`.

Attention : en cas de succès, votre API répond `204` **sans corps**. Il n'y a rien à lire : appeler `response.json()` lèverait une erreur.

Tester en supprimant un Pokémon : il disparaît de la liste, et « … removed. » s'affiche en vert.

<details>
<summary><strong>Besoin d'aide ?</strong></summary>

```ts
export async function deletePokemon(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/pokemons/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}
```

</details>

### 3. Ajouter un Pokémon

Écrire `createPokemon(pokemon)`. Elle envoie `POST /api/pokemons` avec le Pokémon en JSON, puis renvoie le Pokémon créé par l'API.

Comme dans `requests.http`, la requête a besoin de trois choses : une **méthode**, un **en-tête** `Content-Type: application/json` et un **corps**. Avec `fetch`, toutes les trois se placent dans l'objet passé en second paramètre :

```ts
const response = await fetch(url, {
  method: '...',
  headers: { 'Nom-De-L-En-Tete': 'valeur' },
  body: ...,
});
```

- `headers` est un objet : chaque propriété est un en-tête ;
- `body` doit être du **texte** : `fetch` n'envoie pas un objet JavaScript tel quel. `JSON.stringify(pokemon)` le convertit en texte JSON, exactement comme celui que vous écriviez dans `requests.http`.

Ensuite, comme dans `fetchPokemons` : si `response.ok` est faux, lever une erreur avec le message de l'API, sinon renvoyer `response.json()`.

Tester avec le formulaire :

1. ajouter Squirtle (id `7`, sprite `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png`, type principal « Water », statistiques `44`, `48`, `65`, `50`, `64`, `43`) : il apparaît dans la liste ;
2. ajouter Squirtle **une seconde fois** : « This Pokemon is already in your Pokédex. » s'affiche ;
3. cliquer sur « Add » sans remplir les champs : « Invalid Pokemon data. » s'affiche.

Le formulaire porte l'attribut `novalidate` : le navigateur ne vérifie rien, et c'est la validation Zod de votre API qui refuse les données. Une vérification dans le navigateur améliorerait le confort de l'utilisateur, mais ne protégerait rien : n'importe qui peut appeler votre API sans passer par votre page.

**Question** : en cas de `400` ou de `409`, `fetch` ne lève pas d'erreur. Pourquoi faut-il alors vérifier `response.ok` ? Que se passerait-il, au point 2, sans cette vérification ?

<details>
<summary><strong>Réponse</strong></summary>

`fetch` ne lève une erreur que si la requête n'a pas pu aboutir (API arrêtée, réseau coupé, CORS refusé). Un `400` ou un `409` est une réponse comme une autre : c'est au code de regarder son statut.

Sans la vérification, `createPokemon` renverrait le corps de l'erreur (`{ error: '...' }`) comme s'il s'agissait d'un Pokémon : la page afficherait « squirtle added. », alors que rien n'a été ajouté.

</details>

<details>
<summary><strong>Besoin d'aide ?</strong></summary>

```ts
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
```

</details>

### 4. Modifier un Pokémon

Écrire `updatePokemon(id, input)`. Elle envoie `PUT /api/pokemons/:id`, avec `input` en JSON, puis renvoie le Pokémon modifié.

Elle a exactement la même structure que `createPokemon` : seules changent la méthode, l'URL (qui contient l'`id`) et l'objet envoyé dans le corps (`input`).

Tester : cliquer sur l'icône de crayon de Squirtle, remplacer son sprite par sa version chromatique (`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/7.png`), puis cliquer sur « Save ». Essayer aussi de vider son nom : la modification est refusée.

<details>
<summary><strong>Besoin d'aide ?</strong></summary>

```ts
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
```

</details>

### 5. Observer : une donnée valide peut rester dangereuse

Ajouter un Pokémon, avec des valeurs valides partout et ce nom piégé :

- id `999`, nom `<img src="x" onerror="alert('Hacked!')">`

Zod l'accepte : c'est une chaîne non vide. La page affiche pourtant le nom tel quel, sous forme de texte, et aucune alerte n'apparaît.

**Question** : `createPokemonItem` construit la carte avec `createElement` et `textContent`. Que se passerait-il si elle utilisait `` item.innerHTML = `<h3>${pokemon.name}</h3>…` `` ?

<details>
<summary><strong>Réponse</strong></summary>

Le navigateur interpréterait le nom comme du HTML : il créerait une image, dont le chargement échoue, et exécuterait le code de `onerror`. Ce code s'exécuterait chez **chaque visiteur** de la page, puisque le nom est stocké dans la base : c'est une faille **XSS** (*cross-site scripting*). Au lieu d'une alerte, il pourrait envoyer les données de la page à un autre serveur, ou agir à la place de l'utilisateur.

Au TP2, la fiche était construite avec `innerHTML` à partir des données de la PokéAPI : un service que vous ne contrôlez pas, mais où personne ne peut écrire n'importe quoi. Ici, **n'importe quel client** de votre API peut écrire un nom avec un `POST`. Toute donnée écrite par un utilisateur doit être affichée avec `textContent`.

</details>

Supprimer ce Pokémon.

> **Point de contrôle** : depuis la page, on peut ajouter, modifier et supprimer un Pokémon. Les erreurs de l'API (`400`, `409`) s'affichent en rouge avec son message. Les données sont toujours là après un rechargement de la page et un redémarrage de l'API.

---
