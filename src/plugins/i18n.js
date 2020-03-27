import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { getDB } from '@/utils'

Vue.use(VueI18n)

const messages = getDB('message')
const { lang } = getDB('config')


const i18n = new VueI18n({
    locale: lang,
    messages
})

export default i18n
