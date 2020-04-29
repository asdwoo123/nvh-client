<template>
    <div style="height: 100%;">
        <div class="flex between" style="margin-bottom: 16px;">
            <el-button @click="visible3=true" class="big-big-button" type="info">
                정보
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
                <NumKeyBoard :num="field.alertStopTime" field="alertStopTime" :numClick="handleNumClick"/>
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
                    <el-select v-model="field.lang"
                               style="margin-left: 20px;"
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
                <span style="font-size: 25px;">{{ $t('changePassword') }}</span>
                <el-button @click="visible2=true" class="big-button" type="info" plain>변경</el-button>
            </div>
        </div>
        <!-- 여기서 부터 Dialog -->
        <el-dialog :title="$t('enterPassword')" :visible.sync="visible">
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
                <div class="flex" style="position: relative; width: 720px; margin-bottom: 40px;">
                    <div style="font-size: 25px; margin-right: 44px;">현재 비밀번호</div>
                    <NumKeyBoard :num="field.currentPwd" field="currentPwd" type="password" :numClick="handleNumClick"
                                 width="350" height="60"/>
                </div>
                <div class="flex" style="position: relative; width: 720px;">
                    <div style="font-size: 25px; margin-right: 20px;">변경할 비밀번호</div>
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

    const fs = require('fs')
    const macaddress = require('macaddress')
    const ip = require('ip')

    export default {
        name: "ConfigView",
        components: {NumKeyBoard},
        mounted() {
            this.reset()
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
            field: {
                alertStopTime: '0',
                lang: '',
                password: '',
                currentPwd: '',
                changePwd: ''
            }
        }),
        methods: {
            saveConfig() {
                if (this.field.password === utils.getDB('config').password) {
                    utils.setDB('config', {
                        alertStopTime: this.field.alertStopTime,
                        lang: this.field.lang,
                        password: utils.getDB('config').password
                    })
                    i18n.locale = this.field.lang
                    this.reset()
                    /*this.$message({
                    message: '저장되었습니다',
                    type: 'success'
                })*/
                }
            },
            async importLang() {
                const path = await utils.showOpenDialog()
                if (path.length > 0) {
                    const message = utils.decodeXLSX(path[0])
                    utils.setDB('message', message)
                }
            },
            async exportLang() {
                try {
                    const messages = utils.getDB('message')
                    const path = await utils.showSaveDialog()
                    const buffer = utils.encodeXLSX(messages)
                    fs.writeFile(path, buffer)
                } catch (e) {
                    console.error(e)
                }
            },
            handleNumClick(n, field, type) {
                if (n === '←') {
                    this.field[field] = this.field[field].substr(0, this.field[field].length - 1)
                    if (this.field[field] === '' && type !== 'password') this.field[field] = '0'
                } else if (n !== '' && this.field[field].length < 10) {
                    this.field[field] = (this.field[field] === '0') ? n + '' : this.field[field] + n
                }
            },
            reset() {
                const {alertStopTime, lang} = utils.getDB('config')

                this.field = {
                    alertStopTime,
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
