/*Библиотека Playwright - это библиотека для автоматизации браузеров, разработанная компанией Microsoft. Она
предназначена для создания тестов и автоматизации взаимодействия с веб-приложениями.

Установка Playwright tests: pnpm create playwright
Установка Playwright: pnpm install playwright
Запуск сбора данных: node index.js
Запуск сервера с собранными данными: node server.js

В файле "package.json" добавили "type": "module", чтобы JS файлы были модулями.*/

/*Импортируем объект, с методами и данными для получения данных. Есть два варианта:
1. "vacancy-counter.js" - собирает данные при помощи Playwright.
2. "vacancy-counter-api.js" - собирает данные при помощи API.*/
// import {vacancyCounter} from './vacancy-counter.js';
import {vacancyCounter} from './vacancy-counter-api.js';
/*Импортируем объект, содержащий данные и методы для репозитория нашего приложения.*/
import {repo} from './repository.js';

/*Написали функцию для имитации задержки при помощи промисов.*/
async function delay(ms) { await new Promise(resolve => setTimeout(resolve, ms))};

/*Функция для создания случайного целого числа в диапазоне. Нужна для тестирования.*/
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min};

/*Массивы со списками вакансий для поиска.*/
const frontendFrameworks = ['React', 'Vue', 'Angular'];
const webAreas = ['Frontend', 'Backend'];
const programmingLanguages = ['JavaScript', 'TypeScript', 'C#', 'Java', 'C++', 'Python'];
/*Массив со списком значений опыта для формирования ссылки.*/
const experience = ['doesNotMatter', 'noExperience', 'between1And3', 'between3And6', 'moreThan6'];

/*Главная функция приложения.*/
async function grabData(vacancies, experience, filename) {
    /*Запускаем Chromium браузер и открываем в нем новую страницу.*/
    await vacancyCounter.init();
    /*Создаем дату для того, чтобы знать, когда бы осуществлен сбор данных.*/
    const date = new Date();

    /*Перебираем технологии для поиска вакансий.*/
    for (let vacancy of vacancies) {
        /*Создаем дату для того, чтобы знать, когда бы осуществлен конкретный запрос.*/
        const exactDate = new Date();
        /*Запускаем процесс граббинга и сохраняем найденные данные.*/
        let vacancyCount = await vacancyCounter.fetchVacancyCount(vacancy, experience);
        vacancyCount += getRandomInt(100, 1000); // Только для тестирования!
        /*Сохраняем найденные данные в репозиторий.*/
        await repo.save(date, exactDate, vacancy, experience, vacancyCount, filename);
        /*Имитируем задержку в 2 секунды.*/
        await delay(1000);
        console.log('Checked: ' + vacancy + ' ' + experience + ' ' + vacancyCount);
    }

    /*Закрываем Chromium браузер.*/
    await vacancyCounter.destroy();
    console.log('Done!');
};

/*Запускаем приложение.*/
await grabData(frontendFrameworks, experience[2], 'frontend-frameworks-data.json');
await grabData(webAreas, experience[2], 'web-areas-data.json');
await grabData(programmingLanguages, experience[2], 'programming-languages-data.json');