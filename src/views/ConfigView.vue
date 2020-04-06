<template>
    <div style="height: 100%;">
        <div class="flex end-h" style="margin-bottom: 16px;">
            <el-button class="big-button" type="info">
                {{ $t('message.reset') }}
            </el-button>
            <el-button @click="save" class="big-button" type="info">
                {{ $t('message.save') }}
            </el-button>
        </div>

        <div class="content-card-no-padding">
            <div class="flex between center-v" style="padding: 20px;">
                <span style="font-size: 25px;">{{ $t('message.alertStopTime') }}</span>
                <NumKeyBoard :num="field.num" field="num" :numClick="handleNumClick"/>
            </div>

            <div class="flex between center-v" style="padding: 20px;">
                <span style="font-size: 25px;">{{ $t('message.selectLanguage') }}</span>
                <div>
                    <el-button @click="importLang" class="big-button" type="info" plain>{{ $t('message.langImport')
                        }}
                    </el-button>
                    <el-button @click="exportLang" class="big-button" style="margin-left: 20px;" type="info" plain>{{
                        $t('message.langExport') }}
                    </el-button>
                    <el-select v-model="lang"
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
                <span style="font-size: 25px;">비밀번호 변경</span>
                <el-button class="big-button" type="info" plain>변경</el-button>
            </div>
        </div>
        <!-- 여기서 부터 Dialog -->
        <el-dialog title="비밀번호를 입력해 주세요" :visible.sync="visible">
            <div class="flex column center" style="height: 300px;">
                <div class="flex" style="position: relative;">
                    <NumKeyBoard :num="field.password" field="password" type="password" :numClick="handleNumClick"
                                 width="350" height="60"/>
                    <el-button style="width: 150px; height: 60px; font-size: 20px; position: relative; left: 20px;" type="info">OK</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {showOpenDialog, showSaveDialog} from '@/utils'
    import NumKeyBoard from "@/components/NumKeyBoard";
    import {getDB} from '@/utils'

    export default {
        name: "ConfigView",
        components: {NumKeyBoard},
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
            lang: 'ko',
            visible: false,
            visible2: false,
            field: {
                password: '',
                num: '0'
            }
        }),
        methods: {
            save() {
                this.visible = true
                /*this.$message({
                    message: '저장되었습니다',
                    type: 'success'
                })*/
            },
            async importLang() {
                const path = await showOpenDialog()
                console.log(path)
            },
            async exportLang() {
                let columns = {}
                const path = await showSaveDialog()
                const messages = getDB('message')
                const keys = Object.keys(messages)
            },
            handleNumClick(n, field) {
                if (n === '←') {
                    this.field[field] = this.field[field].substr(0, this.field[field].length - 1)
                    if (this.field[field] === '') this.field[field] = '0'
                } else if (n !== '' && this.field[field].length < 10) {
                    this.field[field] = (this.field[field] === '0') ? n + '' : this.field[field] + n
                }
            }
        }
    }
</script>

<style scoped>

</style>
