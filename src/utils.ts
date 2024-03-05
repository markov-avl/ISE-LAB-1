import * as d3 from "d3";
import {IOrder} from "./IOrder";

export const groupByField = <T>(data: T[], fieldName: string) => d3.group(data, (item: T) => item[fieldName])

export const sortByFields = <T>(data: T[], fields: IOrder[]) => d3.sort(data, ...fields.map(order => {
    const direction = order.ascending ? d3.ascending : d3.descending
    return (x: T, y: T) => direction(x[order.name], y[order.name])
}))
