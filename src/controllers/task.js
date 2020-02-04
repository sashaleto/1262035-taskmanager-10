import TaskComponent from "../components/task-card";
import TaskModel from "../models/task";
import TaskEditFormComponent from "../components/task-card--edit";
import {render, RenderPosition, replace, remove} from "../utils/render";
import {COLOR, DAYS} from "../constants";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    'mo': false,
    'tu': false,
    'we': false,
    'th': false,
    'fr': false,
    'sa': false,
    'su': false,
  },
  tags: [],
  color: COLOR.BLACK,
  isFavorite: false,
  isArchive: false,
};

const parseFormData = (formData) => {
  const date = formData.get(`date`);
  const repeatingDays = DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});

  return new TaskModel({
    'description': formData.get(`text`),
    'due_date': date ? new Date(date) : null,
    'tags': formData.getAll(`hashtag`),
    'repeating_days': formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
    'color': formData.get(`color`),
    'is_favorite': false,
    'is_done': false,
  });
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

  render(task, mode) {
    const taskOldComponent = this._taskComponent;
    const taskFormOldComponent = this._taskEditFormComponent;
    this._mode = mode;

    this._taskComponent = new TaskComponent(task);
    this._taskEditFormComponent = new TaskEditFormComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskComponent.setArchiveButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isArchive = !task.isArchive;
      this._onDataChange(this, task, newTask);
    });

    this._taskComponent.setFavoritesButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isFavorite = !task.isFavorite;
      this._onDataChange(this, task, newTask);
    });

    this._taskEditFormComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._taskEditFormComponent.getData();
      const data = parseFormData(formData);
      this._onDataChange(this, task, data);
    });

    this._taskEditFormComponent.setDeleteTaskHandler(() => {
      this._onDataChange(this, task, null);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (taskFormOldComponent && taskOldComponent) {
          replace(this._taskComponent, taskOldComponent);
          replace(this._taskEditFormComponent, taskFormOldComponent);
          this._replaceEditToTask();
        } else {
          render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (taskFormOldComponent && taskOldComponent) {
          remove(taskOldComponent);
          remove(taskFormOldComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._taskEditFormComponent, RenderPosition.AFTERBEGIN);
        break;
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

    if (document.contains(this._taskEditFormComponent.getElement())) {
      replace(this._taskComponent, this._taskEditFormComponent);
    }

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

  destroy() {
    remove(this._taskEditFormComponent);
    remove(this._taskComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}
