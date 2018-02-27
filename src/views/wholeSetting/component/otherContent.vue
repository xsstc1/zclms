<template>
<div>
  <!-- 专业工作-其它 -->
  <el-dialog :visible.sync="otherDialog" size="small" custom-class="icms-dialog">
    <span slot="title">专业工作-其他</span>
    <header>
      <el-form label-position="right" label-width="30%">
        <el-row :gutter="16">
          <el-col :sm="6">
            <el-form-item label="编号：" class="w">
              <el-input v-model="otherSearch.jobNumber" class="w" size="small" placeholder="请输入编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="10">
            <el-form-item label="文件名称：" class="w">
              <el-input v-model="otherSearch.jobName" class="w" size="small" placeholder="请输入文件名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="tc wait-header-btn f13 mb-20">
          <el-button @click="otherSearchBtn" class="btn-orange shadow mt-15" type="primary"><i class="iconfont icon-shiliangzhinengduixiang f14 mr-5"></i>查 询</el-button>
          <el-button @click="creatOtherBtn" class="btn-blue shadow mt-15" type="primary"><i class="iconfont icon-iconfont707 f12 mr-5"></i>新 增</el-button>
          <el-button @click="exportWholeSingle" :loading="exportLoading" class="btn-green shadow mt-15" type="primary"><i class="iconfont icon-excel f12 mr-5"></i>导出Excel</el-button>
        </div>
      </el-form>
    </header>
    <el-table class="noShadow mt-10" :data="otherData" style="width: 100%" :loading="otherSearch.loading" highlight-current-row>
      <el-table-column type="index" label="序号" width="40" align="center"></el-table-column>
      <el-table-column prop="professional" width="150" label="所属专业"></el-table-column>
      <el-table-column prop="consultant" width="120" label="专业咨询员"></el-table-column>
      <el-table-column prop="jobType" width="90" label="工作类型"></el-table-column>
      <el-table-column prop="jobNumber" width="90" label="编号"></el-table-column>
      <el-table-column prop="jobName" label="文件名称"></el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
              <el-button @click="viewOtherSingle(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="editOtherSingle(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click="delContractSingle(scope.row)" type="text" size="small">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    <footer class="mt-50 cb pagination" v-if="otherSearch.total">
      <el-pagination @current-change="otherPageChange" :current-page.sync="otherSearch.pageNum" layout="prev, pager, next, jumper" :total="otherSearch.total" class="fr">
      </el-pagination>
      <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{otherSearch.total}}条记录</span>
    </footer>
  </el-dialog>
  <!-- 新增 - 其它基本信息  -->
  <el-dialog :visible.sync="creatOtherDialog" size="small" custom-class="icms-dialog">
    <span slot="title">{{creatOtherData.title}}</span>
    <div class="dialog-box">
      <el-form :model="creatOtherData" ref="creatOtherData" :inline="true" label-width="35%" :rules="creatOtherDataRules">
        <div class="icms-dialog-content pr mt-10">
          <nav class="pa">
            其他基本信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="编号：" class="mt-10 w creat-new-form" prop="jobNumber">
                <el-input class="w" v-model="creatOtherData.jobNumber" size="small" placeholder="请填写编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="文件名称：" class="mt-10 w creat-new-form" prop="jobName">
                <el-input class="w" v-model="creatOtherData.jobName" size="small" placeholder="请填写其它名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="主要内容：" class="mt-10 w creat-new-form" prop="xxContent">
                <el-input type="textarea" class="w" v-model="creatOtherData.xxContent" size="small" placeholder="请填写主要内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="备注：" class="mt-10 w creat-new-form" prop="remark">
                <el-input type="textarea" class="w" v-model="creatOtherData.remark" size="small" placeholder="请填写备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content  pr mt-40" v-if="creatOtherData.fileList">
          <nav class="pa">
            其它附件信息
          </nav>
          <el-table class="noShadow" :data="creatOtherData.enclosureFiles" style="width: 100%">
            <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
            <el-table-column prop="fileName" label="文件名称"></el-table-column>
            <el-table-column prop="createTimeStr" width="170" label="上传时间"></el-table-column>
            <el-table-column prop="createUser" width="100" label="上传人"></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                  <el-button v-if="creatOtherData.delShow" @click="delWholeAnalysisFile(scope.row,scope.$index)" class="color-green" type="text" size="small">删除</el-button>
                  </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            上传附件 - 其它附件
          </nav>
          <el-upload class="upload-file w mt-10" ref="upload" :on-remove="uploadWholeContractRemove" :on-error="fileError" :on-success="uploadChildDataSuccess" drag action="icms/wholeprocess/upload/uploadWholeprocessFile" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoading" v-if="creatOtherData.editSave" class="btn-orange shadow" type="primary" @click='editSaveOtherData("creatOtherData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button :loading="buttonLoading" v-if="creatOtherData.newSave" class="btn-orange shadow" type="primary" @click='saveOtherData("creatOtherData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='creatOtherDialog=false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 查看其它 -->
  <el-dialog :visible.sync="otherSingleDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 其它基本信息</span>
    <div class="dialog-box">
      <div class="icms-dialog-content pr p15">
        <nav class="pa">
          其它基本信息
        </nav>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">编号：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{otherSingleData.jobNumber?otherSingleData.jobNumber:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">文件名称：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{otherSingleData.jobName?otherSingleData.jobName:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">主要内容：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{otherSingleData.xxContent?otherSingleData.xxContent:"--"}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">备注：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{otherSingleData.remark?otherSingleData.remark:"--"}} </div>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content pr mt-40">
        <nav class="pa">
          合同附件信息
        </nav>
        <el-table class="noShadow" :data="otherSingleData.files" style="width: 100%" :loading="otherSingleData.loading" highlight-current-row>
          <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
          <el-table-column prop="fileName" label="文件名称"></el-table-column>
          <el-table-column prop="fileType" width="100" label="文件类型"></el-table-column>
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
      // 其它数据模块
      otherSingleData: {
        loading: false,

        jobNumber: '',
        jobName: '',
        xxContent: '',
        remark: '',

        files: []
      },
      otherDialog: false,
      otherSearch: {
        jobNumber: '',
        jobName: '',
        contract: '',
        pageNum: 1,
        total: 0,
        loading: false
      },
      otherData: [],
      creatOtherDialog: false,
      otherSingleDialog: false,
      creatOtherData: {
        title: '新增 - 其它',
        delShow: true,
        newSave: true,
        editSave: false,
        fileList: false,

        jobNumber: '',
        jobName: '',
        xxContent: '',
        remark: '',

        enclosureFiles: [],
        uploadFiles: []
      },
      creatOtherDataRules: {
        jobNumber: [{
          required: true,
          message: '请填写编号'
        }],
        jobName: [{
          required: true,
          message: '请填写文件名称'
        }]

      },
      // 其它数据模块
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
          jobType: "其他",
          jobNumber: this.otherSearch.jobNumber.trim(),
          jobName: this.otherSearch.jobName.trim()
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
              ["序号", "所属专业", "专业咨询员", "工作类型", "编号", "文件名称", "主要内容", "当前状态","备注"]
            ];
            for (let item in data) {
              let excelSaveArray = [item!="removeByValue" ? parseInt(item) + 1 : "", data[item].professional, data[item].consultant, data[item].jobType, data[item].jobNumber, data[item].jobName, data[item].xxContent,
               data[item].processState, data[item].remark
              ]
              excelData.push(excelSaveArray)
            };
            buildExcel(excelData, `《${this.projectInfo.projectName}》其他列表`);
            this.exportLoading = false;
            this.$message.closeAll();
          } else {
            that.$message.error(message);
            this.exportLoading = false;
          }
        }, exportData);
      }).catch(() => {});
    },
    viewOtherSingle(row) { //查看其它信息
      this.otherSingleDialog = true;
      //console.log(row);
      this.otherSingleData = {
        loading: true,

        jobNumber: row.jobNumber,
        jobName: row.jobName,
        xxContent: row.xxContent,
        remark: row.remark,

        files: []
      };
      this.publicFun.httpRequest("get", `wholeprocess/getJobFilesByJobId?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.otherSingleData.loading = false;
          this.otherSingleData.files = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    editOtherSingle(row) { //编辑技术核定信息
      this.creatOtherDialog = true;
      this.creatOtherData.title = "修改 - 其它基本信息";
      this.creatOtherData.delShow = false;
      this.creatOtherData.editSave = true;
      this.creatOtherData.newSave = false;
      this.creatOtherData.fileList = true;

      this.creatOtherData.jobName = row.jobName;
      this.creatOtherData.xxContent = row.xxContent;
      this.creatOtherData.jobNumber = row.jobNumber;
      this.creatOtherData.remark = row.remark;
      this.creatOtherData.editId = row.id;
      this.creatOtherData.editVersion = row.version;

      if (this.contractData.uploadFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.contractData.uploadFiles = [];

      this.publicFun.httpRequest("get", `wholeprocess/getJobFilesByJobId?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.creatOtherData.enclosureFiles = data;
        } else {
          this.$message.error(message);
        }
      });

    },
    editSaveOtherData(formName) { //修改技术核定信息
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
            "files_QT": this.contractData.uploadFiles.length > 0 ? JSON.stringify(this.contractData.uploadFiles) : null,
            "files_QZ": null,
            "files_XJD": null,
            "files_ZJLXD": null,
            "htFiles": null,
            "id": this.creatOtherData.editId,
            "isDirectorAudit": null,
            "isDynamicCost": null,
            "isSendMsg": null,
            "jobCommitDeadlineDateStr": null,
            "jobName": this.creatOtherData.jobName,
            "jobNumber": this.creatOtherData.jobNumber,
            "jobRequirement": null,
            "jobType": "其它",
            "monthyApplyAmount": null,
            "monthyReplyAmount": null,
            "payType": null,
            "processState": null,
            "professional": null,
            "professionalDirector": null,
            "qualityRequirement": null,
            "receiveUnit": null,
            "remark": this.creatOtherData.remark,
            "reviewAmount": null,
            "sendPackagePerson": null,
            "sendTaskFiles": null,
            "sendUnit": null,
            "singleId": this.projectInfo.id,
            "startDateStr": null,
            "subtractAmount": null,
            "validationAmount": null,
            "xxAmount": null,
            "xxContent": this.creatOtherData.xxContent,
            "xxContract": null,
            "xxDateStr": null,
            "version": this.creatOtherData.editVersion
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("put", `wholeprocess/updateConsultantJob`, contractData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.creatOtherDialog = false;
              this.getOtherList();
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
    saveOtherData(formName) { //保存技术核定信息
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
            "files_QT": this.contractData.uploadFiles.length > 0 ? JSON.stringify(this.contractData.uploadFiles) : null,
            "files_QZ": null,
            "files_XJD": null,
            "files_ZJLXD": null,
            "htFiles": null,
            "id": -1,
            "isDirectorAudit": null,
            "isDynamicCost": null,
            "isSendMsg": null,
            "jobCommitDeadlineDateStr": null,
            "jobName": this.creatOtherData.jobName,
            "jobNumber": this.creatOtherData.jobNumber,
            "jobRequirement": null,
            "jobType": "其它",
            "monthyApplyAmount": null,
            "monthyReplyAmount": null,
            "payType": null,
            "processState": null,
            "professional": null,
            "professionalDirector": null,
            "qualityRequirement": null,
            "receiveUnit": null,
            "remark": this.creatOtherData.remark,
            "reviewAmount": null,
            "sendPackagePerson": null,
            "sendTaskFiles": null,
            "sendUnit": null,
            "singleId": this.projectInfo.id,
            "startDateStr": null,
            "subtractAmount": null,
            "validationAmount": null,
            "xxAmount": null,
            "xxContent": this.creatOtherData.xxContent,
            "xxContract":null,
            "xxDateStr": null
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("post", `wholeprocess/addConsultantJob`, contractData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.creatOtherDialog = false;
              this.getOtherList();
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
    creatOtherBtn() { //新建其他
      this.creatOtherDialog = true;

      this.creatOtherData = {
        title: '新增 - 其它',
        jobNumber: '',
        jobName: '',
        xxContent: '',
        remark: '',
        enclosureFiles: [],
        uploadFiles: []
      }
      this.creatOtherData.delShow = true;
      this.creatOtherData.editSave = false;
      this.creatOtherData.newSave = true;
      this.creatOtherData.fileList = false;
      if (this.contractData.uploadFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.contractData.uploadFiles = [];

    },
    otherContentChildBtn() { //其他子任务按钮
      this.otherSearch.jobNumber = '';
      this.otherSearch.jobName = '';
      this.otherDialog = true;
      this.getContractListArray(this.projectInfo.id);
      this.getOtherList();
    },
    otherSearchBtn() { //其他子任务查询
      this.getOtherList();
    },
    getOtherList() { //其他列表获取
      this.otherSearch.loading = true;
      let params = {
        page: this.otherSearch.pageNum,
        rows: 10,
        singleId: this.projectInfo.id,
        jobType: "其它",
        jobNumber: this.otherSearch.jobNumber.trim(),
        jobName: this.otherSearch.jobName.trim()
      }
      this.publicFun.httpRequest("get", 'wholeprocess/listConsultantJobs', null, (status, data, message) => {
        if (status == 0) {
          //console.log(data);
          this.otherData = data.rows
          this.otherSearch.total = data.total;
          this.otherSearch.loading = false;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    otherPageChange(val) {
      this.otherSearch.pageNum = val;
      this.getOtherList()
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
    uploadChildDataSuccess(response, file, fileList) { //其他文件上传
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: "其它",
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
            this.getOtherList();

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
