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

Запуск визуализации собранных данных: npm run dev

Как включить светлую тему: установить " darkMode: 'class' " в "tailwind.config.js".
*/

import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
    </StrictMode>
);