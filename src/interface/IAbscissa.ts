import {IAxis} from "./IAxis";
import {DateGroup} from "../enum/DateGroup";

export interface IAbscissa extends IAxis {
    dateGroup: DateGroup
}