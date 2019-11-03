<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button @click="showAddDialog" class="addBtn" type="success" plain>添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="rolesList">
      <el-table-column type="expand">
        <template v-slot:default="{row}">
          <el-row class="l1" v-for="item1 in row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag @close="delChildren(row,item1.id)" type="parmary" closable>{{item1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row class="l2" v-for="item2 in item1.children" :key="item2.id">
                <!-- 每个二级都是一行 -->
                <el-col :span="4">
                  <el-tag
                    @close="delChildren(row,item2.id)"
                    type="success"
                    closable
                  >{{item2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="delChildren(row,item3.id)"
                    class="l3"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    type="warning"
                    closable
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button
            @click="modification(row)"
            type="primary"
            icon="el-icon-edit"
            plain
            size="small"
          ></el-button>
          <el-button @click="delBtn(row)" type="danger" icon="el-icon-delete" plain size="small"></el-button>
          <el-button
            @click="showAllocationDialog(row)"
            type="success"
            icon="el-icon-check"
            plain
            size="small"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加模态框 -->
    <el-dialog @close="closeDailog" title="添加" :visible.sync="addDialog" width="40%">
      <el-form :rules="rules" ref="addForm" :model="addForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button @click="addRoles" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改模态框 -->
    <el-dialog title="修改" :visible.sync="modificationDialog" width="40%">
      <el-form :rules="rules" ref="modificationForm" :model="modificationForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="modificationForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="modificationForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modificationDialog = false">取 消</el-button>
        <el-button @click="modificationRoles" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配模态框 -->
    <el-dialog title="分配" :visible.sync="AllocationDialog" width="40%">
      <el-form :rules="rules" ref="modificationForm" :model="modificationForm" label-width="80px">
        <el-tree
        ref="tree"
        :data="data"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id"></el-tree>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AllocationDialog = false">取 消</el-button>
        <el-button @click="Allocation" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rolesList: [],
      addDialog: false,
      modificationDialog: false,
      AllocationDialog: false,
      rId: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      addForm: {
        roleDesc: '',
        roleName: ''
      },
      modificationForm: {
        id: '',
        roleDesc: '',
        roleName: ''
      },
      rules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: ['blur', 'change']
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.rolesList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delBtn (row) {
      try {
        await this.$confirm('您确认要删除吗?', '温馨提示')
        const { meta } = await this.$axios.delete(`roles/${row.id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getRolesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showAddDialog () {
      this.addDialog = true
    },
    closeDailog () {
      this.$refs.addForm.resetFields()
    },
    async addRoles () {
      try {
        // 效验
        await this.$refs.addForm.validate()
        const { meta } = await this.$axios.post('roles', {
          roleName: this.addForm.roleName,
          roleDesc: this.addForm.roleDesc
        })
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.addDialog = false
          this.getRolesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async delChildren (row, id) {
      const { meta, data } = await this.$axios.delete(
        `roles/${row.id}/rights/${id}`
      )
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    modification (row) {
      this.modificationDialog = true
      this.modificationForm.roleDesc = row.roleDesc
      this.modificationForm.roleName = row.roleName
      this.modificationForm.id = row.id
    },
    async modificationRoles () {
      try {
        // 先效验
        await this.$refs.modificationForm.validate()
        const { id, roleName, roleDesc } = this.modificationForm
        const { meta } = await this.$axios.put(`roles/${id}`, {
          roleName,
          roleDesc
        })
        if (meta.status === 200) {
          this.$message.success('更新成功')
          this.modificationDialog = false
          this.getRolesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async showAllocationDialog (row) {
      this.rId = row.id
      this.AllocationDialog = true
      const { meta, data } = await this.$axios.get(`rights/tree`)
      if (meta.status === 200) {
        this.data = data
        const arr = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              arr.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(arr)
      }
    },
    async Allocation () {
      // 获取选中的权限id (全选中的 和 半选中的)
      const ids = this.$refs.tree.getCheckedKeys()
      const halfs = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...ids, ...halfs].join(',')
      const { meta } = await this.$axios.post(`roles/${this.rId}/rights`, { rids })
      if (meta.status === 200) {
        this.AllocationDialog = false
        this.$message.success(meta.msg)
        this.getRolesList()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addBtn {
  margin-bottom: 10px;
}
.l1 {
  padding: 10px 0;
  border-bottom: 1px dotted #ccc;
  &:last-child {
    border-bottom: none;
  }
}
.l2 {
  margin-bottom: 5px;
}
.l3 {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
