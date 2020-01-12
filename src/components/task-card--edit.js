import {DAYS, COLORS, MONTH_NAMES} from '../constants.js';
import {formatTime} from '../utils.js';
import {createElementDiv} from "../utils";

const makeRepeatingDaysTemplate = (days, repeatingDays) => {
  const daysMarkup = days.map((title) => {
    const isChecked = repeatingDays[title];
    return `
      <input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${title}-4"
        name="repeat"
        value="${title}"
        ${isChecked ? `checked` : ``}
      />
      <label class="card__repeat-day" for="repeat-${title}-4"
        >${title}</label
      >
    `;
  }).join(``);

  return `
    <fieldset class="card__repeat-days">
      <div class="card__repeat-days-inner">
        ${daysMarkup}
      </div>
    </fieldset>
  `;
};

const makeColorsTemplate = (colorNames, taskColor) => {
  return colorNames.map((name) => {
    const isChecked = (name === taskColor);
    return `
      <input
        type="radio"
        id="color-${name}-4"
        class="card__color-input card__color-input--${name} visually-hidden"
        name="color"
        value="${name}"
        ${isChecked ? `checked` : ``}
      />
      <label
        for="color-black-4"
        class="card__color card__color--${name}"
        >${name}</label
      >
    `;
  }).join(``);
};

const makeHashtagsTemplate = (tags) => {
  return Array.from(tags).map((tag) => {
    return `
      <span class="card__hashtag-inner">
        <input
          type="hidden"
          name="hashtag"
          value="repeat"
          class="card__hashtag-hidden-input"
        />
        <p class="card__hashtag-name">
          #${tag}
        </p>
        <button type="button" class="card__hashtag-delete">
          delete
        </button>
      </span>
    `;
  }).join(``);
};

const makeDeadlineTemplate = (dueDate) => {
  const date = `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}`;
  const time = formatTime(dueDate);

  return `
     <fieldset class="card__date-deadline">
        <label class="card__input-deadline-wrap">
          <input
            class="card__date"
            type="text"
            placeholder=""
            name="date"
            value="${date} ${time}"
          />
        </label>
      </fieldset>
  `;
};

// Форма создания/редактирования задачи (используется одна форма)
const createTaskEditFormTemplate = (task) => {
  const {description, dueDate, repeatingDays, tags, color} = task;

  const colorsMarkup = makeColorsTemplate(COLORS, color);
  const hashtagsMarkup = makeHashtagsTemplate(tags);

  const hasDueDate = !!dueDate;
  const deadlineMarkup = hasDueDate ? makeDeadlineTemplate(dueDate) : ``;

  const isRepeated = Object.values(repeatingDays).some(Boolean);
  const repeatedClass = isRepeated ? `card--repeat` : ``;
  const daysMarkup = isRepeated ? makeRepeatingDaysTemplate(DAYS, repeatingDays) : ``;

  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const deadlineClass = isExpired ? `card--deadline` : ``;

  return `
    <article class="card card--edit card--${color} ${repeatedClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${hasDueDate ? `yes` : `no`}</span>
                </button>
                
                ${deadlineMarkup}
                
                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${isRepeated ? `yes` : `no`}</span>
                </button>
                
                ${daysMarkup}
                
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${hashtagsMarkup}
                </div>

                <label>
                  <input
                    type="text"
                    class="card__hashtag-input"
                    name="hashtag-input"
                    placeholder="Type new hashtag here"
                  />
                </label>
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsMarkup}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>
  `;
};

export default class TaskEditFormComponent {
  constructor(task) {
    this._element = null;
    this._task = task;
  }

  getTemplate() {
    return createTaskEditFormTemplate(this._task);
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
