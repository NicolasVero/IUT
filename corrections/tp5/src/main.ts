import { Pokemon } from './Pokemon';
import type { Skill } from './Skill';
import { DamageSkill } from './DamageSkill';
import { RecoilSkill } from './RecoilSkill';
import { DrainSkill } from './DrainSkill';
import { HealSkill } from './HealSkill';
import { Trainer } from './Trainer';
import { Team } from './Team';
import { duel } from './duel';

// Exercice 0

const pikachu = new Pokemon('Pikachu', 'electric', 35);
const charmander = new Pokemon('Charmander', 'fire', 39);
const bulbasaur = new Pokemon('Bulbasaur', 'grass', 45);
const squirtle = new Pokemon('Squirtle', 'water', 44);

pikachu.learnSkill(new DamageSkill('Thunderbolt', 'electric', 18));
charmander.learnSkill(new DamageSkill('Ember', 'fire', 16));
squirtle.learnSkill(new DamageSkill('Water Gun', 'water', 16));

console.log([pikachu, charmander, bulbasaur, squirtle].map((pokemon) => pokemon.describe()));

// Exercice 1

const takeDown = new RecoilSkill('Take Down', 'normal', 20, 0.25);
charmander.learnSkill(takeDown);

console.log(takeDown.describe());
console.log(takeDown.recoilRatio);
charmander.useSkill('Take Down', squirtle);

console.log(takeDown instanceof RecoilSkill);
console.log(takeDown instanceof DamageSkill);

try {
  new RecoilSkill('Broken', 'normal', -5, 0.25);
} catch (error) {
  console.log((error as Error).message);
}

// Exercice 2

bulbasaur.learnSkill(new DrainSkill('Mega Drain', 'grass', 14));
bulbasaur.takeDamage(20);
bulbasaur.useSkill('Mega Drain', pikachu);

const skill: Skill = takeDown;
skill.use(charmander, squirtle);

// Exercice 3

bulbasaur.learnSkill(new HealSkill('Synthesis', 'grass', 15));
charmander.heal(charmander.maxHp);
duel(bulbasaur, charmander);

// Exercice 5

const ash = new Trainer('Ash', 20);
console.log(ash.describe());

charmander.heal(charmander.maxHp);
squirtle.heal(squirtle.maxHp);
duel(charmander, squirtle);

pikachu.heal(pikachu.maxHp);
duel(pikachu, ash);

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

pikachu.heal(pikachu.maxHp);
duel(pikachu, punchingBag);

// Bonus

const team = new Team<Pokemon>();
team.add(pikachu);
team.add(charmander);

console.log(team.getLeader()?.type);
console.log(team.getAlive().map((member) => member.describe()));
