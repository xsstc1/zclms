<template>
<div>
  <!-- 专业工作-工程联系单 -->
  <el-dialog :visible.sync="projectContactDialog" size="small" custom-class="icms-dialog">
    <span slot="title">专业工作-工程联系单</span>
    <header>
      <el-form label-position="right" label-width="40%">
        <el-row :gutter="16">
          <el-col :sm="6">
            <el-form-item label="编号：" class="w">
              <el-input v-model="projectContactSearch.jobNumber" class="w" size="small" placeholder="请输入合同编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="10">
            <el-form-item label="工程联系单名称：" class="w">
              <el-input v-model="projectContactSearch.jobName" class="w" size="small" placeholder="请输入工程联系单名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="tc wait-header-btn f13 mb-20">
          <el-button @click="projectContactSearchBtn" class="btn-orange shadow mt-15" type="primary"><i class="iconfont icon-shiliangzhinengduixiang f14 mr-5"></i>查 询</el-button>
          <el-button @click="creatProjectContactBtn" class="btn-blue shadow mt-15" type="primary"><i class="iconfont icon-iconfont707 f12 mr-5"></i>新 增</el-button>
          <el-button @click="exportWholeSingle" :loading="exportLoading" class="btn-green shadow mt-15" type="primary"><i class="iconfont icon-excel f12 mr-5"></i>导出Excel</el-button>
        </div>
      </el-form>
    </header>
    <el-table class="noShadow mt-10" :data="projectContactData" style="width: 100%" :loading="projectContactSearch.loading" highlight-current-row>
      <el-table-column type="index" label="序号" width="40" align="center"></el-table-column>
      <el-table-column prop="professional" width="150" label="所属专业"></el-table-column>
      <el-table-column prop="consultant" width="120" label="专业咨询员"></el-table-column>
      <el-table-column prop="jobType" width="90" label="工作类型"></el-table-column>
      <el-table-column prop="jobNumber" width="90" label="编号"></el-table-column>
      <el-table-column prop="xxContent" width="120" label="技术和订单内容"></el-table-column>
      <el-table-column prop="xxContract" label="对应合同"></el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
              <el-button @click="viewProjectContactSingle(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="editProjectContactSingle(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click="delContractSingle(scope.row)" type="text" size="small">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    <footer class="mt-50 cb pagination" v-if="projectContactSearch.total">
      <el-pagination @current-change="projectContactPageChange" :current-page.sync="projectContactSearch.pageNum" layout="prev, pager, next, jumper" :total="projectContactSearch.total" class="fr">
      </el-pagination>
      <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{projectContactSearch.total}}条记录</span>
    </footer>
  </el-dialog>
  <!-- 新增 - 工程联系单基本信息  -->
  <el-dialog :visible.sync="creatProjectContactDialog" size="small" custom-class="icms-dialog">
    <span slot="title">{{creatProjectContactData.title}}</span>
    <div class="dialog-box">
      <el-form :model="creatProjectContactData" ref="creatProjectContactData" :inline="true" label-width="35%" :rules="creatProjectContactDataRules">
        <div class="icms-dialog-content pr mt-10">
          <nav class="pa">
            工程联系单基本信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="编号：" class="mt-10 w creat-new-form" prop="jobNumber">
                <el-input class="w" v-model="creatProjectContactData.jobNumber" size="small" placeholder="请填写编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="工程联系单名称：" class="mt-10 w creat-new-form" prop="jobName">
                <el-input class="w" v-model="creatProjectContactData.jobName" size="small" placeholder="请填写工程联系单名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="工程联系单内容：" class="mt-10 w creat-new-form" prop="xxContent">
                <el-input class="w" v-model="creatProjectContactData.xxContent" size="small" placeholder="请填写工程联系单内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="发起单位：" class="mt-10 w creat-new-form" prop="sendUnit">
                <el-input class="w" v-model="creatProjectContactData.sendUnit" size="small" placeholder="请填写发起单位"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="接收单位：" class="mt-10 w creat-new-form" prop="receiveUnit">
                <el-input class="w" v-model="creatProjectContactData.receiveUnit" size="small" placeholder="请填写接收单位"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="对应合同：" class="mt-10 w creat-new-form" prop="xxContract">
                <el-select v-model="creatProjectContactData.xxContract" placeholder="请选择对应合同" clearable>
                  <el-option v-for="item in contractList" :key="item.jobName" :label="item.jobName" :value="item.jobName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="审核金额（元）：" class="mt-10 w creat-new-form" prop="validationAmount">
                <el-input type="number" class="w" v-model="creatProjectContactData.validationAmount" size="small" placeholder="请填写审核金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="送审金额（元）：" class="mt-10 w creat-new-form" prop="reviewAmount">
                <el-input type="number" class="w" v-model="creatProjectContactData.reviewAmount" size="small" placeholder="请填写送审金额"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="核（增）减金额（元）：" class="mt-10 w creat-new-form" prop="subtractAmount">
                <el-input type="number" class="w" v-model="creatProjectContactData.subtractAmount" size="small" placeholder="请填写核（增）减金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="发起时间：" class="mt-10 w creat-new-form" prop="xxDateStr">
                <el-date-picker :editable="false" v-model="creatProjectContactData.xxDateStr" class="w" size="small" type="date" placeholder="请选择发起时间"></el-date-picker>
              </el-form-item>

            </el-col>
          </el-row>

          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="备注：" class="mt-10 w creat-new-form" prop="remark">
                <el-input type="textarea" class="w" v-model="creatProjectContactData.remark" size="small" placeholder="请填写备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content  pr mt-40" v-if="creatProjectContactData.fileList">
          <nav class="pa">
            工程联系单附件信息
          </nav>
          <el-table class="noShadow" :data="creatProjectContactData.enclosureFiles" style="width: 100%">
            <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
            <el-table-column prop="fileName" label="文件名称"></el-table-column>
            <el-table-column prop="createTimeStr" width="170" label="上传时间"></el-table-column>
            <el-table-column prop="createUser" width="100" label="上传人"></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                  <el-button v-if="creatProjectContactData.delShow" @click="delWholeAnalysisFile(scope.row,scope.$index)" class="color-green" type="text" size="small">删除</el-button>
                  </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            上传附件 - 工程联系单附件
          </nav>
          <el-upload class="upload-file w mt-10" ref="upload" :on-remove="uploadWholeContractRemove" :on-error="fileError" :on-success="uploadChildDataSuccess" drag action="icms/wholeprocess/upload/uploadWholeprocessFile" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoading" v-if="creatProjectContactData.editSave" class="btn-orange shadow" type="primary" @click='editSaveProjectContactData("creatProjectContactData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button :loading="buttonLoading" v-if="creatProjectContactData.newSave" class="btn-orange shadow" type="primary" @click='saveProjectContactData("creatProjectContactData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='creatProjectContactDialog=false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 查看工程联系单 -->
  <el-dialog :visible.sync="projectContactSingleDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 工程联系单基本信息</span>
    <div class="dialog-box">
      <div class="icms-dialog-content pr p15">
        <nav class="pa">
          工程联系单基本信息
        </nav>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">编号：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{projectContactSingleData.jobNumber?projectContactSingleData.jobNumber:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">工程联系单名称：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{projectContactSingleData.jobName?projectContactSingleData.jobName:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">工程联系单内容：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{projectContactSingleData.xxContent?projectContactSingleData.xxContent:"--"}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">发起单位：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{projectContactSingleData.sendUnit?projectContactSingleData.sendUnit:"--"}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">接收单位：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{projectContactSingleData.receiveUnit?projectContactSingleData.receiveUnit:"--"}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">对应合同：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{projectContactSingleData.xxContract?projectContactSingleData.xxContract:"--"}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">送审金额（元）：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{projectContactSingleData.validationAmount?projectContactSingleData.validationAmount:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">审核金额（元）：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{projectContactSingleData.reviewAmount?projectContactSingleData.reviewAmount:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">核（增）减金额（元）：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{projectContactSingleData.subtractAmount?projectContactSingleData.subtractAmount:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">发起时间：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{projectContactSingleData.xxDateStr?projectContactSingleData.xxDateStr:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">备注：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{projectContactSingleData.remark?projectContactSingleData.remark:"--"}} </div>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content  pr mt-40">
        <nav class="pa">
          合同附件信息
        </nav>
        <el-table class="noShadow" :data="projectContactSingleData.files" style="width: 100%" :loading="projectContactSingleData.loading" highlight-current-row>
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

      // 工程联系单数据模块
      projectContactSingleData: {
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
      projectContactDialog: false,
      projectContactSearch: {
        jobNumber: '',
        jobName: '',
        contract: '',
        pageNum: 1,
        total: 0,
        loading: false
      },
      projectContactData: [],
      creatProjectContactDialog: false,
      projectContactSingleDialog: false,
      creatProjectContactData: {
        title: '新增 - 工程联系单',
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
        validationAmount: '',
        validationAmount: '',
        subtractAmount: '',
        remark: '',

        enclosureFiles: [],
        uploadFiles: []
      },
      creatProjectContactDataRules: {
        jobNumber: [{
          required: true,
          message: '请填写编号'
        }],
        jobName: [{
          required: true,
          message: '请填写工程联系单名称'
        }],
        xxContract: [{
          required: true,
          message: '请选择对应合同'
        }],
        validationAmount: [{
          required: true,
          message: '请选择审核金额'
        }],
        reviewAmount: [{
          required: true,
          message: '请填写送审金额'
        }],
        subtractAmount: [{
          required: true,
          message: '请填写核（增）减金额'
        }],
        xxDateStr: [{
          required: true,
          message: '请选择发起时间'
        }]
      },
      // 工程联系单数据模块
    }
  },
  watch: {
    creatProjectContactData: {
      handler: function(val, oldval) {
        this.creatProjectContactData.subtractAmount = (val.reviewAmount - val.validationAmount) ? (val.reviewAmount - val.validationAmount).toFixed(2):0;
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
          jobType: "工程联系单",
          jobNumber: this.projectContactSearch.jobNumber.trim(),
          jobName: this.projectContactSearch.jobName.trim()
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
              ["序号", "所属专业", "专业咨询员", "工作类型", "编号", "名称", "内容", "发起单位", "接收单位","发起时间","当前状态","备注"]
            ];
            for (let item in data) {
              let excelSaveArray = [item!="removeByValue" ? parseInt(item) + 1 : "", data[item].professional, data[item].consultant, data[item].jobType, data[item].jobNumber, data[item].jobName, data[item].xxContent,
                data[item].sendUnit, data[item].receiveUnit, data[item].xxDateStr, data[item].processState, data[item].remark
              ]
              excelData.push(excelSaveArray)
            };
            buildExcel(excelData, `《${this.projectInfo.projectName}》工程联系单列表`);
            this.exportLoading = false;
            this.$message.closeAll();
          } else {
            that.$message.error(message);
            this.exportLoading = false;
          }
        }, exportData);
      }).catch(() => {});
    },
    viewProjectContactSingle(row) { //查看工程联系单信息
      this.projectContactSingleDialog = true;
      //console.log(row);
      this.projectContactSingleData = {
        loading: true,

        jobNumber: row.jobNumber,
        jobName: row.jobName,
        xxContent: row.xxContent,
        xxDateStr: row.xxDateStr,
        validationAmount: row.validationAmount,
        reviewAmount: row.reviewAmount,
        subtractAmount: row.subtractAmount,
        xxContract: row.xxContract,
        sendUnit: row.sendUnit,
        receiveUnit: row.receiveUnit,
        remark: row.remark,

        files: []
      };
      this.publicFun.httpRequest("get", `wholeprocess/getJobFilesByJobId?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.projectContactSingleData.loading = false;
          this.projectContactSingleData.files = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    editProjectContactSingle(row) { //编辑技术核定信息
      this.creatProjectContactDialog = true;
      this.creatProjectContactData.title = "修改 - 工程联系单基本信息";
      this.creatProjectContactData.delShow = false;
      this.creatProjectContactData.editSave = true;
      this.creatProjectContactData.newSave = false;
      this.creatProjectContactData.fileList = true;

      this.creatProjectContactData.jobName = row.jobName;
      this.creatProjectContactData.xxContent = row.xxContent;
      this.creatProjectContactData.jobNumber = row.jobNumber;
      this.creatProjectContactData.sendUnit = row.sendUnit;
      this.creatProjectContactData.receiveUnit = row.receiveUnit;
      this.creatProjectContactData.validationAmount = row.validationAmount;
      this.creatProjectContactData.reviewAmount = row.reviewAmount;
      this.creatProjectContactData.subtractAmount = row.subtractAmount;
      this.creatProjectContactData.remark = row.remark;
      this.creatProjectContactData.xxContract = row.xxContract;
      this.creatProjectContactData.xxDateStr = row.xxDateStr;
      this.creatProjectContactData.editId = row.id;
      this.creatProjectContactData.editVersion = row.version;

      if (this.contractData.uploadFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.contractData.uploadFiles = [];

      this.publicFun.httpRequest("get", `wholeprocess/getJobFilesByJobId?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.creatProjectContactData.enclosureFiles = data;
        } else {
          this.$message.error(message);
        }
      });

    },
    editSaveProjectContactData(formName) { //修改技术核定信息
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
            "files_GCLXD": this.contractData.uploadFiles.length > 0 ? JSON.stringify(this.contractData.uploadFiles) : null,
            "files_GS": null,
            "files_HDD": null,
            "files_JDK": null,
            "files_QT": null,
            "files_QZ": null,
            "files_XJD": null,
            "files_ZJLXD": null,
            "htFiles": null,
            "id": this.creatProjectContactData.editId,
            "isDirectorAudit": null,
            "isDynamicCost": null,
            "isSendMsg": null,
            "jobCommitDeadlineDateStr": null,
            "jobName": this.creatProjectContactData.jobName,
            "jobNumber": this.creatProjectContactData.jobNumber,
            "jobRequirement": null,
            "jobType": "工程联系单",
            "monthyApplyAmount": null,
            "monthyReplyAmount": null,
            "payType": null,
            "processState": null,
            "professional": null,
            "professionalDirector": null,
            "qualityRequirement": null,
            "receiveUnit": this.creatProjectContactData.receiveUnit,
            "remark": this.creatProjectContactData.remark,
            "reviewAmount": this.creatProjectContactData.reviewAmount,
            "sendPackagePerson": null,
            "sendTaskFiles": null,
            "sendUnit": this.creatProjectContactData.sendUnit,
            "singleId": this.projectInfo.id,
            "startDateStr": null,
            "subtractAmount": this.creatProjectContactData.subtractAmount,
            "validationAmount": this.creatProjectContactData.validationAmount,
            "xxAmount": null,
            "xxContent": this.creatProjectContactData.xxContent,
            "xxContract": this.creatProjectContactData.xxContract,
            "xxDateStr": formatDateShort(this.creatProjectContactData.xxDateStr),
            "version": this.creatProjectContactData.editVersion

          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("put", `wholeprocess/updateConsultantJob`, contractData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.creatProjectContactDialog = false;
              this.getProjectContactList();
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
    saveProjectContactData(formName) { //保存技术核定信息
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
            "files_GCLXD": this.contractData.uploadFiles.length > 0 ? JSON.stringify(this.contractData.uploadFiles) : null,
            "files_GS": null,
            "files_HDD": null,
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
            "jobName": this.creatProjectContactData.jobName,
            "jobNumber": this.creatProjectContactData.jobNumber,
            "jobRequirement": null,
            "jobType": "工程联系单",
            "monthyApplyAmount": null,
            "monthyReplyAmount": null,
            "payType": null,
            "processState": null,
            "professional": null,
            "professionalDirector": null,
            "qualityRequirement": null,
            "receiveUnit": this.creatProjectContactData.receiveUnit,
            "remark": this.creatProjectContactData.remark,
            "reviewAmount": this.creatProjectContactData.reviewAmount,
            "sendPackagePerson": null,
            "sendTaskFiles": null,
            "sendUnit": this.creatProjectContactData.sendUnit,
            "singleId": this.projectInfo.id,
            "startDateStr": null,
            "subtractAmount": this.creatProjectContactData.subtractAmount,
            "validationAmount": this.creatProjectContactData.validationAmount,
            "xxAmount": null,
            "xxContent": this.creatProjectContactData.xxContent,
            "xxContract": this.creatProjectContactData.xxContract,
            "xxDateStr": formatDateShort(this.creatProjectContactData.xxDateStr)
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("post", `wholeprocess/addConsultantJob`, contractData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.creatProjectContactDialog = false;
              this.getProjectContactList();
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
    creatProjectContactBtn() { //新建工程联系单
      this.creatProjectContactDialog = true;

      this.creatProjectContactData = {
        title: '新增 - 工程联系单',
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
      }
      this.creatProjectContactData.delShow = true;
      this.creatProjectContactData.editSave = false;
      this.creatProjectContactData.newSave = true;
      this.creatProjectContactData.fileList = false;
      if (this.contractData.uploadFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.contractData.uploadFiles = [];

    },
    projectContactChildBtn() { //工程联系单子任务按钮
      this.projectContactSearch.jobNumber = '';
      this.projectContactSearch.contract = '';
      this.projectContactSearch.jobName = '';
      this.projectContactDialog = true;
      this.getContractListArray(this.projectInfo.id);
      this.getProjectContactList();
    },
    projectContactSearchBtn() { //工程联系单子任务查询
      this.getProjectContactList();
    },
    getProjectContactList() { //工程联系单列表获取
      this.projectContactSearch.loading = true;
      let params = {
        page: this.projectContactSearch.pageNum,
        rows: 10,
        singleId: this.projectInfo.id,
        jobType: "工程联系单",
        jobNumber: this.projectContactSearch.jobNumber.trim(),
        jobName: this.projectContactSearch.jobName.trim()
      }
      this.publicFun.httpRequest("get", 'wholeprocess/listConsultantJobs', null, (status, data, message) => {
        if (status == 0) {
          //console.log(data);
          this.projectContactData = data.rows
          this.projectContactSearch.total = data.total;
          this.projectContactSearch.loading = false;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    projectContactPageChange(val) {
      this.projectContactSearch.pageNum = val;
      this.getProjectContactList()
    },

    getContractListArray(id) { //获取对应合同列表
      this.publicFun.httpRequest("get", `wholeprocess/getConsultantContract?singleId=${id}`, null, (status, data, message) => {
        if (status == 0) {
          this.contractList = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    uploadChildDataSuccess(response, file, fileList) { //工程联系单文件上传
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: "工程联系单",
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
