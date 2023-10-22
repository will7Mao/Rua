<template>
  <!-- tickle wrapper -->
  <div style="height: 100%; background-color: #ededed; border: 1px solid #fff">
    <div
      class="tickle_content"
      @click="tickleDraweVisableEvent"
      v-if="editTickle != undefined && editTickle.status == 1"
      :style="{ 'background-color': editTickle.color }"
    >
      <div
        style="
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          position: relative;
          color: #fff;
        "
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0px 5px;
          "
        >
          <div
            style="
              display: flex;
              align-items: center;
              overflow: hidden;
              flex-wrap: nowrap;
            "
          >
            <el-checkbox style="width: 12px; padding-left: 5px" />
            <span
              style="
                display: flex;
                padding-left: 5px;
                text-overflow: ellipsis;
                overflow: hidden;
                flex: 1;
                max-width: 80%;
                font-weight: bold;
                font-size: 15px;
                white-space: nowrap;
              "
              >{{ editTickle.title ? "#" + editTickle.title : "" }}
            </span>
          </div>
          <el-icon
            :style="{
              color: editTickle.color !== '' ? '#fff' : '#000',
            }"
            style="width: 15px; padding-right: 10px"
          >
            <MoreFilled />
          </el-icon>
        </div>
        <div style="display: flex; flex: 1">
          <div
            style="
              display: flex;
              flex: 1;
              flex-direction: column;
              justify-content: space-between;
              padding-bottom: 10px;
              padding-left: 5px;
            "
          >
            <div
              style="
                display: flex;
                overflow: hidden;
                flex-direction: column;
                padding-left: 5px;
              "
            >
              <el-text
                truncated
                style="
                  display: flex;
                  color: #fff;
                  font-weight: bold;
                  font-size: 12px;
                  align-self: flex-start;
                "
              >
                {{ editTickle.description }}
              </el-text>
            </div>
            <div style="display: flex; padding-left: 5px">
              <el-text
                truncated
                style="
                  display: flex;
                  color: #efefef;
                  font-weight: bold;
                  font-size: 12px;
                  align-self: flex-start;
                "
              >
                deadline:
              </el-text>
              <span style="display: flex; font-size: 10px; padding-left: 5px">
                {{
                  editTickle.deadline === undefined
                    ? "-"
                    : formatTime(editTickle.deadline)
                }}</span
              >
            </div>
          </div>
          <div
            style="
              display: flex;
              width: 30%;
              justify-content: flex-start;
              align-items: flex-start;
            "
          >
            <div style="display: flex; position: relative">
              <span
                style="
                  font-size: 55px;
                  color: #fff;
                  font-weight: 900;
                  line-height: 0.8;
                "
              >
                {{ editTickle.countFocusTime().value || "0" }}
              </span>
              <div style="position: absolute; top: 16%; right: -66%">
                <span style="font-size: 8px">
                  {{ editTickle.countFocusTime().unit || "min" }}
                </span>
              </div>
              <div style="position: absolute; bottom: -20px">
                <span style="font-size: 10px">focus</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 装饰物 -->
        <div class="tickle_decorator" :style="getTickleDecorator()"></div>
      </div>
    </div>
    <div
      class="tickle_content"
      @click="tickleDraweVisableEvent"
      v-if="
        editTickle == undefined ||
        (editTickle != undefined && editTickle.status == 0)
      "
    >
      <el-row style="height: 100%"> </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, defineEmits } from "vue";
import { ElButton, ElDrawer } from "element-plus";
import { Tickle, Duration } from "./models/Tickle";
import { PomodoroLog, Pomodoro } from "./models/PomodoroLog";

import {
  CircleCloseFilled,
  Bell,
  ElementPlus,
  MoreFilled,
  Plus,
  Clock,
} from "@element-plus/icons-vue";
import { ElMessageBox } from "element-plus";

// props
const props = defineProps({
  editTickle: {
    type: Tickle,
    required: false,
  },
  id: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["tickleDrawerVisableEvent"]);

// 父容器传入
const editTickle = computed(() => props.editTickle as Tickle);

function tickleDraweVisableEvent() {
  console.log("click tickle");
  emit("tickleDrawerVisableEvent", props.id);
}

function formatDateTime(date?: Date): string {
  if (!date) {
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatTime(date?: Date): string {
  if (!date) {
    return "";
  }
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

const color = ref("rgba(255, 69, 0, 0.68)");

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

// 事件

//装饰物
function getTickleDecorator() {
  var color = editTickle.color !== "" ? "#fff" : predefineColors.value;
  Math.floor(Math.random() * predefineColors.value.length);
  switch (editTickle.id % 2) {
    // 圆形
    case 0:
      return {
        "border-radius": "50%",
        width: "50vh",
        height: "50vh",
        top: "15px",
        right: "-100px",
        opacity: "0.5",
        "background-color": color,
      };
    // 侧线
    case 1:
      return {
        width: "2px",
        height: "10px",
        top: "1px",
        right: "-2px",
        opacity: "0.5",
        // 颜色
        "background-color": color,
      };
  }
}
</script>

<style scoped>
.tickle_content {
  height: 100%;
  width: 100%;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  min-height: 105px;
}

.tickle_decorator {
  position: absolute;
}

:global(.el-dialog__body) {
  padding: 0px !important;
}

:global(.el-dialog__header) {
  margin: 0px !important;
  padding: 0px !important;
}
</style>