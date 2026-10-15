export class MemoryType {
    constructor(
        private typeId: number,
        private typeName: string,
        private defaultVoltage: number
    ) {}

    public getId(): number { return this.typeId; }
    public getName(): string { return this.typeName; }
    public getDefaultVoltage(): number { return this.defaultVoltage; }

    public getInfo(): string {
        return `${this.typeName} (${this.defaultVoltage}V)`;
    }
}
