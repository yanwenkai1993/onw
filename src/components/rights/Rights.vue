<template>
  <div class="rights">
    <el-table :data="rightList"
              stripe
              style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="authName"
                       label="权限名称"
                       width="180">
      </el-table-column>
      <el-table-column prop="path"
                       label="路径  "
                       width="180">
      </el-table-column>
      <el-table-column prop="level"
                       label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-else-if="scope.row.level === '1'">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  created () {
    this.getRightList()
  },
  methods: {
    // 封装方法获取数据
    async   getRightList () {
      const res = await this.$http.get('/rights/list')
      console.log(res)
      this.rightList = res.data.data
    }
  }
}
</script>

<style>
</style>
