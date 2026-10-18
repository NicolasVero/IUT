export interface Refuelable<FuelType extends string> {
    fillFuel(fuel: FuelType): void;
}
