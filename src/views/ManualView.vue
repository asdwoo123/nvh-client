<template>
    <div style="height: 100%; display:flex;">
        <div style="margin-right: 20px;">
            <img width="300" src="../assets/지그.png" alt="">
        </div>
        <div class="flex column wrap"
             style="flex: 1; border: 1px solid #d2d2d2; background-color: #fff;">
            <div v-bind:key="n" v-for="(n, i) in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]" class="flex between center-v" style="padding: 9px;">
                <span style="font-size: 15px;">{{ $t('cylinder') + ' ' + n }}</span>
                <div>
                    <el-button @click="controlCylinderOff(i)" :type="(cylinderSensor[i * 2].portValue) ? 'success' : 'info'" class="btn">HP</el-button>
                    <el-button @click="controlCylinderOn(i)" :type="(cylinderSensor[(i * 2) + 1].portValue) ? 'success' : 'info'" class="btn">WP</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { cylinderOn, cylinderOff } from '@/service/mcprotocol'
    import {plcConfig} from '@/config'

    const { io } = plcConfig()
    const { sol } = io

    export default {
        name: "ManualView",
        computed: {
            cylinderSensor() {
                return this.$store.state.inputPort.slice(sol[0], sol[1])
            }
        },
        methods: {
            controlCylinderOn(index) {
                    cylinderOn(index)
            },
            controlCylinderOff(index) {
                    cylinderOff(index)
            }
        }
    }
</script>

<style scoped>
    .btn {
        width: 70px !important;
        height: 37px !important;
        font-size: 15px !important;
        text-align: center !important;
        line-height: 5px !important;
    }
</style>
