<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right"
                   class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>

    </el-breadcrumb>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="请输入内容"
                  v-model="input5"
                  class="input-with-select">
          <el-button slot="append"
                     icon="el-icon-search"
                     @click="editUsers"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success"
                   plain
                   @click="showUsersAddDialog">添加用户</el-button>
      </el-col>
    </el-row>

    <!--
      表格组件：
        :data="tableData" 指定表格的数据源
        stripe 启用斑马纹（隔行变色效果）

      el-table-column 表格列组件
        prop="date" 对应列内容的字段名，也就是数据源中的属性名
        label="日期" 列标题名称
          如果列没有直接展示数据源中的数据，就可以不用传递prop属性
        width="180" 列宽度
    -->
    <el-table :data="userList"
              stripe
              style="width: 100%">
      <el-table-column prop="username"
                       label="姓名"
                       width="180"></el-table-column>
      <el-table-column prop="email"
                       label="邮箱"
                       width="180"></el-table-column>
      <el-table-column prop="mobile"
                       label="电话"
                       width="180"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state"
                     @change="changeUserState(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"
                     icon="el-icon-edit"
                     plain
                     @click="showUserEditDialog(scope.row)"
                     type="primary"></el-button>
          <el-button size="mini"
                     type="danger"
                     @click="delUser(scope.row.id)"
                     plain
                     icon="el-icon-delete
"></el-button>
          <el-button size="mini"
                     icon="el-icon-check"
                     type="success"
                     plain>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--
      分页组件
        background 设置分页组件背景色
        layout="prev, pager, next" 分页组件结构
        :total="1000" 总条数
        :page-size="3" 每页条数（大小）
        :current-page="10" 当前页
    -->
    <el-pagination background
                   layout="prev, pager, next"
                   :total="total"
                   :page-size="pagesize"
                   :current-page="pagenum"
                   @current-change="changePage"></el-pagination>

    <!-- 添加用户的模态框  -->
    <el-dialog title="添加用户"
               :visible.sync="isShowUserAddDialog"
               @close="hideUserAddDialog">
      <el-form :model="userAddForm"
               :rules="rules"
               label-width="100px"
               ref="userAddFormRef">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="userAddForm.username"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="userAddForm.password"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="userAddForm.email"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="userAddForm.mobile"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="isShowUserAddDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog title="编辑用户"
               :visible.sync="dialogFormVisible">
      <el-form :model="userRedct"
               label-width="100px"
               ref="userAddFormRe">
        <el-form-item label="用户名">
          <el-tag type="info">{{userRedct.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userRedct.email"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="userRedct.mobile"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editAddUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
// 导入axios
import axios from 'axios'

export default {
  // 进入页面，发送请求，获取数据
  created () {
    this.getUserList()
  },

  data () {
    return {
      // 用户列表数据
      userList: [],
      // 总条数：
      total: 0,
      // 当前页：
      pagenum: 1,
      // 每页大小：
      pagesize: 3,

      input5: '',
      isShowUserAddDialog: false,
      userAddForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }, // 显示编辑框
      dialogFormVisible: false,
      userRedct: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },

      // 添加表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 5,
            max: 12,
            message: '用户名长度为5到12个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度为6到12个字符', trigger: 'blur' }
        ],
        email: [
          // 通过 pattern 来指定一个正则表达式来对表单进行验证
          {
            pattern: /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            pattern: /^1(3|4|5|7|8)\d{9}$/,
            message: '手机号码格式不正确',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  methods: {

    getUserList (pagenum = 1, query = '') {
      axios
        .get('http://localhost:8888/api/private/v1/users', {
          params: {
            // 查询条件
            query,
            // 当前页
            pagenum,
            // 每页大小
            pagesize: 3
          },
          // 通过请求头，传递token
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        .then(res => {
          console.log('用户列表数据：', res)
          if (res.data.meta.status === 200) {
            // 获取数据成功
            this.userList = res.data.data.users
            // 设置总条数：
            this.total = res.data.data.total
            // 设置当前页
            this.pagenum = res.data.data.pagenum
          } else {
            // 失败
            // token失效

            // 跳回到登录页面
            this.$router.push('/login')
            // 清除token
            localStorage.removeItem('token')
          }
        })
    },

    // 切换分页，获取当前页数据
    changePage (curPage) {
      // console.log('切换分页了：', curPage)
      this.getUserList(curPage, this.input5)
    },
    // 切换当前用户转态
    async changeUserState (user) {
      try {
        const res = await this.$http.put(`/users/${user.id}/state/${user.mg_state}`, null, {

        })
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: res.data.meta.msg,
            duration: 1000
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.data.meta.msg
          })
        }
      } catch (er) {
        this.$message({
          type: 'error',
          message: '设置转态失败'
        })
      }
    },
    editUsers () {
      this.getUserList(1, this.input5)
    },
    // 隐藏用户添加对话框后清空内容
    hideUserAddDialog () {
      // 重置表单
      this.$refs.userAddFormRef.resetFields()
    },
    showUsersAddDialog () {
      this.isShowUserAddDialog = true
    }, // 添加用户
    async addUser () {
      // 先进行表单验证
      try {
        await this.$refs.userAddFormRef.validate()
        // 在进行添加用户
        const res = await this.$http.post('/users', this.userAddForm)
        // 判断添加成功没有
        if (res.data.meta.status === 201) {
          // 关闭对话框
          this.isShowUserAddDialog = false
          // 提示用户添加成功
          this.$message({
            type: 'success',
            message: res.data.meta.msg
          })
          // 重新渲染页面
          this.getUserList(1, this.input5)
        }
      } catch (err) {
        // 表单验证错误了，不做任何操作
      }
    },
    // 删除用户
    async delUser (id) {
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 弹出选择框以后，在发送请求，删除数据
        const res = await this.$http.delete(`users/${id}`)
        if (res.data.meta.status === 200) {
          // 提示用户删除成功
          this.$message({
            type: 'success',
            message: res.data.meta.msg
          })
          // 重新渲染第一页
          this.getUserList(1, this.input5)
        } else {
          this.$message({
            type: 'warning',
            message: res.data.meta.msg
          })
        }
      } catch (error) {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      }
    },
    // 编辑用户
    showUserEditDialog (users) {
      // 显示对话框
      this.dialogFormVisible = true
      // 把获取到的数据赋值给this.userRedct数组
      for (let key in this.userRedct) {
        this.userRedct[key] = users[key]
      }
    },
    async editAddUser () {
      // 点击的时候，发送请求
      const res = await this.$http.put(`users/${this.userRedct.id}`, { email: this.userRedct.email, mobile: this.userRedct.mobile })
      if (res.data.meta.status === 200) {
        // 关闭对话框
        this.dialogFormVisible = false
        // 提示用户编辑成功
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
        // 刷新当前页
        this.getUserList(this.pagenum, this.input5)
      }
    }
  }
}
</script>

<style>
.breadcrumb {
  line-height: 50px;
  background-color: #d4dae0;
  font-size: 17px;
  padding-left: 10px;
}
</style>
