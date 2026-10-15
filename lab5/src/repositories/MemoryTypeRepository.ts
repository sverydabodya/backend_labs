import { MemoryType } from '../models/MemoryType';
import { BaseRepository } from './BaseRepository';

export class MemoryTypeRepository extends BaseRepository<MemoryType> {
    constructor() {
        super('memory-types.csv');
        this.loadData();
    }

    protected parseRow(line: string): MemoryType {
        const [id, name, defaultVoltage] =
            line.split(',').map(part => part.trim());

        return new MemoryType(
            Number(id),
            name,
            Number(defaultVoltage)
        );
    }

    protected serializeItem(item: MemoryType): string {
        return `${item.getId()},${item.getName()},${item.getDefaultVoltage()}`;
    }
}