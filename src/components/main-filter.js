import AbstractComponent from './abstract-component';

const createSingleFilterTemplate = (filter) => {
  const {title, count, checked} = filter;

  return `
    <input
        type="radio"
        id="filter__${title}"
        class="filter__input visually-hidden"
        name="filter"
        ${!count ? `disabled` : ``}
        ${checked ? `checked` : ``}
    />
    <label for="filter__${title}" class="filter__label">
      ${title} <span class="filter__${title}-count">${count}</span>
    </label>
  `;
};

const createFiltersTemplate = (filters) => {
  const filtersTemplate = filters.map((filter) => {
    return createSingleFilterTemplate(filter);
  }).join(``);

  return `
    <section class="main__filter filter container">
      ${filtersTemplate}
    </section>
  `;
};

export default class FilterComponent extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }
}
