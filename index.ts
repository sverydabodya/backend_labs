import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

import { lab3Handler } from './lab3/src/server';
import { lab4Handler } from './lab4/src/api';
import { lab5Handler } from './lab5/src/server';

const PORT = process.env.PORT || 3000;

const MIME_TYPES: Record<string, string> = {
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    const url = req.url || '/';

    const staticMatch = url.match(/^\/labs\/(lab\d+)\/(css|js|uploads|img)\/(.+)$/);
    
    if (staticMatch) {
        const labName = staticMatch[1]; 
        const folder = staticMatch[2]; 
        const filename = staticMatch[3]; 

        const filePath = path.join(__dirname, labName, 'public', folder, filename);

        if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(fs.readFileSync(filePath));
            return; 
        }
    }

    if (url.startsWith('/labs/lab3')) {
        return lab3Handler(req, res);
    }
    
    if (url.startsWith('/labs/lab4')) {
        return lab4Handler(req, res);
    }

    if (url.startsWith('/labs/lab5')) {
        return lab5Handler(req, res);
    }

    if (url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <h1>Мої лабораторні роботи з Бекенду</h1>
            <ul>
                <li><a href="/labs/lab3">Лабораторна робота №3 (ООП)</a></li>
                <li><a href="/labs/lab4">Лабораторна робота №4 (API та CSV)</a></li>
                <li><a href="/labs/lab5">Лабораторна робота №5 (SSR Форми)</a></li>
            </ul>
        `);
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found Gateway');
});

server.listen(PORT, () => {
    console.log(`Головний сервер запущено на порту ${PORT}`);
});