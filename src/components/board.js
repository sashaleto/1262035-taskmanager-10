import {createElementDiv} from '../utils';

// Доска задач
const createBoardTemplate = () => {
  return `
    <section class="board container"></section>
  `;
};

export default class BoardComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createBoardTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElementDiv(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
