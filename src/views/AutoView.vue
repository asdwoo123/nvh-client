<template>
    <div class="h100 flex column center-v around" style="position: relative;">
        <div class="flex" style="width: 100%; position: absolute; top: 0; justify-content: center;">
            <el-button class="select-btn" @click="visible3 = true" type="info">
                {{ $t('selectModel') }}
            </el-button>
            <div class="flex">
                <div class="data-card" style="margin-right: 20px;">
                    <div>
                        {{ $t('cycleTime') }}
                    </div>
                    <div>
                        <span style="font-weight: bold; font-size: 20px;">{{(cycleTime / 20).toFixed(1) }}</span> {{
                        $t('sec') }}
                    </div>
                </div>

                <div class="flex">
                    <div class="data-card" style="border-right: none;">
                        <div>
                            {{ $t('total') }}
                        </div>
                        <div>
                            <span style="font-weight: bold; font-size: 20px;">{{ total }}</span> {{ $t('count') }}
                        </div>
                    </div>
                    <el-button @click="totalReset" style="border-radius: 0;" type="info" plain>Reset</el-button>
                </div>
            </div>
            <div style="position: absolute; top: 0; right: 0;">
                <el-button :type="(air) ? 'success' : 'info'" @click="mainAirOnOff"
                           style="width: 170px; height: 50px; font-size: 14px;">
                    {{ $t('mainAir') }}
                </el-button>
            </div>
            <div v-if="product" style="position: absolute; top: 70px; right: 0;">
                <el-button v-if="!moveable.draggable"
                           class="move-btn"
                           :disabled="lampDisable"
                           @click="moveable.draggable = true" type="info">
                    {{ $t('changePosition') }}
                </el-button>
                <template v-else>
                    <el-button class="move-btn" style="z-index: 10"
                               @click="visible2=true" type="info">
                        {{ $t('positionSave') }}
                    </el-button>
                    <el-button class="move-btn"
                               @click="positionCancel" type="info">
                        {{ $t('cancel') }}
                    </el-button>
                </template>
                <el-button v-if="!lampDisable"
                           class="move-btn"
                           @click="lampDisable = true" type="info">
                    {{ $t('lamp') }} on/off
                </el-button>
                <template v-else>
                    <el-button class="move-btn" style="top: 70px;"
                               @click="visible2=true" type="info">
                        {{ $t('configSave') }}
                    </el-button>
                    <el-button class="move-btn" style="top: 140px;"
                               @click="lampDisableCancle" type="info">
                        {{ $t('cancel') }}
                    </el-button>
                </template>
            </div>

        </div>
        <div class="productView">
            <template v-if="lamps">
                <Moveable v-bind="moveable" @drag="handleDrag" v-bind:key="index"
                          style="z-index: 1; position: absolute;"
                          v-if="index !== 12"
                          v-for="(lamp, index) in lamps"
                          v-bind:style="{ top: lamp.top + 'px', left: lamp.left + 'px' }">
                    <el-button circle v-if="lampDisableCheck(lamp)" :type="lampTypeCheck(lampCheck[index], lamp)"
                               style="width: 40px;
            height: 40px; font-size: 15px;"
                               @click="toggleDisable(index)">
                        <span v-if="index < 12">{{ lamp.number }}</span>
                        <span v-else>{{ lamp.number - 1 }}</span>
                    </el-button>
                    <div :id="'l' + index"/>
                </Moveable>
                <Moveable v-bind="moveable" @drag="handleDrag2" v-bind:key="index"
                          style="z-index: 1; position: absolute;"
                          v-for="(sw, index) in detectionSwitches"
                          v-bind:style="{ top: sw.top + 'px', left: sw.left + 'px' }">
                    <el-button style="width: 40px;
            height: 40px; font-size: 15px; display: flex; justify-content: center;"
                               :type="(switchCheck[index]) ? 'success' : 'danger'"
                    >
                        {{ index + 1 }}
                    </el-button>
                    <div :id="'l' + index"/>
                </Moveable>
            </template>
            <img v-if="product" style="width: 100%;"
                 :src='"../assets/model/" + product.productName + ".png"' alt="product-img">

        </div>
        <el-dialog :visible.sync="visible" top="4vh">
            <el-button style="width: 100%; height: 50px; margin: 0 0 16px 0; font-size: 20px;" type="primary"
                       v-bind:key="index" @click="setProduct(productName, index)"
                       v-for="({productName}, index) in productList" plain>
                {{ productName }}
                <span v-if="product" style="float: right;">
                        <i v-if="product.productName === productName" class="el-icon-check"/>
                    </span>
            </el-button>
        </el-dialog>

        <el-dialog :title="$t('enterPassword')" :visible.sync="visible2" width="600px">
            <div class="flex column center" style="height: 300px;">
                <div class="flex" style="position: relative;">
                    <NumKeyBoard v-model="password" type="password"
                                 width="350" height="60"/>
                    <el-button
                            style="width: 150px; height: 60px; font-size: 20px; position: relative; left: 20px;"
                            type="info" @click="positionSave">
                        OK
                    </el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog :title="$t('enterPassword')" :visible.sync="visible3" width="600px">
            <div class="flex column center" style="height: 300px;">
                <div class="flex" style="position: relative;">
                    <NumKeyBoard v-model="password" type="password"
                                 width="350" height="60"/>
                    <el-button
                            style="width: 150px; height: 60px; font-size: 20px; position: relative; left: 20px;"
                            type="info" @click="showModeChange">
                        OK
                    </el-button>
                </div>
            </div>
        </el-dialog>

        <el-button v-if="product && switchEnable" class="start-btn" @click="workStart" type="success">
            {{ $t('start') }}
        </el-button>
    </div>
</template>

<script>
    import Moveable from 'vue-moveable';
    import utils from '@/utils'
    import NumKeyBoard from "@/components/NumKeyBoard";
    import {
        changeMode,
        mainAirOn,
        mainAirOff,
        reset,
        complete,
        deComplete,
        selectModeOn,
        selectModeOff,
        start
    } from '@/service/mcprotocol'
    import {cloneDeep} from 'lodash'


    export default {
        name: "AutoView",
        data: () => ({
            moveable: {
                draggable: false
            },
            lampDisable: false,
            productList: cloneDeep(utils.getDB('productList')),
            visible: false,
            visible2: false,
            visible3: false,
            selectState: false,
            password: '',
            switchEnable: utils.getDB('config').UsingSwitch.length === 0
        }),
        components: {
            NumKeyBoard,
            Moveable,
        },
        mounted() {
            let visibleState = false

            setInterval(() => {
                if (!this.visible && this.selectState) {

                    this.selectState = false
                    selectModeOff()
                }
            }, 1000)


            setInterval(() => {
                if (!this.product) return;
                const arr = []
                this.product.lamps.filter((x, i) => i !== 12).filter(x => !x.disable).forEach(lams => {
                    const index = this.product.lamps.indexOf(lams)
                    arr.push(this.getLampCheck()[index])
                })

                if (!visibleState && arr.every(v => v) && arr.length > 0 && this.$store.state.detectionSwitch.every(v => v)) {
                    visibleState = true
                    this.$store.state.workComplete = true
                    complete()
                } else if (visibleState && !this.$store.state.detectionSwitch.every(v => v)) {
                    visibleState = false
                    this.$store.state.workComplete = false
                    deComplete()
                }
            }, 1500)
        },
        computed: {
            product() {
                return this.$store.state.product
            },
            lamps() {
                if (!this.product) return
                return this.product.lamps
            },
            lampCheck() {
                if (this.product) {
                    const type = this.product.type
                    if (type === 'LHD') return this.$store.state.lhdSwitch
                    else return this.$store.state.rhdSwitch
                } else {
                    return []
                }
            },
            air() {
                return this.$store.state.mainAir
            },
            cycleTime() {
                return this.$store.state.cycleTime
            },
            total() {
                return this.$store.state.total
            },
            detectionSwitches() {
                if (!this.product) return
                return this.product.detectionSwitches
            },
            switchCheck() {
                return this.$store.state.detectionSwitch
            }
        },
        methods: {
            positionSave() {
                if (this.password === utils.getDB('config').password) {
                    const productName = this.product.productName

                    this.productList = this.productList.map(product => {
                        if (product.productName === productName) {
                            product.lamps = [...this.product.lamps]
                            product.detectionSwitches = [...this.product.detectionSwitches]
                        }
                        return product
                    })

                    utils.setDB('productList', this.productList)

                    this.lampReset()

                    this.moveable.draggable = false
                    this.lampDisable = false
                    this.visible2 = false
                }
                this.password = ''
            },
            positionCancel() {
                this.lampReset()
                this.moveable.draggable = false
            },
            lampDisableCancle() {
                this.lampReset()
                this.lampDisable = false
            },
            showModeChange() {
                if (this.password === utils.getDB('config').password) {
                    this.visible3 = false
                    this.visible = true

                    selectModeOn()
                    this.selectState = true
                }
                this.password = ''
            },
            handleDrag({target, left, top}) {
                let id = target.children[1].id
                id = id.substr(1)
                id = parseInt(id)
                const lamp = this.product.lamps[id]
                lamp.left = left
                lamp.top = top
            },
            handleDrag2({target, left, top}) {
                let id = target.children[1].id
                id = id.substr(1)
                id = parseInt(id)
                const sw = this.product.detectionSwitches[id]
                sw.left = left
                sw.top = top
            },
            setProduct(productName, index) {
                this.$store.commit('setProduct', productName)
                this.visible = false
                changeMode(index)
            },
            mainAirOnOff() {
                if (this.air) {
                    mainAirOff()
                } else {
                    mainAirOn()
                }
            },
            lampDisableCheck(lamp) {
                if (this.lampDisable) {
                    return true
                } else {
                    return (!lamp.disable)
                }
            },
            toggleDisable(index) {
                if (this.lampDisable) {
                    const lamp = this.product.lamps[index]
                    lamp.disable = !lamp.disable;

                    this.$forceUpdate();
                }
            },
            lampTypeCheck(check, lamp) {
                if (lamp.disable) {
                    return 'info'
                } else {
                    if (check) {
                        return 'success'
                    } else {
                        return 'danger'
                    }
                }
            },
            totalReset() {
                reset()
            },
            lampReset() {
                this.product.lamps = cloneDeep(this.productList.find(v => v.productName === this.product.productName).lamps)
                this.product.detectionSwitches = cloneDeep(this.productList.find(v => v.productName === this.product.productName).detectionSwitches)
            },
            workStart() {
                start()
            },
            getLampCheck() {
                if (this.product) {
                    const type = this.product.type
                    if (type === 'LHD') return this.$store.state.lhdSwitch
                    else return this.$store.state.rhdSwitch
                } else {
                    return []
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .productView {
        width: 570px;
        height: 670px;
        position: absolute;
        top: 82px;

        @media screen and (max-width: 1300px) {
            width: 400px !important;
            height: 490px !important;
        }
    }


    .move-btn {
        width: 170px !important;
        height: 50px !important;
        font-size: 14px;
        position: absolute;
        top: 0;
        right: 0;

        @media screen and (max-width: 800px) {
            width: 170px !important;
            height: 50px !important;
            font-size: 15px;
        }
    }

    .move-btn:nth-child(2) {
        top: 70px;
        @media screen and (max-width: 800px) {
            top: 70px;
        }
    }


    .select-btn {
        position: absolute;
        font-size: 14px !important;
        top: 0;
        left: 0;
        width: 140px !important;
        height: 50px !important;

        @media screen and (max-width: 800px) {
            font-size: 15px !important;
            padding: 8px 10px !important;
        }
    }

    .data-card {
        width: 200px;
        height: 30px;
        background: #ffffff;
        border: 1px solid #d2d2d2;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
    }

    .start-btn {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 170px !important;
        height: 50px !important;
        font-size: 20px;
    }
</style>
