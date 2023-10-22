<template>
  <div class="focus_dialog_content" :style="focusDialogStyle">
    <div class="focus_dialog_wrapper">
      <div class="tickle_focus_header">
        <div>
          <el-text style="font-size: 60px; color: #fff; font-weight: bold">{{
            "# " + currentFocusTickle.title
          }}</el-text>
        </div>
        <div>
          <el-text style="color: #fff">{{
            "total: " + currentPomodoro.countFocusTimeDisplay()
          }}</el-text>
        </div>
      </div>
      <div class="tickle_focus_content">
        <div class="tickle_focus_content_input_banner">
          <el-input
            v-model="currentLogDescription"
            size="large"
            placeholder="Step Note"
            style="padding-left: 10px"
          />
          <el-button type="primary" @click="doPomodoro" size="large">
            <if v-if="currentPomodoro.currentLog() == undefined"> Start </if>
            <if v-if="currentPomodoro.currentLog() != undefined"> End </if>
          </el-button>
        </div>
        <div
          style="
            flex: 1;
            display: flex;
            margin: 20px;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
          "
        >
          <div
            style="
              width: 50%;
              height: 100%;
              display: flex;
              padding-right: 10px;
              justify-content: flex-end;
            "
          >
            <el-progress
              type="circle"
              :percentage="pomodoroCountDownProgress"
              :width="300"
              :stroke-width="8"
            >
              <template #default="{ percentage }">
                <span class="percentage-value">{{
                  currentPomodoroLogCountDown
                }}</span>
                <span class="percentage-label">{{
                  percentage == 100 ? "- %" : percentage + "%"
                }}</span>
              </template>
            </el-progress>
          </div>
          <div style="width: 50%; height: 100%">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in currentPomodoro.pomodoroLogs"
                :key="index"
                :timestamp="activity.getDurationDisplay()"
                :color="activity.getTimelineNodeColor()"
              >
                {{ activity.description || `The ${index + 1}` + " loop" }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <div style="display: flex; flex-direction: row; align-items: center">
          <el-button @click="PomodoroZoomOut">Zoom Out</el-button>
          <el-button @click="PomodoroFinish">Finish</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  ref,
  useCssVars,
  reactive,
  computed,
} from "vue";
import { Pomodoro } from "./models/PomodoroLog";
import { Tickle, TickleFocusRecord } from "./models/Tickle";
import { VideoPlay, VideoPause, Back } from "@element-plus/icons-vue";

const emit = defineEmits(["DialogVisableEvent", "FloatWindowEvent"]);
const currentLogDescription = ref("");
const floatWindow = ref(false);

function doPomodoro() {
  /**
   * 只能开始或者结束
   */
  if (
    props.pomodoro.currentLog() == undefined ||
    (props.pomodoro.currentLog() != undefined &&
      props.pomodoro.remainCountDown() == 0)
  ) {
    if (
      props.pomodoro.currentLog() != undefined &&
      props.pomodoro.remainCountDown() == 0
    ) {
      props.pomodoro.currentLog()!!.finish();
    }
    props.pomodoro.addLog(currentLogDescription.value);
    currentLogDescription.value = "";
  } else if (props.pomodoro.currentLog() != undefined) {
    props.pomodoro.currentLog()!!.finish();
    currentLogDescription.value = "";
  }
}

// 显示番茄钟时间
// 闹钟
const state = reactive({
  pomodoroCountDown: "",
  pomodoroCountDownProgress: 100,
});

const currentPomodoroLogCountDown = computed(() => {
  return state.pomodoroCountDown;
});

const pomodoroCountDownProgress = computed(() => {
  return state.pomodoroCountDownProgress;
});

setInterval(() => {
  state.pomodoroCountDown = currentPomodoro.value.remainCountDownDisplay();
  state.pomodoroCountDownProgress = currentPomodoro.value.countDownProgress();
}, 1000);

// 事件
// focus弹框显示时间
function handleDialogVisibility(
  setTickleId: number,
  focusRecord?: TickleFocusRecord | null
) {
  emit("DialogVisableEvent", !props.dialogVisable, setTickleId, focusRecord);
}

// 番茄钟循环zoom out
function PomodoroZoomOut() {
  floatWindow.value = true;
  handleDialogVisibility(currentFocusTickle.value.id);
  emit("FloatWindowEvent", true);
}

// 番茄钟循环结束
function PomodoroFinish() {
  var focusRecord = currentPomodoro.value.finish(currentFocusTickle.value.id);
  handleDialogVisibility(-1, focusRecord);
}

// 专注的tickle 以及 番茄钟
const props = defineProps({
  focusTickle: {
    type: Tickle,
    required: true,
  },
  pomodoro: {
    type: Pomodoro,
    required: true,
  },
  dialogVisable: {
    type: Boolean,
    required: true,
  },
});

const currentFocusTickle = computed(() => props.focusTickle as Tickle);
const currentPomodoro = computed(() => props.pomodoro as Pomodoro);

// 动态样式
const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
]);

const focusDialogStyle = ref(getFocusDialogStyle());

/**
 * 获取当前tickle focus的颜色
 */
function getFocusDialogStyle() {
  let randomIndex = Math.floor(Math.random() * predefineColors.value.length);
  // 返回与当前editTickle color 更浅一点的色号，从左到右的渐变
  var randomColor = predefineColors.value[randomIndex];
  const rgbaColor = hexToRgb(randomColor) + ", 0.2)";
  return {
    background: `linear-gradient(to right, ${rgbaColor},${randomColor})`,
  };
}

function hexToRgb(hexColor: string) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}`;
}
</script>
<style>
:global(.el-dialog__body) {
  padding: 0px !important;
}

:global(.el-dialog__header) {
  margin: 0px !important;
  padding: 0px !important;
}

.focus_dialog_content {
  position: relative;
  height: 100vh;
  width: 100wh;
  display: flex;
  top: 0;
  left: 0;
  justify-content: center;
}

.focus_dialog_wrapper {
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}
.tickle_focus_header {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px !important;
  width: 100%;
}

.tickle_focus_content {
  height: 60vh;
  width: 100%;
  background-color: #fff;
  border-radius: 100px 100px 0% 0%;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  display: flex;
}

.tickle_focus_content_input_banner {
  display: flex;
  width: 60%;
  height: 50px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.tickle_focus_content_countdown_timer {
  width: 60%;
  height: 60%;
  border-radius: 50%;
  border: 10px solid #000;
}

.percentage-value {
  display: block;
  font-size: 50px;
}
.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 15px;
}

.el-progress--circle .el-progress__text {
  top: 40% !important;
}
</style>