import xlsx from 'node-xlsx'
import { clone } from 'lodash'

export default {
    encodeXLSX(targetC, name) {
        const target = clone(targetC)
        const data1 = ['', ...Object.keys(target)]
        const values = Object.values(target)
        const keys = Object.keys(values[0])
        const v = keys.map((key) => {
            return [key, ...values.filter(d => d.key = key).map(d => d[key])]
        })
        const data = [data1, ...v]
        return xlsx.build([{name: (name) ? name : 'myLanguage', data}])
    },
    decodeXLSX(path) {
        const data = {}
        const workSheetsData = xlsx.parse(path)[0].data
        const keys = workSheetsData[0]
        keys.shift()
        keys.forEach((key, index) => {
            data[key] = {}
            const values = workSheetsData.slice(1, workSheetsData.length)
            values.forEach(w => {
                data[key][w[0]] = w[index + 1]
            })
        })
        return data
    }
}
