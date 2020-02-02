import FilterComponent from "../components/main-filter";
import {generateFilters} from "../mocks/filters";
import {FILTER_TITLES} from "../constants";
import {RenderPosition, render} from '../utils/render';

const filters = generateFilters(FILTER_TITLES);

export default class FilterController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._filterComponent = null;
  }

  render() {
    const container = this._container;

    this._filterComponent = new FilterComponent(filters);
    render(container, this._filterComponent, RenderPosition.BEFOREEND);
  }
}
