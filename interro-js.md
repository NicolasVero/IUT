# Interrogation JavaScript

---

## Connaissances générales

**À quoi sert le langage JavaScript ?**
- À rendre des pages web dynamiques et interactive, interagir avec des API, communiquer de manière asynchrone, etc.

---

**Qu'est-ce qu'ECMAScript ?**
- C'est la norme sur laquelle est basé JavaScript. ECMAScript définit les fonctionnalités du langage.

---

**Le langage JavaScript est :**
- Interprété
- Un langage côté client (mais peut aussi être utilisé côté serveur avec Node.js)
- Faiblement typé

---

**Quelle est la différence entre `null` et `undefined` ?**
- `undefined` : une variable déclarée mais non initialisée.
- `null` : une valeur explicitement affectée pour indiquer l'absence de valeur.

---

**Quelle est la différence entre `==` et `===` ?**
- `==` : comparaison de valeurs (avec conversion de type si nécessaire).
- `===` : comparaison de valeurs **et** de types (pas de conversion).

---
**Quelle est la différence entre un objet et un tableau ?**
- **Objet** : structure clé-valeur (ex. : `{ clé: "valeur" }`).
- **Tableau** : liste ordonnée d'éléments (ex. : `[1, 2, 3]`).

---

## Variables, types et portée

**Quelle est la différence entre `var`, `let` et `const` ?**
- `var` : portée globale ou de fonction, peut être redéclarée.
- `let` : portée de bloc, peut être réaffectée.
- `const` : portée de bloc, **ne peut pas** être réaffectée après initialisation.

---
**Qu'est-ce que le scope (portée) d'une variable ?**
- C'est la zone du code où une variable est accessible (ex. : globale, fonction, bloc).

---
**Quelles expressions généreront une erreur ?**
- `"10" + 1` → `"101"` (pas d'erreur, concaténation).
- `"10" - 1` → `9` (pas d'erreur, soustraction numérique).
- `"10" * new Date()` → `NaN` (pas d'erreur, mais résultat invalide).
- `"Hello" - 8 + "World"` → `NaN` (pas d'erreur, mais résultat invalide).

**Réponse :** Aucune (aucune erreur syntaxique, mais certains résultats sont inattendus).

---
---
## Fonctions & logique

**Qu'est-ce qu'une condition ?**
- Structure qui exécute du code en fonction d'une évaluation vraie (`if`, `else`, `switch`, etc.).

---
**Qu'est-ce qu'une boucle ?**
- Structure qui répète un bloc de code tant qu'une condition est vraie (`for`, `while`, etc.).

---
**Qu'est-ce qu'une fonction ?**
- Bloc de code réutilisable, déclaré avec `function` ou une syntaxe fléchée (`=>`).

---
**Qu'est-ce qu'une fonction asynchrone ? Que permet-elle et quel mot-clé permet de la définir ?**
- Elle permet d'exécuter du code de manière non bloquante.
- Mot-clé : `async`, utilisé avec `await` pour gérer les promesses.

---
---
## Manipulation du DOM et événements

**Comment sélectionner un élément HTML depuis JavaScript ?**
- Avec des méthodes comme `document.getElementById()`, `document.querySelector()`, etc.

---
**Qu'est-ce qu'un écouteur d'événement ?**
- Fonction qui s'exécute en réponse à un événement (ex. : clic, saisie).
- Ajouté avec `addEventListener()`.

---
**Comment empêcher le comportement par défaut d'un événement ?**
- Avec `event.preventDefault()` dans l'écouteur d'événement.

---
**Qu'est-ce qu'une API ? Que permet-elle de faire ?**
- Interface de programmation qui permet à des applications de communiquer entre elles (ex. : récupérer des données depuis un serveur).

---
---
## Exercices pratiques

### Exercice 1
Implémenter une fonction affichant dans la console les nombres de 1 à `n` (`n` passé en paramètre).

```javascript
function displayNumbers(n) {
  for (let i = 1; i <= n; i++) {
    console.log(i);
  }
}
```

### Exercice 2
Écrire une fonction qui prend en paramètre un tableau d'objets { name, price } et un seuil de réduction. Elle doit calculer le total du panier, et appliquer une réduction de 10% si le total dépasse le seuil. La fonction retourne le total final.

```javascript
function calculateTotal(items, discountThreshold) {
  const REDUCE = 0.9;

  let total = 0;
  for (const item of items) {
    total += item.price;
  }

  return (total > discountThreshold) ? total * REDUCE : total;
}
```
