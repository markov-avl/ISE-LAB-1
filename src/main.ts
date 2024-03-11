import * as d3 from 'd3'
import {DSVParsedArray} from "d3";
import {IData} from "./interface/IData";
import {toDataTableRow} from "./html";
import {DATA_PATH} from "./constants";
import {initFiltersHtml, fillAllFilters, resetFiltersHtml, filterData} from "./filtering";
import {initSortersHtml, makeSortersMovable, resetSortersHtml, sortData} from "./sorting";


const fillTable = (data: IData[]) => {
    d3.select('#content tbody')
        .selectAll('tr')
        .data(data)
        .join('tr')
        .html(row => toDataTableRow(row))
}

const makeClearOptionsButton = () => {
    document.getElementById('clearOptions').addEventListener('click', () => {
        resetFiltersHtml()
        resetSortersHtml()
        fillTable(data)
    })
}

const makeUseOptionsButton = () => {
    document.getElementById('useOptions').addEventListener('click', () => {
        const result = Array.of<(_: IData[]) => IData[]>(Array.from, filterData, sortData)
            .reduce((previous, next) => next(previous), data)
        fillTable(result)
    })
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

const data = await getData()


initFiltersHtml()
fillAllFilters(data)

initSortersHtml()
makeSortersMovable()

makeClearOptionsButton()
makeUseOptionsButton()
fillTable(data)
