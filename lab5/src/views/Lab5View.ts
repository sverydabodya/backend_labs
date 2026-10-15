import * as fs from 'fs';
import * as path from 'path';
import { Manufacturer } from '../models/Manufacturer';
import { MemoryType } from '../models/MemoryType';
import { FormFactor } from '../models/FormFactor';
import { RamModel } from '../models/RamModel';

const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function imageCell(filename: string): string {
    if (!filename) return '—';
    const filePath = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(filePath)) return escapeHtml(filename);
    return `<img src="/labs/lab5/uploads/${encodeURIComponent(filename)}" alt="">`;
}

function layout(title: string, body: string): string {
    return `<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="/labs/lab5/css/style.css">
</head>
<body>
    <p>
        <a href="/">Усі лабораторні</a> |
        <a href="/labs/lab5">Список записів</a> |
        <a href="/labs/lab5/add-manufacturer">+ Виробник</a> |
        <a href="/labs/lab5/add-memory-type">+ Стандарт пам'яті</a> |
        <a href="/labs/lab5/add-form-factor">+ Формфактор</a> |
        <a href="/labs/lab5/add-ram">+ Модель RAM</a>
    </p>
    ${body}
</body>
</html>`;
}

export class Lab5View {
    public static home(
        manufacturers: Manufacturer[],
        memoryTypes: MemoryType[],
        formFactors: FormFactor[],
        rams: RamModel[]
    ): string {
        const mfgRows = manufacturers.map(item => `
            <tr>
                <td>${item.getId()}</td>
                <td>${escapeHtml(item.getName())}</td>
                <td>${escapeHtml(item.getCountry())}</td>
                <td>${imageCell(item.getLogoUrl())}</td>
            </tr>`).join('');

        const typeRows = memoryTypes.map(item => `
            <tr>
                <td>${item.getId()}</td>
                <td>${escapeHtml(item.getName())}</td>
                <td>${item.getDefaultVoltage()}</td>
            </tr>`).join('');

        const ffRows = formFactors.map(item => `
            <tr>
                <td>${item.getId()}</td>
                <td>${escapeHtml(item.getName())}</td>
                <td>${escapeHtml(item.getTargetDevice())}</td>
            </tr>`).join('');

        const ramRows = rams.map(item => `
            <tr>
                <td>${item.getId()}</td>
                <td>${imageCell(item.getImageUrl())}</td>
                <td>${escapeHtml(item.getModelName())}</td>
                <td>${item.getCapacityGb()}</td>
                <td>${item.getPrice()}</td>
                <td>${escapeHtml(item.getManufacturer().getName())} (${escapeHtml(item.getManufacturer().getCountry())})</td>
            </tr>`).join('');

        return layout('Лабораторна 5 — довідник RAM', `
            <h1>Довідник моделей оперативної пам'яті (SSR)</h1>
            <p>Записи зберігаються в CSV. Після додавання спрацьовує Post/Redirect/Get — новий рядок одразу в таблиці.</p>

            <h2>Виробники</h2>
            <table>
                <thead><tr><th>ID</th><th>Назва</th><th>Країна</th><th>Логотип</th></tr></thead>
                <tbody>${mfgRows || '<tr><td colspan="4">Немає записів</td></tr>'}</tbody>
            </table>

            <h2>Стандарти пам'яті</h2>
            <table>
                <thead><tr><th>ID</th><th>Назва</th><th>Default voltage (В)</th></tr></thead>
                <tbody>${typeRows || '<tr><td colspan="3">Немає записів</td></tr>'}</tbody>
            </table>

            <h2>Формфактори</h2>
            <table>
                <thead><tr><th>ID</th><th>Назва</th><th>Target device</th></tr></thead>
                <tbody>${ffRows || '<tr><td colspan="3">Немає записів</td></tr>'}</tbody>
            </table>

            <h2>Моделі RAM</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Зображення</th>
                        <th>Модель</th>
                        <th>Об'єм (ГБ)</th>
                        <th>Ціна (грн)</th>
                        <th>Виробник</th>
                    </tr>
                </thead>
                <tbody>${ramRows || '<tr><td colspan="6">Немає записів</td></tr>'}</tbody>
            </table>
        `);
    }

    public static manufacturerForm(error = ''): string {
        return layout('Додати виробника', `
            <h1>Додати виробника</h1>
            ${error ? `<p class="error">${escapeHtml(error)}</p>` : ''}
            <form method="POST" action="/labs/lab5/add-manufacturer">
                <label>Назва
                    <input type="text" name="name" required>
                </label>
                <label>Країна
                    <input type="text" name="country" required>
                </label>
                <button type="submit">Зберегти</button>
            </form>
        `);
    }

    public static memoryTypeForm(error = ''): string {
        return layout("Додати стандарт пам'яті", `
            <h1>Додати стандарт пам'яті</h1>
            ${error ? `<p class="error">${escapeHtml(error)}</p>` : ''}
            <form method="POST" action="/labs/lab5/add-memory-type">
                <label>Назва стандарту
                    <input type="text" name="standardName" required>
                </label>
                <label>Default voltage (В)
                    <input type="number" name="defaultVoltage" step="0.01" min="0" required>
                </label>
                <button type="submit">Зберегти</button>
            </form>
        `);
    }

    public static formFactorForm(error = ''): string {
        return layout('Додати формфактор', `
            <h1>Додати формфактор</h1>
            ${error ? `<p class="error">${escapeHtml(error)}</p>` : ''}
            <form method="POST" action="/labs/lab5/add-form-factor">
                <label>Назва формфактора
                    <input type="text" name="formFactorName" required>
                </label>
                <label>Target device
                    <input type="text" name="targetDevice" required>
                </label>
                <button type="submit">Зберегти</button>
            </form>
        `);
    }

    public static ramForm(manufacturers: Manufacturer[], error = ''): string {
        const options = manufacturers.map(item =>
            `<option value="${item.getId()}">${escapeHtml(item.getName())} (${escapeHtml(item.getCountry())})</option>`
        ).join('');

        return layout('Додати модель RAM', `
            <h1>Додати модель RAM</h1>
            ${error ? `<p class="error">${escapeHtml(error)}</p>` : ''}
            <form method="POST" action="/labs/lab5/add-ram" enctype="multipart/form-data">
                <label>Назва моделі
                    <input type="text" name="modelName" required>
                </label>
                <label>Об'єм (ГБ)
                    <input type="number" name="capacityGb" min="1" required>
                </label>
                <label>Ціна (грн)
                    <input type="number" name="price" min="1" required>
                </label>
                <label>Виробник
                    <select name="manufacturerId" required>
                        <option value="">— оберіть —</option>
                        ${options}
                    </select>
                </label>
                <label>Зображення
                    <input type="file" name="image" accept="image/jpeg,image/png,image/webp,image/gif" required>
                </label>
                <button type="submit">Зберегти</button>
            </form>
        `);
    }
}
