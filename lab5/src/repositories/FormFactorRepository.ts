import { FormFactor } from '../models/FormFactor';
import { BaseRepository } from './BaseRepository';

export class FormFactorRepository extends BaseRepository<FormFactor> {
    constructor() {
        super('form-factors.csv');
        this.loadData();
    }

    protected parseRow(line: string): FormFactor {
        const [id, name, targetDevice] =
            line.split(',').map(part => part.trim());

        return new FormFactor(
            Number(id),
            name,
            targetDevice
        );
    }

    protected serializeItem(item: FormFactor): string {
        return `${item.getId()},${item.getName()},${item.getTargetDevice()}`;
    }
}