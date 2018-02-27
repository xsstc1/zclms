<template>
<div id="selectContract">
  <div class="f13 select-user p10">
    <nav class="p15 color-white">
      选择合同
    </nav>
    <header class="mt-30">
      <el-form label-position="right" label-width="40%">
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="8">
            <el-form-item label="合同编号：" class="mt-10 w">
              <el-input v-model="searchParams.contractName" class="w" size="small" placeholder="请输入合同编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="7">
            <el-form-item label="合同名称：" class="mt-10 w">
              <el-input v-model="searchParams.contractNumber" class="w" size="small" placeholder="请输入合同名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="4" class="tc">
            <el-button @click="searchUserBtn" class="btn-orange shadow mt-10" type="primary"><i class="iconfont icon-shiliangzhinengduixiang f14 mr-5"></i>查 询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </header>
    <section class="p20">
      <el-table class="noShadow" :data="selectContract.list" style="width: 100%">
        <el-table-column type="index" width="40" label="序号" align="center"></el-table-column>
        <el-table-column prop="contractNumber" width="100" label="合同编号" align="center"></el-table-column>
        <el-table-column prop="contractName" min-width="160" label="合同名称"></el-table-column>
        <el-table-column prop="sendPackagePerson" width="90" label="发包人" align="center"></el-table-column>
        <el-table-column prop="contractor" width="150" label="承包人" align="center"></el-table-column>
        <el-table-column min-width="120" prop="contractAmount" label="合同金额(元)"></el-table-column>
        <el-table-column prop="signDateStr" width="120" label="签订日期"></el-table-column>
        <el-table-column label="操作" width="60" align="center">
          <template slot-scope="scope">
                <el-button @click="selectBtn(scope.row)" class="color-green" type="text" size="small">选择</el-button>
            </template>
        </el-table-column>
      </el-table>
    </section>
    <footer class="cb pagination p20" v-if="selectContract.total">
      <el-pagination @current-change="changePageSearch" :current-page.sync="searchParams.page" :page-size="10" layout="prev, pager, next, jumper" :total="selectContract.total" class="fr">
      </el-pagination>
      <!-- <span class="fr f14 color-8 pagination-text mr-15 mt-8">每页10条，共{{selectContract.total}}条记录</span> -->
    </footer>
  </div>
</div>
</template>
<script>
export default {
  name: "selectContract",
  data() {
    return {
      selectContract: {
        pageNum: 1,
        list: [],
        total: 0
      },
      searchParams: {
        page: 1,
        rows: 10,
        contractName: null,
        contractNumber: null,
        wholeProcessId:188
      }
    }
  },
  props:['wholeProcessId'],
  mounted() {

    this.searchUser(this.searchParams);
  },
  methods: {
    searchUserBtn() {
      this.searchParams.page = 1;
      this.searchParams.wholeProcessId = this.wholeProcessId;
      this.searchUser(this.searchParams);
    },
    selectBtn(row){
      this.$emit("selectContractData",row)
    },
    searchUserFirst() {
      let params = {
        page: 1,
        rows: 10,
        contractName: null,
        contractNumber: null,
        wholeProcessId:this.wholeProcessId
      }
      this.publicFun.httpRequest("get", 'wholeprocess/searchContracts', null, (status, data, message) => {
        if (status == 0) {
          console.log("搜索出来的人", data);
          this.selectContract.list = data.rows;
          this.selectContract.total = data.total;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    searchUser(params) {
      this.publicFun.httpRequest("get", 'wholeprocess/searchContracts', null, (status, data, message) => {
        if (status == 0) {
          console.log("搜索出来的人", data);
          this.selectContract.list = data.rows;
          this.selectContract.total = data.total;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    changePageSearch(val) {
      this.searchParams.page = val;
      this.searchUser(this.searchParams);
    }
  }
}
</script>
<style lang="stylus">
.select-user
  nav
    background-color #5a6677
  .select-user-role
    width 125px

</style>
