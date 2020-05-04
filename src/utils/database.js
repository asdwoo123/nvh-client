import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import {range} from 'lodash'

const adapter = new LocalStorage('db')
const db = low(adapter)

const LHD = ['LHD SHORT BODY - 84260N7000', 'LHD SHORT BODY - 84260N7200', 'LHD HEV - 84260CZ000', 'LHD PHEV - 84260CZ200']
    .map(name => ({
        productName: name,
        type: 'LHD',
        lamps: range(22).map(n => ({number: n + 1, left: 0, top: 0, visible: true}))
    }))

const RHD = ['RHD HEV - 84260CZ920', 'RHD PHEV - 84260CZ950', 'RHD SHORT BODY - 84260N7900', 'RHD SHORT BODY - 84260N7910']
    .map(name => ({
        productName: name,
        type: 'RHD',
        lamps: range(20).map(n => ({number: n + 1, left: 0, top: 0, visible: true}))
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

db.defaults({
    productList,
    message,
    config
}).write()

const pl = db.get('productList').value()
pl[0].productName = 'LHD SHORT BODY - 84260N7000'
pl[1].productName = 'LHD SHORT BODY - 84260N7200'
pl[2].productName = 'LHD HEV - 84260CZ000'
pl[3].productName = 'LHD PHEV - 84260CZ200'

db.set('productList', pl).write()

if (db.get('productList').value()[0].lamps.length < 22) db.set('productList', productList).write()
if (db.get('productList').value()[4].lamps.length > 20) db.set('productList', productList).write()

export default {
    getDB(name) {
        return db.get(name).value()
    },
    setDB(name, value) {
        db.set(name, value).write()
    }
}
