/*Импортируем "chromium" из библиотеки "Playwright", чтобы создавать окна Chromium браузера.*/
import {chromium} from 'playwright';

/*Объект, содержащий данные и методы для граббинга.*/
export const vacancyCounter = {
    /*Свойство для хранения объекта с данными о Chromium браузере.*/
    browser: null,
    /*Свойство для хранения объекта с данными об открытой странице в Chromium браузере.*/
    page: null,

    /*Метод для запуска Chromium браузера и открытия в нем новой страницы.*/
    async init() {
        /*Используем метод "chromium.launch()", чтобы запустить окно Chromium браузера. Используем "{headless: false}",
        чтобы визуально видеть окно браузера.*/
        this.browser = await chromium.launch({headless: false});
        /*Используем метод "newPage()", чтобы открыть пустую страницу в Chromium браузере.*/
        this.page = await this.browser.newPage();
    },

    /*Метод для закрытия Chromium браузера.*/
    async destroy() {
        await this.browser.close();
    },

    /*Метод для граббинга.*/
    async fetchVacancyCount(technology, experience = 'doesNotMatter') {
        /*Формируем URL-объект, содержащий ссылку на страницу, с которой будет брать данные.*/
        const url01 = createVacancyUrl(
            {
                text: technology,
                experience: experience,
            });

        /*Пара примеров ссылок.*/
        const url02 = 'https://hh.ru/search/vacancy?text=React&excluded_text=&salary=&currency_code=RUR&experience=doesNotMatter&order_by=relevance&search_period=0&items_on_page=20&L_save_area=true&hhtmFrom=vacancy_search_filter';
        const url03 = 'https://hh.ru/search/vacancy?text=React&excluded_text=&salary=&currency_code=RUR&experience=between3And6&order_by=relevance&search_period=0&items_on_page=20&L_save_area=true&hhtmFrom=vacancy_search_filter';
        /*Тег, по которому будем искать данные.*/
        const tag01 = 'h1';
        /*Атрибут, по которому будем искать данные.*/
        const attribute01 = 'data-qa';
        /*Значение атрибута, по которому будем искать данные.*/
        const attributeValue01 = 'title';
        /*Формируем локатор из тега, атрибута и его значения в виде строки, который будет представлять HTML-элемент,
        содержащий нужные данные. Это то же самое, что и строка 'h1[data-qa="title"]'.*/
        const locator01 = `${tag01}[${attribute01}="${attributeValue01}"]`;

        /*Используем метод "goto()", чтобы в открытой странице Chromium браузера перейти по ссылке.*/
        await this.page.goto(url01);
        /*Используем метод "locator()", чтобы найти элемент. Используем метод "first()", чтобы найти первый элемент,
        который совпал.*/
        const element = await this.page.locator(locator01).first();
        /*Из найденного элемента берем свойство "innerText" и заменяем в нем все нецифровые символы на пустые символы.
        Полученные данные возвращаем.*/
        return Number((await element.innerText()).replace(/\D/g, ""));
    },
};

/*Функция для формирования ссылки для поиска данных.*/
function createVacancyUrl({
                              baseUrl = 'https://hh.ru/search/vacancy',
                              text = 'React',
                              excluded_text = '',
                              salary = '',
                              currency_code = 'RUR',
                              experience = 'doesNotMatter',
                              order_by = 'relevance',
                              search_period = 0,
                              items_on_page = 20,
                              L_save_area = true,
                              hhtmFrom = 'vacancy_search_filter',
                              /*Массив "search_fields" для добавления дополнительных полей если нужно.*/
                              search_fields = [],
                              enable_snippets = false
                          }) {
    /*Создаем URL-объект.*/
    const url = new URL(baseUrl);

    /*Наполняем наш URL-объект.*/
    url.searchParams.append('text', text);
    if (excluded_text) url.searchParams.append('excluded_text', excluded_text);
    if (salary) url.searchParams.append('salary', salary);
    if (currency_code) url.searchParams.append('currency_code', currency_code);
    url.searchParams.append('experience', experience);
    if (order_by) url.searchParams.append('order_by', order_by);
    url.searchParams.append('search_period', String(search_period));
    url.searchParams.append('items_on_page', items_on_page);
    url.searchParams.append('L_save_area', L_save_area);
    url.searchParams.append('hhtmFrom', hhtmFrom);

    search_fields.forEach(field => url.searchParams.append('search_field', field));
    if (enable_snippets) url.searchParams.append('enable_snippets', String(enable_snippets));

    /*Возвращаем созданный URL-объект.*/
    return url.toString();
};