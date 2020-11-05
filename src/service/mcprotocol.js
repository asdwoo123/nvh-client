import {plcConfig} from '@/config/index2'
import store from '@/store'
import utils from '@/utils'
import {range} from 'lodash'
import db from '@/utils/database'
import bus from '@/utils/bus'

const mc = require('mcprotocol')
const conn = new mc

const {host, port} = plcConfig()

const variables = {};

const portList = ['inputPort', 'outputPort', 'switchAndStop', 'lhdLeft', 'lhdRight', 'rhdLeft',
    'rhdRight', 'mainAir', 'cylinderError', 'total', 'primaryWork', 'nokAndOk', 'switchOneOn', 'cylinderErrorCheck', 'sideJigError', 'incompleteWork', 'toolDetectSwitch', 'toolSensor', 'clock']

portList.forEach(port => {
    variables[port] = plcConfig()[port][0] + ',' + plcConfig()[port][1]
})

const {isHoleChecking} = store.getters

const cylinders = range(17).map(n => 'cylinder' + (n + 1))

range(17).forEach(n => {
    variables['cylinder' + (n + 1)] = 'M' + (134 + n) + ',1'
})


function aaa() {
    if (store.state.product) {
        const productList = utils.getDB('productList')
        const productIndex = productList.indexOf(productList.find(v => v.productName === store.state.product.productName))
        if ([3, 5].some(n => n === productIndex) && utils.getDB('config').UsingToolSensor === 'Enable') {
            return store.state.toolDetectSwitch
        } else {
            return true
        }
    } else {
        return false
    }
}

/*range(1000).forEach(() => {
    utils.pushHistory('ct', {
        model: 'adsdd',
        cycleTime: 30,
        time: new Date(2020, random(1, 10), random(1, 27), random(1, 24), 30)
    })
})*/

/*
utils.pushHistory('ct', {
    model: 'adsdd',
    cycleTime: 30,
    time: moment()
})
*/


variables.mode = 'M336,8'

variables.alarm = 'M303,4'

variables.manual = 'M2,1'

variables.allHp = 'M359,1'

variables.productDetection = 'M209,1'

variables.alertStopTime = 'D1000,1'

variables.cylinderWaitingTime = 'D1020,1'

variables.switchWaitingTime = 'D1030,1'

variables.UsingSwitch = 'M400,2'

variables.complete = 'M310,1'

variables.reset = 'M370,1'

variables.yellow = 'M3,1'

variables.release = 'M200,1'

variables.selectMode = 'M290,1'

variables.start = 'M500,1'

variables.hole = 'M950,1'

variables.missMatch = 'M951,1'

variables.cycleRun = 'M960,1'

variables.holeMode = 'M3360,1'

variables.inCompleteReset = 'M371,1'

variables.fullCount = 'M520,1'

conn.initiateConnection({port, host: host.join('.'), ascii: false}, connected)

let incompleteWork = false

function connected(err) {
    if (!err) store.state.connect = true

    conn.setTranslationCB(function (tag) {
        return variables[tag];
    });

    conn.addItems(portList)
    conn.addItems('allHp')
    writeSetting()
    let working = false
    let hole = false
    let cycle = false
    let wc = false
    let toolSensorOn = false
    let tc = false

    const productList = utils.getDB('productList')

    setInterval(() => {
        conn.readAllItems(valuesReady)

        if (store.state.product) {
            if (store.state.incompleteWork) {
                if (!incompleteWork) {
                    utils.pushHistory('alarm', {
                        model: store.state.product.productName,
                        message: 'incompleteWork',
                        time: store.state.clock
                    })
                    incompleteWork = true
                }
            } else {
                incompleteWork = false
            }
        }


        if (db.getDB('config').UsingSwitch.length !== 0) {
            if (store.state.detectionSwitch.every(v => v) && !store.state.isComplete && store.state.product && !store.state.incompleteWork && !store.state.leftErr &&
                !store.state.rightErr && !store.state.sideJigError && aaa() && store.state.isTargetCount) {

                const productIndex = productList.indexOf(productList.find(v => v.productName === store.state.product.productName))

                // 툴 센서
                if ([3, 5].some(n => n === productIndex)) {
                    if (store.state.toolSensor && !toolSensorOn && store.state.toolSensorCount < (db.getDB('config').toolCount * 1 || 5)) {
                        store.state.toolSensorCount++
                        if (!tc && store.state.toolSensorCount === (db.getDB('config').toolCount * 1 || 5)) {
                            writePLC('fullCount', true)
                            tc = true
                        }
                        toolSensorOn = true
                    }

                    if (!store.state.toolSensor && toolSensorOn) {
                        toolSensorOn = false
                    }

                }


                if (productIndex !== 2) {
                    working = true
                    if (!cycle) {
                        writePLC('cycleRun', true);
                        cycle = true
                    }
                } else if (store.state.inputPort.slice(66, 68).map(v => v.portValue).every(v => !v) || working) {
                    working = true
                    if (!cycle) {
                        writePLC('cycleRun', true, () => {
                            if (hole) {
                                holeOff()
                                hole = false
                            }
                        });
                        cycle = true
                    } else {
                        if (hole) {
                            holeOff()
                            hole = false
                        }
                    }

                } else {
                    if (!hole) {
                        holeOn()
                        hole = true
                    }
                }

            } else if (store.state.detectionSwitch.every(v => !v)) {
                store.state.cycleTime = 0
                store.state.toolSensorCount = 0
                if (tc) {
                    writePLC('fullCount', false)
                    tc = false
                }

                if (cycle) {
                    cycle = false
                    writePLC('cycleRun', false, () => {
                        if (hole) {
                            holeOff()
                            hole = false
                        }
                    });
                } else {
                    if (hole) {
                        holeOff()
                        hole = false
                    }
                }

                working = false
                wc = false
                toolSensorOn = false
            }


            if (store.state.workComplete) {

                working = false

                if (!wc) {
                    if (store.state.product) {
                        utils.pushHistory('ct', {
                            model: store.state.product.productName,
                            cycleTime: store.state.cycleTime / 10,
                            time: store.state.clock
                        })
                        bus.$emit('count', true)
                    }

                    wc = true
                }

                if (cycle) {
                    writePLC('cycleRun', false);
                    cycle = false
                }
            }
        } else {
            if (store.state.isStart) {
                working = true
                if (!cycle) {
                    writePLC('cycleRun', true);
                    cycle = true
                }

            }
        }

        const {product, lhdLeft, lhdRight, rhdLeft, rhdRight} = store.state

        if (product) {
            const type = product.type
            if (type === 'LHD') {
                store.state.leftErr = !lhdLeft;
                store.state.rightErr = !lhdRight;
            } else if (type === 'RHD') {
                store.state.leftErr = !rhdLeft;
                store.state.rightErr = !rhdRight;
            }

        }
    }, 200)


    setInterval(() => {
        if (working) store.state.cycleTime += 1
    }, 100)


}

let inCompleteWork = false


function valuesReady(anythingBad, values) {
    if (anythingBad) return

    store.state.total = values.total
    store.state.primaryWork = values.primaryWork
    store.state.nokAndOk = values.nokAndOk
    const [year, mon, day, date, min, sec] = values.clock
    store.state.clock = new Date(`${year}/${mon}/${day}/${date}:${min}:${sec}`)

    if ((utils.getDB('config').alarmReset) ? (utils.getDB('config').alarmReset === 'Enable') : true) {
        if (!inCompleteWork && values.incompleteWork) {
            writePLC('inCompleteReset', true)
            inCompleteWork = true
        }

        if (inCompleteWork && !values.incompleteWork) {
            writePLC('inCompleteReset', false)
            inCompleteWork = false
        }
    }

    values.outputPort.shift()
    portList.forEach((port) => {
        if (port === 'switchAndStop') {
            store.state.lhdSwitch = values.switchAndStop.slice(0, 22)
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

export function cylinderOn(index) {
    writePLC(cylinders[index], true);
}

export function cylinderOff(index) {
    writePLC(cylinders[index], false);
}

export function changeMode(index, isHole) {
    writePLC('selectMode', false)
    writePLC('mode', range(8).map(n => (n === index)))
    if (isHole) writePLC('holeMode', true)
    else writePLC('holeMode', false)

    /*conn.writeItems('selectMode', false, () => {
        conn.writeItems('mode', range(8).map(n => (n === index)), () => {
            if (isHole) conn.writeItems('holeMode', true)
            else conn.writeItems('holeMode', false)
        })
    });*/
}

export function mainAirOn() {
    writePLC('mainAir', true);
}

export function mainAirOff() {
    writePLC('mainAir', false);
}

export function holeOn() {
    utils.pushHistory('alarm', {
        model: store.state.product.productName,
        message: 'isHoleCheck',
        time: store.state.clock
    })
    writePLC('hole', true);
}

export function holeOff() {
    writePLC('hole', false);
}

export function missMatchOn() {
    writePLC('missMatch', true);
}

export function missMatchOff() {
    writePLC('missMatch', false);
}

export function manualOn() {
    writePLC('manual', true);
}

export function manualOff() {
    writePLC('manual', false, () => yellowOff());
}

export function complete() {
    store.state.isComplete = true
    store.state.isStart = false
    writePLC('complete', true);
}

export function deComplete() {
    store.state.isComplete = false
    writePLC('complete', false);
}

export function reset() {
    writePLC('reset', true);
    setTimeout(() => writePLC('reset', false), 500)
}

export function yellowOn() {
    writePLC('yellow', true);
}

export function yellowOff() {
    writePLC('yellow', false);
}

export function stopRelease() {
    writePLC('release', true);
    setTimeout(() => writePLC('release', false), 500);
}

export function selectModeOn() {
    writePLC('selectMode', true);
}

export function selectModeOff() {
    writePLC('selectMode', false);
}

export function inCompleteReset() {
    writePLC('inCompleteReset', false)
}

export function start() {
    if (!isHoleChecking) return

    store.state.cycleTime = 0
    store.state.isStart = true
    store.state.workComplete = false
    writePLC('complete', false)
    writePLC('start', true)
    setTimeout(() => {
        writePLC('start', false)
    }, 500)

    /*conn.writeItems('complete', false, () => {
        conn.writeItems('start', true, () => {
            setTimeout(() => {
                conn.writeItems('start', false)
            }, 500)
        });
    });*/
}

export function writeSetting() {
    writePLC('alertStopTime', Math.floor(db.getDB('config').alertStopTime * 10))
    writePLC('cylinderWaitingTime', Math.floor(db.getDB('config').cylinderWaitingTime * 10))
    writePLC('switchWaitingTime', Math.floor(db.getDB('config').switchWaitingTime * 10))
    const switchs = db.getDB('config').UsingSwitch
    const s1 = switchs.find(s => s === 'switch1')
    const s2 = switchs.find(s => s === 'switch2')
    writePLC('UsingSwitch', [!s1, !s2])
    deComplete()

    /*conn.writeItems('alertStopTime', Math.floor(db.getDB('config').alertStopTime * 10), () => {
        conn.writeItems('cylinderWaitingTime', Math.floor(db.getDB('config').cylinderWaitingTime * 10), () => {
            conn.writeItems('switchWaitingTime', Math.floor(db.getDB('config').switchWaitingTime * 10), () => {
                    const switchs = db.getDB('config').UsingSwitch
                    const s1 = switchs.find(s => s === 'switch1')
                    const s2 = switchs.find(s => s === 'switch2')

                    conn.writeItems('UsingSwitch', [!s1, !s2], () => deComplete())
                }
            )
        })
    })*/
}

const writeStream = []

let streaming = false

function writePLC(name, value) {
    writeStream.push({ name, value })
}

setInterval(() => {
    if (writeStream.length > 0 && !streaming) {
        const { name, value } = writeStream.shift()
        streaming = true
        conn.writeItems(name, value, () => streaming = false)
    }
}, 100)
