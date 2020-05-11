import Vue from 'vue'
import Vuex from 'vuex'
import {range, cloneDeep} from 'lodash'
import utils from '@/utils'
import {plcConfig} from '@/config/index2'


const [inputPort, outputPort] = [plcConfig().inputPort, plcConfig().outputPort]
    .map((port, i) => {
        if (i === 1) port[1] = port[1] - 1

        return range(port[1]).map((index) => {
            const frontStr = (i === 0) ? port[0].substr(0, 2) : 'Y0'
            const middleStr = (i === 0) ? parseInt(port[0].substr(3, 1)) + Math.floor(index / 16) : 5 + Math.floor(index / 16)
            const endStr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'][index % 16]
            return {
                portName: frontStr + middleStr + endStr,
                portValue: false
            }
        });
    })

const [lhdSwitch, rhdSwitch] = [22, 20]
    .map(port => {
        return range(port).map(() => false)
    })

const productList = cloneDeep(utils.getDB('productList'))
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        connect: false,
        product: null,
        inputPort,
        outputPort,
        lhdSwitch,
        rhdSwitch,
        lhdLeft: false,
        lhdRight: false,
        rhdLeft: false,
        rhdRight: false,
        mainAir: false,
        stop: false,
        cylinderError: false,
        airAlarm: false,
        alert: 0,
        productDetection: false,
        cycleTime: 0,
        total: 0,
        workComplete: false,
        switchOneOn: false,
        detectionSwitch: [false, false]
    },
    mutations: {
        setProduct(state, productName) {
            state.product = productList.find(x => x.productName === productName)
        }
    },
    actions: {}
})
