export interface Fighter {
  readonly name: string;
  readonly hp: number;
  readonly maxHp: number;
  isAlive(): boolean;
  takeDamage(amount: number): void;
  attack(target: Fighter): void;
}
