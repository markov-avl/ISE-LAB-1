import {IData} from "./interface/IData";

export const FIELDS_TO_FILTER: (keyof IData)[] = ['store', 'date', 'holiday']
export const FIELDS_TO_SORT: (keyof IData)[] = ['weeklySales', 'fuelPrice', 'cpi', 'unemployment']
export const FILTER_ID_SUFFIX = 'Filter'
export const SORTER_ID_SUFFIX = 'Sorter'
export const DATA_PATH = './res/sales.csv'