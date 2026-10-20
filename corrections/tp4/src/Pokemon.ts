import type { PokemonType } from './types/pokemon.types';
import { Skill } from './Skill';

export class Pokemon {
  public static readonly MAX_SKILLS = 4;

  public readonly name: string;
  public readonly type: PokemonType;
  public readonly maxHp: number;
  private _hp: number;
  private _skills: Skill[] = [];

  public constructor(name: string, type: PokemonType, maxHp: number) {
    this.name = name;
    this.type = type;
    this.maxHp = maxHp;
    this._hp = maxHp;
  }

  public get hp(): number {
    return this._hp;
  }

  public set hp(value: number) {
    this._hp = Math.min(Math.max(value, 0), this.maxHp);
  }

  public describe(): string {
    return `${this.name} [${this.type}] - HP: ${this.hp}/${this.maxHp}`;
  }

  public takeDamage(amount: number): void {
    this.hp = this.hp - amount;
  }

  public heal(amount: number): void {
    this.hp = this.hp + amount;
  }

  public isAlive(): boolean {
    return this.hp > 0;
  }

  public get skills(): readonly Skill[] {
    return this._skills;
  }

  public learnSkill(skill: Skill): void {
    if (this._skills.length >= Pokemon.MAX_SKILLS) {
      throw new Error(`${this.name} cannot learn more than ${Pokemon.MAX_SKILLS} skills.`);
    }

    this._skills.push(skill);
  }

  public findSkill(skillName: string): Skill {
    const skill = this._skills.find((known) => known.name === skillName);

    if (!skill) {
      throw new Error(`${this.name} does not know ${skillName}.`);
    }

    return skill;
  }

  public useSkill(skillName: string, target: Pokemon): void {
    const skill = this.findSkill(skillName);

    target.takeDamage(skill.power);
    console.log(
      `${this.name} uses ${skill.name}! ${target.name} loses ${skill.power} HP (${target.hp}/${target.maxHp}).`
    );
  }

  public getStrongestSkill(): Skill {
    if (this._skills.length === 0) {
      throw new Error(`${this.name} does not know any skill.`);
    }

    return this._skills.reduce((best, skill) => (skill.power > best.power ? skill : best));
  }

  public static compare(a: Pokemon, b: Pokemon): Pokemon {
    return b.hp > a.hp ? b : a;
  }

  public static duel(a: Pokemon, b: Pokemon): Pokemon {
    let round = 1;

    while (a.isAlive() && b.isAlive()) {
      console.log(`--- Round ${round} ---`);

      a.useSkill(a.getStrongestSkill().name, b);

      if (b.isAlive()) {
        b.useSkill(b.getStrongestSkill().name, a);
      }

      round++;
    }

    const winner = a.isAlive() ? a : b;
    console.log(`${winner.name} wins the battle!`);

    return winner;
  }
}
