import {getRandomNumber} from '../utils.js';

export const generateFilters = (filterTitles) => {
  return filterTitles.map((title) => {
    return {
      'title': title,
      'count': getRandomNumber(15),
    };
  });
};
