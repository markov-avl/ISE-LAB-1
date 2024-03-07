import * as d3 from "d3";
import {ISortParam} from "./ISortParam";
import {FILTER_ID_SUFFIX, SORTER_ID_SUFFIX} from "./constants";

export const groupByField = <T>(data: T[], fieldName: string) => d3.group(data, (item: T) => item[fieldName])

export const filterBy = <T>(data: T[], fieldName: string, values: string[]) => d3.filter(data, (item: T) =>
    values.includes(item[fieldName].toString()))

export const sortWithParams = <T>(data: T[], sortParams: ISortParam[]) => {
    if (!sortParams.length) {
        return data
    }
    const comparator = (x: T, y: T) => sortParams
        .map(sortParam => (sortParam.ascending ? d3.ascending : d3.descending)(x[sortParam.by], y[sortParam.by]))
        .reduce((direction1, direction2) => direction1 || direction2)
    return d3.sort(data, comparator)
}

export const getFilterId = (filterName: string) => `${filterName}${FILTER_ID_SUFFIX}`

export const getFilterName = (filterId: string) => filterId.replace(FILTER_ID_SUFFIX, '')

export const getSorterId = (sorterName: string) => `${sorterName}${SORTER_ID_SUFFIX}`

export const getSorterName = (sorterId: string) => sorterId.replace(SORTER_ID_SUFFIX, '')
