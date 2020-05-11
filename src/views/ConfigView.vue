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
            <div class="flex between center-v" style="padding: 15px;" v-bind:key="index"
                 v-for="(key, index) in ['alertStopTime', 'cylinderWaitingTime', 'switchWaitingTime']">
                <span style="font-size: 20px;">{{ $t(`${key}`) }}</span>
                <div class="flex" style="align-items: flex-end;">
                    <NumKeyBoard :num="field[key]" :field="key" :numClick="handleNumClick"/>
                    {{ $t('sec') }}
                </div>
            </div>

            <div class="flex between center-v" style="padding: 15px;">
                <span style="font-size: 20px;">{{ $t('usingSwitch') }}</span>
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

            <div class="flex between center-v" style="padding: 15px;">
                <span style="font-size: 20px;">{{ $t('selectLanguage') }}</span>
                <div>
                    <el-button @click="importLang" class="big-button" type="info" plain>
                        {{ $t('langImport') }}
                    </el-button>
                    <el-button @click="exportLang" class="big-button" style="margin-left: 20px;" type="info" plain>{{
                        $t('langExport') }}
                    </el-button>
                    <el-select v-model="field.lang"
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
            <div class="flex between center-v" style="padding: 15px;">
                <span style="font-size: 20px;">{{ $t('changePassword') }}</span>
                <el-button @click="visible2=true" class="big-button" type="info" plain>변경</el-button>
            </div>
        </div>
        <!-- 여기서 부터 Dialog -->
        <el-dialog :title="$t('enterPassword')" :visible.sync="visible" width="600px">
            <div class="flex column center" style="height: 300px;">
                <div class="flex" style="position: relative;">
                    <NumKeyBoard :num="field.password" field="password" type="password" :numClick="handleNumClick"
                                 width="350" height="60"/>
                    <el-button
                            style="width: 150px; height: 60px; font-size: 20px; position: relative; left: 20px;"
                            type="info" @click="saveConfig">
                        OK
                    </el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog :title="$t('enterPassword')" :visible.sync="visible2" width="800px">
            <div class="flex column center" style="height: 350px;">
                <div class="flex" style="position: relative; width: 720px; margin-bottom: 40px; align-items: center;">
                    <div style="font-size: 20px; margin-right: 44px;">{{ $t('currentPassword') }}</div>
                    <NumKeyBoard :num="field.currentPwd" field="currentPwd" type="password" :numClick="handleNumClick"
                                 width="350" height="60"/>
                </div>
                <div class="flex" style="position: relative; width: 720px; align-items: center;">
                    <div style="font-size: 20px; margin-right: 20px;">{{ $t('passwordToChange') }}</div>
                    <NumKeyBoard :num="field.changePwd" field="changePwd" type="password" :numClick="handleNumClick"
                                 width="350" height="60"/>
                    <el-button @click="changePassword"
                               style="width: 150px; height: 60px; font-size: 20px; position: relative; left: 20px;"
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
            field: {
                alertStopTime: utils.getDB('config').alertStopTime || '1',
                cylinderWaitingTime: utils.getDB('config').cylinderWaitingTime || '1',
                switchWaitingTime: utils.getDB('config').switchWaitingTime || '1',
                lang: utils.getDB('config').lang || 'en',
                password: '',
                currentPwd: '',
                changePwd: '',
            }
        }),
        computed: {
            isOnOff() {
                return ['switch1', 'switch2'].map(sw => (this.UsingSwitch.indexOf(sw) !== -1) ? sw + ' on' : sw + ' off')
            }
        },
        methods: {
            saveConfig() {
                if (this.field.password === utils.getDB('config').password) {
                    utils.setDB('config', {
                        alertStopTime: this.field.alertStopTime,
                        cylinderWaitingTime: this.field.cylinderWaitingTime,
                        switchWaitingTime: this.field.switchWaitingTime,
                        UsingSwitch: this.UsingSwitch,
                        lang: this.field.lang,
                        password: utils.getDB('config').password
                    })
                    i18n.locale = this.field.lang
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
                const path = await utils.showSaveDialog()
                const buffer = utils.encodeXLSX(messages)
                fs.writeFile(path, buffer)
            },
            handleNumClick(n, field, type) {

                this.field[field] = this.field[field].toString()
                if (n === '←') {
                    this.field[field] = this.field[field].substr(0, this.field[field].length - 1)
                    if (this.field[field] === '' && type !== 'password') this.field[field] = '0'
                } else if (n !== 'Enter' && n !== '' && this.field[field].length < 10) {
                    this.field[field] = (this.field[field] === '0') ? n + '' : this.field[field] + n
                }
            },
            reset() {
                const {alertStopTime, cylinderWaitingTime, lang, switchWaitingTime} = utils.getDB('config')

                this.field = {
                    alertStopTime,
                    cylinderWaitingTime,
                    switchWaitingTime,
                    lang,
                    password: '',
                    currentPwd: '',
                    changePwd: ''
                }
                this.visible = false
                this.visible2 = false
            },
            changePassword() {
                if (this.field.currentPwd === utils.getDB('config').password) {
                    utils.setDB('config', {
                        ...utils.getDB('config'),
                        password: this.field.changePwd
                    })
                }

                this.field.currentPwd = ''
                this.field.changePwd = ''
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

                i18n.locale = this.field.lang
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
