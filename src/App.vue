<template>
    <div id="app">
        <div class="header">
            <div class="flex end-v">
                <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                    <el-menu-item v-bind:key="route.name" v-for="route in routes" :index="route.path">
                        {{ $t(`${route.name}`) }}
                    </el-menu-item>
                </el-menu>
            </div>
            <div v-if="product" class="product-title">
                <span>
                {{product.productName}}
                </span>
            </div>
            <div class="flex center-v">
                <div class="time-view">{{ currentTime }}</div>
                <img class="logo" src="./assets/biglogo.jpg" alt="logo">
            </div>
        </div>
        <div class="content">
            <router-view/>
        </div>
        <AlertBar />
    </div>
</template>

<script>
    import router from "@/router"
    import moment from "moment"
    import {manualOn, manualOff, yellowOn, yellowOff} from '@/service/mcprotocol'
    import {routes} from '@/config/index2'
    import AlertBar from "@/components/AlertBar";

    export default {
        name: 'app',
        components: {AlertBar},
        router,
        data: () => ({
            activeIndex: '/auto',
            currentTime: moment().format('L LT'),
            routes: routes().slice(1)
        }),
        computed: {
            product() {
                return this.$store.state.product
            }
        },
        methods: {
            handleSelect(key) {
                this.$router.push(key).then(() => {
                    if (key === '/manual') {
                        manualOn()
                    }

                    if (key === '/auto') {
                        manualOff()
                    }

                    if (key !== '/auto') {
                        yellowOn()
                    }

                }).catch(error => {
                    if (error.name !== "NavigationDuplicated") {
                        throw error
                    }
                })
            }
        },
        mounted() {
            setInterval(() => {
                this.currentTime = moment().format('L LT')
            }, 1000)

            setTimeout(() => {
                const path = this.$route.path
                this.activeIndex = (path === '/') ? '/auto' : path
            }, 500)
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
        padding: 0 20px;
        background-color: #ffffff;
        border-bottom: 1px solid @border-color;

        @media screen and (max-width: 800px) {
            height: 50px;
            padding: 0 15px;
        }

        .el-menu-item {
            font-size: 20px !important;
            height: 70px !important;
            padding: 0 15px;

            @media screen and (max-width: 800px) {
                font-size: 12px !important;
                height: 40px !important;
                padding: 0 10px !important;
            }
        }
    }

    .content {
        padding: 15px 15px 0;
        height: calc(100% - 201px);

        @media screen and (max-width: 800px) {
            padding: 10px;

            height: calc(100% - 61px);
        }
    }

    .card {
        background: #ffffff;
        border: 1px solid #d2d2d2;
        padding: 20px;
    }

    .card::-webkit-scrollbar {
        display: none;
    }

    .content-card {
        background: #ffffff;
        border: 1px solid #d2d2d2;
        width: calc(100% - 40px);
        height: calc(100% - 74px);
        padding: 15px;
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
        font-size: 20px !important;
        text-align: center;
    }

    .el-dialog__title {
        font-size: 30px !important;
    }

    .moveable-line {
        background: none !important;
    }

    .el-select-dropdown__item {
        height: 46px !important;
        line-height: 46px !important;
        font-size: 15px !important;
    }

    .el-input__inner {
        height: 46px !important;
        font-size: 15px !important;
    }

    .big-button {
        width: 120px !important;
        height: 46px !important;
        font-size: 15px !important;
        text-align: center !important;

        @media screen and (max-width: 800px) {
            width: 48px !important;
            height: 24px !important;
            font-size: 8px !important;
        }
    }

    .big-big-button {
        width: 100px !important;
        height: 40px !important;
        font-size: 15px !important;

        @media screen and (max-width: 800px) {
            width: 72px !important;
            height: 24px !important;
            font-size: 8px !important;
        }
    }

    .time-view {
        font-size: 15px;
        margin-right: 20px;

        @media screen and (max-width: 800px) {
            font-size: 15px;
            margin-right: 15px;
        }
    }

    .logo {
        height: 50px;

        @media screen and (max-width: 800px) {
            height: 30px;
        }
    }

    .product-title {
        font-size: 20px;
        display: flex;
        align-items: flex-end;
        margin-bottom: 30px;
        justify-self: center;
        @media screen and (max-width: 800px) {
            font-size: 15px;
            margin-bottom: 8px;
        }
    }

    .el-dialog__title {
        font-size: 20px !important;
    }

    .el-checkbox-button__inner {
        width: 113px;
        height: 46px;
        font-size: 15px !important;
    }
</style>
