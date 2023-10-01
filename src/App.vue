<template>
  <div class="common-layout">
    <el-container style="height: 100vh">
      <el-aside width="350px" style="margin-top: 20vh">
        <el-row justify="center" style="margin-bottom: 10vh">
          <el-avatar :size="150" src="https://empty">
            <h1>Rua</h1>
          </el-avatar>
        </el-row>
        <el-menu default-active="1" class="el-menu-vertical-demo">
          <el-menu-item index="1">
            <el-icon><icon-menu /></el-icon>
            <span>Matrix</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <Matrix />
        </el-main>
        <el-footer> </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
import Matrix from "./components/Matrix.vue";
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