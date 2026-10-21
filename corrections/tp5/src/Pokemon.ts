import type { PokemonType } from './types/pokemon.types';
import type { Fighter } from './Fighter';
import { Skill } from './Skill';

export class Pokemon implements Fighter {
  public static readonly MAX_SKILLS = 4;

  public readonly name: string;
  public readonly type: PokemonType;
  public readonly maxHp: number;
  private _hp: number;
  private _skills: Skill[] = [];
  private _turn = 0;

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
    this._hp = Math.max(0, Math.min(value, this.maxHp));
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
      throw new Error(`${this.name} already knows ${Pokemon.MAX_SKILLS} skills.`);
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

  public useSkill(skillName: string, target: Fighter): void {
    this.findSkill(skillName).use(this, target);
  }

  public chooseSkill(): Skill {
    if (this._skills.length === 0) {
      throw new Error(`${this.name} does not know any skill.`);
    }

    const skill = this._skills[this._turn % this._skills.length];
    this._turn++;

    return skill;
  }

  public attack(target: Fighter): void {
    this.chooseSkill().use(this, target);
  }

  public static compare(a: Pokemon, b: Pokemon): Pokemon {
    return b.hp > a.hp ? b : a;
  }
}
