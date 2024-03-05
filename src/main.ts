import * as d3 from 'd3'
import {DSVParsedArray, sort} from "d3";
import {IData} from "./IData";
import {IOrder} from "./IOrder";
import {groupByField, sortByFields} from "./utils";

const FILTERED_FIELDS = ['store', 'date', 'holiday']
const SORTED_FIELDS = ['weeklySales', 'fuelPrice', 'cpi', 'unemployment']
const FILTER = 'Filter'
const SORTER = 'Sorter'
const DATA_PATH = './res/sales.csv'

// utils


const toHtmlTableRow = (row: IData): string =>
    `<tr>
        <td>${row.store}</td>
        <td>${row.date}</td>
        <td>${row.weeklySales}</td>
        <td>${row.holiday}</td>
        <td>${row.temperature}</td>
        <td>${row.fuelPrice}</td>
        <td>${row.cpi}</td>
        <td>${row.unemployment}</td>
    </tr>`

const fillTable = (data: IData[]) => {
    d3.select('#content tbody')
        .selectAll('tr')
        .data(data)
        .join('tr')
        .html((row: IData) => toHtmlTableRow(row))
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

    for (const filter of filters) {
        let selectedOptions = []
        for (const option of filter.options) {
            if (option.selected) {
                selectedOptions.push(option.value)
            }
        }
        if (selectedOptions.length > 0) {
            resultData = resultData.filter(
                item => selectedOptions.includes(item[filter.id.replace(FILTER, '')]))
        }
    }
    console.log(resultData)

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

// filters
const initFilterHtml = filterName => {
    const filterId = filterName + FILTER
    return `<div style="display: flex; flex-direction: column">
                    <p>${filterName}</p>
                    <select name="${filterName}" id="${filterId}" multiple size="20"></select>
                </div>`
}

const initFiltersHtml = () => {
    const filtersDiv = document.getElementById('filters')
    filtersDiv.innerHTML += `<h2>Filters</h2>`
    filtersDiv.innerHTML += `<div style="display: flex"></div>`

    const filterSelects = filtersDiv.children.item(1)
    FILTERED_FIELDS.forEach(filteredFieldName => {
        filterSelects.innerHTML += initFilterHtml(filteredFieldName)
    })
}


const getAllFilters = () => {
    let filters = []
    for (const filterName of FILTERED_FIELDS) {
        const filter = document.getElementById(filterName + FILTER)
        filters.push(filter)
    }
    return filters
}

const fillFilter = (data, filterId) => {
    d3.select('#' + filterId + FILTER)
        .selectAll('option')
        .data(data)
        .join('option')
        .html(data => `<option value="${data}">${data}</option>`)
}

const fillAllFilters = (data: IData[]): void => {
    FILTERED_FIELDS.forEach(filterName => {
        const keys = sort(groupByField(data, filterName).keys())
        fillFilter(keys, filterName)
    })
}

// sorts
const initSorterHtml = (sorterName: string): string => {
    const sorterId = sorterName + SORTER
    return `<div id="${sorterId}">
              <button class="up-button">↑</button>
              <button class="down-button">↓</button>
              <span>Sort by ${sorterName}</span>
              <input type="radio" id="${sorterId}Asc" name="${sorterName}" value="${sorterName}"/>
              <label for="${sorterId}Asc">Asc</label>
              <input type="radio" id="${sorterId}Desc" name="${sorterName}" value="${sorterName}" />
              <label for="${sorterId}Desc">Desc</label>
              <input type="radio" id="${sorterId}NS" name="${sorterName}" value="${sorterName}" checked/>
              <label for="${sorterId}NS">NS</label>
            </div>`
}

const initSortersHtml = () => {
    const sortsDiv = document.getElementById('sorters')
    sortsDiv.innerHTML += `<h2>Sorters</h2>`
    SORTED_FIELDS.forEach(sortedFieldName => {
        sortsDiv.innerHTML += initSorterHtml(sortedFieldName)
    })
}

const sortData = (data: IData[]): IData[] => {
    const orders = Array.from(document.getElementById('sorters').children)
        .filter((sorter: Element): boolean => {
            return sorter.id && !(document.getElementById(sorter.id + 'NS') as HTMLInputElement).checked
        })
        .map((sorter: Element): IOrder => {
            return {
                name: sorter.id.replace(SORTER, ''),
                ascending: (document.getElementById(sorter.id + 'Asc') as HTMLInputElement).checked
            }
        })
    return sortByFields(data, orders)
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