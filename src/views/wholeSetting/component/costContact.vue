<template>
<div>
  <!-- 专业工作-造价联系单 -->
  <el-dialog :visible.sync="costContactDialog" size="small" custom-class="icms-dialog">
    <span slot="title">专业工作-造价联系单</span>
    <header>
      <el-form label-position="right" label-width="40%">
        <el-row :gutter="16">
          <el-col :sm="6">
            <el-form-item label="编号：" class="w">
              <el-input v-model="costContactSearch.jobNumber" class="w" size="small" placeholder="请输入合同编号"></el-input>

            </el-form-item>
          </el-col>
          <el-col :sm="10">
            <el-form-item label="造价联系单名称：" class="w">
              <el-input v-model="costContactSearch.jobName" class="w" size="small" placeholder="请输入造价联系单名称"></el-input>

            </el-form-item>
          </el-col>
        </el-row>
        <div class="tc wait-header-btn f13 mb-20">
          <el-button @click="costContactSearchBtn" class="btn-orange shadow mt-15" type="primary"><i class="iconfont icon-shiliangzhinengduixiang f14 mr-5"></i>查 询</el-button>
          <el-button @click="creatCostContactBtn" class="btn-blue shadow mt-15" type="primary"><i class="iconfont icon-iconfont707 f12 mr-5"></i>新 增</el-button>
          <el-button @click="exportWholeSingle" :loading="exportLoading" class="btn-green shadow mt-15" type="primary"><i class="iconfont icon-excel f12 mr-5"></i>导出Excel</el-button>
        </div>
      </el-form>
    </header>
    <el-table class="noShadow mt-10" :data="costContactData" style="width: 100%" :loading="costContactSearch.loading" highlight-current-row>
      <el-table-column type="index" label="序号" width="40" align="center"></el-table-column>
      <el-table-column prop="professional" width="150" label="所属专业"></el-table-column>
      <el-table-column prop="consultant" width="120" label="专业咨询员"></el-table-column>
      <el-table-column prop="jobType" width="90" label="工作类型"></el-table-column>
      <el-table-column prop="jobNumber" width="90" label="编号"></el-table-column>
      <el-table-column prop="xxContent" width="110" label="技术和订单内容"></el-table-column>
      <el-table-column min-width="150" prop="xxContract" label="对应合同"></el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
            <el-button @click="viewCostContactSingle(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="editCostContactSingle(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="delContractSingle(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <footer class="mt-50 cb pagination" v-if="costContactSearch.total">
      <el-pagination @current-change="costContactPageChange" :current-page.sync="costContactSearch.pageNum" layout="prev, pager, next, jumper" :total="costContactSearch.total" class="fr">
      </el-pagination>
      <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{costContactSearch.total}}条记录</span>
    </footer>
  </el-dialog>
  <!-- 新增 - 造价联系单基本信息  -->
  <el-dialog :visible.sync="creatCostContactDialog" size="small" custom-class="icms-dialog">
    <span slot="title">{{creatCostContactData.title}}</span>
    <div class="dialog-box">
      <el-form :model="creatCostContactData" ref="creatCostContactData" :inline="true" label-width="35%" :rules="creatCostContactDataRules">
        <div class="icms-dialog-content pr mt-10">
          <nav class="pa">
            造价联系单基本信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="编号：" class="mt-10 w creat-new-form" prop="jobNumber">
                <el-input class="w" v-model="creatCostContactData.jobNumber" size="small" placeholder="请填写编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="造价联系单名称：" class="mt-10 w creat-new-form" prop="jobName">
                <el-input class="w" v-model="creatCostContactData.jobName" size="small" placeholder="请填写造价联系单名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="造价联系单内容：" class="mt-10 w creat-new-form" prop="xxContent">
                <el-input class="w" v-model="creatCostContactData.xxContent" size="small" placeholder="请填写造价联系单内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="发起单位：" class="mt-10 w creat-new-form" prop="sendUnit">
                <el-input class="w" v-model="creatCostContactData.sendUnit" size="small" placeholder="请填写发起单位"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="接收单位：" class="mt-10 w creat-new-form" prop="receiveUnit">
                <el-input class="w" v-model="creatCostContactData.receiveUnit" size="small" placeholder="请填写接收单位"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="发起时间：" class="mt-10 w creat-new-form" prop="xxDateStr">
                <el-date-picker :editable="false" v-model="creatCostContactData.xxDateStr" class="w" size="small" type="date" placeholder="请选择核定时间"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="对应合同：" class="mt-10 w creat-new-form" prop="xxContract">
                <el-select v-model="creatCostContactData.xxContract" placeholder="请选择对应合同" clearable>
                  <el-option v-for="item in contractList" :key="item.jobName" :label="item.jobName" :value="item.jobName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="备注：" class="mt-10 w creat-new-form" prop="remark">
                <el-input type="textarea" class="w" v-model="creatCostContactData.remark" size="small" placeholder="请填写备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content  pr mt-40" v-if="creatCostContactData.fileList">
          <nav class="pa">
            造价联系单附件信息
          </nav>
          <el-table class="noShadow" :data="creatCostContactData.enclosureFiles" style="width: 100%">
            <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
            <el-table-column prop="fileName" label="文件名称"></el-table-column>
            <el-table-column prop="createTimeStr" width="170" label="上传时间"></el-table-column>
            <el-table-column prop="createUser" width="100" label="上传人"></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button v-if="creatCostContactData.delShow" @click="delWholeAnalysisFile(scope.row,scope.$index)" class="color-green" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            上传附件 - 造价联系单附件
          </nav>
          <el-upload class="upload-file w mt-10" ref="upload" :on-remove="uploadWholeContractRemove" :on-error="fileError" :on-success="uploadChildDataSuccess" drag action="icms/wholeprocess/upload/uploadWholeprocessFile" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoading" v-if="creatCostContactData.editSave" class="btn-orange shadow" type="primary" @click='editSaveCostContactData("creatCostContactData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button :loading="buttonLoading" v-if="creatCostContactData.newSave" class="btn-orange shadow" type="primary" @click='saveCostContactData("creatCostContactData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='creatCostContactDialog=false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 查看造价联系单 -->
  <el-dialog :visible.sync="costContactSingleDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 造价联系单基本信息</span>
    <div class="dialog-box">
      <div class="icms-dialog-content pr p15">
        <nav class="pa">
          造价联系单基本信息
        </nav>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">编号：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{costContactSingleData.jobNumber?costContactSingleData.jobNumber:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">造价联系单名称：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{costContactSingleData.jobName?costContactSingleData.jobName:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">造价联系单内容：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{costContactSingleData.xxContent?costContactSingleData.xxContent:"--"}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">发起单位：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{costContactSingleData.sendUnit?costContactSingleData.sendUnit:"--"}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">接收单位：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{costContactSingleData.receiveUnit?costContactSingleData.receiveUnit:"--"}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">发起时间：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{costContactSingleData.xxDateStr?costContactSingleData.xxDateStr:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">对应合同：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{costContactSingleData.xxContract?costContactSingleData.xxContract:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">备注：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{costContactSingleData.remark?costContactSingleData.remark:"--"}} </div>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content  pr mt-40">
        <nav class="pa">
          造价联系单附件信息
        </nav>
        <el-table class="noShadow" :data="costContactSingleData.files" style="width: 100%" :loading="costContactSingleData.loading" highlight-current-row>
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

      // 造价联系单数据模块
      costContactSingleData: {
        loading: false,

        jobNumber: '',
        jobName: '',
        xxContent: '',
        xxDateStr: '',
        xxContract: '',
        sendUnit: '',
        receiveUnit: '',
        remark: '',

        files: []
      },
      costContactDialog: false,
      costContactSearch: {
        jobNumber: '',
        jobName: '',
        contract: '',
        pageNum: 1,
        total: 0,
        loading: false
      },
      costContactData: [],
      creatCostContactDialog: false,
      costContactSingleDialog: false,
      creatCostContactData: {
        title: '新增 - 造价联系单基本信息',
        delShow: true,
        newSave: true,
        editSave: false,
        fileList: false,

        jobNumber: '',
        jobName: '',
        xxContent: '',
        xxDateStr: '',
        xxContract: '',
        sendUnit: '',
        receiveUnit: '',
        remark: '',

        enclosureFiles: [],
        uploadFiles: []
      },
      creatCostContactDataRules: {
        jobNumber: [{
          required: true,
          message: '请填写编号'
        }],
        jobName: [{
          required: true,
          message: '请填写造价联系单名称'
        }],
        xxContract: [{
          required: true,
          message: '请选择对应合同'
        }],
        xxDateStr: [{
          required: true,
          message: '请选择发起时间'
        }]
      },
      // 造价联系单数据模块
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
          jobType: "造价联系单",
          jobNumber: this.costContactSearch.jobNumber.trim(),
          jobName: this.costContactSearch.jobName.trim()
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
    // 造价联系单函数模块
    viewCostContactSingle(row) { //查看造价联系单信息
      this.costContactSingleDialog = true;
      //console.log(row);
      this.costContactSingleData = {
        loading: true,

        jobNumber: row.jobNumber,
        jobName: row.jobName,
        xxContent: row.xxContent,
        xxDateStr: row.xxDateStr,
        xxContract: row.xxContract,
        sendUnit: row.sendUnit,
        receiveUnit: row.receiveUnit,
        remark: row.remark,

        files: []
      };
      this.publicFun.httpRequest("get", `wholeprocess/getJobFilesByJobId?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.costContactSingleData.loading = false;
          this.costContactSingleData.files = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    editCostContactSingle(row) { //编辑技术核定信息
      this.creatCostContactDialog = true;
      this.creatCostContactData.title = "修改 - 造价联系单基本信息";
      this.creatCostContactData.delShow = false;
      this.creatCostContactData.editSave = true;
      this.creatCostContactData.newSave = false;
      this.creatCostContactData.fileList = true;

      this.creatCostContactData.jobName = row.jobName;
      this.creatCostContactData.xxContent = row.xxContent;
      this.creatCostContactData.jobNumber = row.jobNumber;
      this.creatCostContactData.sendUnit = row.sendUnit;
      this.creatCostContactData.receiveUnit = row.receiveUnit;
      this.creatCostContactData.remark = row.remark;
      this.creatCostContactData.xxContract = row.xxContract;
      this.creatCostContactData.xxDateStr = row.xxDateStr;
      this.creatCostContactData.editId = row.id;
      this.creatCostContactData.editVersion = row.version;

      if (this.contractData.uploadFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.contractData.uploadFiles = [];

      this.publicFun.httpRequest("get", `wholeprocess/getJobFilesByJobId?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.creatCostContactData.enclosureFiles = data;
        } else {
          this.$message.error(message);
        }
      });

    },
    editSaveCostContactData(formName) { //修改技术核定信息
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
            "files_HDD": null,
            "files_JDK": null,
            "files_QT": null,
            "files_QZ": null,
            "files_XJD": null,
            "files_ZJLXD": this.contractData.uploadFiles.length > 0 ? JSON.stringify(this.contractData.uploadFiles) : null,
            "htFiles": null,
            "id": this.creatCostContactData.editId,
            "isDirectorAudit": null,
            "isDynamicCost": null,
            "isSendMsg": null,
            "jobCommitDeadlineDateStr": null,
            "jobName": this.creatCostContactData.jobName,
            "jobNumber": this.creatCostContactData.jobNumber,
            "jobRequirement": null,
            "jobType": "造价联系单",
            "monthyApplyAmount": null,
            "monthyReplyAmount": null,
            "payType": null,
            "processState": null,
            "professional": null,
            "professionalDirector": null,
            "qualityRequirement": null,
            "receiveUnit": this.creatCostContactData.receiveUnit,
            "remark": this.creatCostContactData.remark,
            "reviewAmount": null,
            "sendPackagePerson": null,
            "sendTaskFiles": null,
            "sendUnit": this.creatCostContactData.sendUnit,
            "singleId": this.projectInfo.id,
            "startDateStr": null,
            "subtractAmount": null,
            "validationAmount": null,
            "xxAmount": null,
            "xxContent": this.creatCostContactData.xxContent,
            "xxContract": this.creatCostContactData.xxContract,
            "xxDateStr": formatDateShort(this.creatCostContactData.xxDateStr),
            "version": this.creatCostContactData.editVersion
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("put", `wholeprocess/updateConsultantJob`, contractData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.creatCostContactDialog = false;
              this.getCostContactList();
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
    saveCostContactData(formName) { //保存技术核定信息
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
            "files_HDD": null,
            "files_JDK": null,
            "files_QT": null,
            "files_QZ": null,
            "files_XJD": null,
            "files_ZJLXD": this.contractData.uploadFiles.length > 0 ? JSON.stringify(this.contractData.uploadFiles) : null,
            "htFiles": null,
            "id": -1,
            "isDirectorAudit": null,
            "isDynamicCost": null,
            "isSendMsg": null,
            "jobCommitDeadlineDateStr": null,
            "jobName": this.creatCostContactData.jobName,
            "jobNumber": this.creatCostContactData.jobNumber,
            "jobRequirement": null,
            "jobType": "造价联系单",
            "monthyApplyAmount": null,
            "monthyReplyAmount": null,
            "payType": null,
            "processState": null,
            "professional": null,
            "professionalDirector": null,
            "qualityRequirement": null,
            "receiveUnit": this.creatCostContactData.receiveUnit,
            "remark": this.creatCostContactData.remark,
            "reviewAmount": null,
            "sendPackagePerson": null,
            "sendTaskFiles": null,
            "sendUnit": this.creatCostContactData.sendUnit,
            "singleId": this.projectInfo.id,
            "startDateStr": null,
            "subtractAmount": null,
            "validationAmount": null,
            "xxAmount": null,
            "xxContent": this.creatCostContactData.xxContent,
            "xxContract": this.creatCostContactData.xxContract,
            "xxDateStr": formatDateShort(this.creatCostContactData.xxDateStr)
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("post", `wholeprocess/addConsultantJob`, contractData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.creatCostContactDialog = false;
              this.getCostContactList();
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
    creatCostContactBtn() { //新建造价联系单
      this.creatCostContactDialog = true;

      this.creatCostContactData = {
        title: '新增 - 造价联系单',
        jobNumber: '',
        jobName: '',
        xxContent: '',
        xxDateStr: '',
        xxContract: '',
        sendUnit: '中诚',
        receiveUnit: '',
        remark: '',
        enclosureFiles: [],
        uploadFiles: []
      }
      this.creatCostContactData.delShow = true;
      this.creatCostContactData.editSave = false;
      this.creatCostContactData.newSave = true;
      this.creatCostContactData.fileList = false;
      if (this.contractData.uploadFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.contractData.uploadFiles = [];

    },
    costContractChildBtn() { //进度款子任务按钮
      this.costContactSearch.jobNumber = '';
      this.costContactSearch.contract = '';
      this.costContactSearch.jobName = '';
      this.costContactDialog = true;
      this.getContractListArray(this.projectInfo.id);
      this.getCostContactList();
    },
    costContactSearchBtn() { //进度款子任务查询
      this.getCostContactList();
    },
    getCostContactList() { //进度款列表获取
      this.costContactSearch.loading = true;
      let params = {
        page: this.costContactSearch.pageNum,
        rows: 10,
        singleId: this.projectInfo.id,
        jobType: "造价联系单",
        jobNumber: this.costContactSearch.jobNumber.trim(),
        jobName: this.costContactSearch.jobName.trim()
      }
      this.publicFun.httpRequest("get", 'wholeprocess/listConsultantJobs', null, (status, data, message) => {
        if (status == 0) {
          //console.log(data);
          this.costContactData = data.rows
          this.costContactSearch.total = data.total;
          this.costContactSearch.loading = false;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    costContactPageChange(val) {
      this.costContactSearch.pageNum = val;
      this.getCostContactList()
    },
    // 造价联系单函数模块

    getContractListArray(id) { //获取对应合同列表
      this.publicFun.httpRequest("get", `wholeprocess/getConsultantContract?singleId=${id}`, null, (status, data, message) => {
        if (status == 0) {
          this.contractList = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    uploadChildDataSuccess(response, file, fileList) { //造价联系单文件上传
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: "造价联系单",
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
            this.getCostContactList();

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
