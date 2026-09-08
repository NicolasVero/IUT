# 📘 Fiche de Révision JavaScript

---

## 📋 Table des matières

- [📘 Fiche de Révision JavaScript](#-fiche-de-révision-javascript)
  - [📋 Table des matières](#-table-des-matières)
  - [🧠 Connaissances générales](#-connaissances-générales)
    - [À quoi sert JavaScript ?](#à-quoi-sert-javascript-)
    - [Qu'est-ce qu'ECMAScript ?](#quest-ce-quecmascript-)
    - [Caractéristique de JavaScript](#caractéristique-de-javascript)
    - [Quelle est la différence entre `null` et `undefined` ?](#quelle-est-la-différence-entre-null-et-undefined-)
    - [Quelle est la différence entre `==` et `===` ?](#quelle-est-la-différence-entre--et--)
    - [Qu'est-ce qu'une valeur truthy ou falsy ?](#quest-ce-quune-valeur-truthy-ou-falsy-)
  - [📦 Variables, types et portée](#-variables-types-et-portée)
    - [Quelle est la différence entre `let`, `var` et `const` ?](#quelle-est-la-différence-entre-let-var-et-const-)
    - [Qu'est-ce qu'un template string ?](#quest-ce-quun-template-string-)
    - [Qu'est-ce que le scope (portée) d'une variable ?](#quest-ce-que-le-scope-portée-dune-variable-)
    - [Qu'est-ce que la conversion de type implicite (coercition) ?](#quest-ce-que-la-conversion-de-type-implicite-coercition-)
    - [Quelles expressions génèrent une erreur ?](#quelles-expressions-génèrent-une-erreur-)
    - [Quelle est la différence entre un objet et un tableau ?](#quelle-est-la-différence-entre-un-objet-et-un-tableau-)
    - [Le destructuring](#le-destructuring)
    - [Les méthodes de tableaux](#les-méthodes-de-tableaux)
  - [⚙️ Fonctions \& logique](#️-fonctions--logique)
    - [Qu'est-ce qu'une condition ?](#quest-ce-quune-condition-)
    - [Qu'est-ce qu'une boucle ?](#quest-ce-quune-boucle-)
    - [Qu'est-ce qu'une fonction ?](#quest-ce-quune-fonction-)
    - [Qu'est-ce qu'une Promise ?](#quest-ce-quune-promise-)
    - [Qu'est-ce qu'une fonction asynchrone ?](#quest-ce-quune-fonction-asynchrone-)
    - [Qu'est-ce que `try`, `catch`, `finally` et `throw` ?](#quest-ce-que-try-catch-finally-et-throw-)
  - [📦 Modules JavaScript](#-modules-javascript)
    - [Qu'est-ce qu'un module ?](#quest-ce-quun-module-)
    - [Export nommé (`export`)](#export-nommé-export)
    - [Export par défaut (`export default`)](#export-par-défaut-export-default)
    - [Combiner export nommé et export default](#combiner-export-nommé-et-export-default)
    - [Tout importer (`* as`)](#tout-importer--as)
  - [🌐 Manipulation du DOM et événements](#-manipulation-du-dom-et-événements)
    - [Comment sélectionner un élément HTML depuis JavaScript ?](#comment-sélectionner-un-élément-html-depuis-javascript-)
    - [Qu'est-ce qu'un écouteur d'événement ?](#quest-ce-quun-écouteur-dévénement-)
    - [Comment empêcher le comportement par défaut d'un événement ?](#comment-empêcher-le-comportement-par-défaut-dun-événement-)
    - [Qu'est-ce qu'une API ?](#quest-ce-quune-api-)

---

## 🧠 Connaissances générales

### À quoi sert JavaScript ?

JavaScript est un langage de programmation principalement utilisé pour rendre les pages web **interactives** côté client (dans le navigateur). Il peut aussi s'exécuter côté serveur grâce à **Node.js**. Il permet de manipuler le DOM, gérer des événements, communiquer avec des APIs, créer des animations, etc.

---

### Qu'est-ce qu'ECMAScript ?

**ECMAScript** (ou ES) est la **spécification standardisée** sur laquelle est basé JavaScript. C'est l'organisme **ECMA International** (via le comité TC39) qui définit les règles du langage.

JavaScript est l'**implémentation** la plus connue d'ECMAScript.

| Version | Nom courant | Année | Nouveautés clés                                     |
| ------- | ----------- | ----- | --------------------------------------------------- |
| ES5     | ES5         | 2009  | `strict mode`, `JSON`                               |
| ES6     | ES2015      | 2015  | `let/const`, arrow functions, classes, modules      |
| ES2017  | ES8         | 2017  | `async/await`                                       |
| ES2020+ | ES2020+     | 2020+ | `nullish coalescing (??)`, `optional chaining (?.)` |

---

### Caractéristique de JavaScript

| Caractéristique                        | ✅ / ❌ |
| -------------------------------------- | ------- |
| Compilé                                | ❌      |
| **Interprété**                         | ✅      |
| Un langage côté serveur (avec Node.js) | ✅      |
| **Un langage côté client**             | ✅      |
| **Faiblement typé**                    | ✅      |
| Fortement typé                         | ❌      |

JavaScript est **interprété** : le code est exécuté ligne par ligne sans phase de compilation préalable.  
Il est **faiblement typé** : les types des variables peuvent changer dynamiquement.

---

### Quelle est la différence entre `null` et `undefined` ?

|                      | `null`                               | `undefined`                                |
| -------------------- | ------------------------------------ | ------------------------------------------ |
| **Signification**    | Absence de valeur **intentionnelle** | Variable déclarée mais **non initialisée** |
| **Qui le définit ?** | Le développeur                       | JavaScript lui-même                        |

```js
let a; // undefined (non initialisée)
let b = null; // null (volontairement vide)

console.log(typeof a); // "undefined"
console.log(typeof b); // "object"
```

---

### Quelle est la différence entre `==` et `===` ?

| Opérateur | Nom             | Comportement                                     |
| --------- | --------------- | ------------------------------------------------ |
| `==`      | Égalité faible  | Compare les **valeurs** après conversion de type |
| `===`     | Égalité stricte | Compare les **valeurs ET les types**             |

```js
5 == "5"; // true  (conversion implicite)
5 === "5"; // false (types différents : number vs string)

null == undefined; // true
null === undefined; // false
```

> 💡 **Bonne pratique** : toujours préférer `===` pour éviter les comparaisons surprenantes.

---

### Qu'est-ce qu'une valeur truthy ou falsy ?

En JavaScript, toute valeur peut être évaluée comme `true` ou `false` dans un contexte booléen (condition, boucle...). On parle de valeur **truthy** ou **falsy**.

**Valeurs falsy** (évaluées à `false`) :

| Valeur      | Type        |
| ----------- | ----------- |
| `false`     | boolean     |
| `0`, `-0`   | number      |
| `""`        | string vide |
| `null`      | null        |
| `undefined` | undefined   |
| `NaN`       | number      |

**Toutes les autres valeurs sont truthy**, y compris `[]`, `{}`, `"0"`, `-1`.

---

## 📦 Variables, types et portée

### Quelle est la différence entre `let`, `var` et `const` ?

|                  | `var`    | `let`     | `const`   |
| ---------------- | -------- | --------- | --------- |
| **Portée**       | Fonction | Bloc `{}` | Bloc `{}` |
| **Réassignable** | ✅       | ✅        | ❌        |
| **Redéclarable** | ✅       | ❌        | ❌        |

```js
var x = 1;
let y = 2;
const z = 3;

if (true) {
  var x = 10; // modifie le x global
  let y = 20; // nouveau y local au bloc
}

console.log(x); // 10 (var "fuite" hors du bloc)
console.log(y); // 2  (let reste dans son bloc)
```

> 💡 **Bonne pratique** : utiliser `const` par défaut, `let` si la variable doit changer, et éviter `var`.

---

### Qu'est-ce qu'un template string ?

Les **template string** sont une syntaxe ES6 introduite avec les **backticks** (`` ` ``) qui permettent :

- d'**interpoler** des variables ou expressions directement dans une chaîne
- d'écrire des chaînes **multi-lignes** sans `\n`

```js
// Interpolation avec ${}
const message = `Hi, I'm ${name} and I'm ${age} yo.`;

// Sans interpolation
const message = "Hi, I'm " + name + " and I'm " + age + " yo.";

// Chaîne multi-ligne
const html = `
  <div>
    <p>${name}</p>
  </div>
`;
```

---

### Qu'est-ce que le scope (portée) d'une variable ?

Le **scope** définit **où** une variable est accessible dans le code.

| Type de scope | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| **Global**    | Accessible partout dans le programme                         |
| **Fonction**  | Accessible uniquement dans la fonction où elle est déclarée  |
| **Bloc**      | Accessible uniquement dans le bloc `{}` (avec `let`/`const`) |

```js
const global = "I'm global";

function foo() {
  const local = "I'm local";
  console.log(global); // ✅ accessible
  console.log(local); // ✅ accessible
}

console.log(global); // ✅ accessible
console.log(local); // ❌ ReferenceError
```

---

### Qu'est-ce que la conversion de type implicite (coercition) ?

La **conversion de type implicite** (ou _type coercion_) est le mécanisme par lequel JavaScript **convertit automatiquement** une valeur d'un type vers un autre. Concrètement, lorsqu'un développeur va chercher à faire un calcul en mélangeant deux
types différents, le moteur d'exécution va vouloir tout faire pour éviter de déclencher une
erreur. Et pour ça, il va chercher à "convertir" automatiquement chaque valeur pour
réussir à retourner un résultat.

1. On regarde l'opérateur utilisé (+, -, /, \*, ...)
2. On regarde si l'opérateur existe pour chaque valeur utilisée dans le calcul
3. Si une des valeurs n'est pas compatible avec l'opérateur elle est alors convertie dans un
   type compatible (ex. la chaîne "12" n'est pas compatible avec l'opérateur "-" JS va donc
   convertir la chaîne "12" en nombre pour pouvoir effectuer l'opération)

---

### Quelles expressions génèrent une erreur ?

| Expression              | Résultat                    | Erreur ?                                   |
| ----------------------- | --------------------------- | ------------------------------------------ |
| `"10" + 1`              | `"101"`                     | ❌ (concaténation de chaînes)              |
| `"10" - 1`              | `9`                         | ❌ (conversion implicite en nombre)        |
| `"10" * new Date()`     | `NaN`                       | ❌ (résultat `NaN`, pas une exception)     |
| `"Hello" - 8 + "World"` | `NaN"World"` → `"NaNWorld"` | ❌ (pas d'erreur, mais résultat inattendu) |

> ⚠️ Aucune de ces expressions ne génère une erreur grâce à la conversion de type implicite.

---

### Quelle est la différence entre un objet et un tableau ?

|         | **Objet**                                   | **Tableau**                     |
| ------- | ------------------------------------------- | ------------------------------- |
| Syntaxe | `{ clé: valeur }`                           | `[valeur1, valeur2]`            |
| Clés    | Chaînes de caractères (nommées)             | Indices numériques (0, 1, 2...) |
| Usage   | Données structurées avec propriétés nommées | Liste ordonnée d'éléments       |

```js
const object = { name: "Alice", age: 25 };
const array = ["Alice", "Bob", "Charlie"];

console.log(object.name); // "Alice"
console.log(array[0]); // "Alice"
```

---

### Le destructuring

```js
// Destructuring d'objet
const user = {
  name: "Alice",
  age: 25,
  hasJob: true,
};

const { name, age } = user;

// Avec renommage : variable : nouveauNom
const { name: userName, age: userAge } = user;
console.log(userName); // "Alice"
console.log(userAge); // 25

// Avec valeur par défaut
const { name, city = "Paris" } = user;
console.log(city); // "Paris" (car absent de l'objet)

// Destructuring de tableau
const [a, b] = [1, 2, 3];
```

---

### Les méthodes de tableaux

JavaScript propose de nombreuses méthodes natives pour manipuler les tableaux.

| Méthode                          | Valeur de retour | Tableau modifié |
| -------------------------------- | ---------------- | --------------- |
| 🍔🍟🍕🥪.push(🍔)                | 5                | 🍔🍟🍕🥪🍔      |
| 🍔🍟🍕🥪.pop()                   | 🥪               | 🍔🍟🍕          |
| 🍔🍟🍕🥪.unshift(🍔)             | 5                | 🍔🍔🍟🍕🥪      |
| 🍔🍟🍕.map(e => e + '🎉')        | 🍔🎉🍟🎉🍕🎉     | 🍔🍟🍕          |
| 🍔🍟🍕🍔.filter(e => e !== '🍔') | 🍟🍕             | 🍔🍟🍕🍔        |
| 🍔🍟🍕.reduce((acc, e) => acc)   | 🍔               | 🍔🍟🍕          |
| 🍔🍟🍕.find(e => e === '🍟')     | 🍟               | 🍔🍟🍕          |
| 🍔🍟🍕.some(e => e === '🍟')     | true             | 🍔🍟🍕          |
| 🍔🍟🍕.every(e => e === '🍔')    | false            | 🍔🍟🍕          |
| 🍔🍟🍕🥪.slice(1, 3)             | 🍟🍕             | 🍔🍟🍕🥪        |
| 🥪🍕🍔🍟.sort()                  | 🍔🍟🍕🥪         | 🍔🍟🍕🥪        |
| 🍔🍟🍕.join('')                  | '🍔🍟🍕'         | 🍔🍟🍕          |

---

## ⚙️ Fonctions & logique

### Qu'est-ce qu'une condition ?

Une **condition** est une structure qui permet d'exécuter du code **seulement si** une expression est vraie.

```js
if (age >= 18) {
  console.log("Major");
} else {
  console.log("Minor");
}

// Ternaire
const status = age >= 18 ? "Major" : "Minor";

// Switch
switch (day) {
  case "Monday":
    console.log("Early this week");
    break;
  default:
    console.log("Another day");
}
```

---

### Qu'est-ce qu'une boucle ?

Une **boucle** permet de **répéter** un bloc de code plusieurs fois, tant qu'une condition est vraie.

```js
// for : nombre d'itérations connu
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}

// while : condition vérifiée avant chaque itération
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}

// forEach : pour parcourir un tableau
[1, 2, 3].forEach((n) => console.log(n));
```

---

### Qu'est-ce qu'une fonction ?

Une **fonction** est un bloc de code **réutilisable** qui effectue une tâche précise. Elle peut recevoir des **paramètres** en entrée et **retourner** une valeur.

```js
// Déclaration classique
function addition(a, b) {
  return a + b;
}

// Expression de fonction
const addition = function (a, b) {
  return a + b;
};

// Fonction fléchée (arrow function) — ES6
const addition = (a, b) => a + b;

console.log(addition(3, 4)); // 7
```

---

### Qu'est-ce qu'une Promise ?

Une **Promise** (promesse) est un objet représentant la **valeur future** d'une opération asynchrone. Elle peut être dans l'un de ces 3 états :

| État        | Description                                       |
| ----------- | ------------------------------------------------- |
| `pending`   | En attente, l'opération n'est pas encore terminée |
| `fulfilled` | Résolue avec succès, la valeur est disponible     |
| `rejected`  | Échouée, une erreur est disponible                |

```js
// Créer une Promise
const promise = new Promise((resolve, reject) => {
  const success = true;
  if (success) {
    resolve("Data received!");
  } else {
    reject(new Error("Something went wrong"));
  }
});

// Consommer une Promise avec .then() / .catch()
promise
  .then((data) => console.log(data)) // "Données reçues !"
  .catch((err) => console.error(err)) // si rejetée
  .finally(() => console.log("Terminé")); // toujours exécuté

// Plusieurs Promises en parallèle
Promise.all([fetch("/api/users"), fetch("/api/posts")]).then(([users, posts]) =>
  console.log(users, posts),
);
```

---

### Qu'est-ce qu'une fonction asynchrone ?

Une **fonction asynchrone** permet d'exécuter des opérations qui prennent du temps (appels réseau, lecture de fichiers...) **sans bloquer** l'exécution du reste du programme.

- Mot-clé pour la définir : **`async`**
- Mot-clé pour attendre un résultat : **`await`**

```js
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error :", error);
  }
}

fetchData();
```

- `async/await` est du sucre syntaxique par-dessus les Promises : sous le capot, une fonction `async` retourne toujours une Promise
- `await` ne peut être utilisé qu'à l'intérieur d'une fonction `async`.

---

### Qu'est-ce que `try`, `catch`, `finally` et `throw` ?

Le bloc `try...catch` permet de **gérer les erreurs** sans interrompre brutalement le programme. L'instruction `throw` permet de **lancer manuellement** une erreur.

| Bloc / Instruction | Rôle                                                    |
| ------------------ | ------------------------------------------------------- |
| `try`              | Contient le code susceptible de générer une erreur      |
| `catch`            | Exécuté si une erreur est levée dans le bloc `try`      |
| `finally`          | Toujours exécuté, qu'il y ait eu une erreur ou non      |
| `throw`            | Lance une erreur manuellement (n'importe quelle valeur) |

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }

  return a / b;
}

try {
  const result = divide(10, 0);
  console.log(result);
} catch (error) {
  console.error("Error:", error.message); // 'Division by zero is not allowed'
} finally {
  console.log("End of execution ");
}
```

On peut aussi `throw` des types personnalisés :

```js
throw new TypeError("Invalid type");
throw new RangeError("Out of bounds");
throw { code: 404, message: "Not found" };
```

> 💡 `try...catch` est particulièrement utile avec `async/await` pour capturer les erreurs des Promises rejetées (comme dans l'exemple de `fetchData` ci-dessus).

---

## 📦 Modules JavaScript

### Qu'est-ce qu'un module ?

Un **module** est un fichier JavaScript indépendant qui peut **exporter** des valeurs (variables, fonctions, classes...) pour qu'elles soient utilisées dans d'autres fichiers via des **imports**.

Les modules permettent de **découper le code** en fichiers réutilisables et d'éviter la pollution du scope global.

> ℹ️ Les modules ES natifs nécessitent `type="module"` dans la balise `<script>`, ou sont gérés automatiquement par les bundlers (Vite, Webpack) et Node.js.

---

### Export nommé (`export`)

Un **export nommé** permet d'exporter plusieurs valeurs depuis un même fichier. L'import doit utiliser le **même nom** que l'export.

```js
// math.js
export const PI = 3.14;

export function add(a, b) {
  return a + b;
}

export class Circle {
  constructor(radius) {
    this.radius = radius; // rayon du cercle
  }
}
```

```js
// main.js
import { PI, add, Circle } from "./math.js";

console.log(PI); // 3.14
console.log(add(2, 3)); // 5
```

On peut **renommer** lors de l'import avec `as` :

```js
import { add as sum } from "./math.js";
console.log(sum(2, 3)); // 5
```

---

### Export par défaut (`export default`)

Un fichier ne peut avoir **qu'un seul** export par défaut. Il représente la valeur principale du module. Lors de l'import, on peut lui donner **n'importe quel nom**.

```js
// greet.js
export default function greet(name) {
  return `Hello, ${name}!`;
}
```

```js
// main.js
import greet from "./greet.js"; // nom libre au choix
import sayHello from "./greet.js"; // fonctionne aussi

console.log(greet("Alice")); // "Hello, Alice!"
```

---

### Combiner export nommé et export default

Un même module peut avoir à la fois des exports nommés et un export par défaut.

```js
// api.js
export const BASE_URL = "https://api.example.com"; // URL de base

export function formatResponse(data) {
  return JSON.stringify(data);
}

export default async function fetchUser(id) {
  const response = await fetch(`${BASE_URL}/users/${id}`);
  return response.json();
}
```

```js
// main.js — import par défaut ET imports nommés sur la même ligne
import fetchUser, { BASE_URL, formatResponse } from "./api.js";
```

---

### Tout importer (`* as`)

On peut importer **tous les exports nommés** d'un module en un seul objet :

```js
// main.js
import * as MathUtils from "./math.js";

console.log(MathUtils.PI); // 3.14
console.log(MathUtils.add(2, 3)); // 5
```

---

## 🌐 Manipulation du DOM et événements

### Comment sélectionner un élément HTML depuis JavaScript ?

```js
// Par ID (retourne un seul élément)
const element = document.getElementById("my-id");

// Par classe (retourne une HTMLCollection)
const elements = document.getElementsByClassName("my-class");

// Par sélecteur CSS (retourne le premier)
const element = document.querySelector(".my-class");

// Par sélecteur CSS (retourne tout)
const elements = document.querySelectorAll("p.intro");
```

---

### Qu'est-ce qu'un écouteur d'événement ?

Un **écouteur d'événement** (event listener) est une fonction qui **attend** qu'un événement particulier se produise sur un élément (clic, saisie, survol...). Quand cet événement se produit, l'écouteur d'événement appelle une fonction de callback.

```js
const button = document.querySelector("#my-button");

button.addEventListener("click", function (event) {
  console.log("Clicked!");
});

// Avec une arrow function
button.addEventListener("click", (e) => {
  console.log("Clicked!", e.target);
});

// Supprimer un écouteur
button.removeEventListener("click", foo);
```

| Événement                   | Déclencheur                                                                  | Cas d'usage                                                          |
| :-------------------------- | :--------------------------------------------------------------------------- | :------------------------------------------------------------------- |
| `click`                     | Un clic complet (enfoncé puis relâché).                                      | Boutons, liens, ouverture de menus.                                  |
| `mouseenter` / `mouseleave` | Le curseur entre ou sort de la zone de l'élément.                            | Menus déroulants, effets de survol (hover).                          |
| `keydown`                   | Une touche du clavier est enfoncée.                                          | Raccourcis clavier, déplacement dans un jeu, validation (`Enter`).   |
| `keyup`                     | Une touche est relâchée.                                                     | Recherche en temps réel, vérification de la longueur d'un champ.     |
| `submit`                    | Envoi d'un formulaire (bouton submit ou `Enter`).                            | Validation de formulaire, `e.preventDefault()`.                      |
| `input`                     | La valeur d'un `<input>`, `<textarea>` ou `select` change **en direct**.     | Compteur de caractères, recherche instantanée.                       |
| `change`                    | La valeur change et l'élément perd le focus (ou case cochée/option choisie). | Cases à cocher, boutons radio, sélecteurs de fichier.                |
| `DOMContentLoaded`          | Le HTML est complètement chargé et analysé (sans attendre les images).       | Initialiser le script dès que le DOM est prêt.                       |
| `scroll`                    | Défilement de la page ou d'un conteneur `overflow`.                          | Animations au scroll, bouton "Retour en haut", barre de progression. |
| `resize`                    | Redimensionnement de la fenêtre du navigateur.                               | Réadaptation dynamique d'éléments (carrousels, canvas).              |

---

### Comment empêcher le comportement par défaut d'un événement ?

La méthode **`event.preventDefault()`** annule l'action native du navigateur associée à l'événement.

```js
// Empêcher la soumission d'un formulaire
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
});

// Empêcher un lien de naviguer
document.querySelector("a").addEventListener("click", (e) => {
  e.preventDefault();
});
```

---

### Qu'est-ce qu'une API ?

Une **API** (Application Programming Interface) est un ensemble de règles et d'outils qui permettent à deux logiciels de **communiquer entre eux**.

En développement web, on parle souvent d'**API REST** (ou Web API) : un serveur expose des **endpoints** (URLs) auxquels on peut envoyer des requêtes HTTP pour récupérer ou envoyer des données (souvent en JSON).

```js
// Appel d'une API avec fetch
async function getUser(id) {
  const response = await fetch(`https://api.example.com/users/${id}`);
  const user = await response.json();
  return user;
}

// Utilisation
getUser(1).then((user) => console.log(user.name));
```

> Les APIs permettent par exemple d'afficher la météo, de payer en ligne, de se connecter avec Google, d'envoyer des emails, etc.

## 🌟 Bonnes pratiques en JavaScript

### Utiliser les "early returns" pour simplifier le code

Les **early returns** permettent de rendre votre code plus lisible et d'éviter les niveaux d'imbrication inutiles. Cela consiste à retourner une valeur ou à sortir d'une fonction dès que possible, lorsque certaines conditions sont remplies.

#### Exemple sans early return (moins lisible) :

```js
function checkUser(user) {
  if (user) {
    if (user.isActive) {
      if (user.role === "admin") {
        // code
      } else {
        throw new Error("Current user is not admin");
      }
    } else {
      throw new Error("User is not active");
    }
  } else {
    throw new Error("User is not defined");
  }
}
```

#### Exemple avec early return (plus lisible) :

```js
function checkUser(user) {
  if (!user) {
    throw new Error("User is not defined");
  }

  if (!user.isActive) {
    throw new Error("User is not active");
  }

  if (user.role !== "admin") {
    throw new Error("Current user is not admin");
  }

  // code
}
```

### Eviter les structure if else inutiles avec return

Lorqu'une fonction rencontre le mot clé return, celle-ci s'intérront imédiattement. Il n'est donc pas utile d'y ajouter de structures complexes avec else.

```js
function foo() {
  if (true) {
    return true;
  } else {
    return false;
  }
}
```

```js
function foo() {
  if (true) {
    return true;
  }

  return false;
}
```

### Eviter le return boolean explicites

Etant donné qu’une condition ne s'exécutera que si le code dans l’instruction if vaut true, il est inutile de complexifier le processus.

```js
function isSunday() {
  const today = new Date();

  if (today.getDay() === 0) {
    return true;
  }

  return false;
}
```

```js
function isSunday() {
  const today = new Date();
  return today.getDay() === 0;
}
```

#### Utiliser une structure ternaire

L'opérateur ternaire permet d'éviter d'avoir des conditions verbeuses pour une assignation de valeur à une variable.

```js
let tax;

if (price < 50) {
  tax = 0.05;
} else {
  tax = 0.02;
}
```

```js
const tax = price < 50 ? 0.05 : 0.02;
```

#### L'opérateur de coalescence / OU logique

L'opérateur de coalescence permet de remplacer une valeur par une autre si celle-ci est **null** ou **undefined**.

```js
const name = getName() ?? "Alice"; // Si getName() retourne null, alors name vaudra Alice
```

L'opérateur OU logique (||) permet de remplacer une valeur si celle-ci est falsy.

```js
const value = 0 || 10; // Value vaut 10 car 0 est falsy
```
