# TP 1 : DOM, Événements & Persistence des Données avec `localStorage`

## Sommaire

- [TP 1 : DOM, Événements \& Persistence des Données avec `localStorage`](#tp-1--dom-événements--persistence-des-données-avec-localstorage)
  - [Sommaire](#sommaire)
  - [Exercice 1 : Structure du projet](#exercice-1--structure-du-projet)
  - [Exercice 2 : Récupération du formulaire](#exercice-2--récupération-du-formulaire)
  - [Exercice 3 : Écouteur d'événement `submit`](#exercice-3--écouteur-dévénement-submit)
  - [Exercice 4 : Récupération de tous les champs](#exercice-4--récupération-de-tous-les-champs)
  - [Exercice 5 : Stockage dans le `localStorage`](#exercice-5--stockage-dans-le-localstorage)
  - [Exercice 6 : Identifiant et suppression](#exercice-6--identifiant-et-suppression)
  - [Exercice 7 : Affichage des pokémons](#exercice-7--affichage-des-pokémons)

Chaque exercice se termine par un bloc **Cours** replié, signalé par une barre verticale une fois déroulé. Il contient les notions nécessaires pour traiter l'exercice ainsi que l'explication des pièges les plus fréquents. À ouvrir en cas de blocage, ou après coup pour vérifier sa compréhension.

---

## Exercice 1 : Structure du projet

### 1. Formulaire HTML

Créer un fichier `index.html` à la racine du projet, contenant un formulaire portant l'id `pokemon-form` avec les champs suivants :

| Champ              | Type      | Attributs                            |
| ------------------ | --------- | ------------------------------------ |
| Nom                | Texte     | `name="name"`, `id="name"`           |
| URL de l'image     | Texte     | `name="image_url"`, `id="image_url"` |
| Points de Vie (HP) | Numérique | `name="hp"`, `id="hp"`               |
| Attaque            | Numérique | `name="attack"`, `id="attack"`       |
| Type               | Select    | `name="type"`, `id="type"`           |

Le champ **Type** doit proposer au moins 3 options sélectionnables.

Ajouter également un bouton de soumission au formulaire.

### 2. Feuille de style CSS

Placer le fichier `style.css` suivant à la racine du projet :

<details>
<summary>styles.css</summary>

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
  margin: 28px 0 14px;
}

/* ── Formulaire ── */
form {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 20px;
  max-width: 640px;
  margin: 0 auto;
}

form label {
  font-weight: 700;
  font-size: 0.85rem;
  color: #555;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

form button[type="submit"] {
  grid-column: 1 / -1;
}

input,
select {
  padding: 9px 12px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-family: "Nunito", sans-serif;
  font-size: 0.9rem;
  background: #fafafa;
  color: #222;
  transition: border-color 0.15s;
}

input:focus,
select:focus {
  outline: none;
  border-color: #cc0000;
  background: #fff;
}

button[type="submit"] {
  background: #cc0000;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 11px 20px;
  font-family: "Nunito", sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

button[type="submit"]:hover {
  background: #aa0000;
}

/* ── Liste ── */
#pokemon-list {
  list-style: none;
  padding: 0;
  max-width: 640px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

@media (min-width: 800px) {
  #pokemon-list {
    max-width: 1100px;
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  #pokemon-list {
    max-width: 1600px;
    grid-template-columns: repeat(3, 1fr);
  }
}

.pokemon-item {
  background: #fff;
  border-radius: 10px;
  padding: 14px 16px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.07);
  display: flex;
  align-items: center;
  gap: 14px;
}

.pokemon-item img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  flex-shrink: 0;
}

.pokemon-item strong {
  font-size: 1rem;
  font-weight: 800;
}

.pokemon-item button {
  margin-left: auto;
  padding: 6px 12px;
  background: transparent;
  border: 1.5px solid #cc0000;
  color: #cc0000;
  border-radius: 6px;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.15s,
    color 0.15s;
}

.pokemon-item button:hover {
  background: #cc0000;
  color: #fff;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  form {
    grid-template-columns: 1fr;
  }

  form label:last-of-type,
  form button[type="submit"] {
    grid-column: 1;
  }
}
```

</details>

<details>
<summary><strong>Cours : les attributs <code>id</code> et <code>name</code></strong></summary>

> ### Pourquoi demander les deux ?
>
> Ces deux attributs se ressemblent mais ne servent pas du tout à la même chose.
>
> - **`id`** : l'identifiant de l'élément **dans la page**. Il doit être unique dans tout le document. C'est ce qui permet de cibler l'élément depuis le JS (`document.querySelector('#name')`) ou depuis le CSS (`#name { ... }`). C'est aussi ce que vise l'attribut `for` d'un `<label>`.
> - **`name`** : le nom du champ **dans les données du formulaire**. C'est la clé sous laquelle la valeur sera transmise au serveur au moment de la soumission. Un champ sans `name` n'est tout simplement pas envoyé.
>
> Dans ce TP, aucun serveur ne reçoit le formulaire : c'est le JS qui récupère les valeurs, et il travaille avec l'`id`. Le `name` reste malgré tout la convention à respecter, et il devient indispensable dès que l'on utilise l'objet `FormData`.
>
> ### Les types de champs
>
> L'attribut `type` d'un `<input>` change le comportement du navigateur, pas seulement son apparence :
>
> ```html
> <input type="text" name="name" id="name" />
> <input type="number" name="hp" id="hp" />
> ```
>
> Avec `type="number"`, le navigateur affiche des flèches d'incrément et refuse les caractères non numériques. Attention cependant : `input.value` renvoie **toujours une chaîne de caractères**, même pour un champ numérique. `"35"` et non `35`.
>
> ### Le cas du `<select>`
>
> Un `<select>` ne se remplit pas avec un attribut `value` mais avec des balises `<option>` :
>
> ```html
> <select name="type" id="type">
>   <option value="feu">Feu</option>
>   <option value="eau">Eau</option>
>   <option value="plante">Plante</option>
> </select>
> ```
>
> `select.value` renverra l'attribut `value` de l'option sélectionnée (`"feu"`), et non le texte affiché (`"Feu"`).
>
> ### Les labels
>
> Associer un `<label>` à chaque champ via `for` / `id` permet de cliquer sur le texte pour activer le champ, et rend le formulaire lisible par un lecteur d'écran :
>
> ```html
> <label for="name">Nom</label> <input type="text" name="name" id="name" />
> ```

</details>

---

## Exercice 2 : Récupération du formulaire

### Instructions

1. Créer un fichier `script.js` à la racine du projet et y ajouter le code suivant :

   ```javascript
   const form = document.querySelector("#pokemon-form");
   console.log("Form :", form);
   ```

2. Appeler le code avec la balise `<script src="script.js"></script>` placée dans le `<head>`. Pourquoi est-ce que le `console.log()` ne retourne pas notre élément `<form>` ?

<details>
<summary><strong>Cours : le chargement des scripts et la construction du DOM</strong></summary>

> ### Comment le navigateur lit une page
>
> Le navigateur analyse le fichier HTML **de haut en bas**, ligne après ligne. Au fur et à mesure de sa lecture, il construit le DOM : la représentation en mémoire de la page, sous forme d'arbre d'objets. C'est cet arbre, et non le fichier HTML, que le JS manipule.
>
> Ce point est la clé de tout l'exercice : à un instant donné, le DOM ne contient que ce qui a **déjà** été lu.
>
> ### Pourquoi `querySelector` renvoie-t-il `null` si le script est dans le `<head>` sans `defer` ?
>
> Une balise `<script>` sans attribut particulier est **bloquante**. Quand le navigateur la rencontre, il interrompt son analyse du document, télécharge le fichier, l'exécute entièrement, puis seulement reprend là où il s'était arrêté.
>
> Placée dans le `<head>`, cette interruption survient donc avant que le `<body>` n'ait été lu :
>
> ```html
> <head>
>   <script src="script.js"></script>
>   <-- exécuté ici, le DOM s'arrête là
> </head>
> <body>
>   <form id="pokemon-form">...</form>
>   <-- pas encore lu, donc absent du DOM
> </body>
> ```
>
> À ce stade, le `<body>` n'a pas encore été analysé ni construit dans le DOM : l'élément `#pokemon-form` n'existe donc pas encore dans l'arbre du DOM ! `document.querySelector` renvoie alors `null`.
>
> ### Un point important sur `null`
>
> `querySelector` ne lève **aucune erreur** quand il ne trouve rien : il renvoie `null`, ce qui est une réponse parfaitement valide. Le programme continue donc comme si de rien n'était, et l'erreur n'apparaît que plus loin, au premier usage de la variable :
>
> ```
> TypeError: Cannot read properties of null (reading 'addEventListener')
> ```
>
> C'est l'erreur qui attend à l'exercice 3. Sa traduction est toujours la même : _la sélection a échoué, l'élément visé n'existait pas au moment où le code s'est exécuté._ Le réflexe à prendre est de vérifier le sélecteur d'abord, le moment d'exécution ensuite.
>
> ### Les trois solutions pour résoudre ce problème
>
> 1. **Option 1 : Utiliser l'événement `DOMContentLoaded`**
>
>    Cet événement est déclenché par le navigateur lorsque le HTML a été entièrement analysé et le DOM entièrement construit. Le code placé à l'intérieur attend donc ce signal pour s'exécuter.
>
>    ```javascript
>    document.addEventListener("DOMContentLoaded", () => {
>      const form = document.querySelector("#pokemon-form");
>      console.log("Formulaire après chargement du DOM :", form);
>    });
>    ```
>
>    À ne pas confondre avec l'événement `load`, qui attend en plus le téléchargement des images et des feuilles de style, et arrive donc bien plus tard.
>
> 2. **Option 2 : Déplacer la balise à la fin du `<body>`**
>
>    ```html
>    <body>
>      <form id="pokemon-form">...</form>
>      <script src="script.js"></script>
>    </body>
>    ```
>
>    Le script étant lu en dernier, tout le reste du document est déjà dans le DOM. C'est la solution historique, encore très répandue, mais elle impose de garder le script au bon endroit.
>
> 3. **Option 3 : Utiliser l'attribut `defer` sur la balise script (Recommandé)**
>
>    ```html
>    <script src="script.js" defer></script>
>    ```
>
>    _L'attribut `defer` indique au navigateur de télécharger le fichier JS en arrière-plan pendant qu'il continue de parser le HTML, puis d'exécuter le script seulement une fois le DOM entièrement reconstruit._
>
> C'est la troisième option à privilégier : elle laisse la balise dans le `<head>`, ne bloque jamais l'analyse du document, et n'impose aucune imbrication supplémentaire dans le fichier JS.
>
> ### `defer` et `async`
>
> Ces deux attributs se ressemblent et sont souvent confondus. Tous deux téléchargent le script sans bloquer l'analyse du HTML, mais ils ne l'exécutent pas au même moment :
>
> | Attribut  | Téléchargement   | Exécution                    | Ordre entre scripts |
> | --------- | ---------------- | ---------------------------- | ------------------- |
> | _(aucun)_ | Bloque l'analyse | Immédiate                    | Respecté            |
> | `defer`   | En parallèle     | Une fois le DOM construit    | Respecté            |
> | `async`   | En parallèle     | Dès la fin du téléchargement | Non garanti         |
>
> `async` peut donc s'exécuter avant que le DOM ne soit prêt : il ne convient pas ici. Il est réservé aux scripts indépendants de la page, comme un outil de mesure d'audience.
>
> ### Et si on essayait de lire une valeur ?
>
> Une fois le formulaire correctement sélectionné, on pourrait vouloir lire directement le contenu d'un champ. Le résultat surprend :
>
> ```javascript
> const nameInput = document.querySelector("#name");
> console.log(nameInput.value); // ""
> ```
>
> Même si le champ est sélectionné avec succès, sa propriété `.value` au chargement initial de la page vaut `""` car l'utilisateur n'a encore rien saisi. Pour vérifier cela, mettre un attribut `value="Pikachu"` en HTML dans la balise input : la console affichera bien `"Pikachu"`.
>
> Il ne suffit donc pas que le DOM soit prêt : encore faut-il lire les champs **au bon moment**, c'est-à-dire une fois que l'utilisateur a saisi ses données et validé le formulaire. C'est tout l'objet de l'exercice suivant.

</details>

---

## Exercice 3 : Écouteur d'événement `submit`

### Instructions

Ajouter un écouteur d'événement `submit` sur le formulaire. Le but ici sera de récupérer les valeurs des champs au moment où l'utilisateur validera le formulaire.

```javascript
const form = document.querySelector("#pokemon-form");

form.addEventListener("submit", (event) => {});
```

Le problème que l'on a ici, est que la validation du formulaire induit également un rechargement de la page. À l'aide de la méthode `preventDefault()` sur `event`, empêcher la page de se recharger.

Afficher dans la console la valeur du champ `name` au moment de la soumission du formulaire.

<details>
<summary><strong>Cours : les événements et le comportement par défaut</strong></summary>

> ### Qu'est-ce qu'un écouteur d'événement ?
>
> `addEventListener` permet de dire au navigateur : « quand tel événement se produit sur tel élément, exécute cette fonction ». La fonction passée en second argument n'est **pas** appelée au moment où on écrit la ligne : elle est mise de côté, et le navigateur l'appellera plus tard, autant de fois que l'événement se produira.
>
> ```javascript
> element.addEventListener("...", (event) => {
>   // ce code s'exécute à chaque déclenchement
> });
> ```
>
> Quelques événements courants : `click`, `submit`, `input`, `change`, `keydown`, `mouseover`.
>
> ### L'objet `event`
>
> Le navigateur passe automatiquement un objet à notre fonction : il décrit ce qui vient de se passer. Ses propriétés les plus utiles :
>
> - `event.target` : l'élément sur lequel l'événement a réellement été déclenché.
> - `event.currentTarget` : l'élément sur lequel l'écouteur a été posé. Souvent identique à `target`, mais pas toujours (voir la délégation d'événement, exercice 7).
> - `event.preventDefault()` : annule le comportement natif du navigateur.
>
> Le nom du paramètre `event` est libre.
>
> ### Pourquoi la page se recharge-t-elle ?
>
> Un `<form>` possède un comportement natif, hérité des tout premiers sites web : à la soumission, le navigateur rassemble les valeurs des champs, construit une requête HTTP et **navigue** vers l'URL indiquée par l'attribut `action`. Si `action` est absent, il recharge la page courante.
>
> ### Ce que fait réellement `preventDefault()`
>
> Cette méthode annule l'action native que le navigateur allait exécuter. Elle n'est pas propre aux formulaires :
>
> | Élément                                  | Comportement natif annulé par `preventDefault()` |
> | ---------------------------------------- | ------------------------------------------------ |
> | `<form>` sur `submit`                    | Envoi des données et navigation                  |
> | `<a href="...">` sur `click`             | Navigation vers le lien                          |
> | `<input type="checkbox">` sur `click`    | Cochage de la case                               |
>
> ### Pourquoi écouter `submit` et non `click` sur le bouton ?
>
> L'événement `submit` se déclenche quelle que soit la manière dont l'utilisateur valide : clic sur le bouton, mais aussi touche Entrée depuis un champ texte. Écouter le `click` du bouton laisserait passer le second cas.

</details>

---

## Exercice 4 : Récupération de tous les champs

### Instructions

1. Récupérer l'ensemble des champs du formulaire au moment de la soumission de celui-ci.
2. Créer un objet contenant toutes les propriétés récupérées : `id_champ: valeur`.
3. Afficher cet objet dans la console.

<details>
<summary><strong>Cours : sélections multiples et objets dynamiques</strong></summary>

> ### Rappel important : `querySelector` vs `querySelectorAll`
>
> - `document.querySelector('input')` : Retourne **uniquement le premier élément** correspondant au sélecteur dans le document.
> - `document.querySelectorAll('input, select')` : Retourne une **NodeList** contenant **tous les éléments** correspondant au sélecteur.
>
> Le sélecteur suit exactement la même syntaxe qu'en CSS. La virgule signifie « ou » : `'input, select'` retourne donc à la fois les `<input>` et les `<select>`.
>
> Il est aussi possible de partir du formulaire plutôt que du document, pour limiter la recherche à ses descendants :
>
> ```javascript
> form.querySelectorAll("input, select");
> ```
>
> ### Une NodeList n'est pas un tableau
>
> C'est le premier piège de cet exercice. Une `NodeList` ressemble à un tableau (elle a une `length`, elle s'indexe avec `[0]`, elle possède un `forEach`), mais elle n'en est pas un : `map`, `filter` et `reduce` n'existent pas dessus.
>
> ```javascript
> const fields = document.querySelectorAll("input, select");
>
> fields.forEach((field) => console.log(field)); // fonctionne
> fields.map((field) => field.value); // TypeError : fields.map is not a function
> ```
>
> Pour disposer de toutes les méthodes de tableau, il faut convertir la NodeList :
>
> ```javascript
> const array = Array.from(fields);
> const array = [...fields]; // équivalent, avec l'opérateur de décomposition
> ```
>
> ### Construire un objet dont les clés sont dynamiques
>
> Second piège. Le nom de la propriété à créer n'est pas connu à l'avance : il dépend de l'id du champ en cours de traitement. La notation par point ne convient donc pas, car elle prend le mot écrit **littéralement** :
>
> ```javascript
> const element = {};
> const key = "color";
>
> element.key = "red"; // { key: 'red' }     <- le mot "key" lui-même
> element[key] = "red"; // { color: 'red' }  <- le contenu de la variable
> ```
>
> La notation entre crochets évalue ce qu'on lui donne et utilise le résultat comme nom de propriété. C'est elle qu'il faut utiliser ici.
>
> ### Le bouton de soumission
>
> Un `<button>` ou un `<input type="submit">` est lui aussi un champ de formulaire. Selon le sélecteur choisi, il peut se retrouver dans la NodeList et ajouter une propriété parasite à l'objet. Deux manières de l'éviter : affiner le sélecteur, ou donner à ce bouton un `id` que l'on ignore ensuite.
>
> ### Pour aller plus loin : `FormData`
>
> Le navigateur propose un objet dédié à cet usage, qui s'appuie sur les attributs `name` des champs :
>
> ```javascript
> const data = new FormData(form);
> const pokemon = Object.fromEntries(data);
> ```
>
> L'exercice se fait volontairement « à la main » pour manipuler le DOM, mais c'est cette approche qui sera privilégiée en pratique.

</details>

---

## Exercice 5 : Stockage dans le `localStorage`

Une fois notre objet créé, nous allons le stocker dans une zone du navigateur appelée le `localStorage`. C'est une zone dans laquelle un site peut déposer des données pour les réutiliser plus tard. Nous allons nous en servir comme une mini base de données pour conserver nos pokémons.

### Instructions

Écrire la fonction `pushPokemonToLocalStorage(pokemon)` qui prend un objet Pokémon en paramètre et l'ajoute dans un tableau nommé `'pokemons'` dans le `localStorage`.

<details>
<summary><strong>Cours : le <code>localStorage</code> et la sérialisation</strong></summary>

> ### Ce qu'est le `localStorage`
>
> Un espace de stockage clé/valeur fourni par le navigateur. Ses caractéristiques :
>
> - **Persistant** : les données survivent à la fermeture de l'onglet et du navigateur. Elles restent jusqu'à ce qu'on les supprime explicitement, ou que l'utilisateur vide ses données de navigation.
> - **Cloisonné par origine** : chaque couple protocole + domaine + port possède son propre stockage. Un autre site ne peut pas lire le nôtre.
> - **Limité** : environ 5 Mo selon les navigateurs. Suffisant pour ce TP, pas pour des fichiers.
> - **Synchrone** : les lectures et écritures bloquent le fil d'exécution. À éviter dans une boucle sur de gros volumes.
>
> Il existe un cousin, `sessionStorage`, dont l'API est identique mais dont les données disparaissent à la fermeture de l'onglet.
>
> ### Les quatre méthodes
>
> ```javascript
> localStorage.setItem("key", "value"); // écrit (écrase la valeur existante)
> localStorage.getItem("key");          // lit, ou renvoie null si la clé n'existe pas
> localStorage.removeItem("key");       // supprime une clé
> localStorage.clear();                 // vide tout le stockage de l'origine
> ```
>
> Pour inspecter son contenu : ouvrir les outils de développement, onglet **Application** (Chrome) ou **Stockage** (Firefox), puis **Local Storage**. C'est le meilleur moyen de vérifier ce que l'on vient d'écrire.
>
> ### Rappel important : la sérialisation des données
>
> Le `localStorage` ne peut stocker **que des chaînes de caractères** (`string`). On ne peut pas y stocker directement un objet ou un tableau JavaScript.
>
> - **`JSON.stringify(objet)`** : Transforme un objet/tableau JS en **chaîne de caractères JSON** _(JS ➔ JSON string)_.
> - **`JSON.parse(chaineJSON)`** : Transforme une chaîne JSON en **objet/tableau JS manipulable** _(JSON string ➔ JS)_.
>
> Sans `JSON.stringify`, le navigateur convertit l'objet en chaîne à sa manière, et le résultat est inexploitable :
>
> ```javascript
> localStorage.setItem("pokemons", { nom: "Pikachu" });
> localStorage.getItem("pokemons"); // "[object Object]" : la donnée est perdue
> ```
>
> ### Le piège du tout premier appel
>
> C'est l'erreur la plus fréquente de cet exercice. Au premier lancement, la clé `'pokemons'` n'existe pas encore :
>
> ```javascript
> localStorage.getItem("pokemons"); // null
> JSON.parse(null); // null  <- pas d'erreur, mais pas un tableau
> ```
>
> `JSON.parse(null)` ne lève aucune erreur : il renvoie simplement `null`. L'erreur arrive une ligne plus loin, au moment d'ajouter le pokémon :
>
> ```
> TypeError: Cannot read properties of null (reading 'push')
> ```
>
> La fonction doit donc prévoir le cas où rien n'a encore été stocké, et repartir d'un tableau vide.
>
> ### La logique attendue
>
> La fonction suit toujours le même déroulé, à retenir car il se répétera à l'exercice 6 :
>
> 1. Lire la chaîne stockée sous la clé `'pokemons'`.
> 2. La convertir en tableau JS, en prévoyant le cas « rien de stocké ».
> 3. Ajouter le nouveau pokémon à ce tableau.
> 4. Reconvertir le tableau en chaîne et le réécrire dans le `localStorage`.
>
> Modifier le tableau ne suffit pas : tant que l'étape 4 n'est pas faite, le `localStorage` contient toujours l'ancienne version.

</details>

---

## Exercice 6 : Identifiant et suppression

### Instructions

1. Modifier la fonction `pushPokemonToLocalStorage` pour qu'elle attribue à notre objet `pokemon` une propriété `id` générée avec `crypto.randomUUID()`.
2. Créer la fonction `removePokemonFromLocalStorage(id)`.

<details>
<summary><strong>Cours : identifiants uniques et suppression dans un tableau</strong></summary>

> ### Pourquoi un identifiant ?
>
> Pour supprimer un pokémon, il faut pouvoir le désigner sans ambiguïté. Les candidats évidents ne conviennent pas :
>
> - **Son nom** : rien n'empêche d'enregistrer deux Pikachu. La suppression en viserait deux.
> - **Sa position dans le tableau** : elle change dès qu'un élément situé avant lui est supprimé. L'index 3 d'aujourd'hui n'est pas celui de tout à l'heure.
>
> Un identifiant attribué à la création et jamais modifié règle les deux problèmes. C'est exactement le rôle de la clé primaire dans une base de données.
>
> ### `crypto.randomUUID()`
>
> Cette méthode native génère un UUID, une chaîne de 36 caractères statistiquement unique :
>
> ```javascript
> crypto.randomUUID(); // "3f2b1c8a-9d4e-4f7a-b6c2-1e8d9a0f5b3c"
> ```
>
> Elle n'est disponible que dans un **contexte sécurisé** : `https`, `localhost`, ou un fichier ouvert localement. Sur un site servi en `http` non local, `crypto.randomUUID` sera `undefined`.
>
> L'`id` doit être ajouté au moment de l'insertion, dans `pushPokemonToLocalStorage`, et non au moment de la lecture : il doit être stocké avec le reste des données pour qu'on puisse le retrouver plus tard.
>
> ### Supprimer un élément d'un tableau
>
> Deux approches existent, et elles ne se comportent pas de la même manière :
>
> | Méthode  | Effet                              | Retour                 |
> | -------- | ---------------------------------- | ---------------------- |
> | `filter` | Ne touche pas au tableau d'origine | Un **nouveau** tableau |
> | `splice` | Modifie le tableau d'origine       | Les éléments retirés   |
>
> `filter` est l'approche recommandée ici. Elle parcourt le tableau et conserve tous les éléments pour lesquels la fonction passée renvoie `true` :
>
> ```javascript
> const numbers = [1, 2, 3, 4];
> const odd = numbers.filter((number) => number % 2 === 0); // [2, 4]
> console.log(numbers); // [1, 2, 3, 4] : inchangé
> ```
>
> Le point d'attention est là : `filter` ne modifie rien, il **retourne** un nouveau tableau. Oublier de récupérer ce retour, ou oublier de le réécrire dans le `localStorage`, donne une fonction qui semble ne rien faire.
>
> ### La comparaison des identifiants
>
> Utiliser `===` et non `==`. Le premier compare valeur **et** type, le second effectue des conversions implicites aux résultats parfois surprenants :
>
> ```javascript
> "2" == 2; // true
> "2" === 2; // false
> ```
>
> ### La logique attendue
>
> Le même déroulé qu'à l'exercice 5, avec un filtrage en troisième étape : lire, convertir en tableau, retirer l'élément visé, puis réécrire l'ensemble dans le `localStorage`.

</details>

---

## Exercice 7 : Affichage des pokémons

### Instructions

Créer une fonction `displayPokemons()` qui récupérera la liste de tous nos pokémons dans le `localStorage`, et qui les affichera. Créer la structure en JS grâce aux fonctions JS `createElement`, `appendChild`, `innerHTML` et `className`.
Ajouter dans le HTML

### Structure HTML attendue pour chaque carte Pokémon

```html
<li class="pokemon-item">
  <strong>NOM</strong> (TYPE)<br />
  PV: hp, Attaque: attack
  <button onclick="removePokemonOnLocalStorage(ID)">Supprimer</button>
  <img
    src="URL_IMAGE"
    alt="NOM"
    onerror="this.src='https://www.pokepedia.fr/images/b/b1/Miniature_Pok%C3%A9_Ball_EV.png'"
  />
</li>
```

<details>
<summary><strong>Cours : créer des éléments et brancher leurs événements</strong></summary>

> ### Créer un élément en JS
>
> Un élément créé n'apparaît pas tant qu'il n'a pas été rattaché au document. Il faut toujours deux temps : le construire, puis l'insérer.
>
> ```javascript
> const card = document.createElement("div"); // création, invisible pour l'instant
> card.className = "pokemon-card"; // configuration
> conteneur.appendChild(card); // insertion dans le DOM
> ```
>
> Quelques propriétés utiles au passage :
>
> ```javascript
> element.className = "custom-classe"; // remplace toutes les classes
> element.classList.add("custom-classe"); // en ajoute une sans toucher aux autres
> element.textContent = "Pikachu"; // texte
> element.src = "https://..."; // attribut d'une image
> element.setAttribute("alt", "Pikachu"); // attribut quelconque
> ```
>
> ### `textContent` ou `innerHTML` ?
>
> Les deux insèrent du contenu, mais pas de la même manière :
>
> - `textContent` insère du **texte brut**. Les caractères `<` et `>` s'affichent tels quels.
> - `innerHTML` **interprète** la chaîne comme du HTML. Les balises qu'elle contient deviennent de vrais éléments.
>
> `innerHTML` est pratique pour les blocs contenant des balises, comme `<span>HP: <strong>35</strong></span>`. Mais il présente un risque dès que la chaîne provient de l'utilisateur : le HTML injecté est réellement exécuté. Un pokémon nommé `<img src=x onerror="alert('!')">` déclencherait ce code à chaque affichage. C'est le principe d'une faille XSS.
>
> La règle : `innerHTML` pour du HTML que l'on écrit soi-même, `textContent` pour toute donnée saisie par l'utilisateur.
>
> ### Le piège de l'accumulation
>
> `displayPokemons()` sera appelée plusieurs fois : au chargement de la page, après chaque ajout, après chaque suppression. Si la fonction se contente d'ajouter les cartes, celles du tour précédent sont toujours là et la liste se duplique à chaque appel.
>
> Il faut donc vider le conteneur avant de le remplir :
>
> ```javascript
> conteneur.innerHTML = "";
> ```
>
> Les pokémons sont dans le `localStorage`, mais rien ne les affiche au chargement de la page. Penser à appeler `displayPokemons()` une première fois au démarrage du script, puis après chaque ajout et chaque suppression.

</details>
