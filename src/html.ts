import {IData} from "./interface/IData";
import {getFilterId, getSorterId} from "./utils";

export const toDataTableRow = (row: IData): string =>
    `<tr>
        <td>${row.store}</td>
        <td>${row.date}</td>
        <td>${row.weeklySales}</td>
        <td>${row.holiday}</td>
        <td>${row.temperature}</td>
        <td>${row.fuelPrice}</td>
        <td>${row.cpi}</td>
        <td>${row.unemployment}</td>
    </tr>`

export const toFilterSelect = (filterName: string): string => {
    const filterId = getFilterId(filterName)
    return `<div style="display: flex; flex-direction: column">
                <p>${filterName}</p>
                <select name="${filterName}" id="${filterId}" multiple size="20"></select>
            </div>`
}

export const toSorterForm = (sorterName: string): string => {
    const sorterId = getSorterId(sorterName)
    return `<div id="${sorterId}">
                <button class="up-button">↑</button>
                <button class="down-button">↓</button>
                <span>Sort by ${sorterName}</span>
                <input type="radio" id="${sorterId}Asc" name="${sorterName}" value="${sorterName}"/>
                <label for="${sorterId}Asc">Asc</label>
                <input type="radio" id="${sorterId}Desc" name="${sorterName}" value="${sorterName}" />
                <label for="${sorterId}Desc">Desc</label>
                <input type="radio" id="${sorterId}NS" name="${sorterName}" value="${sorterName}" checked/>
                <label for="${sorterId}NS">NS</label>
            </div>`
}