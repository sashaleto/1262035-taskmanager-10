import {remove, render, RenderPosition} from "../utils/render";
import NoTasksComponent from "../components/no-tasks";
import BoardFilterComponent, {SortType} from "../components/board-filter";
import TaskListComponent from "../components/task-list";
import LoadMoreComponent from "../components/load-more-button";
import TaskController from "./task";

const INITIALLY_SHOWN_TASKS_COUNT = 8;
const NEXT_SHOWN_TASKS_COUNT = 8;

export default class BoardController {
  constructor(boardComponent) {
    this._tasks = [];
    this._boardComponent = boardComponent;
    this._noTasksComponent = new NoTasksComponent();
    this._loadMoreComponent = new LoadMoreComponent();
    this._boardFilterComponent = new BoardFilterComponent();
    this._taskListComponent = new TaskListComponent();

    this._onDataChange = this._onDataChange.bind(this);
  }

  _onDataChange(taskController, oldTask, newTask) {
    const index = this._tasks.findIndex((task) => task === oldTask);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newTask, this._tasks.slice(index + 1));

    taskController.render(newTask);
  }

  _renderTasks(taskListComponent, tasks) {
    tasks.forEach((task) => new TaskController(taskListComponent.getElement(), this._onDataChange).render(task));
  }

  render(tasks) {
    this._tasks = tasks;
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
    this._renderTasks(tasksList, tasks.slice(0, lastShownCardNumber));

    const renderLoadMoreButton = () => {
      if (INITIALLY_SHOWN_TASKS_COUNT >= tasks.length) {
        return;
      }
      const loadMoreComponent = this._loadMoreComponent;

      render(container, loadMoreComponent, RenderPosition.BEFOREEND);

      loadMoreComponent.setClickHandler(() => {
        const increasedCardNumber = lastShownCardNumber + NEXT_SHOWN_TASKS_COUNT;

        this._renderTasks(tasksList, tasks.slice(lastShownCardNumber, increasedCardNumber));
        lastShownCardNumber = increasedCardNumber;

        if (increasedCardNumber >= tasks.length) {
          remove(loadMoreComponent);
        }
      });
    };

    renderLoadMoreButton();

    this._boardFilterComponent.setSortTypeChangeHandler((sortType) => {
      let sortedTasks = [];

      switch (sortType) {
        case SortType.DATE_UP:
          sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
          break;
        case SortType.DATE_DOWN:
          sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
          break;
        case SortType.DEFAULT:
          sortedTasks = tasks.slice(0, INITIALLY_SHOWN_TASKS_COUNT);
          break;
      }

      tasksList.getElement().innerHTML = ``;
      this._renderTasks(tasksList, sortedTasks);

      if (sortType === SortType.DEFAULT) {
        renderLoadMoreButton();
      } else {
        remove(this._loadMoreComponent);
      }
    });
  }
}
