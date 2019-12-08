import {getRandomNumber, getRandomArrayItem} from '../utils.js';
import {COLORS, DAYS} from '../constants.js';

const DESCRIPTIONS = [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`];
const TAGS = [`homework`, `theory`, `practice`, `intensive`, `keks`];

const DEFAULT_REPEATING_DAYS = DAYS.reduce((repeatingDays, day) => {
  repeatingDays[day] = false;
  return repeatingDays;
}, {});

const makeRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomNumber(7);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const makeRepeatingDays = () => {
  return Object.assign({}, DEFAULT_REPEATING_DAYS, {
    'mo': Math.random() > 0.5,
  });
};

const makeRandomTags = (tags) => {
  const tagsCount = getRandomNumber(3);
  return tagsCount ? tags.sort(() => 0.5 - Math.random()).slice(0, tagsCount) : null;
};

const generateSingleTask = () => {
  const dueDate = Math.random() > 0.5 ? null : makeRandomDate();

  return {
    description: getRandomArrayItem(DESCRIPTIONS),
    dueDate,
    repeatingDays: dueDate ? DEFAULT_REPEATING_DAYS : makeRepeatingDays(),
    tags: new Set(makeRandomTags(TAGS)),
    color: getRandomArrayItem(COLORS),
    isFavorite: Math.random() > 0.5,
    isArchive: Math.random() > 0.5,
  };
};

const generateTasks = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateSingleTask);
};

export {generateSingleTask, generateTasks};
