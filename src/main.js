import MainMenuComponent from './components/main-menu.js';
import FilterComponent from './components/main-filter.js';
import BoardComponent from './components/board.js';
import TaskListComponent from './components/task-list.js';
import TaskComponent from './components/task-card.js';
import TaskEditFormComponent from './components/task-card--edit.js';
import LoadMoreComponent from './components/load-more-button.js';
import {generateTasks} from './mocks/task.js';
import {generateFilters} from './mocks/filters.js';
import {FILTER_TITLES, RenderPosition} from './constants.js';
import {render} from './utils';
import BoardFilterComponent from "./components/board-filter";

const TASK_COUNT = 20;
const INITIALLY_SHOWN_TASKS_COUNT = 8;
const NEXT_SHOWN_TASKS_COUNT = 8;

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(FILTER_TITLES);

const mainElement = document.querySelector(`.main`);
const menuContainer = mainElement.querySelector(`.main__control`);

render(menuContainer, new MainMenuComponent().getElement(), RenderPosition.BEFOREEND);
render(mainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
const boardElement = boardComponent.getElement();
render(mainElement, boardElement, RenderPosition.BEFOREEND);

const boardFilterComponent = new BoardFilterComponent();
render(boardElement, boardFilterComponent.getElement(), RenderPosition.BEFOREEND);

const tasksListComponent = new TaskListComponent();
const tasksListElement = tasksListComponent.getElement();
render(boardElement, tasksListElement, RenderPosition.BEFOREEND);

const renderTask = (task) => {
  const taskComponent = new TaskComponent(task);
  const taskFormComponent = new TaskEditFormComponent(task);

  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  const editForm = taskFormComponent.getElement().querySelector(`form`);

  const replaceTaskToForm = () => {
    tasksListElement.replaceChild(taskFormComponent.getElement(), taskComponent.getElement());
  };

  const replaceFormToTask = () => {
    tasksListElement.replaceChild(taskComponent.getElement(), taskFormComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceFormToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  editButton.addEventListener(`click`, () => {
    replaceTaskToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  editForm.addEventListener(`submit`, replaceFormToTask);

  render(tasksListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

let lastShownCardNumber = INITIALLY_SHOWN_TASKS_COUNT;
tasks.slice(0, lastShownCardNumber).forEach((task) => renderTask(task));

const loadMoreComponent = new LoadMoreComponent();
const loadMoreButton = loadMoreComponent.getElement();

render(boardElement, loadMoreButton, RenderPosition.BEFOREEND);


loadMoreButton.addEventListener(`click`, () => {
  const increasedCardNumber = lastShownCardNumber + NEXT_SHOWN_TASKS_COUNT;

  tasks.slice(lastShownCardNumber, increasedCardNumber).forEach((task) => render(tasksListElement, new TaskComponent(task).getElement(), RenderPosition.BEFOREEND));
  lastShownCardNumber = increasedCardNumber;

  if (increasedCardNumber >= tasks.length) {
    loadMoreComponent.removeElement();
    loadMoreButton.remove();
  }
});
