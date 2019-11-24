import {createMenuTemplate} from './components/main-menu.js';
import {createFiltersTemplate} from './components/main-filter.js';
import {createTaskListTemplate} from './components/board.js';
import {createSingleTaskTemplate} from './components/task-card.js';
import {createTaskEditFormTemplate} from './components/task-card--edit.js';
import {createLoadMoreBtnTemplate} from './components/load-more-button.js';

const TASK_COLORS = [`black`, `blue`, `yellow`]; // цвета карточек

const mainElement = document.querySelector(`.main`);
const menuContainer = mainElement.querySelector(`.main__control`);
let boardElement;

// Функция для рендеринга компонентов
const renderComponent = (container, markup, position) => {
  container.insertAdjacentHTML(position, markup);
};

renderComponent(menuContainer, createMenuTemplate(), `beforeend`);
renderComponent(mainElement, createFiltersTemplate(), `beforeend`);
renderComponent(mainElement, createTaskListTemplate(), `beforeend`);

boardElement = mainElement.querySelector(`.board__tasks`);

renderComponent(boardElement, createTaskEditFormTemplate(), `beforeend`);

TASK_COLORS.forEach((color) => renderComponent(boardElement, createSingleTaskTemplate(color), `beforeend`));

renderComponent(boardElement, createLoadMoreBtnTemplate(), `afterend`);
