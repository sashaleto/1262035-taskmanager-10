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

    this._shownTasksCount = INITIALLY_SHOWN_TASKS_COUNT;

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

  _renderLoadMoreButton() {
    if (this._shownTasksCount >= this._tasks.length) {
      return;
    }
    const loadMoreComponent = this._loadMoreComponent;
    const container = this._boardComponent.getElement();
    let lastShownCardNumber = this._shownTasksCount;

    render(container, loadMoreComponent, RenderPosition.BEFOREEND);

    loadMoreComponent.setClickHandler(() => {
      this._shownTasksCount = lastShownCardNumber + NEXT_SHOWN_TASKS_COUNT;

      this._renderTasks(this._taskListComponent, this._tasks.slice(lastShownCardNumber, this._shownTasksCount));
      lastShownCardNumber = this._shownTasksCount;

      if (this._shownTasksCount >= this._tasks.length) {
        remove(loadMoreComponent);
      }
    });
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

    this._renderTasks(tasksList, tasks.slice(0, this._shownTasksCount));

    this._renderLoadMoreButton();

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
        this._renderLoadMoreButton();
      } else {
        remove(this._loadMoreComponent);
      }
    });
  }
}
