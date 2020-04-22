import {plcConfig} from '@/config'
import store from '@/store'

const mc = require('mcprotocol')
const conn = new mc
let isConnect = false

const {host, port, inputPort, outputPort, alert} = plcConfig()

const variables = {};

[inputPort, outputPort].forEach((port, index) => {
    variables[(index === 0) ? 'inputPort' : 'outputPort'] = port[0] + ',' + port[1]
})

variables.alert = alert[0] + ',' + alert[1]

/*conn.initiateConnection({port, host: host.join('.'), ascii: false}, connected)*/

function connected(err) {
    if (typeof (err) !== "undefined") {
        console.log(err)
        /*conn.initiateConnection({port, host: host.join('.'), ascii: false}, connected)*/
    }
    isConnect = true

    conn.setTranslationCB(function (tag) {
        return variables[tag];
    }); 	// This sets the "translation" to allow us to work with object names defined in our app not in the module
    conn.addItems(Object.keys(variables))
    setInterval(() => {
        conn.readAllItems(valuesReady)
    }, 500)
}

function valuesReady(anythingBad, values) {
    if (anythingBad) return

    values[0].forEach((value, index) => {
        store.state.inputPort[index].portValue = value
    })

    values[1].forEach((value, index) => {
        store.state.outputPort[index].portValue = value
    })

    values[2].forEach((value) => {
        store.state.alert = value
    })
}

function valuesWritten(anythingBad) {
    if (anythingBad) return
}

export function writePLC(ports, value) {
    if (!isConnect) return
    conn.writeItems(ports, [value], valuesWritten);
}
