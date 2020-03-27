<template>
    <div class="h100 flex column center-v around" style="position: relative;">
        <el-button v-if="!moveable.draggable" style="width: 250px; height: 60px; font-size: 20px; position: absolute; top: 0; right: 0;"
                  @click="moveable.draggable = true" type="info">
            {{ $t('message.changePosition') }}
        </el-button>
        <template v-else >
        <el-button style="width: 250px; height: 60px; font-size: 20px; position: absolute; top: 0; right: 0;"
                   @click="positionSave" type="info">
            {{ $t('message.positionSave') }}
        </el-button>
        <el-button style="width: 250px; height: 60px; font-size: 20px; position: absolute; top: 80px; right: 0;"
                   @click="positionCancel" type="info">
            {{ $t('message.cancel') }}
        </el-button>
        </template>

        <div class="productView">
            <template v-if="lamps">
                <Moveable v-bind="moveable" @drag="handleDrag" v-bind:key="index" style="z-index: 1; position: absolute;"
                          v-for="(lamp, index) in lamps" v-bind:style="{ top: lamp.top + 'px', left: lamp.left + 'px' }">
                <el-button circle type="danger"  style="width: 60px;
            height: 60px; font-size: 20px;">
                    {{ lamp.number }}
                </el-button>
                </Moveable>
            </template>
            <img @click="checkX" v-if="product" style="width: 100%;"
                 :src='"../assets/model/" + product.productName + ".png"' alt="product-img">
        </div>
        <el-alert :closable="false" :title="$t('message.noProduct')"
                  type="error" effect="dark" style="height: 100px; width: 70%;"/>
    </div>
</template>

<script>
    import Moveable from 'vue-moveable';
    import { getDB } from '@/utils'

    export default {
        name: "AutoView",
        data: () => ({
            moveable: {
                draggable: false
            },
            productList: getDB('productList')
        }),
        components: {
            Moveable,
        },
        computed: {
            product() {
                return this.$store.state.product
            },
            lamps() {
                if (!this.product) return
                return this.productList.find(x => x.productName === this.product.productName).lamps
            }
        },
        methods: {
            checkX(event) {
                console.log(event.offsetX, event.offsetY)
            },
            positionSave() {
                this.moveable.draggable = false
            },
            positionCancel() {
                this.moveable.draggable = false
            },
            handleDrag({ target, left, top }) {
                target.style.left = `${left}px`;
                target.style.top = `${top}px`;
            }
        }
    }
</script>

<style scoped>
    .productView {
        width: 670px;
        height: 570px;
        position: relative;
    }
</style>
