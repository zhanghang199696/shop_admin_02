<template>
  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <h1>电商后台管理系统</h1>
      <div class="layout">
        欢迎光临~
        <a href="javascript:;" @click="layout">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
         router
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :default-active="defaultActive"
        >
          <el-submenu :index="item.path" v-for="item in indexList" :key="item.id">
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item1.path" v-for="item1 in item.children" :key="item1.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{item1.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  computed: {
    defaultActive () {
      return this.$route.path.slice(1)
    }
  },
  data () {
    return {
      indexList: []
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get('menus')

    if (meta.status === 200) {
      this.indexList = data
    } else {
      this.$message.error(meta.msg)
    }
  },
  methods: {
    async layout () {
      try {
        await this.$confirm('您确定要退出吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.$message.success('删除成功')
        localStorage.removeItem('token')
        this.$router.push('/login')
      } catch (e) {
        console.log(e)
      }
      // 点击退出删除数据并且返回login
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;
  .el-header {
    background: #d8d8d8;
    display: flex;
    img {
      height: 40px;
      margin-top: 10px;
    }
    h1 {
      color: #545c64;
      flex: 1;
      text-align: center;
      line-height: 60px;
    }
    .layout {
      font-weight: 600;
      line-height: 60px;
      a {
        color: orange;
      }
    }
  }
  .el-aside {
    background: #545c64;
    .el-menu{
      border: none
    }
  }
  .el-main {
    background: #ecf0f1;
  }
}
</style>
