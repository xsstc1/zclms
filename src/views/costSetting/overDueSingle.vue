<template>
<div id="project-setting" class="app-container">
  <header class="p20 bg-color-white shadow radius5">
    <div class="mt-15">
      <el-form :inline="true" ref="overDueSingleData" :model="overDueSingleData" class="demo-form-inline" label-width="120px">
        <el-form-item label="单项工程名称：" prop="name">
          <el-input @keyup.enter.native="overDueSingleSearchBtn" size="small" v-model="overDueSingleData.name" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="专业咨询员：" prop="consultant">
          <el-input @keyup.enter.native="overDueSingleSearchBtn" size="small" v-model="overDueSingleData.consultant" placeholder="请输入单项工程名称"></el-input>
        </el-form-item>
        <el-form-item label=" 所属专业：" prop="professional">
          <el-select v-model="overDueSingleData.professional" size="small" placeholder="请选择所属专业" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="土建" value="土建"></el-option>
            <el-option label="装饰" value="装饰"></el-option>
            <el-option label="安装" value="安装"></el-option>
            <el-option label="市政" value="市政"></el-option>
            <el-option label="钢筋" value="钢筋"></el-option>
            <el-option label="景观绿化" value="景观绿化"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="逾期状态：" prop="state">
          <el-select v-model="overDueSingleData.state" size="small" placeholder="请选择所属专业">
            <el-option label="待处理" value="N"></el-option>
            <el-option label="已处理" value="Y"></el-option>
            <el-option label="已延期" value="D"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="mb-15 mt-10 tc">
      <el-button @click='overDueSingleSearchBtn' type="primary" class="btn-orange shadow mt-15"><i class="iconfont icon-shiliangzhinengduixiang f13 mr-5"></i>查 询</el-button>
      <el-button @click='resetForm("overDueSingleData")' type="primary" class="btn-indigo shadow mt-15"><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
      <el-button @click="exportBatch" :loading="exportLoading" class="btn-green shadow mt-15" type="primary"><i class="iconfont icon-excel f12 mr-5"></i>导出Excel</el-button>
    </div>
  </header>
  <article class="mt-30">
    <el-table :data="overDueSingleDataContent" v-loading="listLoading" fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
      <el-table-column label="单项工程名称" width="230" prop="name"></el-table-column>
      <el-table-column label="专业咨询员" width="220" align="center" prop="consultant"></el-table-column>
      <el-table-column label="初稿时间" width="150" align="center">
        <template slot-scope="scope">
          {{scope.row.firstDraftTimeStr?scope.row.firstDraftTimeStr:"--"}}
        </template>
      </el-table-column>
      <el-table-column label="初稿核对截止时间" width="150" align="center">
        <template slot-scope="scope">
          {{scope.row.firstDraftCheckTimeStr?scope.row.firstDraftCheckTimeStr:"--"}}
        </template>
      </el-table-column>
      <el-table-column label="流程状态" width="150" align="left" prop="processState"></el-table-column>
      <el-table-column label="逾期(天)" width="120" align="center" prop="assignDueDays"></el-table-column>
      <el-table-column label="最新延期日期" width="120" align="center">
        <template slot-scope="scope">
          {{scope.row.delayTimeStr?scope.row.delayTimeStr:"--"}}
        </template>
      </el-table-column>
      <el-table-column min-width="140" label="最新延期理由" align="left">
        <template slot-scope="scope">
          {{scope.row.delayReason?scope.row.delayReason:"--"}}
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
              <el-button v-if="editBtnShow" @click="overDueBtn(scope.row)" class="color-green" type="text" size="small">延期</el-button>
          </template>
      </el-table-column>
    </el-table>
  </article>

  <footer class="mt-30 cb pagination" v-if="total">
    <el-pagination @current-change="overDueCurrentChange" :current-page.sync="pageNum" :page-size="10" layout="prev, pager, next, jumper" :total="total" class="fr">
    </el-pagination>
    <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{total}}条记录</span>
  </footer>
  <el-dialog :visible.sync="overDueSingleDialog" size="small" custom-class="icms-dialog">
    <span slot="title">修改 - 延期</span>
    <div class="dialog-box">
      <el-form :model="changeOverDueData" ref="changeOverDueData" label-position="right" label-width="110px" :rules="changeOverDueRules">
        <div class="icms-dialog-content  pr mt-15">
          <nav class="pa">
            延期信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="10">
              <el-form-item label="延期日期：" class="mt-10 w" prop="date">
                <el-date-picker :editable="false" v-model="changeOverDueData.date" type="date" placeholder="请选择延期日期" clearable></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="16">
              <el-form-item label="延期理由：" class="mt-10 w" prop="reason">
                <el-input v-model="changeOverDueData.reason" type="textarea" class="w" size="small" placeholder="请输入延期理由"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button class="btn-red shadow" type="primary" @click='saveOverDue("changeOverDueData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='resetForm("changeOverDueData")'><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
        </div>
      </el-form>
      <div class="icms-dialog-content  pr mt-50" v-loading="overDueListLoading">
        <nav class="pa">
          延期列表
        </nav>
        <el-table :data="overDueListData" class="noShadow" style="width: 100%">
          <el-table-column prop="delayTimeStr" width="200" label="延期日期" align="left"></el-table-column>
          <el-table-column prop="delayReason" label="延期理由"></el-table-column>
          <el-table-column prop="createTimeStr" width="200" label="创建时间"></el-table-column>
          <el-table-column prop="createUser" width="100" label="延期人"></el-table-column>
        </el-table>
      </div>
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
      overDueSingleDialog: false,
      overDueSingleData: {
        page: 1,
        rows: 10,
        name: '',
        consultant: '',
        professional: '',
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
      pageNum: 1,
      listLoading: false,
      overDueSingleDataContent: [],
      total: 0,
      overDueListData: [],
      overDueListLoading: false,
      singleOverdueId: null,
      exportLoading: false
    }
  },
  mounted() {
    this.getoverDueList(this.overDueSingleData);
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
          name: this.overDueSingleData.name.trim(),
          consultant: this.overDueSingleData.consultant.trim(),
          professional: this.overDueSingleData.professional,
          state: this.overDueSingleData.state
        }
        console.log(exportData)
        this.$message({
          message: '正在为您生成Excel文件，请稍后……',
          duration: 0
        });
        this.exportLoading = true;
        this.publicFun.httpRequest("get", `cost/overdue/exportSingles`, null, (status, data, message) => {
          if (status == 0) {
            //console.log("Excel数据",data)
            let excelData = [
              ["序号", "单项工程名称", "所属专业", "专业咨询员", "初稿时间", "初稿核对截止时间", "流程状态", "初稿编制逾期（天）", "初稿核对逾期(天)", "上传标底逾期（天）", "最新延期日期", "最新延期理由"],
            ];
            for (let item in data) {
              let excelSaveArray = [item != "removeByValue" ? parseInt(item) + 1 : "", data[item].name, data[item].professional, data[item].consultant, data[item].firstDraftTimeStr, data[item].firstDraftCheckTimeStr, data[item].processState,
                data[item].firstDraftDueDays,
                data[item].firstDraftCheckDueDays, data[item].assignDueDays, data[item].delayTimeStr, data[item].delayReason
              ]
              excelData.push(excelSaveArray)
            };
            buildExcel(excelData, `单项逾期数据汇总表`);
            // //console.log("导出的信息",excelData)
            this.exportLoading = false;
            this.$message.closeAll();
          } else {
            that.$message.error(message);
            this.exportLoading = false;
          }
        }, exportData);
      }).catch(() => {});
    },
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
          this.publicFun.handleIELoading(() => {
            this.overDueListLoading = false;
          });

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
