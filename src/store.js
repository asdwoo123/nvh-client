import Vue from 'vue'
import Vuex from 'vuex'
import { getDB } from '@/utils'

const productList = getDB('productList')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    product: null
  },
  mutations: {
    setProduct( state , productName) {
      state.product = productList.find(x => x.productName === productName)
    }
  },
  actions: {

  }
})
