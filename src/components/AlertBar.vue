<template>
    <div class="flex center" style="padding: 10px 20px 10px;">
        <el-alert :closable="false" :title="num + $t(`${alert}`)"
                  :type="level" effect="dark" class="alert-bar"/>
    </div>
</template>

<script>
    import utils from '@/utils'

    export default {
        name: "AlertBar",
        data: () => ({
            level: 'error',
            work: false,
            num: ''
        }),
        computed: {
            alert() {
                const {connect, mainAir, product, stop, lhdLeft, lhdRight, rhdLeft, rhdRight, airAlarm, detectionSwitch, workComplete, cylinderErrorCheck, isTargetCount} = this.$store.state
                const {isHoleChecking, isToolDetectChecking} = this.$store.getters
                const switchEnable = utils.getDB('config').UsingSwitch.length === 0

                this.level = 'error'
                this.num = ''
                if (!connect) return 'noPLC'
                else if (!mainAir) return 'noAir'
                else if (stop) return 'pressedStop'
                else if (airAlarm) return 'airAlarm'
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

                    if (!isTargetCount) {
                      return 'targetNotSet'
                    }


                    const errIndex = cylinderErrorCheck.findIndex(v => v === true)

                    if (errIndex !== -1) {
                        this.num = (errIndex + 1).toString()
                        return 'cylinderErrorPosition'
                    } else {
                        this.num = ''
                    }



                    this.level = 'success'
                    if (workComplete) {
                        this.work = false
                        if (switchEnable) return 'startWorkComplete'
                        else return 'workComplete'
                    }

                    if (!workComplete && detectionSwitch.every(v => v) && isToolDetectChecking) {
                        if (!isHoleChecking && !this.work) {
                            this.level = 'error'
                            return 'isHoleCheck'
                        } else {
                            this.work = true
                            return 'working'
                        }
                    }

                    if (switchEnable) return 'startNoProductDetection'
                    else {
                        this.work = false
                        return 'noProductDetection'
                    }
                }

                return ''
            }
        }
    }
</script>

<style scoped lang="less">
    .alert-bar {
        height: 65px;
        width: 100%;

        @media screen and (max-width: 800px) {
            height: 50px !important;
        }
    }
</style>
