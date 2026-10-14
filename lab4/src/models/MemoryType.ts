export class MemoryType {
    constructor(
        private typeId: number,
        private typeName: string,
        private defaultVoltage: number,
        private description: string,
        private imageUrl: string
    ) {}

    public getId(): number { return this.typeId; }
    public getName(): string { return this.typeName; }
    
    public getInfo(): string {
        return `${this.typeName} (${this.defaultVoltage}V)`;
    }
}