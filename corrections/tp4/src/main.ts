import { Pokemon } from './Pokemon';
// import { Skill } from './Skill';

const pikachu = new Pokemon('Pikachu', 'electric', 35);
console.log(pikachu)

//
// const charmander = new Pokemon('Charmander', 'fire', 39);
// const bulbasaur = new Pokemon('Bulbasaur', 'grass', 45);
// const squirtle = new Pokemon('Squirtle', 'water', 44);
//
// for (const pokemon of [pikachu, charmander, bulbasaur, squirtle]) {
//   console.log(`${pokemon.name}: ${pokemon.hp} HP`);
// }
//
// pikachu.takeDamage(20);
// console.log(pikachu.describe()); // Pikachu [electric] - HP: 15/35
// console.log(pikachu.isAlive()); // true
//
// pikachu.heal(100);
// console.log(pikachu.describe()); // Pikachu [electric] - HP: 35/35
//
// bulbasaur.takeDamage(9999);
// console.log(bulbasaur.describe()); // Bulbasaur [grass] - HP: 0/45
//
// console.log(pikachu.hp); // 35
//
// pikachu.hp = -50;
// console.log(pikachu.describe()); // Pikachu [electric] - HP: 0/35
// pikachu.hp = 1000;
// console.log(pikachu.describe()); // Pikachu [electric] - HP: 35/35
// console.log(pikachu);
//
// const healthiest = Pokemon.compare(pikachu, charmander);
// console.log(`Healthiest: ${healthiest.name}`);
//
// console.log(Pokemon.MAX_SKILLS); // 4
//
// const tackle = new Skill('Tackle', 'normal', 10);
//
// pikachu.learnSkill(new Skill('Thunderbolt', 'electric', 18));
// pikachu.learnSkill(tackle);
// charmander.learnSkill(new Skill('Ember', 'fire', 16));
// charmander.learnSkill(tackle);
// bulbasaur.learnSkill(new Skill('Vine Whip', 'grass', 15));
// squirtle.learnSkill(new Skill('Water Gun', 'water', 16));
//
// console.log(pikachu.skills.map((skill) => skill.describe()));
// pikachu.useSkill('Thunderbolt', charmander);
//
// try {
//   pikachu.useSkill('Surf', charmander);
// } catch (error) {
//   console.log((error as Error).message);
// }
//
// const mew = new Pokemon('Mew', 'normal', 100);
//
// try {
//   for (let i = 0; i < 5; i++) {
//     mew.learnSkill(tackle);
//   }
// } catch (error) {
//   console.log((error as Error).message);
// }
//
// try {
//   new Skill('Splash', 'water', 0);
// } catch (error) {
//   console.log((error as Error).message);
// }

// Pokemon.duel(pikachu, charmander);
//
// pikachu.heal(pikachu.maxHp);
// Pokemon.duel(pikachu, squirtle);
