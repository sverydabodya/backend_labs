export class FormFactor {
    constructor(
        private formFactorId: number,
        private formFactorName: string,
        private description: string,
        private imageUrl: string
    ) {}

    public getId(): number { return this.formFactorId; }
    public getName(): string { return this.formFactorName; }
}