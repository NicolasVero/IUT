import { Vehicle } from "./Vehicle.js";
import { Refuelable } from "./Refuelable";

export class Donkey extends Vehicle implements Refuelable<"carrot"> {
    private donkeyName: string;

    constructor(fuel: string, fuelLevel: number, speed: number, donkeyName: string) {
        super(fuel, fuelLevel, speed);
        this.donkeyName = donkeyName;
    }

    public getDonkeyName(): string {
        return this.donkeyName;
    }

    public toString(): string {
        return `Donkey [name: ${this.donkeyName}] → ${super.toString()}`;
    }

    public fillFuel(fuel: "carrot"): void {
        this.fuelLevel = Math.min(this.fuelLevel + 25, 100);
    }

    public klaxon(): void {
        console.log("Hii Han");
    }
}