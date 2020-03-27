<template>
    <div id="app">
        <div class="header">
            <div class="flex end-v">
                <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="/auto">{{ $t('message.automation') }}</el-menu-item>
                    <el-menu-item index="/manual">{{ $t('message.manual') }}</el-menu-item>
                    <el-menu-item index="/io">{{ $t('message.io') }}</el-menu-item>
                    <el-menu-item index="/config">{{ $t('message.configure') }}</el-menu-item>
                </el-menu>
                <el-button @click="visible = true" type="info" style="margin-left: 30px; margin-bottom: 20px; font-size: 20px;">
                    {{ $t('message.selectModel') }}
                </el-button>
                <div v-if="product" style="font-size: 20px; margin-left: 50px; margin-bottom: 27px;">
                    {{product.productName}}
                </div>
            </div>
            <div class="flex center-v">
                <div style="font-size: 20px; margin-right: 30px;">{{ currentTime }}</div>
                <img height="50" src="./assets/biglogo.jpg" alt="logo">
            </div>
        </div>
        <div class="content">
            <router-view/>
        </div>

        <el-dialog :visible.sync="visible">
                <el-button style="width: 100%; height: 60px; margin: 0 0 16px 0; font-size: 20px;" type="primary" v-bind:key="index" @click="setProduct(productName)"
                           v-for="({productName}, index) in productList" plain>
                    {{ productName }}
                    <span v-if="product" style="float: right;">
                        <i v-if="product.productName === productName" class="el-icon-check"/>
                    </span>
                </el-button>
        </el-dialog>
    </div>
</template>

<script>
    import router from "@/router"
    import moment from "moment"
    import { getDB } from '@/utils'
    import '@/./serial'

    export default {
        name: 'app',
        router,
        data: () => ({
            activeIndex: '/auto',
            currentTime: moment().format('L LT'),
            visible: false,
            productList: getDB('productList')
        }),
        computed: {
            product() {
                return this.$store.state.product
            }
        },
        methods: {
            handleSelect(key) {
                this.$router.push(key).catch(error => {
                    if (error.name !== "NavigationDuplicated") {
                        throw error
                    }
                })
            },
            setProduct(productName) {
                this.$store.commit('setProduct', productName)
                this.visible = false
            }
        },
        mounted() {
            this.activeIndex = this.$route.path

            setInterval(() => {
                this.currentTime = moment().format('L LT')
            }, 1000)
        }
    }
</script>

<style lang="less">
    @border-color: #d2d2d2;
    @background-color: #eff3f6;

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        text-align: center;
        background: @background-color;
        height: 100%;
    }

    .header {
        display: flex;
        justify-content: space-between;
        height: 80px;
        padding: 0 30px;
        background-color: #ffffff;
        border-bottom: 1px solid @border-color;

        .el-menu-item {
            font-size: 20px !important;
            height: 70px !important;
        }
    }

    .content {
        padding: 20px;
        height: calc(100% - 121px);
    }

    .content-card {
        background: #ffffff;
        border: 1px solid #d2d2d2;
        width: calc(100% - 40px);
        height: calc(100% - 116px);
        padding: 20px;
    }

    .content-card-no-padding {
        background: #ffffff;
        border: 1px solid #d2d2d2;
        width: 100%;
        height: calc(100% - 76px);
    }

    .el-alert__content {
        width: 100%;
    }

    .el-alert__title {
        font-size: 30px !important;
        text-align: center;
    }

    .el-dialog__title {
        font-size: 30px !important;
    }

    .moveable-line {
        background: none !important;
    }

    .el-select-dropdown__item {
        height: 60px !important;
        line-height: 60px !important;
        font-size: 20px !important;
    }

    .el-input__inner {
        height: 60px !important;
        font-size: 20px !important;
    }
</style>
