<template>
  <div class="categories">
    <!-- 添加按钮 -->
    <el-button @click="showAddDialog" class="addBtn" type="success" plain>添加分类</el-button>
    <!-- 表格 -->
    <el-table
      :data="categoriesList"
      row-key="cat_id"
      v-loading="isLoading"
      element-loading-text="拼命加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.9)"
    >
      <el-table-column label="分类名称" prop="cat_name"></el-table-column>
      <el-table-column label="是否有效">
        <template v-slot:default="{row}">{{!row.cat_deleted?'是':'否'}}</template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template v-solt:default="{row}">
          <el-button plain type="primary" size="small" icon="el-icon-edit"></el-button>
          <el-button plain type="danger" size="small" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加分类模态框 -->
    <el-dialog @close="closeDialog" title="修改" :visible.sync="addDialog" width="40%">
      <el-form :rules="rules" ref="addForm" :model="addForm" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
         <el-cascader props.checkStrictly = true clearable v-model="addForm.cat_pid" :options="options" :props="props"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button @click="addCategories" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categoriesList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      isLoading: false,
      addDialog: false,
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      addForm: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      rules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created () {
    this.getCategoriesList()
  },
  methods: {
    async getCategoriesList () {
      this.isLoading = true
      const { meta, data } = await this.$axios.get('categories', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          type: 3
        }
      })
      if (meta.status === 200) {
        this.categoriesList = data.result
        this.total = data.total
        this.isLoading = false
      } else {
        this.$message.error(meta.msgs)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getCategoriesList()
      this.pagenum = 1
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategoriesList()
    },
    async showAddDialog () {
      this.addDialog = true
      const { meta, data } = await this.$axios.get('categories?type=2')
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async addCategories () {
      try {
        // 先校验
        await this.$refs.addForm.validate()
        const { meta } = await this.$axios.post('categories', {
          cat_name: this.addForm.cat_name,
          cat_pid: this.addForm.cat_pid[this.addForm.cat_pid.length - 1] || 0,
          cat_level: this.addForm.cat_pid.length
        })
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.addDialog = false
          this.getCategoriesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog () {
      this.$refs.addForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.addBtn {
  margin-bottom: 10px;
}
</style>
