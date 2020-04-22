<template>
    <div class="h100 flex column center-v around" style="position: relative;">
        <el-button class="select-btn" @click="visible = true" type="info">
            {{ $t('selectModel') }}
        </el-button>
        <div v-if="product" style="position: absolute; top: 0; right: 0;">
            <el-button v-if="!moveable.draggable"
                       class="move-btn"
                       @click="moveable.draggable = true" type="info">
                {{ $t('changePosition') }}
            </el-button>
            <template v-else>
                <el-button class="move-btn"
                           @click="visible2=true" type="info">
                    {{ $t('positionSave') }}
                </el-button>
                <el-button class="move-btn"
                           @click="positionCancel" type="info">
                    {{ $t('cancel') }}
                </el-button>
            </template>
        </div>
        <div class="productView">
            <template v-if="lamps">
                <Moveable v-bind="moveable" @drag="handleDrag" v-bind:key="index"
                          style="z-index: 1; position: absolute;"
                          v-for="(lamp, index) in lamps"
                          v-bind:style="{ top: lamp.top + 'px', left: lamp.left + 'px' }">
                    <el-button circle type="danger" style="width: 60px;
            height: 60px; font-size: 20px;">
                        {{ lamp.number }}
                    </el-button>
                    <div :id="'l' + index"/>
                </Moveable>
            </template>
            <img v-if="product" style="width: 100%;"
                 :src='"../assets/model/" + product.productName + ".png"' alt="product-img">
        </div>
        <el-alert :closable="false" :title="$t(`${message[alert]}`)"
                  type="error" effect="dark" class="alert-bar"/>

        <el-dialog :visible.sync="visible">
            <el-button style="width: 100%; height: 60px; margin: 0 0 16px 0; font-size: 20px;" type="primary"
                       v-bind:key="index" @click="setProduct(productName, index)"
                       v-for="({productName}, index) in productList" plain>
                {{ productName }}
                <span v-if="product" style="float: right;">
                        <i v-if="product.productName === productName" class="el-icon-check"/>
                    </span>
            </el-button>
        </el-dialog>

        <el-dialog :title="$t('enterPassword')" :visible="visible2" width="700">
            <div class="flex column center" style="height: 300px;">
                <div class="flex" style="position: relative;">
                    <NumKeyBoard :num="field.password" field="password" type="password" :numClick="handleNumClick"
                                 width="350" height="60"/>
                    <el-button
                            style="width: 150px; height: 60px; font-size: 20px; position: relative; left: 20px;"
                            type="info" @click="positionSave">
                        OK
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Moveable from 'vue-moveable';
    import utils from '@/utils'
    import {alertMessage} from '@/config'
    import NumKeyBoard from "@/components/NumKeyBoard";

    export default {
        name: "AutoView",
        data: () => ({
            moveable: {
                draggable: false
            },
            productList: utils.getDB('productList'),
            visible: false,
            visible2: false,
            message: alertMessage(),
            field: {
                password: ''
            }
        }),
        components: {
            NumKeyBoard,
            Moveable,
        },
        computed: {
            product() {
                return this.$store.state.product
            },
            lamps() {
                if (!this.product) return
                return this.productList.find(x => x.productName === this.product.productName).lamps
            },
            alert() {
                return this.$store.state.alert
            }
        },
        methods: {
            positionSave() {
                if (this.field.password === utils.getDB('config').password) {
                    const type = this.product.type

                    this.productList = this.productList.map(product => {
                        if (product.type === type) {
                            product.lamps = this.product.lamps
                        }
                        return product
                    })

                    utils.setDB('productList', this.productList)

                    this.moveable.draggable = false
                    this.visible2 = false
                }
            },
            positionCancel() {
                this.moveable.draggable = false
            },
            handleDrag({target, left, top}) {
                let id = target.children[1].id
                id = id.substr(1)
                id = parseInt(id)
                const lamp = this.product.lamps[id]
                lamp.left = left
                lamp.top = top
            },
            setProduct(productName, index) {
                this.$store.commit('setProduct', productName)
                console.log(index)
                this.visible = false
            },
            handleNumClick(n, field, type) {
                if (n === '←') {
                    this.field[field] = this.field[field].substr(0, this.field[field].length - 1)
                    if (this.field[field] === '' && type !== 'password') this.field[field] = '0'
                } else if (n !== '' && this.field[field].length < 10) {
                    this.field[field] = (this.field[field] === '0') ? n + '' : this.field[field] + n
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .productView {
        width: 670px;
        height: 570px;
        position: relative;

        @media screen and (max-width: 800px) {
            width: 268px !important;
            height: 228px !important;
        }
    }

    .alert-bar {
        height: 100px;
        width: 70%;

        @media screen and (max-width: 800px) {
            height: 50px !important;
        }
    }

    .move-btn {
        width: 250px !important;
        height: 60px !important;
        font-size: 20px;
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
        top: 80px;
        @media screen and (max-width: 800px) {
            top: 70px;
        }
    }


    .select-btn {
        position: absolute;
        font-size: 20px !important;
        top: 0;
        left: 0;
        width: 170px !important;
        height: 60px !important;

        @media screen and (max-width: 800px) {
            font-size: 15px !important;
            padding: 8px 10px !important;
        }
    }
</style>
