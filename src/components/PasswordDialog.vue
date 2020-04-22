<template>
    <el-dialog :title="$t('enterPassword')" :visible="visible"  width="700">
        <div class="flex column center" style="height: 300px;">
            <div class="flex" style="position: relative;">
                <NumKeyBoard :num="field.password" field="password" type="password" :numClick="handleNumClick"
                             width="350" height="60"/>
                <el-button
                        style="width: 150px; height: 60px; font-size: 20px; position: relative; left: 20px;"
                        type="info" @click="handleConfirm">
                    OK
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import NumKeyBoard from "@/components/NumKeyBoard";
    import utils from '@/utils'

    export default {
        name: "PasswordDialog",
        components: {NumKeyBoard},
        props: ['visible', 'ok'],
        data: () => ({
            field: {
                password: ''
            }
        }),
        methods: {
            handleNumClick(n, field, type) {
                if (n === '←') {
                    this.field[field] = this.field[field].substr(0, this.field[field].length - 1)
                    if (this.field[field] === '' && type !== 'password') this.field[field] = '0'
                } else if (n !== '' && this.field[field].length < 10) {
                    this.field[field] = (this.field[field] === '0') ? n + '' : this.field[field] + n
                }
            },
            handleConfirm() {
                if (this.field.password === utils.getDB('config').password) {
                    this.field.password = ''
                    this.ok()
                }
            }
        }
    }
</script>

<style scoped>

</style>
