import TaskComponent from "../components/task-card";
import TaskEditFormComponent from "../components/task-card--edit";
import {render, RenderPosition, replace} from "../utils/render";

export default class TaskController {
  constructor(container) {
    this._container = container; // taskList
  }

  render(task) {
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

    render(this._container, taskComponent, RenderPosition.BEFOREEND);
  }
}
