import type { Fighter } from './Fighter';

export class Trainer implements Fighter {
  private static readonly PUNCH_DAMAGE = 5;

  public readonly name: string;
  public readonly maxHp: number;
  public hp: number;

  public constructor(name: string, maxHp: number) {
    this.name = name;
    this.maxHp = maxHp;
    this.hp = maxHp;
  }

  public describe(): string {
    return `Trainer ${this.name} - HP: ${this.hp}/${this.maxHp}`;
  }

  public isAlive(): boolean {
    return this.hp > 0;
  }

  public takeDamage(amount: number): void {
    this.hp = Math.max(0, this.hp - amount);
  }

  public attack(target: Fighter): void {
    target.takeDamage(Trainer.PUNCH_DAMAGE);
    console.log(
      `${this.name} punches ${target.name}! ${target.name} loses ${Trainer.PUNCH_DAMAGE} HP (${target.hp}/${target.maxHp}).`
    );
  }
}
