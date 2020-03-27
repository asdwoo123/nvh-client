<template>
    <div style="height: 100%;">
        <div class="flex end-h" style="margin-bottom: 16px;">
            <el-button style="width: 180px; height: 60px; font-size: 20px;" type="info" icon="el-icon-arrow-left">{{ $t('message.previous') }}</el-button>
            <el-button style="width: 180px; height: 60px; font-size: 20px;" type="info">{{ $t('message.next') }}
                <i class="el-icon-arrow-right"/>
            </el-button>
        </div>
        <div class="content-card">
            <div class="flex column">
                <div class="flex center-v io-content">
                    <el-button type="success">P000</el-button>
                    <span>좌측 프레스실린더 하강</span>
                </div>
                <div class="flex center-v io-content">
                    <el-button type="info">P001</el-button>
                    <span>좌측 프레스실린더 하강</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "IOView"
    }
</script>

<style lang="less" scoped>
    .io-content {
        margin: 16px;

        button {
            margin-right: 13px;
        }
    }
</style>
