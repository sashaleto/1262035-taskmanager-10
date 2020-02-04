import API from './api.js';
import MainMenuComponent from './components/main-menu.js';
import BoardComponent from './components/board.js';
import TasksModel from './models/tasks.js';
import BoardController from "./controllers/board";
import {RenderPosition, render} from './utils/render';
import FilterController from "./controllers/filter";

const AUTHORIZATION = `Basic kTy9gIdsz2317rD`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/task-manager`;

const api = new API(END_POINT, AUTHORIZATION);

const tasksModel = new TasksModel();

const mainElement = document.querySelector(`.main`);
const menuContainer = mainElement.querySelector(`.main__control`);
const mainMenuComponent = new MainMenuComponent();
render(menuContainer, mainMenuComponent, RenderPosition.BEFOREEND);

const filterController = new FilterController(mainElement, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
render(mainElement, boardComponent, RenderPosition.BEFOREEND);

const board = new BoardController(boardComponent, tasksModel);

api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    board.render();
  });

mainMenuComponent.getElement().querySelector(`.control__label--new-task`)
  .addEventListener(`click`, () => {
    board.createTask();
  });
