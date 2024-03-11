import * as d3 from "d3";
import {IData} from "./interface/IData";
import {FIELDS_TO_FILTER} from "./constants";
import {toFilterSelect} from "./html";
import {filterBy, getFilterId, getFilterName, groupBy} from "./utils";


export const initFiltersHtml = () => {
    const filters = document.getElementById('filters').children.item(1)
    FIELDS_TO_FILTER.forEach(filterName => {
        filters.innerHTML += toFilterSelect(filterName)
    })
}

export const resetFiltersHtml = () => {
    FIELDS_TO_FILTER.forEach(filterName => {
        (document.getElementById(getFilterId(filterName)) as HTMLSelectElement).selectedIndex = -1
    })
}

export const fillAllFilters = (data: IData[]): void => {
    FIELDS_TO_FILTER.forEach(filterName => {
        const keys = d3.sort(groupBy(data, filterName).keys())
        d3.select('#' + getFilterId(filterName))
            .selectAll('option')
            .data(keys)
            .join('option')
            .html(key => `<option value="${key}">${key}</option>`)
    })
}

export const filterData = (data: IData[]): IData[] => {
    FIELDS_TO_FILTER
        .map(filterName => getFilterId(filterName))
        .map(filterId => document.getElementById(filterId) as HTMLSelectElement)
        .forEach(filterSelect => {
            const values = Array.from(filterSelect.options)
                .filter(option => option.selected)
                .map(option => option.value)
            if (values.length) {
                const filterName = getFilterName(filterSelect.id)
                data = filterBy(data, filterName, values)
            }
        })
    return data
}