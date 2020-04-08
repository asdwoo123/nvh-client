<template>
    <div style="height: 100%;">
        <div class="flex end-h" style="margin-bottom: 16px;">
            <el-button @click="prev" class="big-big-button" type="info" icon="el-icon-arrow-left">{{ $t('previous') }}</el-button>
            <el-button @click="next" class="big-big-button" type="info">{{ $t('next') }}
                <i class="el-icon-arrow-right"/>
            </el-button>
        </div>
        <div class="content-card flex column wrap">

                <div class="flex center-v io-content" v-bind:key="port" v-for="port in IOItems">
                    <el-button type="success">{{port}}</el-button>
                    <span>{{$t(`${port}`)}}</span>
                </div>

        </div>
    </div>
</template>

<script>
    import { InputBoard, OutputBoard } from '@/config'

    export default {
        name: "IOView",
        data: () => ({
            page: 1
        }),
        computed: {
            IOItems() {
                const InputMaxPage = Math.ceil(InputBoard().length / 27) + 1
                if (this.page < InputMaxPage) {
                    return InputBoard().slice((this.page - 1) * 27, (this.page) * 27)
                } else {
                    return OutputBoard().slice((this.page - InputMaxPage) * 27, (this.page - InputMaxPage + 1) * 27)
                }
            }
        },
        methods: {
            prev() {
                if (this.page !== 1) this.page -= 1
            },
            next() {
                const maxPage = Math.ceil((InputBoard().length + OutputBoard().length) / 27)
                if (this.page !== maxPage) this.page += 1
            }
        }
    }
</script>

<style lang="less" scoped>
    .io-content {
        margin: 16px;
        button {
            margin-right: 13px;
        }
    }
</style>
