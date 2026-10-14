import { RamModel } from '../models/RamModel';

export class RamView {
    public static render(ram: RamModel): string {
        return `
            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
                <strong>[ID: ${ram.getId()}] ${ram.getManufacturer().getName()} ${ram.getModelName()}</strong><br>
                <em>Характеристики:</em> ${ram.getCapacityGb()}GB (${ram.getKit()}x планок), 
                ${ram.getMemoryType().getInfo()}, ${ram.getFormFactor().getName()}, 
                ${ram.getFrequencyMhz()}MHz, CL${ram.getCasLatency()}<br>
                <em>RGB:</em> ${ram.getHasRgb() ? 'Так' : 'Ні'} | <em>Ціна:</em> <b>${ram.getPrice()} грн</b>
            </div>
        `;
    }
}