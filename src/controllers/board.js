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
    this._activeTaskControllers = [];

    this._boardComponent = boardComponent;
    this._noTasksComponent = new NoTasksComponent();
    this._loadMoreComponent = new LoadMoreComponent();
    this._boardFilterComponent = new BoardFilterComponent();

    this._taskListComponent = new TaskListComponent();

    this._shownTasksCount = INITIALLY_SHOWN_TASKS_COUNT;
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._boardFilterComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _onDataChange(taskController, oldTask, newTask) {
    const index = this._tasks.findIndex((task) => task === oldTask);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newTask, this._tasks.slice(index + 1));

    taskController.render(newTask);
  }

  _onViewChange() {
    this._activeTaskControllers.forEach((controller) => controller.setDefaultView());
  }

  _renderTasks(taskListComponent, tasks) {
    // для управления всеми созданными контроллерами задач
    return tasks.map((task) => {
      const controller = new TaskController(taskListComponent.getElement(), this._onDataChange, this._onViewChange);
      controller.render(task);
      return controller;
    });
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

      const newTasks = this._renderTasks(this._taskListComponent, this._tasks.slice(lastShownCardNumber, this._shownTasksCount));
      this._activeTaskControllers = this._activeTaskControllers.concat(newTasks);
      lastShownCardNumber = this._shownTasksCount;

      if (this._shownTasksCount >= this._tasks.length) {
        remove(loadMoreComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    let sortedTasks = [];

    switch (sortType) {
      case SortType.DATE_UP:
        sortedTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        break;
      case SortType.DATE_DOWN:
        sortedTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        break;
      case SortType.DEFAULT:
        sortedTasks = this._tasks.slice(0, INITIALLY_SHOWN_TASKS_COUNT);
        break;
    }

    this._taskListComponent.getElement().innerHTML = ``;
    const newTasks = this._renderTasks(this._taskListComponent, sortedTasks);
    this._activeTaskControllers = this._activeTaskControllers.concat(newTasks);

    if (sortType === SortType.DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._loadMoreComponent);
    }
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

    const newTasks = this._renderTasks(tasksList, tasks.slice(0, this._shownTasksCount));
    this._activeTaskControllers = this._activeTaskControllers.concat(newTasks);

    this._renderLoadMoreButton();
  }
}
