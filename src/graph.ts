import * as d3 from "d3";
import {IData} from "./interface/IData";
import {getData, groupBy} from "./utils";
import {Aggregator} from "./enum/Aggregator";
import {DateGroup} from "./enum/DateGroup";
import {IAbscissa} from "./interface/IAbscissa";
import {IOrdinate} from "./interface/IOrdinate";


const getAbscissa = (): IAbscissa => {
    const dateGroup = document.querySelector('input[name="dateGroup"]:checked') as HTMLInputElement
    return {
        label: `Date (${dateGroup.labels[0].innerText})`,
        dateGroup: DateGroup[dateGroup.value]
    }
}

const getOrdinate = (): IOrdinate<IData> => {
    const dataType = document.querySelector('input[name="dataType"]:checked') as HTMLInputElement
    const aggregation = document.querySelector('input[name="aggregation"]:checked') as HTMLInputElement
    return {
        label: dataType.labels[0].innerText,
        by: dataType.value as keyof IData,
        aggregator: Aggregator[aggregation.value]
    }
}

const createGraph = (data: IData[]) => {
    const abscissa = getAbscissa()
    const ordinate = getOrdinate()
    const groupedData = groupBy(data, {by: dateGroups.get(abscissa.dateGroup)})
    const value = (d: IData[]) => aggregations.get(ordinate.aggregator)(d, row => row[ordinate.by])

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

    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const graph = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    graph.append("path")
        .datum(groupedData)
        .transition()
        .duration(1000)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line)

    graph.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-70)")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "-0.15em")
        .attr("opacity", 1)

    graph.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))

    graph.append("text")
        .attr("class", "x-axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", height - 30)
        .attr("text-anchor", "middle")
        .text(abscissa.label)

    graph.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -innerHeight / 2)
        .attr("y", -70)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text(ordinate.label)

    return graph
}

const updateGraph = (data: IData[]) => {
    const abscissa = getAbscissa()
    const ordinate = getOrdinate()
    const groupedData = groupBy(data, {by: dateGroups.get(abscissa.dateGroup)})
    const value = (d: IData[]) => aggregations.get(ordinate.aggregator)(d, row => row[ordinate.by])

    const xScale = d3.scaleBand()
        .domain(groupedData.keys())
        .range([0, innerWidth])
        .padding(1);

    const yScale = d3.scaleLinear()
        .domain([0.95 * d3.min(groupedData.values(), value), 1.05 * d3.max(groupedData.values(), value)])
        .range([innerHeight, 0])

    const line = d3.line<[string, IData[]]>()
        .x(d => xScale(d[0]))
        .y(d => yScale(value(d[1])))

    graph.select<SVGAElement>("#graph > svg > g > path")
        .datum(groupedData)
        .attr("opacity", 1)
        .transition()
        .duration(animationDuration)
        .attr("d", line)

    graph.select<SVGAElement>("#graph > svg > g > g.x-axis")
        .transition()
        .duration(animationDuration)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-70)")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "-0.15em")
        .attr("opacity", 1)

    graph.select<SVGAElement>("#graph > svg > g > g.y-axis")
        .transition()
        .duration(animationDuration)
        .call(d3.axisLeft(yScale))

    graph.select("#graph > svg > g > text.x-axis-label")
        .text(abscissa.label)
        .attr("opacity", 0)
        .transition()
        .duration(animationDuration)
        .attr("opacity", 1)

    graph.select("#graph > svg > g > text.y-axis-label")
        .text(ordinate.label)
        .attr("opacity", 0)
        .transition()
        .duration(animationDuration)
        .attr("opacity", 1)
}


const animationDuration = 500
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
    [DateGroup.WEEK, row => row.date],
    [DateGroup.MONTH, row => row.date.substring(3)]
])

const data = await getData()

const graph = createGraph(data)
document.getElementById("updateGraph").addEventListener("click", () => updateGraph(data))
