export class Manufacturer {
    constructor(
        private id: number,
        private name: string,
        private country: string,
        private logoUrl: string = ''
    ) {}

    public getId(): number { return this.id; }
    public getName(): string { return this.name; }
    public getCountry(): string { return this.country; }
    public getLogoUrl(): string { return this.logoUrl; }
}
