<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-input v-model="query" placeholder="请输入搜索关键字" class="input-with-select">
      <el-button @click="seach" slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <!-- 添加按钮 -->
    <el-button @click="showAddDialog" type="success" plain>添加用户</el-button>
    <!-- 表格 -->
    <el-table :data="userList">
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default="{row}">
          <el-switch
            @change="stateUser(row)"
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button
            @click="showEditDialog(row)"
            type="primary"
            plain
            class="el-icon-edit"
            size="small"
          ></el-button>
          <el-button @click="delUser(row)" type="danger" plain class="el-icon-delete" size="small"></el-button>
          <el-button
            @click="showAllocationDialog(row)"
            type="success"
            plain
            class="el-icon-check"
            size="small"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户的模态框 -->
    <el-dialog title="添加用户" :visible.sync="dialogAdd" width="40%">
      <el-form :rules="rules" ref="addForm" :model="addForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false">取 消</el-button>
        <el-button @click="addUsers" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改模态框 -->
    <el-dialog title="修改用户" :visible.sync="dialogEdit" width="40%">
      <el-form :rules="rules" ref="EditForm" :model="EditForm" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{EditForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="EditForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="EditForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit = false">取 消</el-button>
        <el-button @click="amendUser" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限模态框 -->
    <el-dialog title="分配用户" :visible.sync="dialogAllocation" width="40%">
      <el-form :rules="rules" ref="EditForm" :model="AllocationForm" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{AllocationForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="AllocationForm.rid" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAllocation = false">取 消</el-button>
        <el-button @click="allocationUser" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userList: [],
      pagenum: 1,
      pagesize: 2,
      total: 0,
      query: '',
      dialogAdd: false,
      dialogEdit: false,
      dialogAllocation: false,
      options: [],
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      EditForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      AllocationForm: {
        id: '',
        rid: '',
        username: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['change', 'blur']
          },
          {
            min: 3,
            max: 12,
            message: '长度在3到12位',
            trigger: ['change', 'blur']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['change', 'blur']
          },
          {
            min: 3,
            max: 12,
            message: '长度在3到12位',
            trigger: ['change', 'blur']
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: ['change', 'blur']
          }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确手机号',
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { meta, data } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })

      if (meta.status === 200) {
        this.total = data.total
        this.userList = data.users
      } else {
        this.$message.error(meta)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },
    async delUser (row) {
      try {
        await this.$confirm('您确定要删除此用户吗？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${row.id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.userList.length === 1) {
            this.pagenum--
          }
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    seach () {
      this.getUserList()
    },
    showAddDialog () {
      this.dialogAdd = true
    },
    async addUsers () {
      try {
        await this.$refs.addForm.validate()
        const { meta } = await this.$axios.post('users', this.addForm)
        console.log(meta)

        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.dialogAdd = false
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showEditDialog (row) {
      this.dialogEdit = true
      this.EditForm.username = row.username
      this.EditForm.mobile = row.mobile
      this.EditForm.email = row.email
      this.EditForm.id = row.id
    },
    async amendUser () {
      try {
        // 先校验
        this.$refs.EditForm.validate()
        const { meta } = await this.$axios.put(`users/${this.EditForm.id}`, {
          email: this.EditForm.email,
          mobile: this.EditForm.mobile
        })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.dialogEdit = false
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async stateUser (row) {
      const { meta } = await this.$axios.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.getUserList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    async showAllocationDialog (row) {
      this.dialogAllocation = true
      this.AllocationForm.username = row.username
      this.AllocationForm.id = row.id

      const res = await this.$axios.get(`users/${row.id}`)
      console.log(res)
      if (res.meta.status === 200) {
        this.AllocationForm.rid = res.data.rid === -1 ? '' : res.data.rid
      } else {
        this.$message.earror(res.meta.msg)
      }

      const { data, meta } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async allocationUser () {
      const { id, rid } = this.AllocationForm
      const { meta } = await this.$axios.put(`users/${id}/role`, { rid })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.dialogAllocation = false
        this.getUserList()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.users {
  .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #c5c5c5;
    margin-bottom: 10px;
  }
  .input-with-select {
    width: 300px;
    margin-right: 20px;
  }
  .el-table {
    margin-top: 10px;
  }
}
</style>
