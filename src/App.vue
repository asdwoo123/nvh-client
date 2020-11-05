<template>
  <div id="app">
    <div class="header">
      <div class="flex end-v">
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
          <el-menu-item v-bind:key="route.name" v-for="route in routes" :index="route.path">
            {{ $t(`${route.name}`) }}
          </el-menu-item>
        </el-menu>
      </div>
      <div v-if="product" class="product-title">
                <span>
                {{ productName }}
                </span>
      </div>
      <div class="flex center" style="margin: 10px 0;">
        <div class="time-view">{{ currentTime }}</div>
        <img class="logo" src="./assets/biglogo.jpg" alt="logo">
      </div>
    </div>
    <div class="content">
      <router-view/>
    </div>
    <AlertBar/>
    <el-dialog :title="$t('emergencyStop')" :visible.sync="visible"
               width="700px" :close-on-click-modal="false" :show-close="false">
      <div class="flex center" style="height: 300px;">
        <el-button type="info" style="width: 150px; height: 70px; font-size: 25px;" @click="safetyReset">
          {{ $t('reset') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('inCompleteWork')" :visible.sync="visible2"
               width="700px" :close-on-click-modal="false" :show-close="false">
      <div class="flex center" style="height: 300px;">
        <div class="flex">
          <NumKeyBoard v-model="password" type="password" width="350" height="60"/>
          <el-button type="info" style="width: 150px; height: 60px; font-size: 25px;" @click="inCompleteAlarmReset">
            {{ $t('reset') }}
          </el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import router from "@/router"
import utils from '@/utils'
import moment from "moment"
import {manualOn, manualOff, yellowOn, stopRelease, inCompleteReset} from '@/service/mcprotocol'
import {routes} from '@/config/index2'
import AlertBar from "@/components/AlertBar";
import NumKeyBoard from "@/components/NumKeyBoard";

const fs = require('fs')
const path = require('path')
const {remote} = require('electron');
const {app} = remote;

const productList = utils.getDB('productList')

utils.getHistory('uph')

export default {
  name: 'app',
  components: {AlertBar, NumKeyBoard},
  router,
  data: () => ({
    activeIndex: '/auto',
    routes: routes().slice(1),
    password: '',
    productNames: Object.values(utils.getDB('productConfig').productNames) || []
  }),
  computed: {
    product() {
      return this.$store.state.product
    },
    visible() {
      return this.$store.state.stop
    },
    visible2() {
      return this.$store.state.incompleteWork
      /*if ((utils.getDB('config').alarmReset) ? (utils.getDB('config').alarmReset === 'Enable') : true) {
        return this.$store.state.incompleteWork
      } else {
        return false
      }*/
    },
    currentTime() {
      return moment(this.$store.clock).format('L LT')
    },
    productName() {
      const productIndex = productList.indexOf(productList.find(v => v.productName === this.product.productName))
      if (this.productNames.length > productIndex) {
        return this.productNames[productIndex]
      } else {
        return ''
      }
    }
  },
  methods: {
    handleSelect(key) {
      this.$router.push(key).then(() => {
        if (key === '/manual') {
          manualOn()
        }

        if (key === '/auto') {
          manualOff()
        }

        if (key !== '/auto') {
          yellowOn()
        }

      }).catch(error => {
        if (error.name !== "NavigationDuplicated") {
          throw error
        }
      })
    },
    safetyReset() {
      stopRelease()
    },
    inCompleteAlarmReset() {
      if ((utils.getDB('config').alarmResetPassword) ? utils.getDB('config').alarmResetPassword === this.password : '2020' === this.password) {
        this.password = ''
        inCompleteReset()
      }
    }
  },
  mounted() {
    fs.writeFileSync(path.join(app.getAppPath(), 'productList.json'), JSON.stringify({productList}), 'utf8')

    const ct = utils.getDB('ct')
    fs.writeFileSync(path.join(app.getAppPath(), 'ct.json'), JSON.stringify({ct}), 'utf8')

    setInterval(() => {
      if (this.$store.state.stop) {
        this.visible = true
      }
    }, 1000)

    setTimeout(() => {
      const path = this.$route.path
      this.activeIndex = (path === '/') ? '/auto' : path
    }, 500)
  }
}
</script>

<style lang="less">
@border-color: #d2d2d2;
@background-color: #eff3f6;

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  background: @background-color;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  height: 80px;
  padding: 0 15px;
  background-color: #ffffff;
  border-bottom: 1px solid @border-color;

  @media screen and (max-width: 800px) {
    height: 50px;
    padding: 0 15px;
  }


  .el-menu-item {
    font-size: 25px !important;
    height: 70px !important;
    padding: 0 13px;


    @media screen and (max-width: 800px) {
      font-size: 12px !important;
      height: 40px !important;
      padding: 0 10px !important;
    }
  }
}

.content {
  padding: 15px 15px 0;
  height: calc(100% - 181px);

  @media screen and (max-width: 800px) {
    padding: 10px;

    height: calc(100% - 61px);
  }
}

.card {
  background: #ffffff;
  border: 1px solid #d2d2d2;
  padding: 20px;
}

.card::-webkit-scrollbar {
  display: none;
}

.content-card {
  background: #ffffff;
  border: 1px solid #d2d2d2;
  width: calc(100% - 40px);
  height: calc(100% - 104px);
  padding: 15px;
}

.content-card-no-padding {
  background: #ffffff;
  border: 1px solid #d2d2d2;
  width: 100%;
  height: calc(100% - 76px);
}

.el-alert__content {
  width: 100%;
}

.el-alert__title {
  font-size: 30px !important;
  text-align: center;
}

.el-dialog__title {
  font-size: 30px !important;
}

.moveable-line {
  background: none !important;
}

.el-select-dropdown__item {
  height: 60px !important;
  line-height: 60px !important;
  font-size: 25px !important;
}

.el-input__inner {
  height: 60px !important;
  font-size: 25px !important;
}

.big-button {
  width: 150px !important;
  height: 50px !important;
  font-size: 25px !important;
  text-align: center !important;

  @media screen and (max-width: 800px) {
    width: 48px !important;
    height: 24px !important;
    font-size: 8px !important;
  }
}

.big-big-button {
  width: 180px !important;
  height: 60px !important;
  font-size: 25px !important;

  @media screen and (max-width: 800px) {
    width: 72px !important;
    height: 24px !important;
    font-size: 8px !important;
  }
}

.time-view {
  font-size: 25px;
  margin-top: 5px;
  margin-right: 15px;

  @media screen and (max-width: 800px) {
    font-size: 15px;
    margin-right: 15px;
  }
}

.logo {
  height: 70px;

  @media screen and (max-width: 800px) {
    height: 30px;
  }
}

.product-title {
  font-size: 25px;
  display: flex;
  align-items: flex-end;
  margin-bottom: 30px;
  justify-self: center;
  @media screen and (max-width: 800px) {
    font-size: 15px;
    margin-bottom: 8px;
  }
}


.el-checkbox-button__inner {
  width: 150px;
  height: 50px;
  font-size: 25px !important;
}

.el-radio-button__inner {
  width: 150px;
  height: 50px;
  font-size: 25px !important;
}
</style>

