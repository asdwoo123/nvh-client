<template>
    <div class="h100 flex column center-v around" style="position: relative;">
        <el-button v-if="!moveable.draggable" style="width: 250px; height: 60px; font-size: 20px; position: absolute; top: 0; right: 0;"
                  @click="moveable.draggable = true" type="info">
            {{ $t('changePosition') }}
        </el-button>
        <template v-else >
        <el-button style="width: 250px; height: 60px; font-size: 20px; position: absolute; top: 0; right: 0;"
                   @click="positionSave" type="info">
            {{ $t('positionSave') }}
        </el-button>
        <el-button style="width: 250px; height: 60px; font-size: 20px; position: absolute; top: 80px; right: 0;"
                   @click="positionCancel" type="info">
            {{ $t('cancel') }}
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
                    <div :id="'l' + index" />
                </Moveable>
            </template>
            <img v-if="product" style="width: 100%;"
                 :src='"../assets/model/" + product.productName + ".png"' alt="product-img">
        </div>
        <el-alert :closable="false" :title="$t('noProduct')"
                  type="error" effect="dark" style="height: 100px; width: 70%;"/>
    </div>
</template>

<script>
    import Moveable from 'vue-moveable';
    import utils from '@/utils'

    export default {
        name: "AutoView",
        data: () => ({
            moveable: {
                draggable: false
            },
            productList: utils.getDB('productList')
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
            positionSave() {
                this.moveable.draggable = false
            },
            positionCancel() {
                this.moveable.draggable = false
            },
            handleDrag({ target, left, top } ) {
                let id = target.children[1].id
                id = id.substr(1)
                id = parseInt(id)
                const lamp = this.product.lamps[id]
                lamp.left = left
                lamp.top = top
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
