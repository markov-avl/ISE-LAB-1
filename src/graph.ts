import * as d3 from "d3";
import {IData} from "./interface/IData";
import {getData, groupBy} from "./utils";
import {Aggregator} from "./enum/Aggregator";
import {DateGroup} from "./enum/DateGroup";
import {IAbscissa} from "./interface/IAbscissa";
import {IOrdinate} from "./interface/IOrdinate";


const updateGraph = (data: IData[], abscissa: IAbscissa, ordinate: IOrdinate<IData>) => {
    graph.selectAll("*").remove();

    const groupedData = groupBy(data, {by: dateGroups.get(abscissa.dateGroup)})
    const value: (a: IData[]) => number = d => aggregations.get(ordinate.aggregator)(d, d1 => d1[ordinate.by])

    const xScale = d3.scaleBand()
        .domain(groupedData.keys())
        .range([0, innerWidth])
        .padding(1);

    const yScale = d3.scaleLinear()
        .domain([0.95 * d3.min(groupedData.values(), value), 1.05 * d3.max(groupedData.values(), value)])
        .range([innerHeight, 0]);

    const line = d3.line<[string, IData[]]>()
        .x(d => xScale(d[0]))
        .y(d => yScale(value(d[1])));

    graph.append("path")
        .datum(groupedData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    graph.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-70)")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "-0.15em");

    graph.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));

    graph.append("text")
        .attr("class", "x-axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", height - 30)
        .attr("text-anchor", "middle")
        .text(abscissa.label);

    graph.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -innerHeight / 2)
        .attr("y", -70)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text(ordinate.label);
}

const onUpdateGraph = () => {
    const dateGroup = document.querySelector('input[name="dateGroup"]:checked') as HTMLInputElement
    const dataType = document.querySelector('input[name="dataType"]:checked') as HTMLInputElement
    const aggregation = document.querySelector('input[name="aggregation"]:checked') as HTMLInputElement

    const abscissa: IAbscissa = {
        label: `Date (${dateGroup.labels[0].innerText})`,
        dateGroup: DateGroup[dateGroup.value]
    }
    const ordinate: IOrdinate<IData> = {
        label: dataType.labels[0].innerText,
        by: dataType.value as keyof IData,
        aggregator: Aggregator[aggregation.value]
    }

    updateGraph(data, abscissa, ordinate)
}

const width = 1800;
const height = 600;
const margin = {top: 20, right: 20, bottom: 100, left: 100};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const aggregations = new Map<Aggregator, (a: IData[], b: (c: IData) => any) => number>([
    [Aggregator.MIN, d3.min],
    [Aggregator.MAX, d3.max],
    [Aggregator.MEAN, d3.mean]
])

const dateGroups = new Map<DateGroup, (a: IData) => string>([
    [DateGroup.DAY, row => row.date],
    [DateGroup.MONTH, row => row.date.substring(2)]
])

const svg = d3.select("#graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const graph = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const data = await getData()

document.getElementById("updateGraph").addEventListener("click", onUpdateGraph)
onUpdateGraph()