import Vue from 'vue'
import Vuex from 'vuex'
import {range} from 'lodash'
import utils from '@/utils'
import {plcConfig} from '@/config'


// eslint-disable-next-line no-unexpected-multiline
const [inputPort, outputPort] = [plcConfig().inputPort, plcConfig().outputPort]
    .map(port => {
        return range(port[1]).map((index) => {
            const frontStr = port[0].substr(0, 2)
            const middleStr = parseInt(port[0].substr(3, 1)) + Math.floor(index / 16)
            const endStr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'][index % 16]
            return {
                portName: frontStr + middleStr + endStr,
                portValue: '0'
            }
        })
    })

const productList = utils.getDB('productList')
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        product: null,
        inputPort,
        outputPort,
        alert: 0
    },
    mutations: {
        setProduct(state, productName) {
            state.product = productList.find(x => x.productName === productName)
        }
    },
    actions: {}
})
