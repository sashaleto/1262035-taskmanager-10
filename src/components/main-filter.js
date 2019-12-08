const createSingleFilterTemplate = (filter, isChecked) => {
  const {title, count} = filter;

  return `
    <input
        type="radio"
        id="filter__${title}"
        class="filter__input visually-hidden"
        name="filter"
        ${isChecked ? `checked` : ``}
        ${!count ? `disabled` : ``}
      />
      <label for="filter__${title}" class="filter__label">
        ${title} <span class="filter__${title}-count">${count}</span></label
      >
  `;
};

export const createFiltersTemplate = (filters) => {
  const filtersTemplate = filters.map((filter, index) => {
    return createSingleFilterTemplate(filter, index === 0);
  }).join(``);

  return `
    <section class="main__filter filter container">
      ${filtersTemplate}
    </section>
  `;
};
