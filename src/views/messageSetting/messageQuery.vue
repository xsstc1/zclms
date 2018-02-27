<template>
<div id="systemSetting-content" class="app-container">
  <header class="p20 bg-color-white shadow radius5">
    <div class="mt-5">
      <el-form :inline="true" ref="smsSearchData" :model="smsSearchData" class="demo-form-inline" label-width="90px">
        <el-form-item label="发送人:" class="mt-10" prop="sendPerson">
          <el-input @keyup.enter.native="smsSearchBtn" size="small" v-model="smsSearchData.sendPerson" placeholder="请输入发送人"></el-input>
        </el-form-item>
        <el-form-item label="收信人:" class="mt-10" prop="receivePerson">
          <el-input @keyup.enter.native="smsSearchBtn" size="small" v-model="smsSearchData.receivePerson" placeholder="请输入收信人"></el-input>
        </el-form-item>
        <el-form-item label="收信人号码:" class="mt-10" prop="receivePhone">
          <el-input @keyup.enter.native="smsSearchBtn" size="small" v-model="smsSearchData.receivePhone" placeholder="请输入收信人号码"></el-input>
        </el-form-item>
        <el-form-item label="短信内容:" class="mt-10" prop="smsContent">
          <el-input @keyup.enter.native="smsSearchBtn" size="small" v-model="smsSearchData.smsContent" placeholder="请输入短信内容"></el-input>
        </el-form-item>
        <el-form-item label="发送状态:" class="mt-10" prop="smsStatus">
          <el-select v-model="smsSearchData.smsStatus" size="small" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="发送成功" value="100"></el-option>
            <el-option label="发送失败" value="200"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="mt-30 mb-15 tc">
      <el-button @click='smsSearchBtn' type="primary" class="btn-orange shadow"><i class="iconfont icon-shiliangzhinengduixiang f13 mr-5"></i>查 询</el-button>
      <el-button @click='resetForm("smsSearchData")' type="primary" class="btn-green shadow"><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
    </div>
  </header>
  <article class="mt-30">
    <el-table :data="smsData" v-loading.body="listLoading" fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
      <el-table-column label="收信人" width="120" prop="receiveName"></el-table-column>

      <el-table-column label="收信人（号码）" width="120" align="left" prop="receivePhone"></el-table-column>
      <el-table-column min-width="180" label="短信内容" align="left" prop="msgContent"></el-table-column>
      <el-table-column label="发送人" width="120" align="center" prop="sendName"></el-table-column>
      <el-table-column label="发送人（号码）" width="120" align="center" prop="sendPhone"></el-table-column>
      <el-table-column label="发送日期" width="180" align="center" prop="sendTime"></el-table-column>
      <el-table-column label="定时发送日期" width="180" align="center" prop="timingTime"></el-table-column>
      <el-table-column align="left" label="发送状态" width="80">
        <template slot-scope="scope">
          {{scope.row.returnValue == "100" ? "成功" : "失败"}}
        </template>
      </el-table-column>
    </el-table>
  </article>

  <footer class="mt-30 cb pagination" v-if="total">
    <el-pagination @current-change="smsCurrentChange" :current-page.sync="pageNum" :page-size="10" layout="prev, pager, next, jumper" :total="total" class="fr">
    </el-pagination>
    <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{total}}条记录</span>
  </footer>
</div>
</template>

<script>
export default {
  data() {
    return {
      smsSearchData: {
        sendPerson: null,
        receivePerson: null,
        receivePhone: null,
        smsContent: null,
        smsStatus: null
      },
      pageNum: 1,
      systemCreatNew: false,
      listLoading: true,
      smsData: [],
      total: 0
    }
  },
  mounted() {
    this.getSmsList(this.pageNum);

  },
  methods: {
    getSmsList(page) {
      this.publicFun.httpRequest("get", `sms/list?page=${page}&rows=10`, null, (status, data, message) => {
        if (status == 0) {
          this.smsData = data.rows;
          this.listLoading = false;
          this.total = data.total;
        } else {
          this.$message.error(message);
        }
      });
    },
    smsCurrentChange(val) {
      this.getSmsList(val);
      this.pageNum = val;
    },
    smsSearchBtn() {
      //console.log(this.smsSearchData);
      let params = {
        page: 1,
        rows: 10,
        sendName:this.smsSearchData.sendPerson?this.smsSearchData.sendPerson.trim():null,
        receiveName:this.smsSearchData.receivePerson?this.smsSearchData.receivePerson.trim():null,
        receivePhone:this.smsSearchData.receivePhone?this.smsSearchData.receivePhone.trim():null,
        msgContent:this.smsSearchData.smsContent?this.smsSearchData.smsContent.trim():null,
        returnValue:this.smsSearchData.smsStatus
      }
      this.publicFun.httpRequest("get", 'sms/list', null, (status, data, message) => {
        if (status == 0) {
          this.smsData = data.rows;
          this.listLoading = false;
          this.total = data.total;
        } else {
          this.$message.error(message);
        }
      },params);
    },
    systemDel() {
      this.$confirm('确认要删除这条公告吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    systemCreat() { //新增公告
      this.systemCreatNew = true;
    },
    systemStop() { //停用
      this.$confirm('您确认要停用这则公告吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="stylus">
#systemSetting-content
  .el-form--inline .el-form-item
    margin-bottom 0
</style>
