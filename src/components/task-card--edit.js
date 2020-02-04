import flatpickr from 'flatpickr';
import he from 'he';
import AbstractSmartComponent from './abstract-smart-component';
import {DAYS, COLORS} from '../constants.js';
import {formatTime, formatDate, checkIsTaskRepeated} from '../utils.js';

const MIN_DESCRIPTION_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 140;

const isAllowableDescriptionLength = (description) => {
  const length = description.length;

  return length >= MIN_DESCRIPTION_LENGTH &&
    length <= MAX_DESCRIPTION_LENGTH;
};

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

const makeColorsTemplate = (colors, taskColor) => {
  return colors.map((color) => {
    const isChecked = (color === taskColor);
    return `
      <input
        type="radio"
        id="color-${color}-4"
        class="card__color-input card__color-input--${color} visually-hidden"
        name="color"
        value="${color}"
        ${isChecked ? `checked` : ``}
      />
      <label
        for="color-black-4"
        class="card__color card__color--${color}"
        >${color}</label
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
  const date = dueDate ? formatDate(dueDate) : ``;
  const time = dueDate ? formatTime(dueDate) : ``;

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
const createTaskEditFormTemplate = (task, options = {}) => {
  const {dueDate, tags, color} = task;
  const {isDateShowing, isRepeated, activeRepeatingDays, currentDescription} = options;

  const description = he.encode(currentDescription);

  const colorsMarkup = makeColorsTemplate(COLORS, color);
  const hashtagsMarkup = makeHashtagsTemplate(tags);

  const deadlineMarkup = isDateShowing ? makeDeadlineTemplate(dueDate) : ``;

  const repeatedClass = isRepeated ? `card--repeat` : ``;
  const daysMarkup = isRepeated ? makeRepeatingDaysTemplate(DAYS, activeRepeatingDays) : ``;

  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const isBlockSaveButton = (isDateShowing && isRepeated) ||
    (isRepeated && !checkIsTaskRepeated(activeRepeatingDays)) ||
    !isAllowableDescriptionLength(description);

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
                  date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
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
            <button class="card__save" type="submit" ${isBlockSaveButton ? `disabled` : ``}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>
  `;
};

const parseFormData = (formData) => {
  const repeatingDays = DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});
  const date = formData.get(`date`);

  return {
    description: formData.get(`text`),
    color: formData.get(`color`),
    tags: formData.getAll(`hashtag`),
    dueDate: date ? new Date(date) : null,
    repeatingDays: formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
  };
};

export default class TaskEditFormComponent extends AbstractSmartComponent {
  constructor(task) {
    super();
    this._task = task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeated = checkIsTaskRepeated(task.repeatingDays);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._currentDescription = task.description;
    this._submitHandler = null;
    this._deleteHandler = null;
    this._flatpickr = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getData() {
    const form = this.getElement().querySelector(`.card__form`);
    const formData = new FormData(form);

    return parseFormData(formData);
  }

  getTemplate() {
    return createTaskEditFormTemplate(this._task, {
      isDateShowing: this._isDateShowing,
      isRepeated: this._isRepeated,
      activeRepeatingDays: this._activeRepeatingDays,
      currentDescription: this._currentDescription,
    });
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  setFormSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setDeleteTaskHandler(handler) {
    this.getElement().querySelector(`.card__delete`).addEventListener(`click`, handler);

    this._deleteHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__text`)
      .addEventListener(`input`, (evt) => {
        this._currentDescription = evt.target.value;

        const saveButton = this.getElement().querySelector(`.card__save`);
        saveButton.disabled = !isAllowableDescriptionLength(this._currentDescription);
      });

    element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => {
        this._isDateShowing = !this._isDateShowing;

        this.rerender();
      });

    element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {
        this._isRepeated = !this._isRepeated;

        this.rerender();
      });

    const repeatDays = element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;

        this.rerender();
      });
    }
  }

  recoveryListeners() {
    this.setFormSubmitHandler(this._submitHandler);
    this.setDeleteTaskHandler(this._deleteHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      // При своем создании `flatpickr` дополнительно создает вспомогательные DOM-элементы.
      // Что бы их удалять, нужно вызывать метод `destroy` у созданного инстанса `flatpickr`.
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);
      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._task.dueDate ? this._task.dueDate : new Date(),
      });
    }
  }

  reset() {
    const task = this._task;

    this._isDateShowing = !!task.dueDate;
    this._isRepeated = checkIsTaskRepeated(task.repeatingDays);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._currentDescription = task.description;

    this.rerender();
  }
}
