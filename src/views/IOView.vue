<template>
    <div style="height: 100%;">
        <div class="flex end-h" style="margin-bottom: 10px;">
            <el-button @click="prev" class="big-big-button" type="info" icon="el-icon-arrow-left">{{ $t('previous') }}
            </el-button>
            <el-button @click="next" class="big-big-button" type="info">{{ $t('next') }}
                <i class="el-icon-arrow-right"/>
            </el-button>
        </div>
        <div class="content-card flex column wrap">
            <div style="height: calc(100% / 8 - 10px)" class="flex center-v io-content" v-bind:key="index" v-for="(port, index) in IOBoard">
                <el-button :type="(port.portValue) ? 'success' : 'info'">{{port.portName}}</el-button>
                <span>{{$t(`${port.portName}`)}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    const PerPage = 16

    export default {
        name: "IOView",
        data: () => ({
            page: 1
        }),
        computed: {
            InputMaxPage() {
                const {inputPort} = this.$store.state
                return Math.ceil(inputPort.length / PerPage) + 1
            },
            IOBoard() {
                const {inputPort, outputPort} = this.$store.state
                if (this.page < this.InputMaxPage) {
                    return inputPort.slice((this.page - 1) * PerPage, this.page * PerPage)
                } else {
                    return outputPort.slice((this.page - this.InputMaxPage) * PerPage, (this.page - this.InputMaxPage + 1) * PerPage)
                }
            }
        },
        methods: {
            prev() {
                if (this.page !== 1) this.page -= 1
            },
            next() {
                const {inputPort, outputPort} = this.$store.state
                const maxPage = Math.ceil((inputPort.length + outputPort.length) / PerPage)
                if (this.page !== maxPage) this.page += 1
            }
        }
    }
</script>

<style lang="less" scoped>
    .io-content {
        margin: 5px;

        button {
            margin-right: 12px;
            width: 100px !important;
            height: 50px !important;
            font-size: 25px !important;
            text-align: center !important;
            line-height: 5px !important;
        }

        span {
            font-size: 25px;
        }
    }
</style>
