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

/*При помощи метода "http.createServer()" создаем экземпляр сервера.*/
const server = http.createServer((req, res) => {
    let filePath;

    /*Определяем, какой файл запрашивается на основе URL.*/
    switch (req.url) {
        case '/frontend-frameworks-data':
            /*Метод "path.join()" - это метод из встроенного модуля "path" в Node.js. Он используется для объединения
            нескольких сегментов пути в один полный путь.*/
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

    /*Метод "fs.readFile()" - это метод из встроенного модуля "fs" в Node.js, который используется для чтения
    содержимого файла. Читаем файл и пытаемся его отправить.*/
    fs.readFile(filePath, (err, data) => {
        if (err) {
            /*Метод "res.writeHead()" является методом в Node.js, который используется для установки заголовков
            HTTP-ответа.*/
            res.writeHead(500);
            /*Метод "res.end()" - это метод в Node.js, который используется для завершения HTTP-ответа. Он сигнализирует
            о том, что все данные, которые необходимо отправить клиенту, были отправлены. После вызова этого метода
            сервер больше не может отправлять дополнительные данные в этом ответе.*/
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

/*Метод "listen()" запускает сервер и начинает прослушивание входящих запросов на указанном порту. Второй аргумент этого
метода - это callback-функция, которая будет выполнена, когда сервер успешно начнет прослушивание.*/
server.listen(3000, () => { console.log('Server running at http://localhost:3000')});