<template>
  <div class="roles">
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right"
                   class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>

    </el-breadcrumb>
    <!-- 表单 -->
    <el-table :data="roleList"
              stripe
              style="width: 100%">
      <!-- 点击显示权限 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row class="level1"
                  v-for="level1 in scope.row.children"
                  :key="level1.id">
            <el-col :span="4">
              <el-tag closable
                      @close="delRolesDialog(scope.row.id,level1.id)">{{level1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row class="level2"
                      v-for="level2 in level1.children"
                      :key="level2.id">
                <el-col :span="4">
                  <el-tag type="success"
                          closable
                          @close="delRolesDialog(scope.row.id,level2.id)">{{level2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag class="level3"
                          v-for="level3 in level2.children"
                          :key="level3.id"
                          closable
                          type="warning"
                          @close="delRolesDialog(scope.row.id,level3.id)">
                    {{level3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="roleName"
                       label="角色名称"
                       width="180">
      </el-table-column>
      <el-table-column prop="roleDesc"
                       width="200"
                       label="描述">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="primary"
                     plain
                     icon="el-icon-edit"></el-button>
          <el-button size="mini"
                     type="danger"
                     plain
                     icon="el-icon-delete"></el-button>
          <el-button type="success"
                     plain
                     size="mini"
                     icon="el-icon-check"
                     @click="showRightsDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出权限框 -->
    <el-dialog title="角色授权"
               :visible.sync="dialogVisible">
      <el-tree :data="rightsTree"
               show-checkbox
               :default-expand-all="true"
               node-key="id"
               ref="tree"
               :props="defaultProps">
      </el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="hideRightsDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      rightsTree: [],

      dialogVisible: false,

      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  created () {
    this.getRoleList()
    this.getRightsTree()
  },
  methods: {
    // 封装一个方法用来渲染页面
    async getRoleList () {
      const res = await this.$http.get('/roles')

      this.roleList = res.data.data
    },
    // 封装一个方法在进入页面获取权限列表
    async getRightsTree () {
      const res = await this.$http.get('/rights/tree')

      this.rightsTree = res.data.data
    },
    showRightsDialog (curRole) {
      this.dialogVisible = true
      // 获取角色id
      this.curRolId = curRole.id

      // 打开对话框的时候，应该选中当前角色拥有的权限，选中的时候，只需要选中子节点就可以设置父节点的转态
      // 创建空数组来保存所有节点的id
      const checkedkeys = []
      // 获取到所有的子节点

      curRole.children.forEach(level1 => {
        level1.children.forEach(level2 => {
          level2.children.forEach(level3 => {
            checkedkeys.push(level3.id)
          })
        })
      })
      this.$nextTick(() => {
        // 设置选中的转态
        this.$refs.tree.setCheckedKeys(checkedkeys)
      })
    },
    // 点击确定按钮的时候，获取到所有的选择的id，二级和一级的选择id也要获取，因为他们是嵌套关系，没有一级就没有二级
    async hideRightsDialog () {
      // console.log(this.$refs.tree.getCheckedKeys())
      // console.log(this.$refs.tree.getHalfCheckedKeys())
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      const allkeys = [...checkedKeys, ...halfCheckedKeys]
      const res = await this.$http.post(`roles/${this.curRolId}/rights`, {
        rids: allkeys.join(',')
      })
      // 成功后关闭对话框
      this.dialogVisible = false
      // 刷新页面
      this.getRoleList()
      // 提示用户分配成功
      this.$message({
        type: 'success',
        message: res.data.meta.msg
      })
    },
    async delRolesDialog (roleId, rightId) {
      // console.log(roleId, rightId)
      const res = await this.$http.delete(`roles/${roleId}/rights/${rightId}`)
      console.log(res)
      if (res.data.meta.status === 200) {
        // 提示用户删除成功
        this.$message({
          type: 'error',
          message: res.data.meta.msg,
          duration: 1000
        })
        // 刷新页面
        this.getRoleList()
      }
    }
  }
}
</script>

<style>
.level1 {
  border-bottom: 1px dashed #ccc;
  padding: 10px 0;
}
.level1:last-child {
  border-bottom: 0;
}
.level2 {
  margin: 5px 0;
}
.level3 {
  margin: 4px;
}
.breadcrumb {
  line-height: 50px;
  background-color: #d4dae0;
  font-size: 17px;
  padding-left: 10px;
}
</style>
