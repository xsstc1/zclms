<template>
<div id="systemSetting-content" class="app-container">
  <header class="p20 bg-color-white shadow radius5">
    <div class="mt-5">
      <el-form :inline="true" ref="overDueData" :model="overDueData" class="demo-form-inline" label-width="140px">
        <el-form-item label="单项名称：" class="mt-10" prop="singleName">
          <el-input size="small" v-model="overDueData.singleName" placeholder="请输入单项名称"></el-input>
        </el-form-item>
        <el-form-item label="专业咨询员：" class="mt-10" prop="consultant">
          <el-input size="small" v-model="overDueData.consultant" placeholder="请输入专业咨询员"></el-input>
        </el-form-item>
        <el-form-item label="所属专业：" class="mt-10" prop="professional">
          <el-input size="small" v-model="overDueData.professional" placeholder="请输入所属专业"></el-input>
        </el-form-item>
        <el-form-item label="逾期状态：" class="mt-10" prop="state">
          <el-select v-model="overDueData.state" size="small" placeholder="请选择工作项目类别">
            <el-option label="待处理" value="N"></el-option>
            <el-option label="已处理" value="Y"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
    </div>
    <div class="mt-10 mb-15 tc">
      <el-button @click='overDueSearchBtn' type="primary" class="btn-orange shadow mt-15"><i class="iconfont icon-shiliangzhinengduixiang f13 mr-5"></i>查 询</el-button>
      <el-button @click='resetForm("overDueData")' type="primary" class="btn-indigo shadow mt-15"><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
      <el-button @click="exportWholeSingle" :loading="exportLoading" class="btn-green shadow mt-15" type="primary"><i class="iconfont icon-excel f12 mr-5"></i>导出Excel</el-button>
    </div>
  </header>
  <article class="mt-30">
    <el-table :data="overDueDataContent" v-loading="listLoading" fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
      <el-table-column min-width="170" label="项目名称" prop="projectName"></el-table-column>
      <el-table-column label="项目经理" width="100" align="left" prop="projectManager"></el-table-column>
      <el-table-column label="专业咨询员" width="100" align="left" prop="consultant"></el-table-column>
      <el-table-column label="所属专业" width="120" align="center" prop="professional"></el-table-column>
      <el-table-column label="专业工作名称" width="180" align="left" prop="jobName"></el-table-column>
      <el-table-column label="工作类型" width="120" align="center" prop="jobType"></el-table-column>
      <el-table-column label="专业工作上报截止日期" width="150" align="center" prop="jobCommitDeadlineDateStr"></el-table-column>
      <el-table-column label="流程状态" width="120" align="center" prop="processState"></el-table-column>
      <el-table-column label="逾期(天)" width="120" align="center" prop="consultantJobDueDays"></el-table-column>
    </el-table>
  </article>

  <footer class="mt-30 cb pagination" v-if="total">
    <el-pagination @current-change="overDueCurrentChange" :current-page.sync="pageNum" :page-size="10" layout="prev, pager, next, jumper" :total="total" class="fr">
    </el-pagination>
    <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{total}}条记录</span>
  </footer>
</div>
</template>

<script>
export default {
  data() {
    return {
      exportLoading: false,
      overDueData: {
        page: 1,
        rows: 10,
        singleName: null,
        consultant: null,
        professional: null,
        state: "N"
      },
      pageNum: 1,
      listLoading: false,
      overDueDataContent: [],
      total: 0
    }
  },
  mounted() {
    this.getoverDueList(this.overDueData);
  },
  methods: {
    exportWholeSingle() { //批量导出

      this.$confirm('确定要导出吗？生成文件时间可能较长，请耐心等待。', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {

        const {
          buildExcel
        } = require("../../assets/js/jsonToXlsx.js");

        let exportData = {
          singleName: this.overDueData.singleName ? this.overDueData.singleName.trim() : null,
          consultant: this.overDueData.consultant ? this.overDueData.consultant.trim() : null,
          professional: this.overDueData.professional ? this.overDueData.professional.trim() : null,
          state: this.overDueData.state ? this.overDueData.state : null
        }
        //console.log("exportData",exportData)
        this.$message({
          message: '正在为您生成Excel文件，请稍后……',
          duration: 0
        });
        this.exportLoading = true;

        this.publicFun.httpRequest("get", `wholeprocess/overdue/export`, null, (status, data, message) => {
          if (status == 0) {
            let excelData = [
              ["序号", "项目经理", "专业咨询员", "所属专业", "专业工作名称", "工作类型", "专业工作上报截止日期", "流程状态", "逾期(天)"]
            ];
            for (let item in data) {
              let excelSaveArray = [item != "removeByValue" ? parseInt(item) + 1 : "", data[item].projectManager, data[item].consultant, data[item].professional, data[item].jobName, data[item].jobType, data[item].jobCommitDeadlineDateStr,
                data[item].processState, data[item].consultantJobDueDays
              ]
              excelData.push(excelSaveArray)
            };
            buildExcel(excelData, `全过程逾期专业工作汇总表`);
            this.exportLoading = false;
            this.$message.closeAll();
          } else {
            that.$message.error(message);
            this.exportLoading = false;
          }
        }, exportData);
      }).catch(() => {});
    },
    getoverDueList(params) {
      this.listLoading = true;
      this.publicFun.httpRequest("get", "wholeprocess/overdue/list", null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(() => {
            this.listLoading = false;
          });
          this.overDueDataContent = data.rows;
          this.total = data.total;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    overDueCurrentChange(val) {
      this.overDueData.page = val;
      this.getoverDueList(this.overDueData);
      this.pageNum = val;
    },
    overDueSearchBtn() {
      this.pageNum = 1;
      this.overDueData.singleName = this.overDueData.singleName ? this.overDueData.singleName.trim() : null;
      this.overDueData.consultant = this.overDueData.consultant ? this.overDueData.consultant.trim() : null;
      this.overDueData.professional = this.overDueData.professional ? this.overDueData.professional.trim() : null;
      this.overDueData.state = this.overDueData.state ? this.overDueData.state : null;
      //console.log(this.overDueData)
      this.getoverDueList(this.overDueData);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
