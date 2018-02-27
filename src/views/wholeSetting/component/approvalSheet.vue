<template>
<div>
  <!-- 新增 - 技术核定单基本信息  -->
  <el-dialog :visible.sync="creatApprovalSheetDialog" size="small" custom-class="icms-dialog">
    <span slot="title">{{creatApprovalSheetData.title}}</span>
    <div class="dialog-box">
      <el-form :model="creatApprovalSheetData" ref="creatApprovalSheetData" :inline="true" label-width="35%" :rules="creatApprovalSheetDataRules">
        <div class="icms-dialog-content pr mt-10">
          <nav class="pa">
            技术核定单基本信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="编号：" class="mt-10 w creat-new-form" prop="jobNumber">
                <el-input class="w" v-model="creatApprovalSheetData.jobNumber" size="small" placeholder="请填写编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="技术核定单名称：" class="mt-10 w creat-new-form" prop="jobName">
                <el-input class="w" v-model="creatApprovalSheetData.jobName" size="small" placeholder="请填写技术核定单名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="技术核定单内容：" class="mt-10 w creat-new-form" prop="xxContent">
                <el-input class="w" v-model="creatApprovalSheetData.xxContent" size="small" placeholder="请填写技术核定单内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="对应合同：" class="mt-10 w creat-new-form" prop="xxContract">
                <el-select v-model="creatApprovalSheetData.xxContract" placeholder="请选择对应合同" clearable>
                  <el-option v-for="item in contractList" :key="item.jobName" :label="item.jobName" :value="item.jobName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="送审金额（元）：" class="mt-10 w creat-new-form" prop="reviewAmount">
                <el-input class="w" v-model="creatApprovalSheetData.reviewAmount" size="small" type="number" placeholder="请填写送审金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="审核金额（元）：" class="mt-10 w creat-new-form" prop="validationAmount">
                <el-input class="w" v-model="creatApprovalSheetData.validationAmount" size="small" type="number" placeholder="请填写审核金额"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="核（增）减金额（元）：" class="mt-10 w creat-new-form" prop="subtractAmount">
                <el-input class="w" v-model="creatApprovalSheetData.subtractAmount" size="small" type="number" placeholder="请填写核（增）减金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="核定时间：" class="mt-10 w creat-new-form" prop="xxDateStr">
                <el-date-picker :editable="false" v-model="creatApprovalSheetData.xxDateStr" class="w" size="small" type="date" placeholder="请选择核定时间"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="备注：" class="mt-10 w creat-new-form" prop="remark">
                <el-input type="textarea" class="w" v-model="creatApprovalSheetData.remark" size="small" placeholder="请填写备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content  pr mt-40" v-if="creatApprovalSheetData.fileList">
          <nav class="pa">
            技术核定单附件信息
          </nav>
          <el-table class="noShadow" :data="creatApprovalSheetData.enclosureFiles" style="width: 100%">
            <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
            <el-table-column prop="fileName" label="文件名称"></el-table-column>
            <el-table-column prop="createTimeStr" width="170" label="上传时间"></el-table-column>
            <el-table-column prop="createUser" width="100" label="上传人"></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button v-if="creatApprovalSheetData.delShow" @click="delWholeAnalysisFile(scope.row,scope.$index)" class="color-green" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            上传附件 - 技术核定单附件
          </nav>
          <el-upload class="upload-file w mt-10" ref="upload" :on-remove="uploadWholeContractRemove" :on-error="fileError" :on-success="uploadChildDataSuccess" drag action="icms/wholeprocess/upload/uploadWholeprocessFile" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoading" v-if="creatApprovalSheetData.editSave" class="btn-orange shadow" type="primary" @click='editSaveApprovalSheetData("creatApprovalSheetData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button :loading="buttonLoading" v-if="creatApprovalSheetData.newSave" class="btn-orange shadow" type="primary" @click='saveApprovalSheetData("creatApprovalSheetData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='creatApprovalSheetDialog=false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 专业工作-技术核定单 -->
  <el-dialog :visible.sync="approvalSheetDialog" size="large" custom-class="icms-dialog">
    <span slot="title">专业工作-技术核定单</span>
    <header>
      <el-form label-position="right" label-width="45%">
        <el-row :gutter="16">
          <el-col :sm="4">
            <el-form-item label="编号：" class="w">
              <el-input v-model="approvalSheetSearch.jobNumber" class="w" size="small" placeholder="请输入合同编号"></el-input>

            </el-form-item>
          </el-col>
          <el-col :sm="7">
            <el-form-item label="技术核定单名称：" class="w">
              <el-input v-model="approvalSheetSearch.jobName" class="w" size="small" placeholder="请输入技术核定单名称"></el-input>

            </el-form-item>
          </el-col>
          <el-col :sm="4">
            <el-form-item label="对应合同：" class="w">
              <el-select v-model="approvalSheetSearch.contract" placeholder="请选择对应合同" clearable>
                <el-option v-for="item in contractList" :key="item.jobName" :label="item.jobName" :value="item.jobName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="tc wait-header-btn f13 mb-20">
          <el-button @click="approvalSheetSearchBtn" class="btn-orange shadow mt-15" type="primary"><i class="iconfont icon-shiliangzhinengduixiang f14 mr-5"></i>查 询</el-button>
          <el-button @click="creatApprovalSheetBtn" class="btn-blue shadow mt-15" type="primary"><i class="iconfont icon-iconfont707 f12 mr-5"></i>新 增</el-button>
          <el-button @click="exportWholeSingle" :loading="exportLoading" class="btn-green shadow mt-15" type="primary"><i class="iconfont icon-excel f12 mr-5"></i>导出Excel</el-button>
        </div>
      </el-form>
    </header>
    <el-table class="noShadow mt-10" :data="approvalSheetData" style="width: 100%" :loading="approvalSheetSearch.loading" highlight-current-row>
      <el-table-column type="index" label="序号" width="40" align="center"></el-table-column>
      <el-table-column prop="professional" width="150" label="所属专业"></el-table-column>
      <el-table-column prop="consultant" width="120" label="专业咨询员"></el-table-column>
      <el-table-column prop="jobType" width="90" label="工作类型"></el-table-column>
      <el-table-column prop="jobNumber" width="90" label="编号"></el-table-column>
      <el-table-column prop="xxContent" width="120" label="技术和订单内容"></el-table-column>
      <el-table-column prop="xxContract" label="对应合同"></el-table-column>
      <el-table-column prop="reviewAmount" width="110" label="送审金额（元）"></el-table-column>
      <el-table-column prop="validationAmount" width="120" label="审核金额（元）"></el-table-column>
      <el-table-column prop="subtractAmount" width="150" label="核（增）减金额（元）"></el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
            <el-button @click="viewApprovalSheetSingle(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="editApprovalSheetSingle(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="delContractSingle(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <footer class="mt-50 cb pagination" v-if="approvalSheetSearch.total">
      <el-pagination @current-change="approvalSheetPageChange" :current-page.sync="approvalSheetSearch.pageNum" layout="prev, pager, next, jumper" :total="approvalSheetSearch.total" class="fr">
      </el-pagination>
      <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{approvalSheetSearch.total}}条记录</span>
    </footer>
  </el-dialog>
  <!-- 查看技术核定单 -->
  <el-dialog :visible.sync="approvalSheetSingleDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 技术核定单基本信息</span>
    <div class="dialog-box">
      <div class="icms-dialog-content pr p15">
        <nav class="pa">
          技术核定单基本信息
        </nav>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">编号：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{approvalSheetSingleData.jobNumber?approvalSheetSingleData.jobNumber:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">技术核定单名称：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{approvalSheetSingleData.jobName?approvalSheetSingleData.jobName:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">技术核定单内容：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{approvalSheetSingleData.xxContent?approvalSheetSingleData.xxContent:"--"}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">对应合同：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{approvalSheetSingleData.xxContract?approvalSheetSingleData.xxContract:"--"}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">送审金额（元）：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{approvalSheetSingleData.reviewAmount?approvalSheetSingleData.reviewAmount:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">审核金额（元）：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{approvalSheetSingleData.validationAmount?approvalSheetSingleData.validationAmount:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">核（增）减金额（元）： </div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{approvalSheetSingleData.subtractAmount?approvalSheetSingleData.subtractAmount:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">核定时间：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{approvalSheetSingleData.xxDateStr?approvalSheetSingleData.xxDateStr:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">备注：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{approvalSheetSingleData.remark?approvalSheetSingleData.remark:"--"}} </div>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content  pr mt-40">
        <nav class="pa">
          技术核定单附件信息
        </nav>
        <el-table class="noShadow" :data="approvalSheetSingleData.files" style="width: 100%" :loading="approvalSheetSingleData.loading" highlight-current-row>
          <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
          <el-table-column min-width="170" prop="fileName" label="文件名称"></el-table-column>
          <el-table-column prop="createTimeStr" width="170" label="上传时间"></el-table-column>
          <el-table-column prop="createUser" width="90" label="上传人"></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
                <a target="_blank" :href="scope.row.id | setDownloadUrl">
                  <el-button type="text" size="small">下载</el-button>
                </a>
              </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  formatDateShort,
  beautyDate
} from '../../../assets/js/psy.js'
export default {
  data() {
    return {
      buttonLoading:false,
      loginUser: this.$store.state.app.userInfo.userName,
      contractList: [],
      contractData: {
        uploadFiles: []
      },
      exportLoading:false,

      // 技术核定单数据模块
      approvalSheetSingleData: {
        loading: false,

        jobNumber: '',
        jobName: '',
        xxContent: '',
        xxDateStr: '',
        xxContract: '',
        reviewAmount: '',
        validationAmount: '',
        subtractAmount: '',
        remark: '',

        files: []
      },
      approvalSheetDialog: false,
      approvalSheetSearch: {
        jobNumber: '',
        jobName: '',
        contract: '',
        pageNum: 1,
        total: 0,
        loading: false
      },
      approvalSheetData: [],
      creatApprovalSheetDialog: false,
      approvalSheetSingleDialog: false,
      creatApprovalSheetData: {
        title: '新增 - 技术核定单基本信息',
        delShow: true,
        newSave: true,
        editSave: false,
        fileList: false,

        jobNumber: '',
        jobName: '',
        xxContent: '',
        xxDateStr: '',
        xxContract: '',
        reviewAmount: '',
        validationAmount: '',
        subtractAmount: '',
        remark: '',

        enclosureFiles: [],
        uploadFiles: []
      },
      creatApprovalSheetDataRules: {
        jobNumber: [{
          required: true,
          message: '请填写编号'
        }],
        jobName: [{
          required: true,
          message: '请填写技术核定单名称'
        }],
        xxContract: [{
          required: true,
          message: '请选择对应合同'
        }],
        xxDateStr: [{
          required: true,
          message: '请选择核定时间'
        }],
        reviewAmount: [{
          required: true,
          message: '请填写送审金额'
        }],
        validationAmount: [{
          required: true,
          message: '请填写审核金额'
        }],
        subtractAmount: [{
          required: true,
          message: '请填写核（增）减金额'
        }]
      },
      // 技术核定单数据模块
    }
  },
  watch: {
    creatApprovalSheetData: {
      handler: function(val, oldval) {
        this.creatApprovalSheetData.subtractAmount = (val.reviewAmount - val.validationAmount) ? (val.reviewAmount - val.validationAmount).toFixed(2):0;
      },
      deep: true //对象内部的属性监听，也叫深度监听
    }
  },
  filters: {
    setDownloadUrl(url) {
      return `${location.origin}/icms/wholeprocess/download/consultantJobFile?id=${url}`;
    }
  },
  props: ['projectInfo'],
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
        } = require("../../../assets/js/jsonToXlsx.js");

        let exportData = {
          id:this.projectInfo.waitId?this.projectInfo.waitId:null,
          singleId: this.projectInfo.id,
          jobType: "技术核定单",
          xxContract: this.approvalSheetSearch.contract.trim(),
          jobNumber: this.approvalSheetSearch.jobNumber.trim(),
          jobName: this.approvalSheetSearch.jobName.trim()
        }
        //console.log("exportData",exportData)
        this.$message({
          message: '正在为您生成Excel文件，请稍后……',
          duration : 0
        });
        this.exportLoading = true;

        this.publicFun.httpRequest("get", `wholeprocess/exportConsultantJobs`, null, (status, data, message) => {
          if (status == 0) {
            let excelData = [
              ["序号", "所属专业", "专业咨询员", "工作类型", "编号", "名称", "内容", "对应合同", "送审金额（元）", "审核金额（元）", "核（增）减金额（元）", "核定时间","当前状态","备注"]
            ];
            for (let item in data) {
              let excelSaveArray = [item!="removeByValue" ? parseInt(item) + 1 : "", data[item].professional, data[item].consultant, data[item].jobType, data[item].jobNumber, data[item].jobName, data[item].xxContent, data[item].xxContract,
                data[item].reviewAmount, data[item].validationAmount, data[item].subtractAmount, data[item].processState, data[item].remark
              ]
              excelData.push(excelSaveArray)
            };
            buildExcel(excelData, `《${this.projectInfo.projectName}》技术核定单列表`);
            this.exportLoading = false;
            this.$message.closeAll();
          } else {
            that.$message.error(message);
            this.exportLoading = false;
          }
        }, exportData);
      }).catch(() => {});
    },
    // 技术核定单函数模块
    viewApprovalSheetSingle(row) { //查看技术核定单信息
      this.approvalSheetSingleDialog = true;
      //console.log(row);
      this.approvalSheetSingleData = {
        loading: true,

        jobNumber: row.jobNumber,
        jobName: row.jobName,
        xxContent: row.xxContent,
        xxDateStr: row.xxDateStr,
        xxContract: row.xxContract,
        reviewAmount: row.reviewAmount,
        validationAmount: row.validationAmount,
        subtractAmount: row.subtractAmount,
        remark: row.remark,

        files: []
      };
      this.publicFun.httpRequest("get", `wholeprocess/getJobFilesByJobId?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.approvalSheetSingleData.loading = false;
          this.approvalSheetSingleData.files = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    editApprovalSheetSingle(row) { //编辑技术核定信息
      this.creatApprovalSheetDialog = true;
      this.creatApprovalSheetData.title = "修改 - 技术核定单基本信息";
      this.creatApprovalSheetData.delShow = false;
      this.creatApprovalSheetData.editSave = true;
      this.creatApprovalSheetData.newSave = false;
      this.creatApprovalSheetData.fileList = true;

      this.creatApprovalSheetData.jobName = row.jobName;
      this.creatApprovalSheetData.xxContent = row.xxContent;
      this.creatApprovalSheetData.jobNumber = row.jobNumber;
      this.creatApprovalSheetData.reviewAmount = row.reviewAmount;
      this.creatApprovalSheetData.validationAmount = row.validationAmount;
      this.creatApprovalSheetData.subtractAmount = row.subtractAmount;
      this.creatApprovalSheetData.remark = row.remark;
      this.creatApprovalSheetData.xxContract = row.xxContract;
      this.creatApprovalSheetData.xxDateStr = row.xxDateStr;
      this.creatApprovalSheetData.editId = row.id;
      this.creatApprovalSheetData.editVersion = row.version;

      if (this.contractData.uploadFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.contractData.uploadFiles = [];

      this.publicFun.httpRequest("get", `wholeprocess/getJobFilesByJobId?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.creatApprovalSheetData.enclosureFiles = data;
        } else {
          this.$message.error(message);
        }
      });

    },
    editSaveApprovalSheetData(formName) { //修改技术核定信息
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let contractData = {
            "approveOpinion": null,
            "approveResult": null,
            "completionDateStr": null,
            "consultant": null,
            "contractAmount": null,
            "contractPeriod": null,
            "contractType": null,
            "contractor": null,
            "cumulativeReplyAmount": null,
            "cumulativeReplyRate": null,
            "files_BG": null,
            "files_GCLXD": null,
            "files_GS": null,
            "files_HDD": this.contractData.uploadFiles.length > 0 ? JSON.stringify(this.contractData.uploadFiles) : null,
            "files_JDK": null,
            "files_QT": null,
            "files_QZ": null,
            "files_XJD": null,
            "files_ZJLXD": null,
            "htFiles": null,
            "id": this.creatApprovalSheetData.editId,
            "isDirectorAudit": null,
            "isDynamicCost": null,
            "isSendMsg": null,
            "jobCommitDeadlineDateStr": null,
            "jobName": this.creatApprovalSheetData.jobName,
            "jobNumber": this.creatApprovalSheetData.jobNumber,
            "jobRequirement": null,
            "jobType": "技术核定单",
            "monthyApplyAmount": null,
            "monthyReplyAmount": null,
            "payType": null,
            "processState": null,
            "professional": null,
            "professionalDirector": null,
            "qualityRequirement": null,
            "receiveUnit": null,
            "remark": this.creatApprovalSheetData.remark,
            "reviewAmount": this.creatApprovalSheetData.reviewAmount,
            "sendPackagePerson": null,
            "sendTaskFiles": null,
            "sendUnit": null,
            "singleId": this.projectInfo.id,
            "startDateStr": null,
            "subtractAmount": this.creatApprovalSheetData.subtractAmount,
            "validationAmount": this.creatApprovalSheetData.validationAmount,
            "xxAmount": null,
            "xxContent": this.creatApprovalSheetData.xxContent,
            "xxContract": this.creatApprovalSheetData.xxContract,
            "xxDateStr": formatDateShort(this.creatApprovalSheetData.xxDateStr),
            "version": this.creatApprovalSheetData.editVersion
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("put", `wholeprocess/updateConsultantJob`, contractData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.creatApprovalSheetDialog = false;
              this.getApprovalSheetList();
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
    saveApprovalSheetData(formName) { //保存技术核定信息
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let contractData = {
            "approveOpinion": null,
            "approveResult": null,
            "completionDateStr": null,
            "consultant": null,
            "contractAmount": null,
            "contractPeriod": null,
            "contractType": null,
            "contractor": null,
            "cumulativeReplyAmount": null,
            "cumulativeReplyRate": null,
            "files_BG": null,
            "files_GCLXD": null,
            "files_GS": null,
            "files_HDD": this.contractData.uploadFiles.length > 0 ? JSON.stringify(this.contractData.uploadFiles) : null,
            "files_JDK": null,
            "files_QT": null,
            "files_QZ": null,
            "files_XJD": null,
            "files_ZJLXD": null,
            "htFiles": null,
            "id": -1,
            "isDirectorAudit": null,
            "isDynamicCost": null,
            "isSendMsg": null,
            "jobCommitDeadlineDateStr": null,
            "jobName": this.creatApprovalSheetData.jobName,
            "jobNumber": this.creatApprovalSheetData.jobNumber,
            "jobRequirement": null,
            "jobType": "技术核定单",
            "monthyApplyAmount": null,
            "monthyReplyAmount": null,
            "payType": null,
            "processState": null,
            "professional": null,
            "professionalDirector": null,
            "qualityRequirement": null,
            "receiveUnit": null,
            "remark": this.creatApprovalSheetData.remark,
            "reviewAmount": this.creatApprovalSheetData.reviewAmount,
            "sendPackagePerson": null,
            "sendTaskFiles": null,
            "sendUnit": null,
            "singleId": this.projectInfo.id,
            "startDateStr": null,
            "subtractAmount": this.creatApprovalSheetData.subtractAmount,
            "validationAmount": this.creatApprovalSheetData.validationAmount,
            "xxAmount": null,
            "xxContent": this.creatApprovalSheetData.xxContent,
            "xxContract": this.creatApprovalSheetData.xxContract,
            "xxDateStr": formatDateShort(this.creatApprovalSheetData.xxDateStr)
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("post", `wholeprocess/addConsultantJob`, contractData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.creatApprovalSheetDialog = false;
              this.getApprovalSheetList();
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
    creatApprovalSheetBtn() { //新建技术核定单
      this.creatApprovalSheetDialog = true;

      this.creatApprovalSheetData = {
        title: '新增 - 技术核定单',
        jobNumber: '',
        jobName: '',
        xxContent: '',
        xxDateStr: '',
        xxContract: '',
        reviewAmount: '',
        validationAmount: '',
        subtractAmount: '',
        remark: '',
        enclosureFiles: [],
        uploadFiles: []
      }
      this.creatApprovalSheetData.delShow = true;
      this.creatApprovalSheetData.editSave = false;
      this.creatApprovalSheetData.newSave = true;
      this.creatApprovalSheetData.fileList = false;
      if (this.contractData.uploadFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.contractData.uploadFiles = [];

    },
    approvalSheetChildBtn() { //技术核定单子任务按钮
      this.approvalSheetSearch.jobNumber = '';
      this.approvalSheetSearch.contract = '';
      this.approvalSheetSearch.jobName = '';
      this.approvalSheetDialog = true;
      this.getContractListArray(this.projectInfo.id);
      this.getApprovalSheetList();
    },
    approvalSheetSearchBtn() { //技术核定单子任务查询
      this.getApprovalSheetList();
    },
    getApprovalSheetList() { //技术核定单列表获取
      this.approvalSheetSearch.loading = true;
      let params = {
        page: this.approvalSheetSearch.pageNum,
        rows: 10,
        singleId: this.projectInfo.id,
        jobType: "技术核定单",
        xxContract: this.approvalSheetSearch.contract.trim(),
        jobNumber: this.approvalSheetSearch.jobNumber.trim(),
        jobName: this.approvalSheetSearch.jobName.trim()
      }
      this.publicFun.httpRequest("get", 'wholeprocess/listConsultantJobs', null, (status, data, message) => {
        if (status == 0) {
          //console.log(data);
          this.approvalSheetData = data.rows
          this.approvalSheetSearch.total = data.total;
          this.approvalSheetSearch.loading = false;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    approvalSheetPageChange(val) {
      this.approvalSheetSearch.pageNum = val;
      this.getApprovalSheetList()
    },
    // 技术核定单函数模块

    getContractListArray(id) { //获取对应合同列表
      this.publicFun.httpRequest("get", `wholeprocess/getConsultantContract?singleId=${id}`, null, (status, data, message) => {
        if (status == 0) {
          this.contractList = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    uploadChildDataSuccess(response, file, fileList) { //技术核定单文件上传
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: "技术核定单",
        createUser: this.loginUser,
        createTimeStr: response.record[0].createTimeStr
      }
      this.contractData.uploadFiles.push(fileData);
    },

    delContractSingle(row) { //删除合同分析单项
      //console.log(row)
      this.$confirm('确认要删除此项目吗？', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.publicFun.httpRequest("delete", `wholeprocess/deleteConsultantJob?id=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.getProjectContactList();

          }
        });
      }).catch(() => {});
    },

    uploadWholeContractRemove(file, fileList) {
      //console.log("移除文件", file)
      this.contractData.uploadFiles.forEach((item) => {
        if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1) {
          this.contractData.uploadFiles.removeByValue(item);
        }
      });
    },
    fileError(err, file, fileList) {
      this.$message.error("很抱歉，上传失败，请检查文件大小或稍后再试");
    },
  }
}
</script>

<style lang="css">
</style>
