# TP 5 : Héritage, Classes Abstraites et Interfaces

## Sommaire

- [TP 5 : Héritage, Classes Abstraites et Interfaces](#tp-5--héritage-classes-abstraites-et-interfaces)
  - [Sommaire](#sommaire)
  - [Exercice 0 : Mise en place](#exercice-0--mise-en-place)
  - [Exercice 1 : Héritage](#exercice-1--héritage)
  - [Exercice 2 : Redéfinition et polymorphisme](#exercice-2--redéfinition-et-polymorphisme)
  - [Exercice 3 : Classe abstraite](#exercice-3--classe-abstraite)
  - [Exercice 4 : Visibilité `protected`](#exercice-4--visibilité-protected)
  - [Exercice 5 : Interfaces](#exercice-5--interfaces)
  - [Exercice 6 : Prendre du recul](#exercice-6--prendre-du-recul)
  - [Bonus : une équipe générique](#bonus--une-équipe-générique)

Au TP4, nous avons modélisé des Pokémon avec des classes, protégé leurs données par l'**encapsulation** et assemblé des objets par **composition**. Ce TP va plus loin en construisant des **familles de classes** qui partagent un comportement commun. Les notions abordées, **héritage**, **redéfinition**, **polymorphisme**, **classes abstraites** et **interfaces**, sont les fondations de toute architecture orientée objet.

L'application : toujours le simulateur de combat, enrichi de nouvelles familles de capacités fidèles aux jeux. Certaines blessent aussi celui qui les lance (Bélier), d'autres volent des PV à la cible (Méga-Sangsue), d'autres encore soignent (Synthèse).

---

## Exercice 0 : Mise en place

### Objectif

Repartir du projet du TP4, et y apporter deux modifications qui préparent la suite.

### Instructions

1. Faire une copie du dossier `tp4` nommée `tp5`, puis ouvrir `tp5` dans l'éditeur. Si votre TP4 n'est pas terminé, récupérer la correction sur le dépôt GitHub.

2. Jusqu'ici, c'est `Pokemon.useSkill` qui inflige les dégâts. Or, dans ce TP, chaque famille de capacités aura son propre effet : c'est donc à la **capacité** de savoir ce qu'elle fait. Remplacer le contenu de `src/Skill.ts` par :

```ts
import type { PokemonType } from './types/pokemon.types';
import type { Pokemon } from './Pokemon';

export class Skill {
  public readonly name: string;
  public readonly type: PokemonType;
  public readonly power: number;

  public constructor(name: string, type: PokemonType, power: number) {
    if (power <= 0) {
      throw new Error(`The power of ${name} must be strictly positive.`);
    }

    this.name = name;
    this.type = type;
    this.power = power;
  }

  public describe(): string {
    return `${this.name} [${this.type}] - Power: ${this.power}`;
  }

  public use(user: Pokemon, target: Pokemon): void {
    target.takeDamage(this.power);
    console.log(
      `${user.name} uses ${this.name}! ${target.name} loses ${this.power} HP (${target.hp}/${target.maxHp}).`
    );
  }
}
```

La méthode `use()` reçoit deux Pokémon : `user`, celui qui lance la capacité, et `target`, celui qui la subit. Son contenu est celui de l'ancien `useSkill`, mais on est maintenant **dans la capacité** : `this` désigne la capacité, et le lanceur est `user`.

Dans `Pokemon`, remplacer `useSkill` : elle n'a plus qu'à trouver la capacité et à l'utiliser, en se passant elle-même (`this`) comme lanceur :

```ts
public useSkill(skillName: string, target: Pokemon): void {
  this.findSkill(skillName).use(this, target);
}
```

3. Dans ce TP, certaines capacités n'auront pas de puissance : « la capacité la plus puissante » n'aura plus de sens. Dans `Pokemon`, remplacer `getStrongestSkill` par une méthode qui utilise les capacités **à tour de rôle** :

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

4. Remplacer le contenu de `src/main.ts` par :

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

5. Lancer `npm run dev` et vérifier que la description des quatre Pokémon s'affiche dans la console. Tester ensuite `pikachu.useSkill('Thunderbolt', charmander)` : le message doit être le même qu'au TP4, puis supprimer cette ligne.

```
Pikachu uses Thunderbolt! Charmander loses 18 HP (21/39).
```

---

## Exercice 1 : Héritage

<details>
<summary><strong>Cours : héritage avec <code>extends</code> et <code>super</code></strong></summary>

> Les exemples de ce cours utilisent des véhicules, sans lien avec les Pokémon : à vous de transposer.
>
> ### Relation « est-un »
>
> L'héritage modélise une relation **« est-un »** (*is-a*) : une voiture **est un** véhicule. La classe `Car` hérite de tous les attributs et méthodes de `Vehicle` sans avoir à les réécrire, et y ajoute ce qui lui est propre.
>
> À ne pas confondre avec la composition (TP4), qui modélise une relation **« a-un »** : une voiture **a un** moteur.
>
> ### `extends`
>
> ```ts
> class Vehicle {
>   public readonly name: string;
>   public readonly speed: number;
>
>   public constructor(name: string, speed: number) {
>     if (speed <= 0) {
>       throw new Error(`The speed of ${name} must be strictly positive.`);
>     }
>
>     this.name = name;
>     this.speed = speed;
>   }
>
>   public describe(): string {
>     return `${this.name} - ${this.speed} km/h`;
>   }
>
>   public travel(distance: number): void {
>     console.log(`${this.name} travels ${distance} km.`);
>   }
> }
>
> class Car extends Vehicle {
>   public readonly seats: number; // propre à Car
>
>   public constructor(name: string, speed: number, seats: number) {
>     super(name, speed);
>     this.seats = seats;
>   }
> }
> ```
>
> `Vehicle` est la classe **parente**, `Car` la classe **fille** (ou sous-classe). Une classe ne peut étendre **qu'une seule** classe parente.
>
> ```ts
> const clio = new Car('Clio', 180, 5);
> clio.describe(); // méthode héritée de Vehicle
> clio.seats;      // attribut propre à Car
> ```
>
> La sous-classe hérite de tout, mais les membres `private` du parent restent inaccessibles dans son code.
>
> ### `super()` dans le constructeur
>
> Une sous-classe qui déclare un constructeur **doit** appeler `super(...)`, qui exécute le constructeur du parent. Sans lui : `Constructors for derived classes must contain a 'super' call.`
>
> Ici, c'est `Vehicle` qui initialise `name` et `speed`, et qui vérifie que la vitesse est positive : `Car` en profite sans réécrire cette vérification. La sous-classe n'initialise que ses propres attributs, **après** l'appel à `super(...)`.
>
> ### Une instance de la sous-classe est aussi une instance du parent
>
> `instanceof` parcourt toute la chaîne d'héritage : `clio` est une `Car` **et** un `Vehicle`. On peut donc passer une `Car` partout où un `Vehicle` est attendu :
>
> ```ts
> function startTrip(vehicle: Vehicle): void { /* ... */ }
>
> startTrip(clio);                     // ✔ une Car est un Vehicle
> console.log(clio instanceof Car);     // true
> console.log(clio instanceof Vehicle); // true
> ```

</details>

### Objectif

Créer une sous-classe `RecoilSkill` qui **hérite** de `Skill`.

### Instructions

1. Les capacités **à contrecoup**, comme Bélier (*Take Down*), infligent de lourds dégâts, mais blessent aussi le Pokémon qui les lance. Créer un fichier `src/RecoilSkill.ts` :

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

2. Dans `main.ts`, créer une capacité à contrecoup et l'utiliser :

```ts
import { RecoilSkill } from './RecoilSkill';

const takeDown = new RecoilSkill('Take Down', 'normal', 20, 0.25);
charmander.learnSkill(takeDown);

console.log(takeDown.describe());   // méthode héritée de Skill
console.log(takeDown.recoilRatio);  // attribut propre à RecoilSkill
charmander.useSkill('Take Down', squirtle);
```

**Question** : la classe `RecoilSkill` ne déclare ni `name`, ni `power`, ni `describe()`, ni `use()`. D'où viennent-ils ? Charmander subit-il le contrecoup ?

3. `learnSkill` attend un `Skill`. **Pourquoi accepte-t-elle un `RecoilSkill` ?** Vérifier avec `instanceof` :

```ts
console.log(takeDown instanceof RecoilSkill); // ?
console.log(takeDown instanceof Skill);       // ?
```

4. Supprimer provisoirement l'appel à `super(...)` et relever le message d'erreur.

5. Dans un `try` / `catch`, tenter de créer `new RecoilSkill('Broken', 'normal', -5, 0.25)`. **Quel message obtient-on ? Où est écrite cette vérification ?**

---

## Exercice 2 : Redéfinition et polymorphisme

<details>
<summary><strong>Cours : redéfinition, <code>super</code> et polymorphisme</strong></summary>

> ### Redéfinir une méthode
>
> Une sous-classe peut **redéfinir** (*override*) une méthode héritée en écrivant une méthode de même nom et de même signature. Le mot-clé `override` indique explicitement cette intention.
>
> Avec l'option `noImplicitOverride`, TypeScript **exige** `override` sur toute redéfinition : `This member must have an 'override' modifier because it overrides a member in the base class 'Vehicle'.` Inversement, `override` sur une méthode qui n'existe pas dans le parent (une faute de frappe, par exemple) provoque une erreur. On ne peut donc plus redéfinir une méthode par accident.
>
> ### `super.methode()`
>
> Dans une méthode, `super.travel(...)` appelle la version **du parent**. On **enrichit** ainsi le comportement hérité au lieu de le réécrire : une voiture se déplace comme n'importe quel véhicule, puis consomme du carburant.
>
> ```ts
> class Car extends Vehicle {
>   // ... (seats, constructeur)
>
>   public override travel(distance: number): void {
>     super.travel(distance); // Clio travels 10 km.
>     console.log(`${this.name} burns ${distance * 0.06} L of fuel.`);
>   }
> }
> ```
>
> ### Hériter du constructeur
>
> Une sous-classe qui ne déclare **pas** de constructeur utilise celui du parent. Un vélo n'a besoin d'aucun attribut supplémentaire : `new Bike('BMX', 25)` appelle directement le constructeur de `Vehicle`.
>
> ```ts
> class Bike extends Vehicle {
>   public override describe(): string {
>     return `${super.describe()} - No engine`;
>   }
> }
> ```
>
> ### Polymorphisme
>
> À l'exécution, c'est toujours la version de l'**objet réel** qui s'exécute, quel que soit le type déclaré de la variable :
>
> ```ts
> const vehicle: Vehicle = new Car('Clio', 180, 5);
> vehicle.travel(10); // ← Car.travel() : le carburant est consommé
> ```
>
> - Le type de la **variable** (`Vehicle`) détermine ce que le compilateur **autorise** à appeler.
> - Le type de l'**objet** (`Car`) détermine ce qui **s'exécute**.
>
> Une fonction écrite une seule fois pour des `Vehicle` fonctionne donc avec tous les véhicules, chacun répondant à sa manière :
>
> ```ts
> const vehicles: Vehicle[] = [new Car('Clio', 180, 5), new Bike('BMX', 25)];
>
> for (const vehicle of vehicles) {
>   vehicle.travel(10); // Car.travel(), puis Vehicle.travel() pour le vélo
> }
> ```
>
> Ajouter demain une classe `Truck` ne demandera aucune modification de cette boucle.

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

4. Les capacités **de drain**, comme Méga-Sangsue (*Mega Drain*), infligent des dégâts, puis soignent le lanceur de la moitié de leur puissance. Créer un fichier `src/DrainSkill.ts` avec une classe `DrainSkill` qui étend `Skill`. Contrairement à `RecoilSkill`, `DrainSkill` n'ajoute aucun attribut : inutile d'écrire un constructeur. Elle utilise automatiquement celui de `Skill`, donc `new DrainSkill('Mega Drain', 'grass', 14)` fonctionne directement (voir le cours). Redéfinir :
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
<summary><strong>Cours : classes abstraites</strong></summary>

> ### Pourquoi `abstract` ?
>
> `Vehicle` représente un **concept général** : on ne croise jamais un « véhicule » tout court dans la rue, mais toujours une voiture, un vélo, un camion… Le mot-clé `abstract` **interdit l'instanciation directe** :
>
> ```ts
> new Vehicle('Mystery', 50); // ✘ Cannot create an instance of an abstract class.
> ```
>
> Une classe abstraite reste une vraie classe : elle a un constructeur (appelé par `super(...)`), des attributs et des méthodes concrètes partagés par toutes les sous-classes.
>
> ### Méthode abstraite
>
> Une méthode `abstract` n'a **pas de corps**. Elle impose à toute sous-classe concrète de l'implémenter : c'est un **contrat**.
>
> ```ts
> abstract class Vehicle {
>   // name, speed, constructeur et describe() inchangés
>
>   public abstract travel(distance: number): void;
> }
> // Car et Bike DOIVENT fournir travel()
> ```
>
> Oublier `travel()` dans une sous-classe provoque une erreur : `Non-abstract class 'Bike' does not implement inherited abstract member travel from class 'Vehicle'.`
>
> `Vehicle` ne peut pas écrire `travel()` elle-même : une voiture roule et consomme du carburant, un vélo avance à la force des jambes, il n'existe pas de déplacement « par défaut ». La méthode abstraite exprime exactement cela : « tout véhicule se déplace, mais chacun à sa manière ».
>
> Pour une méthode abstraite, `override` n'est pas obligatoire, même avec `noImplicitOverride`. On le garde dans ce TP : il rend la relation visible à la lecture.
>
> ### Une hiérarchie sur plusieurs niveaux
>
> Si `ElectricCar` hérite de `Car`, qui hérite de `Vehicle`, un objet `ElectricCar` est à la fois une `ElectricCar`, une `Car` et un `Vehicle`. Chaque niveau ajoute quelque chose : `Vehicle` donne le nom et la vitesse, `Car` les places, `ElectricCar` la batterie.
>
> ### Une classe abstraite reste un type
>
> On ne peut pas créer d'objet `Vehicle`, mais on peut toujours **typer** avec `Vehicle` : un paramètre `vehicle: Vehicle` ou un tableau `Vehicle[]` accepte n'importe quelle instance d'une sous-classe. Grâce au contrat abstrait, on peut appeler `travel()` sur n'importe quel `Vehicle` sans savoir de quelle sous-classe il s'agit : c'est encore du polymorphisme.

</details>

### Objectif

Ajouter les capacités de soin et réorganiser la famille des capacités autour d'une **classe abstraite**.

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

2. Faire une copie du fichier `src/Skill.ts` nommée `src/DamageSkill.ts`, sans la modifier pour l'instant. Le code actuel de `Skill` est celui d'une capacité offensive : il servira de point de départ à `DamageSkill`.

3. Transformer `Skill` en classe abstraite, qui ne garde que ce qui est commun à toutes les capacités :

```ts
import type { PokemonType } from './types/pokemon.types';
import type { Pokemon } from './Pokemon';

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

4. Adapter `src/DamageSkill.ts` pour en faire une sous-classe de `Skill` :
   - renommer la classe en `DamageSkill`, la faire hériter de `Skill` et importer `Skill` ;
   - supprimer les attributs `name` et `type`, désormais hérités : seul `power` reste ;
   - dans le constructeur, remplacer `this.name = name;` et `this.type = type;` par un appel à `super(name, type)`, placé **au début** du constructeur ;
   - ajouter `override` devant `describe()` et `use()`, et réécrire `describe()` avec `super.describe()`. Le résultat ne change pas : `Thunderbolt [electric] - Power: 18`.

5. Faire hériter `RecoilSkill` et `DrainSkill` de `DamageSkill` au lieu de `Skill`. Leur code ne change pas, seul l'import est à modifier.

6. Dans `main.ts`, `new Skill(...)` est maintenant refusé : relever le message, puis remplacer `Skill` par `DamageSkill`.

7. Créer un fichier `src/HealSkill.ts` avec une classe `HealSkill` qui étend `Skill` :
   - un attribut `amount` public en lecture seule : le nombre de PV rendus ;
   - un constructeur `public constructor(name: string, type: PokemonType, amount: number)`, qui vérifie que `amount` est strictement positif ;
   - `describe()`, qui retourne `Synthesis [grass] - Heal: 15` ;
   - `use(user, _target)`, qui soigne le lanceur et affiche :

```
Bulbasaur uses Synthesis! Bulbasaur recovers 15 HP (45/45).
```

Le `_` devant `_target` indique à TypeScript que le paramètre est volontairement inutilisé (option `noUnusedParameters`) : une capacité de soin ne touche pas la cible, mais `use()` doit respecter la signature imposée par `Skill`.

8. Retirer provisoirement `use()` de `HealSkill` et relever l'erreur.

9. Apprendre `new HealSkill('Synthesis', 'grass', 15)` à `bulbasaur`. Mettre en commentaire les duels précédents de `main.ts`, soigner complètement `charmander`, puis lancer `Pokemon.duel(bulbasaur, charmander)`. Les trois familles de capacités doivent apparaître :

```
--- Round 1 ---
Bulbasaur uses Mega Drain! Charmander loses 14 HP (25/39).
Bulbasaur drains 7 HP (39/45).
Charmander uses Ember! Bulbasaur loses 16 HP (23/45).
--- Round 2 ---
Bulbasaur uses Synthesis! Bulbasaur recovers 15 HP (38/45).
Charmander uses Take Down! Bulbasaur loses 20 HP (18/45).
Charmander is hurt by recoil and loses 5 HP (20/39).
...
Bulbasaur wins the battle!
```

10. **Question** : plus aucun objet ne peut être créé avec `new Skill(...)`. Pourtant, `learnSkill(skill: Skill)`, `chooseSkill(): Skill` et l'attribut `_skills: Skill[]` compilent toujours. Pourquoi ?

---

## Exercice 4 : Visibilité `protected`

<details>
<summary><strong>Cours : visibilité <code>protected</code></strong></summary>

> ### `protected` : visible par les sous-classes
>
> Les membres `private` d'une classe sont inaccessibles dans ses sous-classes. C'est parfois trop strict : un attribut doit rester caché de l'extérieur, mais les sous-classes ont besoin de l'utiliser. C'est le rôle de `protected`.
>
> ```ts
> abstract class Vehicle {
>   protected mileage = 0; // kilométrage
>   // ...
> }
>
> class Car extends Vehicle {
>   public override travel(distance: number): void {
>     this.mileage += distance; // ✔ Car est une sous-classe de Vehicle
>     console.log(`${this.name} drives ${distance} km.`);
>   }
> }
>
> const clio = new Car('Clio', 180, 5);
> clio.mileage = 0; // ✘ impossible de trafiquer le compteur depuis l'extérieur
> ```
>
> - À l'extérieur : `Property 'mileage' is protected and only accessible within class 'Vehicle' and its subclasses.`
> - Si `mileage` était `private`, c'est la ligne de `Car` qui serait refusée : `Property 'mileage' is private and only accessible within class 'Vehicle'.`
>
> | | Dans la classe | Dans les sous-classes | À l'extérieur |
> | --- | :---: | :---: | :---: |
> | `public` | ✔ | ✔ | ✔ |
> | `protected` | ✔ | ✔ | ✘ |
> | `private` | ✔ | ✘ | ✘ |

</details>

### Objectif

Cacher la puissance d'une capacité au code extérieur, tout en la laissant accessible aux sous-classes.

### Instructions

Dans `DamageSkill`, `power` est public : n'importe quel code peut le lire, alors que seules `DamageSkill` et ses sous-classes en ont besoin.

1. Passer `power` en `private` (en gardant `readonly`). Relever les erreurs qui apparaissent dans `RecoilSkill` et `DrainSkill`.

2. Remplacer `private` par `protected`. Les erreurs disparaissent.

3. Dans `main.ts`, tenter d'afficher `takeDown.power`, relever l'erreur, puis supprimer cette ligne.

4. **Question** : quelle est la différence entre `private` et `protected` ?

---

## Exercice 5 : Interfaces

<details>
<summary><strong>Cours : interfaces et typage structurel</strong></summary>

> ### Une interface est un contrat
>
> Un cheval n'est pas un véhicule : il n'a ni moteur ni pédales, et le faire hériter de `Vehicle` n'aurait pas de sens. Pourtant, comme une voiture, il peut **transporter** quelqu'un. Une **interface** permet de décrire ce point commun :
>
> ```ts
> interface Transport {
>   readonly name: string;
>   readonly speed: number;
>   travel(distance: number): void;
> }
> ```
>
> Une interface décrit la **forme** attendue d'un objet : ses propriétés, leurs types, ses méthodes. Elle ne contient aucune implémentation et disparaît complètement à la compilation.
>
> `readonly speed: number` signifie que l'utilisateur de l'interface peut **lire** `speed`, sans pouvoir le modifier. Un getter ou un simple attribut conviennent tous les deux.
>
> ### `implements`
>
> ```ts
> class Horse implements Transport {
>   public readonly name: string;
>   public readonly speed = 40;
>
>   public constructor(name: string) {
>     this.name = name;
>   }
>
>   public travel(distance: number): void {
>     console.log(`${this.name} gallops ${distance} km.`);
>   }
> }
> ```
>
> `implements` demande à TypeScript de **vérifier** que la classe respecte le contrat. Sans `travel()` : `Class 'Horse' incorrectly implements interface 'Transport'. Property 'travel' is missing in type 'Horse' but required in type 'Transport'.`
>
> Une classe ne peut étendre qu'une seule classe, mais peut implémenter **plusieurs** interfaces : `implements Transport, Describable`. Elle peut aussi faire les deux : `abstract class Vehicle implements Transport`.
>
> ### Le typage structurel
>
> En Java ou en C#, un objet n'est un `Transport` que si sa classe le déclare explicitement. TypeScript fonctionne différemment : il compare les **formes**. Un objet est accepté comme `Transport` dès qu'il possède tous les membres demandés, avec les bons types, même s'il n'a jamais entendu parler de l'interface. C'est le **typage structurel** (ou *duck typing* : « si ça marche comme un canard et cancane comme un canard… »).
>
> ```ts
> function journey(transport: Transport, distance: number): void {
>   console.log(`Departure with ${transport.name}`);
>   transport.travel(distance);
> }
>
> const skateboard = {
>   name: 'Skateboard',
>   speed: 15,
>   travel(distance: number) {
>     console.log(`Rolling for ${distance} km...`);
>   },
> };
>
> journey(skateboard, 2); // ✔ aucun implements, mais la forme est la bonne
> ```
>
> `implements` n'est donc pas obligatoire pour être compatible : il sert à **détecter les erreurs dans la classe elle-même**, au moment de son écriture, plutôt qu'au moment où on l'utilise.
>
> Si un membre manque, l'erreur est précise : `Property 'travel' is missing in type '{ ... }' but required in type 'Transport'.`
>
> ### Programmer pour une interface
>
> `journey` ne dépend que de `Transport`. Elle accepte des voitures, des chevaux, un skateboard, et accepterait demain un bateau ou une montgolfière, **sans être modifiée**. C'est le **principe ouvert/fermé** : le code est ouvert à de nouveaux types, mais fermé aux modifications.
>
> ### Classe abstraite ou interface ?
>
> | | Classe abstraite | Interface |
> | --- | :---: | :---: |
> | Décrit des propriétés et des méthodes | ✔ | ✔ |
> | Contient du code (implémentations, valeurs) | ✔ | ✘ |
> | Une classe peut en utiliser plusieurs | ✘ (une seule avec `extends`) | ✔ |
> | Existe à l'exécution (`instanceof`) | ✔ | ✘ |
> | Cas d'usage | Partager du **code** entre classes proches (`Vehicle`, `Car`, `Bike`) | Décrire une **capacité** commune à des objets variés (voiture, cheval, skateboard) |

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

Il s'agit d'un changement mécanique, à faire dans les cinq classes (`Skill`, `DamageSkill`, `RecoilSkill`, `DrainSkill`, `HealSkill`), sans oublier l'`import type` de `Fighter`. TypeScript ne signale pas une sous-classe oubliée : vérifier chacune d'elles.

5. Un dresseur peut aussi se battre à coups de poing, mais ce n'est pas un Pokémon : il n'a ni type, ni capacités. Créer un fichier `src/Trainer.ts` avec une classe `Trainer` qui **n'hérite d'aucune classe** et implémente `Fighter` :
   - `name` et `maxHp` publics en lecture seule, et `hp` public. Un simple attribut suffit : `readonly hp` dans l'interface signifie seulement que l'utilisateur d'un `Fighter` peut **lire** `hp`, la classe reste libre de le modifier ;
   - constructeur `public constructor(name: string, maxHp: number)` ;
   - `describe()` retourne `Trainer Ash - HP: 20/20` ;
   - `isAlive()` et `takeDamage(amount)`, les PV ne descendant jamais en dessous de 0 ;
   - `attack(target)` : le dresseur donne un coup de poing à la cible, qui inflige 5 dégâts.

```
Ash punches Pikachu! Pikachu loses 5 HP (30/35).
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

## Exercice 6 : Prendre du recul

<details>
<summary><strong>Cours : héritage, composition ou données ?</strong></summary>

> ### Ce qu'il faut retenir
>
> - L'**héritage** est adapté quand les sous-classes ont un **comportement** différent et une vraie relation « est-un » : `Car` et `Bike` **sont des** véhicules, et chacun se déplace à sa manière.
> - Quand les sous-classes ne diffèrent que par des **valeurs**, une **donnée** suffit. Créer `RedCar` et `BlueCar` n'aurait aucun sens : ces classes auraient exactement le même code, seule la couleur changerait. Un attribut `color` fait l'affaire.
> - Une classe n'a qu'un seul parent. Une voiture amphibie est à la fois une voiture et un bateau, mais `class AmphibiousCar extends Car, Boat` ne compile pas. Dès qu'un objet combine plusieurs caractéristiques, l'héritage atteint ses limites : on se tourne vers la **composition** ou les **données**.
> - Partager du code ne suffit pas à justifier l'héritage. Un cheval et une voiture ont tous deux un compteur de kilomètres, mais un cheval n'**est pas** une voiture. Pour ne pas dupliquer ce code, on peut extraire une classe dédiée (`Odometer`) que `Horse` et `Car` **utilisent** par composition.
> - Les **interfaces** permettent de faire coopérer des objets sans lien d'héritage : `journey` accepte une voiture et un cheval sans qu'ils aient de parent commun.
>
> D'où le conseil classique : *« préférer la composition à l'héritage »*. L'héritage n'est pas à proscrire, mais ce ne doit pas être le premier réflexe.

</details>

### Objectif

Se demander quand l'héritage est le bon outil.

### Questions

Répondre par écrit, en quelques lignes, aux questions suivantes.

1. On veut ajouter les faiblesses de types : les Pokémon Feu craignent l'eau, les Pokémon Eau craignent l'électricité… Un camarade propose de créer des sous-classes `FirePokemon`, `WaterPokemon`, `ElectricPokemon`…, chacune redéfinissant une méthode `getEffectiveness(skillType)` qui retourne le multiplicateur de dégâts. Comparer avec `RecoilSkill`, `DrainSkill` et `HealSkill` : qu'est-ce qui diffère d'une sous-classe à l'autre, du **code** ou des **valeurs** ?

2. Les jeux comptent **18 types**. Combien de classes faudrait-il ? Et Charizard (Dracaufeu), qui est de type **Feu et Vol** : peut-on écrire `class FireFlyingPokemon extends FirePokemon, FlyingPokemon` ?

---

## Bonus : une équipe générique

<details>
<summary><strong>Cours : classes génériques</strong></summary>

> Un **générique** est un paramètre de type : `Garage<T>` est un modèle de garage, et `T` est remplacé par un type concret à l'utilisation (`Garage<Car>`, `Garage<Horse>`).
>
> ```ts
> class Garage<T extends Transport> {
>   private _items: T[] = [];
>
>   public add(item: T): void {
>     this._items.push(item);
>   }
>
>   public getFirst(): T | undefined {
>     return this._items[0];
>   }
> }
>
> const garage = new Garage<Car>();
> garage.add(new Car('Clio', 180, 5));
> console.log(garage.getFirst()?.seats); // 5
> ```
>
> La contrainte `T extends Transport` limite les types acceptés à ceux qui respectent l'interface `Transport` : `new Garage<string>()` provoque `Type 'string' does not satisfy the constraint 'Transport'.` Dans la classe, on peut donc utiliser `name`, `speed` et `travel()` sur les éléments.
>
> Contrairement à un garage qui stockerait des `Transport[]`, la version générique **conserve le type précis** des éléments : `getFirst()` retourne une `Car`, pas un simple `Transport`, donc `seats` reste accessible. Et un `Garage<Car>` refuse un cheval.
>
> L'opérateur `?.` (*optional chaining*) lit `seats` seulement si `getFirst()` n'a pas retourné `undefined`.

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

