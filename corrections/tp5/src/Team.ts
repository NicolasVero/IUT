import type { Fighter } from './Fighter';

export class Team<T extends Fighter> {
  private _members: T[] = [];

  public add(member: T): void {
    this._members.push(member);
  }

  public getAlive(): T[] {
    return this._members.filter((member) => member.isAlive());
  }

  public getLeader(): T | undefined {
    return this._members.find((member) => member.isAlive());
  }
}
