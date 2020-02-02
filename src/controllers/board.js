import {remove, render, RenderPosition} from "../utils/render";
import NoTasksComponent from "../components/no-tasks";
import BoardFilterComponent, {SortType} from "../components/board-filter";
import TaskListComponent from "../components/task-list";
import LoadMoreComponent from "../components/load-more-button";
import TaskController from "./task";

const INITIALLY_SHOWN_TASKS_COUNT = 8;
const NEXT_SHOWN_TASKS_COUNT = 8;

export default class BoardController {
  constructor(boardComponent, tasksModel) {
    this._activeTaskControllers = [];

    this._tasksModel = tasksModel;

    this._boardComponent = boardComponent;
    this._noTasksComponent = new NoTasksComponent();
    this._loadMoreComponent = new LoadMoreComponent();
    this._boardFilterComponent = new BoardFilterComponent();

    this._taskListComponent = new TaskListComponent();

    this._shownTasksCount = INITIALLY_SHOWN_TASKS_COUNT;
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._boardFilterComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
  }

  _onDataChange(taskController, oldTask, newTask) {
    const isSuccess = this._tasksModel.updateTask(oldTask.id, newTask);

    if (isSuccess) {
      taskController.render(newTask);
    }
  }

  _onViewChange() {
    this._activeTaskControllers.forEach((controller) => controller.setDefaultView());
  }

  _renderTasks(taskListComponent, tasks) {
    // для управления всеми созданными контроллерами задач
    this._activeTaskControllers = this._activeTaskControllers.concat(tasks.map((task) => {
      const controller = new TaskController(taskListComponent.getElement(), this._onDataChange, this._onViewChange);
      controller.render(task);
      return controller;
    }));
    this._shownTasksCount = this._activeTaskControllers.length;
  }

  _renderLoadMoreButton() {
    const tasks = this._tasksModel.getTasks();

    if (this._shownTasksCount >= tasks.length) {
      remove(this._loadMoreComponent);
      return;
    }
    const loadMoreComponent = this._loadMoreComponent;
    const container = this._boardComponent.getElement();

    render(container, loadMoreComponent, RenderPosition.BEFOREEND);

    loadMoreComponent.setClickHandler(() => {
      this._renderTasks(this._taskListComponent, tasks.slice(this._shownTasksCount, this._shownTasksCount + NEXT_SHOWN_TASKS_COUNT));

      if (this._shownTasksCount >= tasks.length) {
        remove(loadMoreComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    let sortedTasks = [];
    const tasks = this._tasksModel.getTasks();

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

    this._taskListComponent.getElement().innerHTML = ``;
    this._renderTasks(this._taskListComponent, sortedTasks);

    if (sortType === SortType.DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._loadMoreComponent);
    }
  }

  _removeTasks() {
    this._activeTaskControllers.forEach((taskController) => taskController.destroy());
    this._activeTaskControllers = [];
  }

  _onFilterChange() {
    this._removeTasks();
    this._renderTasks(this._taskListComponent, this._tasksModel.getTasks().slice(0, INITIALLY_SHOWN_TASKS_COUNT));
    this._renderLoadMoreButton();
  }

  render() {
    const tasks = this._tasksModel.getTasks();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);
    const container = this._boardComponent.getElement();

    if (isAllTasksArchived || !tasks.length) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._boardFilterComponent, RenderPosition.BEFOREEND);

    const tasksList = this._taskListComponent;
    render(container, tasksList, RenderPosition.BEFOREEND);

    this._renderTasks(tasksList, tasks.slice(0, INITIALLY_SHOWN_TASKS_COUNT));

    this._renderLoadMoreButton();
  }
}
