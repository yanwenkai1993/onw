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
        <el-menu default-active="activePath"
                 background-color="#545c64"
                 text-color="#fff"
                 :unique-opened="true"
                 active-text-color="#ffd04b"
                 :router="true">
          <el-submenu :index="level1.order + ''"
                      v-for="level1 in menus"
                      :key="level1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{level1.authName}}</span>
            </template>
            <el-menu-item :index="'/' + level2.path"
                          v-for="level2 in level1.children"
                          :key="level2.id">
              <!-- 二级菜单的图标和名称： -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{level2.authName}}</span>
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
  data () {
    return {
      menus: []
    }
  },
  created () {
    this.getMenusList()
  },
  // 进入页面获取当前高亮的哈希值默认高亮
  computed: {
    activePath () {
      const { path } = this.$route
      const pathArr = path.split('/')
      return pathArr.length === 3 ? '/' + pathArr[1] : path
    }
  },
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
    },
    async getMenusList () {
      const res = await this.$http.get('menus')
      this.menus = res.data.data
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
