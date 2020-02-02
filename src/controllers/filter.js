import FilterComponent from "../components/main-filter";
import {FilterType} from "../constants";
import {RenderPosition, render} from '../utils/render';
import {getTasksByFilter} from "../utils/filters";

export default class FilterController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._filterComponent = null;
    this._activeFilterType = FilterType.ALL;
  }

  render() {
    const container = this._container;
    const allTasks = this._tasksModel.getTasks();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        title: filterType,
        count: getTasksByFilter(allTasks, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    this._filterComponent = new FilterComponent(filters);
    render(container, this._filterComponent, RenderPosition.BEFOREEND);
  }
}
