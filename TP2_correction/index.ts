import { Car } from "./Car.js";

const cars: Car[] = [
    new Car("gasoline", 100, 120, "Toyota", "AB-001-CD"),
    new Car("gasoline", 80, 130, "Tesla", "EF-002-GH"),
    new Car("gasoline", 60, 110, "Ford", "IJ-003-KL"),
    new Car("gasoline", 90, 125, "BMW", "MN-004-OP"),
    new Car("gasoline", 70, 115, "Audi", "QR-005-ST"),
    new Car("gasoline", 50, 140, "Mercedes", "UV-006-WX"),
];

let raceOngoing: boolean = true;

while (raceOngoing) {
    raceOngoing = false;
    for (const car of cars) {
        if (car.move()) {
            raceOngoing = true;
        }
    }
}

cars.sort((a, b) => b.getDistanceTravelled() - a.getDistanceTravelled());

console.log("🏁 Classement final de la course :");
cars.forEach((car, index) => {
    console.log(
        `${index + 1}. ${car.toString()} → Distance parcourue: ${car.getDistanceTravelled()}`
    );
});
