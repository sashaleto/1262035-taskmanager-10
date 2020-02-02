import moment from 'moment';

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

export const formatTime = (date) => {
  return moment(date).format(`hh:mm A`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

export const isOverdueDate = (dueDate, date) => {
  return dueDate < date && !isOneDay(date, dueDate);
};

export const checkIsTaskRepeated = (days) => {
  return Object.values(days).some(Boolean);
};

export const isOneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `days`) === 0 && dateA.getDate() === dateB.getDate();
};
