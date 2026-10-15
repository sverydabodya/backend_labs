import { Manufacturer } from './Manufacturer';

export class RamModel {
    constructor(
        private id: number,
        private modelName: string,
        private capacityGb: number,
        private price: number,
        private manufacturer: Manufacturer,
        private imageUrl: string = ''
    ) {}

    public getId(): number { return this.id; }
    public getModelName(): string { return this.modelName; }
    public getCapacityGb(): number { return this.capacityGb; }
    public getPrice(): number { return this.price; }
    public getManufacturer(): Manufacturer { return this.manufacturer; }
    public getImageUrl(): string { return this.imageUrl; }

    public setPrice(newPrice: number): void { this.price = newPrice; }
}
