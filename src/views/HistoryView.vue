<template>
  <div style="height: 100%;" class="flex column">
    <div class="flex" style="justify-content: space-between; margin-bottom: 30px;">
      <div class="flex">
        <el-button :autofocus="mode === 'ct'" @click="modeChange('ct')" class="navigation-btn">CT</el-button>
        <el-button :autofocus="mode === 'alarm'" @click="modeChange('alarm')" class="navigation-btn">ALARM</el-button>
        <el-button :autofocus="mode === 'uph'" @click="modeChange('uph')" class="navigation-btn">UPH</el-button>
      </div>
      <div>
        <el-button v-if="mode === 'ct' || mode === 'alarm'" @click="visible=true" class="navigation-btn" style="justify-items: end;">Clean all</el-button>
        <div v-else class="flex">
          <NumKeyBoard v-model="target"
                       width="200" height="60"/>
          <el-button @click="visible=true" class="navigation-btn" style="justify-items: end;">Save</el-button>
        </div>
      </div>
    </div>
    <div v-if="mode === 'ct' || mode === 'alarm'" class="flex table-li" style="border: 1px solid #DCDFE6; background-color: #f5f7fa;">
      <div style="flex: 1; text-align: start;">
        No
      </div>
      <div style="flex: 1; text-align: start;">
        Model
      </div>
      <div style="flex: 1; text-align: start;">
        {{ (mode === 'ct') ? 'CycleTime' : 'Alarm' }}
      </div>
      <div style="flex: 1; text-align: start;">
        Time
      </div>
    </div>
    <div v-if="mode === 'uph'">
      <div class="table-card">
        <div class="flex table-card-row">
          <div class="table-card-cell" style="flex: 1; background-color: #f5f7fa; color: #909399; font-weight: 500;">Day</div>
          <div class="table-card-cell" style="flex: 1; background-color: #f5f7fa; color: #909399; font-weight: 500;" :key="n" v-for="n in range(24)">
            {{ n }}
          </div>
        </div>
        <div :key="index" v-for="(v, index) in data" class="flex table-card-row">
          <div class="table-card-cell" style="flex: 1">{{ v.day || '' }}</div>
          <div class="table-card-cell" :style="{backgroundColor: (v[n] >= target || v[n] === undefined) ? '' : '#fd5954'}" style="flex: 1" :key="n" v-for="n in range(24)">
            {{ v[n] || '' }}
          </div>
        </div>
      </div>
    </div>
    <ul v-if="mode === 'ct' || mode === 'alarm'"  class="infinite-list scroll-hide" v-infinite-scroll="load"
        style="max-height: 700px; overflow: auto; padding: 0; border: 1px solid #DCDFE6; margin-top: 0; border-top: none;">
      <li :key="index" v-for="(v, index) in data" class="flex table-li">
        <div style="flex: 1; text-align: start;">
          {{ index + 1 }}
        </div>
        <div style="flex: 1; text-align: start;">
          {{ v.model }}
        </div>
        <div style="flex: 1; text-align: start;">
          {{ (mode === 'ct') ? v.cycleTime : v.message }}
        </div>
        <div style="flex: 1; text-align: start;">
          {{ moment(v.time).format('L LT') }}
        </div>
      </li>
    </ul>
    <el-dialog :title="$t('enterPassword')" :visible.sync="visible" width="1000px">
      <div class="flex column center" style="height: 300px;">
        <div class="flex" style="position: relative;">
          <NumKeyBoard v-model="password" type="password"
                       width="350" height="60"/>
          <el-button
              style="width: 150px; height: 60px; font-size: 25px; position: relative; left: 20px;"
              type="info" @click="historyClear">
            OK
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import utils from '@/utils'
import moment from 'moment'
import NumKeyBoard from "@/components/NumKeyBoard"
import { range } from 'lodash'

const mode = ['ct', 'alarm', 'uph']

export default {
  name: "HistoryView",
  components: {NumKeyBoard},
  data: () => ({
    visible: false,
    password: '',
    target: utils.getDB('config').target || 0,
    mode: mode[0],
    page: 0,
    data: utils.getHistory(mode[0]),
    range,
    moment
  }),
  methods: {
    load() {
      this.data.push(...utils.getHistoryPage(this.mode, this.page))
      this.page += 1
    },
    modeChange(mode) {
      this.mode = mode
      this.data = utils.getHistory(mode)
    },
    historyClear() {
      if (this.password !== utils.getDB('config').password) return

      if (this.mode === 'uph') {
        utils.setDB('config', {
          ...utils.getDB('config'),
          target: this.target
        })
      } else {
        utils.removeHistory(this.mode)
        this.data = []
      }

      this.visible = false
    }
  }
}
</script>

<style scoped>
.navigation-btn {
  width: 160px !important;
  height: 60px !important;
}

.table-li {
  width: calc(100% - 20px);
  justify-content: space-between;
  border-bottom: 1px solid #ebeef5;
  background-color: white;
  padding: 12px 10px;
}

.scroll-hide::-webkit-scrollbar {
  display: none !important;
}

button {
  font-size: 20px !important;
}

.table-card {
  background: #ffffff;
  border: 1px solid #ebeef5;
}

.table-card-row {
  border-bottom: 1px solid #ebeef5;
}

.table-card-cell {
  border-right: 1px solid #ebeef5;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #606266;
  font-size: 18px;
}
</style>
