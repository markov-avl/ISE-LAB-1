import * as d3 from 'd3'
import {DSVParsedArray, sort} from "d3";
import {IData} from "./IData";
import {ISortParam} from "./ISortParam";
import {filterBy, getFilterId, getFilterName, groupByField, sortWithParams} from "./utils";
import {toDataTableRow, toFilterSelect, toSorterForm} from "./html";
import {DATA_PATH, FIELDS_TO_FILTER, FIELDS_TO_SORT, SORTER_ID_SUFFIX} from "./constants";


const fillTable = (data: IData[]) => {
    d3.select('#content tbody')
        .selectAll('tr')
        .data(data)
        .join('tr')
        .html((row: IData) => toDataTableRow(row))
}

const makeSortersMovable = () => {
    const list = document.getElementById("sorters")

    list.addEventListener("click", (e) => {
        const target = e.target as HTMLElement
        if (target.tagName === "BUTTON") {
            const selectedItem = target.parentNode
            if (target.classList.contains("up-button")) {
                if (selectedItem.previousSibling) {
                    selectedItem.parentNode.insertBefore(selectedItem, selectedItem.previousSibling)
                }
            } else if (target.classList.contains("down-button")) {
                if (selectedItem.nextSibling) {
                    selectedItem.parentNode.insertBefore(selectedItem.nextSibling, selectedItem)
                }
            }
        }
    })
}

const buildButtonCallback = () => {
    const filters = getAllFilters()
    let resultData = Array.from(data)

    filters.forEach(filterSelect => {
        const values = Array.from(filterSelect.options)
            .filter(option => option.selected)
            .map(option => option.value)
        if (values.length) {
            const filterName = getFilterName(filterSelect.id)
            resultData = filterBy(resultData, filterName, values)
        }
    })

    fillTable(sortData(resultData))
}

const makeBuildButton = () => {
    document.getElementById('build').addEventListener('click', buildButtonCallback)
}

const getData = async (): Promise<DSVParsedArray<IData>> => await d3.csv<IData>(DATA_PATH, res => {
    return {
        store: +res.Store,
        date: res.Date,
        weeklySales: +res.Weekly_Sales,
        holiday: !!+res.Holiday_Flag,
        temperature: +res.Temperature,
        fuelPrice: +res.Fuel_Price,
        cpi: +res.CPI,
        unemployment: +res.Unemployment
    }
})


const initFiltersHtml = () => {
    const filtersDiv = document.getElementById('filters')
    filtersDiv.innerHTML += `<h2>Filters</h2>`
    filtersDiv.innerHTML += `<div style="display: flex"></div>`

    const filterSelects = filtersDiv.children.item(1)
    FIELDS_TO_FILTER.forEach(filteredFieldName => {
        filterSelects.innerHTML += toFilterSelect(filteredFieldName)
    })
}


const getAllFilters = (): HTMLSelectElement[] => {
    return FIELDS_TO_FILTER
        .map(filterName => document.getElementById(getFilterId(filterName)) as HTMLSelectElement)
}

const fillFilter = (data: IData[], filterName: string) => {
    d3.select('#' + getFilterId(filterName))
        .selectAll('option')
        .data(data)
        .join('option')
        .html(data => `<option value="${data}">${data}</option>`)
}

const fillAllFilters = (data: IData[]): void => {
    FIELDS_TO_FILTER.forEach(filterName => {
        const keys = sort(groupByField(data, filterName).keys())
        fillFilter(keys, filterName)
    })
}


const initSortersHtml = () => {
    const sortsDiv = document.getElementById('sorters')
    sortsDiv.innerHTML += `<h2>Sorters</h2>`
    FIELDS_TO_SORT.forEach(sortedFieldName => {
        sortsDiv.innerHTML += toSorterForm(sortedFieldName)
    })
}

const sortData = (data: IData[]): IData[] => {
    const sortParams = Array.from(document.getElementById('sorters').children)
        .filter((sorter: Element): boolean => {
            return sorter.id && !(document.getElementById(sorter.id + 'NS') as HTMLInputElement).checked
        })
        .map((sorter: Element): ISortParam => {
            return {
                by: sorter.id.replace(SORTER_ID_SUFFIX, ''),
                ascending: (document.getElementById(sorter.id + 'Asc') as HTMLInputElement).checked
            }
        })
    return sortWithParams(data, sortParams)
}

// main
const data = await getData()

initFiltersHtml()
fillAllFilters(data)

initSortersHtml()
makeSortersMovable()

fillTable(data)
makeBuildButton()
buildButtonCallback()