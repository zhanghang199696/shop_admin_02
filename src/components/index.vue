<template>
  <el-container class="index">
  <el-header>
    <div class="logo">
      <img src="../assets/logo.png" alt="">
    </div>
    <h1>电商后台管理系统</h1>
    <div class="layout">
      欢迎光临~<a href="javascript:;" @click="layout">退出</a>
    </div>
  </el-header>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-main>Main</el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  methods: {
    layout () {
      // 点击退出删除数据并且返回login
      this.$confirm('您确定要退出吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          $message: '删除成功',
          duration: 1000
        })
        localStorage.removeItem('token')
        this.$router.push('/login')
      }).catch(() => {
        console.log('1')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.index{
  width: 100%;
  .el-header{
    background:#d8d8d8;
    display: flex;
    img{
      height: 40px;
      margin-top: 10px;
    }
    h1{
      color: #545c64;
      flex: 1;
      text-align: center;
      line-height: 60px;
    }
    .layout{
      font-weight: 600;
      line-height: 60px;
      a{
        color: orange;
      }
    }

  }
  // 头部全部完成 接下来开始做侧边栏和main栏
}

</style>
