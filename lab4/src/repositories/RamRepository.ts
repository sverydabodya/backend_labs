import * as fs from 'fs';
import * as path from 'path';
import { RamModel } from '../models/RamModel';
import { Manufacturer } from '../models/Manufacturer';

export class RamRepository {
    private rams: RamModel[] = [];
    private manufacturers: Map<number, Manufacturer> = new Map();
    
    private ramsFilePath = path.join(__dirname, '../../data/rams.csv');
    private mfgFilePath = path.join(__dirname, '../../data/manufacturers.csv');

    constructor() {
        this.loadData();
    }

    private loadData(): void {
        const mfgData = fs.readFileSync(this.mfgFilePath, 'utf-8');
        mfgData.trim().split('\n').forEach(line => {
            if (!line) return;
            const [id, name, country] = line.split(',');
            this.manufacturers.set(Number(id), new Manufacturer(Number(id), name, country));
        });

        const ramsData = fs.readFileSync(this.ramsFilePath, 'utf-8');
        this.rams = ramsData.trim().split('\n')
            .filter(line => line.length > 0)
            .map(line => {
                const [id, modelName, capacityGb, price, mfgId] = line.split(',');
                const manufacturer = this.manufacturers.get(Number(mfgId));
                if (!manufacturer) throw new Error(`Manufacturer ID ${mfgId} not found`);
                return new RamModel(Number(id), modelName, Number(capacityGb), Number(price), manufacturer);
            });
    }

    private saveData(): void {
        const csvContent = this.rams.map(r => 
            `${r.getId()},${r.getModelName()},${r.getCapacityGb()},${r.getPrice()},${r.getManufacturer().getId()}`
        ).join('\n');
        fs.writeFileSync(this.ramsFilePath, csvContent, 'utf-8');
    }

    public findAll(): RamModel[] {
        return this.rams;
    }

    public findById(id: number): RamModel | undefined {
        return this.rams.find(ram => ram.getId() === id);
    }

    public create(ram: RamModel): void {
        this.rams.push(ram);
        this.saveData();
    }

    public update(id: number, newPrice: number): boolean {
        const ram = this.findById(id);
        if (ram) {
            ram.setPrice(newPrice);
            this.saveData();
            return true;
        }
        return false;
    }

    public delete(id: number): boolean {
        const initialLength = this.rams.length;
        this.rams = this.rams.filter(ram => ram.getId() !== id);
        if (this.rams.length !== initialLength) {
            this.saveData();
            return true;
        }
        return false;
    }
}