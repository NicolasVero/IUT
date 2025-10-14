export abstract class Vehicle {
    protected fuel: string;
    protected fuelLevel: number;
    protected speed: number;
    protected distanceTravelled: number;

    public constructor(fuel: string, fuelLevel: number, speed: number) {
        this.fuel = fuel;
        this.fuelLevel = fuelLevel;
        this.speed = speed;
        this.distanceTravelled = 0;
    }

    public abstract fillFuel(fuel: string): void;

    public getFuel(): string {
        return this.fuel;
    }

    public getFuelLevel(): number {
        return this.fuelLevel;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public getDistanceTravelled(): number {
        return this.distanceTravelled;
    }

    public toString(): string {
        return `Vehicle running on ${this.fuel}, fuel level: ${this.fuelLevel}, speed: ${this.speed}, distance travelled: ${this.distanceTravelled}`;
    }

    public move(): boolean {
        if (this.fuelLevel >= 5) {
            this.fuelLevel -= 5;
            this.distanceTravelled += this.speed;
            return true;
        } else {
            return false;
        }
    }

    public klaxon(): void {
        throw new Error("A generic vehicle cannot make a sound!");
    }
}
