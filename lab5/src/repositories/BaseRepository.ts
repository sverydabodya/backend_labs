import * as fs from 'fs';
import * as path from 'path';

interface HasId {
    getId(): number;
}

export abstract class BaseRepository<T extends HasId> {
    protected items: T[] = [];
    protected readonly filePath: string;

    constructor(fileName: string) {
        this.filePath = path.join(
            __dirname,
            '../../data',
            fileName
        );
    }

    protected abstract parseRow(line: string): T;

    protected abstract serializeItem(item: T): string;

    protected loadData(): void {
        if (!fs.existsSync(this.filePath)) {
            this.items = [];
            return;
        }

        const data = fs.readFileSync(this.filePath, 'utf-8');

        this.items = data
            .split(/\r?\n/)
            .filter(line => line.trim().length > 0)
            .map(line => this.parseRow(line));
    }

    protected saveData(): void {
        const csvContent = this.items
            .map(item => this.serializeItem(item))
            .join('\n');

        fs.writeFileSync(this.filePath, csvContent, 'utf-8');
    }

    public findAll(): T[] {
        return [...this.items];
    }

    public findById(id: number): T | undefined {
        return this.items.find(item => item.getId() === id);
    }

    public nextId(): number {
        return Math.max(
            0,
            ...this.items.map(item => item.getId())
        ) + 1;
    }

    public create(item: T): void {
        this.items.push(item);
        this.saveData();
    }
}