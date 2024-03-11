import * as d3 from "d3";
import {IData} from "./interface/IData";

const minMaxF = d3.extent(arrGraph.map(d => d.f));
const min = minMaxF[0];
const max = minMaxF[1];

const scaleX = d3.scaleLinear()
    .domain([a, b])
    .range([0, width - 2 * marginX]);

const scaleY = d3.scaleLinear()
    .domain([min, max])
    .range([height - 2 * marginY, 0]);

export const getLine = (data: IData[]): d3.Line<any> => {
    return d3.line()
        .x(d => scaleX(d.x))
        .y(d => scaleY(d.f))
}

let lineF = d3.line()
    .x(d => scaleX(d.x))
    .y(d => scaleY(d.f))