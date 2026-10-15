export class FormFactor {
    constructor(
        private formFactorId: number,
        private formFactorName: string,
        private targetDevice: string
    ) {}

    public getId(): number { return this.formFactorId; }
    public getName(): string { return this.formFactorName; }
    public getTargetDevice(): string { return this.targetDevice; }
}
