import {FIELDS_TO_SORT} from "./constants";
import {toSorterForm} from "./html";
import {IData} from "./IData";
import {ISortParam} from "./ISortParam";
import {getSorterName, sortBy} from "./utils";

export const initSortersHtml = () => {
    const sorters = document.getElementById('sorters')
    sorters.innerHTML += `<h2>Sorters</h2>`

    FIELDS_TO_SORT.forEach(sortedFieldName => {
        sorters.innerHTML += toSorterForm(sortedFieldName)
    })
}

export const makeSortersMovable = () => {
    document.getElementById("sorters").addEventListener("click", (e) => {
        const target = e.target as HTMLElement
        if (target.tagName === "BUTTON") {
            const selectedItem = target.parentNode
            if (target.classList.contains("up-button") && selectedItem.previousSibling) {
                selectedItem.parentNode.insertBefore(selectedItem, selectedItem.previousSibling)
            } else if (target.classList.contains("down-button") && selectedItem.nextSibling) {
                selectedItem.parentNode.insertBefore(selectedItem.nextSibling, selectedItem)
            }
        }
    })
}

export const sortData = (data: IData[]): IData[] => {
    const sortParams = Array.from(document.getElementById('sorters').children)
        .filter(sorter => sorter.id && !(document.getElementById(sorter.id + 'NS') as HTMLInputElement).checked)
        .map((sorter: Element): ISortParam => {
            return {
                by: getSorterName(sorter.id),
                ascending: (document.getElementById(sorter.id + 'Asc') as HTMLInputElement).checked
            }
        })
    return sortBy(data, sortParams)
}
