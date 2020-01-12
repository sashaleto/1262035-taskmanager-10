import {RenderPosition} from './constants';

/**
 * Генерация случайного числа в диапазоне от 0 до max
 * @param {number} max - максимальное значение
 * @return {number} - рандомное число
 */
export const getRandomNumber = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const getRandomArrayItem = (array) => {
  return array[getRandomNumber(array.length)];
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

/**
 * Приведение формата времени в вид: "hh:mm a"
 * @param {Date} date - исходная дата-время
 * @return {string} - отформатированное время
 */
export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  const interval = date.getHours() > 11 ? `PM` : `AM`;

  return `${hours}:${minutes} ${interval}`;
};

export const createElementDiv = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

export const render = (container, element, position) => {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
