<template>
<div class="app-container">
  <header class="p20 bg-color-white shadow radius5">
    <div class="mt-5">
      <el-form :inline="true" ref="overDueSingleData" :model="overDueSingleData" class="demo-form-inline" label-width="120px">
        <el-form-item label="工作类型：" class="mt-10" prop="name">
          <el-select v-model="overDueSingleData.professional" size="small" placeholder="请选择工作类型" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="土建" value="土建"></el-option>
            <el-option label="装饰" value="装饰"></el-option>
            <el-option label="安装" value="安装"></el-option>
            <el-option label="市政" value="市政"></el-option>
            <el-option label="钢筋" value="钢筋"></el-option>
            <el-option label="景观绿化" value="景观绿化"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上报时间：" class="mt-10" prop="consultant">
          <el-date-picker :editable="false" size="mini" type="date" placeholder="选择约定作业完成日期"></el-date-picker>
        </el-form-item>
        <el-form-item label=" 流程状态：" class="mt-10" prop="professional">
          <el-select v-model="overDueSingleData.professional" size="small" placeholder="请选择流程状态" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="项目工作" value="项目工作"></el-option>
            <el-option label="分管副总审核" value="分管副总审核"></el-option>
            <el-option label="完成" value="完成"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="mt-30 mb-15 tc">
      <el-button @click='overDueSingleSearchBtn' type="primary" class="btn-orange shadow"><i class="iconfont icon-shiliangzhinengduixiang f13 mr-5"></i>查 询</el-button>
      <el-button @click='resetForm("overDueSingleData")' type="primary" class="btn-blue shadow mr-50"><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
      <el-button class="btn-green shadow mt-20" type="primary" @click="addProjectWorkDialog=true"><i class="iconfont icon-iconfont707 f12 mr-5"></i>新 增</el-button>

    </div>
  </header>
  <article class="mt-30">
    <el-table :data="overDueSingleDataContent" v-loading="listLoading" fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
      <el-table-column label="工作类型" width="230" prop="name"></el-table-column>
      <el-table-column label="合同编号" width="220" align="left" prop="consultant"></el-table-column>
      <el-table-column label="合同名称" width="150" align="left" prop="firstDraftTimeStr"></el-table-column>
      <el-table-column label="合同金额" width="150" align="left" prop="firstDraftCheckTimeStr"></el-table-column>
      <el-table-column label="承包人" width="150" align="left" prop="processState"></el-table-column>
      <el-table-column label="上报时间" width="120" align="center" prop="delayTimeStr"></el-table-column>
      <el-table-column label="流程状态" align="left" prop="delayReason"></el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
              <el-button v-if="editBtnShow" @click="overDueBtn(scope.row)" class="color-green" type="text" size="small">查看</el-button>
              <el-button v-if="editBtnShow" @click="overDueBtn(scope.row)" class="color-green" type="text" size="small">工作进度</el-button>
          </template>
      </el-table-column>
    </el-table>
  </article>

  <footer class="mt-30 cb pagination" v-if="total">
    <el-pagination @current-change="overDueCurrentChange" :current-page.sync="pageNum" :page-size="10" layout="prev, pager, next, jumper" :total="total" class="fr">
    </el-pagination>
    <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{total}}条记录</span>
  </footer>
  <!-- 新增-项目工作信息 -->
  <el-dialog :visible.sync="addProjectWorkDialog" size="small" custom-class="icms-dialog">
    <span slot="title">修改 - 延期</span>
    <div class="dialog-box">
      <el-form :model="changeOverDueData" ref="changeOverDueData" label-position="right" label-width="110px" :rules="changeOverDueRules">
        <div class="icms-dialog-content  pr mt-15">
          <nav class="pa">
            项目工作基本信息
          </nav>
          <el-row :gutter="16">
            <el-col :span="10">
              <el-form-item label="工作类型：" class="mt-10 w" prop="reason">
                <el-select placeholder="请选择流程状态">
                  <el-option label="实施方案" value="实施方案"></el-option>
                  <el-option label="交底资料" value="交底资料"></el-option>
                  <el-option label="合同" value="合同"></el-option>
                  <el-option label="月报" value="月报"></el-option>
                  <el-option label="动态成本" value="动态成本"></el-option>
                  <el-option label="收发文登记" value="收发文登记"></el-option>
                  <el-option label="点工表" value="点工表"></el-option>
                  <el-option label="其它" value="其它"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="选择时间：" class="mt-10 w" prop="date">
                <el-date-picker :editable="false" v-model="changeOverDueData.date" type="date" placeholder="请选择日期" clearable></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content pr mt-10">
          <nav class="pa">
            合同基本信息
          </nav>
          <el-row :gutter="16">
            <el-col :span="14">
              <el-form-item label="合同名称：" class="mt-10 w creat-new-form" prop="projectName">
                <el-input class="w" v-model="newProjectData.projectName" size="small" placeholder="请输入项目名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="14">
              <el-form-item label="合同编号：" class="mt-10 w creat-new-form" prop="engineeringPurpose">
                <el-input class="w" v-model="newProjectData.projectName" size="small" placeholder="请输入项目编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="发包人：" class="mt-10 w creat-new-form" prop="engineeringStructure">
                <el-input class="w" v-model="newProjectData.projectName" size="small" placeholder="请输入合同编号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="14">
              <el-form-item label="合同金额（元）：" class="mt-10 w creat-new-form" prop="engineeringPurpose">
                <el-input class="w" v-model="newProjectData.projectName" size="small" placeholder="请输入合同金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="承包人：" class="mt-10 w creat-new-form" prop="engineeringStructure">
                <el-input class="w" v-model="newProjectData.projectName" size="small" placeholder="请输入承包人"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="14">
              <el-form-item label="合同类型：" class="mt-10 w creat-new-form" prop="measurementUnit">
                <el-input class="w" v-model="newProjectData.projectName" size="small" placeholder="请输入合同类型"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="开工日期：" class="mt-10 w creat-new-form" prop="consultingType">
                <el-date-picker :editable="false" v-model="newProjectData.informationReceivedDateStr" size="mini" type="date" placeholder="请选择开工日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="14">
              <el-form-item label="合同工期（天）：" class="mt-10 w creat-new-form" prop="workProjectCategory">
                <el-input class="w" v-model="newProjectData.projectName" size="small" placeholder="请输入工程所在地"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="竣工日期：" class="mt-10 w creat-new-form" prop="approveType">
                <el-date-picker :editable="false" v-model="newProjectData.informationReceivedDateStr" size="mini" type="date" placeholder="请选择竣工日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="14">
              <el-form-item label="质量要求：" class="mt-10 w creat-new-form" prop="workProjectCategory">
                <el-input class="w" v-model="newProjectData.projectName" size="small" placeholder="请输入质量要求" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="14">
              <el-form-item label="付款方式：" class="mt-10 w creat-new-form" prop="delegateUnitContact">
                <el-input v-model="newProjectData.delegateUnitContact" class="w" size="small" placeholder="请输入委托单位联系人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="签订日期：" class="mt-10 w creat-new-form" prop="delegateUnitPhone">
                <el-date-picker :editable="false" v-model="newProjectData.informationReceivedDateStr" size="mini" type="date" placeholder="请选择竣工日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="14">
              <el-form-item label="备注：" class="mt-10 w creat-new-form" prop="workProjectCategory">
                <el-input class="w" v-model="newProjectData.projectName" size="small" placeholder="请输入备注" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content pr mt-40">
          <nav class="pa">
            项目工作附件信息
          </nav>
          <el-upload class="upload-file w mt-10" ref="upload" :on-remove="uploadRemove" :on-error="fileError" :on-success="uploadSuccess" drag action="icms/cost/project/upload" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button class="btn-red shadow" type="primary" @click='saveOverDue("changeOverDueData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='resetForm("changeOverDueData")'><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
        </div>
      </el-form>
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
      addProjectWorkDialog: false,
      overDueSingleData: {
        page: 1,
        rows: 10,
        name: null,
        consultant: null,
        professional: null,
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
      newProjectData: {
        // 项目合同信息
        contractNumber: '',
        contractType: '1',
        contractStatus: '签订',
        contractAmount: '',
        contractPaymentMethod: '',
        // 项目基本信息
        projectName: '',
        engineeringPurpose: '',
        engineeringStructure: '',
        measurementUnit: '',
        consultingType: '',
        workProjectCategory: '',
        approveType: '',
        delegateUnitName: '',
        delegateUnitContact: '',
        delegateUnitPhone: '',
        investmentProperties: '',
        projectLocation: '',
        informationReceivedDateStr: '',
        enrollmentDateStr: new Date(),
        agreedJobCompletionDateStr: '',
        projectDetailRequirements: '',
        technicalDirector: '',
        projectAssignPerson: '',
        // 建设单位信息
        unitName: '',
        unitContact: '',
        unitPhone: '',
        // 项目送审信息
        forCheckedShow: false,
        constructionUnitName: '',
        reviewAmount: '',
        contractEstimationPrice: '',
        // 档案资料
        costFiles: []
      },
      pageNum: 1,
      listLoading: false,
      overDueSingleDataContent: [],
      total: 0,
      overDueListData: [],
      overDueListLoading: false,
      singleOverdueId: null
    }
  },
  mounted() {
    this.getoverDueList(this.overDueSingleData);
  },
  methods: {
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
          this.overDueListLoading = false;
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
