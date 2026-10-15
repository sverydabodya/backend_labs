import { RamModel } from '../models/RamModel';
import { ManufacturerRepository } from './ManufacturerRepository';
import { BaseRepository } from './BaseRepository';

export class RamRepository extends BaseRepository<RamModel> {
    constructor(
        private manufacturers: ManufacturerRepository
    ) {
        super('rams.csv');
        this.loadData();
    }

    protected parseRow(line: string): RamModel {
        const [
            id,
            modelName,
            capacityGb,
            price,
            mfgId,
            imageUrl = ''
        ] = line.split(',').map(part => part.trim());

        const manufacturer = this.manufacturers.findById(Number(mfgId));

        if (!manufacturer) {
            throw new Error(`Manufacturer ID ${mfgId} not found`);
        }

        return new RamModel(
            Number(id),
            modelName,
            Number(capacityGb),
            Number(price),
            manufacturer,
            imageUrl
        );
    }

    protected serializeItem(item: RamModel): string {
        return [
            item.getId(),
            item.getModelName(),
            item.getCapacityGb(),
            item.getPrice(),
            item.getManufacturer().getId(),
            item.getImageUrl()
        ].join(',');
    }
}