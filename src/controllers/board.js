import {remove, render, RenderPosition} from "../utils/render";
import NoTasksComponent from "../components/no-tasks";
import BoardFilterComponent, {SortType} from "../components/board-filter";
import TaskListComponent from "../components/task-list";
import LoadMoreComponent from "../components/load-more-button";
import TaskController, {EmptyTask, Mode as TaskControllerMode} from "./task";

const INITIALLY_SHOWN_TASKS_COUNT = 8;
const NEXT_SHOWN_TASKS_COUNT = 8;

const utilRenderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task, TaskControllerMode.DEFAULT);

    return taskController;
  });
};

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
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);

    this._boardFilterComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._tasksModel.setFilterChangeHandler(this._onFilterChange);

    this._creatingTask = null;
  }

  _onDataChange(taskController, oldTask, newTask) {
    if (oldTask === EmptyTask) {
      this._creatingTask = null;
      if (newTask === null) { // удаление свежесозданной карточки, когда пользователь еще не сохранил ее
        taskController.destroy();
        this._updateTasks(this._shownTasksCount);
      } else { // сохранение карточки из "созданного" состояния с измененными данными
        this._tasksModel.addTask(newTask);
        taskController.render(newTask, TaskControllerMode.DEFAULT);

        // удаление последнего элемента в случае превышения количества отображаемых
        if (this._activeTaskControllers.length && !(this._activeTaskControllers.length % NEXT_SHOWN_TASKS_COUNT)) {
          const destroyedTask = this._activeTaskControllers.pop();
          destroyedTask.destroy();
        }

        this._activeTaskControllers = [].concat(taskController, this._activeTaskControllers);
        this._shownTasksCount = this._activeTaskControllers.length;
      }
    } else if (newTask === null) { // удаление существующей карточки
      this._tasksModel.removeTask(oldTask.id);
      this._updateTasks(this._shownTasksCount);
    } else { // сохранение отредактированных данных в существующей карточке
      const isSuccess = this._tasksModel.updateTask(oldTask.id, newTask);

      if (isSuccess) {
        taskController.render(newTask, TaskControllerMode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._activeTaskControllers.forEach((controller) => controller.setDefaultView());
  }

  _renderTasks(tasks) {
    const taskListElement = this._taskListComponent.getElement();

    const newControllers = utilRenderTasks(taskListElement, tasks, this._onDataChange, this._onViewChange);
    this._activeTaskControllers = this._activeTaskControllers.concat(newControllers);
    this._shownTasksCount = this._activeTaskControllers.length;
  }

  _renderLoadMoreButton() {
    remove(this._loadMoreComponent);

    if (this._shownTasksCount >= this._tasksModel.getTasks().length) {
      return;
    }

    const container = this._boardComponent.getElement();
    render(container, this._loadMoreComponent, RenderPosition.BEFOREEND);
    this._loadMoreComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  _onLoadMoreButtonClick() {
    const prevTasksCount = this._shownTasksCount;
    const tasks = this._tasksModel.getTasks();

    this._shownTasksCount = this._shownTasksCount + NEXT_SHOWN_TASKS_COUNT;

    this._renderTasks(tasks.slice(prevTasksCount, this._shownTasksCount));

    if (this._shownTasksCount >= tasks.length) {
      remove(this._loadMoreComponent);
    }
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

    this._removeTasks();
    this._renderTasks(sortedTasks);

    if (sortType === SortType.DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._loadMoreComponent);
    }
  }

  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadMoreButton();
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const taskListElement = this._taskListComponent.getElement();
    this._creatingTask = new TaskController(taskListElement, this._onDataChange, this._onViewChange);
    this._creatingTask.render(EmptyTask, TaskControllerMode.ADDING);
  }

  _removeTasks() {
    this._activeTaskControllers.forEach((taskController) => taskController.destroy());
    this._activeTaskControllers = [];
  }

  _onFilterChange() {
    this._updateTasks(INITIALLY_SHOWN_TASKS_COUNT);
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
    render(container, this._taskListComponent, RenderPosition.BEFOREEND);

    this._renderTasks(tasks.slice(0, INITIALLY_SHOWN_TASKS_COUNT));

    this._renderLoadMoreButton();
  }
}
