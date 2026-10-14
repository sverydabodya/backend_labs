import { RamModel } from '../models/RamModel';

export class RamRepository {
    private rams: RamModel[] = [];

    public create(ram: RamModel): void {
        this.rams.push(ram);
    }

    public findAll(): RamModel[] {
        return this.rams;
    }

    public findById(id: number): RamModel | undefined {
        return this.rams.find(ram => ram.getId() === id);
    }

    public update(id: number, newPrice: number, newFrequency: number): boolean {
        const ram = this.findById(id);
        if (ram) {
            ram.setPrice(newPrice);
            ram.setFrequency(newFrequency);
            return true;
        }
        return false;
    }

    public delete(id: number): boolean {
        const initialLength = this.rams.length;
        this.rams = this.rams.filter(ram => ram.getId() !== id);
        return this.rams.length !== initialLength;
    }
}