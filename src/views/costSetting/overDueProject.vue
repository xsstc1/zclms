<template>
<div id="systemSetting-content" class="app-container">
  <header class="p20 bg-color-white shadow radius5">
    <div class="mt-5">
      <el-form :inline="true" ref="overDueData" :model="overDueData" class="demo-form-inline" label-width="140px">
        <el-form-item label="项目名称：" class="mt-10" prop="projectName">
          <el-input @keyup.enter.native="overDueSearchBtn" size="small" v-model="overDueData.projectName" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目负责人：" class="mt-10" prop="projectDirector">
          <el-input @keyup.enter.native="overDueSearchBtn" size="small" v-model="overDueData.projectDirector" placeholder="请输入单项工程名称"></el-input>
        </el-form-item>
        <el-form-item label="工作项目类别：" class="mt-10" prop="workProjectCategory">
          <el-select v-model="overDueData.workProjectCategory" size="small" placeholder="请选择所属专业" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="标底编制" value="1"></el-option>
            <el-option label="标底编制（全过程）" value="2"></el-option>
            <el-option label="材料设备询价" value="3"></el-option>
            <el-option label="结算审核" value="4"></el-option>
            <el-option label="预算编制" value="5"></el-option>
            <el-option label="内审" value="6"></el-option>
            <el-option label="标底（零星）" value="7"></el-option>
            <el-option label="清单编制" value="8"></el-option>
            <el-option label="全过程" value="9"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="逾期状态：" class="mt-10" prop="state">
          <el-select v-model="overDueData.state" size="small" placeholder="请选择所属专业" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="待处理" value="N"></el-option>
            <el-option label="已处理" value="Y"></el-option>
          </el-select>
        </el-form-item>
        <span class="disinblock">
        <el-form-item label="签发日期：" class="mt-10" prop="signTimeFrom">
          <el-date-picker :editable="false" v-model="overDueData.signTimeFrom" type="date" placeholder="选择日期" clearable></el-date-picker>
        </el-form-item>
        <span class="ml-10 mr-15 mt-15 disinblock">至</span>
        <el-form-item class="mt-10 block-xs" prop="signTimeTo">
          <el-date-picker :editable="false" v-model="overDueData.signTimeTo" type="date" placeholder="选择日期" clearable></el-date-picker>
        </el-form-item>
        </span>
      </el-form>
    </div>
    <div class="mt-10 mb-15 tc">
      <el-button @click='overDueSearchBtn' type="primary" class="btn-orange shadow mt-15"><i class="iconfont icon-shiliangzhinengduixiang f13 mr-5"></i>查 询</el-button>
      <el-button @click='resetForm("overDueData")' type="primary" class="btn-indigo shadow mt-15"><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
      <el-button @click="exportBatch" :loading="exportLoading" class="btn-green shadow mt-15" type="primary"><i class="iconfont icon-excel f12 mr-5"></i>导出Excel</el-button>
    </div>
  </header>
  <article class="mt-30">
    <el-table :data="overDueDataContent" v-loading="listLoading" fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
      <el-table-column label="项目名称" width="220" prop="projectName"></el-table-column>
      <el-table-column label="报告编号" width="220" align="left" prop="reportNumbers"></el-table-column>
      <el-table-column label="委托单位名称" min-width="180" align="left" prop="delegateUnitName"></el-table-column>
      <el-table-column label="项目负责人" width="120" align="center" prop="projectDirector"></el-table-column>
      <el-table-column label="工作项目类别" width="150" align="left" prop="workProjectCategoryStr"></el-table-column>
      <el-table-column label="流程状态" width="120" align="center" prop="processState"></el-table-column>
      <el-table-column label="签发日期" width="120" align="center" prop="signTimeStr"></el-table-column>
      <el-table-column label="逾期(天)" width="120" align="center" prop="dueDays"></el-table-column>
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
        projectName: null,
        projectDirector: null,
        workProjectCategory: null,
        state: null,
        signTimeFrom: null,
        signTimeTo: null
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
    exportBatch() { //批量导出
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
          projectName: this.overDueData.projectName.trim(),
          projectDirector: this.overDueData.projectDirector.trim(),
          workProjectCategory: this.overDueData.workProjectCategory,
          state: this.overDueData.state,
          signTimeFrom: this.overDueData.signTimeFrom,
          signTimeTo: this.overDueData.signTimeTo
        }
        this.$message({
          message: '正在为您生成Excel文件，请稍后……',
          duration: 0
        });
        this.exportLoading = true;
        this.publicFun.httpRequest("get", `cost/overdue/exportCosts`, null, (status, data, message) => {
          if (status == 0) {
            console.log("Excel数据", data)
            let excelData = [
              ["序号", "项目名称", "报告编号", "委托单位名称", "项目负责人", "工作项目类别", "流程状态", "领导签发日期", "逾期(天)"],
            ];
            for (let item in data) {
              let excelSaveArray = [item != "removeByValue" ? parseInt(item) + 1 : "", data[item].projectName, data[item].reportNumbers, data[item].delegateUnitName, data[item].projectDirector, data[item].workProjectCategoryStr, data[item].processState,
                data[item].signTimeStr,
                data[item].dueDays
              ]
              excelData.push(excelSaveArray)
            };
            buildExcel(excelData, `逾期项目数据汇总表`);
            console.log("导出的信息", excelData)
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
      this.publicFun.httpRequest("get", "cost/overdue/listCosts", null, (status, data, message) => {
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
      this.overDueData.projectName = this.overDueData.projectName ? this.overDueData.projectName.trim() : null;
      this.overDueData.projectDirector = this.overDueData.projectDirector ? this.overDueData.projectDirector.trim() : null;
      this.overDueData.signTimeFrom = this.overDueData.signTimeFrom ? this.publicFun.formatDateShort(this.overDueData.signTimeFrom) : null;
      this.overDueData.signTimeTo = this.overDueData.signTimeTo ? this.publicFun.formatDateShort(this.overDueData.signTimeTo) : null;
      this.getoverDueList(this.overDueData);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
