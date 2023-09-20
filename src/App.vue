<template>
  <div class="main">
    <div class="side"><SideBar></SideBar></div>
    <div class="main-side">
      <div class="head"><Head></Head></div>
      <div class="container"><router-view /></div>
    </div>
  </div>
</template>
<script>
import SideBar from '@/views/common/SideBar.vue'
import Head from '@/views/common/Head.vue'
export default {
  name: 'App',
  components: {
    SideBar,
    Head
  }
}
</script>
<style lang="scss">
#app {
  display: flex;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f9fafe;
}
body {
  margin: 0px;
}
.main {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.side {
  width: 310px;
  min-width: 310px;
}
.main-side {
  flex: 1;
  min-width: 1100px;
  min-height: 100vh;
}
.container {
  flex: 1;
}
.el-dialog__body {
  padding: 0 !important;
}
.el-overlay-dialog {
  margin-left: 310px;
}
.el-dialog {
  width: fit-content !important;
}
.el-dialog__header {
  text-align: left;
}
.el-dialog__header > .el-dialog__title {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 27px; /* identical to
box height */ /* Zion1 */
  color: #002568;
  text-align: left;
  padding-left: 20px;
}
.el-dialog__header > .el-dialog__headerbtn {
  right: 20px;
}
.el-dialog__header > .el-dialog__headerbtn > i {
  font-size: 22px;
  font-weight: 800;
  color: #002568;
}
.el-dialog__header > .el-dialog__headerbtn > i:hover {
  font-size: 22px;
  font-weight: 800;
  color: #002568;
}
.el-dialog__headerbtn:hover .el-dialog__close {
  color: #002568 !important;
}
</style>
