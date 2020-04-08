<template>
    <div style="height: 100%; display:flex;">
        <div style="margin-right: 20px;">
            <img src="../assets/지그.jpg" alt="">
        </div>
        <div class="flex column wrap" style="flex: 1; border: 1px solid #d2d2d2; background-color: #fff;">
            <div v-bind:key="n" v-for="n in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]" class="flex between center-v" style="padding: 13px; width: calc(50% - 26px);">
                <span style="font-size: 25px;">{{ $t('cylinder') + ' ' + n }}</span>
                <div>
                    <el-button type="info" class="btn">MP</el-button>
                    <el-button type="success" class="btn">WP</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ManualView"
    }
</script>

<style scoped>
    .btn {
        width: 110px !important;
        height: 50px !important;
        font-size: 17px !important;
        text-align: center !important;
    }
</style>
