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
      <div class="flex between center-v configList">
        <span style="font-size: 25px;">{{ $t('alertStopTime') }}</span>
        <div class="flex" style="align-items: flex-end; font-size: 20px;">
          <NumKeyBoard v-model="alertStopTime"/>
          {{ $t('sec') }}
        </div>
      </div>

      <div class="flex between center-v configList">
        <span style="font-size: 25px;">{{ $t('cylinderWaitingTime') }}</span>
        <div class="flex" style="align-items: flex-end; font-size: 20px;">
          <NumKeyBoard v-model="cylinderWaitingTime"/>
          {{ $t('sec') }}
        </div>
      </div>

      <div class="flex between center-v configList">
        <span style="font-size: 25px;">{{ $t('switchWaitingTime') }}</span>
        <div class="flex" style="align-items: flex-end; font-size: 20px;">
          <NumKeyBoard v-model="switchWaitingTime"/>
          {{ $t('sec') }}
        </div>
      </div>

      <div class="flex between center-v configList">
        <span style="font-size: 25px;">{{ $t('toolCount') }}</span>
        <div class="flex" style="align-items: flex-end; font-size: 20px;">
          <NumKeyBoard v-model="toolCount"/>
          {{ $t('cnt') }}
        </div>
      </div>

      <!--<div class="flex between center-v configList">
        <span>
          {{ $t('alarmReset') }}
        </span>
        <div>
          <el-radio-group v-model="alarmReset">
            <el-radio-button label="Enable" />
            <el-radio-button label="Disable" />
          </el-radio-group>
        </div>
      </div>-->
      <div class="flex between center-v configList">
        <span style="font-size: 25px;">{{ $t('UsingToolSensor') }}</span>
        <div class="flex" style="align-items: flex-end;">
          <el-radio-group v-model="UsingToolSensor">
            <el-radio-button label="Enable"></el-radio-button>
            <el-radio-button label="Disable"></el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="flex between center-v configList">
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

      <div class="flex between center-v configList">
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
      <div class="flex between center-v configList">
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
      <div class="flex between center-v configList">
        <span style="font-size: 25px;">{{ $t('ctData') }}</span>
        <div>
          <el-button @click="exportCTData" class="big-button" style="margin-left: 20px;" type="info" plain>{{
              $t('Export') }}
          </el-button>
        </div>
      </div>

      <div class="flex between center-v" style="padding: 10px;">
        <span style="font-size: 25px;">{{ $t('changePassword') }}</span>
        <el-button @click="visible2=true" class="big-button" type="info" plain>{{ $t('change') }}</el-button>
      </div>

      <div class="flex between center-v" style="padding: 10px;">
        <span style="font-size: 25px;">{{ $t('alarmResetChangePassword') }}</span>
        <el-button @click="visible4=true" class="big-button" type="info" plain>{{ $t('change') }}</el-button>
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

    <el-dialog :title="$t('enterPassword')" :visible.sync="visible4" width="1000px">
      <div class="flex column center" style="height: 350px;">
        <div class="flex" style="position: relative; width: 720px; margin-bottom: 40px; align-items: center;">
          <div style="font-size: 20px; margin-right: 44px;">{{ $t('currentPassword') }}</div>
          <NumKeyBoard v-model="currentPwd2" type="password"
                       width="350" height="60"/>
        </div>
        <div class="flex" style="position: relative; width: 720px; align-items: center;">
          <div style="font-size: 25px; margin-right: 20px;">{{ $t('passwordToChange') }}</div>
          <NumKeyBoard v-model="changePwd2" type="password"
                       width="350" height="60"/>
          <el-button @click="changePassword2"
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
    visible4: false,
    ipAddress: ip.address(),
    macAddress: '',
    UsingSwitch: utils.getDB('config').UsingSwitch || ['switch1', 'switch2'],
    alertStopTime: utils.getDB('config').alertStopTime || '1',
    cylinderWaitingTime: utils.getDB('config').cylinderWaitingTime || '1',
    alarmReset: utils.getDB('config').alarmReset || 'Enable',
    switchWaitingTime: utils.getDB('config').switchWaitingTime || '1',
    lang: utils.getDB('config').lang || 'en',
    toolCount: utils.getDB('config').toolCount || '5',
    UsingToolSensor: utils.getDB('config').UsingToolSensor || 'Disable',
    password: '',
    currentPwd: '',
    changePwd: '',
    password2: '',
    currentPwd2: '',
    changePwd2: ''
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
          alarmReset: this.alarmReset,
          UsingSwitch: this.UsingSwitch,
          toolCount: this.toolCount,
          UsingToolSensor: this.UsingToolSensor,
          lang: this.lang,
          password: utils.getDB('config').password,
          alarmResetPassword: utils.getDB('config').alarmResetPassword || '2020',
          target: utils.getDB('config').target || 0
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
    async exportCTData() {
      const ctData = utils.getDB('ct')
      const buffer = utils.encodeXLSX(ctData, 'myCTData')
      const path = await utils.showSaveDialog('/ctData.xlsx')
      fs.writeFileSync(path, buffer)
    },
    reset() {
      const {alertStopTime, cylinderWaitingTime, lang, switchWaitingTime, alarmReset, toolCount, UsingToolSensor} = utils.getDB('config')

      this.alertStopTime = alertStopTime
      this.cylinderWaitingTime = cylinderWaitingTime
      this.switchWaitingTime = switchWaitingTime
      this.toolCount = toolCount || '5'
      this.UsingToolSensor = UsingToolSensor || 'Disable'
      this.alarmReset = alarmReset || true
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

        this.currentPwd = ''
        this.changePwd = ''
        this.visible2 = false
      }

    },
    changePassword2() {
      if ((utils.getDB('config').alarmResetPassword) ? utils.getDB('config').alarmResetPassword === this.currentPwd2 : '2020' === this.currentPwd2) {
        utils.setDB('config', {
          ...utils.getDB('config'),
          alarmResetPassword: this.changePwd2
        })

        this.currentPwd2 = ''
        this.changePwd2 = ''
        this.visible4 = false
      }
    },
    changeLang(value) {
      const { alertStopTime, cylinderWaitingTime, switchWaitingTime, UsingSwitch, password, target, alarmReset, alarmResetPassword, toolCount, UsingToolSensor } = utils.getDB('config')
      utils.setDB('config', {
        alertStopTime,
        cylinderWaitingTime,
        alarmReset: alarmReset || 'Enable',
        alarmResetPassword: alarmResetPassword || '2020',
        toolCount: toolCount || 5,
        UsingToolSensor: UsingToolSensor || 'Disable',
        switchWaitingTime,
        UsingSwitch,
        lang: value,
        password,
        target: target || 0
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

.configList {
  padding: 10px;

  span {
    font-size: 25px;
  }

  div {
    display: flex;
    align-items: flex-end;
    font-size: 20px;
  }
}
</style>
