/*Импортируем объект "promises" из модуля "fs". Модуль "fs" нужен для работы с файловой системой. Объект "fs.promises" -
это объект, который содержит методы для работы с файловой системой, возвращающие промисы вместо использования
callback-функций.*/
import {promises as fs} from 'fs';
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

/*Объект, содержащий данные и методы для репозитория нашего приложения.*/
export const repo = {
    /*Метод для создания файла "data.json" в текущей директории и добавления в него найденных данных.*/
    async save(date, exactDate, vacancy, experience, vacancyCount, filename) {
        /*Метод "path.join()" - это метод из встроенного модуля "path" в Node.js. Он используется для объединения
        нескольких сегментов пути в один полный путь. Метод "path.join()" автоматически обрабатывает разделители пути
        (например, / или \ в зависимости от операционной системы), что делает код более переносимым. Используя этот
        метод, создаем путь к файлу "data.json".*/
        const filePath = path.join(__dirname, `${filename}`);

        /*Упаковываем полученные данные.*/
        const entry = {
            date,
            exactDate,
            vacancy,
            experience,
            vacancyCount
        };

        /*Пытаемся записать файл.*/
        try {
            /*Метод "fs.readFile()" - это метод из встроенного модуля "fs" в Node.js, который используется для чтения
            содержимого файла. Второй параметр - это кодировка, в которой хотим получить данные. При помощи этого метода
            пытаемся прочитать файл "data.json", если он существует, и сохранить прочитанные данные.*/
            const existingData = await fs.readFile(filePath, 'utf8');
            /*Преобразовываем прочитанные данные в объект. В данном случае получим массив объектов.*/
            const data = JSON.parse(existingData);
            /*В полученный объект добавляем найденные данные.*/
            data.push(entry);
            /*Преобразовываем объект с данными в строку в формате JSON. Третий аргумент - это число, определяющее
            количество пробелов для отступов в результирующей строке JSON.*/
            const jsonData = JSON.stringify(data, null, 2);
            /*Метод "fs.writeFile()" - это метод из модуля "fs", который используется для записи данных в файл. Если
            файл не существует, он будет создан. Если файл уже существует, его содержимое будет перезаписано. При помощи
            метода "fs.writeFile()" записываем данные в файл "data.json".*/
            await fs.writeFile(filePath, jsonData, 'utf8');
        } catch (error) {
            /*Если при попытке записи файла происходит ошибка, например, файл не был найден, то преобразовываем
            полученные данными в строку в формате JSON, а затем записываем эти данные в файл "data.json".*/
            const jsonData = JSON.stringify([entry], null, 2);
            await fs.writeFile(filePath, jsonData, 'utf8');
        }
    }
};