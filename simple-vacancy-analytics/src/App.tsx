/*
Библиотека Vite это аналог Create React App (CRA). Библиотека Vite - это инструмент для сборки и разработки
веб-приложений, который предлагает высокую производительность и удобство.

Установка Vite:
pnpm create vite
pnpm install

Библиотека Tremor позволяет создавать различные графики на основе компонентов. Библиотека Tremor работает в связке с
React и Tailwind CSS.

Документация по установке Tremor: https://npm.tremor.so/docs/getting-started/installation
Установка Tremor:
pnpm install -D tailwindcss@^3 postcss autoprefixer
pnpx tailwindcss init -p

В файле "src/index.css" удалить и добавить следующее:
@tailwind base;
@tailwind components;
@tailwind utilities;

pnpm install @headlessui/react
pnpm install @headlessui/tailwindcss (возможно не требуется)
pnpm install -D @tailwindcss/forms
pnpm install @tremor/react
pnpm install @remixicon/react

Запуск: npm run dev

Как включить светлую тему: установить " darkMode: 'class' " в "tailwind.config.js".
*/

/*Из библиотеки Tremor импортируем компоненты "LineChart", "Card" и "Divider".*/
import {LineChart, Card, Divider} from '@tremor/react';
/*Из React импортируем хуки "useEffect()" и "useState()".*/
import {useEffect, useState} from 'react';

/*Главный компонент приложения.*/
function App() { return <><VacancyCountChart/></>};

/*Тип для элементов, из которых состоят JSON-данные, приходящие от сервера.*/
type ServerDataItem = {
    date: string;
    exactDate: string;
    vacancy: string;
    experience: string;
    vacancyCount: number;
};

/*Тип для агрегированных данных с сервера по временному ключу.*/
type AggregatedServerData = {
    [timeKey: string]: {
        [vacancy: string]: number;
    };
};

/*Тип для элементов, из которых состоят данные для отрисовки графиков.*/
type ItemForDataForChart = {
    date: string;
    [key: string]: number | string;
};

/*Тип для данных, на основе которых будет отрисовка графиков.*/
type DataForChart = {
    categories: Set<string>;
    items: ItemForDataForChart[];
    experience: string;
};

/*Функция для подготовки данных, которые придут с сервера, в формат данных, требуемых для отрисовки графиков.*/
function mapServerDataForChart(serverData: ServerDataItem[]): DataForChart {
    /*Заготавливаем объект для агрегированных по временному ключу данных с сервера.*/
    const aggregatedServerData: AggregatedServerData = {};

    serverData.forEach(item => {
        /*Подготавливаем временной ключ для агрегированных данных с сервера.*/
        const serverDate = new Date(item.date);
        const year = serverDate.getUTCFullYear();
        const month = String(serverDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(serverDate.getUTCDate()).padStart(2, '0');
        const hours = String(serverDate.getUTCHours()).padStart(2, '0');
        const minutes = String(serverDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(serverDate.getUTCSeconds()).padStart(2, '0');
        const formattedServerDate = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;

        /*Заполняем объект для агрегированных по временному ключу данных с сервера.*/
        if (!aggregatedServerData[formattedServerDate]) { aggregatedServerData[formattedServerDate] = {} }
        if (!aggregatedServerData[formattedServerDate][item.vacancy]) { aggregatedServerData[formattedServerDate][item.vacancy] = 0 }
        aggregatedServerData[formattedServerDate][item.vacancy] += item.vacancyCount;
    });

    console.log(aggregatedServerData);

    /*Заготавливаем объект для данных, на основе которых будет отрисовка графиков.*/
    const dataForChart: DataForChart = {
        categories: new Set<string>(),
        items: [],
        experience: serverData[0].experience
    };

    /*Заполняем объект для данных, на основе которых будет отрисовка графиков.*/
    Object.entries(aggregatedServerData).forEach(
        ([key, value]) => {

            Object.keys(value).forEach((vacancy) => {
                dataForChart.categories.add(vacancy);
            });

            const isValueValid = Object.values(value).every(val => typeof val === 'number');

            if (isValueValid) {
                const item: ItemForDataForChart = {
                    date: key, ...value as {
                        [key: string]: number
                    }
                } as ItemForDataForChart;

                dataForChart.items.push(item);
            } else {
                console.error(`Некорректные данные для даты ${key}:`, value);
            }
        }
    );

    console.log(dataForChart);

    /*Возвращаем объект для данных, на основе которых будет отрисовка графиков.*/
    return dataForChart;
};

/*Делаем компонент "VacancyCountChart" на основе компонентов "LineChart", "Card" и "Divider". Используем классы из
Tailwind CSS.*/
function VacancyCountChart() {
    /*Формируем локальные стейты.*/
    const [frontendFrameworksData, setFrontendFrameworksData] = useState<DataForChart | null>(null);
    const [webAreasData, setWebAreasData] = useState<DataForChart | null>(null);
    const [programmingLanguagesData, setProgrammingLanguagesData] = useState<DataForChart | null>(null);

    /*Делаем запросы и заполняем локальные стейты.*/
    useEffect(() => {
        fetch('http://localhost:3000/frontend-frameworks-data')
            .then(res => res.json())
            .then(data => { setFrontendFrameworksData(mapServerDataForChart(data)) })
    }, []);

    useEffect(() => {
        fetch('http://localhost:3000/web-areas-data')
            .then(res => res.json())
            .then(data => { setWebAreasData(mapServerDataForChart(data)) })
    }, []);

    useEffect(() => {
        fetch('http://localhost:3000/programming-languages-data')
            .then(res => res.json())
            .then(data => { setProgrammingLanguagesData(mapServerDataForChart(data)) })
    }, []);

    if (!frontendFrameworksData) return null;
    if (!webAreasData) return null;
    if (!programmingLanguagesData) return null;

    /*Возвращаем JSX, на основе данных из локальных стейтов.*/
    return (
        <>
            <Card
                className="h-[100px] w-1/2 mt-[70px] mb-[30px] mx-auto border border-gray-300 shadow-lg rounded-lg pb-[100px]">
                <Divider className="text-2xl font-bold text-indigo-600">Frontend Frameworks
                    HH.RU {frontendFrameworksData.experience}</Divider>
            </Card>

            <LineChart
                className="h-[700px] w-1/2 mx-auto border border-gray-300 shadow-lg rounded-lg"
                data={frontendFrameworksData.items}
                index="date"
                categories={[...frontendFrameworksData.categories]}

                colors={['indigo', 'rose', 'green-700', 'fuchsia-700', 'orange']}
                intervalType="preserveStartEnd"
                showAnimation={true}
                animationDuration={2000}
                xAxisLabel={'Date'}
                yAxisLabel={'Vacancy Count'}
            />

            <Card
                className="h-[100px] w-1/2 mt-[70px] mb-[30px] mx-auto border border-gray-300 shadow-lg rounded-lg pb-[100px]">
                <Divider className="text-2xl font-bold text-indigo-600">Web Areas
                    HH.RU {webAreasData.experience}</Divider>
            </Card>

            <LineChart
                className="h-[700px] w-1/2 mx-auto border border-gray-300 shadow-lg rounded-lg"
                data={webAreasData.items}
                index="date"
                categories={[...webAreasData.categories]}

                colors={['indigo', 'rose', 'green-700', 'fuchsia-700', 'orange']}
                intervalType="preserveStartEnd"
                showAnimation={true}
                animationDuration={2000}
                xAxisLabel={'Date'}
                yAxisLabel={'Vacancy Count'}
            />

            <Card
                className="h-[100px] w-1/2 mt-[70px] mb-[30px] mx-auto border border-gray-300 shadow-lg rounded-lg pb-[100px]">
                <Divider className="text-2xl font-bold text-indigo-600">Programming Languages
                    HH.RU {programmingLanguagesData.experience}</Divider>
            </Card>

            <LineChart
                className="h-[700px] w-1/2 mx-auto border border-gray-300 shadow-lg rounded-lg mb-[70px]"
                data={programmingLanguagesData.items}
                index="date"
                categories={[...programmingLanguagesData.categories]}

                colors={['indigo', 'rose', 'green-700', 'fuchsia-700', 'orange', 'yellow']}
                intervalType="preserveStartEnd"
                showAnimation={true}
                animationDuration={2000}
                xAxisLabel={'Date'}
                yAxisLabel={'Vacancy Count'}
            />
        </>
    );
};

export default App;