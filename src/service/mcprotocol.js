import {plcConfig} from '@/config/index2'
import store from '@/store'
import {range} from 'lodash'
import db from '@/utils/database'

const mc = require('mcprotocol')
const conn = new mc


const {host, port} = plcConfig()

const variables = {};

const portList = ['inputPort', 'outputPort', 'switchAndStop', 'lhdLeft', 'lhdRight', 'rhdLeft',
    'rhdRight', 'mainAir', 'cylinderError', 'cycleTime', 'total', 'switchOneOn']

portList.forEach(port => {
    variables[port] = plcConfig()[port][0] + ',' + plcConfig()[port][1]
})


const cylinders = range(17).map(n => 'cylinder' + (n + 1))

range(17).forEach(n => {
    variables['cylinder' + (n + 1)] = 'M' + (134 + n) + ',1'
})


variables.mode = 'M336,8'

variables.alarm = 'M303,4'

variables.manual = 'M2,1'

variables.allHp = 'M359,1'

variables.productDetection = 'M209,1'

variables.alertStopTime = 'D1000,1'

variables.cylinderWaitingTime = 'D1020,1'

variables.switchWaitingTime = 'D1030,1',

variables.UsingSwitch = 'M400,2'

variables.complete = 'M310,1'

variables.reset = 'M370,1'

variables.yellow = 'M3,1'

variables.release = 'M200,1'

variables.selectMode = 'M290,1'

variables.start = 'M500,1'

conn.initiateConnection({port, host: host.join('.'), ascii: false}, connected)

function connected(err) {
    if (!err) store.state.connect = true

    conn.setTranslationCB(function (tag) {
        return variables[tag];
    });

    conn.addItems(portList)
    conn.addItems('allHp')

    setInterval(() => {
        conn.readAllItems(valuesReady)
    }, 100)

    writeSetting()
}


function valuesReady(anythingBad, values) {
    if (anythingBad) return

    store.state.cycleTime = values.cycleTime
    store.state.total = values.total

    values.outputPort.shift()
    portList.forEach((port) => {
        if (port === 'switchAndStop') {
            store.state.lhdSwitch = values.switchAndStop.slice(0, 22)
            store.state.lhdSwitch.splice(12, 1)
            store.state.stop = values.switchAndStop.slice(33, 34)[0]
            store.state.airAlarm = values.switchAndStop.slice(36, 37)[0]
            store.state.detectionSwitch = values.switchAndStop.slice(39, 41)
            store.state.rhdSwitch = values.switchAndStop.slice(42)

        } else {
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
    conn.writeItems('mode', range(8).map(n => (n === index)), valuesWritten);
}

export function mainAirOn() {
    conn.writeItems('mainAir', true, valuesWritten);
}

export function mainAirOff() {
    conn.writeItems('mainAir', false);
}

export function manualOn() {
    conn.writeItems('manual', true, valuesWritten);
}

export function manualOff() {
    conn.writeItems('manual', false, () => yellowOff());
}

export function complete() {
    console.log('complete')
    conn.writeItems('complete', true, valuesWritten);
}

export function deComplete() {
    console.log('deComplete')
    conn.writeItems('complete', false, valuesWritten);
}

export function reset() {
    console.log('reset')
    conn.writeItems('reset', true, () => {
        setTimeout(() => conn.writeItems('reset', false), 500)
    });
}

export function yellowOn() {
    conn.writeItems('yellow', true, valuesWritten);
}

export function yellowOff() {
    conn.writeItems('yellow', false, valuesWritten);
}

export function stopRelease() {
    conn.writeItems('release', true, () => setTimeout(() => conn.writeItems('release', false), 500));
}

export function selectModeOn() {
    conn.writeItems('selectMode', true, valuesWritten);
}

export function selectModeOff() {
    conn.writeItems('selectMode', false, valuesWritten);
}

export function start() {
    console.log('start')
    store.state.workComplete = false
    conn.writeItems('complete', false, () => {
        conn.writeItems('start', true, () => {
            setTimeout(() => {
                conn.writeItems('start', false)
            }, 500)
        });
    });
}

export function writeSetting() {
    conn.writeItems('alertStopTime', Math.floor(db.getDB('config').alertStopTime * 10), () => {
        conn.writeItems('cylinderWaitingTime', Math.floor(db.getDB('config').cylinderWaitingTime * 10), () => {
            conn.writeItems('switchWaitingTime', Math.floor(db.getDB('config').switchWaitingTime * 10), () => {
                    const switchs = db.getDB('config').UsingSwitch
                    const s1 = switchs.find(s => s === 'switch1')
                    const s2 = switchs.find(s => s === 'switch2')

                    conn.writeItems('UsingSwitch', [!s1, !s2], () =>  deComplete())
                }
            )
        })
    })
}
