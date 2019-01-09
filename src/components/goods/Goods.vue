<template>
  <div class="goods">
    <el-button type="success"
               plain
               @click="$router.push('/goods-add')">添加商品</el-button>
    <el-table :data="goodsList"
              stripe
              style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name"
                       label="商品名称"
                       width="180">
      </el-table-column>
      <el-table-column prop="goods_price"
                       label="商品价格"
                       width="180">
      </el-table-column>
      <el-table-column prop="goods_weight"
                       label="商品重量">
      </el-table-column>
      <el-table-column prop="add_time"
                       label="创建时间">
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
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页功能 -->
    <el-pagination background
                   layout="prev, pager, next"
                   :total="total"
                   :page-size="pagesize"
                   :current-page="pagenum-0"
                   @current-change="changePage">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      total: 0,
      pagenum: 1,
      pagesize: 5
    }
  },
  created () {
    const pagenum = this.$route.params.page - 0
    this.getGoodsLsit(pagenum)
  },
  methods: {
    async getGoodsLsit (pagenum = 1) {
      const res = await this.$http.get('/goods', {
        params: {
          query: '',
          pagenum,
          pagesize: 5
        }
      })
      console.log(res)
      const { goods, total, pagenum: curPage } = res.data.data
      this.goodsList = goods
      this.total = total
      this.pagenum = curPage
    },
    changePage (curPage) {
      // 获取当前的页数
      this.getGoodsLsit(curPage)
      // 根据页数跳转
      this.$router.push(`/goods/${curPage}`)
    }

  }
}
</script>

<style>
</style>
