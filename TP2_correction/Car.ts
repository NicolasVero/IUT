import { Immatriculation } from "./Immatriculation.js";
import { Refuelable } from "./Refuelable";
import { Vehicle } from "./Vehicle.js";


export class Car extends Vehicle implements Immatriculation, Refuelable<"gasoline"> {
    private carBrand: string;
    public immatriculation: string;

    constructor(fuel: string, fuelLevel: number, speed: number, carBrand: string, immatriculation: string) {
        super(fuel, fuelLevel, speed);
        this.carBrand = carBrand;
        this.immatriculation = immatriculation;
    }

    public getCarBrand(): string {
        return this.carBrand;
    }

    public toString(): string {
        return `Car [brand: ${this.carBrand}] → ${super.toString()}`;
    }

    public fillFuel(fuel: "gasoline"): void {
        this.fuelLevel = 100;
    }

    public klaxon(): void {
        console.log("Tuut");
    }
}
