<template>
    <div class="flex center" style="padding: 20px;">
        <el-alert :closable="false" :title="$t(`${alert}`)"
                  :type="level" effect="dark" class="alert-bar"/>
    </div>
</template>

<script>
    import utils from '@/utils'

    export default {
        name: "AlertBar",
        data: () => ({
           level: 'error'
        }),
        computed: {
            alert() {
                const { connect, mainAir, product, stop, lhdLeft, lhdRight, rhdLeft, rhdRight, airAlarm, detectionSwitch, workComplete } = this.$store.state
                const switchEnable = utils.getDB('config').UsingSwitch.length === 0

                this.level = 'error'
                if (!connect) return 'noPLC'
                else if (!mainAir) return 'noAir'
                else if (airAlarm) return 'airAlarm'
                else if (stop) return 'pressedStop'
                else if (!product) return 'noProduct'
                if (product) {
                    const type = product.type
                    if (type === 'LHD') {
                        if (!lhdLeft) return 'leftNotLHD'
                        if (!lhdRight) return 'rightNotLHD'
                    } else if (type === 'RHD') {
                        if (!rhdLeft) return 'leftNotRHD'
                        if (!rhdRight) return 'rightNotRHD'
                    }

                    this.level = 'success'
                    if (workComplete) {
                        if (switchEnable) return 'startWorkComplete'
                        else return 'workComplete'
                    }
                    if (!workComplete && detectionSwitch.every(v => v)) return 'working'

                    if (switchEnable) return 'startNoProductDetection'
                    else return 'noProductDetection'
                }

                return ''
            }
        }
    }
</script>

<style scoped lang="less">
    .alert-bar {
        height: 75px;
        width: 100%;

        @media screen and (max-width: 800px) {
            height: 50px !important;
        }
    }
</style>
