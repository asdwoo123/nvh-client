<template>
    <el-button circle type="danger" style="z-index: 1; width: 60px;
    height: 60px; position: absolute; font-size: 20px;" v-bind:style="{ top, left }">
        {{ number }}
    </el-button>
</template>

<script>
    export default {
        name: "LampBtn",
        props: ['top', 'left', 'number']
    }
</script>

<style scoped>

</style>
