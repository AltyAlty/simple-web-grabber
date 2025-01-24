/*Объект, содержащий данные и методы для получения данных через API.*/
export const vacancyCounter = {
    /*Осталось для совместимости.*/
    async init() {
    },

    /*Осталось для совместимости.*/
    async destroy() {
    },

    /*Метод для получения данных через API.*/
    async fetchVacancyCount(technology, experience = 'doesNotMatter') {
        /*Создаем URL-объект на основе ссылки на API для получения данных по вакансиям.*/
        const url = new URL('https://api.hh.ru/vacancies');
        /*Формируем параметры для запроса на API.*/
        const params = {text: technology, experience: experience};
        /*Конструктор "URLSearchParams()" - это встроенный объект в JavaScript, который позволяет удобно работать с
        параметрами запроса в URL. Конструктор "URLSearchParams()" принимает объект или массив и создает новый объект
        типа "URLSearchParams", представляющий строку параметров запроса. При помощи этого конструктора формируем строку
        параметров запроса на API.*/
        url.search = new URLSearchParams(params).toString();
        /*Делаем запрос на API, получаем данные и сохраняем их.*/
        const result = await (await fetch(url)).json();
        /*Из найденных данных возвращаем свойство "found".*/
        return result.found;
    },
};