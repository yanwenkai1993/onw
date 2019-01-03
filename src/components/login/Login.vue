<template>
  <div class="login">
    <el-row type="flex"
            justify="center"
            align="middle"
            class="row-bg">
      <el-col :xs="14"
              :sm="12"
              :md="10"
              :lg="8"
              :xl="6">
        <el-form :model="loginForm"
                 :rules="rules"
                 ref="loginForm"
                 label-width="100px"
                 label-position="top"
                 class="login-form">
          <el-form-item label="用户名"
                        prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码"
                        prop="password">
            <el-input v-model="loginForm.password"
                      type="password"> </el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary"
                       @click="submitForm('loginForm')">登录</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      loginForm: {
        // 用户名
        username: 'admin',
        // 密码
        password: '123456'
      },

      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      // 通过$refs获取到组件对象，并且调用组件的validate方法，进行表单校验
      this.$refs[formName].validate(valid => {
        if (!valid) { // 取反就是校验失败
          // 校验失败代码不做任何改变，因为错误信息已经给了用户
          return false
        }
        // 表单校验成功获取用户的账号密码进行存储
        axios.post('http://localhost:8888/api/private/v1/login', this.loginForm).then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            // 把token保存到localStorage中
            localStorage.setItem('token', res.data.data.token)
            // 登录成功，跳转首页
            this.$router.push({ name: 'home' })
          } else {
            // 登录失败，意思用户错误信息
            this.$message({
              message: res.data.meta.msg,
              type: 'error',
              duration: 1000
            })
          }
        })
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFieds()
    }
  }
}
</script>

<style>
.login {
  height: 100%;
  background-color: #2d434c;
}
.row-bg {
  height: 100%;
}
.login-form {
  padding: 30px 20px;
  background-color: #fff;
  border-radius: 10px;
  min-width: 380px;
}
</style>
