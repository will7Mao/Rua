<template>
  <el-tabs
    v-model="activeName"
    class="demo-tabs"
    @tab-click="handleClick"
    style="height: 100%; display: flex; flex-direction: column"
  >
    <el-tab-pane
      label="Matrix"
      name="Matrix"
      style="height: 100%; min-height: 600px"
    >
      <!-- 外层wrapper -->
      <el-row style="height: 100%">
        <!-- <el-col> -->
        <!-- 图例 -->
        <!-- <el-row style="width: 300px" align="middle">
            <el-col :span="6" style="position: relative">
              <el-text size="13">紧急性</el-text>
              <div
                id="x_axis_legend"
                style="position: absolute; bottom;: 4px"
              ></div>
            </el-col>
            <el-col :span="6" style="position: relative">
              <el-text size="13">重要性</el-text>
              <div
                id="y_axis_legend"
                style="position: absolute; left: 4px"
              ></div>
            </el-col>
          </el-row>
        </el-col> -->
        <el-col style="padding: 30px; position: relative">
          <!-- matrix -->
          <el-row
            v-for="y_index in y_count"
            :key="y_index"
            :style="{ height: `${100 / y_count}%` }"
          >
            <el-col
              v-for="x_index in x_count"
              :key="x_index"
              :span="24 / x_count"
            >
              <TickleVue
                :editTickle="tickles[(y_index - 1) * x_count + (x_index - 1)]"
                :id="(y_index - 1) * x_count + (x_index - 1)"
                @tickleDrawerVisableEvent="tickleDrawerVisableEventHandler"
              />
            </el-col>
          </el-row>
          <!-- x、y轴 -->
          <div style="height: 100%" class="line-vertical"></div>
          <div style="width: 100%" class="line-horizontal"></div>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="TickleList" name="TickleList">
      <div>
        <el-collapse>
          <el-collapse-item title="重要且紧急" name="1">
            <div
              class="collapse-content"
              v-for="tickle in getTickleByType(1)"
              :key="tickle.id"
            >
              <div>
                <h1>{{ tickle.title }}</h1>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="不重要但紧急" name="2">
            <div
              class="collapse-content"
              v-for="tickle in getTickleByType(2)"
              :key="tickle.id"
            >
              <div>
                <h1>{{ tickle.title }}</h1>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="重要但不紧急" name="4">
            <div
              class="collapse-content"
              v-for="tickle in getTickleByType(4)"
              :key="tickle.id"
            >
              <div>
                <h1>{{ tickle.title }}</h1>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="不重要且不紧急" name="3">
            <div
              class="collapse-content"
              v-for="tickle in getTickleByType(3)"
              :key="tickle.id"
            >
              <div>
                <h1>{{ tickle.title }}</h1>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-tab-pane>
  </el-tabs>
  <el-dialog
    id="focus_dialog"
    v-model="focusDialogVisible"
    :fullscreen="true"
    style="margin: 0px; padding: 0px; position: relative"
    :show-close="false"
    :center="true"
    v-show="focusDialogVisible"
  >
    <Focus
      :pomodoro="pomodoro"
      :focusTickle="focusTickleId != -1 ? tickles[focusTickleId] : undefined"
      :dialogVisable="focusDialogVisible"
      @DialogVisableEvent="DialogVisableEventHandler"
      @FloatWindowEvent="FloatWindowEventHandler"
    />
  </el-dialog>
  <!-- float窗户  -->
  <div
    v-show="floatWindowFlag"
    style="
      display: flex;
      position: absolute;
      height: 60px;
      width: 300px;
      border-radius: 30px;
      background-color: #ff5733;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      top: 0;
      left: 50vw;
      color: #fff;
    "
    @click="floatWindowClick()"
  >
    <el-icon>
      <Back />
    </el-icon>
    <span style="display: flex; flex-direction: column">
      {{ pomodoro.remainCountDownDisplay() || "0" }}
    </span>
    <span style="display: flex"> click to back to focus </span>
  </div>

  <el-drawer
    v-model="tickleDrawerVisible"
    :show-close="false"
    size="24%"
    :before-close="clearTickleDrawer"
  >
    <template #header="{ titleId, titleClass }">
      <h1 :id="titleId" :class="titleClass">New　Tickle</h1>
      <el-divider />
    </template>
    <el-form :model="editTickle" label-width="120px" label-position="top">
      <el-form-item label="title">
        <el-input v-model="editTickle.title" />
      </el-form-item>
      <el-form-item label="description">
        <el-input v-model="editTickle.description" :rows="4" type="textarea" />
      </el-form-item>
      <el-form-item label="deadline">
        <el-date-picker
          v-model="editTickle.deadline"
          type="date"
          placeholder="set the deadline"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="color">
        <el-color-picker
          v-model="editTickle.color"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>
    </el-form>
    <el-collapse>
      <el-collapse-item title="tickleFocusRecords">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in editTickle.tickleFocusRecords"
            :key="index"
            :timestamp="activity.startTime"
          >
            {{ activity.duration / (1000 * 60 * 60) + "h" }}
          </el-timeline-item>
        </el-timeline>
      </el-collapse-item>
    </el-collapse>
    <el-row style="padding: 20px">
      <el-col justify="center" align="middle">
        <div
          class="tickle_focus_btn"
          @click="tickleFocus"
          :style="{
            backgroundColor:
              editTickle.color != '' ? editTickle.color : '#409EFF',
            color: '#fff',
          }"
        >
          <span style="display: flex"> focus </span>
        </div>
      </el-col>
    </el-row>
    <template #footer>
      <el-button type="primary" @click="submitTickle">Create</el-button>
      <el-button @click="tickleDrawerVisible = false">Cancel</el-button>
    </template>
  </el-drawer>
</template>
 
<script lang="ts" setup>
import { ref, ElMessageBox, reactive, toRefs } from "vue";
import type { TabsPaneContext } from "element-plus";
import TickleVue from "./Tickle.vue";
import Focus from "./Focus.vue";
import { Tickle, TickleFocusRecord } from "./models/Tickle";
import { Pomodoro } from "./models/PomodoroLog";

const focusDialogVisible = ref(false);
const floatWindowFlag = ref(false);
const tickleDrawerVisible = ref(false);
const editTickle = ref(new Tickle(-1, "", "", [], "", 0, undefined));
// 番茄钟组
const pomodoro = reactive(new Pomodoro());

// 只能focus于一个tickle
const focusTickleId = ref(-1);

// tickle edit drawer
const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "#c7158577",
]);

function submitTickle() {
  // 将编辑中的tickle变成已经创建
  editTickle.value.status = 1;
  tickles.value[editTickle.value.id] = editTickle.value;
  tickleDrawerVisible.value = false;
}

function clearTickleDrawer(done: Function) {
  console.log(tickles.value);
  editTickle.value = new Tickle(-1, "", "", [], "", 0, undefined);
  done(false);
}

function tickleDrawerVisableEventHandler(tickleId: number) {
  editTickle.value.id = tickleId;
  if (tickles.value[tickleId] == undefined) {
    tickles.value[tickleId] = new Tickle(
      tickleId,
      "",
      "",
      [],
      "",
      0,
      undefined
    );
  } else {
    editTickle.value = tickles.value[tickleId];
  }
  tickleDrawerVisible.value = true;
}

// focus事件
function DialogVisableEventHandler(
  dialogVisibleFlag: boolean,
  setTickleId: number, // 将要设置focus的tickleId
  focusRecord?: TickleFocusRecord | undefined
) {
  if (focusTickleId.value != -1 && setTickleId == -1) {
    if (focusRecord != undefined) {
      tickles.value[focusTickleId.value].tickleFocusRecords.push(focusRecord);
    }
    resetPomodoro();
  }
  focusTickleId.value = setTickleId;
  focusDialogVisible.value = dialogVisibleFlag;
}

// 重置 pomodoro 对象
function resetPomodoro() {
  const newPomodoro = new Pomodoro();
  Object.assign(pomodoro, toRefs(newPomodoro));
}

function tickleFocus() {
  if (focusTickleId.value != -1 && focusTickleId.value != editTickle.value.id) {
    console.log("already focuse:" + "focusTickleId.value");
    return;
  }
  // 只有先创建了tickle才能focus
  if (editTickle.value.status != 1) {
    console.log("please create tickle first");
    return;
  }
  DialogVisableEventHandler(true, editTickle.value.id);
}

// tabs切换
const activeName = ref("Matrix");
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

// 象限绘制
const x_count = 6;
const y_count = 6;
const tickles = ref(new Array<Tickle>(x_count * y_count));

// 灵动岛状态
function FloatWindowEventHandler(floatWindowChangeFlag: boolean) {
  floatWindowFlag.value = floatWindowChangeFlag;
}

function floatWindowClick() {
  DialogVisableEventHandler(true, focusTickleId.value);
  FloatWindowEventHandler(false);
}

// 1 2 3 1
// 7 8 9 10 11 12
function getTickleByType(type: number): Array<Tickle> {
  return tickles.value.filter((tickle) => {
    if (tickle.id == -1 || tickle.status == 0) {
      return false;
    }
    const x_bi = tickle.id / x_count > y_count / 2;
    const y_bi = tickle.id % x_count > x_count / 2;
    if (type == 1) {
      return x_bi && !y_bi;
    } else if (type == 2) {
      return !x_bi && !y_bi;
    } else if (type == 3) {
      return !x_bi && y_bi;
    } else if (type == 4) {
      return x_bi && y_bi;
    }
    // 确保在所有情况下都有返回值
    return false;
  });
}
</script>
<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
}

.el-tabs__content {
  flex: 1;
}

.line-horizontal {
  position: absolute !important;
  top: 50%; /* 将水平线放置在容器的中点位置 */
  left: 0;
  right: 0;
  height: 4px; /* 线的高度 */
  margin: 0px !important;
  background-color: var(--el-menu-active-color);
}

.line-vertical {
  position: absolute !important;
  top: 0;
  bottom: 0;
  left: 50%; /* 将垂直线放置在容器的中点位置 */
  width: 4px; /* 线的宽度 */
  margin: 0px !important;
  background-color: var(--el-menu-active-color);
}

#x_axis_legend {
  height: 4px;
  width: 20px;
  background-color: tomato;
}

#y_axis_legend {
  height: 4px;
  width: 20px;
  background-color: yellow;
}

.demo-tabs > .el-tabs__content {
  padding: 0px;
}

.el-tabs__header {
  margin: 0px !important;
}

#pane-Matrix {
  height: 100%;
}

#focus_dialog {
  width: 100vw;
  height: 100vh;
}

.tickle_focus_record {
  height: 200px;
  overflow: scroll;
}

.tickle_focus_btn {
  display: flex;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.collapse-content {
  height: 200px;
  width: 100%;
  overflow: scroll;
}
</style>