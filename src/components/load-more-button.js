// Кнопка «Load more»
import {createElementDiv} from "../utils";

const createLoadMoreBtnTemplate = () => {
  return `<button class="load-more" type="button">load more</button>`;
};

export default class LoadMoreComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createLoadMoreBtnTemplate();
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
