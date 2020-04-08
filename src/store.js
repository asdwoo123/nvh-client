import Vue from 'vue'
import Vuex from 'vuex'
import utils from '@/utils'


const productList = utils.getDB('productList')

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
