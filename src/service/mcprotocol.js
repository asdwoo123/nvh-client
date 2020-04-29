import {plcConfig} from '@/config/index2'
import store from '@/store'
import {range} from 'lodash'

const mc = require('mcprotocol')
const conn = new mc


const {host, port} = plcConfig()

const variables = {};

const portList = ['inputPort', 'outputPort', /*'lhdSwitch',*/ 'rhdSwitch', 'lhdLeft', 'lhdRight', 'rhdLeft', 'rhdRight', 'mainAir', 'stop']

portList.forEach(port => {
    variables[port] = plcConfig()[port][0] + ',' + plcConfig()[port][1]
})

const cylinders = range(17).map(n => 'cylinder' + (n + 1))

range(17).forEach(n => {
    variables['cylinder' + (n + 1)] = 'M' + (134 + n) + ',1'
})

variables.mode = 'M336,8'

conn.initiateConnection({port, host: host.join('.'), ascii: false}, connected)

function connected(err) {
    if (!err) store.state.connect = true

    conn.setTranslationCB(function (tag) {
        return variables[tag];
    }); 	// This sets the "translation" to allow us to work with object names defined in our app not in the module

    conn.addItems(portList)

    setInterval(() => {
        conn.readAllItems(valuesReady)
    }, 1000)
}

function valuesReady(anythingBad, values) {
    if (anythingBad) return

    values.outputPort.shift()

    portList.forEach((port) => {
        if (values[port].length > 1) {
            values[port].forEach((value, index) => {
                if (port === 'inputPort' || port === 'outputPort') {
                    store.state[port][index].portValue = value
                } else {
                    store.state[port][index] = value
                }
            })
        } else {
            store.state[port] = values[port]
        }
    })

}

function valuesWritten(anythingBad) {
    if (anythingBad) console.log(anythingBad)
}

export function cylinderOn(index) {
    conn.writeItems(cylinders[index], true, valuesWritten);
}

export function cylinderOff(index) {
    conn.writeItems(cylinders[index], false, valuesWritten);
}

export function changeMode(index) {
    conn.writeItems(['mode'], range(8).map(n => (n === index)), valuesWritten);
}

export function mainAirOn() {
    conn.writeItems('mainAir', true, valuesWritten);
}

export function mainAirOff() {
    conn.writeItems('mainAir', false, valuesWritten);
}

