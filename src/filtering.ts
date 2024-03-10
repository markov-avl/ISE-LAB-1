import {IData} from "./IData";
import {filterBy, getFilterId, getFilterName, groupBy} from "./utils";
import {FIELDS_TO_FILTER} from "./constants";
import {toFilterSelect} from "./html";
import * as d3 from "d3";


export const initFiltersHtml = () => {
    const filters = document.getElementById('filters')
    filters.innerHTML += `<h2>Filters</h2>`
    filters.innerHTML += `<div style="display: flex"></div>`

    const filterSelects = filters.children.item(1)
    FIELDS_TO_FILTER.forEach(filterName => {
        filterSelects.innerHTML += toFilterSelect(filterName)
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
        .map(filterName => document.getElementById(getFilterId(filterName)) as HTMLSelectElement)
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