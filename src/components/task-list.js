import AbstractComponent from './abstract-component';

// Спиок задач
const createTaskListTemplate = () => {
  return `<div class="board__tasks"></div>`;
};

export default class TaskListComponent extends AbstractComponent {
  getTemplate() {
    return createTaskListTemplate();
  }
}
