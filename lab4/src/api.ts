import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { RamRepository } from './repositories/RamRepository';

const repo = new RamRepository();

export const lab4Handler = (req: http.IncomingMessage, res: http.ServerResponse) => {
    const originalUrl = req.url || '/';
    req.url = originalUrl.replace('/labs/lab4', '') || '/';
    const url = new URL(req.url, `http://${req.headers.host}`);

    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        if (url.pathname === '/' || url.pathname === '/index.html') {
            const htmlPath = path.join(__dirname, '../public/index.html');
            const html = fs.readFileSync(htmlPath, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(html);
            return;
        }

        if (url.pathname === '/api/rams' && req.method === 'GET') {
            const idParam = url.searchParams.get('id');
            
            if (idParam) {
                const ram = repo.findById(Number(idParam));
                if (ram) {
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify(ram.toJSON()));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: "Об'єкт не знайдено" }));
                }
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                const allRams = repo.findAll().map(r => r.toJSON());
                res.end(JSON.stringify(allRams));
            }
            return;
        }

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    } finally {
        req.url = originalUrl;
    }
}