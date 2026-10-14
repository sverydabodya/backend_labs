import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { RamRepository } from './bootstrap';

const PORT = 3000;
const repo = new RamRepository();

const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);

    res.setHeader('Access-Control-Allow-Origin', '*');

    if (url.pathname === '/' || url.pathname === '/index.html') {
        const htmlPath = path.join(__dirname, '../public/index.html');
        const html = fs.readFileSync(htmlPath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
        return;
    }

    if (url.pathname === '/api/rams' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        
        const idParam = url.searchParams.get('id');
        
        if (idParam) {
            const ram = repo.findById(Number(idParam));
            if (ram) {
                res.end(JSON.stringify(ram.toJSON()));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Об'єкт не знайдено" }));
            }
        } else {
            const allRams = repo.findAll().map(r => r.toJSON());
            res.end(JSON.stringify(allRams));
        }
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`API Сервер запущено на http://localhost:${PORT}`);
});