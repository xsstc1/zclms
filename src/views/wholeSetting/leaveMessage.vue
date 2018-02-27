<template>
<div class="app-container">
  <header class="p20 bg-color-white shadow radius5">
    <div class="mt-5">
      <el-form :inline="true" ref="overDueSingleData" :model="overDueSingleData" class="demo-form-inline" label-width="120px">
        <el-form-item label="工作类型：" class="mt-10" prop="name">
          <el-input class="w" size="small" placeholder="请输入工作类型"></el-input>
        </el-form-item>
        <el-form-item label="回复内容：" class="mt-10" prop="consultant">
          <el-input class="w" size="small" placeholder="请输入工作类型"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="mt-30 mb-15 tc">
      <el-button @click='overDueSingleSearchBtn' type="primary" class="btn-orange shadow"><i class="iconfont icon-shiliangzhinengduixiang f13 mr-5"></i>查 询</el-button>
      <el-button @click='resetForm("overDueSingleData")' type="primary" class="btn-blue shadow mr-50"><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
      <el-button class="btn-green shadow mt-20" type="primary" @click="addProjectWorkDialog=true"><i class="iconfont icon-iconfont707 f12 mr-5"></i>新增留言</el-button>

    </div>
  </header>
  <article class="mt-30">
    <el-table :data="overDueSingleDataContent" v-loading="listLoading" fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
      <el-table-column label="业主留言" width="230" prop="name"></el-table-column>
      <el-table-column label="留言时间" width="220" align="left" prop="consultant"></el-table-column>
      <el-table-column label="留言人" width="150" align="left" prop="firstDraftTimeStr"></el-table-column>
      <el-table-column label="回复留言" width="150" align="left" prop="firstDraftCheckTimeStr"></el-table-column>
      <el-table-column label="回复时间" width="150" align="left" prop="processState"></el-table-column>
      <el-table-column label="回复人" width="120" align="center" prop="delayTimeStr"></el-table-column>
      <el-table-column label="流程状态" align="left" prop="delayReason"></el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
              <el-button v-if="editBtnShow" @click="overDueBtn(scope.row)" class="color-green" type="text" size="small">查看</el-button>
              <el-button v-if="editBtnShow" @click="overDueBtn(scope.row)" class="color-green" type="text" size="small">工作进度</el-button>
          </template>
      </el-table-column>
    </el-table>
  </article>

  <footer class="mt-30 cb pagination" v-if="total">
    <el-pagination @current-change="overDueCurrentChange" :current-page.sync="pageNum" :page-size="10" layout="prev, pager, next, jumper" :total="total" class="fr">
    </el-pagination>
    <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{total}}条记录</span>
  </footer>
  <!-- 新增-项目工作信息 -->
  <el-dialog :visible.sync="addProjectWorkDialog" size="small" custom-class="icms-dialog">
    <span slot="title">新增 - 留言信息</span>
    <div class="dialog-box">
      <el-form :model="changeOverDueData" ref="changeOverDueData" label-position="right" label-width="110px" :rules="changeOverDueRules">
        <div class="icms-dialog-content  pr mt-15">
          <nav class="pa">
            业主留言
          </nav>
          <el-row :gutter="16">
            <el-col :span="14">
              <el-form-item label="留言内容：" class="mt-10 w" prop="reason">
                <el-input class="w" v-model="newProjectData.projectName" size="small" placeholder="请输入留言内容" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="10">
              <el-form-item label="留言人：" class="mt-10 w" prop="reason">
                <el-input class="w" v-model="newProjectData.projectName" size="small" placeholder="请输入留言人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="留言时间：" class="mt-10 w" prop="date">
                <el-date-picker :editable="false" v-model="changeOverDueData.date" type="date" placeholder="请选择留言时间" clearable></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button class="btn-red shadow" type="primary" @click='saveOverDue("changeOverDueData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='resetForm("changeOverDueData")'><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  filters: {
    setSingleDownloadUrl(url) {
      return `${location.origin}/icms/cost/single/download?id=${url}`;
    }
  },
  data() {
    return {
      addProjectWorkDialog: false,
      overDueSingleData: {
        page: 1,
        rows: 10,
        name: null,
        consultant: null,
        professional: null,
        state: "N"
      },
      editBtnShow: false,
      changeOverDueData: {
        date: '',
        reason: ''
      },
      changeOverDueRules: {
        date: [{
          required: true,
          message: '请选择延期日期'
        }],
      },
      newProjectData: {
        // 项目合同信息
        contractNumber: '',
        contractType: '1',
        contractStatus: '签订',
        contractAmount: '',
        contractPaymentMethod: '',
        // 项目基本信息
        projectName: '',
        engineeringPurpose: '',
        engineeringStructure: '',
        measurementUnit: '',
        consultingType: '',
        workProjectCategory: '',
        approveType: '',
        delegateUnitName: '',
        delegateUnitContact: '',
        delegateUnitPhone: '',
        investmentProperties: '',
        projectLocation: '',
        informationReceivedDateStr: '',
        enrollmentDateStr: new Date(),
        agreedJobCompletionDateStr: '',
        projectDetailRequirements: '',
        technicalDirector: '',
        projectAssignPerson: '',
        // 建设单位信息
        unitName: '',
        unitContact: '',
        unitPhone: '',
        // 项目送审信息
        forCheckedShow: false,
        constructionUnitName: '',
        reviewAmount: '',
        contractEstimationPrice: '',
        // 档案资料
        costFiles: []
      },
      pageNum: 1,
      listLoading: false,
      overDueSingleDataContent: [],
      total: 0,
      overDueListData: [],
      overDueListLoading: false,
      singleOverdueId: null
    }
  },
  mounted() {
    this.getoverDueList(this.overDueSingleData);
  },
  methods: {
    overDueBtn(row) {
      this.overDueSingleDialog = true;
      this.changeOverDueData = {
        date: '',
        reason: ''
      }
      this.singleOverdueId = row.id;
      this.getHistoryOverDue(row.id);
    },
    saveOverDue(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let postOverDueData = {
            delayReason: this.changeOverDueData.reason,
            delayTimeStr: this.changeOverDueData.date ? this.publicFun.formatDateShort(this.changeOverDueData.date) : null,
            singleOverdueId: this.singleOverdueId
          }
          this.publicFun.httpRequest("post", 'cost/overdue/saveDelay', postOverDueData, (status, data, message) => {
            if (status == 0) {
              this.$message({
                type: 'success',
                message: message
              });
              this.getHistoryOverDue(this.singleOverdueId);
              this.$refs["overDueSingleData"].resetFields();
              this.getoverDueList(this.overDueSingleData);
            } else {
              this.$message.error(message);
            }
          });
        } else {
          this.$message.error("请填写必填项");
          return false;
        }
      });
    },
    getHistoryOverDue(id) {
      this.overDueListLoading = true;
      this.publicFun.httpRequest("get", `cost/overdue/delayList?singleOverdueId=${id}`, null, (status, data, message) => {
        if (status == 0) {
          this.overDueListLoading = false;
          this.overDueListData = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    getoverDueList(params) {
      this.listLoading = true;
      this.publicFun.httpRequest("get", "cost/overdue/listSingles", null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(() => {
            this.listLoading = false;
          });
          this.overDueSingleDataContent = data.rows;
          this.total = data.total;
          if (this.overDueSingleData.state == "N") {
            this.editBtnShow = true;
          } else {
            this.editBtnShow = false;
          }
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    overDueCurrentChange(val) {
      this.overDueSingleData.page = val;
      this.getoverDueList(this.overDueSingleData);
      this.pageNum = val;
    },
    overDueSingleSearchBtn() {
      this.pageNum = 1;
      this.overDueSingleData.name = this.overDueSingleData.name ? this.overDueSingleData.name.trim() : null;
      this.overDueSingleData.consultant = this.overDueSingleData.consultant ? this.overDueSingleData.consultant.trim() : null;
      //console.log(this.overDueSingleData)
      this.getoverDueList(this.overDueSingleData);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
