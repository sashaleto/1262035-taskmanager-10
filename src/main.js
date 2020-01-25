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
import {FILTER_TITLES} from './constants.js';
import {RenderPosition, render, replace, remove} from './utils/render';

const TASK_COUNT = 10;
const INITIALLY_SHOWN_TASKS_COUNT = 8;
const NEXT_SHOWN_TASKS_COUNT = 8;

const renderTask = (task, tasksList) => {
  const taskComponent = new TaskComponent(task);
  const taskFormComponent = new TaskEditFormComponent(task);

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replace(taskComponent, taskFormComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.setEditButtonClickHandler(() => {
    replace(taskFormComponent, taskComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskFormComponent.setFormSubmitHandler(() => {
    replace(taskComponent, taskFormComponent);
  });

  render(tasksList, taskComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (boardComponent, tasks) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchive);
  const boardElement = boardComponent.getElement();

  if (isAllTasksArchived || !tasks.length) {
    render(boardElement, new NoTasks(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardElement, new BoardFilterComponent(), RenderPosition.BEFOREEND);

  const tasksList = new TaskListComponent();
  render(boardElement, tasksList, RenderPosition.BEFOREEND);

  let lastShownCardNumber = INITIALLY_SHOWN_TASKS_COUNT;
  tasks.slice(0, lastShownCardNumber).forEach((task) => renderTask(task, tasksList.getElement()));

  const loadMoreComponent = new LoadMoreComponent();
  const loadMoreButton = loadMoreComponent.getElement();

  render(boardElement, loadMoreComponent, RenderPosition.BEFOREEND);

  loadMoreButton.addEventListener(`click`, () => {
    const increasedCardNumber = lastShownCardNumber + NEXT_SHOWN_TASKS_COUNT;

    tasks.slice(lastShownCardNumber, increasedCardNumber)
      .forEach((task) => renderTask(task, tasksList.getElement()));
    lastShownCardNumber = increasedCardNumber;

    if (increasedCardNumber >= tasks.length) {
      remove(loadMoreComponent);
    }
  });
};

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(FILTER_TITLES);

const mainElement = document.querySelector(`.main`);
const menuContainer = mainElement.querySelector(`.main__control`);

render(menuContainer, new MainMenuComponent(), RenderPosition.BEFOREEND);
render(mainElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(mainElement, boardComponent, RenderPosition.BEFOREEND);

renderBoard(boardComponent, tasks);
