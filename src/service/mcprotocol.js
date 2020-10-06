import {plcConfig} from '@/config/index2'
import store from '@/store'
import utils from '@/utils'
import {range} from 'lodash'
import db from '@/utils/database'

const mc = require('mcprotocol')
const conn = new mc

const {host, port} = plcConfig()

const variables = {};

const portList = ['inputPort', 'outputPort', 'switchAndStop', 'lhdLeft', 'lhdRight', 'rhdLeft',
    'rhdRight', 'mainAir', 'cylinderError', 'total', 'primaryWork', 'nokAndOk', 'switchOneOn', 'cylinderErrorCheck', 'sideJigError', 'incompleteWork']

portList.forEach(port => {
    variables[port] = plcConfig()[port][0] + ',' + plcConfig()[port][1]
})

const {isHoleChecking} = store.getters


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

conn.initiateConnection({port, host: host.join('.'), ascii: false}, connected)

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
    let incompleteWork = false
    let toolSensorOn = false

    const productList = utils.getDB('productList')

    setInterval(() => {
        conn.readAllItems(valuesReady)

        if (store.state.product) {
            if (store.state.incompleteWork) {
                if (!incompleteWork) {
                    utils.pushHistory('alarm', {
                        model: store.state.product.productName,
                        message: 'incompleteWork',
                        time: new Date()
                    })
                }
                incompleteWork = true
            } else {
                incompleteWork = false
            }
        }

        if (db.getDB('config').UsingSwitch.length !== 0) {
            if (store.state.detectionSwitch.every(v => v) && !store.state.isComplete && store.state.product && store.state.incompleteWork) {

                // 툴 센서
                if (productList.indexOf(productList.find(v => v.productName === store.state.product.productName)) === 1) {
                    if (store.state.toolSensor && !toolSensorOn && store.state.toolSensorCount < 5) {
                        store.state.toolSensorCount ++
                        toolSensorOn = true
                    } else {
                        if (toolSensorOn) {
                            toolSensorOn = false
                        }
                    }
                }


                if (productList.indexOf(productList.find(v => v.productName === store.state.product.productName)) !== 2) {
                    working = true
                    if (!cycle) {
                        conn.writeItems('cycleRun', true);
                        cycle = true
                    }
                } else if (store.state.inputPort.slice(66, 68).map(v => v.portValue).every(v => !v) || working) {
                    working = true
                    if (!cycle) {
                        conn.writeItems('cycleRun', true, () => {
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
                if (cycle) {
                    cycle = false
                    conn.writeItems('cycleRun', false, () => {
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
                            time: new Date()
                        })
                    }

                    wc = true
                }

                if (cycle) {
                    conn.writeItems('cycleRun', false);
                    cycle = false
                }
            }
        } else {
            if (store.state.isStart) {
                working = true
                if (!cycle) {
                    conn.writeItems('cycleRun', true);
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
    }, 500)


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

    if ((utils.getDB('config').alarmReset) ? (utils.getDB('config').alarmReset === 'Enable') : true) {
        if (!inCompleteWork && values.incompleteWork) {
            conn.writeItems('inCompleteReset', true, function () {
                inCompleteWork = true
            })
        }

        if (inCompleteWork && !values.incompleteWork) {
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
    conn.writeItems(cylinders[index], true);
}

export function cylinderOff(index) {
    conn.writeItems(cylinders[index], false);
}

export function changeMode(index, isHole) {
    conn.writeItems('selectMode', false, () => {
        conn.writeItems('mode', range(8).map(n => (n === index)), () => {
            if (isHole) conn.writeItems('holeMode', true)
            else conn.writeItems('holeMode', false)
        })
    });
}

export function mainAirOn() {
    conn.writeItems('mainAir', true);
}

export function mainAirOff() {
    conn.writeItems('mainAir', false);
}

export function holeOn() {
    utils.pushHistory('alarm', {
        model: store.state.product.productName,
        message: 'isHoleCheck',
        time: new Date()
    })
    conn.writeItems('hole', true);
}

export function holeOff() {
    conn.writeItems('hole', false);
}

export function missMatchOn() {
    conn.writeItems('missMatch', true);
}

export function missMatchOff() {
    conn.writeItems('missMatch', false);
}

export function manualOn() {
    conn.writeItems('manual', true);
}

export function manualOff() {
    conn.writeItems('manual', false, () => yellowOff());
}

export function complete() {
    store.state.isComplete = true
    store.state.isStart = false
    conn.writeItems('complete', true);
}

export function deComplete() {
    store.state.isComplete = false
    conn.writeItems('complete', false);
}

export function reset() {
    conn.writeItems('reset', true, () => {
        setTimeout(() => conn.writeItems('reset', false), 500)
    });
}

export function yellowOn() {
    conn.writeItems('yellow', true);
}

export function yellowOff() {
    conn.writeItems('yellow', false);
}

export function stopRelease() {
    conn.writeItems('release', true, () => setTimeout(() => conn.writeItems('release', false), 500));
}

export function selectModeOn() {
    conn.writeItems('selectMode', true);
}

export function selectModeOff() {
    conn.writeItems('selectMode', false);
}

export function inCompleteReset() {
    conn.writeItems('inCompleteReset', false)
}

export function start() {
    if (!isHoleChecking) return

    store.state.cycleTime = 0
    store.state.isStart = true
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

                    conn.writeItems('UsingSwitch', [!s1, !s2], () => deComplete())
                }
            )
        })
    })
}
