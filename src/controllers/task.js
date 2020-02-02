import TaskComponent from "../components/task-card";
import TaskEditFormComponent from "../components/task-card--edit";
import {render, RenderPosition, replace} from "../utils/render";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container; // taskList

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._taskComponent = null;
    this._taskEditFormComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task) {
    const taskOldComponent = this._taskComponent;
    const taskFormOldComponent = this._taskEditFormComponent;

    this._taskComponent = new TaskComponent(task);
    this._taskEditFormComponent = new TaskEditFormComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._onDataChange();
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskComponent.setArchiveButtonClickHandler(() => {
      let newTask = Object.assign({}, task);
      newTask.isArchive = !task.isArchive;
      this._onDataChange(this, task, newTask);
    });

    this._taskComponent.setFavoritesButtonClickHandler(() => {
      let newTask = Object.assign({}, task);
      newTask.isFavorite = !task.isFavorite;
      this._onDataChange(this, task, newTask);
    });

    this._taskEditFormComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
    });

    if (taskFormOldComponent && taskOldComponent) {
      replace(this._taskComponent, taskOldComponent);
      replace(this._taskEditFormComponent, taskFormOldComponent);
    } else {
      render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskEditFormComponent.reset();

    replace(this._taskComponent, this._taskEditFormComponent);

    this._mode = Mode.DEFAULT;
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    replace(this._taskEditFormComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
