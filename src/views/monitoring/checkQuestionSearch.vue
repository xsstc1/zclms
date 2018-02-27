<template>
<div id="systemSetting-content" class="app-container">
  <header class="p20 bg-color-white shadow radius5">
    <div class="mt-5">
      <el-form :inline="true" ref="monitoringData" :model="monitoringData" class="demo-form-inline" label-width="140px">
        <el-form-item label="项目名称：" class="mt-10" prop="projectName">
          <el-input size="small" v-model="monitoringData.projectName" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="专业咨询员：" class="mt-10" prop="consultant">
          <el-input size="small" v-model="monitoringData.consultant" placeholder="请输入专业咨询员"></el-input>
        </el-form-item>

        <el-form-item label="专业：" class="mt-10" prop="professional">
          <el-select v-model="monitoringData.professional" size="small" placeholder="请选择专业">
            <el-option label="全部" value=""></el-option>
            <el-option label="土建" value="土建"></el-option>
            <el-option label="装饰" value="装饰"></el-option>
            <el-option label="安装" value="安装"></el-option>
            <el-option label="市政" value="市政"></el-option>
            <el-option label="钢筋" value="钢筋"></el-option>
            <el-option label="景观绿化" value="景观绿化"></el-option>
          </el-select>
        </el-form-item>
        <span class="disinblock">
        <el-form-item label="签发日期：" class="mt-10" prop="signTimeFrom">
          <el-date-picker :editable="false" v-model="monitoringData.signTimeFrom" type="date" placeholder="请选择日期" clearable></el-date-picker>
        </el-form-item>
        <span class="ml-10 mr-15 mt-15 disinblock">至</span>
        <el-form-item class="mt-10 block-xs" prop="signTimeTo">
          <el-date-picker :editable="false" v-model="monitoringData.signTimeTo" type="date" placeholder="请选择日期" clearable></el-date-picker>
        </el-form-item>
        </span>
      </el-form>
    </div>
    <div class="mt-10 mb-15 tc">
      <el-button @click='monitoringSearchBtn' type="primary" class="btn-orange shadow mt-15"><i class="iconfont icon-shiliangzhinengduixiang f13 mr-5"></i>查 询</el-button>
      <el-button @click='resetForm("monitoringData")' type="primary" class="btn-indigo shadow mt-15"><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
      <el-button @click="exportWholeSingle" :loading="exportLoading" class="btn-green shadow mt-15" type="primary"><i class="iconfont icon-excel f12 mr-5"></i>导出Excel</el-button>
    </div>
  </header>
  <article class="mt-30">
    <el-table :data="monitoringDataContent" v-loading="listLoading" fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
      <el-table-column width="120" label="所属专业" prop="professional"></el-table-column>
      <el-table-column label="专业咨询员" width="150" align="left" prop="consultant"></el-table-column>
      <el-table-column min-width="190" label="项目名称" prop="projectName"></el-table-column>
      <el-table-column label="报告编号" min-width="100" align="left">
        <template slot-scope="scope">
        {{scope.row.reportNumbers?scope.row.reportNumbers:"--"}}
        </template>
      </el-table-column>
      <el-table-column label="项目负责人" width="100" align="left">
        <template slot-scope="scope">
        {{scope.row.projectDirector?scope.row.projectDirector:"--"}}
        </template>
      </el-table-column>
      <el-table-column label="签发日期" width="150" align="center">
        <template slot-scope="scope">
        {{scope.row.signTimeStr?scope.row.signTimeStr:"--"}}
        </template>
      </el-table-column>
      <el-table-column label="问题汇总" min-width="150" align="left">
        <template slot-scope="scope">
        {{scope.row.opinion?scope.row.opinion:"--"}}
        </template>
      </el-table-column>
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
      monitoringData: {
        page: 1,
        rows: 10,
        projectName: '',
        consultant: '',
        professional: '',
        signTimeFrom:'',
        signTimeTo:''
      },
      pageNum: 1,
      listLoading: false,
      monitoringDataContent: [],
      total: 0
    }
  },
  mounted() {
    this.getMonitoringList(this.monitoringData);
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
          singleName : this.monitoringData.projectName ? this.monitoringData.projectName.trim() : null,
          professional : this.monitoringData.professional,
          consultant : this.monitoringData.consultant ? this.monitoringData.consultant.trim() : null,
          signTimeFrom : this.monitoringData.signTimeFrom ? this.publicFun.formatDateShort(this.monitoringData.signTimeFrom) : null,
          signTimeTo : this.monitoringData.signTimeTo ? this.publicFun.formatDateShort(this.monitoringData.signTimeTo) : null
        }
        //console.log("exportData", exportData)
        this.$message({
          message: '正在为您生成Excel文件，请稍后……',
          duration : 0
        });
        this.exportLoading = true;

        this.publicFun.httpRequest("get", `monitor/exportAudit`, null, (status, data, message) => {
          if (status == 0) {
            let excelData = [
              ["序号","所属专业", "报告编号",  "项目名称", "项目负责人", "专业咨询员", "问题汇总"]
            ];
            for (let item in data) {
              let excelSaveArray = [item != "removeByValue" ? parseInt(item) + 1 : "", data[item].professional, data[item].reportNumbers, data[item].projectName, data[item].projectDirector, data[item].consultant, data[item].opinion]
              excelData.push(excelSaveArray)
            };
            buildExcel(excelData, `审核单问题查询汇总表`);
            this.$message.closeAll();
            this.exportLoading = false;

          } else {
            that.$message.error(message);
            this.exportLoading = false;
          }
        }, exportData);
      }).catch(() => {});
    },
    getMonitoringList(params) {
      this.listLoading = true;
      this.publicFun.httpRequest("get", "monitor/listAudit", null, (status, data, message) => {
        if (status == 0) {
          this.listLoading = false;
          this.monitoringDataContent = data.rows;
          this.total = data.total;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    overDueCurrentChange(val) {
      this.monitoringData.page = val;
      this.getMonitoringList(this.monitoringData);
      this.pageNum = val;
    },
    monitoringSearchBtn() {
      this.pageNum = 1;
      this.monitoringData.singleName = this.monitoringData.projectName ? this.monitoringData.projectName.trim() : null;
      this.monitoringData.consultant = this.monitoringData.consultant ? this.monitoringData.consultant.trim() : null;
      this.monitoringData.signTimeFrom = this.monitoringData.signTimeFrom ? this.publicFun.formatDateShort(this.monitoringData.signTimeFrom) : null;
      this.monitoringData.signTimeTo = this.monitoringData.signTimeTo ? this.publicFun.formatDateShort(this.monitoringData.signTimeTo) : null;
      this.getMonitoringList(this.monitoringData);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
