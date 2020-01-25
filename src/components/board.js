import AbstractComponent from './abstract-component';

// Доска задач
const createBoardTemplate = () => {
  return `
    <section class="board container"></section>
  `;
};

export default class BoardComponent extends AbstractComponent {
  getTemplate() {
    return createBoardTemplate();
  }
}
