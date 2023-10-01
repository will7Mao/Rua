<template>
  <el-tabs
    v-model="activeName"
    class="demo-tabs"
    @tab-click="handleClick"
    style="height: 100%; display: flex; flex-direction: column"
  >
    <el-tab-pane
      label="Matrix"
      name="first"
      style="position: relative"
      align="middle"
    >
      <div style="height: 100%" class="line-vertical"></div>
      <div style="width: 100%" class="line-horizontal"></div>
      <el-row v-for="tr in 6" style="height: 16.66%" justify="center">
        <el-col v-for="tsr in 6" :span="3">
          <Tickle :id="tr * tsr" />
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="TickleList" name="second">
      <div class="demo-collapse">
        <el-collapse>
          <el-collapse-item title="重要且紧急" name="1"> </el-collapse-item>
          <el-collapse-item title="不重要但紧急" name="2"> </el-collapse-item>
          <el-collapse-item title="重要但不紧急" name="3"> </el-collapse-item>
          <el-collapse-item title="不重要且不紧急" name="4"> </el-collapse-item>
        </el-collapse>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { TabsPaneContext } from "element-plus";
import Tickle from "./Tickle.vue";


const activeName = ref("first");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

const tickleSubmmit = () => {
  console.log("success");
};
</script>
<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
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

#pane-first {
  height: 100%;
}
</style>