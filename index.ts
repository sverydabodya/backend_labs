import * as http from 'http';
import { lab3Handler } from './lab3/src/server';
import { lab4Handler } from './lab4/src/api';

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    const url = req.url || '/';

    if (url.startsWith('/labs/lab3')) {
        return lab3Handler(req, res);
    }
    
    if (url.startsWith('/labs/lab4')) {
        return lab4Handler(req, res);
    }


    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
        <h1>Мої лабораторні роботи з Бекенду</h1>
        <ul>
            <li><a href="/labs/lab3">Лабораторна робота №3 (ООП)</a></li>
            <li><a href="/labs/lab4">Лабораторна робота №4 (API та CSV)</a></li>
            <li><a href="/labs/lab5">Лабораторна робота №5 (SSR Форми)</a></li>
        </ul>
    `);
});

server.listen(PORT, () => {
    console.log(`Головний сервер запущено на порту ${PORT}`);
});