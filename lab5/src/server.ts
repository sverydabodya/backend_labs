import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Manufacturer } from './models/Manufacturer';
import { MemoryType } from './models/MemoryType';
import { FormFactor } from './models/FormFactor';
import { RamModel } from './models/RamModel';
import { ManufacturerRepository } from './repositories/ManufacturerRepository';
import { MemoryTypeRepository } from './repositories/MemoryTypeRepository';
import { FormFactorRepository } from './repositories/FormFactorRepository';
import { RamRepository } from './repositories/RamRepository';
import { Lab5View } from './views/Lab5View';
import { parseMultipart, parseUrlEncoded, readRawBody } from './utils/formParser';

const manufacturerRepo = new ManufacturerRepository();
const memoryTypeRepo = new MemoryTypeRepository();
const formFactorRepo = new FormFactorRepository();
const ramRepo = new RamRepository(manufacturerRepo);

const UPLOADS_DIR = path.join(__dirname, '../public/uploads');
const ALLOWED_MIME: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif'
};

function sendHtml(res: http.ServerResponse, html: string, status = 200): void {
    res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
}

function redirectHome(res: http.ServerResponse): void {
    res.writeHead(302, { Location: '/labs/lab5' });
    res.end();
}

function cleanText(value: string | undefined): string {
    return (value || '').replace(/,/g, ' ').trim();
}

function parsePositiveNumber(value: string | undefined): number {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : NaN;
}

async function readFields(req: http.IncomingMessage): Promise<Record<string, string>> {
    const body = await readRawBody(req);
    return parseUrlEncoded(body.toString('utf-8'));
}

async function handleAddManufacturer(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    const post = await readFields(req);
    const name = cleanText(post.name);
    const country = cleanText(post.country);

    if (!name || !country) {
        sendHtml(res, Lab5View.manufacturerForm("Обов'язкові поля: назва та країна"), 400);
        return;
    }

    manufacturerRepo.create(new Manufacturer(manufacturerRepo.nextId(), name, country, ''));
    redirectHome(res);
}

async function handleAddMemoryType(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    const post = await readFields(req);
    const standardName = cleanText(post.standardName);
    const defaultVoltage = parsePositiveNumber(post.defaultVoltage);

    if (!standardName || Number.isNaN(defaultVoltage)) {
        sendHtml(res, Lab5View.memoryTypeForm("Обов'язкові поля: назва стандарту та додатна напруга"), 400);
        return;
    }

    memoryTypeRepo.create(new MemoryType(memoryTypeRepo.nextId(), standardName, defaultVoltage));
    redirectHome(res);
}

async function handleAddFormFactor(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    const post = await readFields(req);
    const formFactorName = cleanText(post.formFactorName);
    const targetDevice = cleanText(post.targetDevice);

    if (!formFactorName || !targetDevice) {
        sendHtml(res, Lab5View.formFactorForm("Обов'язкові поля: назва формфактора та target device"), 400);
        return;
    }

    formFactorRepo.create(new FormFactor(formFactorRepo.nextId(), formFactorName, targetDevice));
    redirectHome(res);
}

async function handleAddRam(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    const contentType = req.headers['content-type'] || '';
    const body = await readRawBody(req);
    const form = parseMultipart(body, contentType);
    const post = form.fields;
    const image = form.files.image;

    const modelName = cleanText(post.modelName);
    const capacityGb = parsePositiveNumber(post.capacityGb);
    const price = parsePositiveNumber(post.price);
    const manufacturer = manufacturerRepo.findById(Number(post.manufacturerId));

    if (!modelName || Number.isNaN(capacityGb) || Number.isNaN(price) || !manufacturer) {
        sendHtml(res, Lab5View.ramForm(manufacturerRepo.findAll(), "Перевірте модель, об'єм, ціну та виробника"), 400);
        return;
    }

    if (!image || !image.filename || image.data.length === 0) {
        sendHtml(res, Lab5View.ramForm(manufacturerRepo.findAll(), 'Завантажте зображення моделі'), 400);
        return;
    }

    const ext = ALLOWED_MIME[image.mimeType];
    if (!ext) {
        sendHtml(res, Lab5View.ramForm(manufacturerRepo.findAll(), `Недопустимий MIME-тип: ${image.mimeType}`), 400);
        return;
    }

    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    const storedName = `ram-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, storedName), image.data);

    ramRepo.create(new RamModel(
        ramRepo.nextId(),
        modelName,
        capacityGb,
        price,
        manufacturer,
        storedName
    ));
    redirectHome(res);
}

export const lab5Handler = (req: http.IncomingMessage, res: http.ServerResponse) => {
    const originalUrl = req.url || '/';
    req.url = originalUrl.replace('/labs/lab5', '') || '/';
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const method = req.method || 'GET';

    const run = async () => {
        if (pathname === '/' || pathname === '/index.html') {
            sendHtml(res, Lab5View.home(
                manufacturerRepo.findAll(),
                memoryTypeRepo.findAll(),
                formFactorRepo.findAll(),
                ramRepo.findAll()
            ));
            return;
        }

        if (pathname === '/add-manufacturer') {
            if (method === 'GET') {
                sendHtml(res, Lab5View.manufacturerForm());
                return;
            }
            if (method === 'POST') {
                await handleAddManufacturer(req, res);
                return;
            }
        }

        if (pathname === '/add-memory-type') {
            if (method === 'GET') {
                sendHtml(res, Lab5View.memoryTypeForm());
                return;
            }
            if (method === 'POST') {
                await handleAddMemoryType(req, res);
                return;
            }
        }

        if (pathname === '/add-form-factor') {
            if (method === 'GET') {
                sendHtml(res, Lab5View.formFactorForm());
                return;
            }
            if (method === 'POST') {
                await handleAddFormFactor(req, res);
                return;
            }
        }

        if (pathname === '/add-ram') {
            if (method === 'GET') {
                sendHtml(res, Lab5View.ramForm(manufacturerRepo.findAll()));
                return;
            }
            if (method === 'POST') {
                await handleAddRam(req, res);
                return;
            }
        }

        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
    };

    run().catch(error => {
        console.error(error);
        if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Internal Server Error');
        }
    }).finally(() => {
        req.url = originalUrl;
    });
};
