import AbstractComponent from './abstract-component';

const createLoadMoreBtnTemplate = () => {
  return `<button class="load-more" type="button">load more</button>`;
};

export default class LoadMoreComponent extends AbstractComponent {
  getTemplate() {
    return createLoadMoreBtnTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
