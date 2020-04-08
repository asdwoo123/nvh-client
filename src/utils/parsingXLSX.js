import xlsx from 'node-xlsx'
import { clone } from 'lodash'

export default {
    encodeXLSX(targetC) {
        const target = clone(targetC)
        const data1 = ['', ...Object.keys(target)]
        const values = Object.values(target)
        const keys = Object.keys(values[0])
        const v = keys.map((key) => {
         return [key, ...values.filter(d => d.key = key).map(d => d[key])]
        })
        const data = [data1, ...v]
        console.log(data)
        return xlsx.build([{name: 'myLanguage', data}])
    },
    decodeXLSX(path) {
        const data = {}
        const workSheetsData = xlsx.parse(path)[0].data
        const keys = workSheetsData[0]
        keys.shift()
        keys.forEach((key, index) => {
            data[key] = {}
        const values = workSheetsData.slice(1, workSheetsData.length - 1)
        values.forEach(w => {
            data[key][w[0]] = w[index + 1]
        })
        })
        return data
    }
}
