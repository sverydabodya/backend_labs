export class Manufacturer {
    constructor(
        private manufacturerId: number,
        private name: string,
        private country: string,
        private website: string,
        private description: string,
        private logoUrl: string
    ) {}

    public getId(): number { return this.manufacturerId; }
    public getName(): string { return this.name; }
    public getCountry(): string { return this.country; }
}