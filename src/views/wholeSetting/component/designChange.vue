<template>
<div>
  <!-- 专业工作-设计变更 -->
  <el-dialog :visible.sync="designDialog" size="small" custom-class="icms-dialog">
    <span slot="title">专业工作-设计变更</span>
    <header v-if="!this.$store.state.app.wholeSingleRouter">
      <el-form label-position="right" label-width="45%">
        <el-row :gutter="16">
          <el-col :sm="6">
            <el-form-item label="设计变更编号：" class="w">
              <el-input v-model="designSearch.jobNumber" class="w" size="small" placeholder="请输入编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="6">
            <el-form-item label="设计变更名称：" class="w">
              <el-input v-model="designSearch.jobName" class="w" size="small" placeholder="请输入文件名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="6">
            <el-form-item label="对应合同：" class="w">
              <el-select class="w" v-model="designSearch.xxContract" placeholder="请选择对应合同" clearable>
                <el-option v-for="item in contractList" :key="item.jobName" :label="item.jobName" :value="item.jobName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="6">
            <el-form-item label="流程状态：" class="w">
              <el-select class="w" v-model="designSearch.processState" placeholder="请选择流程状态" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option label="专业工作" value="专业工作"></el-option>
                <el-option label="项目经理初审" value="项目经理初审"></el-option>
                <el-option label="专业主管审核" value="专业主管审核"></el-option>
                <el-option label="分管副总审核" value="分管副总审核"></el-option>
                <el-option label="追加附件" value="追加附件"></el-option>
                <el-option label="项目经理终审" value="项目经理终审"></el-option>
                <el-option label="完成" value="完成"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="tc wait-header-btn f13 mb-20">
          <el-button @click="designSearchBtn" class="btn-orange shadow mt-15" type="primary"><i class="iconfont icon-shiliangzhinengduixiang f14 mr-5"></i>查 询</el-button>
          <el-button v-if="projectInfo.projectManager==loginUser" @click="creatVisaBtn" class="btn-blue shadow mt-15" type="primary"><i class="iconfont icon-iconfont707 f12 mr-5"></i>下发任务</el-button>
          <el-button @click="exportWholeSingle" :loading="exportLoading" class="btn-green shadow mt-15" type="primary"><i class="iconfont icon-excel f12 mr-5"></i>导出Excel</el-button>
        </div>
      </el-form>
    </header>
    <el-table class="noShadow mt-10" :data="visaData" style="width: 100%" :loading="designSearch.loading" highlight-current-row>
      <el-table-column type="index" label="序号" width="40" align="center"></el-table-column>
      <el-table-column prop="professional" width="90" label="所属专业"></el-table-column>
      <el-table-column prop="consultant" width="90" label="专业咨询员"></el-table-column>
      <el-table-column prop="jobType" width="90" label="工作类型"></el-table-column>
      <el-table-column width="90" label="编号">
        <template slot-scope="scope">
          {{scope.row.jobNumber?scope.row.jobNumber:"--"}}
        </template>
      </el-table-column>
      <el-table-column min-width="170" label="设计变更内容">
        <template slot-scope="scope">
          {{scope.row.xxContent?scope.row.xxContent:"--"}}
        </template>
      </el-table-column>
      <el-table-column  min-width="170" label="对应合同">
        <template slot-scope="scope">
          {{scope.row.xxContract?scope.row.xxContract:"--"}}
        </template>
        </el-table-column>
      </el-table-column>
      <el-table-column width="110" label="送审金额（元）">
        <template slot-scope="scope">
          {{scope.row.reviewAmount?scope.row.reviewAmount:"--"}}
        </template>
      </el-table-column>
      <el-table-column width="110" label="审核金额（元）">
        <template slot-scope="scope">
          {{scope.row.validationAmount?scope.row.validationAmount:"--"}}
        </template>
      </el-table-column>
      <el-table-column width="150" label="核（增）减金额（元）">
        <template slot-scope="scope">
          {{scope.row.subtractAmount?scope.row.subtractAmount:"--"}}
        </template>
      </el-table-column>
      <el-table-column width="180" label="下发时间">
        <template slot-scope="scope">
          {{scope.row.createTime?scope.row.createTime:"--"}}
        </template>
      </el-table-column>
      <el-table-column width="120" label="设计变更日期">
        <template slot-scope="scope">
          {{scope.row.xxDateStr?scope.row.xxDateStr:"--"}}
        </template>
      </el-table-column>
      <el-table-column prop="processState" width="110" label="流程状态 "></el-table-column>
      <el-table-column align="left" label="操作" width="200">
        <template slot-scope="scope">
              <el-button @click="viewVisaSingle(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="viewProgress(scope.row)" type="text" size="small">工作进度</el-button>
              <el-button v-if="scope.row.processState=='项目经理初审'&&projectInfo.consultant==loginUser" @click="editVisaSingle(scope.row,'修改')" type="text" size="small">修改</el-button>
              <el-button v-if="scope.row.processState=='专业工作'&&projectInfo.consultant==loginUser" @click="editVisaSingle(scope.row)" type="text" size="small">上报任务</el-button>
              <el-button v-if="scope.row.processState=='项目经理初审'&&projectInfo.projectManager==loginUser" @click="reviewAgain(scope.row)" type="text" size="small">项目经理初审</el-button>
              <el-button v-if="scope.row.processState=='专业主管审核'&&(loginInfo.userRoleNames.indexOf('主管')!=-1||loginInfo.userRoleNames.indexOf('全过程部门经理')!=-1)" @click="reviewEndAgain(scope.row,'专业主管审核')" type="text" size="small">专业主管审核</el-button>
              <el-button v-if="scope.row.processState=='分管副总审核'&&loginInfo.userRoleNames.indexOf('分管副总')!=-1&&projectInfo.vicePresident==loginUser" @click="reviewEndAgain(scope.row,'分管副总审核')" type="text" size="small">分管副总审核</el-button>
              <el-button v-if="scope.row.processState=='追加附件'&&projectInfo.consultant==loginUser" @click="editVisaSingle(scope.row)" type="text" size="small">追加附件</el-button>
              <el-button v-if="scope.row.processState=='项目经理终审'&&projectInfo.projectManager==loginUser" @click="reviewEndAgain(scope.row,'项目经理终审')" type="text" size="small">项目经理终审</el-button>
              <!-- <el-button @click="delContractSingle(scope.row)" type="text" size="small">删除</el-button> -->
          </template>
      </el-table-column>
    </el-table>
    <footer class="mt-50 cb pagination" v-if="designSearch.total&&!this.$route.query.projectId">
      <el-pagination @current-change="visaPageChange" :current-page.sync="designSearch.pageNum" layout="prev, pager, next, jumper" :total="designSearch.total" class="fr">
      </el-pagination>
      <span class="fr f13 color-8 pagination-text mt-8">每页10条，共{{designSearch.total}}条记录</span>
    </footer>
  </el-dialog>
  <!-- 新增 - 设计变更基本信息  -->
  <el-dialog :visible.sync="creatDesignDialog" size="small" custom-class="icms-dialog">
    <span slot="title">{{creatDesignData.title}}</span>
    <div class="dialog-box">
      <el-form :model="creatDesignData" ref="creatDesignData" :inline="true" label-width="35%" :rules="creatDesignDataRules">
        <div class="icms-dialog-content pr p15 mt-10" v-if="creatDesignData.editSave">
          <nav class="pa">
            专业工作要求
          </nav>

          <el-row :gutter="16" class="mt-15">
            <el-col :sm="6" :xs="12">
              <div class="grid-content tr">所属专业：</div>
            </el-col>
            <el-col :sm="8" :xs="12">
              <div class="grid-content">{{projectInfo.professional?projectInfo.professional:"--"}}</div>
            </el-col>
            <el-col :sm="10">
              <el-col :sm="12" :xs="12">
                <div class="grid-content tr">专业咨询员：</div>
              </el-col>
              <el-col :sm="12" :xs="12">
                <div class="grid-content">{{projectInfo.consultant?projectInfo.consultant:"--"}}</div>
              </el-col>

            </el-col>
          </el-row>
          <el-row :gutter="16" class="mt-15">
            <el-col :sm="6" :xs="12">
              <div class="grid-content tr">工作类型：</div>
            </el-col>
            <el-col :sm="8" :xs="12">
              <div class="grid-content">设计变更</div>
            </el-col>
          </el-row>

          <el-row :gutter="16" class="mt-15">
            <el-col :sm="6" :xs="12">
              <div class="grid-content tr">工作要求：</div>
            </el-col>
            <el-col :sm="8" :xs="12">
              <div class="grid-content">{{designSingleData.jobRequirement?designSingleData.jobRequirement:"--"}}</div>
            </el-col>
          </el-row>

          <el-row :gutter="16" class="mt-15">
            <el-col :sm="6" :xs="12">
              <div class="grid-content tr">工作上报截止日期：</div>
            </el-col>
            <el-col :sm="8" :xs="12">
              <div class="grid-content">{{designSingleData.jobCommitDeadlineDateStr?designSingleData.jobCommitDeadlineDateStr:"--"}}</div>
            </el-col>
            <el-col :sm="10">
              <el-col :sm="12" :xs="12">
                <div class="grid-content tr">下发时间：</div>
              </el-col>
              <el-col :sm="12" :xs="12">
                <div class="grid-content">{{designSingleData.createTimeStr?designSingleData.createTimeStr:"--"}}</div>
              </el-col>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content pr" :class="{'mt-40': creatDesignData.editSave}" v-if="creatDesignData.editSave">
          <nav class="pa">
            专业工作要求
          </nav>

          <el-row :gutter="16">
            <el-col :sm="14" :xs="12">
              <el-form-item label="设计变更编号：" class="mt-10 w creat-new-form" prop="jobNumber">
                <el-input class="w" v-model="creatDesignData.jobNumber" size="small" placeholder="请填写设计变更编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10" :xs="12">
              <el-form-item label="设计变更名称：" class="mt-10 w creat-new-form" prop="jobName">
                <el-input class="w" v-model="creatDesignData.jobName" size="small" placeholder="请填写设计变更名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <el-col :sm="14" :xs="12">
              <el-form-item label="设计变更内容：" class="mt-10 w creat-new-form" prop="xxContent">
                <el-input type="textarea" class="w" v-model="creatDesignData.xxContent" size="small" placeholder="请填写设计变更内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14" :xs="12">
              <el-form-item label="对应合同：" class="mt-10 w creat-new-form" prop="xxContract">
                <el-select v-model="creatDesignData.xxContract" placeholder="请选择对应合同" clearable>
                  <el-option v-for="item in contractList" :key="item.jobName" :label="item.jobName" :value="item.jobName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="审核金额（元）：" class="mt-10 w creat-new-form" prop="validationAmount">
                <el-input type="number" class="w" v-model="creatDesignData.validationAmount" size="small" placeholder="请填写审核金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="送审金额（元）：" class="mt-10 w creat-new-form" prop="reviewAmount">
                <el-input type="number" class="w" v-model="creatDesignData.reviewAmount" size="small" placeholder="请填写送审金额"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="核（增）减金额（元）：" class="mt-10 w creat-new-form" prop="subtractAmount">
                <el-input type="number" class="w" v-model="creatDesignData.subtractAmount" size="small" placeholder="请填写核（增）减金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="设计变更时间：" class="mt-10 w creat-new-form" prop="xxDateStr">
                <el-date-picker :editable="false" v-model="creatDesignData.xxDateStr" class="w" size="small" type="date" placeholder="请选择发起时间"></el-date-picker>
              </el-form-item>

            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="备注：" class="mt-10 w creat-new-form" prop="remark">
                <el-input type="textarea" class="w" v-model="creatDesignData.remark" size="small" placeholder="请填写备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content pr" :class="{'mt-40': creatDesignData.editSave}" v-if="creatDesignData.newSave">
          <nav class="pa">
            专业工作要求
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="单项工程名称：" class="mt-10 w creat-new-form">
                {{projectInfo.projectName}}
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="所属专业：" class="mt-10 w creat-new-form">
                {{projectInfo.professional}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="专业咨询员：" class="mt-10 w creat-new-form">
                {{projectInfo.consultant}}
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="工作类型：" class="mt-10 w creat-new-form">
                设计变更
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="设计变更名称：" class="mt-10 w creat-new-form" prop="jobName">
                <el-input class="w" v-model="creatDesignData.jobName" size="small" placeholder="请填写设计变更名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="工作要求：" class="mt-10 w creat-new-form" prop="jobRequirement">
                <el-input type="textarea" class="w" v-model="creatDesignData.jobRequirement" size="small" placeholder="请填写工作要求"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="工作上报截止日期：" class="mt-10 w creat-new-form" prop="jobCommitDeadlineDateStr">
                <el-date-picker :editable="false" v-model="creatDesignData.jobCommitDeadlineDateStr" class="w" size="small" type="date" placeholder="请选择工作上报截止日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content  pr mt-40" v-if="creatDesignData.fileList">
          <nav class="pa">
            专业材料附件
          </nav>
          <el-table class="noShadow" :data="creatDesignData.enclosureFiles" style="width: 100%">
            <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
            <el-table-column prop="fileName" label="文件名称"></el-table-column>
            <el-table-column prop="createTimeStr" width="170" label="上传时间"></el-table-column>
            <el-table-column prop="createUser" width="100" label="上传人"></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                  <el-button v-if="creatDesignData.delShow" @click="delWholeAnalysisFile(scope.row,scope.$index)" class="color-green" type="text" size="small">删除</el-button>
                  </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            上传附件 - 专业材料附件
          </nav>
          <el-upload class="upload-file w mt-10" ref="upload" :on-remove="uploadWholeContractRemove" :on-error="fileError" :on-success="uploadChildDataSuccess" drag action="icms/wholeprocess/upload/uploadWholeprocessFile" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoadingSubmit" v-if="creatDesignData.editSave&&creatDesignData.editShowBtn" class="btn-green shadow" type="primary" @click='submitSaveVisaData("creatDesignData")'><i class="iconfont icon-save f14 mr-5"></i>提 交</el-button>
          <el-button :loading="buttonLoading" v-if="creatDesignData.editSave" class="btn-orange shadow" type="primary" @click='editSaveVisaData("creatDesignData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button :loading="buttonLoading" v-if="creatDesignData.newSave" class="btn-orange shadow" type="primary" @click='saveVisaData("creatDesignData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='creatDesignDialog=false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 查看设计变更 -->
  <el-dialog :visible.sync="visaSingleDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 设计变更基本信息</span>
    <div class="dialog-box">
      <div class="icms-dialog-content pr p15">
        <nav class="pa">
          专业工作要求
        </nav>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">所属专业：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{projectInfo.professional?projectInfo.professional:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">专业咨询员：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{projectInfo.consultant?projectInfo.consultant:"--"}}</div>
            </el-col>

          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">工作类型：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">设计变更</div>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">工作要求：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{designSingleData.jobRequirement?designSingleData.jobRequirement:"--"}}</div>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">工作上报截止日期：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{designSingleData.jobCommitDeadlineDateStr?designSingleData.jobCommitDeadlineDateStr:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">下发时间：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{designSingleData.createTimeStr?designSingleData.createTimeStr:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content pr p15 mt-40">
        <nav class="pa">
          设计变更基本信息
        </nav>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">设计变更编号：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{designSingleData.jobNumber?designSingleData.jobNumber:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">设计变更名称：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{designSingleData.jobName?designSingleData.jobName:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">设计变更内容：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{designSingleData.xxContent?designSingleData.xxContent:"--"}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">对应合同：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{designSingleData.xxContract?designSingleData.xxContract:"--"}}</div>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">审核金额（元）：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{designSingleData.validationAmount?designSingleData.validationAmount:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">送审金额（元）：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{designSingleData.reviewAmount?designSingleData.reviewAmount:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">核（增）减金额（元）：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{designSingleData.subtractAmount?designSingleData.subtractAmount:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">设计变更时间：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{designSingleData.xxDateStr?designSingleData.xxDateStr:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">备注：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{designSingleData.remark?designSingleData.remark:"--"}}</div>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content pr mt-40">
        <nav class="pa">
          设计变更附件信息
        </nav>
        <el-table class="noShadow" :data="designSingleData.files" style="width: 100%" :loading="designSingleData.loading" highlight-current-row>
          <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
          <el-table-column min-width="170" prop="fileName" label="文件名称"></el-table-column>
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
  <!-- 工程进度 -->
  <el-dialog :visible.sync="visaProgressDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 进度信息</span>
    <div class="dialog-box">
      <div class="icms-dialog-content pr p15">
        <nav class="pa">
          设计变更基本信息
        </nav>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">项目编号：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{projectInfo.projectNumber?projectInfo.projectNumber:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">项目名称：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{projectInfo.projectName?projectInfo.projectName:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">分管副总：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{projectInfo.vicePresident?projectInfo.vicePresident:"--"}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">项目经理：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{projectInfo.projectManager?projectInfo.projectManager:"--"}}</div>
          </el-col>
        </el-row>


      </div>
      <div class="icms-dialog-content pr p15 mt-40">
        <nav class="pa">
          专业工作要求
        </nav>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">所属专业：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{projectInfo.professional?projectInfo.professional:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">专业咨询员：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{projectInfo.consultant?projectInfo.consultant:"--"}}</div>
            </el-col>

          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">工作类型：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">设计变更</div>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">单项工程名称：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{projectInfo.name?projectInfo.name:"--"}}</div>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">专业主管：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{designSingleData.professionalDirector?designSingleData.professionalDirector:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">上报时间：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{designSingleData.createTimeStr?designSingleData.createTimeStr:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content pr p15 mt-40">
        <nav class="pa">
          专业工作流程进度信息
        </nav>
        <el-row :gutter="16">
          <el-col :sm="24">
            <el-steps class="oa" :space="90" :active="designSingleData.processStateNum" finish-status="success" :align-center="true" :center="true">
              <el-step v-for="item in stepData" key="null" :title="item"></el-step>
            </el-steps>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content pr mt-40">
        <nav class="pa">
          专业工作流程处理信息
        </nav>
        <el-table class="noShadow" :data="historyInfo" style="width: 100%" :loading="designSingleData.loading" highlight-current-row>
          <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
          <el-table-column min-width="170" prop="processState" label="处理步骤"></el-table-column>
          <el-table-column prop="processor" width="100" label="处理人"></el-table-column>
          <el-table-column prop="processTimeStr" width="170" label="处理时间"></el-table-column>
          <el-table-column prop="processResult" width="90" label="处理结果"></el-table-column>
          <el-table-column label="处理意见" width="120">
            <template slot-scope="scope">
                {{scope.row.processOpinion?scope.row.processOpinion:"--"}}
                </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
  <el-dialog title="您确定要提交到下一步流程吗？" :visible.sync="confirmNextDialog" :show-close="false" custom-class="comfirm-dialog" size="tiny">
    <span><el-checkbox v-model="checkNextSms">短信提醒</el-checkbox></span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="confirmNextDialog = false">取 消</el-button>
    <el-button :loading="buttonLoadingConfirm" type="primary" @click="confirmNextBtn">确 定</el-button>
  </span>
  </el-dialog>
  <!-- 项目经理初审 -->
  <el-dialog :visible.sync="reviewAgainDialog" size="tiny" custom-class="icms-dialog">
    <span slot="title">项目经理初审 - 专业工作</span>
    <div class="dialog-box">
      <el-form label-width="120px">
        <el-row :gutter="16">
          <el-col :sm="16">
            <el-form-item label="审核操作：" class="w" prop="name">
              <el-radio-group v-model="reviewAgainData.issueEdit">
                <el-radio label="通过">通过</el-radio>
                <el-radio label="驳回">驳回</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :sm="24">
            <el-form-item label="审核意见：" class="mt-10 w" prop="name">
              <el-input type="textarea" v-model="reviewAgainData.issueOpinion" class="w90 fl" size="small" placeholder="请输入复核意见"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :sm="24">
            <el-form-item label="是否提交专业主管审核：" class="mt-10 w" prop="name">
              <el-radio-group @change="changeForNext" v-model="reviewAgainData.forNext">
                <el-radio label="否">否</el-radio>
                <el-radio label="是">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="16" v-if="projectDirectorShow">
          <el-col :sm="24">
            <el-form-item label="专业主管：" class="mt-10 w" prop="professionalDirector">
              <el-select class="w90" v-model="reviewAgainData.professionalDirector" placeholder="请选择对应合同" clearable>
                <el-option v-for="item in projectDirector" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoading" class="btn-blue shadow" type="primary" @click='submitReviewBtn'><i class="iconfont icon-tijiao2 f14 mr-5"></i>确 定</el-button>
          <el-button class="btn-white shadow" @click='reviewAgainDialog = false'><i class="iconfont icon-quxiao1 f14 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>

  <!-- 普通审核 -->
  <el-dialog :visible.sync="reviewEndDialog" size="tiny" custom-class="icms-dialog">
    <span slot="title">{{reviewEndData.title}}</span>
    <div class="dialog-box">
      <el-form label-width="120px">
        <el-row :gutter="16">
          <el-col :sm="16">
            <el-form-item label="审核操作：" class="w" prop="name">
              <el-radio-group v-model="reviewEndData.issueEdit">
                <el-radio label="通过">通过</el-radio>
                <el-radio label="驳回">驳回</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :sm="24">
            <el-form-item label="审核意见：" class="mt-10 w" prop="name">
              <el-input type="textarea" v-model="reviewEndData.issueOpinion" class="w90 fl" size="small" placeholder="请输入复核意见"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoading" class="btn-blue shadow" type="primary" @click='submitEndReviewBtn'><i class="iconfont icon-tijiao2 f14 mr-5"></i>确 定</el-button>
          <el-button class="btn-white shadow" @click='reviewEndDialog = false'><i class="iconfont icon-quxiao1 f14 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
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
      buttonLoadingSubmit:false,
      buttonLoadingConfirm:false,
      loginUser: this.$store.state.app.userInfo.userName,
      loginInfo: this.$store.state.app.userInfo,
      historyInfo:[],
      confirmNextDialog: false,
      checkNextSms: '否',
      reviewAgainDialog: false,
      visaProgressDialog: false,
      projectDirectorShow: false,
      reviewEndDialog: false,
      projectDirector: [],
      stepData: [],
      reviewEndData: {
        title: "专业主管审核 - 专业工作",
        issueEdit: "通过",
        issueOpinion: ""
      },
      reviewAgainData: {
        issueEdit: "通过",
        issueOpinion: null,
        forNext: "否",
        professionalDirector: null
      },
      contractList: [],
      contractData: {
        uploadFiles: []
      },

      // 设计变更数据模块
      designSingleData: {
        loading: false,

        jobRequirement: '',
        jobCommitDeadlineDateStr: '',
        createTimeStr: '',
        jobNumber: '',
        jobName: '',
        xxContent: '',
        xxContract: '',
        validationAmount: '',
        reviewAmount: '',
        subtractAmount: '',
        xxDateStr: '',
        remark: '',

        files: []
      },
      designDialog: false,
      designSearch: {
        jobNumber: '',
        jobName: '',
        contract: '',
        processState: '',
        xxContract: '',
        pageNum: 1,
        total: 0,
        loading: false
      },
      visaData: [],
      creatDesignDialog: false,
      visaSingleDialog: false,
      creatDesignData: {
        title: '新增 - 专业工作子任务',
        delShow: true,
        newSave: true,
        editSave: false,
        fileList: false,

        //编辑
        jobNumber: '',
        xxContent: '',
        xxContract: '',
        validationAmount: '',
        reviewAmount: '',
        subtractAmount: '',
        xxDateStr: '',
        remark: '',

        //下发任务
        jobName: '',
        jobRequirement: '',
        jobCommitDeadlineDateStr: '',

        enclosureFiles: [],
        uploadFiles: []
      },
      exportLoading:false,
      creatDesignDataRules: {
        jobNumber: [{
          required: true,
          message: '请填写设计变更编号'
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
          message: '请选择设计变更时间'
        }],
        jobName: [{
          required: true,
          message: '请填写设计变更名称'
        }],
        jobRequirement: [{
          required: true,
          message: '请填写工作要求'
        }],
        jobCommitDeadlineDateStr: [{
          required: true,
          message: '请选择工作上报截止日期'
        }]

      },
      // 设计变更数据模块
    }
  },
  watch:{
    creatDesignData:{
      handler:function(val){
        this.creatDesignData.subtractAmount = (val.reviewAmount - val.validationAmount)?(val.reviewAmount - val.validationAmount).toFixed(2):0;
      },
      deep: true
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
          jobType: "设计变更",
          id:this.projectInfo.waitId?this.projectInfo.waitId:null,
          jobNumber: this.designSearch.jobNumber.trim(),
          xxContract: this.designSearch.xxContract,
          jobName: this.designSearch.jobName.trim(),
          processState: this.designSearch.processState
        }
        this.$message({
          message: '正在为您生成Excel文件，请稍后……',
          duration : 0
        });
        this.exportLoading = true;
        this.publicFun.httpRequest("get", `wholeprocess/exportConsultantJobs`, null, (status, data, message) => {
          if (status == 0) {
            let excelData = [
              ["序号", "所属专业", "专业咨询员", "工作类型", "变更编号", "变更名称", "变更内容", "对应合同", "送审金额（元）", "审核金额（元）", "核（增）减金额（元）", "下发时间", "变更日期","当前状态","备注"],
            ];
            for (let item in data) {
              let excelSaveArray = [item!="removeByValue" ? parseInt(item) + 1 : "", data[item].professional, data[item].consultant, data[item].jobType, data[item].jobNumber, data[item].jobName, data[item].xxContent, data[item].xxContract,data[item].reviewAmount, data[item].validationAmount, data[item].subtractAmount,data[item].createTimeStr,data[item].xxDateStr,data[item].processState, data[item].remark]
              excelData.push(excelSaveArray)
            };
            buildExcel(excelData, `《${this.projectInfo.projectName}》设计变更列表`);
            this.exportLoading = false;
            this.$message.closeAll();
          } else {
            that.$message.error(message);
            this.exportLoading = false;
          }
        }, exportData);
      }).catch(() => {});
    },
    viewProgress(row) {
      this.visaProgressDialog = true;
      //console.log(this.projectInfo)
      this.designSingleData = row;
      //console.log('项目信息', row);
      if (row.isDirectorAudit == "否") {
        this.stepData = ["专业工作", "项目经理初审", "追加附件", "项目经理终审", "完成"]
        switch (row.processState) {
          case "专业工作":
            this.designSingleData.processStateNum = 0;
            break;
          case "项目经理初审":
            this.designSingleData.processStateNum = 1;
            break;
          case "追加附件":
            this.designSingleData.processStateNum = 2;
            break;
          case "项目经理终审":
            this.designSingleData.processStateNum = 3;
            break;
          case "完成":
            this.designSingleData.processStateNum = 5;
            break;
        }

      } else {
        this.stepData = ["专业工作", "项目经理初审", "专业主管审核", "分管副总审核", "追加附件", "项目经理终审", "完成"]
        switch (row.processState) {
          case "专业工作":
            this.designSingleData.processStateNum = 0;
            break;
          case "项目经理初审":
            this.designSingleData.processStateNum = 1;
            break;
          case "专业主管审核":
            this.designSingleData.processStateNum = 2;
            break;
          case "分管副总审核":
            this.designSingleData.processStateNum = 3;
            break;
          case "追加附件":
            this.designSingleData.processStateNum = 4;
            break;
          case "项目经理终审":
            this.designSingleData.processStateNum = 5;
            break;
          case "完成":
            this.designSingleData.processStateNum = 7;
            break;
        }

      }
      this.publicFun.httpRequest("get", `history/get?type=biz_wholeprocess_consultant&bizId=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.historyInfo = data;
        } else {
          this.$message.error(message);
        }
      });

    },
    changeForNext() {
      if (this.reviewAgainData.forNext == "是") {
        this.projectDirectorShow = true;
        this.publicFun.httpRequest("get", `role/getUsersByRoleName?roleName=全过程部门经理`, null, (status, data, message) => {
          if (status == 0) {
            data.forEach((item) => {
              this.projectDirector.push(item.userName);
            });
            this.reviewAgainData.professionalDirector = data.length > 0 ? data[0].userName : "";
            this.publicFun.httpRequest("get", `role/getUsersByRoleName?roleName=${this.projectInfo.professional}主管`, null, (status, data, message) => {
              if (status == 0) {
                data.forEach((item) => {
                  this.projectDirector.push(item.userName);
                  this.projectDirector = this.publicFun.unique(this.projectDirector);
                });
              } else {
                this.$message.error(message);
              }
            });

          } else {
            this.$message.error(message);
          }
        });
      } else {
        this.projectDirectorShow = false;
      }
    },
    submitReviewBtn() {
      let submitData = {
        id: this.reviewAgainData.id,
        version: this.reviewAgainData.editVersion + 1,
        approveResult: this.reviewAgainData.issueEdit,
        approveOpinion: this.reviewAgainData.issueOpinion,
        isDirectorAudit: this.reviewAgainData.forNext,
        professionalDirector: this.reviewAgainData.professionalDirector
      }
      // //console.log("submitData",submitData)
      this.buttonLoading = true;
      this.publicFun.httpRequest("post", `wholeprocess/submitConsultantFlow`, submitData, (status, data, message) => {
        if (status == 0) {
          this.buttonLoading = false;
          this.$message.success(message);
          this.reviewAgainDialog = false;
          this.getVisaList();
          this.confirmNextDialog = false;
        } else {
          this.$message.error(message);
        }
      });
    },
    reviewAgain(row) {
      this.reviewAgainDialog = true;
      this.reviewAgainData.id = row.id;
      this.reviewAgainData.reviewer = row.reviewer;
      this.reviewAgainData.costConsultationId = row.costConsultationId;
      this.reviewAgainData.beforeProcessState = row.processState;
      this.reviewAgainData.isQdBdTogether = row.isQdBdTogether;
      this.reviewAgainData.consultant = row.consultant;
      this.reviewAgainData.workProjectCategory = row.workProjectCategory;
      this.reviewAgainData.editVersion = row.version;
    },
    reviewEndAgain(row, title) {
      this.reviewEndData.title = title;
      this.reviewEndDialog = true;
      this.reviewEndData.id = row.id;
      this.reviewEndData.reviewer = row.reviewer;
      this.reviewEndData.costConsultationId = row.costConsultationId;
      this.reviewEndData.beforeProcessState = row.processState;
      this.reviewEndData.isQdBdTogether = row.isQdBdTogether;
      this.reviewEndData.consultant = row.consultant;
      this.reviewEndData.workProjectCategory = row.workProjectCategory;
      this.reviewEndData.editVersion = row.version;
    },
    submitEndReviewBtn() {
      let submitData = {
        id: this.reviewEndData.id,
        version: this.reviewEndData.editVersion + 1,
        approveResult: this.reviewEndData.issueEdit,
        approveOpinion: this.reviewEndData.issueOpinion
      }
      // //console.log("submitData",submitData)
      this.buttonLoading = true;
      this.publicFun.httpRequest("post", `wholeprocess/submitConsultantFlow`, submitData, (status, data, message) => {
        if (status == 0) {
          if(this.$store.state.app.wholeSingleRouter){
            this.$message.success(message);
            setTimeout(()=>{
              this.buttonLoading = false;
              if(this.$store.state.app.fromPathPage=="wait"){
                this.$router.push({
                  path: '/waitList',
                  query: {
                    fromPath: "wholeProject"
                  }
                });
              }else{
                this.$router.push({
                  path: '/home'
                });
              }
            },500)
          }else{
            this.$message.success(message);
            this.reviewEndDialog = false;
            this.buttonLoading = false;
            this.getVisaList();
          }

        } else {
          this.$message.error(message);
        }
      });
    },
    viewVisaSingle(row) { //查看设计变更信息
      this.visaSingleDialog = true;
      //console.log("设计变更信息", row);

      this.designSingleData.loading = true;
      this.publicFun.httpRequest("get", `wholeprocess/getJobFilesByJobId?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.designSingleData = row;
          this.designSingleData.loading = false;
          this.designSingleData.files = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    editVisaSingle(row,title) { //编辑技术核定信息
      this.creatDesignData.editShowBtn = title?false:true;
      this.designSingleData = row;
      this.creatDesignDialog = true;
      this.creatDesignData.title = "修改 - 设计变更信息";
      this.creatDesignData.delShow = false;
      this.creatDesignData.editSave = true;
      this.creatDesignData.newSave = false;
      this.creatDesignData.fileList = true;

      this.creatDesignData.jobName = row.jobName;
      this.creatDesignData.xxContent = row.xxContent;
      this.creatDesignData.jobNumber = row.jobNumber;
      this.creatDesignData.xxContract = row.xxContract;
      this.creatDesignData.validationAmount = row.validationAmount;
      this.creatDesignData.reviewAmount = row.reviewAmount;
      this.creatDesignData.subtractAmount = row.subtractAmount;
      this.creatDesignData.xxDateStr = row.xxDateStr;
      this.creatDesignData.remark = row.remark;
      this.creatDesignData.editId = row.id;
      this.creatDesignData.editVersion = row.version;

      if (this.contractData.uploadFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.contractData.uploadFiles = [];

      this.publicFun.httpRequest("get", `wholeprocess/getJobFilesByJobId?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.creatDesignData.enclosureFiles = data;
        } else {
          this.$message.error(message);
        }
      });

    },
    confirmNextBtn() {
      let submitData = {
        id: this.creatDesignData.editId,
        version: this.creatDesignData.editVersion + 1,
        isSendMsg: this.checkNextSms,
        approveResult: "通过"
      }
      // //console.log("submitData",submitData)
      this.buttonLoadingSubmit = true;
      this.publicFun.httpRequest("post", `wholeprocess/submitConsultantFlow`, submitData, (status, data, message) => {
        if (status == 0) {
          this.buttonLoadingSubmit = false;
          this.$message.success(message);
          this.creatDesignDialog = false;
          this.getVisaList();
          this.confirmNextDialog = false;
        } else {
          this.$message.error(message);
        }
      });
    },
    submitSaveVisaData(formName) { //提交信息
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
            "files_BG": this.contractData.uploadFiles.length > 0 ? JSON.stringify(this.contractData.uploadFiles) : null,
            "files_GCLXD": null,
            "files_GS": null,
            "files_HDD": null,
            "files_JDK": null,
            "files_QT": null,
            "files_QZ": null,
            "files_XJD": null,
            "files_ZJLXD": null,
            "htFiles": null,
            "id": this.creatDesignData.editId,
            "isDirectorAudit": null,
            "isDynamicCost": null,
            "isSendMsg": null,
            "jobCommitDeadlineDateStr": null,
            "jobName": this.creatDesignData.jobName,
            "jobNumber": this.creatDesignData.jobNumber,
            "jobRequirement": null,
            "jobType": "设计变更",
            "monthyApplyAmount": null,
            "monthyReplyAmount": null,
            "payType": null,
            "processState": null,
            "professional": null,
            "professionalDirector": null,
            "qualityRequirement": null,
            "receiveUnit": null,
            "remark": this.creatDesignData.remark,
            "reviewAmount": this.creatDesignData.reviewAmount,
            "sendPackagePerson": null,
            "sendTaskFiles": null,
            "sendUnit": null,
            "singleId": this.projectInfo.id,
            "startDateStr": null,
            "subtractAmount": this.creatDesignData.subtractAmount,
            "validationAmount": this.creatDesignData.validationAmount,
            "xxAmount": null,
            "xxContent": this.creatDesignData.xxContent,
            "xxContract": this.creatDesignData.xxContract,
            "xxDateStr": formatDateShort(this.creatDesignData.xxDateStr),
            "version": this.creatDesignData.editVersion
          }
          this.buttonLoadingSubmit = true;
          this.publicFun.httpRequest("put", `wholeprocess/updateConsultantJob`, contractData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoadingSubmit = false;
              this.confirmNextDialog = true;
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
    editSaveVisaData(formName) { //修改技术核定信息
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
            "files_BG": this.contractData.uploadFiles.length > 0 ? JSON.stringify(this.contractData.uploadFiles) : null,
            "files_GCLXD": null,
            "files_GS": null,
            "files_HDD": null,
            "files_JDK": null,
            "files_QT": null,
            "files_QZ": null,
            "files_XJD": null,
            "files_ZJLXD": null,
            "htFiles": null,
            "id": this.creatDesignData.editId,
            "isDirectorAudit": null,
            "isDynamicCost": null,
            "isSendMsg": null,
            "jobCommitDeadlineDateStr": null,
            "jobName": this.creatDesignData.jobName,
            "jobNumber": this.creatDesignData.jobNumber,
            "jobRequirement": null,
            "jobType": "设计变更",
            "monthyApplyAmount": null,
            "monthyReplyAmount": null,
            "payType": null,
            "processState": null,
            "professional": null,
            "professionalDirector": null,
            "qualityRequirement": null,
            "receiveUnit": null,
            "remark": this.creatDesignData.remark,
            "reviewAmount": this.creatDesignData.reviewAmount,
            "sendPackagePerson": null,
            "sendTaskFiles": null,
            "sendUnit": null,
            "singleId": this.projectInfo.id,
            "startDateStr": null,
            "subtractAmount": this.creatDesignData.subtractAmount,
            "validationAmount": this.creatDesignData.validationAmount,
            "xxAmount": null,
            "xxContent": this.creatDesignData.xxContent,
            "xxContract": this.creatDesignData.xxContract,
            "xxDateStr": formatDateShort(this.creatDesignData.xxDateStr),
            "version": this.creatDesignData.editVersion+1
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("put", `wholeprocess/updateConsultantJob`, contractData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.creatDesignDialog = false;
              this.getVisaList();
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
    saveVisaData(formName) { //保存技术核定信息
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
            "files_ZJLXD": null,
            "htFiles": null,
            "id": -1,
            "isDirectorAudit": null,
            "isDynamicCost": null,
            "isSendMsg": null,
            "jobCommitDeadlineDateStr": formatDateShort(this.creatDesignData.jobCommitDeadlineDateStr),
            "jobName": this.creatDesignData.jobName,
            "jobNumber": this.creatDesignData.jobNumber,
            "jobRequirement": this.creatDesignData.jobRequirement,
            "jobType": "设计变更",
            "monthyApplyAmount": null,
            "monthyReplyAmount": null,
            "payType": null,
            "processState": null,
            "professional": null,
            "professionalDirector": null,
            "qualityRequirement": null,
            "receiveUnit": null,
            "remark": null,
            "reviewAmount": null,
            "sendPackagePerson": null,
            "sendTaskFiles": this.contractData.uploadFiles.length > 0 ? JSON.stringify(this.contractData.uploadFiles) : null,
            "sendUnit": null,
            "singleId": this.projectInfo.id,
            "startDateStr": null,
            "subtractAmount": null,
            "validationAmount": null,
            "xxAmount": null,
            "xxContent": null,
            "xxContract": null,
            "xxDateStr": null
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("post", `wholeprocess/addConsultantJob`, contractData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.creatDesignDialog = false;
              this.getVisaList();
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
    creatVisaBtn() { //新建技术核定单
      this.creatDesignDialog = true;

      this.creatDesignData = {
        title: '新增 - 专业工作子任务',
        jobName: '',
        jobRequirement: '',
        jobCommitDeadlineDateStr: '',
        enclosureFiles: [],
        uploadFiles: []
      }
      this.creatDesignData.delShow = true;
      this.creatDesignData.editSave = false;
      this.creatDesignData.newSave = true;
      this.creatDesignData.fileList = false;
      if (this.contractData.uploadFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.contractData.uploadFiles = [];

    },
    visaContentChildBtn() { //设计变更子任务按钮
      this.designSearch.jobNumber = '';
      this.designSearch.jobName = '';
      this.designDialog = true;
      this.getContractListArray(this.projectInfo.id);
      this.getVisaList();
    },
    designSearchBtn() { //设计变更子任务查询
      this.getVisaList();
    },
    getVisaList() { //设计变更列表获取
      this.designSearch.loading = true;
      let params = {
        page: this.designSearch.pageNum,
        rows: 10,
        singleId: this.projectInfo.id,
        jobType: "设计变更",
        id:this.projectInfo.waitId?this.projectInfo.waitId:null,
        jobNumber: this.designSearch.jobNumber.trim(),
        xxContract: this.designSearch.xxContract,
        jobName: this.designSearch.jobName.trim(),
        processState: this.designSearch.processState
      }
      this.publicFun.httpRequest("get", 'wholeprocess/listConsultantJobs', null, (status, data, message) => {
        if (status == 0) {
          //console.log(data);
          this.visaData = data.rows
          this.designSearch.total = data.total;
          this.designSearch.loading = false;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    visaPageChange(val) {
      this.designSearch.pageNum = val;
      this.getVisaList()
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
    uploadChildDataSuccess(response, file, fileList) { //设计变更文件上传
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: "设计变更",
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
            this.getVisaList();

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
