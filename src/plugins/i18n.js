import Vue from 'vue'
import VueI18n from 'vue-i18n'
import utils from '@/utils'

Vue.use(VueI18n)

const messages = utils.getDB('message')
const { lang } = utils.getDB('config')


const i18n = new VueI18n({
    locale: lang,
    messages
})

export default i18n
