import { MemoryType } from './MemoryType';
import { FormFactor } from './FormFactor';
import { Manufacturer } from './Manufacturer';

export class RamModel {
    constructor(
        private ramId: number,
        private modelName: string,
        private capacityGb: number,
        private kit: number,
        private frequencyMhz: number,
        private casLatency: number,
        private hasRgb: boolean,
        private price: number,
        private description: string,
        private imageUrl: string,
        private memoryType: MemoryType,
        private formFactor: FormFactor,
        private manufacturer: Manufacturer
    ) {}

    public getId(): number { return this.ramId; }
    public getModelName(): string { return this.modelName; }
    public getCapacityGb(): number { return this.capacityGb; }
    public getKit(): number { return this.kit; }
    public getFrequencyMhz(): number { return this.frequencyMhz; }
    public getCasLatency(): number { return this.casLatency; }
    public getHasRgb(): boolean { return this.hasRgb; }
    public getPrice(): number { return this.price; }
    public getMemoryType(): MemoryType { return this.memoryType; }
    public getFormFactor(): FormFactor { return this.formFactor; }
    public getManufacturer(): Manufacturer { return this.manufacturer; }

    public setPrice(newPrice: number): void { this.price = newPrice; }
    public setFrequency(newFrequency: number): void { this.frequencyMhz = newFrequency; }
    public setHasRgb(rgbStatus: boolean): void { this.hasRgb = rgbStatus; }
}