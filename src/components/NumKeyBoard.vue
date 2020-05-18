<template>
    <div @click="visible=true">
        <el-popover placement="bottom" width="240" v-model="visible" @show="handleOpenShow">
            <div class="flex wrap" v-if="type === 'password'">
                <div v-bind:key="n" v-for="n in [1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0]"
                     @click="handleNumClick(n)"
                     class="flex center key-box">
                    {{n}}
                </div>
                <div @click="visible=false"
                     class="flex center key-box">
                    Enter
                </div>
            </div>
            <div class="flex" v-else>
                <div class="flex wrap" style="width: 180px;">
                    <div v-bind:key="n" v-for="n in [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0]"
                         @click="handleNumClick(n)"
                         class="flex center key-box2">
                        {{n}}
                    </div>
                    <div class="flex center key-box2"
                         @click="handleNumClick('.')">
                        .
                    </div>
                </div>
                <div class="flex column">
                    <div @click="handleNumClick('←')"
                         class="flex center key-box2">
                        ←
                    </div>
                    <div @click="handleNumClick('Clear')"
                         class="flex center key-box2" style=" font-size: 15px;">
                        Clear
                    </div>
                <div @click="visible=false"
                     class="flex center key-box2" style="height: 110px; font-size: 15px;">
                    Enter
                </div>
                </div>
            </div>
            <el-button slot="reference" style="margin-right: 10px; font-size: 20px; overflow-x: hidden;"
                       :style="{width: (width) ? width + 'px' : '150px', height: (height) ? height + 'px' : '46px'}">
                {{ (type === 'password') ? numBlind : numNonBlind }}
            </el-button>
        </el-popover>
    </div>
</template>

<script>
    export default {
        name: "NumKeyBoard",
        props: ['type', 'width', 'height', 'value'],
        data: () => ({
            visible: false,
            reset: false
        }),
        computed: {
            numBlind() {
                return this.value.split('').map(() => '●').join('')
            },
            numNonBlind() {
                return this.value
            }
        },
        methods: {
            handleNumClick(n) {
                let value = this.value.toString()

                if (this.reset) {
                    value = '0'
                    this.reset = false
                }

                if (n === '←') {
                    value = value.substr(0, value.length - 1)
                    if (value === '' && this.type !== 'password') value = '0'
                } else if (n !== 'Enter' && n !== 'Clear' && n !== '' && value.length < 10) {
                    const index = value.indexOf('.')
                    if (n === '.' && index !== -1) return
                    if (index !== -1 && value.length - 1 > index) return;

                    value = (value === '0' && n !== '.') ? n + '' : value + n
                } else {
                    value = '0'
                }

                this.$emit('input', value)
            },
            handleOpenShow() {
                this.reset = true
            }
        }
    }
</script>

<style scoped lang="less">
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

    .key-box2 {
        .key-box;
        width: 50px;
        height: 50px;
    }
</style>
