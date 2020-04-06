<template>
    <div style="height: 100%; display:flex;">
        <div style="margin-right: 20px;">
            <img src="../assets/지그.jpg" alt="">
        </div>
        <div class="flex column" style="flex: 1; border: 1px solid #d2d2d2; background-color: #fff;">
            <div class="flex between center-v" style="padding: 20px; width: 50%;">
                <span style="font-size: 25px;">실린더 1</span>
                <div>
                    <el-button type="info" class="big-button">MP</el-button>
                    <el-button type="success" class="big-button">WP</el-button>
                </div>
            </div>
            <div class="flex between center-v" style="padding: 20px; width: 50%;">
                <span style="font-size: 25px;">실린더 2</span>
                <div>
                    <el-button type="success" class="big-button">MP</el-button>
                    <el-button type="info" class="big-button">WP</el-button>
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

</style>
