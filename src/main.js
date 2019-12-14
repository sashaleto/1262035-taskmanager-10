import {createMenuTemplate} from './components/main-menu.js';
import {createFiltersTemplate} from './components/main-filter.js';
import {createTaskListTemplate} from './components/board.js';
import {createSingleTaskTemplate} from './components/task-card.js';
import {createTaskEditFormTemplate} from './components/task-card--edit.js';
import {createLoadMoreBtnTemplate} from './components/load-more-button.js';
import {generateTasks} from './mocks/task.js';
import {generateFilters} from './mocks/filters.js';
import {FILTER_TITLES} from './constants.js';

const TASK_COUNT = 20;
const INITIALLY_SHOWN_TASKS_COUNT = 8;
const NEXT_SHOWN_TASKS_COUNT = 8;

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(FILTER_TITLES);

const mainElement = document.querySelector(`.main`);
const menuContainer = mainElement.querySelector(`.main__control`);
let boardElement;

// Функция для рендеринга компонентов
const renderComponent = (container, markup, position) => {
  container.insertAdjacentHTML(position, markup);
};

renderComponent(menuContainer, createMenuTemplate(), `beforeend`);
renderComponent(mainElement, createFiltersTemplate(filters), `beforeend`);
renderComponent(mainElement, createTaskListTemplate(), `beforeend`);

boardElement = mainElement.querySelector(`.board__tasks`);

renderComponent(boardElement, createTaskEditFormTemplate(tasks[0]), `beforeend`);

let lastShownCardNumber = INITIALLY_SHOWN_TASKS_COUNT;
tasks.slice(1, lastShownCardNumber).forEach((task) => renderComponent(boardElement, createSingleTaskTemplate(task), `beforeend`));

renderComponent(boardElement, createLoadMoreBtnTemplate(), `afterend`);

const loadMoreButton = mainElement.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, () => {
  const increasedCardNumber = lastShownCardNumber + NEXT_SHOWN_TASKS_COUNT;

  tasks.slice(lastShownCardNumber, increasedCardNumber).forEach((task) => renderComponent(boardElement, createSingleTaskTemplate(task), `beforeend`));
  lastShownCardNumber = increasedCardNumber;

  if (increasedCardNumber >= tasks.length) {
    loadMoreButton.remove();
  }
});
