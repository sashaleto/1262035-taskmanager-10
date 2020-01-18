import {createElementDiv} from '../utils';

// Список задач
const createBoardFiltersTemplate = () => {
  return `
      <div class="board__filter-list">
            <a href="#" class="board__filter">SORT BY DEFAULT</a>
            <a href="#" class="board__filter">SORT BY DATE up</a>
            <a href="#" class="board__filter">SORT BY DATE down</a>
      </div>
  `;
};

export default class BoardFilterComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createBoardFiltersTemplate();
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
