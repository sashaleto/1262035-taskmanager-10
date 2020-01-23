import MainMenuComponent from './components/main-menu.js';
import FilterComponent from './components/main-filter.js';
import BoardComponent from './components/board.js';
import NoTasks from './components/no-tasks.js';
import TaskListComponent from './components/task-list.js';
import TaskComponent from './components/task-card.js';
import TaskEditFormComponent from './components/task-card--edit.js';
import LoadMoreComponent from './components/load-more-button.js';
import BoardFilterComponent from './components/board-filter';
import {generateTasks} from './mocks/task.js';
import {generateFilters} from './mocks/filters.js';
import {FILTER_TITLES, RenderPosition} from './constants.js';
import {render} from './utils';

const TASK_COUNT = 0;
const INITIALLY_SHOWN_TASKS_COUNT = 8;
const NEXT_SHOWN_TASKS_COUNT = 8;

const renderTask = (task, tasksList) => {
  const taskComponent = new TaskComponent(task);
  const taskFormComponent = new TaskEditFormComponent(task);

  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  const editForm = taskFormComponent.getElement().querySelector(`form`);

  const replaceTaskToForm = () => {
    tasksList.replaceChild(taskFormComponent.getElement(), taskComponent.getElement());
  };

  const replaceFormToTask = () => {
    tasksList.replaceChild(taskComponent.getElement(), taskFormComponent.getElement());
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

  render(tasksList, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardComponent, tasks) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchive);
  const boardElement = boardComponent.getElement();

  if (isAllTasksArchived || !tasks.length) {
    render(boardElement, new NoTasks().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardElement, new BoardFilterComponent().getElement(), RenderPosition.BEFOREEND);

  const tasksList = new TaskListComponent();
  render(boardElement, tasksList.getElement(), RenderPosition.BEFOREEND);

  let lastShownCardNumber = INITIALLY_SHOWN_TASKS_COUNT;
  tasks.slice(0, lastShownCardNumber).forEach((task) => renderTask(task, tasksList.getElement()));

  const loadMoreComponent = new LoadMoreComponent();
  const loadMoreButton = loadMoreComponent.getElement();

  render(boardElement, loadMoreButton, RenderPosition.BEFOREEND);

  loadMoreButton.addEventListener(`click`, () => {
    const increasedCardNumber = lastShownCardNumber + NEXT_SHOWN_TASKS_COUNT;

    tasks.slice(lastShownCardNumber, increasedCardNumber)
      .forEach((task) => renderTask(task, tasksList.getElement()));
    lastShownCardNumber = increasedCardNumber;

    if (increasedCardNumber >= tasks.length) {
      loadMoreComponent.removeElement();
      loadMoreButton.remove();
    }
  });
};

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(FILTER_TITLES);

const mainElement = document.querySelector(`.main`);
const menuContainer = mainElement.querySelector(`.main__control`);

render(menuContainer, new MainMenuComponent().getElement(), RenderPosition.BEFOREEND);
render(mainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(mainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);

renderBoard(boardComponent, tasks);
