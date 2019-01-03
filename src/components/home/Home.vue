<template>
  <el-container class="home-container">
    <el-header class="home-headr">
      <el-row type='flex'
              align='middle'>
        <el-col :span="6">
          <img src="@/assets/images/logo.png"
               alt="">
        </el-col>
        <el-col>
          <h1>电商后台管理</h1>
        </el-col>
        <el-col :span="6">
          <div class="home-huiyuan">欢迎上海前端31期王者会员
            <a href="javascript:;"
               @click="open2">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px"
                class="home-aside">
        <el-menu default-active="4"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 :router="true">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <!-- 二级菜单的图标和名称： -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>用户列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 子路由出口 -->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    open2 () {
      this.$confirm('是否要退出?', '温馨提示:', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push('/login')
        localStorage.removeItem('token')
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style>
.home-container {
  height: 100%;
  background-color: #eaeef1;
}
.home-headr {
  background-color: #b3c1cd;
}
.home-headr img {
  width: 200px;
}
.home-headr h1 {
  color: #fff;
  text-align: center;
  margin: 0;
}
.home-headr .home-huiyuan {
  min-width: 235px;
}
.home-headr a {
  color: #daa520;
}
.home-aside {
  background-color: #545c64;
}
.el-header {
  padding: 0;
}
</style>
