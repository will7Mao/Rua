<template>
  <div class="common-layout">
    <el-container style="height: 100vh">
      <el-header
        :style="{
          boxShadow: `var(--el-box-shadow-lighter)`,
        }"
        style="margin-bottom: 20px"
      >
        <el-row justify="space-between" align="middle" style="height: 100%">
          <el-col :span="2">
            <Logo />
          </el-col>
          <el-col :span="4">
            <el-row justify="end">
              <el-col :span="4"> <Github /> </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside
          width="260px"
          :style="{
            boxShadow: `2px 2px 5px var(--el-box-shadow-lighter)`,
          }"
          style="border-inline-end: 1px solid rgba(5, 5, 5, 0.06)"
        >
          <el-menu default-active="1" class="el-menu-vertical-demo">
            <el-menu-item index="1">
              <el-icon><icon-menu /></el-icon>
              <span>Tickle Master</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container style="margin-left: 30px">
          <el-main>
            <Matrix />
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Menu as IconMenu } from "@element-plus/icons-vue";
import Matrix from "./components/Matrix.vue";
import Logo from "./components/icons/Logo.vue";
import Github from "./components/icons/Github.vue";
const activeIndex = ref("1");
</script>

<style scoped>
.el-tag {
  padding: 0 4px;
  margin-right: 5px;
}
.el-icon {
  margin-right: 0;
}
</style>