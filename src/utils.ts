import * as d3 from "d3";
import {ISortParam} from "./ISortParam";

export const groupByField = <T>(data: T[], fieldName: string) => d3.group(data, (item: T) => item[fieldName])

export const sortWithParams = <T>(data: T[], sortParams: ISortParam[]) => {
    if (!sortParams) {
        return data
    }
    const comparator = (x: T, y: T) => sortParams
        .map(sortParam => (sortParam.ascending ? d3.ascending : d3.descending)(x[sortParam.by], y[sortParam.by]))
        .reduce((direction1, direction2) => direction1 || direction2)
    return d3.sort(data, comparator)
}
