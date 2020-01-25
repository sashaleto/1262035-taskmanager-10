import TaskComponent from "../components/task-card";
import TaskEditFormComponent from "../components/task-card--edit";
import {remove, render, RenderPosition, replace} from "../utils/render";
import NoTasksComponent from "../components/no-tasks";
import BoardFilterComponent from "../components/board-filter";
import TaskListComponent from "../components/task-list";
import LoadMoreComponent from "../components/load-more-button";

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

export default class BoardController {
  constructor(boardComponent) {
    this._boardComponent = boardComponent;
    this._noTasksComponent = new NoTasksComponent();
    this._loadMoreComponent = new LoadMoreComponent();
    this._boardFilterComponent = new BoardFilterComponent();
    this._taskListComponent = new TaskListComponent();
  }

  render(tasks) {
    const isAllTasksArchived = tasks.every((task) => task.isArchive);
    const container = this._boardComponent.getElement();

    if (isAllTasksArchived || !tasks.length) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._boardFilterComponent, RenderPosition.BEFOREEND);

    const tasksList = this._taskListComponent;
    render(container, tasksList, RenderPosition.BEFOREEND);

    let lastShownCardNumber = INITIALLY_SHOWN_TASKS_COUNT;
    tasks.slice(0, lastShownCardNumber).forEach((task) => renderTask(task, tasksList.getElement()));

    const loadMoreComponent = this._loadMoreComponent;

    render(container, loadMoreComponent, RenderPosition.BEFOREEND);

    loadMoreComponent.setClickHandler(() => {
      const increasedCardNumber = lastShownCardNumber + NEXT_SHOWN_TASKS_COUNT;

      tasks.slice(lastShownCardNumber, increasedCardNumber)
        .forEach((task) => renderTask(task, tasksList.getElement()));
      lastShownCardNumber = increasedCardNumber;

      if (increasedCardNumber >= tasks.length) {
        remove(loadMoreComponent);
      }
    });
  }
}
