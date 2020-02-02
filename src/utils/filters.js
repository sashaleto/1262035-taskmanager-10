import {checkIsTaskRepeated, isOneDay, isOverdueDate} from "../utils";
import {FilterType} from "../constants";

export const getOverdueTasks = (tasks, date) => {
  return tasks.filter((task) => {
    const dueDate = task.dueDate;

    if (!dueDate) {
      return false;
    }

    return isOverdueDate(dueDate, date);
  });
};

export const getTasksInOneDay = (tasks, date) => {
  return tasks.filter((task) => isOneDay(task.dueDate, date));
};

export const getFavoriteTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

export const getRepeatingTasks = (tasks) => {
  return tasks.filter((task) => checkIsTaskRepeated(task.repeatingDays));
};

export const getTasksWithTags = (tasks) => {
  return tasks.filter((task) => task.tags.size);
};

export const getArchivedTasks = (tasks) => {
  return tasks.filter((task) => task.isArchive);
};

export const getNotArchiveTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchive);
};

export const getTasksByFilter = (tasks, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.ALL:
      return getNotArchiveTasks(tasks);
    case FilterType.ARCHIVE:
      return getArchivedTasks(tasks);
    case FilterType.FAVORITES:
      return getFavoriteTasks(getNotArchiveTasks(tasks));
    case FilterType.OVERDUE:
      return getOverdueTasks(getNotArchiveTasks(tasks), nowDate);
    case FilterType.REPEATING:
      return getRepeatingTasks(getNotArchiveTasks(tasks));
    case FilterType.TAGS:
      return getTasksWithTags(getNotArchiveTasks(tasks));
    case FilterType.TODAY:
      return getTasksInOneDay(getNotArchiveTasks(tasks), nowDate);
  }

  return tasks;
};
