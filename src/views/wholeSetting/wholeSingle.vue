<template>
<div id="project-setting" class="app-container">
  <header class="p25 bg-color-white pr shadow radius5 header-search" v-if="!this.$route.query.projectId">
    <el-form :inline="true" ref="projectSearch" :model="projectSearch" class="demo-form-inline" label-width="120px">
      <el-form-item label="项目名称:" prop="projectName">
        <el-input size="small" v-model="projectSearch.projectName" placeholder="请填写项目名称"></el-input>
      </el-form-item>
      <el-form-item label="专业咨询员:" prop="consultant">
        <el-input size="small" v-model="projectSearch.consultant" placeholder="请填写专业咨询员"></el-input>
      </el-form-item>
      <el-form-item label="单项工程名称:" prop="name">
        <el-input size="small" v-model="projectSearch.name" placeholder="请填写单项工程名称"></el-input>
      </el-form-item>
      <el-form-item label="所属专业:" prop="professional">
        <el-select placeholder="请选择所属专业" v-model="projectSearch.professional">
          <el-option label="全部" value=""></el-option>
          <el-option label="土建" value="土建"></el-option>
          <el-option label="装饰" value="装饰"></el-option>
          <el-option label="安装" value="安装"></el-option>
          <el-option label="市政" value="市政"></el-option>
          <el-option label="钢筋" value="钢筋"></el-option>
          <el-option label="景观绿化" value="景观绿化"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="tc wait-header-btn f13 mb-10">
      <el-button class="btn-orange shadow mt-15" type="primary" @click="searchProject"><i class="iconfont icon-shiliangzhinengduixiang f12 mr-5"></i>查 询</el-button>
      <el-button @click='resetForm("projectSearch")' type="primary" class="btn-indigo shadow mt-15"><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
    </div>
  </header>
  <article class="mt-30">
    <el-table @selection-change="handleSelectionChange" ref="multipleTable" :data="ProjectList" v-loading.body="listLoading" fit highlight-current-row>
      <el-table-column align="center" label='序号' width="60" type="index"></el-table-column>
      <el-table-column min-width="170" label="项目名称">
        <template slot-scope="scope">
        {{scope.row.projectName}}
      </template>
      </el-table-column>
      <el-table-column align="left" label='所属专业' width="120">
        <template slot-scope="scope">
          {{scope.row.professional ? scope.row.professional : "--"}}
        </template>
      </el-table-column>
      <el-table-column align="left" label='单项工程名称' width="190">
        <template slot-scope="scope">
          {{scope.row.name ? scope.row.name : "--"}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='专业咨询员' width="110">
        <template slot-scope="scope">
          {{scope.row.consultant ? scope.row.consultant : "--"}}
        </template>
      </el-table-column>
      <el-table-column align="left" label='包含内容' width="300">
        <template slot-scope="scope">
          {{scope.row.constructionContent ? scope.row.constructionContent : "--"}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作管理" width="200">
        <template slot-scope="scope">
          <span class="tc">
            <el-button @click="viewProject(scope.row)" type="text" size="small">工作要求</el-button>
            <el-button @click="viewProjectProgress(scope.row)" type="text" size="small">专业工作</el-button>
        </span>
      </template>
      </el-table-column>
    </el-table>
  </article>
  <footer class="mt-30 cb pagination" v-if="total&&!this.$route.query.projectId">
    <el-pagination @current-change="projectCurrentChange" :current-page.sync="pageNum" layout="prev, pager, next, jumper" :total="total" class="fr">
    </el-pagination>
    <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{total}}条记录</span>
  </footer>

  <!-- 专业工作-合同分析 -->
  <el-dialog :visible.sync="analysisMangerDialog" size="small" custom-class="icms-dialog">
    <span slot="title">专业工作-合同分析</span>
    <header>
      <el-form label-position="right" label-width="40%">
        <el-row :gutter="16">
          <el-col :sm="8">
            <el-form-item label="合同编号：" class="w">
              <el-input v-model="analysisMangerSearch.jobNumber" class="w" size="small" placeholder="请输入合同编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="8">
            <el-form-item label="合同名称：" class="w">
              <el-input v-model="analysisMangerSearch.jobName" class="w" size="small" placeholder="请输入合同名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="8" class="tc">
            <el-button @click="analysisMangerSearchBtn" class="btn-orange shadow" type="primary"><i class="iconfont icon-shiliangzhinengduixiang f14 mr-5"></i>查 询</el-button>
            <el-button @click="creatAnalysisBtn" class="btn-green shadow" type="primary"><i class="iconfont icon-iconfont707 f12 mr-5"></i>新 增</el-button>
          </el-col>
        </el-row>
      </el-form>
    </header>
    <el-table class="noShadow mt-10" :data="analysisMangerData" style="width: 100%" :loading="analysisMangerSearch.loading" highlight-current-row>
      <el-table-column type="index" label="编号" width="40" align="center"></el-table-column>
      <el-table-column prop="professional" width="150" label="所属专业"></el-table-column>
      <el-table-column prop="consultant" width="120" label="专业咨询员"></el-table-column>
      <el-table-column prop="jobType" width="90" label="工作类型"></el-table-column>
      <el-table-column prop="jobNumber" width="100" label="合同编号"></el-table-column>
      <el-table-column min-width="170" prop="jobName" label="合同名称"></el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
            <el-button @click="viewContractSingle(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="editCostCreatSingle(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="delContractSingle(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <footer class="mt-50 cb pagination" v-if="analysisMangerSearch.total">
      <el-pagination @current-change="analysisPageChange" :current-page.sync="analysisMangerSearch.pageNum" layout="prev, pager, next, jumper" :total="analysisMangerSearch.total" class="fr">
      </el-pagination>
      <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{analysisMangerSearch.total}}条记录</span>
    </footer>
  </el-dialog>

  <!-- 新增 - 合同基本信息  -->
  <el-dialog :visible.sync="creatAnalysisDialog" size="small" custom-class="icms-dialog">
    <span slot="title">{{contractData.title}}</span>
    <div class="dialog-box">
      <el-form :model="contractData" ref="contractData" :inline="true" label-width="35%" :rules="newProjectRules">
        <div class="icms-dialog-content pr mt-10">
          <nav class="pa">
            进度款基本信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="合同名称：" class="mt-10 w creat-new-form" prop="jobName">
                <el-input id="jobName" class="w90 fl" v-model="contractData.jobName" size="small" placeholder="请选择合同名称" readonly></el-input>
                <el-popover placement="right" trigger="click" width="850" popper-class="single-dialog">
                  <select-contract ref="c1" :wholeProcessId="wholeProcessId" v-on:selectContractData="selectContractData"></select-contract>
                  <!-- 项目负责人 -->
                  <el-button @click="showContractData" type="text" slot="reference" class="color-6 w10 fl tr"><i class="iconfont icon-shiliangzhinengduixiang f17"></i></el-button>
                </el-popover>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="合同编号：" class="mt-10 w creat-new-form" prop="jobNumber">
                <el-input class="w" v-model="contractData.jobNumber" size="small" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="发包人：" class="mt-10 w creat-new-form" prop="sendPackagePerson">
                <el-input class="w" v-model="contractData.sendPackagePerson" size="small" readonly></el-input>
                <!-- <el-date-picker :editable="false" class="w" size="small" type="date" placeholder="请输入发包人"></el-date-picker> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="合同金额（元）：" class="mt-10 w creat-new-form" prop="jobNumber">
                <el-input class="w" v-model="contractData.contractAmount" size="small" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="承包人：" class="mt-10 w creat-new-form" prop="contractor">
                <el-input class="w" v-model="contractData.contractor" size="small" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="合同类型：" class="mt-10 w creat-new-form" prop="contractType">
                <el-input class="w" v-model="contractData.contractType" size="small" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="开工日期：" class="mt-10 w creat-new-form" prop="startDateStr">
                <el-date-picker :editable="false" v-model="contractData.startDateStr" class="w" size="small" type="date"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="合同工期（天）：" class="mt-10 w creat-new-form" prop="measurementUnit">
                <el-input class="w" v-model="contractData.contractPeriod" size="small" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="竣工日期：" class="mt-10 w creat-new-form" prop="completionDateStr">
                <el-date-picker :editable="false" v-model="contractData.completionDateStr" class="w" size="small" type="date"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="质量要求：" class="mt-10 w creat-new-form" prop="qualityRequirement">
                <el-input type="textarea" class="w" v-model="contractData.qualityRequirement" size="small" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="付款方式：" class="mt-10 w creat-new-form" prop="payType">
                <el-radio-group v-model="contractData.payType">
                  <el-radio label="转账">转账</el-radio>
                  <el-radio label="现金">现金</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="签订时间：" class="mt-10 w creat-new-form" prop="xxDateStr">
                <el-date-picker :editable="false" v-model="contractData.xxDateStr" class="w" size="small" type="date"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="备注：" class="mt-10 w creat-new-form" prop="remark">
                <el-input type="textarea" class="w" v-model="contractData.remark" size="small" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            合同附件信息
          </nav>
          <el-table class="noShadow" :data="contractData.enclosureFiles" style="width: 100%">
            <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
            <el-table-column prop="fileName" label="文件名称"></el-table-column>
            <el-table-column prop="createTimeStr" width="170" label="上传时间"></el-table-column>
            <el-table-column prop="createUser" width="100" label="上传人"></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button v-if="contractData.delShow" @click="delWholeAnalysisFile(scope.row,scope.$index)" class="color-green" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            附件类型 - 招标文件
          </nav>
          <el-upload class="upload-file w mt-10" ref="upload" :on-remove="uploadWholeContractRemove" :on-error="fileError" :on-success="uploadWholeTenderSuccess" drag action="icms/wholeprocess/upload/uploadWholeprocessFile" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            附件类型 - 答疑
          </nav>
          <el-upload class="upload-file w mt-10" ref="upload" :on-remove="uploadWholeContractRemove" :on-error="fileError" :on-success="uploadWholeAnswerSuccess" drag action="icms/wholeprocess/upload/uploadWholeprocessFile" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            附件类型 - 报价分析
          </nav>
          <el-upload class="upload-file w mt-10" ref="upload" :on-remove="uploadWholeContractRemove" :on-error="fileError" :on-success="uploadWholeAnalysisSuccess" drag action="icms/wholeprocess/upload/uploadWholeprocessFile" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            附件类型 - 中标书
          </nav>
          <el-upload class="upload-file w mt-10" ref="upload" :on-remove="uploadWholeContractRemove" :on-error="fileError" :on-success="uploadWholeBidSuccess" drag action="icms/wholeprocess/upload/uploadWholeprocessFile" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            附件类型 - 询标函
          </nav>
          <el-upload class="upload-file w mt-10" ref="upload" :on-remove="uploadWholeContractRemove" :on-error="fileError" :on-success="uploadWholeLetterSuccess" drag action="icms/wholeprocess/upload/uploadWholeprocessFile" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            附件类型 - 标底
          </nav>
          <el-upload class="upload-file w mt-10" ref="upload" :on-remove="uploadWholeContractRemove" :on-error="fileError" :on-success="uploadWholeBaseSuccess" drag action="icms/wholeprocess/upload/uploadWholeprocessFile" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoading" v-if="contractData.editSave" class="btn-orange shadow" type="primary" @click='editSaveContractData("contractData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button :loading="buttonLoading" v-if="contractData.newSave" class="btn-orange shadow" type="primary" @click='saveContractData("contractData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='creatAnalysisDialog=false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 合同基本信息 -->
  <!-- 查看工程进度 -->
  <el-dialog :visible.sync="contractSingleDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 合同基本信息</span>
    <div class="dialog-box">
      <div class="icms-dialog-content pr p15">
        <nav class="pa">
          合同基本信息
        </nav>
        <el-row :gutter="16">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">合同名称：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{contractSingleData.jobName?contractSingleData.jobName:"--"}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">合同编号：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{contractSingleData.jobNumber?contractSingleData.jobNumber:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">发包人：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{contractSingleData.sendPackagePerson?contractSingleData.sendPackagePerson:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">合同金额（元）：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{contractSingleData.contractAmount?contractSingleData.contractAmount:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">承包人：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{contractSingleData.contractor?contractSingleData.contractor:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">合同类型：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{contractSingleData.contractType?contractSingleData.contractType:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">开工日期：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{contractSingleData.startDateStr?contractSingleData.startDateStr:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">合同工期（天）： </div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{contractSingleData.contractPeriod?contractSingleData.contractPeriod:"--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">竣工日期：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{contractSingleData.completionDateStr?contractSingleData.completionDateStr:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">质量要求：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{contractSingleData.qualityRequirement?contractSingleData.qualityRequirement:"--"}} </div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">付款方式：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{contractSingleData.payType?contractSingleData.payType:"--"}} </div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">签订时间：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{contractSingleData.xxDateStr?contractSingleData.xxDateStr:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">备注：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{contractSingleData.remark?contractSingleData.remark:"--"}} </div>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content  pr mt-40">
        <nav class="pa">
          合同附件信息
        </nav>
        <el-table class="noShadow" :data="contractSingleData.files" style="width: 100%" :loading="contractSingleData.loading" highlight-current-row>
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
  <!-- 合同基本信息 -->
  <!-- 项目基本信息 -->
  <el-dialog :visible.sync="viewProjectDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 工作要求</span>
    <div class="dialog-box" v-loading="viewLoading">
      <div class="icms-dialog-content  pr mt-10">
        <nav class="pa">
          单项工程基本信息
        </nav>
        <el-row :gutter="16">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">单项工程名称：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{viewProjectData.projectName}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">所属专业：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.professional ? viewProjectData.professional : "--"}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">专业咨询员：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.consultant ? viewProjectData.consultant : "--"}}</div>
            </el-col>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">包含内容：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.constructionContent ? viewProjectData.constructionContent : "--"}}</div>
          </el-col>

        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">工作要求：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.jobRequirement ? viewProjectData.jobRequirement : "--"}}</div>
          </el-col>

        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">其它内容：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{viewProjectData.otherContent ? viewProjectData.otherContent : "--"}}</div>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content pr mt-40">
        <nav class="pa">
          工作要求附件
        </nav>
        <el-table class="noShadow" :data="viewProjectData.infoFiles" style="width: 100%" highlight-current-row>
          <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
          <el-table-column min-width="170" prop="fileName" label="文件名称"></el-table-column>
          <el-table-column prop="createTimeStr" width="170" label="上传时间"></el-table-column>
          <el-table-column prop="createUser" width="90" label="上传人"></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <a target="_blank" :href="scope.row.id | setWholeDownloadUrl">
                <el-button type="text" size="small">下载</el-button>
              </a>
              <el-button @click="delWholeFile(scope.row,scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-upload v-if="roleBtnInfo.saveNewProject" class="upload-file w mt-10 bts-1" ref="upload" :on-remove="uploadWholeRemove" :on-error="fileError" :on-success="uploadWholeSuccess" drag action="icms/wholeprocess/upload/uploadSingleFile" accept="*" multiple>
          <i class="el-icon-upload f16 color-gray"></i>
          <div class="el-upload__text">将文件拖到此处，或点击上传</div>
          <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
        </el-upload>
      </div>
      <div v-if="roleBtnInfo.saveNewProject" class="dialog-footer tc mt-40">
        <el-button class="btn-orange shadow" type="primary" @click='saveJobRequirementFile'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
        <el-button class="btn-white shadow" @click='viewProjectDialog=false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
      </div>
    </div>
  </el-dialog>
  <!-- 查看工程进度 -->
  <el-dialog :visible.sync="projectProgressDialog" size="tiny" custom-class="icms-dialog">
    <span slot="title">选择 - 专业工作 - 子任务</span>
    <div class="dialog-box">
      <div class="cb f13 fb">
        <div class="fl w20 tc">
          <span class="p0-10 text-short">序号</span>
        </div>
        <div class="fl w50">
          <span class="p0-10 text-short">工作类型</span>
        </div>
        <div class="fl w30">
          <span class="p0-10 text-short">操作</span>
        </div>
      </div>
      <ul class="f14 whole-single-list">
        <li class="cb mt-25">
          <div class="fl w20 text-short tc">
            <span class="p0-10 cp">1</span>
          </div>
          <div class="fl w50 text-short">
            <span class="p0-10">合同分析</span>
          </div>
          <div class="fl w30 text-short">
            <span class="p0-10 cp color-green" @click="analysisManger">子任务管理</span>
          </div>
        </li>
        <li class="cb">
          <div class="fl w20 text-short tc">
            <span class="p0-10 cp">2</span>
          </div>
          <div class="fl w50 text-short">
            <span class="p0-10 color-red">签证</span>
          </div>
          <div class="fl w30 text-short">
            <span class="p0-10 cp color-green" @click="visaContentBtn">子任务管理</span>
          </div>
        </li>
        <li class="cb">
          <div class="fl w20 text-short tc">
            <span class="p0-10 cp">3</span>
          </div>
          <div class="fl w50 text-short">
            <span class="p0-10 color-red">测算</span>
          </div>
          <div class="fl w30 text-short">
            <span class="p0-10 cp color-green" @click="measureContentBtn">子任务管理</span>
          </div>
        </li>
        <li class="cb">
          <div class="fl w20 text-short tc">
            <span class="p0-10 cp">4</span>
          </div>
          <div class="fl w50 text-short">
            <span class="p0-10 color-red">设计变更</span>
          </div>
          <div class="fl w30 text-short">
            <span class="p0-10 cp color-green" @click="designChangeBtn">子任务管理</span>
          </div>
        </li>
        <li class="cb">
          <div class="fl w20 text-short tc">
            <span class="p0-10 cp">5</span>
          </div>
          <div class="fl w50 text-short">
            <span class="p0-10">进度款</span>
          </div>
          <div class="fl w30 text-short">
            <span class="p0-10 cp color-green" @click="projectPrpgressBtn">子任务管理</span>
          </div>
        </li>
        <li class="cb">
          <div class="fl w20 text-short tc">
            <span class="p0-10 cp">6</span>
          </div>
          <div class="fl w50 text-short">
            <span class="p0-10">技术核定单</span>
          </div>
          <div class="fl w30 text-short">
            <span class="p0-10 cp color-green" @click="approvalSheetBtn">子任务管理</span>
          </div>
        </li>
        <li class="cb">
          <div class="fl w20 text-short tc">
            <span class="p0-10 cp">7</span>
          </div>
          <div class="fl w50 text-short">
            <span class="p0-10">造价联系单</span>
          </div>
          <div class="fl w30 text-short">
            <span class="p0-10 cp color-green" @click="costContractBtn">子任务管理</span>
          </div>
        </li>
        <li class="cb">
          <div class="fl w20 text-short tc">
            <span class="p0-10 cp">8</span>
          </div>
          <div class="fl w50 text-short">
            <span class="p0-10">工程联系单</span>
          </div>
          <div class="fl w30 text-short">
            <span class="p0-10 cp color-green" @click="projectContractBtn">子任务管理</span>
          </div>
        </li>
        <li class="cb">
          <div class="fl w20 text-short tc">
            <span class="p0-10 cp">9</span>
          </div>
          <div class="fl w50 text-short">
            <span class="p0-10">询价单</span>
          </div>
          <div class="fl w30 text-short">
            <span class="p0-10 cp color-green" @click="inquiryBtn">子任务管理</span>
          </div>
        </li>
        <li class="cb">
          <div class="fl w20 text-short tc">
            <span class="p0-10 cp">10</span>
          </div>
          <div class="fl w50 text-short">
            <span class="p0-10">其它</span>
          </div>
          <div class="fl w30 text-short">
            <span class="p0-10 cp color-green" @click="otherContentBtn">子任务管理</span>
          </div>
        </li>
      </ul>
    </div>
  </el-dialog>

  <!-- 进度款组件 -->
  <project-progress ref="projectProgress" :projectInfo='projectInfo'></project-progress>

  <!-- 技术核定单组件 -->
  <approval-sheet ref="approvalSheet" :projectInfo='projectInfo'></approval-sheet>

  <!-- 造价联系单组件 -->
  <cost-contact ref="costContact" :projectInfo='projectInfo'></cost-contact>


  <!-- 工程联系单组件 -->
  <project-contact ref="projectContract" :projectInfo='projectInfo'></project-contact>

  <!-- 询价单组件 -->
  <inquiry ref="inquiry" :projectInfo='projectInfo'></inquiry>

  <!-- 其它组件 -->
  <other-content ref="otherContent" :projectInfo='projectInfo'></other-content>

  <!-- 签证组件 -->
  <visa-content ref="visaContent" :projectInfo='projectInfo'></visa-content>

  <!-- 测算组件 -->
  <measure-content ref="measureContent" :projectInfo='projectInfo'></measure-content>

  <!-- 设计变更组件 -->
  <design-change ref="designChange" :projectInfo='projectInfo'></design-change>
</div>
</template>

<script>
import {
  formatDateShort,
  beautyDate
} from '../../assets/js/psy.js'
import singlePage from '../../component/singleProject/singleProject.vue'
import selectContract from '../../component/selectContract/selectContract.vue'
import projectContact from './component/projectContact.vue'
import inquiry from './component/inquiry.vue'
import otherContent from './component/otherContent.vue'
import visaContent from './component/visaContent.vue'
import measureContent from './component/measureContent.vue'
import designChange from './component/designChange.vue'
import projectProgress from './component/projectProgress.vue'
import approvalSheet from './component/approvalSheet.vue'
import costContact from './component/costContact.vue'
export default {
  components: {
    'single-project': singlePage,
    'select-contract': selectContract,
    'project-contact': projectContact,
    'inquiry': inquiry,
    'other-content': otherContent,
    'visa-content': visaContent,
    'measure-content': measureContent,
    'design-change': designChange,
    'project-progress': projectProgress,
    'approval-sheet': approvalSheet,
    'cost-contact': costContact
  },
  data() {
    return {
      buttonLoading: false,
      buttonLoadingSubmit: false,
      buttonLoadingConfirm: false,
      // 新的开始
      projectInfo: '',
      analysisMangerDialog: false,
      creatAnalysisDialog: false,
      // 新的结束
      exportLoading: false,
      importExcelDialog: false,
      examineProjectDialog: false,
      distributionUser: [],
      multipleSelection: [],
      loginUser: "",
      userInfo: [],
      singleRejectDialog: false,
      newConfirmNextDialog: false,
      confirmNextDialog: false,
      checkNextSms: null,
      newCheckNextSms: null,
      editCostCreatDialog: false,
      leaderIssueDialog: false,
      supplementFileDialog: false,
      saveDataFileDialog: false,
      fillLoading: false,
      listLoading: true,
      viewLoading: false,
      examineProjectData: {
        loading: false,
        singleData: [],
        issueEdit: "否",
        issueOpinion: null
      },
      progressLoading: {
        history: false,
        children: false
      },
      distributeRules: {
        singleName: [{
          required: true,
          message: '请输入单项工程名称'
        }],
        projectDirector: [{
          required: true,
          message: '请选择项目负责人'
        }],
        projectManager: [{
          required: true,
          message: '请选择项目经理'
        }],
      },
      transferData: {
        opinions: '',
        distribution: ''
      },
      progressData: {
        mainData: {
          projectName: '',
          createUser: '',
          projectDirector: '',
          workProjectCategoryStr: '',
          projectAssignPerson: '',
          lead: '',
          approveType: '',
          technicalDirector: '',
          archivesManager: '',
          projectManager: '',
          processState: 0
        },
        history: [],
        children: []
      },
      viewProjectDialog: false,
      projectProgressDialog: false,
      transferDialog: false,
      distributeSingleDialog: false,
      fillReportDialog: false,
      creatNew: false,
      pageNum: 1,
      total: 0,
      approveTypeStatus: false,
      approveTypeData: [],
      contractData: {
        title: '新增 - 合同基本信息',
        delShow: true,
        newSave: true,
        editSave: false,

        jobName: '',
        jobNumber: '',
        sendPackagePerson: '',
        contractAmount: '',
        contractor: '',
        contractType: '',
        startDateStr: '',
        contractPeriod: '',
        completionDateStr: '',
        qualityRequirement: '',
        payType: '转账',
        xxDateStr: '',
        remark: '',
        enclosureFiles: [],
        uploadFiles: []
      },
      newProjectRules: {
        projectName: [{
          required: true,
          message: '请输入项目名称',
          trigger: 'blur'
        }],
        workProjectCategory: [{
          required: true,
          message: '请选择工作项目类别',
          trigger: 'change'
        }],
        approveType: [{
          required: true,
          message: '请选择审核类型',
          trigger: 'change'
        }]
      },
      projectSearch: {
        projectName: null,
        name: null,
        professional: "",
        wholeProcessId: null
      },
      viewProjectData: {
        // 项目合同信息
        contractNum: '',
        contractType: '',
        signStatus: '',
        contractMoney: '',
        priceMethod: '',
        // 项目基本信息
        projectName: '',
        projectWay: '',
        projectStructure: '',
        unit: '',
        askType: '',
        workType: '',
        approveType: '',
        companyName: '',
        companyPerson: '',
        companyTel: '',
        investmentPropertiesStr: '',
        projectLocation: '',
        dataReceivedDate: '',
        registerDate: '',
        appointmentDoneDate: '',
        projectRequirement: '',
        technologyLeader: '',
        projectDistribution: '',
        projectManager: '',
        // 建设单位信息
        buildName: '',
        buildPerson: '',
        buildTel: '',
        // 项目送审信息
        constructionName: '',
        submitPrice: '',
        constructionPrice: '',
        // 项目审定信息
        submitInfoPrice: '',
        contractPrice: '',
        donePrice: '',
        increaseProbability: '',
        // 项目基本文档
        normalFiles: [],
        // 档案资料
        infoFiles: []
      },
      submitWhole: {
        file: [],
        id: null
      },
      singleData: {
        singleLoading: false,
        name: '',
        professional: '',
        consultant: '',
        constructionContent: '',
        isQdBdTogether: '',
        jobRequirement: '',
        otherContent: '',
        firstDraftTimeStr: '',
        endDraftTimeStr: '',
        // 单项工程相关报告信息
        constructionArea: '',
        steelAmount: '',
        steelConsumptionIndicator: '',
        cementAmount: '',
        cementConsumptionIndicator: '',
        readyMixedConcreteAmount: '',
        readyMixedConcreteConsumptionIndicator: '',
        professionalAmount: '',
        professionalUnilateralCost: '',
        manDaysAmount: '',
        manDaysConsumptionIndicator: '',
        remarks: '',
        reviewer: '',
        // 电子附件
        files: []
      },
      ProjectList: [],
      searchInfo: {
        projectName: null,
        name: null,
        professional: "",
        wholeProcessId: null
      },
      saveDataFileData: {
        id: null,
        workType: null,
        name: null,
        infoFiles: [],
        archiveContentOfReport: [],
        archiveContent: [],
        archiveInstructionsOfReport: null,
        archiveInstructions: null,
        archiveNumber: null,
        reportDateStr: null,
        archiveDateStr: null,
        approveOpinion: null
      },
      saveDataFileDataRules: {
        name: [{
          required: true,
          message: '请输入项目名称'
        }],
        archiveInstructions: [{
          required: true,
          message: '请输入管理员归档说明'
        }],
        archiveNumber: [{
          required: true,
          message: '请输入归档号'
        }],
        reportDateStr: [{
          required: true,
          message: '请选择日期'
        }],
        archiveDateStr: [{
          required: true,
          message: '请选择日期'
        }]
      },
      reportNumArray: [],
      supplementId: null,
      leaderIssueData: {
        singleData: [],
        issueEdit: "通过",
        issueOpinion: null
      },
      singleRejectData: {
        loading: false,
        singleData: []
      },
      stepData: [],
      //
      roleBtnInfo: {
        saveNewProject: false,
        edit: false,
        delete: false,
        distributeSingle: false,
        transferDistribute: false,
        whiteReport: false,
        uploadFiles: false,
        singleReject: false,
        fileSave: false,
        creatNewProject: false,
        examineBtnShow: false,
      },
      //项目ID
      wholeProjectId: null,
      wholeProcessId: 0,
      analysisMangerSearch: {
        jobNumber: '',
        jobName: '',
        pageNum: 1,
        total: 0,
        loading: false
      },
      analysisMangerData: [],
      contractSingleDialog: false, //合同信息弹窗
      contractSingleData: {
        loading: false,

        jobName: '',
        jobNumber: '',
        sendPackagePerson: '',
        contractAmount: '',
        contractor: '',
        contractType: '',
        startDateStr: '',
        contractPeriod: '',
        completionDateStr: '',
        qualityRequirement: '',
        payType: '',
        xxDateStr: '',
        remark: '',

        files: []
      },

      contractList: [] //对应合同
    }
  },
  filters: {
    setDownloadUrl(url) {
      return `${location.origin}/icms/wholeprocess/download/consultantJobFile?id=${url}`;
    },
    setWholeDownloadUrl(url) {
      return `${location.origin}/icms/wholeprocess/download/singleFile?id=${url}`;
    }
  },
  mounted() {
    this.$store.state.app.wholeSingleRouter = this.$route.query.projectId;
    this.$store.state.app.fromPathPage = this.$route.query.fromPathPage;
    this.loginUser = this.$store.state.app.userInfo.userName;
    this.userInfo = this.$store.state.app.userInfo;
    //console.log("用户信息", this.userInfo);
    this.roleBtnShow() //按钮隐藏
    this.setWaitFun()
  },
  methods: {
    setWaitFun() {
      if (this.$route.query.projectId) {
        this.searchInfo.id = this.$route.query.projectId
        this.wholeProjectId = this.$route.query.projectId;
        this.getProjectList(this.pageNum, this.searchInfo, () => {
          if (this.$route.query.projectId) {
            if (this.$route.query.content.indexOf("测算") != -1) {
              this.projectInfo.waitId = this.$route.query.jobId;
              setTimeout(() => {
                this.$refs.measureContent.visaContentChildBtn();
              })
            }
            if (this.$route.query.content.indexOf("签证") != -1) {
              this.projectInfo.waitId = this.$route.query.jobId;
              setTimeout(() => {
                this.$refs.visaContent.visaContentChildBtn();
              })
            }
            if (this.$route.query.content.indexOf("设计变更") != -1) {
              this.projectInfo.waitId = this.$route.query.jobId;
              setTimeout(() => {
                this.$refs.designChange.visaContentChildBtn();
              })
            }
          }
        });

        this.projectProgressDialog = true;
      } else if (this.$route.query.projectName) {
        this.projectSearch.projectName = this.$route.query.projectName
        this.getProjectList(this.pageNum, this.projectSearch);
      } else {
        this.getProjectList(this.pageNum);
      }
    },
    /* 单项工程开始 */
    measureContentBtn() { //测算函数
      this.$refs.measureContent.visaContentChildBtn();
    },

    designChangeBtn() { //设计变更函数
      this.$refs.designChange.visaContentChildBtn();
    },

    visaContentBtn() { //签证函数
      this.$refs.visaContent.visaContentChildBtn();
    },

    projectPrpgressBtn() { //进度款函数
      this.$refs.projectProgress.progressFundChildBtn();
    },

    approvalSheetBtn() { //技术核定单函数
      this.$refs.approvalSheet.approvalSheetChildBtn();
    },
    // 造价联系单函数模块
    costContractBtn() {
      this.$refs.costContact.costContractChildBtn();
    },
    otherContentBtn() { //其它函数
      this.$refs.otherContent.otherContentChildBtn();
    },

    inquiryBtn() { //询价单函数
      this.$refs.inquiry.inquiryChildBtn();
    },

    // 工程联系单函数模块
    projectContractBtn() {
      this.$refs.projectContract.projectContactChildBtn();
    },
    // 工程联系单函数模块


    getContractListArray(id) { //获取对应合同列表
      this.publicFun.httpRequest("get", `wholeprocess/getConsultantContract?singleId=${id}`, null, (status, data, message) => {
        if (status == 0) {
          this.contractList = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    editSaveContractData() {
      let contractData = {
        "approveOpinion": null,
        "approveResult": null,
        "completionDateStr": formatDateShort(this.contractData.completionDateStr),
        "consultant": null,
        "contractAmount": this.contractData.contractAmount,
        "contractPeriod": this.contractData.contractPeriod,
        "contractType": this.contractData.contractType,
        "contractor": this.contractData.contractor,
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
        "htFiles": this.contractData.uploadFiles.length > 0 ? JSON.stringify(this.contractData.uploadFiles) : null,
        "id": this.contractData.editId,
        "isDirectorAudit": null,
        "isDynamicCost": null,
        "isSendMsg": null,
        "jobCommitDeadlineDateStr": null,
        "jobName": this.contractData.jobName,
        "jobNumber": this.contractData.jobNumber,
        "jobRequirement": null,
        "jobType": "合同",
        "monthyApplyAmount": null,
        "monthyReplyAmount": null,
        "payType": this.contractData.payType,
        "processState": null,
        "professional": null,
        "professionalDirector": null,
        "qualityRequirement": this.contractData.qualityRequirement,
        "receiveUnit": null,
        "remark": this.contractData.remark,
        "reviewAmount": null,
        "sendPackagePerson": this.contractData.sendPackagePerson,
        "sendTaskFiles": null,
        "sendUnit": null,
        "singleId": this.wholeProjectId,
        "startDateStr": formatDateShort(this.contractData.startDateStr),
        "subtractAmount": null,
        "validationAmount": null,
        "xxAmount": null,
        "xxContent": null,
        "xxContract": null,
        "xxDateStr": formatDateShort(this.contractData.xxDateStr),
        "version": this.contractData.editVersion
      }
      this.buttonLoading = true;
      this.publicFun.httpRequest("put", `wholeprocess/updateConsultantJob`, contractData, (status, data, message) => {
        if (status == 0) {
          this.buttonLoading = false;
          this.$message.success(message);
          this.creatAnalysisDialog = false;
          this.getContractList();
        } else {
          this.$message.error(message);
        }
      });

    },
    editCostCreatSingle(row) { //编辑合同按钮
      this.creatAnalysisDialog = true;
      this.contractData.title = "修改 - 合同基本信息";
      this.contractData.delShow = false;
      this.contractData.editSave = true;
      this.contractData.newSave = false;
      //console.log(row);
      this.contractData.jobName = row.jobName;
      this.contractData.jobNumber = row.jobNumber;
      this.contractData.sendPackagePerson = row.sendPackagePerson;
      this.contractData.contractAmount = row.contractAmount;
      this.contractData.contractor = row.contractor;
      this.contractData.contractType = row.contractType;
      this.contractData.startDateStr = row.startDateStr;
      this.contractData.contractPeriod = row.contractPeriod;
      this.contractData.completionDateStr = row.completionDateStr;
      this.contractData.qualityRequirement = row.qualityRequirement;
      this.contractData.payType = row.payType;
      this.contractData.xxDateStr = row.signDateStr;
      this.contractData.remark = row.remark;
      this.contractData.editId = row.id;
      this.contractData.editVersion = row.version;
      if (this.contractData.uploadFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.publicFun.httpRequest("get", `wholeprocess/getJobFilesByJobId?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.contractData.enclosureFiles = data;
        } else {
          this.$message.error(message);
        }
      });

    },
    viewContractSingle(row) { //查看合同信息
      this.contractSingleDialog = true;
      //console.log(row);
      this.contractSingleData = {
        loading: true,
        jobName: row.jobName,
        jobNumber: row.jobNumber,
        sendPackagePerson: row.sendPackagePerson,
        contractAmount: row.contractAmount,
        contractor: row.contractor,
        contractType: row.contractType,
        startDateStr: row.startDateStr,
        contractPeriod: row.contractPeriod,
        completionDateStr: row.completionDateStr,
        qualityRequirement: row.qualityRequirement,
        payType: row.payType,
        xxDateStr: row.xxDateStr,
        remark: row.remark,

        files: []
      };
      this.publicFun.httpRequest("get", `wholeprocess/getJobFilesByJobId?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.contractSingleData.loading = false;
          this.contractSingleData.files = data;
        } else {
          this.$message.error(message);
        }
      });
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
            if (row.jobType == "合同") {
              this.getContractList();
            } else if (row.jobType == "进度款") {
              this.getProgressFundList();
            } else if (row.jobType == "技术核定单") {
              this.getApprovalSheetList();
            } else if (row.jobType == "造价联系单") {
              this.getCostContactList();
            }

          }
        });
      }).catch(() => {});
    },
    saveContractData() { //保存合同基本信息
      if (this.contractData.jobName) {
        let contractData = {
          "approveOpinion": null,
          "approveResult": null,
          "completionDateStr": formatDateShort(this.contractData.completionDateStr),
          "consultant": null,
          "contractAmount": this.contractData.contractAmount,
          "contractPeriod": this.contractData.contractPeriod,
          "contractType": this.contractData.contractType,
          "contractor": this.contractData.contractor,
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
          "htFiles": this.contractData.uploadFiles.length > 0 ? JSON.stringify(this.contractData.uploadFiles) : null,
          "id": -1,
          "isDirectorAudit": null,
          "isDynamicCost": null,
          "isSendMsg": null,
          "jobCommitDeadlineDateStr": null,
          "jobName": this.contractData.jobName,
          "jobNumber": this.contractData.jobNumber,
          "jobRequirement": null,
          "jobType": "合同",
          "monthyApplyAmount": null,
          "monthyReplyAmount": null,
          "payType": this.contractData.payType,
          "processState": null,
          "professional": null,
          "professionalDirector": null,
          "qualityRequirement": this.contractData.qualityRequirement,
          "receiveUnit": null,
          "remark": this.contractData.remark,
          "reviewAmount": null,
          "sendPackagePerson": this.contractData.sendPackagePerson,
          "sendTaskFiles": null,
          "sendUnit": null,
          "singleId": this.wholeProjectId,
          "startDateStr": formatDateShort(this.contractData.startDateStr),
          "subtractAmount": null,
          "validationAmount": null,
          "xxAmount": null,
          "xxContent": null,
          "xxContract": null,
          "xxDateStr": formatDateShort(this.contractData.xxDateStr)
        }
        this.buttonLoading = true;
        this.publicFun.httpRequest("post", `wholeprocess/addConsultantJob`, contractData, (status, data, message) => {
          if (status == 0) {
            this.buttonLoading = false;
            this.$message.success(message);
            this.creatAnalysisDialog = false;
            this.getContractList();
          } else {
            this.$message.error(message);
          }
        });
      } else {
        this.$message.error("请选择合同名称");
        document.querySelector("#jobName input").focus();
      }
    },
    selectContractData(row) {
      //console.log(row);
      document.querySelector(".el-dialog").click();
      this.contractData.jobName = row.contractName;
      this.contractData.jobNumber = row.contractNumber;
      this.contractData.sendPackagePerson = row.sendPackagePerson;
      this.contractData.contractAmount = row.contractAmount;
      this.contractData.contractor = row.contractor;
      this.contractData.contractType = row.contractType;
      this.contractData.startDateStr = row.startDateStr;
      this.contractData.contractPeriod = row.contractPeriod;
      this.contractData.completionDateStr = row.completionDateStr;
      this.contractData.qualityRequirement = row.qualityRequirement;
      this.contractData.payType = row.payType;
      this.contractData.xxDateStr = row.signDateStr;
      this.contractData.remark = row.remark;
      // this.contractData.enclosureFiles: row.,
      this.publicFun.httpRequest("get", `wholeprocess/getContractFilesByPMJobId?pmJobId=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          //console.log('文件信息', data);
          this.contractData.enclosureFiles = data;
          data.forEach((item) => {
            let fileData = {
              fileName: item.fileName,
              fileType: item.fileType,
              createUser: item.createUser,
              createTimeStr: item.createTimeStr
            }
            this.contractData.uploadFiles.push(fileData)
          });
        } else {
          this.$message.error(message);
        }
      });
    },
    delWholeAnalysisFile(row, index) {
      this.$confirm('确认要删除此文件吗？', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.contractData.enclosureFiles.splice(index, 1);
        //console.log("删除文件", row)
        this.contractData.uploadFiles.forEach((item) => {
          if (item.fileName.split(".")[0].indexOf(row.fileName.split(".")[0]) != -1) {
            this.contractData.uploadFiles.removeByValue(item);
          }
        });
      }).catch(() => {});
    },
    showContractData() {
      this.$refs.c1.searchUserFirst();
    },
    analysisMangerSearchBtn() {
      this.getContractList();
    },
    creatAnalysisBtn() { //新建合同分析
      this.creatAnalysisDialog = true;

      this.contractData = {
        title: '新增 - 合同基本信息',
        jobName: '',
        jobNumber: '',
        sendPackagePerson: '',
        contractAmount: '',
        contractor: '',
        contractType: '',
        startDateStr: '',
        contractPeriod: '',
        completionDateStr: '',
        qualityRequirement: '',
        payType: '转账',
        xxDateStr: '',
        remark: '',
        enclosureFiles: [],
        uploadFiles: []
      }
      this.contractData.delShow = true;
      this.contractData.editSave = false;
      this.contractData.newSave = true;
      if (this.contractData.uploadFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
    },
    viewProjectProgress(row) { //专业工作弹窗
      //console.log("信息", row)
      this.projectProgressDialog = true;
      this.projectInfo = row;
      this.wholeProjectId = row.id
      this.wholeProcessId = row.wholeProcessId;
    },
    analysisManger(jobType) { //合同分析
      this.analysisMangerDialog = true;
      this.getContractList();
    },
    getContractList() {
      this.analysisMangerSearch.loading = true;
      let params = {
        page: this.analysisMangerSearch.pageNum,
        rows: 10,
        singleId: this.wholeProjectId,
        jobType: "合同",
        jobName: this.analysisMangerSearch.jobName,
        jobNumber: this.analysisMangerSearch.jobNumber
      }
      this.publicFun.httpRequest("get", 'wholeprocess/listConsultantJobs', null, (status, data, message) => {
        if (status == 0) {
          //console.log(data);
          this.analysisMangerData = data.rows;
          this.analysisMangerSearch.total = data.total;
          this.analysisMangerSearch.loading = false;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    analysisPageChange(val) {
      this.analysisMangerSearch.pageNum = val;
      this.getContractList()
    },
    saveJobRequirementFile() {
      this.publicFun.httpRequest("post", `wholeprocess/saveJobRequirementFile?singleId=${this.submitWhole.id}`, this.submitWhole.file.length != 0 ? this.submitWhole.file : null, (status, data, message) => {
        if (status == 0) {
          this.$message.success(message);
          this.viewProjectDialog = false;
        } else {
          this.$message.error(message);
        }
      });
    },
    viewProject(row) {
      if (this.submitWhole.file.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.submitWhole.id = row.id;
      this.viewProjectDialog = true;
      this.viewLoading = true;
      let params = {
        singleId: row.id
      }
      this.publicFun.httpRequest("get", 'wholeprocess/getSingle', null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(() => {
            this.viewLoading = false;
          });
          this.viewProjectData = {
            // 项目基本信息
            projectName: data.single.name,
            professional: data.single.professional,
            consultant: data.single.consultant,
            constructionContent: data.single.constructionContent,
            jobRequirement: data.single.jobRequirement,
            otherContent: data.single.otherContent,
            // 档案资料
            infoFiles: data.files
          }
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    uploadWholeContractRemove(file, fileList) {
      //console.log("移除文件", file)
      this.contractData.uploadFiles.forEach((item) => {
        if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1) {
          this.contractData.uploadFiles.removeByValue(item);
        }
      });
    },
    uploadCostContactDataSuccess(response, file, fileList) { //进度款文件上传
      this.pushWholeFile("造价联系单", response)
    },
    uploadApprovalSheetDataSuccess(response, file, fileList) { //进度款文件上传
      this.pushWholeFile("技术核定单", response)
    },
    uploadProgressFundDataSuccess(response, file, fileList) { //进度款文件上传
      this.pushWholeFile("进度款", response)
    },
    uploadWholeTenderSuccess(response, file, fileList) { //招标文件上传
      this.pushWholeFile("招标文件", response)
    },
    uploadWholeAnswerSuccess(response, file, fileList) { //答疑文件上传
      this.pushWholeFile("答疑", response)
    },
    uploadWholeAnalysisSuccess(response, file, fileList) { //答疑文件上传
      this.pushWholeFile("报价分析", response)
    },
    uploadWholeBidSuccess(response, file, fileList) { //答疑文件上传
      this.pushWholeFile("中标书", response)
    },
    uploadWholeLetterSuccess(response, file, fileList) { //答疑文件上传
      this.pushWholeFile("询标函", response)
    },
    uploadWholeBaseSuccess(response, file, fileList) { //答疑文件上传
      this.pushWholeFile("标底", response)
    },
    pushWholeFile(fileType, response) {
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: fileType,
        createUser: this.loginUser,
        createTimeStr: response.record[0].createTimeStr
      }
      this.contractData.uploadFiles.push(fileData);
      //console.log(this.contractData.uploadFiles)
    },
    /* 单项工程结束 */
    editExcelBtn(row) {
      //console.log(row);
      let excelData = {
        costId: row.costId,
        fileId: row.id
      }
      this.publicFun.httpRequest("get", `cost/project/getPageOfficeLinkUrl`, null, (status, data, message) => {
        if (status == 0) {
          //console.log("编辑链接", data)
          window.open(data, "_blank")
        } else {
          this.$message.error(message);
        }
      }, excelData);
    },
    roleBtnShow() {
      let meanRole = this.$store.state.app.userInfo.menus;
      //console.log("项目于管理", meanRole);
      if (this.userInfo.userRoleNames.indexOf('分管副总') != -1) {
        this.roleBtnInfo.saveNewProject = true;
      } else {
        this.roleBtnInfo.saveNewProject = false;
      }
      meanRole.forEach((grandpa) => {
        if (grandpa.menuName == "全过程管理") {
          grandpa.children.forEach((parent) => {
            if (parent.menuName == "项目管理") {
              parent.children.forEach((child) => {
                if (child.menuName == "删除") {
                  this.roleBtnInfo.delete = true;
                } else if (child.menuName == "新增") {
                  this.roleBtnInfo.creatNewProject = true;
                } else if (child.menuName == "分配") {
                  this.roleBtnInfo.distributeSingle = true;
                  this.roleBtnInfo.transferDistribute = true;
                } else if (child.menuName == "修改") {
                  this.roleBtnInfo.edit = true;
                } else if (child.menuName == "填写报告") {
                  this.roleBtnInfo.whiteReport = true;
                } else if (child.menuName == "归档") {
                  this.roleBtnInfo.fillSave = true;
                }
              })
            }
          })
        }
      });
    },
    deleteSingle(row, index) {
      this.$confirm('确认要删除此项目吗？', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.publicFun.httpRequest("delete", `cost/project/deleteSingle?id=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.leaderIssueData.singleData.splice(index, 1);
            this.examineProjectData.singleData.splice(index, 1);
          }
        });
      }).catch(() => {});
    },
    delWholeFile(row, index) {
      this.$confirm('确认要删除此文件吗？', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.publicFun.httpRequest("delete", `wholeprocess/deleteSingleFile?id=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.viewProjectData.infoFiles.splice(index, 1);
          } else {
            this.$message.error(message);
          }
        });
      }).catch(() => {

      });
    },

    searchProject() {
      this.searchInfo = {
        projectName: this.projectSearch.projectName,
        name: this.projectSearch.name,
        professional: this.projectSearch.professional,
        id: this.projectSearch.id,
        wholeProcessId: this.projectSearch.wholeProcessId
      }
      this.getProjectList(1, this.searchInfo);
      this.pageNum = 1;
    },
    getProjectList(page, searchInfo, callback) {
      let params = {
        page: page,
        rows: 10,
        projectName: searchInfo ? searchInfo.projectName ? searchInfo.projectName.trim() : null : null,
        wholeProcessId: searchInfo ? searchInfo.wholeProcessId ? searchInfo.wholeProcessId.trim() : null : null,
        name: searchInfo ? searchInfo.name ? searchInfo.name.trim() : null : null,
        professional: searchInfo ? searchInfo.professional : null,
        id: searchInfo ? searchInfo.id ? searchInfo.id : null : null,
      }
      this.listLoading = true;
      this.publicFun.httpRequest("get", 'wholeprocess/listSingles', null, (status, data, message) => {
        if (status == 0) {
          this.ProjectList = data.rows;
          this.publicFun.handleIELoading(() => {
            this.listLoading = false;
          });
          this.total = data.total;
          if (searchInfo) {
            this.projectInfo = data.rows.length > 0 ? data.rows[0] : null;
            callback()
          }
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    projectCurrentChange(val) {
      this.getProjectList(val, this.searchInfo);
      this.pageNum = val;
    },
    uploadRemove(file, fileList) {
      //console.log("移除文件", file)
      // this.newProjectData.costFiles.forEach((item) => {
      //   if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1) {
      //     this.newProjectData.costFiles.removeByValue(item);
      //   }
      // });
    },
    uploadSuccess(response, file, fileList) {
      //console.log("文件上传成功", response)
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: "项目登记",
        createUser: this.loginUser
      }
      // this.newProjectData.costFiles.push(fileData);
    },
    uploadWholeRemove(file, fileList) {
      //console.log("移除文件", file)
      this.submitWhole.file.forEach((item) => {
        if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1) {
          this.submitWhole.file.removeByValue(item);
        }
      });
    },
    uploadWholeSuccess(response, file, fileList) {
      //console.log("文件上传成功", response)
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: null,
        createUser: this.loginUser,
        createTimeStr: response.record[0].createTimeStr
      }
      this.submitWhole.file.push(fileData);
    },
    fileError(err, file, fileList) {
      this.$message.error("很抱歉，上传失败，请检查文件大小或稍后再试");
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
<style lang="stylus">
.whole-single-list li
  padding 15px 0
  transition all .5s
  &:hover
    background-color #f1f1f1
</style>
