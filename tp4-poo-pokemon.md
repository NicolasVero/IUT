# TP 4 : Découverte de la Programmation Orientée Objet en TypeScript

## Sommaire

- [TP 4 : Découverte de la Programmation Orientée Objet en TypeScript](#tp-4--découverte-de-la-programmation-orientée-objet-en-typescript)
  - [Sommaire](#sommaire)
  - [Exercice 0 : Mise en place](#exercice-0--mise-en-place)
  - [Exercice 1 : Première classe Pokémon](#exercice-1--première-classe-pokémon)
  - [Exercice 2 : Méthodes d'instance](#exercice-2--méthodes-dinstance)
  - [Exercice 3 : Encapsulation](#exercice-3--encapsulation)
  - [Exercice 4 : Membres statiques](#exercice-4--membres-statiques)
  - [Exercice 5 : Classe Skill et composition](#exercice-5--classe-skill-et-composition)
  - [Exercice 6 : Combat](#exercice-6--combat)
  - [Pour aller plus loin](#pour-aller-plus-loin)

Jusqu'ici, les Pokémon étaient de simples **données** : des réponses de la PokéAPI au TP2, des lignes de la base SQLite au TP3. On les décrivait avec des `interface` et des `type`, et toute la logique était écrite dans des fonctions à part.

Dans ce TP, on regroupe les données **et** le comportement dans une même structure : la **classe**. Une classe est un plan de construction : elle définit les propriétés et les méthodes d'un objet, et permet d'en créer autant d'exemplaires que l'on veut. Ce TP introduit les bases de la **programmation orientée objet** (POO) : classes, instances, méthodes, encapsulation, membres statiques et composition.

L'application à construire : un simulateur de combat Pokémon au tour par tour, affiché dans la console du navigateur.

---

## Exercice 0 : Mise en place

### Objectif

Initialiser un nouveau projet Vite TypeScript.

### Instructions

1. Dans le terminal, créer un nouveau projet Vite :

```bash
npm create vite@latest tp4 -- --template vanilla-ts --no-install
cd tp4
npm install
```

2. Supprimer **le contenu** du fichier `src/main.ts` et supprimer tous les autres éléments du dossier `src/`.

3. Remplacer le contenu du fichier `index.html` par :

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Battle Simulator</title>
  </head>
  <body>
    <h1>Battle Simulator</h1>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

4. Lancer le serveur de développement, ouvrir la page et sa console :

```bash
npm run dev
```

---

## Exercice 1 : Première classe Pokémon

<details>
<summary><strong>Cours : qu'est-ce qu'une classe ?</strong></summary>

> ### Une classe, des instances
>
> Une **classe** est un **plan de construction** : elle décrit ce qu'un objet contient et ce qu'il sait faire, mais ce n'est pas elle-même un objet. À partir de ce plan, on fabrique autant d'objets que l'on veut : ce sont les **instances** de la classe.
>
> ```
>               class Dog                (le plan)
>         ┌──────────────────────┐
>         │ name: string         │
>         │ age: number          │
>         │ birthday(): void     │
>         └──────────────────────┘
>              new │      │ new
>                  ▼      ▼
>   ┌────────────────┐  ┌────────────────┐
>   │ name: 'Rex'    │  │ name: 'Medor'  │   (deux instances)
>   │ age: 3         │  │ age: 7         │
>   └────────────────┘  └────────────────┘
> ```
>
> Toutes les instances ont la **même structure** (un `name`, un `age`), mais chacune possède **ses propres valeurs**.
>
> ### Attributs et méthodes
>
> Une classe regroupe deux choses :
>
> - des **attributs** : les données de l'objet (`name`, `age`) ;
> - des **méthodes** : les actions que l'objet sait faire (`birthday()`), c'est-à-dire des fonctions rattachées à l'objet.
>
> On y accède avec un point, sur une instance : `rex.name`, `rex.birthday()`.
>
> ### Un exemple complet
>
> ```ts
> class Dog {
>   // 1. Les attributs : déclarés avec leur type
>   public name: string;
>   public age: number;
>
>   // 2. Le constructeur : donne une valeur de départ aux attributs
>   public constructor(name: string, age: number) {
>     this.name = name;
>     this.age = age;
>   }
>
>   // 3. Les méthodes : le comportement
>   public birthday(): void {
>     this.age = this.age + 1;
>   }
> }
>
> const rex = new Dog('Rex', 3);
> const medor = new Dog('Medor', 7);
>
> rex.birthday();
> console.log(rex.age);   // 4
> console.log(medor.age); // 7 : medor n'est pas concerné
> ```
>
> Le mot-clé `public` est expliqué dans le cours en fin d'exercice.
>
> ### Le constructeur
>
> Le **constructeur** est une méthode spéciale, nommée `constructor`, qui s'exécute **automatiquement** à chaque `new`. On ne l'appelle jamais directement. Son rôle : initialiser chaque attribut.
>
> Les arguments passés à `new Dog('Rex', 3)` deviennent les paramètres du constructeur : `name` vaut `'Rex'` et `age` vaut `3`.
>
> ### `this.name = name` : deux `name` différents
>
> Cette ligne déroute souvent, car elle contient deux éléments qui portent le même nom :
>
> ```ts
> public constructor(name: string, age: number) {
>   this.name = name;
>   //   ▲       ▲
>   //   │       └── le paramètre : la valeur reçue ('Rex'), qui disparaît à la fin du constructeur
>   //   └────────── l'attribut : la donnée stockée dans l'objet, qui reste
> }
> ```
>
> Le constructeur **recopie** les valeurs reçues dans l'objet. Sans `this.`, on désigne le paramètre : `name = name` ne stocke rien dans l'objet.
>
> ### `this` : l'instance courante
>
> À l'intérieur d'une classe, `this` désigne **l'objet en cours de construction ou d'utilisation**. Sa valeur dépend de l'instance concernée :
>
> - pendant `new Dog('Rex', 3)`, `this` est le nouvel objet qui deviendra `rex` ;
> - pendant `rex.birthday()`, `this` vaut `rex` ;
> - pendant `medor.birthday()`, `this` vaut `medor`.
>
> C'est grâce à `this` qu'une seule méthode `birthday()`, écrite une fois, modifie le bon chien.
>
> ### Ce que fait `new`, étape par étape
>
> ```ts
> const rex = new Dog('Rex', 3);
> ```
>
> 1. `new` crée un objet vide.
> 2. Il exécute le constructeur, avec `this` qui désigne cet objet, `name` qui vaut `'Rex'` et `age` qui vaut `3`.
> 3. Le constructeur remplit l'objet : `this.name = 'Rex'`, `this.age = 3`.
> 4. `new` renvoie l'objet rempli, qui est stocké dans la variable `rex`.
>
> ### Conventions de nommage
>
> Le nom d'une classe commence par une **majuscule** (`Dog`, `Pokemon`), celui d'une instance par une minuscule, comme toute variable (`rex`, `pikachu`). Chaque classe est écrite dans son propre fichier, qui porte son nom (`Pokemon.ts`).

</details>

### Objectif

Définir un type pour les différentes catégories de Pokémon, écrire une classe `Pokemon` avec des attributs publics et créer plusieurs instances.

### Instructions

1. Créer un dossier `src/types` et, dedans, un fichier `pokemon.types.ts` qui définit les types de Pokémon autorisés dans le simulateur :

```ts
export type PokemonType = 'normal' | 'fire' | 'water' | 'grass' | 'electric';
```

2. Créer un fichier `src/Pokemon.ts`. Y définir et exporter une classe `Pokemon` avec les attributs publics suivants, en écrivant explicitement le mot-clé `public` devant chacun (`public name: string;`) :

| Attribut | Type          | Description               |
| -------- | ------------- | ------------------------- |
| `name`   | `string`      | Nom du Pokémon            |
| `type`   | `PokemonType` | Type du Pokémon           |
| `maxHp`  | `number`      | Points de vie maximum     |
| `hp`     | `number`      | Points de vie actuels     |

Le type `PokemonType` s'importe avec `import type` :

```ts
import type { PokemonType } from './types/pokemon.types';
```

3. Écrire un **constructeur** `public constructor(name: string, type: PokemonType, maxHp: number)`. Un Pokémon est initialisé avec tous ses points de vie : `hp` est initialisé à `maxHp`.

4. Dans `src/main.ts`, importer la classe et créer quatre instances :

```ts
import { Pokemon } from './Pokemon';

const pikachu = new Pokemon('Pikachu', 'electric', 35);
const charmander = new Pokemon('Charmander', 'fire', 39);
const bulbasaur = new Pokemon('Bulbasaur', 'grass', 45);
const squirtle = new Pokemon('Squirtle', 'water', 44);
```

5. Afficher dans la console le nom et les PV de chaque Pokémon.

6. Essayer de créer `new Pokemon('Raichu', 'Electric', 60)`, avec une majuscule. **Quelle erreur TypeScript obtient-on ? Que se serait-il passé si l'attribut `type` était de type `string` ?** Supprimer ensuite cette ligne.

<details>
<summary><strong>Cours : déclaration des attributs, types littéraux et visibilité</strong></summary>

> ### Déclaration des attributs
>
> En TypeScript, les attributs d'une classe doivent être **déclarés** avec leur type, puis initialisés dans le constructeur :
>
> ```ts
> class Pokemon {
>   public name: string;
>   public hp: number;
>
>   public constructor(name: string, hp: number) {
>     this.name = name;
>     this.hp = hp;
>   }
> }
> ```
>
> En mode strict, TypeScript vérifie que chaque attribut déclaré est bien initialisé. Oublier `this.hp = hp;` provoque l'erreur `Property 'hp' has no initializer and is not definitely assigned in the constructor.`
>
> ### Les types littéraux
>
> `'normal' | 'fire' | 'water' | ...` est une **union de types littéraux** : la valeur ne peut être **que** l'une de ces chaînes. Une faute de frappe (`'Electric'`, `'fir'`) est détectée par le compilateur au lieu de provoquer un bug silencieux à l'exécution.
>
> ### `import type`
>
> `import type` importe **uniquement un type**. Un type n'existe pas dans le JavaScript exécuté : cet import est donc entièrement supprimé à la compilation. Dans un projet Vite (option `verbatimModuleSyntax`), TypeScript exige `import type` dès que l'on n'importe que des types. Une classe, elle, existe à l'exécution : elle s'importe avec un `import` classique.
>
> ### La visibilité `public`
>
> Un attribut `public` peut être lu et modifié depuis n'importe où dans le code. C'est la visibilité par défaut : sans mot-clé, un membre est public. Dans ce TP, on écrit pourtant **toujours** `public` devant les attributs, les méthodes publics et le constructeur. La visibilité de chaque membre est ainsi un choix visible, et non un oubli.

</details>

<details>
<summary><strong>Cours : classes vs interfaces en TypeScript</strong></summary>

> ### Deux façons de décrire un objet
>
> Au TP2, les Pokémon étaient décrits par des **interfaces** :
>
> ```ts
> interface Pokemon {
>   id: number;
>   name: string;
> }
> ```
>
> Une interface est une **description pure** : elle indique la forme d'un objet, mais elle disparaît à la compilation. On ne peut pas créer d'objet avec `new` à partir d'une interface.
>
> Une **classe** va plus loin : elle décrit la forme **et** fournit un moyen de construire des objets, avec leurs méthodes. La classe existe toujours dans le JavaScript généré.
>
> ```ts
> class Pokemon {
>   public name: string;
>
>   public constructor(name: string) {
>     this.name = name;
>   }
> }
>
> const p = new Pokemon('Pikachu'); // ← une instance concrète
> ```
>
> ### Quand utiliser l'une ou l'autre ?
>
> | Besoin | Interface / type | Classe |
> | --- | :---: | :---: |
> | Typer une réponse d'API ou un JSON | ✔ | — |
> | Créer des objets avec `new` | — | ✔ |
> | Associer des méthodes aux données | — | ✔ |
> | Protéger les données (validation, accès contrôlé) | — | ✔ |
>
> En pratique : si l'objet vient de l'extérieur (API, fichier, base de données), un `type` ou une `interface` suffit. Si l'objet est construit dans le code et possède un comportement, une classe est adaptée.

</details>

---

## Exercice 2 : Méthodes d'instance

### Objectif

Ajouter des comportements à la classe `Pokemon` sous forme de méthodes.

### Instructions

1. Ajouter une méthode `describe(): string` qui **retourne** une description du Pokémon :

```
Pikachu [electric] - HP: 35/35
```

2. Ajouter une méthode `takeDamage(amount: number): void` qui réduit les PV de `amount`. Les PV ne doivent jamais descendre en dessous de 0.

3. Ajouter une méthode `heal(amount: number): void` qui augmente les PV de `amount`. Les PV ne doivent jamais dépasser `maxHp`.

4. Ajouter une méthode `isAlive(): boolean` qui retourne `true` si les PV sont supérieurs à 0.

5. Dans `main.ts` :
   - Infliger 20 dégâts à `pikachu`, puis afficher `pikachu.describe()` et `pikachu.isAlive()`.
   - Soigner `pikachu` de 100 PV et vérifier que ses PV s'arrêtent à 35.
   - Infliger 9999 dégâts à `bulbasaur` et vérifier que ses PV s'arrêtent à 0.

<details>
<summary><strong>Cours : méthodes d'instance</strong></summary>

> ### Déclarer une méthode
>
> Une méthode est une **fonction rattachée à une classe**. Elle se déclare sans le mot-clé `function`. À l'intérieur, `this` donne accès aux attributs et aux autres méthodes de la même instance :
>
> ```ts
> class Pokemon {
>   // ...attributs et constructeur...
>
>   public isAlive(): boolean {
>     return this.hp > 0;
>   }
> }
>
> pikachu.isAlive(); // this === pikachu pendant l'appel
> ```
>
> Comme pour les attributs, on écrit explicitement `public` devant chaque méthode publique.
>
> ### Retourner plutôt qu'afficher
>
> `describe()` **retourne** une chaîne au lieu de faire un `console.log`. La méthode devient réutilisable : on peut afficher le résultat dans la console, l'insérer dans le DOM, le combiner avec une autre chaîne…
>
> ### Type de retour `void`
>
> `void` signifie que la méthode ne retourne aucune valeur utile. TypeScript refuse d'utiliser son résultat comme une valeur typée : `Type 'void' is not assignable to type 'number'.`

</details>

---

## Exercice 3 : Encapsulation

### Objectif

Constater que des attributs publics permettent de contourner les règles de la classe, puis protéger les données avec `readonly`, `private`, un **getter** et un **setter**.

### Instructions

1. Ajouter ces lignes dans `main.ts` et observer le résultat :

```ts
pikachu.name = 'Raichu';
pikachu.hp = -50;
console.log(pikachu.describe()); // ?
```

**Quel est le problème ? Pourquoi ?** Les méthodes `takeDamage` et `heal` empêchent pourtant les PV de sortir de l'intervalle `[0, maxHp]`.

2. Le nom, le type et les PV maximum d'un Pokémon ne changent jamais. Ajouter le modificateur `readonly` sur `name`, `type` et `maxHp` :

```ts
public readonly name: string;
```

Relever l'erreur TypeScript sur `pikachu.name = 'Raichu'`, puis supprimer cette ligne.

3. Renommer l'attribut `hp` en `_hp` et le rendre `private` :

```ts
private _hp: number;
```

Adapter les méthodes de la classe. Dans `main.ts`, `pikachu.hp` n'existe plus. Tenter `console.log(pikachu._hp)` : **quel message TypeScript affiche-t-il ?** Supprimer ensuite cette ligne.

4. Pour que l'extérieur puisse de nouveau **lire** les PV, ajouter un **getter** `hp` dans la classe (voir le cours) :

```ts
public get hp(): number {
  return this._hp;
}
```

Dans `main.ts`, vérifier que `pikachu.hp` fonctionne de nouveau en lecture, **sans parenthèses**. Vérifier aussi que `pikachu.hp = -50` est refusé : **quel message TypeScript affiche-t-il ?**

5. Pour autoriser la **modification** des PV tout en gardant le contrôle, ajouter un **setter** `hp`. Il reçoit la nouvelle valeur en paramètre, la borne entre `0` et `maxHp`, puis l'enregistre dans `_hp` :

```ts
public set hp(value: number) {
  // À compléter : borner value, puis l'enregistrer dans this._hp
}
```

Vérifier que `pikachu.hp = -50` est de nouveau accepté, et afficher le résultat. Tester aussi `pikachu.hp = 1000`.

6. Simplifier `takeDamage` et `heal` : elles n'ont plus besoin de vérifier les bornes, le setter s'en charge :

```ts
public takeDamage(amount: number): void {
  this.hp = this.hp - amount;
}
```

Vérifier que les tests de l'exercice 2 donnent toujours les mêmes résultats.

7. Ajouter `console.log(pikachu)` et déplier l'objet dans la console du navigateur. **L'attribut `_hp` est-il visible ? Qu'en déduire sur `private` ?**

<details>
<summary><strong>Cours : encapsulation, <code>readonly</code>, <code>private</code>, getters et setters</strong></summary>

> ### Pourquoi protéger les données ?
>
> Avec des attributs publics, n'importe quelle ligne de code peut écrire `pikachu.hp = -50` sans passer par `takeDamage` : les règles de la classe sont contournées. Dans un gros projet, une erreur à l'autre bout du code peut ainsi mettre un objet dans un état incohérent.
>
> L'**encapsulation** consiste à placer les règles **à l'intérieur** de la classe, au plus près des données. L'extérieur n'accède aux données qu'à travers ce que la classe autorise.
>
> ### `readonly`
>
> Un attribut `readonly` ne peut être affecté **que** dans sa déclaration ou dans le constructeur. Ensuite, toute modification est refusée : `Cannot assign to 'name' because it is a read-only property.`
>
> C'est la façon la plus simple de rendre une donnée publique mais non modifiable : pas besoin de getter.
>
> ### `private` et la convention `_`
>
> Un attribut `private` n'est accessible **que depuis l'intérieur de la classe** : `Property '_hp' is private and only accessible within class 'Pokemon'.`
>
> Le préfixe `_` est une convention qui indique un détail interne. Il est surtout utile pour libérer le nom `hp` pour le getter et le setter.
>
> ### Getters et setters
>
> Un **getter** est une méthode qui se **lit** comme un attribut. Un **setter** est une méthode qui s'utilise comme une **affectation**. Ils permettent d'exposer une donnée privée en gardant le contrôle sur ce qui entre et ce qui sort.
>
> ```ts
> class Pokemon {
>   private _hp: number;             // la donnée, cachée
>
>   public get hp(): number {        // lecture
>     return this._hp;
>   }
>
>   public set hp(value: number) {   // écriture
>     this._hp = value;              // après avoir vérifié value
>   }
> }
>
> console.log(pikachu.hp); // appelle get hp()   → pas de parenthèses
> pikachu.hp = 10;         // appelle set hp(10) → la valeur affectée devient le paramètre value
> ```
>
> ### Les règles d'écriture
>
> | | Getter | Setter |
> | --- | --- | --- |
> | Mot-clé | `get` devant le nom | `set` devant le nom |
> | Paramètres | aucun | exactement **un** : la valeur affectée |
> | Type de retour | le type de la donnée (`: number`) | aucun, même pas `void` |
> | Contenu | doit **retourner** une valeur | enregistre la valeur, après l'avoir vérifiée |
> | Utilisation | `pikachu.hp` | `pikachu.hp = 10` |
>
> - Le getter et le setter d'une même donnée portent le **même nom** (`hp`).
> - Ce nom doit être **différent** de celui de l'attribut, d'où `_hp`. Garder un attribut `hp` et un getter `hp` provoque : `Duplicate identifier 'hp'.`
> - Écrire `: void` sur un setter provoque : `A 'set' accessor cannot have a return type annotation.`
> - Un getter sans setter donne un accès **en lecture seule** : `Cannot assign to 'hp' because it is a read-only property.`
>
> ### Piège : le getter qui s'appelle lui-même
>
> ```ts
> public get hp(): number {
>   return this.hp; // ✘ this.hp appelle... get hp(), qui appelle get hp()...
> }
> ```
>
> TypeScript ne signale **rien**, mais à l'exécution le navigateur affiche `Maximum call stack size exceeded`. Dans un getter ou un setter, on manipule toujours l'attribut privé `this._hp`.
>
> ### `this.hp` ou `this._hp` dans la classe ?
>
> - `this.hp = ...` passe par le **setter** : la règle de bornage s'applique. C'est ce qu'on utilise dans `takeDamage` et `heal`.
> - `this._hp = ...` écrit **directement** dans l'attribut, sans vérification. On le réserve au setter lui-même et au constructeur, où la valeur (`maxHp`) est valide par définition.
>
> ### Pourquoi pas une méthode `getHp()` ?
>
> On pourrait écrire des méthodes `getHp()` et `setHp(value)`. Les getters et setters ont un avantage : pour l'appelant, `pikachu.hp` s'utilise **exactement comme un attribut**. On a pu rendre `hp` privé et ajouter une validation sans modifier le code de `main.ts`.
>
> ### Une règle écrite une seule fois
>
> Le setter est désormais le **seul** endroit qui modifie `_hp`. La règle « les PV restent entre 0 et `maxHp` » y est écrite une fois, et toutes les modifications passent par elle : celles de `takeDamage` et `heal` comme celles venant de l'extérieur.

</details>

---

## Exercice 4 : Membres statiques

<details>
<summary><strong>Cours : membres statiques</strong></summary>

> ### Instance vs classe
>
> Les méthodes vues jusqu'ici sont des **méthodes d'instance** : elles s'appellent sur un objet précis (`pikachu.heal(10)`) et utilisent ses données via `this`.
>
> Un **membre statique** (attribut ou méthode déclaré avec `static`) appartient à **la classe elle-même**. On l'utilise via le nom de la classe : `Pokemon.compare(...)`, `Pokemon.MAX_SKILLS`. Il existe même si aucune instance n'a été créée.
>
> ```ts
> Pokemon.compare(pikachu, charmander); // ✔ appelé sur la classe
> pikachu.compare(pikachu, charmander); // ✘ Did you mean to access the static member 'Pokemon.compare' instead?
> ```
>
> ### Quand utiliser `static` ?
>
> - pour une fonction qui travaille sur **plusieurs** instances plutôt que sur une seule (`compare`) ;
> - pour une **constante** commune à toutes les instances (`Pokemon.MAX_SKILLS`).
>
> Si la logique lit ou modifie l'état d'**un** objet (`this.hp`), c'est une méthode d'instance.
>
> ### `static readonly`
>
> `static readonly` déclare une constante de classe : elle ne peut plus être modifiée après sa déclaration (`Cannot assign to 'MAX_SKILLS' because it is a read-only property.`). C'est préférable à un nombre « magique » `4` écrit à plusieurs endroits du code.

</details>

### Objectif

Ajouter à la classe `Pokemon` des membres qui n'appartiennent pas à une instance particulière, mais à la classe elle-même.

### Instructions

1. Ajouter une méthode statique `public static compare(a: Pokemon, b: Pokemon): Pokemon` qui retourne le Pokémon ayant le plus de PV. En cas d'égalité, retourner le premier.

2. Dans `main.ts`, appeler cette méthode **sur la classe** :

```ts
const healthiest = Pokemon.compare(pikachu, charmander);
console.log(`Healthiest: ${healthiest.name}`);
```

Tenter ensuite `pikachu.compare(pikachu, charmander)` et lire le message d'erreur.

3. Un Pokémon ne pourra pas connaître plus de 4 capacités (exercice 5). Cette limite est la même pour tous les Pokémon : ajouter une constante de classe `public static readonly MAX_SKILLS = 4`. Afficher `Pokemon.MAX_SKILLS` dans la console.

---

## Exercice 5 : Classe Skill et composition

### Objectif

Créer une classe `Skill` représentant une capacité, puis l'intégrer dans `Pokemon` par **composition**.

### Instructions

1. Créer un fichier `src/Skill.ts`. Y définir une classe `Skill` avec les attributs **publics en lecture seule** suivants :

| Attribut | Type          | Description                                   |
| -------- | ------------- | --------------------------------------------- |
| `name`   | `string`      | Nom de la capacité (ex : `"Thunderbolt"`)     |
| `type`   | `PokemonType` | Type de la capacité (ex : `"electric"`)       |
| `power`  | `number`      | Dégâts infligés (ex : `18`)                   |

Le constructeur prend les paramètres dans cet ordre : `public constructor(name: string, type: PokemonType, power: number)`. Il **lève une erreur** si `power` n'est pas strictement positif.

2. Ajouter une méthode `describe(): string` qui retourne :

```
Thunderbolt [electric] - Power: 18
```

3. Dans `Pokemon.ts`, importer `Skill` et ajouter un attribut `private _skills: Skill[] = []`.

4. Ajouter les méthodes suivantes à `Pokemon` :

   - `learnSkill(skill: Skill): void` : ajoute une capacité. Lever une erreur si le Pokémon connaît déjà `Pokemon.MAX_SKILLS` capacités.
   - un getter `skills` de type `readonly Skill[]` qui retourne le tableau des capacités.
   - `findSkill(skillName: string): Skill` : retourne la capacité portant ce nom (méthode `find`), ou lève une erreur si elle est introuvable.
   - `useSkill(skillName: string, target: Pokemon): void` : trouve la capacité, inflige sa puissance en dégâts à `target` et affiche un message :

```
Pikachu uses Thunderbolt! Charmander loses 18 HP (21/39).
```

5. Dans `main.ts`, créer quelques capacités et les apprendre aux Pokémon :

```ts
import { Skill } from './Skill';

const tackle = new Skill('Tackle', 'normal', 10);

pikachu.learnSkill(new Skill('Thunderbolt', 'electric', 18));
pikachu.learnSkill(tackle);
charmander.learnSkill(new Skill('Ember', 'fire', 16));
charmander.learnSkill(tackle);
bulbasaur.learnSkill(new Skill('Vine Whip', 'grass', 15));
squirtle.learnSkill(new Skill('Water Gun', 'water', 16));

console.log(pikachu.skills.map((skill) => skill.describe()));
pikachu.useSkill('Thunderbolt', charmander);
```

6. Tester les cas d'erreur, chacun dans un `try` / `catch` qui affiche le message de l'erreur (voir le cours) :
   - faire utiliser à `pikachu` une capacité qu'il ne connaît pas ;
   - créer un Pokémon de test `const mew = new Pokemon('Mew', 'normal', 100);` et lui faire apprendre `tackle` cinq fois de suite pour dépasser la limite.

7. Tenter `pikachu.skills.push(tackle)`. **Quelle erreur obtient-on ? Pourquoi est-ce utile ?** Supprimer ensuite cette ligne.

<details>
<summary><strong>Cours : composition</strong></summary>

> ### Composer des objets
>
> La **composition** consiste à construire un objet à partir d'autres objets : un `Pokemon` **a des** `Skill`. On parle de relation « a-un » (*has-a*).
>
> ```ts
> class Pokemon {
>   private _skills: Skill[] = []; // un Pokemon "a des" Skills
> }
> ```
>
> Chaque classe garde sa responsabilité : `Skill` connaît son nom, son type et sa puissance, et refuse une puissance invalide ; `Pokemon` décide des règles d'apprentissage (4 capacités maximum).
>
> Initialiser `_skills` directement dans la déclaration est équivalent à le faire dans le constructeur. Chaque `new Pokemon(...)` reçoit son **propre** tableau vide.
>
> Une même capacité peut être partagée : `pikachu` et `charmander` connaissent tous les deux le **même objet** `tackle`. Comme il est en lecture seule, ce partage ne pose aucun problème.
>
> ### Exposer un tableau sans le livrer
>
> Si le getter `skills` retournait un simple `Skill[]`, l'appelant pourrait contourner les règles de `learnSkill` :
>
> ```ts
> pikachu.skills.push(extraSkill); // 5 capacités, sans vérification !
> ```
>
> Avec le type de retour `readonly Skill[]`, TypeScript interdit toutes les méthodes qui modifient le tableau (`push`, `pop`, `splice`, `sort`…) : `Property 'push' does not exist on type 'readonly Skill[]'.` Les méthodes de lecture (`map`, `filter`, `find`…) restent disponibles.
>
> Comme `private`, `readonly` ne protège qu'à la compilation. Pour une protection à l'exécution, on peut retourner une **copie** : `return [...this._skills];`
>
> ### `find` et `undefined`
>
> `find` retourne le premier élément qui satisfait la condition, ou `undefined` si aucun ne correspond. TypeScript type donc le résultat `Skill | undefined`, et refuse de le retourner comme un `Skill` sans vérification :
>
> ```ts
> const skill = this._skills.find((known) => known.name === skillName);
>
> if (!skill) {
>   throw new Error(`${this.name} does not know ${skillName}.`);
> }
>
> return skill; // ici, TypeScript sait que skill est un Skill
> ```
>
> ### Lever et intercepter une erreur
>
> `throw new Error('message')` interrompt l'exécution : sans précaution, la suite de `main.ts` ne s'exécute pas. L'appelant peut intercepter l'erreur avec `try` / `catch`. Le paramètre `error` est de type `unknown` : on écrit `(error as Error).message` pour lire son message.
>
> ```ts
> try {
>   pikachu.useSkill('Surf', charmander);
> } catch (error) {
>   console.log((error as Error).message); // Pikachu does not know Surf.
> }
> ```

</details>

---

## Exercice 6 : Combat

### Objectif

Utiliser l'ensemble de la classe pour simuler des combats entre Pokémon.

### Instructions

1. Ajouter à `Pokemon` une méthode `getStrongestSkill(): Skill` qui retourne la capacité la plus puissante du Pokémon : 

```ts
public getStrongestSkill(): Skill {
  if (this._skills.length === 0) {
    throw new Error(`${this.name} does not know any skill.`);
  }

  return this._skills.reduce((best, skill) => (skill.power > best.power ? skill : best));
}
```

2. Ajouter une méthode statique `public static duel(a: Pokemon, b: Pokemon): Pokemon` qui simule un combat et retourne le vainqueur :
   - À chaque tour, `a` utilise sa capacité la plus puissante sur `b`, puis `b` fait de même sur `a` **s'il est encore en vie**.
   - Le combat continue tant que les deux Pokémon sont en vie.
   - Afficher le numéro de chaque tour, puis le vainqueur.

```
--- Round 1 ---
Pikachu uses Thunderbolt! Charmander loses 18 HP (21/39).
Charmander uses Ember! Pikachu loses 16 HP (19/35).
...
Pikachu wins the battle!
```

3. Lancer un premier duel :

```ts
Pokemon.duel(pikachu, charmander);
```

4. Soigner `pikachu`, puis lancer un deuxième duel entre `pikachu` et `squirtle`.

---

## Pour aller plus loin

Quelques idées pour enrichir le simulateur, à réaliser dans l'ordre de votre choix :

- **Oublier une capacité** : ajouter une méthode `forgetSkill(skillName: string): void` qui retire une capacité du Pokémon, et lève une erreur s'il ne la connaît pas.
- **Compter les Pokémon** : ajouter un attribut statique qui compte le nombre de Pokémon créés depuis le lancement de l'application. Il ne doit pas pouvoir être modifié depuis l'extérieur de la classe : seul le constructeur l'incrémente.
- **Coups critiques** : donner à chaque attaque 20 % de chance d'infliger 1,5 fois plus de dégâts, et l'indiquer dans le message (`A critical hit!`). `Math.random()` retourne un nombre aléatoire entre 0 et 1.
- **Vitesse** : ajouter un attribut `speed` en lecture seule. Dans `duel`, le Pokémon le plus rapide attaque en premier, quel que soit l'ordre des paramètres.
- **Réanimation** : ajouter une méthode `revive(): void` qui rend la moitié de ses PV maximum à un Pokémon K.O., et lève une erreur s'il est encore en vie.
- **Affichage dans la page** : afficher les Pokémon et le déroulé des combats dans le HTML plutôt que dans la console, en réutilisant les méthodes `describe()`.
