import * as d3 from 'd3'
import {IData} from "./interface/IData";
import {toDataTableRow} from "./html";
import {initFiltersHtml, fillAllFilters, resetFiltersHtml, filterData} from "./filtering";
import {initSortersHtml, makeSortersMovable, resetSortersHtml, sortData} from "./sorting";
import {getData} from "./utils";


const fillTable = (data: IData[]) => {
    d3.select('#content tbody')
        .selectAll('tr')
        .data(data)
        .join('tr')
        .html(row => toDataTableRow(row))
}

const makeClearParametersButton = () => {
    document.getElementById('clearParameters').addEventListener('click', () => {
        resetFiltersHtml()
        resetSortersHtml()
        fillTable(data)
    })
}

const makeParametrizeButton = () => {
    document.getElementById('parametrize').addEventListener('click', () => {
        const result = Array.of<(_: IData[]) => IData[]>(Array.from, filterData, sortData)
            .reduce((previous, next) => next(previous), data)
        fillTable(result)
    })
}

const data = await getData()


initFiltersHtml()
fillAllFilters(data)

initSortersHtml()
makeSortersMovable()

makeClearParametersButton()
makeParametrizeButton()
fillTable(data)
