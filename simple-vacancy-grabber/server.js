/*
Запуск сервера: node server.js
*/

/*Импортируем модуль "http", который предоставляет функциональность для создания HTTP-сервера и работы с HTTP-запросами
и ответами. С его помощью можно слушать входящие HTTP-запросы и отправлять HTTP-ответы.*/
import http from 'http';
/*Импортируем модуль "fs", который нужен для работы с файловой системой.*/
import fs from 'fs';
/*Импортируем модуль "path", который предоставляет утилиты для работы с путями файловой системы.*/
import path from 'path';
/*Импортируем функцию "fileURLToPath()" из модуля "url". Модуль "url" предоставляет методы для работы с URL. Функция
"fileURLToPath()" преобразует объект URL (в формате "file://") в строку, представляющую путь к файлу в файловой
системе.*/
import {fileURLToPath} from 'url';

/*Объект "import.meta" - это специальный объект, доступный в модулях ES6. Он содержит метаданные о текущем модуле. В
частности, "import.meta.url" возвращает URL текущего модуля в формате "file://", если модуль загружен из файловой
системы. Получаем путь до текущего файла.*/
const __filename = fileURLToPath(import.meta.url);
/*Метод "path.dirname()" - это метод из встроенного модуля "path" в Node.js. Он принимает путь к файлу и возвращает путь
к его родительской директории. Получаем путь до директории текущего файла.*/
const __dirname = `${path.dirname(__filename)}/collected_data`;

const server = http.createServer((req, res) => {
    let filePath;

    // Определяем, какой файл запрашивается на основе URL
    switch (req.url) {
        case '/frontend-frameworks-data':
            filePath = path.join(__dirname, 'frontend-frameworks-data.json');
            break;
        case '/web-areas-data':
            filePath = path.join(__dirname, 'web-areas-data.json');
            break;
        case '/programming-languages-data':
            filePath = path.join(__dirname, 'programming-languages-data.json');
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('File not found');
            return;
    }

    // Читаем файл и отправляем его в ответ
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Error loading file');
        } else {
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            });

            res.end(data);
        }
    });
});

server.listen(3000, () => { console.log('Server running at http://localhost:3000')});