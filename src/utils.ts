import * as d3 from "d3";
import {ISortParam} from "./interface/ISortParam";
import {DATA_PATH, FILTER_ID_SUFFIX, SORTER_ID_SUFFIX} from "./constants";
import {DSVParsedArray} from "d3";
import {IData} from "./interface/IData";
import {IGroupParam} from "./interface/IGroupParam";

export const groupBy = (data: IData[], groupParam: IGroupParam<IData>) =>
    d3.group(data, groupParam.by)

export const filterBy = (data: IData[], fieldName: string, values: string[]) =>
    d3.filter(data, (item: IData) => values.includes(item[fieldName].toString()))

export const sortBy = (data: IData[], sortParams: ISortParam<IData>[]) => {
    if (!sortParams.length) {
        return data
    }
    const comparator = (x: IData, y: IData) => sortParams
        .map(sortParam => (sortParam.ascending ? d3.ascending : d3.descending)(x[sortParam.by], y[sortParam.by]))
        .reduce((direction1, direction2) => direction1 || direction2)
    return d3.sort(data, comparator)
}

export const getFilterId = (filterName: keyof IData): string => `${filterName}${FILTER_ID_SUFFIX}`

export const getFilterName = (filterId: string): keyof IData => filterId.replace(FILTER_ID_SUFFIX, '') as keyof IData

export const getSorterId = (sorterName: keyof IData): string => `${sorterName}${SORTER_ID_SUFFIX}`

export const getSorterName = (sorterId: string): keyof IData => sorterId.replace(SORTER_ID_SUFFIX, '') as keyof IData

export const getData = async (): Promise<DSVParsedArray<IData>> => await d3.csv<IData>(DATA_PATH, row => {
    return {
        store: +row.Store,
        date: row.Date,
        weeklySales: +row.Weekly_Sales,
        holiday: !!+row.Holiday_Flag,
        temperature: +row.Temperature,
        fuelPrice: +row.Fuel_Price,
        cpi: +row.CPI,
        unemployment: +row.Unemployment
    }
})
