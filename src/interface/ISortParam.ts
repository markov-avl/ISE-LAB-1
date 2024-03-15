export interface ISortParam<T> {
    by: keyof T
    ascending: boolean
}