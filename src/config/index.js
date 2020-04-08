import { range } from 'lodash'

export const InputBoard = () => {
    const result = []
    range(0, 5)
        .map(n => [...range(0, 10), 'A', 'B', 'C', 'D', 'E', 'F'].map(nn => result.push(`X0${n}${nn}`)))
    return result
}


export const OutputBoard = () => {
    const result = []
    range(5, 7)
        .map(n => [...range(0, 10), 'A', 'B', 'C', 'D', 'E', 'F'].map(nn => result.push(`Y0${n}${nn}`)))
    return result
}
