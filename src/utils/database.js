import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import {range, clone} from 'lodash'

const adapter = new LocalStorage('db')
const db = low(adapter)

const LHD = ['LHD SHORT BODY - 84260N7000', 'LHD SHORT BODY - 84260N7200', 'LHD HEV - 84260CZ000', 'LHD PHEV - 84260CZ200']
    .map(name => ({
        productName: name,
        type: 'LHD',
        lamps: range(22).map(n => ({number: n + 1, left: 0, top: 0, visible: true})),
        detectionSwitches: range(2).map(n => ({number: n + 1, left: 0, top: 0}))
    }))

const RHD = ['RHD HEV - 84260CZ920', 'RHD PHEV - 84260CZ950', 'RHD SHORT BODY - 84260N7900', 'RHD SHORT BODY - 84260N7910']
    .map(name => ({
        productName: name,
        type: 'RHD',
        lamps: range(20).map(n => ({number: n + 1, left: 0, top: 0, visible: true})),
        detectionSwitches: range(2).map(n => ({number: n + 1, left: 0, top: 0}))
    }))

const productList = LHD.concat(RHD)

const message = {
    ko: {
        automation: '자동',
        manual: '수동',
        io: '입출력 목록',
        configure: '설정',
        selectModel: '모델 선택',
        changePosition: '램프 위치 변경',
        positionSave: '위치 저장',
        cancel: '취소',
        noProduct: '선택된 모델이 없습니다',
        previous: '이전',
        next: '다음',
        reset: '초기화',
        save: '저장',
        alertStopTime: '알람 대기 시간',
        selectLanguage: '언어 선택',
        langImport: '불러오기',
        langExport: '내보내기'
    },
    en: {
        automation: 'Automation',
        manual: 'Manual',
        io: 'I/O List',
        configure: 'Configure',
        selectModel: 'Select model',
        changePosition: 'Change lamp position',
        positionSave: 'Position save',
        cancel: 'Cancel',
        noProduct: 'No products selected',
        previous: 'Previous',
        next: 'Next',
        reset: 'Reset',
        save: 'Save',
        alertStopTime: 'Alarm wait time',
        selectLanguage: 'Select language',
        langImport: 'Import',
        langExport: 'Export'
    },
    pl: {
        automation: 'Automatyzacja',
        manual: 'podręcznik',
        io: 'Lista we / wy',
        configure: 'Konfiguruj',
        selectModel: 'Wybierz model',
        changePosition: 'Zmień pozycję lampy',
        positionSave: 'Zapisz pozycję',
        cancel: 'Anuluj',
        noProduct: 'Nie wybrano produktów',
        previous: 'Poprzedni',
        next: 'Kolejny',
        reset: 'Reset',
        save: 'Zapisać',
        alertStopTime: 'Czas oczekiwania na alarm',
        selectLanguage: 'Wybierz język',
        langImport: 'Import',
        langExport: 'Eksport'
    }
}

const config = {
    alertStopTime: 3,
    cylinderWaitingTime: 3,
    switchWaitingTime: 3,
    UsingSwitch: ['switch1', 'switch2'],
    lang: 'ko',
    password: '123'
}

const productConfig = {
    productNames: {
        0: 'NX4e LHD NON DCU - 84260N7000',
        1: 'NX4e LHD DCU - 84260N7100',
        2: 'NX4e LHD NON DCU (FIRE) - 84260N7050',
        3: 'NX4e LHD HEV - 84260CZ000',
        4: 'NX4e LHD PHEV - 84260CZ200',
        5: 'NX4e RHD HEV - 84260CZ900',
        6: 'NX4e RHD PHEV - 84260CZ920',
        7: 'NX4e RHD NON DCU - 84260N7900',
        8: 'NX4e RHD DCU - 84260N7950'
    }
}


const ct = []
const alarm = []


/*const productNames = ['LHD SHORT BODY - 84260N7000', 'LHD SHORT BODY - 84260N7100', 'LHD SHORT BODY - 84260N7050', 'LHD HEV - 84260CZ000', 'LHD PHEV - 84260CZ200',
    'RHD HEV - 84260CZ900', 'RHD PHEV - 84260CZ920', 'RHD SHORT BODY - 84260N7900', 'RHD SHORT BODY - 84260N7950']*/

db.defaults({
    productConfig,
    productList,
    message,
    config,
    ct,
    alarm
}).write()

if (!db.get('productConfig')) {
    db.set('productConfig', productConfig).write()
}

/*if (!db.get('productList').value()[0].detectionSwitches) {
    const pl = db.get('productList').value()
    pl.forEach(p => {
        p.detectionSwitches = range(2).map(n => ({number: n + 1, left: 0, top: 0}))
    })
    db.set('productList', pl).write()
}

if (db.get('productList').value()[0].lamps.length < 22) {
    const pl = db.get('productList').value()
    pl.forEach(p => {
        p.lamps.push({number: p.lamps.length + 1, left: 0, top: 0, visible: true})
    })
    db.set('productList', pl).write()
}*/

/*if (db.get('productList').value().length < 10) {
    const pl = db.get('productList').value()
    const productNames = ['LHD SHORT BODY - 84260N7000', 'LHD SHORT BODY - 84260N7100', 'LHD HEV - 84260CZ000', 'LHD PHEV - 84260CZ200',
        'RHD HEV - 84260CZ900', 'RHD PHEV - 84260CZ920', 'RHD SHORT BODY - 84260N7900', 'RHD SHORT BODY - 84260N7950']
    const newPl = pl.map((v, i) => {
        v.productName = productNames[i]
        return v
    })

    const N7050 = clone(pl[0])
    N7050.productName = 'LHD SHORT BODY - 84260N7050'
    const N7150 = clone(pl[1])
    N7150.productName = 'LHD SHORT BODY - 84260N7150'

    newPl.splice(2, 0, N7050)
    newPl.splice(3, 0, N7150)

    db.set('productList', newPl).write()
}*/

/*if (db.get('productList').value()[0].productName === 'LHD SHORT BODY - 84260N7000') {
    const pl = db.get('productList').value()
    const productName = ['NX4e LHD NON DCU - 84260N7000', 'NX4e LHD DCU - 84260N7100', 'NX4e LHD NON DCU (FIRE) - 84260N7050', 'NX4e LHD HEV - 84260CZ000', 'NX4e LHD PHEV - 84260CZ200',
        'NX4e RHD HEV - 84260CZ900', 'NX4e RHD PHEV - 84260CZ920', 'NX4e RHD NON DCU - 84260N7900', 'NX4e RHD DCU - 84260N7950']
    const newPl = pl.map((v, i) => {
        v.productName = productName[i]
        v.type = (i < 5) ? 'LHD' : 'RHD'
        return v
    })

    db.set('productList', newPl).write()
}*/

export default {
    getDB(name) {
        return db.get(name).value()
    },
    setDB(name, value) {
        db.set(name, value).write()
    },
    pushHistory(name, value) {
        db.get(name).unshift(value).write()
    },
    removeHistory(name) {
        db.set(name, []).write()
    },
    getHistory(name) {
        return db.get(name).take(20).value()
    },
    getHistoryPage(name, page) {
        return db.get(name).slice(page * 5 + 20, page * 5 + 25).value()
    }
}
