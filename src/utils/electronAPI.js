const {dialog} = require('electron').remote

export default {
    showOpenDialog() {
        return new Promise(((resolve) => {
            dialog.showOpenDialog(null, null, (path) => resolve(path))
        }))
    },
    showSaveDialog() {
        return new Promise(((resolve) => {
            dialog.showSaveDialog(null, {defaultPath: '/language.xlsx'}, (path) => resolve(path))
        }))
    }
}
