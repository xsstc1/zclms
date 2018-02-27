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
        <el-form-item label="项目类别：" class="mt-10" prop="workProjectCategory">
          <el-select v-model="monitoringData.workProjectCategory" size="small" placeholder="请选择项目类别">
            <el-option label="请选择" value=""></el-option>
            <el-option label="标底编制" value="1"></el-option>
            <el-option label="标底编制（全过程）" value="2"></el-option>
            <el-option label="材料设备询价" value="3"></el-option>
            <el-option label="结算审核" value="4"></el-option>
            <el-option label="预算编制" value="5"></el-option>
            <el-option label="待处理" value="6"></el-option>
            <el-option label="标底（零星）" value="7"></el-option>
            <el-option label="清单编制" value="8"></el-option>
            <el-option label="全过程" value="9"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否上报：" class="mt-10" prop="reportProjectFlag">
          <el-select v-model="monitoringData.reportProjectFlag" size="small" placeholder="请选择工作项目类别">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
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
        <el-form-item label="流程状态：" class="mt-10" prop="processState">
          <el-select v-model="monitoringData.processState" size="small" placeholder="请选择流程状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="非完成" value="非完成"></el-option>
            <el-option label="项目登记" value="项目登记"></el-option>
            <el-option label="项目分配" value="项目分配"></el-option>
            <el-option label="单项工程审核" value="单项工程审核"></el-option>
            <el-option label="技术负责人审核" value="技术负责人审核"></el-option>
            <el-option label="领导签发" value="领导签发"></el-option>
            <el-option label="填写报告" value="填写报告"></el-option>
            <el-option label="项目归档" value="项目归档"></el-option>
            <el-option label="上传档案补充资料" value="上传档案补充资料"></el-option>
            <el-option label="完成" value="完成"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委托单位：" class="mt-10" prop="delegateUnitName">
          <el-input size="small" v-model="monitoringData.delegateUnitName" placeholder="请输入委托单位"></el-input>
        </el-form-item>
        <el-form-item label="建设单位：" class="mt-10" prop="unitName">
          <el-input size="small" v-model="monitoringData.unitName" placeholder="请输入建设单位"></el-input>
        </el-form-item>
        <span class="disinblock">
        <el-form-item label="资料收到日期：" class="mt-10" prop="informationReceivedDateFrom">
          <el-date-picker :editable="false" v-model="monitoringData.informationReceivedDateFrom" type="date" placeholder="请选择日期" clearable></el-date-picker>
        </el-form-item>
        <span class="ml-10 mr-15 mt-15 disinblock">至</span>
        <el-form-item class="mt-10 block-xs" prop="informationReceivedDateTo">
          <el-date-picker :editable="false" v-model="monitoringData.informationReceivedDateTo" type="date" placeholder="请选择日期" clearable></el-date-picker>
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
      <el-table-column min-width="100" label="所属专业" prop="professional"></el-table-column>
      <el-table-column label="专业咨询员" width="100" align="left" prop="consultant"></el-table-column>
      <el-table-column min-width="180" label="项目名称" prop="projectName"></el-table-column>
      <el-table-column label="项目类别" width="100" align="left" prop="workProjectCategoryStr"></el-table-column>
      <el-table-column label="资料收到日期" width="150" align="center" prop="informationReceivedDateStr"></el-table-column>
      <el-table-column label="委托单位名称" width="150" align="left" prop="delegateUnitName"></el-table-column>
      <el-table-column label="施工单位" width="180" align="left">
        <template slot-scope="scope">
        {{scope.row.constructionUnitName?scope.row.constructionUnitName:"--"}}
        </template>
      </el-table-column>
      <el-table-column label="送审金额（元）" width="120" align="center">
        <template slot-scope="scope">
        {{scope.row.reviewAmount?scope.row.reviewAmount:"--"}}
        </template>
      </el-table-column>
      <el-table-column label="当前状态" width="120" align="center" prop="processState"></el-table-column>
      <el-table-column label="初稿时间" width="150" align="center">
        <template slot-scope="scope">
        {{scope.row.firstDraftTimeStr?scope.row.firstDraftTimeStr:"--"}}
        </template>
      </el-table-column>
      <el-table-column label="定稿时间" width="120" align="center">
        <template slot-scope="scope">
        {{scope.row.endDraftTimeStr?scope.row.endDraftTimeStr:"--"}}
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
        projectName: "",
        consultant: "",
        workProjectCategory: "",
        reportProjectFlag: "",
        professional: "",
        processState: "",
        delegateUnitName: "",
        unitName: "",
        informationReceivedDateFrom: "",
        informationReceivedDateTo: ""
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
          projectName: this.monitoringData.projectName ? this.monitoringData.projectName.trim() : null,
          consultant: this.monitoringData.consultant ? this.monitoringData.consultant.trim() : null,
          delegateUnitName: this.monitoringData.delegateUnitName ? this.monitoringData.delegateUnitName.trim() : null,
          unitName: this.monitoringData.unitName ? this.monitoringData.unitName.trim() : null,
          informationReceivedDateFrom: this.monitoringData.informationReceivedDateFrom ? this.publicFun.formatDateShort(this.monitoringData.informationReceivedDateFrom) : null,
          informationReceivedDateTo: this.monitoringData.informationReceivedDateTo ? this.publicFun.formatDateShort(this.monitoringData.informationReceivedDateTo) : null,
          workProjectCategory: this.monitoringData.workProjectCategory,
          reportProjectFlag: this.monitoringData.reportProjectFlag,
          professional: this.monitoringData.professional,
          processState: this.monitoringData.processState,
        }
        //console.log("exportData", exportData)
        this.$message({
          message: '正在为您生成Excel文件，请稍后……',
          duration : 0
        });
        this.exportLoading = true;

        this.publicFun.httpRequest("get", `monitor/exportSingle`, null, (status, data, message) => {
          if (status == 0) {
            let excelData = [
              ["序号","所属专业", "专业咨询员",  "项目名称", "项目类别", "资料收到日期", "委托单位名称", "施工单位","送审金额（元）","当前状态","初稿时间","定稿时间"]
            ];
            for (let item in data) {
              let excelSaveArray = [item != "removeByValue" ? parseInt(item) + 1 : "", data[item].professional, data[item].consultant, data[item].projectName, data[item].workProjectCategory, data[item].informationReceivedDateStr, data[item].delegateUnitName, data[item].constructionUnitName,data[item].reviewAmount,data[item].processState,data[item].firstDraftTimeStr,data[item].endDraftTimeStr]
              excelData.push(excelSaveArray)
            };
            buildExcel(excelData, `单项工程查询表`);
            this.exportLoading = false;
            this.$message.closeAll();
          } else {
            that.$message.error(message);
            this.exportLoading = false;
          }
        }, exportData);
      }).catch(() => {});
    },
    getMonitoringList(params) {
      this.listLoading = true;
      this.publicFun.httpRequest("get", "monitor/listSingle", null, (status, data, message) => {
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
      this.monitoringData.projectName = this.monitoringData.projectName ? this.monitoringData.projectName.trim() : null;
      this.monitoringData.consultant = this.monitoringData.consultant ? this.monitoringData.consultant.trim() : null;
      this.monitoringData.delegateUnitName = this.monitoringData.delegateUnitName ? this.monitoringData.delegateUnitName.trim() : null;
      this.monitoringData.unitName = this.monitoringData.unitName ? this.monitoringData.unitName.trim() : null;
      this.monitoringData.informationReceivedDateFrom = this.monitoringData.informationReceivedDateFrom ? this.publicFun.formatDateShort(this.monitoringData.informationReceivedDateFrom) : null;
      this.monitoringData.informationReceivedDateTo = this.monitoringData.informationReceivedDateTo ? this.publicFun.formatDateShort(this.monitoringData.informationReceivedDateTo) : null;
      this.getMonitoringList(this.monitoringData);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
