import type { Fighter } from './Fighter';

export function duel(a: Fighter, b: Fighter): Fighter {
  let round = 1;

  while (a.isAlive() && b.isAlive()) {
    console.log(`--- Round ${round} ---`);
    a.attack(b);

    if (b.isAlive()) {
      b.attack(a);
    }

    round++;
  }

  const winner = a.isAlive() ? a : b;
  console.log(`${winner.name} wins the battle!`);

  return winner;
}
