import { Manufacturer } from './Manufacturer';

export class RamModel {
    constructor(
        private id: number,
        private modelName: string,
        private capacityGb: number,
        private price: number,
        private manufacturer: Manufacturer
    ) {}

    public getId(): number { return this.id; }
    public getModelName(): string { return this.modelName; }
    public getCapacityGb(): number { return this.capacityGb; }
    public getPrice(): number { return this.price; }
    public getManufacturer(): Manufacturer { return this.manufacturer; }

    public setPrice(newPrice: number): void { this.price = newPrice; }

    public toJSON(): object {
        return {
            id: this.id,
            modelName: this.modelName,
            capacityGb: this.capacityGb,
            price: this.price,
            manufacturer: {
                id: this.manufacturer.getId(),
                name: this.manufacturer.getName(),
                country: this.manufacturer.getCountry()
            }
        };
    }
}