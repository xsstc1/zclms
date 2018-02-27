<template>
<div>
  <!-- 专业工作-进度款 -->
  <!-- 新增 - 进度款基本信息  -->
  <el-dialog :visible.sync="creatProgressFundDialog" size="small" custom-class="icms-dialog">
    <span slot="title">{{creatProgressFundData.title}}</span>
    <div class="dialog-box">
      <el-form :model="creatProgressFundData" ref="creatProgressFundData" :inline="true" label-width="35%" :rules="creatProgressFundDataRules">
        <div class="icms-dialog-content pr mt-10">
          <nav class="pa">
            进度款基本信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="编号：" class="mt-10 w creat-new-form" prop="jobNumber">
                <el-input class="w" v-model="creatProgressFundData.jobNumber" size="small" placeholder="请填写编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="申请时间：" class="mt-10 w creat-new-form" prop="xxDateStr">
                <el-date-picker :editable="false" v-model="creatProgressFundData.xxDateStr" class="w" size="small" type="date" placeholder="请选择申请时间"></el-date-picker>
                <!-- <el-date-picker :editable="false" class="w" size="small" type="date" placeholder="请输入发包人"></el-date-picker> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="对应合同：" class="mt-10 w creat-new-form" prop="xxContract">
                <el-select v-model="creatProgressFundData.xxContract" placeholder="请选择对应合同" clearable>
                  <el-option v-for="item in contractList" :key="item.jobName" :label="item.jobName" :value="item.jobName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="本月申报金额（元）：" class="mt-10 w creat-new-form" prop="monthyApplyAmount">
                <el-input class="w" v-model="creatProgressFundData.monthyApplyAmount" size="small" type="number" placeholder="请填写本月申报金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="本月批复金额（元）：" class="mt-10 w creat-new-form" prop="monthyReplyAmount">
                <el-input class="w" v-model="creatProgressFundData.monthyReplyAmount" size="small" type="number" placeholder="请填写本月批复金额"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="累计批复金额（元）：" class="mt-10 w creat-new-form" prop="cumulativeReplyAmount">
                <el-input class="w" v-model="creatProgressFundData.cumulativeReplyAmount" size="small" type="number" placeholder="请填写累计批复金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="累计批复比例（%）：" class="mt-10 w creat-new-form" prop="cumulativeReplyRate">
                <el-input class="w" v-model="creatProgressFundData.cumulativeReplyRate" size="small" type="number" placeholder="请填写累计批复比例"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="备注：" class="mt-10 w creat-new-form" prop="remark">
                <el-input type="textarea" class="w" v-model="creatProgressFundData.remark" size="small" placeholder="请填写备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content  pr mt-40" v-if="creatProgressFundData.fileList">
          <nav class="pa">
            进度款附件信息
          </nav>
          <el-table class="noShadow" :data="creatProgressFundData.enclosureFiles" style="width: 100%">
            <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
            <el-table-column min-width="170" prop="fileName" label="文件名称"></el-table-column>
            <el-table-column prop="createTimeStr" width="170" label="上传时间"></el-table-column>
            <el-table-column prop="createUser" width="100" label="上传人"></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button v-if="creatProgressFundData.delShow" @click="delWholeAnalysisFile(scope.row,scope.$index)" class="color-green" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            上传附件 - 进度款附件
          </nav>
          <el-upload class="upload-file w mt-10" ref="upload" :on-remove="uploadWholeContractRemove" :on-error="fileError" :on-success="uploadChildDataSuccess" drag action="icms/wholeprocess/upload/uploadWholeprocessFile" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoading" v-if="creatProgressFundData.editSave" class="btn-orange shadow" type="primary" @click='editSaveProgressFundData("creatProgressFundData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button :loading="buttonLoading" v-if="creatProgressFundData.newSave" class="btn-orange shadow" type="primary" @click='saveProgressFundData("creatProgressFundData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='creatProgressFundDialog=false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 专业工作-进度款 -->
  <el-dialog :visible.sync="progressFundDialog" size="small" custom-class="icms-dialog">
    <span slot="title">专业工作-进度款</span>
    <header>
      <el-form label-position="right" label-width="40%">
        <el-row :gutter="16">
          <el-col :sm="8">
            <el-form-item label="编号：" class="w">
              <el-input v-model="progressFundSearch.jobNumber" class="w" size="small" placeholder="请输入合同编号"></el-input>

            </el-form-item>
          </el-col>
          <el-col :sm="8">
            <el-form-item label="对应合同：" class="w">
              <el-select v-model="progressFundSearch.contract" placeholder="请选择对应合同" clearable>
                <el-option v-for="item in contractList" :key="item.jobName" :label="item.jobName" :value="item.jobName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="tc wait-header-btn f13 mb-20">
          <el-button @click="progressFundSearchBtn" class="btn-orange shadow mt-15" type="primary"><i class="iconfont icon-shiliangzhinengduixiang f14 mr-5"></i>查 询</el-button>
          <el-button @click="creatProgressFundBtn" class="btn-blue shadow mt-15" type="primary"><i class="iconfont icon-iconfont707 f12 mr-5"></i>新 增</el-button>
          <el-button @click="exportWholeSingle" :loading="exportLoading" class="btn-green shadow mt-15" type="primary"><i class="iconfont icon-excel f12 mr-5"></i>导出Excel</el-button>
        </div>
      </el-form>
    </header>
    <el-table class="noShadow mt-10" :data="progressFundData" style="width: 100%" :loading="progressFundSearch.loading" highlight-current-row>
      <el-table-column type="index" label="序号" width="40" align="center"></el-table-column>
      <el-table-column prop="professional" width="150" label="所属专业"></el-table-column>
      <el-table-column prop="consultant" width="120" label="专业咨询员"></el-table-column>
      <el-table-column prop="jobType" width="90" label="工作类型"></el-table-column>
      <el-table-column prop="jobNumber" width="120" label="编号"></el-table-column>
      <el-table-column prop="xxContract" label="对应合同"></el-table-column>
      <el-table-column prop="xxDateStr" width="120" label="申请时间"></el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
            <el-button @click="viewProgressFundSingle(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="editProgressFundSingle(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="delContractSingle(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <footer class="mt-50 cb pagination" v-if="progressFundSearch.total">
      <el-pagination @current-change="progressFundPageChange" :current-page.sync="progressFundSearch.pageNum" layout="prev, pager, next, jumper" :total="progressFundSearch.total" class="fr">
      </el-pagination>
      <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{progressFundSearch.total}}条记录</span>
    </footer>
  </el-dialog>
  <!-- 查看进度款 -->
  <el-dialog :visible.sync="progressFundSingleDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 进度款基本信息</span>
    <div class="dialog-box">
      <div class="icms-dialog-content pr p15">
        <nav class="pa">
          进度款基本信息
        </nav>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">编号：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{progressFundSingleData.jobNumber?progressFundSingleData.jobNumber:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">申请时间：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{progressFundSingleData.xxDateStr?progressFundSingleData.xxDateStr:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">对应合同：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{progressFundSingleData.xxContract?progressFundSingleData.xxContract:"--"}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">本月申报金额（元）：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{progressFundSingleData.monthyApplyAmount?progressFundSingleData.monthyApplyAmount:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">本月批复金额（元）：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{progressFundSingleData.monthyReplyAmount?progressFundSingleData.monthyReplyAmount:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">累计批复金额（元）： </div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{progressFundSingleData.cumulativeReplyAmount?progressFundSingleData.cumulativeReplyAmount:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">累计批复比例（%）：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{progressFundSingleData.cumulativeReplyRate?progressFundSingleData.cumulativeReplyRate:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">备注：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{progressFundSingleData.remark?progressFundSingleData.remark:"--"}} </div>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content  pr mt-40">
        <nav class="pa">
          进度款附件信息
        </nav>
        <el-table class="noShadow" :data="progressFundSingleData.files" style="width: 100%" :loading="progressFundSingleData.loading" highlight-current-row>
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

      // 进度款数据模块
      progressFundSingleData: {
        loading: false,

        jobNumber: '',
        xxDateStr: '',
        xxContract: '',
        monthyApplyAmount: '',
        monthyReplyAmount: '',
        cumulativeReplyAmount: '',
        cumulativeReplyRate: '',
        remark: '',

        files: []
      },
      progressFundDialog: false,
      progressFundSearch: {
        jobNumber: '',
        contract: '',
        pageNum: 1,
        total: 0,
        loading: false
      },
      progressFundData: [],
      creatProgressFundDialog: false,
      progressFundSingleDialog: false,
      creatProgressFundData: {
        title: '新增 - 进度款基本信息',
        delShow: true,
        newSave: true,
        editSave: false,
        fileList: false,

        jobNumber: '',
        xxDateStr: '',
        xxContract: '',
        monthyApplyAmount: '',
        monthyReplyAmount: '',
        cumulativeReplyAmount: '',
        cumulativeReplyRate: '',
        remark: '',
        enclosureFiles: [],
        uploadFiles: []
      },
      creatProgressFundDataRules: {
        jobNumber: [{
          required: true,
          message: '请填写编号'
        }],
        xxContract: [{
          required: true,
          message: '请选择对应合同'
        }],
        xxDateStr: [{
          required: true,
          message: '请选择申请时间'
        }],
        monthyApplyAmount: [{
          required: true,
          message: '请填写本月申报金额'
        }]
      },
      // 进度款数据模块
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
          singleId: this.projectInfo.id,
          id:this.projectInfo.waitId?this.projectInfo.waitId:null,
          jobType: "进度款",
          xxContract: this.progressFundSearch.contract.trim(),
          jobNumber: this.progressFundSearch.jobNumber.trim()
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
              ["序号", "所属专业", "专业咨询员", "工作类型", "编号", "申请时间", "申请单位", "对应合同", "本月申报金额（元）", "本月批复金额（元）", "累计批复金额（元）", "累计批复比例（%）","当前状态","备注"]
            ];
            for (let item in data) {
              let excelSaveArray = [item!="removeByValue" ? parseInt(item) + 1 : "", data[item].professional, data[item].consultant, data[item].jobType, data[item].jobNumber, data[item].xxDateStr, data[item].sendUnit, data[item].xxContract,
                data[item].monthyApplyAmount, data[item].monthyReplyAmount, data[item].cumulativeReplyAmount, data[item].cumulativeReplyRate, data[item].processState, data[item].remark
              ]
              excelData.push(excelSaveArray)
            };
            buildExcel(excelData, `《${this.projectInfo.projectName}》进度款列表`);
            this.exportLoading = false;
            this.$message.closeAll();
          } else {
            that.$message.error(message);
            this.exportLoading = false;
          }
        }, exportData);
      }).catch(() => {});
    },
    // 进度款函数模块
    viewProgressFundSingle(row) { //查看进度款信息
      this.progressFundSingleDialog = true;
      //console.log(row);
      this.progressFundSingleData = {
        loading: true,
        jobNumber: row.jobNumber,
        xxDateStr: row.xxDateStr,
        xxContract: row.xxContract,
        monthyApplyAmount: row.monthyApplyAmount,
        monthyReplyAmount: row.monthyReplyAmount,
        cumulativeReplyAmount: row.cumulativeReplyAmount,
        cumulativeReplyRate: row.cumulativeReplyRate,
        remark: row.remark,

        files: []
      };
      this.publicFun.httpRequest("get", `wholeprocess/getJobFilesByJobId?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.progressFundSingleData.loading = false;
          this.progressFundSingleData.files = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    editProgressFundSingle(row) { //编辑进度款信息
      this.creatProgressFundDialog = true;
      this.contractData.title = "修改 - 进度款基本信息";
      this.creatProgressFundData.delShow = false;
      this.creatProgressFundData.editSave = true;
      this.creatProgressFundData.newSave = false;
      this.creatProgressFundData.fileList = true;

      this.creatProgressFundData.cumulativeReplyAmount = row.cumulativeReplyAmount;
      this.creatProgressFundData.cumulativeReplyRate = row.cumulativeReplyRate;
      this.creatProgressFundData.jobNumber = row.jobNumber;
      this.creatProgressFundData.monthyApplyAmount = row.monthyApplyAmount;
      this.creatProgressFundData.monthyReplyAmount = row.monthyReplyAmount;
      this.creatProgressFundData.remark = row.remark;
      this.creatProgressFundData.xxContract = row.xxContract;
      this.creatProgressFundData.xxDateStr = row.xxDateStr;
      this.creatProgressFundData.editId = row.id;
      this.creatProgressFundData.editVersion = row.version;
      if (this.contractData.uploadFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.contractData.uploadFiles = [];

      this.publicFun.httpRequest("get", `wholeprocess/getJobFilesByJobId?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.creatProgressFundData.enclosureFiles = data;
        } else {
          this.$message.error(message);
        }
      });

    },
    editSaveProgressFundData(formName) { //修改进度款信息
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
            "cumulativeReplyAmount": this.creatProgressFundData.cumulativeReplyAmount,
            "cumulativeReplyRate": this.creatProgressFundData.cumulativeReplyRate,
            "files_BG": null,
            "files_GCLXD": null,
            "files_GS": null,
            "files_HDD": null,
            "files_JDK": this.contractData.uploadFiles.length > 0 ? JSON.stringify(this.contractData.uploadFiles) : null,
            "files_QT": null,
            "files_QZ": null,
            "files_XJD": null,
            "files_ZJLXD": null,
            "htFiles": null,
            "id": this.creatProgressFundData.editId,
            "isDirectorAudit": null,
            "isDynamicCost": null,
            "isSendMsg": null,
            "jobCommitDeadlineDateStr": null,
            "jobName": null,
            "jobNumber": this.creatProgressFundData.jobNumber,
            "jobRequirement": null,
            "jobType": "进度款",
            "monthyApplyAmount": this.creatProgressFundData.monthyApplyAmount,
            "monthyReplyAmount": this.creatProgressFundData.monthyReplyAmount,
            "payType": null,
            "processState": null,
            "professional": null,
            "professionalDirector": null,
            "qualityRequirement": null,
            "receiveUnit": null,
            "remark": this.creatProgressFundData.remark,
            "reviewAmount": null,
            "sendPackagePerson": null,
            "sendTaskFiles": null,
            "sendUnit": null,
            "singleId": this.projectInfo.id,
            "startDateStr": null,
            "subtractAmount": null,
            "validationAmount": null,
            "xxAmount": null,
            "xxContent": null,
            "xxContract": this.creatProgressFundData.xxContract,
            "xxDateStr": formatDateShort(this.creatProgressFundData.xxDateStr),
            "version": this.creatProgressFundData.editVersion
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("put", `wholeprocess/updateConsultantJob`, contractData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.creatProgressFundDialog = false;
              this.getProgressFundList();
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
    saveProgressFundData(formName) { //保存进度款信息
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
            "cumulativeReplyAmount": this.creatProgressFundData.cumulativeReplyAmount,
            "cumulativeReplyRate": this.creatProgressFundData.cumulativeReplyRate,
            "files_BG": null,
            "files_GCLXD": null,
            "files_GS": null,
            "files_HDD": null,
            "files_JDK": this.contractData.uploadFiles.length > 0 ? JSON.stringify(this.contractData.uploadFiles) : null,
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
            "jobName": null,
            "jobNumber": this.creatProgressFundData.jobNumber,
            "jobRequirement": null,
            "jobType": "进度款",
            "monthyApplyAmount": this.creatProgressFundData.monthyApplyAmount,
            "monthyReplyAmount": this.creatProgressFundData.monthyReplyAmount,
            "payType": null,
            "processState": null,
            "professional": null,
            "professionalDirector": null,
            "qualityRequirement": null,
            "receiveUnit": null,
            "remark": this.creatProgressFundData.remark,
            "reviewAmount": null,
            "sendPackagePerson": null,
            "sendTaskFiles": null,
            "sendUnit": null,
            "singleId": this.projectInfo.id,
            "startDateStr": null,
            "subtractAmount": null,
            "validationAmount": null,
            "xxAmount": null,
            "xxContent": null,
            "xxContract": this.creatProgressFundData.xxContract,
            "xxDateStr": formatDateShort(this.creatProgressFundData.xxDateStr)
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("post", `wholeprocess/addConsultantJob`, contractData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.creatProgressFundDialog = false;
              this.getProgressFundList();
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
    creatProgressFundBtn() { //新建进度款
      this.creatProgressFundDialog = true;

      this.creatProgressFundData = {
        title: '新增 - 进度款基本信息',
        jobNumber: '',
        xxDateStr: '',
        xxContract: '',
        monthyApplyAmount: '',
        monthyReplyAmount: '',
        cumulativeReplyAmount: '',
        cumulativeReplyRate: '',
        remark: '',
        enclosureFiles: [],
        uploadFiles: []
      }
      this.creatProgressFundData.delShow = true;
      this.creatProgressFundData.editSave = false;
      this.creatProgressFundData.newSave = true;
      this.creatProgressFundData.fileList = false;
      if (this.contractData.uploadFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.contractData.uploadFiles = [];

    },
    progressFundChildBtn() { //进度款子任务按钮
      this.progressFundSearch.jobNumber = '';
      this.progressFundSearch.contract = '';
      this.progressFundDialog = true;
      this.getContractListArray(this.projectInfo.id);
      this.getProgressFundList();
    },
    progressFundSearchBtn() { //进度款子任务查询
      this.getProgressFundList();
    },
    getProgressFundList() { //进度款列表获取
      this.progressFundSearch.loading = true;
      let params = {
        page: this.progressFundSearch.pageNum,
        rows: 10,
        singleId: this.projectInfo.id,
        jobType: "进度款",
        xxContract: this.progressFundSearch.contract.trim(),
        jobNumber: this.progressFundSearch.jobNumber.trim()
      }
      this.publicFun.httpRequest("get", 'wholeprocess/listConsultantJobs', null, (status, data, message) => {
        if (status == 0) {
          //console.log(data);
          this.progressFundData = data.rows
          this.progressFundSearch.total = data.total;
          this.progressFundSearch.loading = false;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    progressFundPageChange(val) {
      this.progressFundSearch.pageNum = val;
      this.getProgressFundList()
    },
    // 进度款函数模块

    getContractListArray(id) { //获取对应合同列表
      this.publicFun.httpRequest("get", `wholeprocess/getConsultantContract?singleId=${id}`, null, (status, data, message) => {
        if (status == 0) {
          this.contractList = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    uploadChildDataSuccess(response, file, fileList) { //进度款文件上传
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: "进度款",
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
