<template>
  <div
    @click="
      visible = true;
      console.log(editTickle.id);
    "
    style="height: 100%"
    :class="['matrix-border']"
  >
    <el-row
      justify="center"
      :style="{
        backgroundColor: editTickle.color,
      }"
      style="min-height: 20px; padding: 3px"
    >
      <el-text
        size="large"
        :style="{ color: editTickle.color ? 'white' : 'black' }"
        truncated
      >
        {{ editTickle.title }}
      </el-text>
    </el-row>
    <el-space direction="vertical">
      <el-text>
        {{ formatDateTime(editTickle.deadline) }}
      </el-text>
    </el-space>
  </div>
  <el-drawer v-model="visible" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">New　tickle</h4>
      <el-button type="danger" @click="close">
        <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
        Close
      </el-button>
    </template>
    <el-form :model="editTickle" label-width="120px" label-position="left">
      <el-form-item label="title">
        <el-input v-model="editTickle.title" />
      </el-form-item>
      <el-form-item label="description">
        <el-input v-model="editTickle.description" />
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
      <el-form-item label="focus on">
        <el-button @click="dialogVisible = true"> dive into </el-button>
      </el-form-item>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in editTickle.tickleFocusRecords"
          :key="index"
          :timestamp="activity.startTime"
        >
          {{ activity.duration / (1000 * 60 * 60) + "h" }}
        </el-timeline-item>
        <el-form-item>
          <el-button type="primary" @click="submitTickle">Create</el-button>
          <el-button @click="visible = false">Cancel</el-button>
        </el-form-item>
      </el-timeline>
    </el-form>
  </el-drawer>

  <el-dialog
    v-model="dialogVisible"
    :title="'Tickle: ' + editTickle.title"
    style="width: 100vw; height: 100vh; margin: 0px"
    :before-close="handleClose"
  >
    <span style="font-size: 50px">{{ formatTime(currentTime) }}</span>
    <el-row justify="center">
      <el-text v-if="tomatoStauts() == true" type="danger"> 番茄中 </el-text>
      <el-text v-if="tomatoStauts() == false" type="primary"> 休息中 </el-text>
    </el-row>
    <el-row
      v-for="(item, index) in TomatoRecords"
      :key="index"
      justify="center"
    >
      <div style="width: 80%; padding: 5px">
        <el-progress :percentage="parseInt(getProgress(item))">
          <span>{{ getProgress(item) + "%" }}</span>
        </el-progress>
      </div>
    </el-row>
    <el-row justify="center">
      <el-button @click="addNewTomato">add new tomato loop</el-button>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="focusConfirm"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from "vue";
import { ElButton, ElDrawer } from "element-plus";
import { CircleCloseFilled, Bell, ElementPlus } from "@element-plus/icons-vue";
const visible = ref(false);
import { ElMessageBox } from "element-plus";

const dialogVisible = ref(false);

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Are you sure to close this dialog?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};

var editTickle: Tickle = reactive({
  id: 0,
  title: "",
  description: "",
  deadline: undefined,
  tickleFocusRecords: [],
  color: "",
});

interface Tickle {
  id: number;
  title: string;
  description: string;
  deadline?: Date;
  tickleFocusRecords: TickleFocusRecord[];
  color: "";
}

interface TickleFocusRecord {
  id: number;
  startTime: Date;
  duration: number;
}

function submitTickle() {
  visible.value = false;
  console.log(editTickle);
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
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
]);

const state = reactive({
  date: new Date(),
});

interface TomatoRecord {
  startTime: Date;
  endTime: Date;
  // 0 未完成 1已完成
  status: number;
}

function getProgress(record: TomatoRecord): string {
  return (
    (state.date.getTime() - record.startTime.getTime()) /
    (record.endTime.getTime() - record.startTime.getTime())
  ).toFixed(3);
}

function addNewTomato() {
  // 如果存在未完成的番茄钟，则返回
  if (
    TomatoRecords.length > 0 &&
    TomatoRecords[TomatoRecords.length - 1].status === 0
  ) {
    return;
  }
  TomatoRecords.push({
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 25 * 60 * 1000),
    status: 0,
  });
}

var TomatoRecords: TomatoRecord[] = reactive([]);

const currentTime = computed(() => {
  return state.date;
});

function tomatoStauts(): boolean {
  // 是否存在未完成的番茄钟
  if (TomatoRecords.length > 0) {
    if (TomatoRecords[TomatoRecords.length - 1].status === 0) {
      return true;
    }
  }
  return false;
}

function focusConfirm() {
  dialogVisible.value = false;
  // 计算投入的时间生成投入记录的记录
  if (TomatoRecords.length >= 1) {
    // 计算番茄投入的时间,并且相加
    const duration = TomatoRecords.map((item) => {
      return item.startTime.getTime() - item.endTime.getTime();
    }).reduce((a, b) => a + b);
    const focusRecord: TickleFocusRecord = {
      id: 0,
      startTime: TomatoRecords[0].startTime,
      duration: duration,
    };
    editTickle.tickleFocusRecords.push(focusRecord);
    console.log(editTickle.tickleFocusRecords);
  }
  // 清空番茄钟记录
  TomatoRecords = [];
}
setInterval(() => {
  state.date = new Date();
}, 1000);
</script>

<style scoped>
.matrix-border {
  border: 1px solid var(--el-border-color);
}
.box-shadow-lighter {
  box-shadow: var(--el-box-shadow-light);
}
</style>