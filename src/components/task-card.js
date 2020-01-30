import AbstractComponent from './abstract-component';
import {formatTime, checkIsTaskRepeated} from '../utils.js';
import {MONTH_NAMES} from '../constants.js';

const createHashTagsTemplate = (tags) => {
  return tags.map((tag) => {
    return `
      <span class="card__hashtag-inner">
        <span class="card__hashtag-name">
          #${tag}
        </span>
      </span>
    `;
  }).join(``);
};

const createButtonMarkup = (name, isActive) => {
  return (
    `<button
      type="button"
      class="card__btn card__btn--${name} ${isActive ? `` : `card__btn--disabled`}"
    >
      ${name}
    </button>`
  );
};

const createSingleTaskTemplate = (task) => {
  const {description, dueDate, repeatingDays, tags, color} = task;

  const date = dueDate ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = dueDate ? formatTime(dueDate) : ``;

  const isExpired = dueDate ? (dueDate < Date.now()) : false;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const repeatClass = checkIsTaskRepeated(repeatingDays) ? `card--repeat` : ``;

  const hashtags = createHashTagsTemplate(Array.from(tags));

  const editButton = createButtonMarkup(`edit`, true);
  const archiveButton = createButtonMarkup(`archive`, task.isArchive);
  const favoritesButton = createButtonMarkup(`favorites`, task.isFavorite);

  return `
    <article class="card card--${color} ${repeatClass} ${deadlineClass}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            ${editButton}
            ${archiveButton}
            ${favoritesButton}
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                    <span class="card__time">${time}</span>
                  </p>
                </div>
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${hashtags}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
};

export default class TaskComponent extends AbstractComponent {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createSingleTaskTemplate(this._task);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, handler);
  }

  setArchiveButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--archive`).addEventListener(`click`, handler);
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--favorites`).addEventListener(`click`, handler);
  }
}
