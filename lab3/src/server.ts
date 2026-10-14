import * as http from 'http';
import { MemoryType } from './models/MemoryType';
import { FormFactor } from './models/FormFactor';
import { Manufacturer } from './models/Manufacturer';
import { RamModel } from './models/RamModel';
import { RamRepository } from './repositories/RamRepository';
import { RamView } from './views/RamView';

function generateOutput(): string {
    let output = '<html><head><meta charset="UTF-8"><title>Довідник ОЗП</title></head><body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">';
    output += '<h1>Довідник моделей оперативної пам’яті (OOP CRUD Demo)</h1>';

    const repo = new RamRepository();

    const ddr4 = new MemoryType(1, "DDR4 SDRAM", 1.2, "Standard", "img/ddr4.png");
    const ddr5 = new MemoryType(2, "DDR5 SDRAM", 1.1, "Next-gen", "img/ddr5.png");
    
    const dimm = new FormFactor(1, "DIMM", "Desktop", "img/dimm.png");
    const sodimm = new FormFactor(2, "SO-DIMM", "Laptop", "img/sodimm.png");

    const kingston = new Manufacturer(1, "Kingston", "USA", "kingston.com", "Leading", "img/king.png");
    const corsair = new Manufacturer(2, "Corsair", "USA", "corsair.com", "Premium", "img/corsair.png");
    const gskill = new Manufacturer(3, "G.Skill", "Taiwan", "gskill.com", "Extreme", "img/gskill.png");

    output += '<h2>1. Операція CREATE</h2>';
    const ram1 = new RamModel(101, "Fury Beast", 16, 2, 3200, 16, true, 1999, "Good DDR4", "img/1.png", ddr4, dimm, kingston);
    const ram2 = new RamModel(102, "Vengeance", 32, 2, 5200, 40, false, 4500, "Fast DDR5", "img/2.png", ddr5, dimm, corsair);
    const ram3 = new RamModel(103, "Trident Z5", 64, 2, 6000, 36, true, 8900, "Flagship", "img/3.png", ddr5, dimm, gskill);
    const ram4 = new RamModel(104, "ValueRAM", 8, 1, 2666, 19, false, 800, "Laptop", "img/4.png", ddr4, sodimm, kingston);

    repo.create(ram1);
    repo.create(ram2);
    repo.create(ram3);
    repo.create(ram4);
    output += '<p>✅ 4 моделі ОЗП додано.</p>';

    output += '<h2>2. Операція READ ALL (findAll)</h2>';
    let allRams = repo.findAll();
    allRams.forEach(r => output += RamView.render(r));

    output += '<h2>3. Операція READ BY ID (Пошук ID: 102)</h2>';
    const foundRam = repo.findById(102);
    if (foundRam) output += RamView.render(foundRam);

    output += '<h2>4. Операція UPDATE (ID: 101)</h2>';
    output += '<h3>ДО:</h3>';
    const beforeUpdate = repo.findById(101);
    if (beforeUpdate) output += RamView.render(beforeUpdate);
    
    repo.update(101, 2150, 3600);
    
    output += '<h3>ПІСЛЯ:</h3>';
    const afterUpdate = repo.findById(101);
    if (afterUpdate) output += RamView.render(afterUpdate);

    output += '<h2>5. Операція DELETE (ID: 104)</h2>';
    repo.delete(104);
    output += '<p>✅ Модель видалено.</p>';

    output += '<h3>Фінальний список:</h3>';
    allRams = repo.findAll();
    allRams.forEach(r => output += RamView.render(r));

    output += '</body></html>';
    return output;
}

export const lab3Handler = (req: http.IncomingMessage, res: http.ServerResponse) => {
    const originalUrl = req.url || '/';
    req.url = originalUrl.replace('/labs/lab3', '') || '/';

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(generateOutput());

    req.url = originalUrl;
};