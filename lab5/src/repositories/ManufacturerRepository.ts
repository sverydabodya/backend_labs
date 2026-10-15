import { Manufacturer } from '../models/Manufacturer';
import { BaseRepository } from './BaseRepository';

export class ManufacturerRepository extends BaseRepository<Manufacturer> {
    constructor() {
        super('manufacturers.csv');
        this.loadData();
    }

    protected parseRow(line: string): Manufacturer {
        const [id, name, country, logoUrl = ''] =
            line.split(',').map(part => part.trim());

        return new Manufacturer(
            Number(id),
            name,
            country,
            logoUrl
        );
    }

    protected serializeItem(item: Manufacturer): string {
        return `${item.getId()},${item.getName()},${item.getCountry()},${item.getLogoUrl()}`;
    }
}