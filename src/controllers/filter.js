import FilterComponent from "../components/main-filter";
import {FilterType} from "../constants";
import {RenderPosition, render} from '../utils/render';
import {getTasksByFilter} from "../utils/filters";
import {replace} from "../utils/render";

export default class FilterController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._filterComponent = null;
    this._activeFilterType = FilterType.ALL;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._tasksModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allTasks = this._tasksModel.getAllTasks();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        title: filterType,
        count: getTasksByFilter(allTasks, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._tasksModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
