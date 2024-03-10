import * as d3 from 'd3'
import {DSVParsedArray} from "d3";
import {IData} from "./IData";
import {toDataTableRow} from "./html";
import {DATA_PATH} from "./constants";
import {initFiltersHtml, fillAllFilters, filterData} from "./filtering";
import {initSortersHtml, makeSortersMovable, sortData} from "./sorting";


const fillTable = (data: IData[]) => {
    d3.select('#content tbody')
        .selectAll('tr')
        .data(data)
        .join('tr')
        .html((row: IData) => toDataTableRow(row))
}

const useOptionsCallback = () => {
    const result = Array.of<(_: IData[]) => IData[]>(Array.from, filterData, sortData)
        .reduce((previous, next) => next(previous), data)
    fillTable(result)
}

const makeUseOptionsButton = () => {
    document.getElementById('useOptions').addEventListener('click', useOptionsCallback)
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

fillTable(data)
makeUseOptionsButton()
useOptionsCallback()