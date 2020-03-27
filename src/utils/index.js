import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'

const {dialog} = require('electron').remote

const adapter = new LocalStorage('db')
const db = low(adapter)

const productList = [
    {
        productName: 'LHD HEV - 84260CZ000',
        lamps: [
            {
                number: 1,
                left: 46,
                top: 379
            },
            {
                number: 2,
                left: 455,
                top: 501
            },
            {
                number: 3,
                left: 110,
                top: 561
            },
            {
                number: 4,
                left: 392,
                top: 219
            },
            {
                number: 5,
                left: 20,
                top: 442
            }
        ]
    },
    {
        productName: 'LHD PHEV - 84260CZ200'
    },
    {
        productName: 'LHD SHORT BODY - 84260N7000'
    },
    {
        productName: 'LHD SHORT BODY - 84260N7200'
    },
    {
        productName: 'RHD HEV - 84260CZ920'
    },
    {
        productName: 'RHD PHEV - 84260CZ950'
    },
    {
        productName: 'RHD SHORT BODY - 84260N7900'
    },
    {
        productName: 'RHD SHORT BODY - 84260N7910'
    }
]

const message = {
    ko: {
        message: {
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
        }
    },
    en: {
        message: {
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
        }
    },
    pl: {
        message: {
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
}

const config = {
    alertStopTime: 0,
    lang: 'ko',
    password: '123'
}

db.defaults({
    productList,
    message,
    config
}).write()

db.set('message', message).write()
db.set('config', config).write()

export const setDB = (name, value) => {
    db.set(name, value).write()
}

export const getDB = (name) => {
    return db.get(name).value()
}

export const showOpenDialog = () => {
    return new Promise(((resolve) => {
        dialog.showOpenDialog(null, null, (path) => resolve(path))
    }))
}

export const showSaveDialog = () => {
    return new Promise(((resolve) => {
        dialog.showSaveDialog(null, {defaultPath: '/language.csv'}, (path) => resolve(path))
    }))
}
