<template>
    <div>
        <el-popover placement="bottom" width="240" trigger="click">
            <div class="flex wrap">
                <div v-bind:key="n" v-for="n in [1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0, '']"
                     @click="numClick(n, field, type)"
                     class="flex center key-box">
                    {{n}}
                </div>
            </div>
            <el-button slot="reference" style="margin-right: 10px; font-size: 20px; overflow-x: hidden;"
            :style="{width: (width) ? width + 'px' : '150px', height: (height) ? height + 'px' : '46px'}">
                {{ (type === 'password') ? numBlind : num }}
            </el-button>
        </el-popover>
    </div>
</template>

<script>
    export default {
        name: "NumKeyBoard",
        props: ['num', 'numClick', 'type', 'field', 'width', 'height'],
        computed: {
            numBlind() {
                return this.num.split('').map(() => '●').join('')
            }
        }
    }
</script>

<style scoped>
    .key-box {
        width: 70px;
        height: 70px;
        border: 1px solid #d2d2d2;
        border-radius: 10px;
        font-size: 20px;
        margin: 5px;
        box-sizing: border-box;
        cursor: pointer;
    }
</style>
