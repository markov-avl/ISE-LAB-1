import {IAxis} from "./IAxis";
import {Aggregator} from "../enum/Aggregator";

export interface IOrdinate<T> extends IAxis {
    by: keyof T
    aggregator: Aggregator
}