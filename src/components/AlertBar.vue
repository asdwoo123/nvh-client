<template>
    <div class="flex center" style="padding: 20px;">
        <el-alert :closable="false" :title="$t(`${alert}`)"
                  type="error" effect="dark" class="alert-bar"/>
    </div>
</template>

<script>
    export default {
        name: "AlertBar",
        computed: {
            alert() {
                return 'noPLC'
            }
        }
    }
</script>

<style scoped lang="less">
    .alert-bar {
        height: 80px;
        width: 100%;

        @media screen and (max-width: 800px) {
            height: 50px !important;
        }
    }
</style>
