# TP 5 : Héritage, Classes Abstraites et Interfaces

## Sommaire

- [TP 5 : Héritage, Classes Abstraites et Interfaces](#tp-5--héritage-classes-abstraites-et-interfaces)
  - [Sommaire](#sommaire)
  - [Exercice 0 : Mise en place](#exercice-0--mise-en-place)
  - [Exercice 1 : Héritage](#exercice-1--héritage)
  - [Exercice 2 : Redéfinition et polymorphisme](#exercice-2--redéfinition-et-polymorphisme)
  - [Exercice 3 : Classe abstraite](#exercice-3--classe-abstraite)
  - [Exercice 4 : Interfaces](#exercice-4--interfaces)
  - [Exercice 5 : Prendre du recul](#exercice-5--prendre-du-recul)
  - [Bonus : une équipe générique](#bonus--une-équipe-générique)

Au TP4, nous avons modélisé des Pokémon avec des classes, protégé leurs données par l'**encapsulation** et assemblé des objets par **composition**. Ce TP va plus loin en construisant des **familles de classes** qui partagent un comportement commun. Les notions abordées, **héritage**, **redéfinition**, **polymorphisme**, **classes abstraites** et **interfaces**, sont les fondations de toute architecture orientée objet.

L'application : toujours le simulateur de combat, enrichi de nouvelles familles de capacités fidèles aux jeux. Certaines blessent aussi celui qui les lance (Bélier), d'autres volent des PV à la cible (Méga-Sangsue), d'autres encore soignent (Synthèse).

---

## Exercice 0 : Mise en place

### Objectif

Repartir du projet du TP4.

### Instructions

1. Faire une copie du dossier `tp4` nommée `tp5`, puis ouvrir `tp5` dans l'éditeur. Si votre TP4 n'est pas terminé, récupérer la correction sur le dépôt GitHub.

2. Remplacer le contenu de `src/main.ts` par :

```ts
import { Pokemon } from './Pokemon';
import { Skill } from './Skill';

const pikachu = new Pokemon('Pikachu', 'electric', 35);
const charmander = new Pokemon('Charmander', 'fire', 39);
const bulbasaur = new Pokemon('Bulbasaur', 'grass', 45);
const squirtle = new Pokemon('Squirtle', 'water', 44);

pikachu.learnSkill(new Skill('Thunderbolt', 'electric', 18));
charmander.learnSkill(new Skill('Ember', 'fire', 16));
squirtle.learnSkill(new Skill('Water Gun', 'water', 16));

console.log([pikachu, charmander, bulbasaur, squirtle].map((pokemon) => pokemon.describe()));
```

3. Lancer `npm run dev` et vérifier que la description des quatre Pokémon s'affiche dans la console.

---

## Exercice 1 : Héritage

<details>
<summary><strong>Cours : héritage avec <code>extends</code> et <code>super</code></strong></summary>

> ### Relation « est-un »
>
> L'héritage modélise une relation **« est-un »** (*is-a*) : une capacité à contrecoup **est une** capacité. `RecoilSkill` hérite de tous les attributs et méthodes de `Skill` (`name`, `power`, `describe`, `use`…) sans avoir à les réécrire, et y ajoute ce qui lui est propre (`recoilRatio`).
>
> La composition (TP4) modélise une relation **« a-un »** : un `Pokemon` **a des** `Skill`.
>
> ### `extends`
>
> ```ts
> class RecoilSkill extends Skill { }
> ```
>
> `Skill` est la classe **parente**, `RecoilSkill` la classe **fille** (ou sous-classe). Une classe ne peut étendre **qu'une seule** classe parente.
>
> La sous-classe hérite de tout, mais les membres `private` du parent restent inaccessibles dans son code.
>
> ### `super()` dans le constructeur
>
> Une sous-classe qui déclare un constructeur **doit** appeler `super(...)`, qui exécute le constructeur du parent : `Constructors for derived classes must contain a 'super' call.` C'est le parent qui initialise `name`, `type` et `power`, et qui vérifie que la puissance est positive. La sous-classe n'initialise que ses propres attributs, **après** l'appel à `super(...)`.
>
> ### Une instance de la sous-classe est aussi une instance du parent
>
> `instanceof` parcourt toute la chaîne d'héritage : `takeDown` est un `RecoilSkill` **et** un `Skill`. On peut donc passer un `RecoilSkill` partout où un `Skill` est attendu :
>
> ```ts
> charmander.learnSkill(takeDown); // ✔ learnSkill attend un Skill
> ```

</details>

### Objectif

Confier à chaque capacité la responsabilité de son effet, puis créer une sous-classe `RecoilSkill` qui **hérite** de `Skill`.

### Instructions

1. Jusqu'ici, c'est `Pokemon.useSkill` qui inflige les dégâts. Or, dans ce TP, chaque famille de capacités aura son propre effet : c'est donc à la **capacité** de savoir ce qu'elle fait.

Dans `Skill`, ajouter une méthode `public use(user: Pokemon, target: Pokemon): void`, qui inflige `power` en dégâts à `target` et affiche le message. Il suffit de **déplacer** le code de `useSkill`. Le type `Pokemon` s'importe avec `import type` :

```ts
import type { Pokemon } from './Pokemon';
```

`useSkill` se contente alors de trouver la capacité et de l'utiliser :

```ts
public useSkill(skillName: string, target: Pokemon): void {
  this.findSkill(skillName).use(this, target);
}
```

Tester `pikachu.useSkill('Thunderbolt', charmander)` : le message n'a pas changé. Supprimer ensuite cette ligne.

2. Les capacités **à contrecoup**, comme Bélier (*Take Down*), infligent de lourds dégâts, mais blessent aussi le Pokémon qui les lance. Créer un fichier `src/RecoilSkill.ts` :

```ts
import type { PokemonType } from './types/pokemon.types';
import { Skill } from './Skill';

export class RecoilSkill extends Skill {
  public readonly recoilRatio: number; // part de la puissance subie par le lanceur

  public constructor(name: string, type: PokemonType, power: number, recoilRatio: number) {
    super(name, type, power);
    this.recoilRatio = recoilRatio;
  }
}
```

3. Dans `main.ts`, créer une capacité à contrecoup et l'utiliser :

```ts
import { RecoilSkill } from './RecoilSkill';

const takeDown = new RecoilSkill('Take Down', 'normal', 20, 0.25);
charmander.learnSkill(takeDown);

console.log(takeDown.describe());   // méthode héritée de Skill
console.log(takeDown.recoilRatio);  // attribut propre à RecoilSkill
charmander.useSkill('Take Down', squirtle);
```

**Question** : la classe `RecoilSkill` ne déclare ni `name`, ni `power`, ni `describe()`, ni `use()`. D'où viennent-ils ? Charmander subit-il le contrecoup ?

4. `learnSkill` attend un `Skill`. **Pourquoi accepte-t-elle un `RecoilSkill` ?** Vérifier avec `instanceof` :

```ts
console.log(takeDown instanceof RecoilSkill); // ?
console.log(takeDown instanceof Skill);       // ?
```

5. Supprimer provisoirement l'appel à `super(...)` et relever le message d'erreur.

6. Dans un `try` / `catch`, tenter de créer `new RecoilSkill('Broken', 'normal', -5, 0.25)`. **Quel message obtient-on ? Où est écrite cette vérification ?**

---

## Exercice 2 : Redéfinition et polymorphisme

<details>
<summary><strong>Cours : redéfinition, <code>super</code> et polymorphisme</strong></summary>

> ### Redéfinir une méthode
>
> Une sous-classe peut **redéfinir** (*override*) une méthode héritée en écrivant une méthode de même nom et de même signature. Le mot-clé `override` indique explicitement cette intention.
>
> Avec `noImplicitOverride`, TypeScript **exige** `override` sur toute redéfinition : `This member must have an 'override' modifier because it overrides a member in the base class 'Skill'.` Inversement, `override` sur une méthode qui n'existe pas dans le parent (une faute de frappe, par exemple) provoque une erreur. On ne peut donc plus redéfinir une méthode par accident.
>
> ### `super.methode()`
>
> Dans une méthode, `super.use(...)` appelle la version **du parent**. On **enrichit** ainsi le comportement hérité au lieu de le réécrire : `RecoilSkill` inflige les dégâts exactement comme `Skill`, puis ajoute le contrecoup.
>
> ### Hériter du constructeur
>
> Une sous-classe qui ne déclare **pas** de constructeur utilise celui du parent. `DrainSkill` n'a besoin d'aucun attribut supplémentaire : `new DrainSkill('Mega Drain', 'grass', 14)` appelle directement le constructeur de `Skill`.
>
> ### Polymorphisme
>
> À l'exécution, c'est toujours la version de l'**objet réel** qui s'exécute, quel que soit le type déclaré de la variable :
>
> ```ts
> const skill: Skill = takeDown;
> skill.use(charmander, squirtle); // ← RecoilSkill.use()
> ```
>
> - Le type de la **variable** (`Skill`) détermine ce que le compilateur **autorise** à appeler.
> - Le type de l'**objet** (`RecoilSkill`) détermine ce qui **s'exécute**.
>
> C'est pour cela que `useSkill` et `duel`, écrites une seule fois, fonctionnent avec toutes les capacités : elles appellent `use()`, et chaque capacité y répond à sa manière. Ajouter une nouvelle famille de capacités ne demande aucune modification de `Pokemon`.

</details>

### Objectif

**Redéfinir** des méthodes dans les sous-classes pour leur donner un effet propre, et observer le **polymorphisme** : le même appel produit un comportement différent selon l'objet.

### Instructions

1. Dans `tsconfig.json`, ajouter l'option `"noImplicitOverride": true` dans `compilerOptions`.

2. Dans `RecoilSkill`, redéfinir `use()`. La nouvelle version appelle d'abord la version du parent avec `super.use(user, target)`, qui inflige les dégâts et affiche le message. Le lanceur subit ensuite un contrecoup égal à `power * recoilRatio`, arrondi à l'entier inférieur :

```ts
public override use(user: Pokemon, target: Pokemon): void {
  super.use(user, target);
  // À compléter : infliger le contrecoup à user, puis afficher le message
}
```

L'appel de l'exercice 1 affiche maintenant :

```
Charmander uses Take Down! Squirtle loses 20 HP (24/44).
Charmander is hurt by recoil and loses 5 HP (34/39).
```

Retirer provisoirement le mot-clé `override` et relever l'erreur.

3. Redéfinir aussi `describe()` dans `RecoilSkill`, en réutilisant `super.describe()` :

```
Take Down [normal] - Power: 20 - Recoil: 25%
```

4. Les capacités **de drain**, comme Méga-Sangsue (*Mega Drain*), infligent des dégâts, puis soignent le lanceur de la moitié de leur puissance. Créer un fichier `src/DrainSkill.ts` avec une classe `DrainSkill` qui étend `Skill`. Elle n'a besoin d'**aucun constructeur** (voir le cours). Redéfinir :
   - `use()`, qui inflige les dégâts avec `super.use(...)`, puis soigne le lanceur de la moitié de `power` (arrondie à l'entier inférieur) et affiche un message ;
   - `describe()`, qui retourne `Mega Drain [grass] - Power: 14 - Drain: 50%`.

5. Dans `main.ts`, tester le drain :

```ts
import { DrainSkill } from './DrainSkill';

bulbasaur.learnSkill(new DrainSkill('Mega Drain', 'grass', 14));
bulbasaur.takeDamage(20);
bulbasaur.useSkill('Mega Drain', pikachu);
```

```
Bulbasaur uses Mega Drain! Pikachu loses 14 HP (21/35).
Bulbasaur drains 7 HP (32/45).
```

6. Soigner complètement `charmander` et `squirtle`, puis lancer `Pokemon.duel(charmander, squirtle)`. Vérifier que Charmander subit le contrecoup à chaque utilisation de Bélier.

7. **Question** : la variable suivante est déclarée de type `Skill`, mais contient un `RecoilSkill`. Quelle version de `use()` est appelée ? Vérifier.

```ts
const skill: Skill = takeDown;
skill.use(charmander, squirtle);
```

8. **Question** : `useSkill` et `duel` sont écrites dans `Pokemon`. Elles ne connaissent ni `RecoilSkill`, ni `DrainSkill`. Comment le contrecoup et le drain s'appliquent-ils pourtant ?

---

## Exercice 3 : Classe abstraite

<details>
<summary><strong>Cours : classes et méthodes abstraites</strong></summary>

> ### Pourquoi `abstract` ?
>
> `Skill` représente un **concept général** : on n'utilise jamais une capacité « tout court », mais toujours une capacité offensive, de soin, de drain… Le mot-clé `abstract` **interdit l'instanciation directe** : `Cannot create an instance of an abstract class.`
>
> Une classe abstraite reste une vraie classe : elle a un constructeur (appelé par `super(...)`), des attributs (`name`, `type`) et des méthodes concrètes (`describe`) partagés par toutes les sous-classes.
>
> ### Méthode abstraite
>
> Une méthode `abstract` n'a **pas de corps**. Elle impose à toute sous-classe concrète de l'implémenter : c'est un **contrat**.
>
> ```ts
> public abstract use(user: Pokemon, target: Pokemon): void;
> // DamageSkill et HealSkill DOIVENT fournir use()
> ```
>
> Oublier `use()` dans une sous-classe provoque une erreur : `Non-abstract class 'HealSkill' does not implement inherited abstract member use from class 'Skill'.`
>
> `Skill` ne peut pas écrire `use()` elle-même : il n'existe pas d'effet « par défaut » valable pour toutes les capacités. La méthode abstraite exprime exactement cela : « toute capacité a un effet, mais chaque famille définit le sien ».
>
> Pour une méthode abstraite, `override` n'est pas obligatoire, même avec `noImplicitOverride`. On le garde dans ce TP : il rend la relation visible à la lecture.
>
> ### Une hiérarchie sur plusieurs niveaux
>
> `DrainSkill` hérite de `DamageSkill`, qui hérite de `Skill`. Un objet `DrainSkill` est donc à la fois un `DrainSkill`, un `DamageSkill` et un `Skill`. Chaque niveau ajoute quelque chose : `Skill` donne le nom et le type, `DamageSkill` la puissance et les dégâts, `DrainSkill` le soin du lanceur.
>
> ### Une classe abstraite reste un type
>
> On ne peut pas créer d'objet `Skill`, mais on peut toujours **typer** avec `Skill` : un paramètre `skill: Skill` accepte n'importe quelle instance d'une sous-classe. Grâce au contrat abstrait, on peut appeler `use()` sur n'importe quel `Skill` sans savoir de quelle sous-classe il s'agit : c'est encore du polymorphisme.

</details>

### Objectif

Ajouter les capacités de soin, et réorganiser la famille des capacités autour d'une **classe abstraite**.

### Instructions

1. Les capacités **de soin**, comme Synthèse (*Synthesis*), n'infligent aucun dégât : elles soignent le lanceur. **Peut-on écrire `class HealSkill extends Skill` ? Que vaudrait `power` ? Que ferait la méthode `use()` héritée ?**

Le problème : `Skill` mélange ce que **toutes** les capacités ont (un nom, un type, un effet) et ce que seules les capacités **offensives** ont (une puissance, des dégâts). La solution consiste à séparer les deux :

```
Skill (abstraite)      name, type, describe(), use() abstraite
├── DamageSkill        power, use() inflige des dégâts
│   ├── RecoilSkill    … puis subit un contrecoup
│   └── DrainSkill     … puis soigne le lanceur
└── HealSkill          amount, use() soigne le lanceur
```

2. Transformer `Skill` en classe abstraite, qui ne garde que ce qui est commun à toutes les capacités :

```ts
export abstract class Skill {
  public readonly name: string;
  public readonly type: PokemonType;

  public constructor(name: string, type: PokemonType) {
    this.name = name;
    this.type = type;
  }

  public describe(): string {
    return `${this.name} [${this.type}]`;
  }

  public abstract use(user: Pokemon, target: Pokemon): void;
}
```

3. Créer un fichier `src/DamageSkill.ts` avec une classe `DamageSkill` qui étend `Skill`, et y **déplacer** ce qui concerne les dégâts :
   - l'attribut `power` ;
   - un constructeur `public constructor(name: string, type: PokemonType, power: number)`, qui appelle `super(name, type)` et vérifie que `power` est strictement positif ;
   - `describe()`, qui ajoute la puissance : `Thunderbolt [electric] - Power: 18` ;
   - `use()`, qui inflige les dégâts.

4. Faire hériter `RecoilSkill` et `DrainSkill` de `DamageSkill` au lieu de `Skill`. Leur code ne change pas.

5. Plusieurs erreurs apparaissent :
   - dans `main.ts`, `new Skill(...)` est refusé : relever le message, puis remplacer `Skill` par `DamageSkill` ;
   - dans `Pokemon`, `getStrongestSkill` ne compile plus : relever le message. **Pourquoi `power` n'existe-t-il plus sur `Skill` ?**

Une capacité de soin n'ayant pas de puissance, « la capacité la plus puissante » n'a plus de sens. Remplacer `getStrongestSkill` par une méthode qui utilise les capacités **à tour de rôle** :

```ts
private _turn = 0;

public chooseSkill(): Skill {
  if (this._skills.length === 0) {
    throw new Error(`${this.name} does not know any skill.`);
  }

  const skill = this._skills[this._turn % this._skills.length];
  this._turn++;

  return skill;
}
```

Dans `duel`, remplacer les appels à `getStrongestSkill()` par `chooseSkill()`.

6. Créer un fichier `src/HealSkill.ts` avec une classe `HealSkill` qui étend `Skill` :
   - un attribut `amount` public en lecture seule : le nombre de PV rendus ;
   - un constructeur `public constructor(name: string, type: PokemonType, amount: number)`, qui vérifie que `amount` est strictement positif ;
   - `describe()`, qui retourne `Synthesis [grass] - Heal: 15` ;
   - `use(user, _target)`, qui soigne le lanceur et affiche :

```
Bulbasaur uses Synthesis! Bulbasaur recovers 15 HP (45/45).
```

Le `_` devant `_target` indique à TypeScript que le paramètre est volontairement inutilisé (option `noUnusedParameters`) : une capacité de soin ne touche pas la cible, mais `use()` doit respecter la signature imposée par `Skill`.

7. Retirer provisoirement `use()` de `HealSkill` et relever l'erreur.

8. Apprendre `new HealSkill('Synthesis', 'grass', 15)` à `bulbasaur`. Mettre en commentaire les duels précédents de `main.ts`, soigner complètement `bulbasaur` et `charmander`, puis lancer `Pokemon.duel(bulbasaur, charmander)`. Les trois familles de capacités doivent apparaître :

```
--- Round 1 ---
Bulbasaur uses Mega Drain! Charmander loses 14 HP (25/39).
Bulbasaur drains 7 HP (45/45).
Charmander uses Ember! Bulbasaur loses 16 HP (29/45).
--- Round 2 ---
Bulbasaur uses Synthesis! Bulbasaur recovers 15 HP (44/45).
Charmander uses Take Down! Bulbasaur loses 20 HP (24/45).
Charmander is hurt by recoil and loses 5 HP (20/39).
...
Bulbasaur wins the battle!
```

9. **Question** : plus aucun objet ne peut être créé avec `new Skill(...)`. Pourtant, `learnSkill(skill: Skill)`, `chooseSkill(): Skill` et l'attribut `_skills: Skill[]` compilent toujours. Pourquoi ?

---

## Exercice 4 : Interfaces

<details>
<summary><strong>Cours : interfaces et typage structurel</strong></summary>

> ### Une interface est un contrat
>
> Une **interface** décrit la **forme** attendue d'un objet : ses propriétés, leurs types, ses méthodes. Elle ne contient aucune implémentation et disparaît complètement à la compilation.
>
> `readonly hp: number` signifie que l'utilisateur de l'interface peut **lire** `hp`, sans pouvoir le modifier. Un getter `hp` (comme dans `Pokemon` et `Trainer`) ou un simple attribut (comme dans le sac de frappe) conviennent tous les deux.
>
> ### `implements`
>
> ```ts
> class Trainer implements Fighter { }
> ```
>
> `implements` demande à TypeScript de **vérifier** que la classe respecte le contrat : `Class 'Pokemon' incorrectly implements interface 'Fighter'. Property 'attack' is missing in type 'Pokemon' but required in type 'Fighter'.` Une classe ne peut étendre qu'une seule classe, mais peut implémenter **plusieurs** interfaces : `implements Fighter, Describable`.
>
> ### Le typage structurel
>
> En Java ou en C#, un objet n'est un `Fighter` que si sa classe le déclare explicitement. TypeScript fonctionne différemment : il compare les **formes**. Un objet est accepté comme `Fighter` dès qu'il possède tous les membres demandés, avec les bons types, même s'il n'a jamais entendu parler de l'interface. C'est le **typage structurel** (ou *duck typing* : « si ça marche comme un canard et cancane comme un canard… »).
>
> `implements` n'est donc pas obligatoire pour être compatible : il sert à **détecter les erreurs dans la classe elle-même**, au moment de son écriture, plutôt qu'au moment où on l'utilise.
>
> Si un membre manque, l'erreur est précise : `Property 'isAlive' is missing in type '{ ... }' but required in type 'Fighter'.`
>
> ### Programmer pour une interface
>
> `duel` ne dépend que de `Fighter`. Elle accepte des Pokémon, des dresseurs, un sac de frappe, et accepterait demain un robot ou un boss, **sans être modifiée**. C'est le **principe ouvert/fermé** : le code est ouvert à de nouveaux types, mais fermé aux modifications.
>
> ### Classe abstraite ou interface ?
>
> | | Classe abstraite | Interface |
> | --- | :---: | :---: |
> | Décrit des propriétés et des méthodes | ✔ | ✔ |
> | Contient du code (implémentations, valeurs) | ✔ | ✘ |
> | Une classe peut en utiliser plusieurs | ✘ (une seule avec `extends`) | ✔ |
> | Existe à l'exécution (`instanceof`) | ✔ | ✘ |
> | Cas d'usage | Partager du **code** entre classes proches (`Skill` et ses sous-classes) | Décrire une **capacité** commune à des objets variés (Pokémon, dresseur, sac de frappe) |

</details>

### Objectif

Définir une **interface** qui décrit ce qu'un combattant doit savoir faire, puis écrire une fonction de duel qui fonctionne avec **n'importe quel** objet respectant ce contrat, y compris un objet qui n'est pas un `Pokemon`.

### Instructions

1. Créer un fichier `src/Fighter.ts` :

```ts
export interface Fighter {
  readonly name: string;
  readonly hp: number;
  readonly maxHp: number;
  isAlive(): boolean;
  takeDamage(amount: number): void;
  attack(target: Fighter): void;
}
```

2. Faire implémenter cette interface par `Pokemon` :

```ts
import type { Fighter } from './Fighter';

export class Pokemon implements Fighter {
  // ...
}
```

Relever l'erreur : il manque une méthode.

3. Ajouter à `Pokemon` une méthode `public attack(target: Fighter): void` qui utilise sur la cible la capacité retournée par `chooseSkill()`.

4. Pour que ce soit possible, la cible d'une capacité doit pouvoir être n'importe quel `Fighter`. Dans la méthode `use()` de `Skill` **et de chacune de ses sous-classes**, ainsi que dans `useSkill`, remplacer le type du paramètre `target` par `Fighter`. Le code de ces méthodes ne change pas : il n'utilise que `name`, `hp`, `maxHp` et `takeDamage`, que l'interface garantit.

5. Un dresseur peut aussi se battre, mais ce n'est pas un Pokémon : il n'a ni type, ni capacités. Créer un fichier `src/Trainer.ts` avec une classe `Trainer` qui **n'hérite d'aucune classe** et implémente `Fighter` :
   - `name` et `maxHp` publics en lecture seule, et un attribut privé `_hp` exposé par un getter `hp` : pour un dresseur, les PV représentent son **moral** ;
   - constructeur `public constructor(name: string, morale: number)` ;
   - `describe()` retourne `Trainer Ash - Morale: 20/20` ;
   - `isAlive()` et `takeDamage(amount)`, le moral ne descendant jamais en dessous de 0 ;
   - `attack(target)` : le dresseur lance une Poké Ball sur la cible, qui inflige 5 dégâts.

```
Ash throws a Poké Ball at Pikachu!
```

6. Créer un fichier `src/duel.ts` avec une **fonction** `export function duel(a: Fighter, b: Fighter): Fighter`, qui reprend la logique de `Pokemon.duel` en utilisant `attack`. Cette fonction ne connaît ni `Pokemon`, ni `Trainer` : elle ne manipule que le contrat. Supprimer ensuite la méthode statique `Pokemon.duel`, et remplacer ses appels dans `main.ts` par `duel(...)`.

7. Dans `main.ts`, créer `const ash = new Trainer('Ash', 20);`, puis tester les combats ci-dessous. Penser à soigner les Pokémon (`heal(maxHp)`) entre deux combats, sinon un combat contre un combattant K.O. se termine immédiatement.

```ts
import { duel } from './duel';

duel(charmander, squirtle);
duel(pikachu, ash);
```

8. Un sac de frappe n'est ni un Pokémon ni un dresseur, et n'est même pas créé à partir d'une classe. Créer un **simple objet** et le faire combattre :

```ts
const punchingBag = {
  name: 'Punching Bag',
  hp: 30,
  maxHp: 30,
  isAlive() {
    return this.hp > 0;
  },
  takeDamage(amount: number) {
    this.hp = Math.max(0, this.hp - amount);
  },
  attack() {
    console.log('The punching bag swings...');
  },
};

duel(pikachu, punchingBag);
```

**Cet objet n'a jamais écrit `implements Fighter`. Pourquoi TypeScript l'accepte-t-il ?** Retirer ensuite provisoirement la méthode `isAlive` de l'objet et lire l'erreur.

9. **Question** : pourquoi avoir typé les paramètres de `duel` avec `Fighter` plutôt qu'avec `Pokemon` ?

---

## Exercice 5 : Prendre du recul

<details>
<summary><strong>Cours : héritage, composition ou données ?</strong></summary>

> ### Ce qu'il faut retenir
>
> - L'**héritage** est adapté quand les sous-classes ont un **comportement** différent et une vraie relation « est-un » : `RecoilSkill`, `DrainSkill` et `HealSkill` **sont des** capacités, et chacune a un effet que les autres n'ont pas.
> - Quand les sous-classes ne diffèrent que par des **valeurs** (une table de multiplicateurs), une **donnée** suffit, et évite de multiplier les classes. `FirePokemon` et `WaterPokemon` auraient exactement le même code, avec des nombres différents.
> - Une classe n'a qu'un seul parent. Dès qu'un objet combine plusieurs caractéristiques (double type), l'héritage atteint ses limites : on se tourne vers la **composition** ou les **données**.
> - Partager du code ne suffit pas à justifier l'héritage : un dresseur n'**est pas** un Pokémon. Pour éviter de dupliquer la gestion des PV, on peut extraire une classe dédiée (une jauge de PV, par exemple) que `Pokemon` et `Trainer` **utilisent** par composition.
> - Les **interfaces** permettent de faire coopérer des objets sans lien d'héritage : `duel` fait combattre un Pokémon et un dresseur sans qu'ils aient de parent commun.
>
> D'où le conseil classique : *« préférer la composition à l'héritage »*. L'héritage n'est pas à proscrire, mais ce ne doit pas être le premier réflexe.
>
> ### `Record`, `Partial` et `??`
>
> - `Record<PokemonType, number>` est le type d'un objet qui associe un `number` à **chaque** type de Pokémon.
> - `Partial<...>` rend toutes les clés facultatives : une ligne de la table peut ne lister que les types qui ont un effet particulier.
> - `TYPE_CHART[this.type][skillType]` vaut `undefined` si la clé est absente. L'opérateur `??` retourne alors la valeur de droite : `TYPE_CHART[this.type][skillType] ?? 1`.
>
> Avec `Record<PokemonType, ...>`, TypeScript **exige** une entrée pour chaque type : ajouter `'flying'` à `PokemonType` sans compléter `TYPE_CHART` provoque une erreur de compilation. La table de données reste ainsi aussi sûre que des classes.

</details>

### Objectif

Se demander quand l'héritage est le bon outil.

### Questions

Répondre par écrit, en quelques lignes, aux questions suivantes.

1. On veut ajouter les faiblesses de types : les Pokémon Feu craignent l'eau, les Pokémon Eau craignent l'électricité… Un camarade propose de créer des sous-classes `FirePokemon`, `WaterPokemon`, `ElectricPokemon`…, chacune redéfinissant une méthode `getEffectiveness(skillType)` qui retourne le multiplicateur de dégâts. Comparer avec `RecoilSkill`, `DrainSkill` et `HealSkill` : qu'est-ce qui diffère d'une sous-classe à l'autre, du **code** ou des **valeurs** ?

2. Les jeux comptent **18 types**. Combien de classes faudrait-il ? Et Charizard (Dracaufeu), qui est de type **Feu et Vol** : peut-on écrire `class FireFlyingPokemon extends FirePokemon, FlyingPokemon` ?

3. Une alternative consiste à décrire les faiblesses comme une **donnée** :

```ts
const TYPE_CHART: Record<PokemonType, Partial<Record<PokemonType, number>>> = {
  normal: {},
  fire: { water: 2, fire: 0.5, grass: 0.5 },
  water: { electric: 2, grass: 2, fire: 0.5, water: 0.5 },
  grass: { fire: 2, water: 0.5, grass: 0.5, electric: 0.5 },
  electric: { electric: 0.5 },
};
```

Comment s'écrirait alors `getEffectiveness(skillType)` dans `Pokemon`, en une seule méthode ? Que se passe-t-il si l'on ajoute `'flying'` à `PokemonType` sans compléter `TYPE_CHART` ?

4. `Trainer` et `Pokemon` gèrent leurs PV avec un code presque identique (`hp`, `isAlive`, `takeDamage`). Faudrait-il que `Trainer` hérite de `Pokemon` ? Quelles autres solutions permettraient d'éviter cette répétition ?

---

## Bonus : une équipe générique

<details>
<summary><strong>Cours : classes génériques</strong></summary>

> Un **générique** est un paramètre de type : `Team<T>` est un modèle d'équipe, et `T` est remplacé par un type concret à l'utilisation (`Team<Pokemon>`, `Team<Trainer>`).
>
> La contrainte `T extends Fighter` limite les types acceptés à ceux qui respectent l'interface `Fighter` : `Type 'string' does not satisfy the constraint 'Fighter'.` Dans la classe, on peut donc appeler `member.isAlive()`.
>
> Contrairement à une `Team` qui stockerait des `Fighter[]`, la version générique **conserve le type précis** des membres : `getLeader()` retourne un `Pokemon`, pas un simple `Fighter`, donc `type` reste accessible.
>
> L'opérateur `?.` (*optional chaining*) lit `type` seulement si `getLeader()` n'a pas retourné `undefined`.

</details>

### Objectif

Écrire une classe **générique** qui fonctionne avec n'importe quel type de combattant.

### Instructions

1. Créer un fichier `src/Team.ts` avec une classe `Team<T extends Fighter>` qui contient un attribut privé `_members: T[]` et les méthodes :
   - `public add(member: T): void` ;
   - `public getAlive(): T[]`, qui retourne les membres encore en vie ;
   - `public getLeader(): T | undefined`, qui retourne le premier membre en vie.

2. Créer une `Team<Pokemon>`, y ajouter `pikachu` et `charmander`, puis vérifier que `team.getLeader()?.type` est accepté : TypeScript sait que le leader est un `Pokemon`, alors que `type` n'existe pas sur `Fighter`.

3. Tenter d'ajouter `ash` à cette équipe, puis de créer une `Team<string>`. Expliquer les deux erreurs.

