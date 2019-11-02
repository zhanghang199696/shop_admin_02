<template>
  <div class="rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="rightsList">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="层级" prop="level">
        <template v-slot:default="{row}">
          <p v-show="row.level==='0'">一级</p>
          <p v-show="row.level==='1'">二级</p>
          <p v-show="row.level==='2'">三级</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get(`rights/list`)
    console.log(data)

    if (meta.status === 200) {
      this.rightsList = data
    } else {
      this.$message.error(meta.msg)
    }
  }
}
</script>

<style>
</style>
