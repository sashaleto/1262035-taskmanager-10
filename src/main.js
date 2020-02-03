import MainMenuComponent from './components/main-menu.js';
import BoardComponent from './components/board.js';
import TasksModel from './models/tasks.js';
import BoardController from "./controllers/board";
import {generateTasks} from './mocks/task.js';
import {RenderPosition, render} from './utils/render';
import FilterController from "./controllers/filter";

const TASK_COUNT = 28;

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const mainElement = document.querySelector(`.main`);
const menuContainer = mainElement.querySelector(`.main__control`);
const mainMenuComponent = new MainMenuComponent();
render(menuContainer, mainMenuComponent, RenderPosition.BEFOREEND);

const filterController = new FilterController(mainElement, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
render(mainElement, boardComponent, RenderPosition.BEFOREEND);

const board = new BoardController(boardComponent, tasksModel);
board.render();

mainMenuComponent.getElement().querySelector(`.control__label--new-task`)
  .addEventListener(`click`, () => {
    board.createTask();
  });
