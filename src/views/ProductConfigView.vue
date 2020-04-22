<template>
    <div class="h100 flex column">
        <div class="flex between" style="margin-bottom: 20px;">
            <div>
                <el-button class="big-big-button" type="info">
                    {{ $t('추가') }}
                </el-button>
            </div>

            <div>
                <el-button class="big-big-button" type="info">
                    {{ $t('reset') }}
                </el-button>
                <el-button class="big-big-button" type="info">
                    {{ $t('save') }}
                </el-button>
            </div>
        </div>
        <div class="card" style="overflow-y: scroll; flex: 1;">
            <div v-bind:key="index" v-for="index in [1, 2, 3, 4, 5, 6, 7, 8]" class="flex row"
                 style="border: 1px solid #d2d2d2; padding: 20px; margin-bottom: 20px;">
                <img width="200" src="../assets/model/LHD HEV - 84260CZ000.png" alt="product">
                <div class="flex center" style="flex: 1;">
                    <h2>LHD HEV - 84260CZ000</h2>
                </div>
            </div>
        </div>
        <PasswordDialog :visible="visible" />
    </div>
</template>

<script>
    import PasswordDialog from "@/components/PasswordDialog";

    export default {
        name: "ProductConfigView",
        components: {PasswordDialog},
        data: () => ({
            visible: false
        })
    }
</script>

<style scoped>

</style>
