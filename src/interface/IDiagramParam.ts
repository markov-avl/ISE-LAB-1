import {Aggregator} from "../enum/Aggregator";

export interface IDiagramParam<T> {
    label: string
    field: keyof T
    aggregator: Aggregator
}