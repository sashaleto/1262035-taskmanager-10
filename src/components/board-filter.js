import AbstractComponent from './abstract-component';

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

export default class BoardFilterComponent extends AbstractComponent {
  getTemplate() {
    return createBoardFiltersTemplate();
  }
}
