import MainMenuComponent from './components/main-menu.js';
import FilterComponent from './components/main-filter.js';
import BoardComponent from './components/board.js';
import TasksModel from './models/tasks.js';
import BoardController from "./controllers/board";
import {generateTasks} from './mocks/task.js';
import {generateFilters} from './mocks/filters.js';
import {FILTER_TITLES} from './constants.js';
import {RenderPosition, render} from './utils/render';

const TASK_COUNT = 10;

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filters = generateFilters(FILTER_TITLES);

const mainElement = document.querySelector(`.main`);
const menuContainer = mainElement.querySelector(`.main__control`);

render(menuContainer, new MainMenuComponent(), RenderPosition.BEFOREEND);
render(mainElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(mainElement, boardComponent, RenderPosition.BEFOREEND);

const board = new BoardController(boardComponent, tasksModel);
board.render();
