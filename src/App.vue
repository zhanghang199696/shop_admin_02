<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
body,
html,
#app {
  width: 100%;
  height: 100%;
}
#app {
  .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #c5c5c5;
    margin-bottom: 10px;
  }
}
</style>
