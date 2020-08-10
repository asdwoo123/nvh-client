<template>
  <div style="height: 100%;">
    <div class="flex between" style="margin-bottom: 16px;">
      <el-button @click="visible3=true" class="big-big-button" type="info">
        {{ $t('information') }}
      </el-button>

      <div>
        <el-button @click="reset" class="big-big-button" type="info">
          {{ $t('reset') }}
        </el-button>
        <el-button @click="visible=true" class="big-big-button" type="info">
          {{ $t('save') }}
        </el-button>
      </div>
    </div>

    <div class="content-card-no-padding">
      <div class="flex between center-v" style="padding: 20px;">
        <span style="font-size: 25px;">{{ $t('alertStopTime') }}</span>
        <div class="flex" style="align-items: flex-end; font-size: 20px;">
          <NumKeyBoard v-model="alertStopTime"/>
          {{ $t('sec') }}
        </div>
      </div>

      <div class="flex between center-v" style="padding: 20px;">
        <span style="font-size: 25px;">{{ $t('cylinderWaitingTime') }}</span>
        <div class="flex" style="align-items: flex-end; font-size: 20px;">
          <NumKeyBoard v-model="cylinderWaitingTime"/>
          {{ $t('sec') }}
        </div>
      </div>

      <div class="flex between center-v" style="padding: 20px;">
        <span style="font-size: 25px;">{{ $t('switchWaitingTime') }}</span>
        <div class="flex" style="align-items: flex-end; font-size: 20px;">
          <NumKeyBoard v-model="switchWaitingTime"/>
          {{ $t('sec') }}
        </div>
      </div>

      <div class="flex between center-v" style="padding: 20px;">
        <span style="font-size: 25px;">{{ $t('usingSwitch') }}</span>
        <div class="flex" style="align-items: flex-end;">
          <el-checkbox-group v-model="UsingSwitch">
            <el-checkbox-button label="switch1" key="switch1">
              {{ isOnOff[0] }}
            </el-checkbox-button>
            <el-checkbox-button label="switch2" key="switch2">
              {{ isOnOff[1] }}
            </el-checkbox-button>
          </el-checkbox-group>
        </div>
      </div>

      <div class="flex between center-v" style="padding: 20px;">
        <span style="font-size: 25px;">{{ $t('selectLanguage') }}</span>
        <div>
          <el-button @click="importLang" class="big-button" type="info" plain>
            {{ $t('langImport') }}
          </el-button>
          <el-button @click="exportLang" class="big-button" style="margin-left: 20px;" type="info" plain>{{
              $t('langExport') }}
          </el-button>
          <el-select v-model="lang"
                     style="margin-left: 20px;"
                     @change="changeLang"
          >
            <el-option
                v-for="option in options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
            />
          </el-select>
        </div>
      </div>
      <div class="flex between center-v" style="padding: 20px;">
        <span style="font-size: 25px;">{{ $t('setProductConfig') }}</span>
        <div>
          <el-button @click="importProductConfig" class="big-button" type="info" plain>
            {{ $t('langImport') }}
          </el-button>
          <el-button @click="exportProductConfig" class="big-button" style="margin-left: 20px;" type="info" plain>{{
              $t('langExport') }}
          </el-button>
        </div>
      </div>
      <div class="flex between center-v" style="padding: 20px;">
        <span style="font-size: 25px;">{{ $t('changePassword') }}</span>
        <el-button @click="visible2=true" class="big-button" type="info" plain>{{ $t('change') }}</el-button>
      </div>
    </div>
    <!-- 여기서 부터 Dialog -->
    <el-dialog :title="$t('enterPassword')" :visible.sync="visible" width="1000px">
      <div class="flex column center" style="height: 300px;">
        <div class="flex" style="position: relative;">
          <NumKeyBoard v-model="password" type="password"
                       width="350" height="60"/>
          <el-button
              style="width: 150px; height: 60px; font-size: 25px; position: relative; left: 20px;"
              type="info" @click="saveConfig">
            OK
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :title="$t('enterPassword')" :visible.sync="visible2" width="1000px">
      <div class="flex column center" style="height: 350px;">
        <div class="flex" style="position: relative; width: 720px; margin-bottom: 40px; align-items: center;">
          <div style="font-size: 20px; margin-right: 44px;">{{ $t('currentPassword') }}</div>
          <NumKeyBoard v-model="currentPwd" type="password"
                       width="350" height="60"/>
        </div>
        <div class="flex" style="position: relative; width: 720px; align-items: center;">
          <div style="font-size: 25px; margin-right: 20px;">{{ $t('passwordToChange') }}</div>
          <NumKeyBoard v-model="changePwd" type="password"
                       width="350" height="60"/>
          <el-button @click="changePassword"
                     style="width: 150px; height: 60px; font-size: 25px; position: relative; left: 20px;"
                     type="info">
            OK
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="visible3">
      <div class="flex column" style="height: 350px;">
        <div class="flex between text-box">
          <div>IP</div>
          <div>{{ ipAddress }}</div>
        </div>

        <div class="flex between text-box">
          <div>MAC</div>
          <div>{{ macAddress }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import NumKeyBoard from "@/components/NumKeyBoard";
import utils from '@/utils'
import i18n from "@/plugins/i18n";
import {writeSetting} from "@/service/mcprotocol";

const fs = require('fs')
const macaddress = require('macaddress')
const ip = require('ip')
const {getCurrentWindow} = require('electron').remote;

export default {
  name: "ConfigView",
  components: {NumKeyBoard},
  mounted() {
    macaddress.one((err, mac) => {
      if (!err) this.macAddress = mac
    })
  },
  data: () => ({
    options: [
      {
        value: 'ko',
        label: '한국어'
      },
      {
        value: 'en',
        label: 'English'
      },
      {
        value: 'pl',
        label: 'Polski'
      }
    ],
    visible: false,
    visible2: false,
    visible3: false,
    ipAddress: ip.address(),
    macAddress: '',
    UsingSwitch: utils.getDB('config').UsingSwitch || ['switch1', 'switch2'],
    alertStopTime: utils.getDB('config').alertStopTime || '1',
    cylinderWaitingTime: utils.getDB('config').cylinderWaitingTime || '1',
    switchWaitingTime: utils.getDB('config').switchWaitingTime || '1',
    lang: utils.getDB('config').lang || 'en',
    password: '',
    currentPwd: '',
    changePwd: ''
  }),
  computed: {
    isOnOff() {
      return ['switch1', 'switch2'].map(sw => (this.UsingSwitch.indexOf(sw) !== -1) ? sw + ' on' : sw + ' off')
    }
  },
  methods: {
    saveConfig() {
      if (this.password === utils.getDB('config').password) {
        utils.setDB('config', {
          alertStopTime: this.alertStopTime,
          cylinderWaitingTime: this.cylinderWaitingTime,
          switchWaitingTime: this.switchWaitingTime,
          UsingSwitch: this.UsingSwitch,
          lang: this.lang,
          password: utils.getDB('config').password
        })
        i18n.locale = this.lang
        this.reset()

        writeSetting()
      }
    },
    async importLang() {
      const path = await utils.showOpenDialog()
      if (path.length > 0) {
        const message = utils.decodeXLSX(path[0])
        utils.setDB('message', message)
        getCurrentWindow().reload()
      }
    },
    async exportLang() {
      const messages = utils.getDB('message')
      const buffer = utils.encodeXLSX(messages)
      const path = await utils.showSaveDialog()
      fs.writeFileSync(path, buffer)
    },
    async importProductConfig() {
      const path = await utils.showOpenDialog()
      if (path.length > 0) {
        const productConfig = utils.decodeXLSX(path[0])
        utils.setDB('productConfig', productConfig)
        getCurrentWindow().reload()
      }
    },
    async exportProductConfig() {
      const productConfig = utils.getDB('productConfig')
      const buffer = utils.encodeXLSX(productConfig, 'myProductConfig')
      const path = await utils.showSaveDialog('/productConfig.xlsx')
      fs.writeFileSync(path, buffer)
    },
    reset() {
      const {alertStopTime, cylinderWaitingTime, lang, switchWaitingTime} = utils.getDB('config')

      this.alertStopTime = alertStopTime
      this.cylinderWaitingTime = cylinderWaitingTime
      this.switchWaitingTime = switchWaitingTime
      this.lang = lang
      this.password = ''
      this.currentPwd = ''
      this.changePwd = ''
      this.visible = false
      this.visible2 = false
    },
    changePassword() {
      if (this.currentPwd === utils.getDB('config').password) {
        utils.setDB('config', {
          ...utils.getDB('config'),
          password: this.changePwd
        })
      }

      this.currentPwd = ''
      this.changePwd = ''
      this.visible2 = false
    },
    changeLang(value) {
      const { alertStopTime, cylinderWaitingTime, switchWaitingTime, UsingSwitch, password } = utils.getDB('config')
      utils.setDB('config', {
        alertStopTime,
        cylinderWaitingTime,
        switchWaitingTime,
        UsingSwitch,
        lang: value,
        password
      })

      i18n.locale = this.lang
    }
  }
}
</script>

<style scoped lang="less">
.text-box {
  margin-bottom: 40px;

  div {
    font-size: 25px;
  }
}
</style>
