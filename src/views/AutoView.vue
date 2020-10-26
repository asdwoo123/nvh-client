<template>
  <div class="h100 flex column center-v around" style="position: relative;">
    <div class="flex" style="width: 100%; position: absolute; top: 0; justify-content: center;">
      <el-button class="select-btn" @click="visible3 = true" type="info">
        {{ $t('selectModel') }}
      </el-button>
      <div class="flex">
        <div class="data-card" style="margin-right: 20px;">
          <div style="font-size: 25px;">
            {{ $t('cycleTime') }}
          </div>
          <div style="font-size: 25px;">
            <span style="font-weight: bold; font-size: 25px;">{{ (cycleTime / 10).toFixed(1) }}</span> {{
              $t('sec')
            }}
          </div>
        </div>

        <div class="flex">
          <div class="data-card" style="border-right: none;">
            <div style="font-size: 25px;">
              {{ $t('total') }}
            </div>
            <div style="font-size: 25px;">
              <span style="font-weight: bold; font-size: 25px;">{{ total }}</span> {{ $t('count') }}
            </div>
          </div>
          <el-button @click="totalReset" style="border-radius: 0; font-size: 20px;" type="info" plain>Reset
          </el-button>
          <!--<el-button :type="(green) ? 'success' : 'info'" style="width: 60px; height: 60px;" circle/>-->
        </div>

      </div>
      <div style="position: absolute; top: 0; right: 0;">
        <el-button :type="(air) ? 'success' : 'info'" @click="mainAirOnOff"
                   style="width: 290px; height: 60px; font-size: 25px;">
          {{ $t('mainAir') }}
        </el-button>
      </div>
      <div v-if="product" style="position: absolute; top: 70px; right: 0;">
        <el-button v-if="!moveable.draggable"
                   class="move-btn"
                   :disabled="lampDisable"
                   @click="moveable.draggable = true" type="info">
          {{ $t('changePosition') }}
        </el-button>
        <template v-else>
          <el-button class="move-btn" style="z-index: 10"
                     @click="visible2=true" type="info">
            {{ $t('positionSave') }}
          </el-button>
          <el-button class="move-btn"
                     @click="positionCancel" type="info">
            {{ $t('cancel') }}
          </el-button>
        </template>
        <el-button v-if="!lampDisable"
                   class="move-btn"
                   @click="lampDisable = true" type="info">
          {{ $t('lamp') }} on/off
        </el-button>
        <template v-else>
          <el-button class="move-btn" style="top: 70px;"
                     @click="visible2=true" type="info">
            {{ $t('configSave') }}
          </el-button>
          <el-button class="move-btn" style="top: 140px;"
                     @click="lampDisableCancle" type="info">
            {{ $t('cancel') }}
          </el-button>
        </template>
      </div>

    </div>
    <div class="productView">
      <Moveable v-bind="moveable" v-if="product" style="position: absolute; cursor: pointer;" @drag="handleDrag4"
                :style="{ top: sideJigSensor.top + 'px', left: sideJigSensor.left + 'px' }">
        <div :class="(sideJigError) ? 'led-err' : null"
             style="
             border: 1px solid black;
        width: 50px;
        height: 50px;
        border-radius: 50%;"/>
      </Moveable>
      <Moveable v-bind="moveable" v-if="product" style="position: absolute; cursor: pointer; z-index: 3;" @drag="handleDrag7"
      :style="{ top: jigCheckSensor[0].top + 'px', left: jigCheckSensor[0].left + 'px' }">
        <div :class="(leftError) ? 'led-err' : null" class="jig-led" />
      </Moveable>
      <Moveable v-bind="moveable" v-if="product" style="position: absolute; cursor: pointer; z-index: 3;" @drag="handleDrag8"
      :style="{ top: jigCheckSensor[1].top + 'px', left: (jigCheckSensor[1].left || 300) + 'px' }">
        <div :class="(rightError) ? 'led-err' : null" class="jig-led" />
      </Moveable>
      <template v-if="lamps">
        <Moveable v-bind="moveable" @drag="handleDrag" v-bind:key="index"
                  style="z-index: 1; position: absolute; cursor: pointer; "
                  v-for="(lamp, index) in lamps.filter((_, i) => i !== 12)"
                  v-bind:style="{ top: lamp.top + 'px', left: lamp.left + 'px' }">
          <el-button circle v-if="lampDisableCheck(lamp)" :type="lampTypeCheck(lampCheck[index], lamp)"
                     style="width: 50px;
                      height: 50px;
                      font-size: 15px;"
                     :class="lampClassCheck(lampCheck[index], index)"
                     @click="toggleDisable(index)">
            <span style="font-size: 25px;" v-if="index < 12">{{ lamp.number }}</span>
            <span style="font-size: 25px;" v-else>{{ lamp.number - 1 }}</span>
          </el-button>
          <div :id="'l' + index"/>
        </Moveable>
        <Moveable v-bind="moveable" @drag="handleDrag2" v-bind:key="index"
                  style="z-index: 1; position: absolute;"
                  v-for="(sw, index) in detectionSwitches"
                  v-bind:style="{ top: sw.top + 'px', left: sw.left + 'px' }">
          <el-button style="width: 50px;
            height: 50px; font-size: 25px; display: flex; justify-content: center;"
                     :type="(switchCheck[index]) ? 'success' : 'danger'"
          >
            {{ index + 1 }}
          </el-button>
          <div :id="'l' + index"/>
        </Moveable>
        <Moveable v-if="isToolUsingIndex" v-bind="moveable" @drag="handleDrag9" style="z-index: 1; position: absolute;"
                  v-bind:style="{ top: toolSwitchPosition.top + 'px', left: toolSwitchPosition.left + 'px' }">
          <el-button style="width: 50px;
            height: 50px; font-size: 25px; display: flex; justify-content: center;"
                     :type="(toolDetectSwitch) ? 'success' : 'danger'"
          >3</el-button>
        </Moveable>

        <Moveable v-bind="moveable" @drag="handleDrag3"
                  v-if="isToolUsingIndex"
                  style="z-index: 2; position: absolute; cursor: pointer;"
                  :style="{ top: toolSensor[0].top + 'px', left: toolSensor[0].left + 'px' }"
        >
          <el-progress width="60" stroke-width="10" type="circle" :status="(toolSensorCheck === toolCount  * 1) ? 'success' : null"
                       :percentage="toolSensorCheck * Math.floor(100 / toolCount)"/>
        </Moveable>

      </template>
      <Moveable @drag="handleDrag5" v-bind="moveable" v-if="isHoleProduct"
                style="position: absolute; z-index: 2; cursor: pointer;"
                :style="{ top: holeSensor[0].top + 'px', left: holeSensor[0].left + 'px' }">
        <el-button :type="(holeCheck[1].portValue ? 'danger' : 'success')"
                   class="hole-btn">A
        </el-button>
      </Moveable>
      <Moveable @drag="handleDrag6" v-bind="moveable" v-if="isHoleProduct"
                style="position: absolute; z-index: 2; cursor: pointer;"
                :style="{ top: holeSensor[1].top + 'px', left: holeSensor[1].left + 'px' }">
        <el-button :type="(holeCheck[0].portValue ? 'danger' : 'success')"
                   class="hole-btn">
          B
        </el-button>
      </Moveable>
      <img v-if="product" style="width: 100%;"
           :src='"../assets/model/" + productList.indexOf(productList.find(v => v.productName === product.productName)) + ".png"'
           alt="product-img">

    </div>
    <el-dialog :visible.sync="visible" top="4vh">
      <div style="height: 70px; margin: 0 0 16px 0; font-size: 20px; line-height: 70px;
             border: 1px solid #99cccc; border-radius: 4px; cursor: pointer;"
           :style="{background: (product && product.productName === productName) ? 'teal' : '#e6f2f2',
                 color: (product && product.productName === productName) ? 'white' : '#606266'}"
           v-bind:key="index" @click="setProduct(productName, index)"
           v-for="({productName}, index) in productList">
        {{ productNames[index] || productName }}
      </div>
      <!--<el-button style="width: 100%; height: 70px; margin: 0 0 16px 0; font-size: 20px;" type="primary"
                 v-bind:key="index" @click="setProduct(productName, index)"
                 v-for="({productName}, index) in productList" plain>
          {{ productName }}
          <span v-if="product" style="float: right;">
                  <i v-if="product.productName === productName" class="el-icon-check"/>
              </span>
      </el-button>-->
    </el-dialog>

    <el-dialog :title="$t('enterPassword')" :visible.sync="visible2" width="1000px">
      <div class="flex column center" style="height: 300px;">
        <div class="flex" style="position: relative;">
          <NumKeyBoard v-model="password" type="password"
                       width="350" height="60"/>
          <el-button
              style="width: 150px; height: 60px; font-size: 25px; position: relative; left: 20px;"
              type="info" @click="positionSave">
            OK
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :title="$t('enterPassword')" :visible.sync="visible3" width="1000px">
      <div class="flex column center" style="height: 300px;">
        <div class="flex" style="position: relative;">
          <NumKeyBoard v-model="password" type="password"
                       width="350" height="60"/>
          <el-button
              style="width: 150px; height: 60px; font-size: 25px; position: relative; left: 20px;"
              type="info" @click="showModeChange">
            OK
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="visible4" width="900px">
      <div class="flex column center" style="height: 400px;">
        <h1 style="font-size: 60px;">{{ $t('sideCheck') }}</h1>
        <el-button
            style="width: 200px; height: 90px; font-size: 35px; margin-top: 40px;"
            type="info" @click="visible4=false">
          OK
        </el-button>
      </div>
    </el-dialog>

    <el-button v-if="product && switchEnable" class="start-btn" @click="workStart" type="success">
      {{ $t('start') }}
    </el-button>
  </div>
</template>

<script>
import Moveable from 'vue-moveable';
import utils from '@/utils'
import NumKeyBoard from "@/components/NumKeyBoard";
import {
  changeMode,
  mainAirOn,
  mainAirOff,
  reset,
  complete,
  deComplete,
  selectModeOn,
  selectModeOff,
  start
} from '@/service/mcprotocol'
import {cloneDeep} from 'lodash'


export default {
  name: "AutoView",
  data: () => ({
    moveable: {
      draggable: false
    },
    lampDisable: false,
    productList: cloneDeep(utils.getDB('productList')),
    visible: false,
    visible2: false,
    visible3: false,
    visible4: false,
    selectState: false,
    password: '',
    switchEnable: (Array.isArray(utils.getDB('config').UsingSwitch)) ? utils.getDB('config').UsingSwitch.length === 0 : false,
    productNames: Object.values(utils.getDB('productConfig').productNames) || [],
    toolSensor: cloneDeep(utils.getDB('toolSensor')),
    holeSensor: cloneDeep(utils.getDB('holeSensor')),
    sideJigSensor: cloneDeep(utils.getDB('sideJigSensor')),
    jigCheckSensor: cloneDeep(utils.getDB('jigCheckSensor')),
    toolSwitchPosition: cloneDeep(utils.getDB('toolDetectSwitch')),
    toolUsingIndex: [3, 5],
    UsingToolSensor: utils.getDB('config').UsingToolSensor || 'Disable',
    toolCount: utils.getDB('config').toolCount || '5'
  }),
  components: {
    NumKeyBoard,
    Moveable,
  },
  mounted() {
    let visibleState = false

    setInterval(() => {
      if (!this.visible && this.selectState) {

        this.selectState = false
        selectModeOff()
      }
    }, 1000)

    setInterval(() => {
      if (!this.product) return;
      const arr = []
      this.product.lamps.filter((x, i) => i !== 12).filter(x => !x.disable).forEach(lams => {
        const index = this.product.lamps.indexOf(lams)
        arr.push(this.getLampCheck()[index])
      })

      if (!visibleState && arr.every(v => v) && arr.length > 0 && this.$store.state.detectionSwitch.every(v => v) && !this.$store.state.workComplete /*&&
      (productList.indexOf(productList.find(v => v.productName === this.$store.state.product.productName)) === 1) ? this.$store.state.toolSensorCount === 4 : true*/) {
        visibleState = true
        this.$store.state.workComplete = true
        complete()
      } else if (visibleState && !this.$store.state.detectionSwitch.every(v => v) && this.$store.state.workComplete) {
        visibleState = false
        this.$store.state.workComplete = false
        deComplete()
      }
    }, 1500)
  },
  computed: {
    product() {
      return this.$store.state.product
    },
    green() {
      return this.$store.state.workComplete
    },
    holeCheck() {
      return this.$store.state.inputPort.slice(66, 68)
    },
    isHoleProduct() {
      if (!this.$store.state.product) return false
      return this.productList.indexOf(this.productList.find(v => v.productName === this.product.productName)) === 2
    },
    lamps() {
      if (!this.product || this.visible) return
      return this.product.lamps
    },
    primaryWork() {
      return this.$store.state.primaryWork
    },
    lampCheck() {
      if (this.product) {
        const type = this.product.type
        if (type === 'LHD') return this.$store.state.lhdSwitch
        else return this.$store.state.rhdSwitch
      } else {
        return []
      }
    },
    air() {
      return this.$store.state.mainAir
    },
    cycleTime() {
      return this.$store.state.cycleTime
    },
    total() {
      return this.$store.state.total
    },
    detectionSwitches() {
      if (!this.product) return
      return this.product.detectionSwitches
    },
    switchCheck() {
      return this.$store.state.detectionSwitch
    },
    leftError() {
      return this.$store.state.leftErr
    },
    rightError() {
      return this.$store.state.rightErr
    },
    sideJigError() {
      return this.$store.state.sideJigError
    },
    nokAndOk() {
      return this.$store.state.nokAndOk
    },
    toolSensorCheck() {
      return this.$store.state.toolSensorCount
    },
    isToolUsingIndex() {
      if (utils.getDB('config').UsingToolSensor !== 'Enable') return false
      const product = this.productList.find(v => v.productName === this.product.productName)
      const index = this.productList.indexOf(product)
      return this.toolUsingIndex.some(v => v === index)
    },
    toolDetectSwitch() {
      return this.$store.state.toolDetectSwitch
    }
  },
  methods: {
    positionSave() {
      if (this.password === utils.getDB('config').password) {
        const productName = this.product.productName

        this.productList = this.productList.map(product => {
          if (product.productName === productName) {
            product.lamps = [...this.product.lamps]
            product.detectionSwitches = [...this.product.detectionSwitches]
          }
          return product
        })

        utils.setDB('productList', this.productList)
        utils.setDB('toolSensor', this.toolSensor)
        utils.setDB('holeSensor', this.holeSensor)
        utils.setDB('sideJigSensor', this.sideJigSensor)
        utils.setDB('jigCheckSensor', this.jigCheckSensor)
        utils.setDB('toolDetectSwitch', this.toolSwitchPosition)

        this.lampReset()

        this.moveable.draggable = false
        this.lampDisable = false
        this.visible2 = false
      }
      this.password = ''
    },
    positionCancel() {
      this.lampReset()
      this.moveable.draggable = false
    },
    lampDisableCancle() {
      this.lampReset()
      this.lampDisable = false
    },
    showModeChange() {
      if (this.password === utils.getDB('config').password) {
        this.visible3 = false
        this.visible = true

        selectModeOn()
        this.selectState = true
      }
      this.password = ''
    },
    handleDrag({target, left, top}) {
      let id = target.children[1].id
      id = id.substr(1)
      id = parseInt(id)
      if (id > 11) {
        id++
      }
      const lamp = this.product.lamps[id]
      lamp.left = left
      lamp.top = top
    },
    handleDrag2({target, left, top}) {
      let id = target.children[1].id
      id = id.substr(1)
      id = parseInt(id)

      const sw = this.product.detectionSwitches[id]
      sw.left = left
      sw.top = top
    },
    handleDrag3({_, left, top}) {
      const ts = this.toolSensor[0]
      ts.left = left
      ts.top = top
    },
    handleDrag4({_, left, top}) {
      const ts = this.sideJigSensor
      ts.left = left
      ts.top = top
    },
    handleDrag5({_, left, top}) {
      const ts = this.holeSensor[0]
      ts.left = left
      ts.top = top
    },
    handleDrag6({_, left, top}) {
      const ts = this.holeSensor[1]
      ts.left = left
      ts.top = top
    },
    handleDrag7({_, left, top}) {
      const js = this.jigCheckSensor[0]
      js.left = left
      js.top = top
    },
    handleDrag8({_, left, top}) {
      const js = this.jigCheckSensor[1]
      js.left = left
      js.top = top
    },
    handleDrag9({_, left, top}) {
      const tp = this.toolSwitchPosition
      tp.left = left
      tp.top = top
    },
    setProduct(productName, index) {
      this.$store.commit('setProduct', productName)
      this.visible = false
      let i = index
      if (index === 2) i = i - 2
      else if (index > 2) i = i - 1

      if (i === 1 || i === 7) this.visible4 = true
      const isHole = index === 2
      this.selectState = false
      changeMode(i, isHole)
    },
    mainAirOnOff() {
      if (this.air) {
        mainAirOff()
      } else {
        mainAirOn()
      }
    },
    lampDisableCheck(lamp) {
      if (this.lampDisable && !this.visible) {
        return true
      } else {
        return (!lamp.disable)
      }
    },
    toggleDisable(index) {
      if (this.lampDisable) {
        if (index > 11) index ++
        const lamp = this.product.lamps[index]
        lamp.disable = !lamp.disable;

        this.$forceUpdate();
      }
    },
    lampTypeCheck(check, lamp) {
      if (lamp.disable) {
        return 'info'
      } else {
        if (check) {
          return 'success'
        } else {
          return 'danger'
        }
      }
    },
    lampClassCheck(check, index) {
      if (check) return null
      else {
        const type = this.product.type
        if (type === 'LHD') {
          if (index === 10 && this.primaryWork[0] === 1) return 'lamp-blue'
          if (index === 13 && this.primaryWork[1] === 1) return 'lamp-blue'
        } else {
          if (index === 14 && this.primaryWork[2] === 1) return 'lamp-blue'
          if (index === 16 && this.primaryWork[3] === 1) return 'lamp-blue'
        }
                return 'lamp-blink'
      }
    },
    totalReset() {
      reset()
    },
    lampReset() {
      this.product.lamps = cloneDeep(this.productList.find(v => v.productName === this.product.productName).lamps)
      this.product.detectionSwitches = cloneDeep(this.productList.find(v => v.productName === this.product.productName).detectionSwitches)
      this.toolSensor = cloneDeep(utils.getDB('toolSensor'))
      this.holeSensor = cloneDeep(utils.getDB('holeSensor'))
      this.sideJigSensor = cloneDeep(utils.getDB('sideJigSensor'))
      this.jigCheckSensor = cloneDeep(utils.getDB('jigCheckSensor'))
    },
    workStart() {
      start()
    },
    getLampCheck() {
      if (this.product) {
        const type = this.product.type
        if (type === 'LHD') return this.$store.state.lhdSwitch
        else return this.$store.state.rhdSwitch
      } else {
        return []
      }
    }
  }
}
</script>

<style scoped lang="less">
.productView {
  position: relative;
  justify-content: center;
  align-items: center;
  top: 50px;

  img {
    position: relative;
    width: 570px;
    height: 750px;
  }

  @media screen and (max-width: 1000px) {
    width: 400px !important;
    height: 490px !important;
  }
}

.jig-led {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  z-index: 3;
  border: 1px solid #ff6767;
}

.lamp-blink {
  -webkit-animation: blink 1s infinite;
  -moz-animation: blink 1s infinite;
  -ms-animation: blink 1s infinite;
  -o-animation: blink 1s infinite;
  animation: blink 1s infinite;
}

@keyframes blink {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.led-err {
  box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 12px;
  -webkit-animation: blinkRed 0.5s infinite;
  -moz-animation: blinkRed 0.5s infinite;
  -ms-animation: blinkRed 0.5s infinite;
  -o-animation: blinkRed 0.5s infinite;
  animation: blinkRed 0.5s infinite;
}

.lamp-blue {
  background-color: dodgerblue !important;
}

.move-btn {
  width: 170px !important;
  height: 50px !important;
  position: absolute;
  top: 0;
  right: 0;

  span {
    font-size: 20px;
  }

  @media screen and (min-width: 1200px) {
    width: 290px !important;
    height: 60px !important;
    font-size: 25px;
  }

  @media screen and (max-width: 800px) {
    width: 170px !important;
    height: 50px !important;
    font-size: 15px;
  }
}

.move-btn:nth-child(2) {
  top: 70px;
  @media screen and (max-width: 800px) {
    top: 70px;
  }
}


.select-btn {
  position: absolute;
  font-size: 25px !important;
  top: 0;
  left: 0;
  width: 100px !important;
  height: 40px !important;

  @media screen and (min-width: 1200px) {
    width: 190px !important;
    height: 60px !important;
    font-size: 25px !important;
    padding: 8px 10px !important;
  }

  @media screen and (max-width: 800px) {
    font-size: 15px !important;
    padding: 8px 10px !important;
  }
}

.data-card {
  width: 260px;
  height: 38px;
  background: #ffffff;
  border: 1px solid #d2d2d2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.start-btn {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 170px !important;
  height: 50px !important;
  font-size: 20px;
}

.hole-btn {
  width: 50px !important;
  height: 50px !important;
  font-size: 25px !important;
}

@-webkit-keyframes blinkRed {
  from {
    background-color: #F00;
  }
  50% {
    background-color: #A00;
    box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 0;
  }
  to {
    background-color: #F00;
  }
}

@-moz-keyframes blinkRed {
  from {
    background-color: #F00;
  }
  50% {
    background-color: #A00;
    box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 0;
  }
  to {
    background-color: #F00;
  }
}

@-ms-keyframes blinkRed {
  from {
    background-color: #F00;
  }
  50% {
    background-color: #A00;
    box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 0;
  }
  to {
    background-color: #F00;
  }
}

@-o-keyframes blinkRed {
  from {
    background-color: #F00;
  }
  50% {
    background-color: #A00;
    box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 0;
  }
  to {
    background-color: #F00;
  }
}

@keyframes blinkRed {
  from {
    background-color: #F00;
  }
  50% {
    background-color: #A00;
    box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 0;
  }
  to {
    background-color: #F00;
  }
}
</style>
