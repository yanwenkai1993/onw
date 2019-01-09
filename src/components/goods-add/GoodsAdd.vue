<template>
  <div class="goods-add">
    <el-steps :active="active"
              finish-status="success">
      <el-step title="第一步"
               description="基本信息"></el-step>

      <el-step title="第二步 "
               description="商品图片"></el-step>

      <el-step title="第三步"
               description="商品内容"></el-step>
    </el-steps>

    <!-- tabs 标签页 -->
    <el-tabs v-model="activeName"
             @tab-click="activeList"
             tabPosition="left">
      <el-tab-pane label="基本信息"
                   name="first">
        <el-form :model="goodsAddForm"
                 label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="goodsAddForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="goodsAddForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="goodsAddForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="goodsAddForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader :options="cateList"
                         v-model="goodsAddForm.goods_cat_add"
                         :props="{
              label: 'cat_name',
              value: 'cat_id'
            }">
            </el-cascader>
          </el-form-item>
          <el-form-item label="是否热销">
            <el-radio v-model="goodsAddForm.is_promote"
                      :label="true">
              是
            </el-radio>
            <el-radio v-model="goodsAddForm.is_promote"
                      :label="false">
              否
            </el-radio>
          </el-form-item>

          <el-button type="primary"
                     @click="next(1,'second')">下一步</el-button>

        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片"
                   name="second">
        <el-upload class="upload-demo"
                   action="http://localhost:8888/api/private/v1/upload"
                   :headers="headers"
                   :on-success="onSuccess"
                   list-type="picture-card">
          <el-button size="small"
                     type="primary">点击上传</el-button>
          <div slot="tip"
               class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary"
                   @click="next(2,'fourth')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容"
                   name="fourth">
        <quill-editor v-model="goodsAddForm.goods_introduce"> </quill-editor>
        <el-button type="primary"
                   @click="addGoods">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  created () {
    this.getCateList()
  },
  data () {
    return {
      active: 0,
      activeName: 'first',
      goodsAddForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        goods_cat_add: [],
        is_promote: false
      },
      cateList: [],
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },

  methods: {

    activeList (tab) {
      this.active = tab.index - 0
    },
    next (active, activeName) {
      this.active = active
      this.activeName = activeName
    },
    // 封装一个方法在进入页面获取级联菜单的数据
    async getCateList () {
      const res = await this.$http.get('/categories', { params: { type: 3 } })
      this.cateList = res.data.data
    },
    onSuccess (response, file, fileList) {
      this.goodsAddForm.pics.push({ pic: response.data.tmp_path })
    },
    async  addGoods () {
      /* eslint-disable*/
      const {
        goods_name,
        goods_cat_add,
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics,
        is_promote
      } = this.goodsAddForm
      const res = await this.$http.post('/goods', {
        goods_name,
        goods_cat: goods_cat_add.join(','),
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics,
        is_promote
      })
      this.$message({
        type: 'success',
        message: res.data.meta.msg
      })
      this.$router.push('/goods')
    }
  }
}
</script>

<style>
</style>
