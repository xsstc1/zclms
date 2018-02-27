<template>
<div id="project-setting" class="app-container">
  <header class="p25 bg-color-white pr shadow radius5 header-search" v-if="!routerExistence">
    <el-form :inline="true" ref="projectSearch" :model="projectSearch" class="demo-form-inline" label-width="110px">
      <el-form-item label="项目名称:" prop="name">
        <el-input @keyup.enter.native="searchProject" size="small" v-model="projectSearch.name" placeholder="请填写项目名称"></el-input>
      </el-form-item>
      <el-form-item label="委托单位:" prop="entrust">
        <el-input @keyup.enter.native="searchProject" size="small" v-model="projectSearch.entrust" placeholder="请填写委托单位"></el-input>
      </el-form-item>
      <el-form-item label="报告编号:" prop="reportNum">
        <el-input @keyup.enter.native="searchProject" size="small" v-model="projectSearch.reportNum" placeholder="请填写报告编号"></el-input>
      </el-form-item>
      <el-form-item label="项目负责人:" prop="principal">
        <el-input @keyup.enter.native="searchProject" size="small" v-model="projectSearch.principal" placeholder="请填写项目负责人"></el-input>
      </el-form-item>
      <br>
      <el-form-item label="归档日期:" prop="date">
        <el-date-picker :editable="false" v-model="projectSearch.date" class="w" size="small" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="归档编号:" prop="backNum">
        <el-input @keyup.enter.native="searchProject" size="small" v-model="projectSearch.backNum" placeholder="请填写归档编号"></el-input>
      </el-form-item>
      <el-form-item label="建设单位:" prop="build">
        <el-input @keyup.enter.native="searchProject" size="small" v-model="projectSearch.build" placeholder="请填写建设单位"></el-input>
      </el-form-item>
      <el-form-item label="项目类别:" prop="type">
        <el-select placeholder="请选择项目类别" v-model="projectSearch.type" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="标底编制" value="1"></el-option>
          <el-option label="标底编制（全过程）" value="2"></el-option>
          <el-option label="材料设备询价" value="3"></el-option>
          <el-option label="结算审核" value="4"></el-option>
          <el-option label="预算编制" value="5"></el-option>
          <el-option label="内审" value="6"></el-option>
          <el-option label="标底（零星）" value="7"></el-option>
          <el-option label="清单编制" value="8"></el-option>
          <el-option label="全过程" value="9"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="流程状态:" prop="statute">
        <el-select placeholder="请选择流程状态" v-model="projectSearch.statute">
          <el-option label="全部" value=""></el-option>
          <el-option label="进行中" value="进行中"></el-option>
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
      <el-form-item label="专业:" prop="professional">
        <el-select v-model="projectSearch.professional" size="small" placeholder="请选择专业">
          <el-option label="全部" value=""></el-option>
          <el-option label="土建" value="土建"></el-option>
          <el-option label="装饰" value="装饰"></el-option>
          <el-option label="安装" value="安装"></el-option>
          <el-option label="市政" value="市政"></el-option>
          <el-option label="钢筋" value="钢筋"></el-option>
          <el-option label="景观绿化" value="景观绿化"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资料收到日期:" prop="informationReceivedDateStrFrom">
        <el-date-picker :editable="false" v-model="projectSearch.informationReceivedDateStrFrom" type="date" placeholder="请选择日期" clearable></el-date-picker>
      </el-form-item>
      <span class="ml-10 mr-15 mt-10 disinblock">至</span>
      <el-form-item class="block-xs" prop="informationReceivedDateStrTo">
        <el-date-picker :editable="false" v-model="projectSearch.informationReceivedDateStrTo" type="date" placeholder="请选择日期" clearable></el-date-picker>
      </el-form-item>
    </el-form>
    <div class="tc wait-header-btn f13 mb-10">
      <el-button class="btn-orange shadow mt-20" type="primary" @click="searchProject"><i class="iconfont icon-shiliangzhinengduixiang f12 mr-5"></i>查 询</el-button>
      <el-button @click='resetForm("projectSearch")' type="primary" class="btn-indigo shadow mt-20"><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
      <el-button v-if="roleBtnInfo.leaderIssue&&userInfo.userRoleNames.indexOf('领导')!=-1" @click="multipleIssue" class="btn-blue shadow mt-20" type="primary"><i class="iconfont icon-qianfa f12 mr-5"></i>批量签发</el-button>
      <el-button v-if="roleBtnInfo.creatNewProject" class="btn-blue shadow mt-20" type="primary" @click="creatNewDialog"><i class="iconfont icon-iconfont707 f12 mr-5"></i>新 建</el-button>
      <el-button @click="importExcelDialog=true" v-if="roleBtnInfo.creatNewProject" class="btn-red shadow mt-20" type="primary"><i class="iconfont icon-tianjiawenjianjia f12 mr-5"></i>导入文件</el-button>
      <el-button @click="exportBatch" :loading="exportLoading" class="btn-green shadow mt-20" type="primary"><i class="iconfont icon-excel f12 mr-5"></i>导出Excel</el-button>
    </div>
  </header>
  <article class="mt-30">
    <el-table @selection-change="handleSelectionChange" ref="multipleTable" :data="ProjectList" v-loading.body="listLoading" fit highlight-current-row>
      <el-table-column v-if="roleBtnInfo.leaderIssue&&userInfo.userRoleNames.indexOf('领导')!=-1&&projectSearch.statute=='领导签发'" type="selection" width="60" align="right"></el-table-column>
      <el-table-column align="center" label='序号' width="60" type="index"></el-table-column>
      <el-table-column label="项目名称" width="200">
        <template slot-scope="scope">
        <router-link class='inlineBlock color-green' :to="{ path: 'singleSetting', query: { projectName: scope.row.projectName }}">
        {{scope.row.projectName}}
        </router-link>
      </template>
      </el-table-column>
      <el-table-column align="left" label='委托单位' width="180">
        <template slot-scope="scope">
          {{scope.row.delegateUnitName ? scope.row.delegateUnitName : "--"}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='项目负责人' width="90">
        <template slot-scope="scope">
          {{scope.row.projectDirector ? scope.row.projectDirector : "--"}}
        </template>
      </el-table-column>
      <el-table-column align="left" label='报告编号' width="120">
        <template slot-scope="scope">
          {{scope.row.reportNumbers ? scope.row.reportNumbers : "--"}}
        </template>
      </el-table-column>
      <el-table-column align="left" label='归档号' width="95">
        <template slot-scope="scope">
          {{scope.row.archiveNumber ? scope.row.archiveNumber : "--"}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='资料收到日期' width="110">
        <template slot-scope="scope">
          {{scope.row.informationReceivedDateStr ? scope.row.informationReceivedDateStr : "--"}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='提交归档时间' width="130">
        <template slot-scope="scope">
          {{scope.row.submitArchiveDateStr ? scope.row.submitArchiveDateStr : "--"}}
        </template>
      </el-table-column>
      <el-table-column align="left" label='工作项目类型' width="110" prop="workProjectCategoryStr"></el-table-column>
      <el-table-column align="left" label='施工合同金额（元）' width="140">
        <template slot-scope="scope">
          {{scope.row.contractEstimationPrice ? scope.row.contractEstimationPrice : 0}}
        </template>
      </el-table-column>
      <el-table-column align="left" label='送审价' width="120">
        <template slot-scope="scope">
          {{scope.row.reviewAmount ? scope.row.reviewAmount : 0}}
        </template>
      </el-table-column>
      <el-table-column align="left" label='专业编制金额' width="120">
        <template slot-scope="scope">
          {{scope.row.professionalAmountSum ? scope.row.professionalAmountSum : 0}}
        </template>
      </el-table-column>
      <el-table-column align="left" label='审定金额' width="120">
        <template slot-scope="scope">
          {{scope.row.projectValidationAmount ? scope.row.projectValidationAmount : 0}}
        </template>
      </el-table-column>
      <el-table-column align="left" label='流程状态' width="140" prop="processState"></el-table-column>
      <el-table-column align="center" label="操作管理" width="300">
        <template slot-scope="scope">
          <span class="pl-15 fl tl">
            <el-button @click="viewProject(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="viewProjectProgress(scope.row)" type="text" size="small">工程进度</el-button>
            <el-button v-if="roleBtnInfo.edit&&scope.row.createUser==loginUser" @click="editCostCreatBtn(scope.row)" type="text" size="small">修改</el-button>
            <el-button v-if="roleBtnInfo.delete&&scope.row.projectAssignPerson == loginUser&&(scope.row.processState=='项目登记'||scope.row.processState=='项目分配'||scope.row.processState=='单项工程审核')" @click="delProject(scope.row)" type="text" size="small">删除</el-button>
            <el-button v-if="roleBtnInfo.distributeSingle&&scope.row.projectAssignPerson==loginUser && (scope.row.processState == '项目分配'|| scope.row.processState == '单项工程审核')" @click="distributeSingle(scope.row)" type="text" size="small">分配单项工程</el-button>
            <el-button v-if="roleBtnInfo.distributeSingle&&scope.row.projectAssignPerson==loginUser && scope.row.processState == '项目分配'" @click="transferProject(scope.row)" type="text" size="small">转交分配</el-button>
            <el-button v-if="roleBtnInfo.whiteReport && scope.row.projectDirector == loginUser && scope.row.processState == '填写报告' ? true : false" @click="fillReport(scope.row)" type="text" size="small">填写报告</el-button>
            <el-button v-if="roleBtnInfo.fillSave&&scope.row.processState=='项目归档'" @click="saveDataFileBtn(scope.row)" type="text" size="small">归档</el-button>
            <el-button v-if="scope.row.projectDirector==loginUser&&scope.row.processState=='上传档案补充资料'" @click="uploadSupplementData(scope.row)" type="text" size="small">上传档案补充资料</el-button>
            <el-button v-if="roleBtnInfo.leaderIssue&&userInfo.userRoleNames.indexOf('领导')!=-1&&scope.row.processState=='领导签发'" @click="leaderIssueBtn(scope.row)" type="text" size="small">签发</el-button>
            <el-button v-if="roleBtnInfo.whiteReport&&scope.row.projectDirector == loginUser && scope.row.processState == '填写报告' ? true : false" @click="singleRejectBtn(scope.row)" type="text" size="small">单项工程驳回</el-button>
            <el-button v-if="roleBtnInfo.whiteReport&&scope.row.projectDirector==loginUser&&scope.row.processState=='填写报告'" @click="editCostCreatBtn(scope.row)" type="text" size="small">修改基本信息</el-button>
            <el-button v-if="roleBtnInfo.examineBtnShow&&scope.row.processState=='技术负责人审核'" @click="examineProjectBtn(scope.row)" type="text" size="small">审核</el-button>
        </span>
      </template>
      </el-table-column>
    </el-table>
  </article>
  <footer class="mt-30 cb pagination" v-if="total&&!routerExistence">
    <el-pagination @current-change="projectCurrentChange" :current-page.sync="pageNum" layout="prev, pager, next, jumper" :total="total" class="fr">
    </el-pagination>
    <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{total}}条记录</span>
  </footer>
  <el-dialog :visible.sync="viewProjectDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 造价咨询项目信息</span>
    <div class="dialog-box" v-loading="viewLoading">
      <div class="icms-dialog-content  pr mt-15">
        <nav class="pa">
          项目合同信息
        </nav>
        <el-row :gutter="16">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">咨询合同编号：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{viewProjectData.contractNum}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">咨询合同类型：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.contractType}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">签订情况：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.signStatus}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">咨询合同金额（元）：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.contractMoney}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">收费方式：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.priceMethod}}</div>
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content  pr mt-40">
        <nav class="pa">
          项目基本信息
        </nav>
        <el-row :gutter="16">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">项目名称：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{viewProjectData.projectName}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">工程用途：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.projectWay}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">工程结构：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.projectStructure}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">计量单位：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.unit}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">咨询类型：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.askType}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">工作项目类别：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.workType}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">审核类型：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.approveType}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">委托单位名称：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{viewProjectData.companyName}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">委托单位联系人： </div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.companyPerson}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">委托单位电话：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.companyTel}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">投资性质：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.investmentPropertiesStr}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">工程所在地：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.projectLocation}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">资料收到日期：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.dataReceivedDate}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">登记日期：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.registerDate}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">约定作业完成日期：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{viewProjectData.appointmentDoneDate}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">项目详细要求：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{viewProjectData.projectRequirement}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">技术负责人：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.technologyLeader}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">项目分配人：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.projectDistribution}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">项目经理：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.projectManager}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr color-red">是否上报：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content color-red">{{viewProjectData.isReportProject}}</div>
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content  pr mt-40">
        <nav class="pa">
          建设单位信息
        </nav>
        <el-row :gutter="16">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">建设单位名称：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{viewProjectData.buildName}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">建设单位联系人：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.buildPerson}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">建设单位联系电话：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.buildTel}}</div>
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content pr mt-40" v-if="viewProjectData.workProjectCategory=='4'||viewProjectData.workProjectCategory=='6'">
        <nav class="pa">
          项目送审信息
        </nav>
        <el-row :gutter="16">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">施工单位名称：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{viewProjectData.constructionName}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">送审金额（元）：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.submitPrice}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">施工合同金额（元）：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.constructionPrice}}</div>
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content  pr mt-40" v-if="viewProjectData.workProjectCategory=='4'||viewProjectData.workProjectCategory=='6'">
        <nav class="pa">
          项目审定信息
        </nav>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">送审金额（元）：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.submitInfoPrice}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">合同金额（元）：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.contractPrice}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">审定金额（元）：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.donePrice}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">核减（增）率（%）：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.increaseProbability}}</div>
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content  pr mt-40">
        <nav class="pa">
          项目基本文档
        </nav>
        <div class="color-red f13 pl-5">
          第一次打开,请点击下载并安装<span class="ml-5 mr-5 color-blue"><a href="http://oxjaqeywu.bkt.clouddn.com/posetup.exe">在线编辑客户端</a></span>,再打开此处"编辑"链接
        </div>
        <el-table class="noShadow" :data="viewProjectData.normalFiles" style="width: 100%" highlight-current-row>
          <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
          <el-table-column min-width="180" prop="fileName" label="文件名称"></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button @click="editExcelBtn(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="icms-dialog-content  pr mt-40">
        <nav class="pa">
          档案资料
        </nav>
        <el-table class="noShadow" :data="viewProjectData.infoFiles" style="width: 100%" highlight-current-row>
          <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
          <el-table-column min-width="180" prop="fileName" label="文件名称"></el-table-column>
          <el-table-column prop="fileType" width="90" label="文件类型"></el-table-column>
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
  <!-- 填写报告 -->
  <el-dialog :visible.sync="fillReportDialog" size="small" custom-class="icms-dialog">
    <span slot="title">项目负责人 - 填写报告</span>
    <div class="dialog-box">
      <div class="mb-30 f13 color-red mt-15">
        说明： 确认整个项目的造价信息，如信息不正确则修改；如果信息正确或者不存在此信息则不必填写。
      </div>
      <el-form :model="fillReportData" ref="fillReportData" label-width="185px" :rules="fillReportRules">
        <div class="icms-dialog-content pr p30 mt-5" v-loading="fillLoading">
          <nav class="pa">
            价格确认
          </nav>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="概算价（元）：" class="mt-10 w" prop="estimatePrice">
                <el-input type="number" v-model="fillReportData.estimatePrice" class="w" size="small" placeholder="请输入概算价"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="建安工程造价（元）：" class="mt-10 w" prop="takeCost">
                <el-input type="number" v-model="fillReportData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="送审工程造价（元）：" class="mt-10 w" prop="reviewCost">
                <el-input type="number" v-model="fillReportData.reviewCost" class="w" size="small" placeholder="请输入送审工程造价"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="核减（增）额（元）：" class="mt-10 w" prop="subtractIncreaseFrontal">
                <el-input type="number" v-model="fillReportData.subtractIncreaseFrontal" class="w" size="small" placeholder="请输入核减（增）额"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content pr p30 mt-30" v-loading="fillLoading">
          <nav class="pa">
            项目报告基本信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="投资性质：" class="mt-10 w" prop="investmentProperties">
                <el-select v-model="fillReportData.investmentProperties" size="small" placeholder="请选择投资性质" clearable>
                  <el-option label="国有投资" value="1"></el-option>
                  <el-option label="集体投资" value="2"></el-option>
                  <el-option label="社会投资" value="3"></el-option>
                  <el-option label="其他" value="4"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="咨询类型：" class="mt-10 w" prop="consultingType">
                <el-select v-model="fillReportData.consultingType" size="small" placeholder="请选择咨询类型" clearable>
                  <el-option label="项目经济评价编审" value="1"></el-option>
                  <el-option label="投资估算编审" value="2"></el-option>
                  <el-option label="设计概算编审" value="3"></el-option>
                  <el-option label="工程量清单和招标控制价编审" value="4"></el-option>
                  <el-option label="投标报价编审" value="5"></el-option>
                  <el-option label="工程结算审核" value="6"></el-option>
                  <el-option label="工程造价司法鉴定" value="7"></el-option>
                  <el-option label="工程造价全过程管理与服务" value="8"></el-option>
                  <el-option label="其它" value="9"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="合同类型：" class="mt-10 w" prop="contractType">
                <el-select v-model="fillReportData.contractType" size="small" placeholder="请选择合同类型" clearable>
                  <el-option label="造价咨询合同" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="工程结构：" class="mt-10 w" prop="engineeringStructure">
                <el-select v-model="fillReportData.engineeringStructure" size="small" placeholder="请选择工程结构" clearable>
                  <el-option label="砖木" value="1"></el-option>
                  <el-option label="砖混" value="2"></el-option>
                  <el-option label="框架(现浇)" value="3"></el-option>
                  <el-option label="框架(装配)" value="4"></el-option>
                  <el-option label="框剪" value="5"></el-option>
                  <el-option label="框筒" value="6"></el-option>
                  <el-option label="钢结构" value="7"></el-option>
                  <el-option label="网架" value="8"></el-option>
                  <el-option label="钢筋混凝土路面" value="10"></el-option>
                  <el-option label="沥青混凝土路面" value="11"></el-option>
                  <el-option label="其它" value="12"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="地上层数：" class="mt-10 w" prop="upperNumber">
                <el-input type="number" v-model="fillReportData.upperNumber" class="w" size="small" placeholder="请输入地上层数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="地下层数：" class="mt-10 w" prop="undergroundNumber">
                <el-input type="number" v-model="fillReportData.undergroundNumber" class="w" size="small" placeholder="请输入地下层数"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="16">
              <el-form-item label="建筑面积或规模：" class="mt-10 w" prop="constructionAreaOrSize">
                <el-input type="number" v-model="fillReportData.constructionAreaOrSize" class="w" size="small" placeholder="请输入建筑面积或规模"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="8">
              <el-select class="mt-10" v-model="fillReportData.measurementUnit" size="small" placeholder="请选择计量单位">
                <el-option label="m2" value="1"></el-option>
                <el-option label="m3" value="2"></el-option>
                <el-option label="m" value="3"></el-option>
                <el-option label="km" value="4"></el-option>
                <el-option label="t" value="5"></el-option>
                <el-option label="座" value="6"></el-option>
                <el-option label="项" value="7"></el-option>
                <el-option label="其它" value="8"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="工程用途：" class="mt-10 w" prop="engineeringPurpose">
                <el-select v-model="fillReportData.engineeringPurpose" size="small" placeholder="请选择工程用途" clearable>
                  <el-option label="住宅建筑" value="1"></el-option>
                  <el-option label="办公建筑" value="2"></el-option>
                  <el-option label="教学科研建筑" value="3"></el-option>
                  <el-option label="医疗建筑" value="4"></el-option>
                  <el-option label="场馆建筑" value="5"></el-option>
                  <el-option label="宾馆建筑" value="6"></el-option>
                  <el-option label="商场建筑" value="7"></el-option>
                  <el-option label="工业建筑" value="8"></el-option>
                  <el-option label="仓储建筑" value="9"></el-option>
                  <el-option label="市政道路" value="10"></el-option>
                  <el-option label="市政桥涵" value="11"></el-option>
                  <el-option label="市政管网" value="12"></el-option>
                  <el-option label="市政隧道" value="13"></el-option>
                  <el-option label="仿古园林" value="14"></el-option>
                  <el-option label="房屋修缮" value="15"></el-option>
                  <el-option label="水利工程" value="16"></el-option>
                  <el-option label="交通工程" value="17"></el-option>
                  <el-option label="电力工程" value="18"></el-option>
                  <el-option label="通讯工程" value="19"></el-option>
                  <el-option label="其它" value="20"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="作业完成出具报告日期：" class="mt-10 w" prop="reportDateStr">
                <el-date-picker :editable="false" v-model="fillReportData.reportDateStr" type="date" placeholder="请选择日期" clearable></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="16">
              <el-form-item label="报告编号：" class="mt-10 w" prop="reportNumbers">
                <el-input readonly v-model="fillReportData.reportNumbers" class="w" size="small" placeholder="请输入报告编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="8" class="cb">
              <el-button @click="fillNumAdd" class="f24 mt-5 color-green mr-15 fl" type="text">+</el-button>
              <el-button @click="fillNumMinus" class="f32 color-green mt-2 fl" type="text">-</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="16">
              <el-form-item label="报告内容简要：" class="mt-10 w" prop="reportContentBriefly">
                <el-input type="textarea" v-model="fillReportData.reportContentBriefly" class="w" size="small" placeholder="请输入报告内容简要"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content pr p30 mt-30" v-loading="fillLoading">
          <nav class="pa">
            归档资料确认
          </nav>
          <el-row :gutter="16">
            <el-col :sm="24">
              <el-form-item label="归档内容（请在方框内打“√”）：" class="mt-10 w oa" prop="archiveContent">
                <el-checkbox-group v-model="fillReportData.archiveContent" v-if="fillReportData.workType == '1' || fillReportData.workType == '2' || fillReportData.workType == '3' || fillReportData.workType == '7' || fillReportData.workType == '5' || fillReportData.workType == '8' ? true : false">
                  <el-checkbox label="业务报告审批表"></el-checkbox><br/>
                  <el-checkbox label="标底（概、预算、清单）编制报告（含签发人底稿）"></el-checkbox><br/>
                  <el-checkbox label="技术文件及工作底稿（各类分析说明文件、计算书、工料分析表等）"></el-checkbox><br/>
                  <el-checkbox label="委托方提供资料清单（清单应注明委托单位名称及项目名称）"></el-checkbox><br/>
                  <el-checkbox label="工程招标文件（含工程量清单）"></el-checkbox><br/>
                  <el-checkbox label="设计交底纪要"></el-checkbox><br/>
                  <el-checkbox label="招标答疑"></el-checkbox><br/>
                  <el-checkbox label="会议纪要、文函"></el-checkbox><br/>
                  <el-checkbox label="工程量清单计价备案表"></el-checkbox><br/>
                  <el-checkbox label="其他相关材料：各种调查材料、采集数据、取证资料等"></el-checkbox><br/>
                  <el-checkbox label="工程造价咨询合同或司法鉴定委托书"></el-checkbox><br/>
                  <el-checkbox label="咨询企业作业计划书或全过程造价咨询实施规划及细则"></el-checkbox><br/>
                  <el-checkbox label="工程造价咨询质量控制流程单"></el-checkbox><br/>
                  <el-checkbox label="江苏省建设项目工程造价咨询效果评价表。【500万以上项目提供】"></el-checkbox><br/>
                  <el-checkbox label="其他资料"></el-checkbox><br/>
                  <el-checkbox label="图纸是否归还"></el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="fillReportData.archiveContent" v-if="fillReportData.workType == '4' || fillReportData.workType == '6' || fillReportData.workType == '9' ? true : false">
                  <el-checkbox label="业务报告审批表"></el-checkbox><br/>
                  <el-checkbox label="签发人签发的报告书底稿"></el-checkbox><br/>
                  <el-checkbox label="技术文件及工作底稿（各类分析说明文件、计算书、工料分析表等）"></el-checkbox><br/>
                  <el-checkbox label="委托方提供资料清单（清单应注明委托单位名称及项目名称）"></el-checkbox><br/>
                  <el-checkbox label="工程招标文件（含工程量清单）"></el-checkbox><br/>
                  <el-checkbox label="招标控制价"></el-checkbox><br/>
                  <el-checkbox label="招标答疑"></el-checkbox><br/>
                  <el-checkbox label="投标报价"></el-checkbox><br/>
                  <el-checkbox label="结算编审"></el-checkbox><br/>
                  <el-checkbox label="投标文件"></el-checkbox><br/>
                  <el-checkbox label="中标通知书"></el-checkbox><br/>
                  <el-checkbox label="工程承包合同（与造价有关的重要条款）"></el-checkbox><br/>
                  <el-checkbox label="送审工程概算、预算、结（决）算书"></el-checkbox><br/>
                  <el-checkbox label="设计变更单"></el-checkbox><br/>
                  <el-checkbox label="施工签证（结算编审）"></el-checkbox><br/>
                  <el-checkbox label="工程竣工验收凭证（结算编审）"></el-checkbox><br/>
                  <el-checkbox label="会议纪要、文函"></el-checkbox><br/>
                  <el-checkbox label="安全文明施工措施费测定表（结算审核）"></el-checkbox><br/>
                  <el-checkbox label="其他相关材料：各种调查材料、采集数据、取证资料等"></el-checkbox><br/>
                  <el-checkbox label="工程造价咨询质量控制流程单"></el-checkbox><br/>
                  <el-checkbox label="工程造价咨询重大问题会审纪要"></el-checkbox><br/>
                  <el-checkbox label="江苏省建设项目工程造价咨询效果评价表。【500万以上项目提供】"></el-checkbox><br/>
                  <el-checkbox label="其他资料"></el-checkbox><br/>
                  <el-checkbox label="图纸是否归还"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="16">
              <el-form-item label="归档说明：" class="mt-10 w" prop="archiveInstructions">
                <el-input type="textarea" v-model="fillReportData.archiveInstructions" class="w" size="small" placeholder="请输入归档说明"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="16">
              <el-form-item label="档案管理员：" class="mt-10 w" prop="archivesManager">
                <el-select v-model="fillReportData.archivesManager" size="small" placeholder="请选择档案管理员" clearable>
                  <el-option v-for="item in fillReportData.archivesManagerData" :key="item.userName" :label="item.userName" :value="item.userName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content pr p30 mt-30" v-loading="fillLoading">
          <nav class="pa">
            附件信息
          </nav>
          <el-table class="noShadow" :data="fillReportData.files" style="width: 100%">
            <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
            <el-table-column min-width="170" prop="fileName" label="文件名称"></el-table-column>
            <el-table-column prop="createTimeStr" width="170" label="上传时间"></el-table-column>
            <el-table-column prop="createUser" width="100" label="上传人"></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button @click="delFillFile(scope.row,scope.$index)" class="color-green" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
          </el-table>
          <el-upload class="upload-file w mt-10 bt-1 pt-30" ref="upload" :on-remove="uploadFillRemove" :on-error="fileError" :on-success="uploadFillSuccess" drag action="icms/cost/project/upload" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="mt-20 f13 color-red">
          友情提醒：报告填写完成后，先保存，确保资料存档，然后项目结束提交至归档
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoadingSubmit" v-show="fillReportData.submitSetInfoShow" class="btn-blue shadow" type="primary" @click='submitSetInfo("fillReportData")'><i class="iconfont icon-tijiao2 f14 mr-5"></i>项目结束</el-button>
          <el-button :loading="buttonLoading" class="btn-orange shadow" type="primary" @click='saveFillReport("fillReportData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='fillReportDialog = false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 新增造价咨询 -->
  <el-dialog :visible.sync="creatNew" size="small" custom-class="icms-dialog">
    <span slot="title">新增 - 造价咨询项目信息</span>
    <div class="dialog-box">
      <el-form :model="newProjectData" ref="newProjectData" :inline="true" label-width="35%" :rules="newProjectRules">
        <div class="icms-dialog-content pr p30">
          <nav class="pa">
            项目合同信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="咨询合同编号：" class="mt-10 w creat-new-form" prop="contractNumber">
                <el-input v-model="newProjectData.contractNumber" class="w" size="small" placeholder="请输入咨询合同编号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="咨询合同类型：" class="mt-10 w creat-new-form" prop="contractType">
                <el-select v-model="newProjectData.contractType" size="mini" placeholder="请选择咨询合同类型">
                  <el-option label="造价资讯合同" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="签订情况：" class="mt-10 w creat-new-form" prop="contractStatus">
                <el-select size="mini" v-model="newProjectData.contractStatus" placeholder="请选择签订情况">
                  <el-option label="签订" value="签订"></el-option>
                  <el-option label="未签" value="未签"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="咨询合同金额（元）：" class="mt-10 w creat-new-form" prop="contractAmount">
                <el-input v-model="newProjectData.contractAmount" class="w" size="small" placeholder="请输入咨询合同金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="收费方式：" class="mt-10 w creat-new-form" prop="contractPaymentMethod">
                <el-radio class="radio" v-model="newProjectData.contractPaymentMethod" label="按百分比">按百分比</el-radio>
                <el-radio class="radio" v-model="newProjectData.contractPaymentMethod" label="固定价">固定价</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content pr mt-40">
          <nav class="pa">
            项目基本信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="项目名称：" class="mt-10 w creat-new-form" prop="projectName">
                <el-input class="w" v-model="newProjectData.projectName" size="small" placeholder="请输入项目名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="工程用途：" class="mt-10 w creat-new-form" prop="engineeringPurpose">
                <el-select size="mini" v-model="newProjectData.engineeringPurpose" placeholder="请选择工程用途" clearable>
                  <el-option label="住宅建筑" value="1"></el-option>
                  <el-option label="办公建筑" value="2"></el-option>
                  <el-option label="教学科研建筑" value="3"></el-option>
                  <el-option label="医疗建筑" value="4"></el-option>
                  <el-option label="场馆建筑" value="5"></el-option>
                  <el-option label="宾馆建筑" value="6"></el-option>
                  <el-option label="商场建筑" value="7"></el-option>
                  <el-option label="工业建筑" value="8"></el-option>
                  <el-option label="仓储建筑" value="9"></el-option>
                  <el-option label="市政道路" value="10"></el-option>
                  <el-option label="市政桥涵" value="11"></el-option>
                  <el-option label="市政管网" value="12"></el-option>
                  <el-option label="市政隧道" value="13"></el-option>
                  <el-option label="仿古园林" value="14"></el-option>
                  <el-option label="房屋修缮" value="15"></el-option>
                  <el-option label="水利工程" value="16"></el-option>
                  <el-option label="交通工程" value="17"></el-option>
                  <el-option label="电力工程" value="18"></el-option>
                  <el-option label="通讯工程" value="19"></el-option>
                  <el-option label="其它" value="20"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="工程结构：" class="mt-10 w creat-new-form" prop="engineeringStructure">
                <el-select size="mini" v-model="newProjectData.engineeringStructure" placeholder="请选择工程结构" clearable>
                  <el-option label="砖木" value="1"></el-option>
                  <el-option label="砖混" value="2"></el-option>
                  <el-option label="框架(现浇)" value="3"></el-option>
                  <el-option label="框架(装配)" value="4"></el-option>
                  <el-option label="框剪" value="5"></el-option>
                  <el-option label="框筒" value="6"></el-option>
                  <el-option label="钢结构" value="7"></el-option>
                  <el-option label="网架" value="8"></el-option>
                  <el-option label="钢筋混凝土路面" value="10"></el-option>
                  <el-option label="沥青混凝土路面" value="11"></el-option>
                  <el-option label="其它" value="12"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="计量单位：" class="mt-10 w creat-new-form" prop="measurementUnit">
                <el-select size="mini" v-model="newProjectData.measurementUnit" placeholder="请选择计量单位">
                  <el-option label="m2" value="1"></el-option>
                  <el-option label="m3" value="2"></el-option>
                  <el-option label="m" value="3"></el-option>
                  <el-option label="km" value="4"></el-option>
                  <el-option label="t" value="5"></el-option>
                  <el-option label="座" value="6"></el-option>
                  <el-option label="项" value="7"></el-option>
                  <el-option label="其它" value="8"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="咨询类型：" class="mt-10 w creat-new-form" prop="consultingType">
                <el-select size="mini" v-model="newProjectData.consultingType" placeholder="请选择咨询类型">
                  <el-option label="项目经济评价编审" value="1"></el-option>
                  <el-option label="投资估算编审" value="2"></el-option>
                  <el-option label="设计概算编审" value="3"></el-option>
                  <el-option label="工程量清单和招标控制价编审" value="4"></el-option>
                  <el-option label="投标报价编审" value="5"></el-option>
                  <el-option label="工程结算审核" value="6"></el-option>
                  <el-option label="工程造价司法鉴定" value="7"></el-option>
                  <el-option label="工程造价全过程管理与服务" value="8"></el-option>
                  <el-option label="其它" value="9"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="工作项目类别：" class="mt-10 w creat-new-form" prop="workProjectCategory">
                <el-select clearable @change="changeWorkProjectCategory" size="mini" v-model="newProjectData.workProjectCategory" placeholder="请选择工作项目类别">
                  <el-option label="标底编制" value="1"></el-option>
                  <el-option label="标底编制（全过程）" value="2"></el-option>
                  <el-option label="材料设备询价" value="3"></el-option>
                  <el-option label="结算审核" value="4"></el-option>
                  <el-option label="预算编制" value="5"></el-option>
                  <el-option label="内审" value="6"></el-option>
                  <el-option label="标底（零星）" value="7"></el-option>
                  <el-option label="清单编制" value="8"></el-option>
                  <el-option label="全过程" value="9"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="审核类型：" class="mt-10 w creat-new-form" prop="approveType" v-if="approveTypeStatus">
                <el-select clearable size="mini" v-model="newProjectData.approveType" placeholder="请选择审核类型">
                  <el-option v-for="item in approveTypeData" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="委托单位名称：" class="mt-10 w creat-new-form" prop="delegateUnitName">
                <el-input v-model="newProjectData.delegateUnitName" class="w" size="small" placeholder="请输入委托单位名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="委托单位联系人：" class="mt-10 w creat-new-form" prop="delegateUnitContact">
                <el-input v-model="newProjectData.delegateUnitContact" class="w" size="small" placeholder="请输入委托单位联系人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="委托单位电话：" class="mt-10 w creat-new-form" prop="delegateUnitPhone">
                <el-input type="text" v-model="newProjectData.delegateUnitPhone" class="w" size="small" placeholder="请输入委托单位电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="投资性质：" class="mt-10 w creat-new-form" prop="investmentProperties">
                <el-select size="mini" v-model="newProjectData.investmentProperties" placeholder="请选择投资性质">
                  <el-option label="国有投资" value="1"></el-option>
                  <el-option label="集体投资" value="2"></el-option>
                  <el-option label="社会投资" value="3"></el-option>
                  <el-option label="其它" value="4"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="工程所在地：" class="mt-10 w creat-new-form" prop="projectLocation">
                <el-input v-model="newProjectData.projectLocation" class="w" size="small" placeholder="请输入工程所在地"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="资料收到日期：" class="mt-10 w creat-new-form" prop="informationReceivedDateStr">
                <el-date-picker :editable="false" v-model="newProjectData.informationReceivedDateStr" size="mini" type="date" placeholder="选择资料收到日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="登记日期：" class="mt-10 w creat-new-form" prop="enrollmentDateStr">
                <el-date-picker :editable="false" v-model="newProjectData.enrollmentDateStr" size="mini" type="date" placeholder="选择登记日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="约定作业完成日期：" class="mt-10 w creat-new-form" prop="agreedJobCompletionDateStr">
                <el-date-picker :editable="false" v-model="newProjectData.agreedJobCompletionDateStr" size="mini" type="date" placeholder="选择约定作业完成日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="项目详细要求：" class="mt-10 w creat-new-form" prop="projectDetailRequirements">
                <el-input v-model="newProjectData.projectDetailRequirements" type="textarea" :rows="2" placeholder="请输入项目详细要求"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="技术负责人：" class="mt-10 w creat-new-form" prop="technicalDirector">
                <el-select v-model="newProjectData.technicalDirector" size="mini" placeholder="请选择技术负责人">
                  <el-option v-for="item in technicalDirector" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="项目分配人：" class="mt-10 w creat-new-form" prop="projectAssignPerson">
                <el-select size="mini" v-model="newProjectData.projectAssignPerson" placeholder="请选择项目分配人">
                  <el-option v-for="item in distributionUser" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            建设单位信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="建设单位名称：" class="mt-10 w creat-new-form" prop="unitName">
                <el-input v-model="newProjectData.unitName" class="w" size="small" placeholder="请输入建设单位名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="建设单位联系人：" class="mt-10 w creat-new-form" prop="unitContact">
                <el-input v-model="newProjectData.unitContact" class="w" size="small" placeholder="请输入建设单位联系人"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="建设单位联系电话：" class="mt-10 w creat-new-form" prop="unitPhone">
                <el-input v-model="newProjectData.unitPhone" class="w" size="small" placeholder="请输入建设单位联系电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content  pr mt-40" v-if="newProjectData.forCheckedShow">
          <nav class="pa">
            项目送审信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="施工单位名称：" class="mt-10 w creat-new-form" prop="unitName">
                <el-input v-model="newProjectData.constructionUnitName" class="w" size="small" placeholder="请输入施工单位名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="送审金额（元）：" class="mt-10 w creat-new-form" prop="unitContact">
                <el-input type="number" v-model="newProjectData.reviewAmount" class="w" size="small" placeholder="请输入送审金额"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="施工合同金额（元）：" class="mt-10 w creat-new-form" prop="unitPhone">
                <el-input type="number" v-model="newProjectData.contractEstimationPrice" class="w" size="small" placeholder="请输入施工合同金额"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            工作要求附件
          </nav>
          <el-upload class="upload-file w mt-10" ref="upload" :on-remove="uploadRemove" :on-error="fileError" :on-success="uploadSuccess" drag action="icms/cost/project/upload" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoadingSubmit" class="btn-blue shadow" type="primary" @click='submitNewProject("newProjectData")'><i class="iconfont icon-tijiao2 f14 mr-5"></i>提 交</el-button>
          <el-button :loading="buttonLoading" class="btn-orange shadow" type="primary" @click='saveNewProject("newProjectData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='resetForm("newProjectData")'><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 修改造价咨询 -->
  <el-dialog :visible.sync="editCostCreatDialog" size="small" custom-class="icms-dialog">
    <span slot="title">修改 - 造价咨询项目信息</span>
    <div class="dialog-box">
      <el-form :model="editProjectData" ref="editProjectData" :inline="true" label-width="35%" :rules="newProjectRules">
        <div class="icms-dialog-content pr p30">
          <nav class="pa">
            项目合同信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="咨询合同编号：" class="mt-10 w creat-new-form" prop="contractNumber">
                <el-input v-model="editProjectData.contractNumber" class="w" size="small" placeholder="请输入咨询合同编号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="咨询合同类型：" class="mt-10 w creat-new-form" prop="contractType">
                <el-select v-model="editProjectData.contractType" size="mini" placeholder="请选择咨询合同类型">
                  <el-option label="造价资讯合同" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="签订情况：" class="mt-10 w creat-new-form" prop="contractStatus">
                <el-select size="mini" v-model="editProjectData.contractStatus" placeholder="请选择签订情况">
                  <el-option label="签订" value="签订"></el-option>
                  <el-option label="未签" value="未签"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="咨询合同金额（元）：" class="mt-10 w creat-new-form" prop="contractAmount">
                <el-input v-model="editProjectData.contractAmount" class="w" size="small" placeholder="请输入咨询合同金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="收费方式：" class="mt-10 w creat-new-form" prop="contractPaymentMethod">
                <el-radio class="radio" v-model="editProjectData.contractPaymentMethod" label="按百分比">按百分比</el-radio>
                <el-radio class="radio" v-model="editProjectData.contractPaymentMethod" label="固定价">固定价</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content pr mt-40">
          <nav class="pa">
            项目基本信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="项目名称：" class="mt-10 w creat-new-form" prop="projectName">
                <el-input class="w" v-model="editProjectData.projectName" size="small" placeholder="请输入项目名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="工程用途：" class="mt-10 w creat-new-form" prop="engineeringPurpose">
                <el-select size="mini" v-model="editProjectData.engineeringPurpose" placeholder="请选择工程用途" clearable>
                  <el-option label="住宅建筑" value="1"></el-option>
                  <el-option label="办公建筑" value="2"></el-option>
                  <el-option label="教学科研建筑" value="3"></el-option>
                  <el-option label="医疗建筑" value="4"></el-option>
                  <el-option label="场馆建筑" value="5"></el-option>
                  <el-option label="宾馆建筑" value="6"></el-option>
                  <el-option label="商场建筑" value="7"></el-option>
                  <el-option label="工业建筑" value="8"></el-option>
                  <el-option label="仓储建筑" value="9"></el-option>
                  <el-option label="市政道路" value="10"></el-option>
                  <el-option label="市政桥涵" value="11"></el-option>
                  <el-option label="市政管网" value="12"></el-option>
                  <el-option label="市政隧道" value="13"></el-option>
                  <el-option label="仿古园林" value="14"></el-option>
                  <el-option label="房屋修缮" value="15"></el-option>
                  <el-option label="水利工程" value="16"></el-option>
                  <el-option label="交通工程" value="17"></el-option>
                  <el-option label="电力工程" value="18"></el-option>
                  <el-option label="通讯工程" value="19"></el-option>
                  <el-option label="其它" value="20"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="工程结构：" class="mt-10 w creat-new-form" prop="engineeringStructure">
                <el-select size="mini" v-model="editProjectData.engineeringStructure" placeholder="请选择工程结构" clearable>
                  <el-option label="砖木" value="1"></el-option>
                  <el-option label="砖混" value="2"></el-option>
                  <el-option label="框架(现浇)" value="3"></el-option>
                  <el-option label="框架(装配)" value="4"></el-option>
                  <el-option label="框剪" value="5"></el-option>
                  <el-option label="框筒" value="6"></el-option>
                  <el-option label="钢结构" value="7"></el-option>
                  <el-option label="网架" value="8"></el-option>
                  <el-option label="钢筋混凝土路面" value="10"></el-option>
                  <el-option label="沥青混凝土路面" value="11"></el-option>
                  <el-option label="其它" value="12"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="计量单位：" class="mt-10 w creat-new-form" prop="measurementUnit">
                <el-select size="mini" v-model="editProjectData.measurementUnit" placeholder="请选择计量单位">
                  <el-option label="m2" value="1"></el-option>
                  <el-option label="m3" value="2"></el-option>
                  <el-option label="m" value="3"></el-option>
                  <el-option label="km" value="4"></el-option>
                  <el-option label="t" value="5"></el-option>
                  <el-option label="座" value="6"></el-option>
                  <el-option label="项" value="7"></el-option>
                  <el-option label="其它" value="8"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="咨询类型：" class="mt-10 w creat-new-form" prop="consultingType">
                <el-select size="mini" v-model="editProjectData.consultingType" placeholder="请选择咨询类型">
                  <el-option label="项目经济评价编审" value="1"></el-option>
                  <el-option label="投资估算编审" value="2"></el-option>
                  <el-option label="设计概算编审" value="3"></el-option>
                  <el-option label="工程量清单和招标控制价编审" value="4"></el-option>
                  <el-option label="投标报价编审" value="5"></el-option>
                  <el-option label="工程结算审核" value="6"></el-option>
                  <el-option label="工程造价司法鉴定" value="7"></el-option>
                  <el-option label="工程造价全过程管理与服务" value="8"></el-option>
                  <el-option label="其它" value="9"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="工作项目类别：" class="mt-10 w creat-new-form" prop="workProjectCategory">
                <el-select disabled size="mini" v-model="editProjectData.workProjectCategory" placeholder="请选择工作项目类别">
                  <el-option label="标底编制" value="1"></el-option>
                  <el-option label="标底编制（全过程）" value="2"></el-option>
                  <el-option label="材料设备询价" value="3"></el-option>
                  <el-option label="结算审核" value="4"></el-option>
                  <el-option label="预算编制" value="5"></el-option>
                  <el-option label="内审" value="6"></el-option>
                  <el-option label="标底（零星）" value="7"></el-option>
                  <el-option label="清单编制" value="8"></el-option>
                  <el-option label="全过程" value="9"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="审核类型：" class="mt-10 w creat-new-form" prop="approveType" v-if="editProjectData.approveType">
                <el-select disabled clearable size="mini" v-model="editProjectData.approveType" placeholder="请选择审核类型">
                  <el-option v-for="item in approveTypeData" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="委托单位名称：" class="mt-10 w creat-new-form" prop="delegateUnitName">
                <el-input v-model="editProjectData.delegateUnitName" class="w" size="small" placeholder="请输入委托单位名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="委托单位联系人：" class="mt-10 w creat-new-form" prop="delegateUnitContact">
                <el-input v-model="editProjectData.delegateUnitContact" class="w" size="small" placeholder="请输入委托单位联系人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="委托单位电话：" class="mt-10 w creat-new-form" prop="delegateUnitPhone">
                <el-input v-model="editProjectData.delegateUnitPhone" class="w" size="small" placeholder="请输入委托单位电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="投资性质：" class="mt-10 w creat-new-form" prop="investmentProperties">
                <el-select size="mini" v-model="editProjectData.investmentProperties" placeholder="请选择投资性质">
                  <el-option label="国有投资" value="1"></el-option>
                  <el-option label="集体投资" value="2"></el-option>
                  <el-option label="社会投资" value="3"></el-option>
                  <el-option label="其它" value="4"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="工程所在地：" class="mt-10 w creat-new-form" prop="projectLocation">
                <el-input v-model="editProjectData.projectLocation" class="w" size="small" placeholder="请输入委托单位电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="资料收到日期：" class="mt-10 w creat-new-form" prop="informationReceivedDateStr">
                <el-date-picker :editable="false" v-model="editProjectData.informationReceivedDateStr" size="mini" type="date" placeholder="选择资料收到日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="登记日期：" class="mt-10 w creat-new-form" prop="enrollmentDateStr">
                <el-date-picker :editable="false" v-model="editProjectData.enrollmentDateStr" size="mini" type="date" placeholder="选择登记日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="约定作业完成日期：" class="mt-10 w creat-new-form" prop="agreedJobCompletionDateStr">
                <el-date-picker :editable="false" v-model="editProjectData.agreedJobCompletionDateStr" size="mini" type="date" placeholder="选择资料收到日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="项目详细要求：" class="mt-10 w creat-new-form" prop="projectDetailRequirements">
                <el-input v-model="editProjectData.projectDetailRequirements" type="textarea" :rows="2" placeholder="请输入项目详细要求"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="技术负责人：" class="mt-10 w creat-new-form" prop="technicalDirector">
                <el-select v-model="editProjectData.technicalDirector" size="mini" placeholder="请选择技术负责人">
                  <el-option v-for="item in technicalDirector" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="项目分配人：" class="mt-10 w creat-new-form" prop="projectAssignPerson">
                <el-select size="mini" v-model="editProjectData.projectAssignPerson" placeholder="请选择项目分配人">
                  <el-option v-for="item in distributionUser" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            建设单位信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="建设单位名称：" class="mt-10 w creat-new-form" prop="unitName">
                <el-input v-model="editProjectData.unitName" class="w" size="small" placeholder="请输入委托单位电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="建设单位联系人：" class="mt-10 w creat-new-form" prop="unitContact">
                <el-input v-model="editProjectData.unitContact" class="w" size="small" placeholder="请输入建设单位联系人"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="建设单位联系电话：" class="mt-10 w creat-new-form" prop="unitPhone">
                <el-input type="number" v-model="editProjectData.unitPhone" class="w" size="small" placeholder="请输入建设单位联系电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content  pr mt-40" v-if="editProjectData.forCheckedShow">
          <nav class="pa">
            项目送审信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="施工单位名称：" class="mt-10 w creat-new-form" prop="unitName">
                <el-input v-model="editProjectData.constructionUnitName" class="w" size="small" placeholder="请输入施工单位名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="送审金额（元）：" class="mt-10 w creat-new-form" prop="unitContact">
                <el-input type="number" v-model="editProjectData.reviewAmount" class="w" size="small" placeholder="请输入送审金额"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="施工合同金额（元）：" class="mt-10 w creat-new-form" prop="unitPhone">
                <el-input type="number" v-model="editProjectData.contractEstimationPrice" class="w" size="small" placeholder="请输入施工合同金额"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            工作要求附件
          </nav>
          <el-table class="noShadow" :data="editProjectData.files" style="width: 100%">
            <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
            <el-table-column min-width="170" prop="fileName" label="文件名称"></el-table-column>
            <el-table-column prop="createTimeStr" width="170" label="上传时间"></el-table-column>
            <el-table-column prop="createUser" width="100" label="上传人"></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button @click="delFillFile(scope.row,scope.$index)" class="color-green" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
          </el-table>
          <el-upload class="upload-file w mt-10" ref="upload" :on-remove="uploadRemove" :on-error="fileError" :on-success="uploadSuccess" drag action="icms/cost/project/upload" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button v-if="editProjectData.processState=='项目登记'" :loading="buttonLoadingSubmit" class="btn-blue shadow mt-15" type="primary" @click='submitEditProject("editProjectData")'><i class="iconfont icon-tijiao2 f14 mr-5"></i>提 交</el-button>
          <el-button :loading="buttonLoading" class="btn-orange shadow mt-15" type="primary" @click='saveEditProject("editProjectData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow mt-15" @click='editCostCreatDialog=false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <el-dialog :visible.sync="projectProgressDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 工程进度信息</span>
    <div class="dialog-box">
      <div class="icms-dialog-content pr p15">
        <nav class="pa">
          项目基本信息
        </nav>
        <el-row :gutter="16">
          <el-col :sm="9">
            项目名称：{{progressData.mainData.projectName}}
          </el-col>
          <el-col :sm="8">
            项目登记员：{{progressData.mainData.createUser}}
          </el-col>
          <el-col :sm="7">
            项目负责人：{{progressData.mainData.projectDirector}}
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :sm="9">
            工作项目类别： {{progressData.mainData.workProjectCategoryStr}}
          </el-col>
          <el-col :sm="8">
            项目分配人： {{progressData.mainData.projectAssignPerson}}
          </el-col>
          <el-col :sm="7">
            领导： {{progressData.mainData.lead}}
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :sm="9">
            审核类型： {{progressData.mainData.approveType}}
          </el-col>
          <el-col :sm="8">
            技术负责人： {{progressData.mainData.technicalDirector}}
          </el-col>
          <el-col :sm="7">
            档案管理员：{{progressData.mainData.archivesManager}}
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :sm="24">
            项目经理： {{progressData.mainData.projectManager}}
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content pr mt-40">
        <nav class="pa">
          项目主流程进度信息
        </nav>
        <el-row :gutter="16">
          <el-col :sm="24">
            <el-steps class="oa pl-10" :space="100" :active="progressData.mainData.processState" finish-status="success" :align-center="true" :center="true">
              <el-step title="项目登记"></el-step>
              <el-step title="项目分配"></el-step>
              <el-step title="单项工程审核"></el-step>
              <el-step title="技术负责人审核"></el-step>
              <el-step title="领导签发"></el-step>
              <el-step title="填写报告"></el-step>
              <el-step title="项目归档"></el-step>
              <el-step title="上传档案补充资料"></el-step>
              <el-step title="完成"></el-step>
            </el-steps>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content  pr mt-40" v-loading="progressLoading.history">
        <nav class="pa">
          项目主流程历史信息
        </nav>
        <el-table class="noShadow" :data="progressData.history" style="width: 100%">
          <el-table-column prop="processState" width="130" label="处理步骤" align="left"></el-table-column>
          <el-table-column prop="processor" width="100" label="处理人"></el-table-column>
          <el-table-column prop="processTimeStr" width="200" label="处理时间"></el-table-column>
          <el-table-column prop="processResult" min-width="190" label="处理结果"></el-table-column>
          <el-table-column label="处理意见" width="200">
            <template slot-scope="scope">
              {{scope.row.processOpinion?scope.row.processOpinion:"--"}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="icms-dialog-content  pr mt-40" v-loading="progressLoading.children">
        <nav class="pa">
          项目子流程进度信息
        </nav>
        <el-table class="noShadow" :data="progressData.children" style="width: 100%">
          <el-table-column width="180" label="单项工程名称" align="left">
            <template slot-scope="scope">
              <el-popover placement="right" trigger="click" width="900" popper-class="single-dialog icms-dialog">
                <single-project :singleData="singleData"></single-project> <!-- 单项工程组件 -->
                <span @click="showSingleData(scope.row)" class="cp color-green" slot="reference">{{scope.row.name}}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="professional" width="110" label="所属专业"></el-table-column>
          <el-table-column prop="consultant" width="100" label="专业咨询员"></el-table-column>
          <el-table-column width="110" prop="reviewer" label="复核人"></el-table-column>
          <el-table-column min-width="170" label="流程状态" align="left">
            <template slot-scope="scope">
                <el-steps :space="132" class="mt-10 ml-10 oa hidden-xs pl-20" :active="scope.row.processStateString" finish-status="success" :align-center="false">
                  <el-step v-for="item in scope.row.stepData" key="null" :title="item"></el-step>
                </el-steps>
                <span class="hide show-xs">
                  {{scope.row.processState}}
                </span>
              </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
  <el-dialog :visible.sync="transferDialog" size="tiny" custom-class="icms-dialog">
    <span slot="title">转交分配</span>
    <div class="dialog-box p15">
      <el-form :model="transferData" ref="transferData" :inline="true" label-width="25%">
        <el-row :gutter="16">
          <el-col :sm="24">
            <el-form-item label="处理意见：" class="mt-10 w creat-new-form" prop="opinions">
              <el-input type="textarea" v-model="transferData.opinions" class="w" size="small" placeholder="请输入处理意见"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :sm="24">
            <el-form-item label="项目分配人：" class="mt-10 w creat-new-form" prop="distribution">
              <el-select class="w" v-model="transferData.distribution" size="mini" placeholder="请选择项目分配人">
                <el-option v-for="item in distributionUser" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="dialog-footer tc mt-30">
          <el-button class="btn-blue shadow" type="primary" @click='confirmTransfer("transferData")'><i class="iconfont icon-tijiao2 f14 mr-5"></i>确 定</el-button>
          <el-button class="btn-white shadow" @click='transferDialog = false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 分配单项工程  -->
  <el-dialog :visible.sync="distributeSingleDialog" size="small" custom-class="icms-dialog">
    <span slot="title">新增 - 单项工程信息</span>
    <div class="dialog-box">
      <el-form :model="distributeData" ref="distributeData" label-position="right" label-width="170px" :rules="distributeRules">
        <div class="icms-dialog-content pr p15">
          <nav class="pa">
            项目基本信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="24">
              <el-form-item label="单项工程名称：" class="mt-10 w" prop="singleName">
                <el-input v-model="distributeData.singleName" class="w" size="small" placeholder="请输入单项工程名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="所属专业：" class="mt-10 w" prop="contractType">
                <el-select @change="changeProfessional" v-model="distributeData.professional" size="mini" placeholder="请选择所属专业">
                  <el-option label="土建" value="土建"></el-option>
                  <el-option label="装饰" value="装饰"></el-option>
                  <el-option label="安装" value="安装"></el-option>
                  <el-option label="市政" value="市政"></el-option>
                  <el-option label="钢筋" value="钢筋"></el-option>
                  <el-option label="景观绿化" value="景观绿化"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="专业咨询员：" class="mt-10 w" prop="contractStatus">
                <el-select size="mini" v-model="distributeData.consultant" placeholder="请选择专业咨询员" filterable>
                  <el-option v-for="item in distributeData.userData" :key="item.userName" :label="item.userName" :value="item.userName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16" v-show="distributeData.constructionContentData.length == 0 ? false : true">
            <el-col :sm="24">
              <el-form-item label="包含内容：" class="mt-10 w" prop="delegateUnitName">
                <el-checkbox-group v-model="distributeData.constructionContent">
                  <el-checkbox v-for="item in distributeData.constructionContentData" :key="item" :label="item">{{item}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16" v-if="distributeData.approveType=='既做清单又做标底'">
            <el-col :sm="24">
              <el-form-item label="是否清单标底一起上传：" class="mt-10 w" prop="delegateUnitName">
                <el-radio-group v-model="distributeData.isQdBdTogether">
                  <el-radio label="否"></el-radio>
                  <el-radio label="是"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="24">
              <el-form-item label="工作要求：" class="mt-10 w" prop="delegateUnitName">
                <el-input type="textarea" v-model="distributeData.jobRequirement" class="w" size="small" placeholder="请输入工作要求"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="24">
              <el-form-item label="其它内容：" class="mt-10 w" prop="delegateUnitName">
                <el-input type="textarea" v-model="distributeData.otherContent" class="w" size="small" placeholder="请输入其它内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="12" v-if='distributeData.workProjectCategory != "4"&&distributeData.workProjectCategory != "6"'>
              <el-form-item label="初稿日期：" prop="firstDraftTimeStrNo" class="mt-10 w">
                <el-date-picker :editable="false" v-model="distributeData.firstDraftTimeStr" size="mini" type="date" placeholder="请选择初稿日期"></el-date-picker>
              </el-form-item>

            </el-col>
            <el-col :sm="12" v-if='distributeData.workProjectCategory == "4"||distributeData.workProjectCategory == "6"'>
              <el-form-item label="初稿日期：" class="mt-10 w" prop="firstDraftTimeStr">
                <el-date-picker :editable="false" id="firstDraftTimeStr" v-model="distributeData.firstDraftTimeStr" size="mini" type="date" placeholder="请选择初稿日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="定稿日期：" class="mt-10 w" prop="contractStatus">
                <el-date-picker :editable="false" v-model="distributeData.endDraftTimeStr" size="mini" type="date" placeholder="请选择定稿日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoading" class="btn-red shadow" type="primary" @click='saveSingleBtn("distributeData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='resetSingleBtn'><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
        </div>
        <div class="icms-dialog-content  pr mt-40" v-loading="distributeData.loading">
          <nav class="pa">
            单项工程列表信息
          </nav>
          <el-table class="noShadow" :data="distributeData.singleListData" style="width: 100%" highlight-current-row>
            <el-table-column width="40" label="编号" type="index"></el-table-column>
            <el-table-column width="200" label="单项工程名称" align="left">
              <template slot-scope="scope">
            <el-popover placement="right" trigger="click" width="900" popper-class="single-dialog icms-dialog">
              <single-project :singleData="singleData"></single-project> <!-- 单项工程组件 -->
              <span @click="showSingleData(scope.row)" class="cp color-green" slot="reference">{{scope.row.name}}</span>
            </el-popover>
          </template>
            </el-table-column>
            <el-table-column prop="professional" width="100" label="所属专业"></el-table-column>
            <el-table-column prop="consultant" width="150" label="专业咨询员"></el-table-column>
            <el-table-column label="包含内容">
              <template slot-scope="scope">
                {{scope.row.constructionContent ? scope.row.constructionContent : "--"}}
              </template>
            </el-table-column>
            <el-table-column prop="processState" label="流程状态" width="120" align="left"></el-table-column>
            <el-table-column label="包含内容">
              <template slot-scope="scope">
                <el-popover placement="right" trigger="click" width="900" popper-class="single-dialog icms-dialog">
                  <single-project :singleData="singleData"></single-project> <!-- 单项工程组件 -->
                  <el-button @click="showSingleData(scope.row)" slot="reference" type="text" size="small">查看</el-button>
                </el-popover>
                <el-button @click="editSingleProject(scope.row)" type="text" size="small">修改</el-button>
                <el-button @click="delSingleProject(scope.row,scope.$index)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            项目基本信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="项目名称：" class="mt-10 w" prop="contractType">
                {{distributeData.name}}
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="资料下发日期：" class="mt-10 w" prop="contractStatus">
                <el-date-picker :editable="false" v-model="distributeData.dataIssueDateStr" size="mini" type="date" placeholder="请选择定稿日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="项目负责人：" class="mt-10 w" prop="projectDirector">
                <el-input id="projectDirector" v-model="distributeData.projectDirector" class="w90 fl" size="small" placeholder="请选择项目负责人"></el-input>
                <el-popover placement="right" trigger="click" width="850" popper-class="single-dialog">
                  <select-user v-on:selectUserData="changeSelectUser"></select-user>
                  <!-- 项目负责人 -->
                  <el-button type="text" slot="reference" class="color-6 w10 fl tr"><i class="iconfont icon-shiliangzhinengduixiang f17"></i></el-button>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="是否零星项目：" class="mt-10 w" prop="contractStatus">
                <el-radio-group v-model="distributeData.isSporadicProject">
                  <el-radio label="否"></el-radio>
                  <el-radio label="是"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16" v-if="distributeData.managerShow">
            <el-col :sm="12">
              <el-form-item label="项目经理：" class="mt-10 w" prop="projectManager">
                <el-input id="projectManager" v-model="distributeData.projectManager" class="w90 fl" size="small" placeholder="请选择项目经理"></el-input>
                <el-popover placement="right" trigger="click" width="850" popper-class="single-dialog">
                  <select-user v-on:selectUserData="changeManagerUser"></select-user>
                  <!-- 项目负责人 -->
                  <el-button type="text" slot="reference" class="color-6 w10 fl tr"><i class="iconfont icon-shiliangzhinengduixiang f17"></i></el-button>
                </el-popover>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoadingSubmit" class="btn-green shadow" type="primary" @click='submitSingleProject("distributeData")'><i class="iconfont icon-tijiao2 f14 mr-5"></i>提 交</el-button>
          <el-button class="btn-white shadow" @click='distributeSingleDialog = false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>

  <!-- 归档管理员 - 归档 -->
  <el-dialog :visible.sync="saveDataFileDialog" size="small" custom-class="icms-dialog">
    <span slot="title">归档管理员 - 归档</span>
    <el-form :model="saveDataFileData" ref="saveDataFileData" label-width="165px" :rules="saveDataFileDataRules">
      <div class="icms-dialog-content pr p15">
        <nav class="pa">
          项目基本信息
        </nav>
        <el-row :gutter="16">
          <el-col :sm="16">
            <el-form-item label="项目名称：" class="mt-10 w" prop="name">
              <el-input v-model="saveDataFileData.name" class="w90 fl" size="small" placeholder="请输入项目名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content pr p15 mt-30">
        <nav class="pa">
          项目基本信息
        </nav>
        <el-table class="noShadow" :data="saveDataFileData.infoFiles" style="width: 100%" highlight-current-row>
          <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
          <el-table-column min-width="170" prop="fileName" label="文件名称"></el-table-column>
          <el-table-column prop="fileType" width="90" label="文件类型"></el-table-column>
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
      <el-row :gutter="16" class="saveFileCheckbox">
        <el-col :sm="12">
          <div class="icms-dialog-content pr p15 mt-30">
            <nav class="pa">
              项目负责人归档资料提交
            </nav>
            <el-checkbox-group v-model="saveDataFileData.archiveContentOfReport" v-if="saveDataFileData.workType == '1' || saveDataFileData.workType == '2' || saveDataFileData.workType == '3' || saveDataFileData.workType == '7' || saveDataFileData.workType == '5' || saveDataFileData.workType == '8' ? true : false">
              <el-checkbox disabled label="业务报告审批表"></el-checkbox><br/>
              <el-checkbox disabled label="标底（概、预算、清单）编制报告（含签发人底稿）"></el-checkbox><br/>
              <el-checkbox disabled label="技术文件及工作底稿（各类分析说明文件、计算书、工料分析表等）"></el-checkbox><br/>
              <el-checkbox disabled label="委托方提供资料清单（清单应注明委托单位名称及项目名称）"></el-checkbox><br/>
              <el-checkbox disabled label="工程招标文件（含工程量清单）"></el-checkbox><br/>
              <el-checkbox disabled label="设计交底纪要"></el-checkbox><br/>
              <el-checkbox disabled label="招标答疑"></el-checkbox><br/>
              <el-checkbox disabled label="会议纪要、文函"></el-checkbox><br/>
              <el-checkbox disabled label="工程量清单计价备案表"></el-checkbox><br/>
              <el-checkbox disabled label="其他相关材料：各种调查材料、采集数据、取证资料等"></el-checkbox><br/>
              <el-checkbox disabled label="工程造价咨询合同或司法鉴定委托书"></el-checkbox><br/>
              <el-checkbox disabled label="咨询企业作业计划书或全过程造价咨询实施规划及细则"></el-checkbox><br/>
              <el-checkbox disabled label="工程造价咨询质量控制流程单"></el-checkbox><br/>
              <el-checkbox disabled label="江苏省建设项目工程造价咨询效果评价表。【500万以上项目提供】"></el-checkbox><br/>
              <el-checkbox disabled label="其他资料"></el-checkbox><br/>
              <el-checkbox disabled label="图纸是否归还"></el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group v-model="saveDataFileData.archiveContentOfReport" v-if="saveDataFileData.workType == '4' || saveDataFileData.workType == '6' || saveDataFileData.workType == '9' ? true : false">
              <el-checkbox disabled label="业务报告审批表"></el-checkbox><br/>
              <el-checkbox disabled label="签发人签发的报告书底稿"></el-checkbox><br/>
              <el-checkbox disabled label="技术文件及工作底稿（各类分析说明文件、计算书、工料分析表等）"></el-checkbox><br/>
              <el-checkbox disabled label="委托方提供资料清单（清单应注明委托单位名称及项目名称）"></el-checkbox><br/>
              <el-checkbox disabled label="工程招标文件（含工程量清单）"></el-checkbox><br/>
              <el-checkbox disabled label="招标控制价"></el-checkbox><br/>
              <el-checkbox disabled label="招标答疑"></el-checkbox><br/>
              <el-checkbox disabled label="投标报价"></el-checkbox><br/>
              <el-checkbox disabled label="结算编审"></el-checkbox><br/>
              <el-checkbox disabled label="投标文件"></el-checkbox><br/>
              <el-checkbox disabled label="中标通知书"></el-checkbox><br/>
              <el-checkbox disabled label="工程承包合同（与造价有关的重要条款）"></el-checkbox><br/>
              <el-checkbox disabled label="送审工程概算、预算、结（决）算书"></el-checkbox><br/>
              <el-checkbox disabled label="设计变更单"></el-checkbox><br/>
              <el-checkbox disabled label="施工签证（结算编审）"></el-checkbox><br/>
              <el-checkbox disabled label="工程竣工验收凭证（结算编审）"></el-checkbox><br/>
              <el-checkbox disabled label="会议纪要、文函"></el-checkbox><br/>
              <el-checkbox disabled label="安全文明施工措施费测定表（结算审核）"></el-checkbox><br/>
              <el-checkbox disabled label="其他相关材料：各种调查材料、采集数据、取证资料等"></el-checkbox><br/>
              <el-checkbox disabled label="工程造价咨询质量控制流程单"></el-checkbox><br/>
              <el-checkbox disabled label="工程造价咨询重大问题会审纪要"></el-checkbox><br/>
              <el-checkbox disabled label="江苏省建设项目工程造价咨询效果评价表。【500万以上项目提供】"></el-checkbox><br/>
              <el-checkbox disabled label="其他资料"></el-checkbox><br/>
              <el-checkbox disabled label="图纸是否归还"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
        <el-col :sm="12">
          <div class="icms-dialog-content pr p15 mt-30">
            <nav class="pa">
              管理员归档资料确认
            </nav>
            <el-checkbox-group v-model="saveDataFileData.archiveContent" v-if="saveDataFileData.workType == '1' || saveDataFileData.workType == '2' || saveDataFileData.workType == '3' || saveDataFileData.workType == '7' || saveDataFileData.workType == '5' || saveDataFileData.workType == '8' ? true : false">
              <el-checkbox label="业务报告审批表"></el-checkbox><br/>
              <el-checkbox label="标底（概、预算、清单）编制报告（含签发人底稿）"></el-checkbox><br/>
              <el-checkbox label="技术文件及工作底稿（各类分析说明文件、计算书、工料分析表等）"></el-checkbox><br/>
              <el-checkbox label="委托方提供资料清单（清单应注明委托单位名称及项目名称）"></el-checkbox><br/>
              <el-checkbox label="工程招标文件（含工程量清单）"></el-checkbox><br/>
              <el-checkbox label="设计交底纪要"></el-checkbox><br/>
              <el-checkbox label="招标答疑"></el-checkbox><br/>
              <el-checkbox label="会议纪要、文函"></el-checkbox><br/>
              <el-checkbox label="工程量清单计价备案表"></el-checkbox><br/>
              <el-checkbox label="其他相关材料：各种调查材料、采集数据、取证资料等"></el-checkbox><br/>
              <el-checkbox label="工程造价咨询合同或司法鉴定委托书"></el-checkbox><br/>
              <el-checkbox label="咨询企业作业计划书或全过程造价咨询实施规划及细则"></el-checkbox><br/>
              <el-checkbox label="工程造价咨询质量控制流程单"></el-checkbox><br/>
              <el-checkbox label="江苏省建设项目工程造价咨询效果评价表。【500万以上项目提供】"></el-checkbox><br/>
              <el-checkbox label="其他资料"></el-checkbox><br/>
              <el-checkbox label="图纸是否归还"></el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group v-model="fillReportData.archiveContent" v-if="saveDataFileData.workType == '4' || saveDataFileData.workType == '6' || saveDataFileData.workType == '9' ? true : false">
              <el-checkbox label="业务报告审批表"></el-checkbox><br/>
              <el-checkbox label="签发人签发的报告书底稿"></el-checkbox><br/>
              <el-checkbox label="技术文件及工作底稿（各类分析说明文件、计算书、工料分析表等）"></el-checkbox><br/>
              <el-checkbox label="委托方提供资料清单（清单应注明委托单位名称及项目名称）"></el-checkbox><br/>
              <el-checkbox label="工程招标文件（含工程量清单）"></el-checkbox><br/>
              <el-checkbox label="招标控制价"></el-checkbox><br/>
              <el-checkbox label="招标答疑"></el-checkbox><br/>
              <el-checkbox label="投标报价"></el-checkbox><br/>
              <el-checkbox label="结算编审"></el-checkbox><br/>
              <el-checkbox label="投标文件"></el-checkbox><br/>
              <el-checkbox label="中标通知书"></el-checkbox><br/>
              <el-checkbox label="工程承包合同（与造价有关的重要条款）"></el-checkbox><br/>
              <el-checkbox label="送审工程概算、预算、结（决）算书"></el-checkbox><br/>
              <el-checkbox label="设计变更单"></el-checkbox><br/>
              <el-checkbox label="施工签证（结算编审）"></el-checkbox><br/>
              <el-checkbox label="工程竣工验收凭证（结算编审）"></el-checkbox><br/>
              <el-checkbox label="会议纪要、文函"></el-checkbox><br/>
              <el-checkbox label="安全文明施工措施费测定表（结算审核）"></el-checkbox><br/>
              <el-checkbox label="其他相关材料：各种调查材料、采集数据、取证资料等"></el-checkbox><br/>
              <el-checkbox label="工程造价咨询质量控制流程单"></el-checkbox><br/>
              <el-checkbox label="工程造价咨询重大问题会审纪要"></el-checkbox><br/>
              <el-checkbox label="江苏省建设项目工程造价咨询效果评价表。【500万以上项目提供】"></el-checkbox><br/>
              <el-checkbox label="其他资料"></el-checkbox><br/>
              <el-checkbox label="图纸是否归还"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
      </el-row>
      <div class="icms-dialog-content pr p15 mt-30">
        <nav class="pa">
          管理员归档资料确认
        </nav>
        <el-row :gutter="16">
          <el-col :sm="16">
            <el-form-item label="项目负责人归档说明：" class="mt-10 w" prop="name">
              {{saveDataFileData.archiveInstructionsOfReport}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :sm="16">
            <el-form-item label="管理员归档说明：" class="mt-10 w" prop="archiveInstructions">
              <el-input type="textarea" v-model="saveDataFileData.archiveInstructions" size="small" placeholder="请输入管理员归档说明"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :sm="8">
            <el-form-item label="归档号：" class="mt-10 w" prop="archiveNumber">
              <el-input v-model="saveDataFileData.archiveNumber" size="small" placeholder="请输入归档号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="8">
            <el-form-item label="报告日期：" class="mt-10 w" prop="reportDateStr">
              <el-date-picker :editable="false" v-model="saveDataFileData.reportDateStr" class="w" size="small" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="8">
            <el-form-item label="归档日期：" class="mt-10 w" prop="archiveDateStr">
              <el-date-picker :editable="false" v-model="saveDataFileData.archiveDateStr" class="w" size="small" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="dialog-footer tc mt-40">
        <el-button :loading="buttonLoading" class="btn-orange shadow mt-15 mr-10" type="primary" @click='saveArchiveReject("saveDataFileData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
        <el-popover placement="top" width="400" trigger="click">
          <el-row :gutter="16" class="p10 mt-20">
            <el-col :sm="6" class="mt-20 tr">
              驳回理由：
            </el-col>
            <el-col :sm="18">
              <el-input id="archive-reject" type="textarea" v-model="saveDataFileData.approveOpinion" size="small" placeholder="请输入驳回理由"></el-input>
            </el-col>
          </el-row>
          <div class="tc mb-15">
            <el-button :loading="buttonLoadingConfirm" class="btn-blue shadow mt-15" type="primary" @click='archiveReject'><i class="iconfont icon-tijiao2 f14 mr-5"></i>确定</el-button>

          </div>
          <el-button slot="reference" class="btn-red shadow mr-10" type="primary"><i class="iconfont icon-bohui f14 mr-5"></i>驳 回</el-button>
        </el-popover>
        <el-button :loading="buttonLoadingSubmit" class="btn-green shadow mt-15" type="primary" @click='submitArchiveReject("saveDataFileData")'><i class="iconfont icon-tijiao2 f14 mr-5"></i>归 档</el-button>
        <el-button class="btn-white shadow mt-15" @click='saveDataFileDialog = false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
      </div>
    </el-form>
  </el-dialog>

  <!-- 上传档案补充资料 -->
  <el-dialog :visible.sync="supplementFileDialog" size="small" custom-class="icms-dialog">
    <span slot="title">上传档案补充资料</span>
    <div class="dialog-box">
      <div class="icms-dialog-content pr p15">
        <nav class="pa">
          项目基本信息
        </nav>
        <div class="f13 color-red">
          友情提醒：项目负责人可以上传档案补充资料，如果没有，直接点击保存即可
        </div>
        <el-upload class="upload-file w mt-15" ref="upload" :on-remove="supplementFileRemove" :on-error="fileError" :on-success="supplementFileSuccess" drag action="icms/cost/project/upload" accept="*" multiple>
          <i class="el-icon-upload f16 color-gray"></i>
          <div class="el-upload__text">将文件拖到此处，或点击上传</div>
          <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
        </el-upload>
      </div>
      <div class="dialog-footer tc mt-40">
        <el-button :loading="buttonLoading" class="btn-orange shadow mr-10" type="primary" @click='saveSupplement'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
        <el-button class="btn-white shadow" @click='supplementFileDialog = false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
      </div>
    </div>
  </el-dialog>

  <!-- 项目签发 -->
  <el-dialog :visible.sync="leaderIssueDialog" size="small" custom-class="icms-dialog">
    <span slot="title">项目签发</span>
    <div class="dialog-box">
      <el-form label-width="120px">
        <div class="icms-dialog-content pr p15">
          <nav class="pa">
            单项工程列表信息
          </nav>
          <el-table class="noShadow" :data="leaderIssueData.singleData" style="width: 100%">
            <el-table-column width="40" label="编号" type="index"></el-table-column>
            <el-table-column width="200" label="单项工程名称" align="left">
              <template slot-scope="scope">
          <el-popover placement="right" trigger="click" width="900" popper-class="single-dialog icms-dialog">
            <single-project :singleData="singleData"></single-project> <!-- 单项工程组件 -->
            <span @click="showSingleData(scope.row)" class="cp color-green" slot="reference">{{scope.row.name}}</span>
          </el-popover>
        </template>
            </el-table-column>
            <el-table-column prop="professional" width="100" label="所属专业"></el-table-column>
            <el-table-column prop="consultant" width="150" label="专业咨询员"></el-table-column>
            <el-table-column label="包含内容">
              <template slot-scope="scope">
              {{distributeData.singleListData.constructionContent ? distributeData.singleListData.constructionContent : "--"}}
            </template>
            </el-table-column>
            <el-table-column prop="processState" label="流程状态" width="100" align="center"></el-table-column>
            <el-table-column label="包含内容">
              <template slot-scope="scope">
              <el-popover placement="right" trigger="click" width="900" popper-class="single-dialog icms-dialog">
                <single-project :singleData="singleData"></single-project> <!-- 单项工程组件 -->
                <el-button @click="showSingleData(scope.row)" slot="reference" type="text" size="small">查看</el-button>
              </el-popover>
              <el-button @click="deleteSingle(scope.row,scope.$index)" type="text" size="small">删除</el-button>
            </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="icms-dialog-content pr p15  mt-30">
          <nav class="pa">
            单项工程列表信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="16">
              <el-form-item label="审核操作：" class="mt-10 w" prop="name">
                <el-radio-group v-model="leaderIssueData.issueEdit">
                  <el-radio label="通过">通过</el-radio>
                  <el-radio label="驳回">驳回</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="16">
              <el-form-item label="审核意见：" class="mt-10 w" prop="name">
                <el-input type="textarea" v-model="leaderIssueData.issueOpinion" class="w90 fl" size="small" placeholder="请输入审核意见"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoading" class="btn-green shadow mr-10" type="primary" @click='saveLeaderIssueBtn'><i class="iconfont icon-tijiao2 f14 mr-5"></i>确 定</el-button>
          <el-button class="btn-white shadow" @click='leaderIssueDialog = false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 新建确定提交下一步 -->
  <el-dialog title="您确定要提交到下一步【项目分配】吗？" :visible.sync="newConfirmNextDialog" :show-close="false" custom-class="comfirm-dialog" size="tiny">
    <span><el-checkbox v-model="newCheckNextSms">短信提醒</el-checkbox></span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="newConfirmNextDialog = false">取 消</el-button>
    <el-button :loading="buttonLoadingConfirm" type="primary" @click="newConfirmNextBtn">确 定</el-button>
  </span>
  </el-dialog>
  <!-- 修改确定提交下一步 -->
  <el-dialog title="您确定要提交到下一步【项目分配】吗？" :visible.sync="confirmNextDialog" :show-close="false" custom-class="comfirm-dialog" size="tiny">
    <span><el-checkbox v-model="checkNextSms">短信提醒</el-checkbox></span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="confirmNextDialog = false">取 消</el-button>
    <el-button :loading="buttonLoadingConfirm" type="primary" @click="confirmNextBtn">确 定</el-button>
  </span>
  </el-dialog>
  <!-- 单项工程复核驳回 -->
  <el-dialog title="单项工程复核驳回" :visible.sync="singleRejectDialog" size="small" custom-class="icms-dialog">
    <span slot="title">项目签发</span>
    <div class="dialog-box">
      <div class="icms-dialog-content pr p15" v-loading="singleRejectData.loading">
        <nav class="pa">
          单项工程列表信息
        </nav>
        <el-table class="noShadow" :data="singleRejectData.singleData" style="width: 100%">
          <el-table-column width="40" label="编号" type="index"></el-table-column>
          <el-table-column prop="name" width="200" label="单项工程名称" align="left"></el-table-column>
          <el-table-column prop="professional" width="100" label="所属专业"></el-table-column>
          <el-table-column prop="consultant" width="150" label="专业咨询员"></el-table-column>
          <el-table-column label="包含内容">
            <template slot-scope="scope">
          {{singleRejectData.singleData.constructionContent ? singleRejectData.singleData.constructionContent : "--"}}
        </template>
          </el-table-column>
          <el-table-column prop="processState" label="流程状态" width="100" align="center"></el-table-column>
          <el-table-column label="包含内容">
            <template slot-scope="scope">
          <el-popover placement="right" trigger="click" width="900" popper-class="single-dialog icms-dialog">
            <single-project :singleData="singleData"></single-project> <!-- 单项工程组件 -->
            <el-button @click="showSingleData(scope.row)" slot="reference" type="text" size="small">查看</el-button>
          </el-popover>
          <el-button @click="singleReviewReject(scope.row,scope.$index)" type="text" size="small">复核驳回</el-button>
        </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
  <!-- 技术负责人审核 -->
  <el-dialog :visible.sync="examineProjectDialog" size="small" custom-class="icms-dialog">
    <span slot="title">技术负责人审核</span>
    <div class="dialog-box">
      <div class="icms-dialog-content pr p15" v-loading="examineProjectData.loading">
        <nav class="pa">
          单项工程列表信息
        </nav>
        <el-table class="noShadow" :data="examineProjectData.singleData" style="width: 100%">
          <el-table-column width="40" label="编号" type="index"></el-table-column>
          <el-table-column prop="name" width="200" label="单项工程名称" align="left"></el-table-column>
          <el-table-column prop="professional" width="100" label="所属专业"></el-table-column>
          <el-table-column prop="consultant" width="150" label="专业咨询员"></el-table-column>
          <el-table-column label="包含内容">
            <template slot-scope="scope">
          {{scope.row.constructionContent ? scope.row.constructionContent : "--"}}
        </template>
          </el-table-column>
          <el-table-column prop="processState" label="流程状态" width="100" align="center"></el-table-column>
          <el-table-column label="包含内容">
            <template slot-scope="scope">
          <el-popover placement="right" trigger="click" width="900" popper-class="single-dialog icms-dialog">
            <single-project :singleData="singleData"></single-project> <!-- 单项工程组件 -->
            <el-button @click="showSingleData(scope.row)" slot="reference" type="text" size="small">查看</el-button>
          </el-popover>
          <el-button v-if="scope.row.processState=='完成'" @click="singleReviewReject(scope.row,scope.$index)" type="text" size="small">复核驳回</el-button>
          <el-button @click="deleteSingle(scope.row,scope.$index)" type="text" size="small">删除</el-button>
        </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="icms-dialog-content pr p15 mt-30" v-loading="examineProjectData.loading">
        <nav class="pa">
          单项工程列表信息
        </nav>
        <el-form label-width="120px">
          <el-row :gutter="16">
            <el-col :sm="18">
              <el-form-item label="复核意见：" class="mt-10 w" prop="name">
                <el-input type="textarea" v-model="examineProjectData.issueOpinion" class="w90 fl" size="small" placeholder="请输入复核意见"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="16">
              <el-form-item label="是否上报项目：" class="w" prop="name">
                <el-radio-group v-model="examineProjectData.issueEdit">
                  <el-radio label="否">否</el-radio>
                  <el-radio label="是">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="dialog-footer tc mt-40">
            <el-button :loading="buttonLoading" class="btn-blue shadow" type="primary" @click='examineForLeader'><i class="iconfont icon-svg35 f14 mr-5"></i>发送领导</el-button>
            <el-button class="btn-white shadow" @click='examineProjectDialog = false'><i class="iconfont icon-quxiao1 f14 mr-5"></i>取 消</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </el-dialog>

  <!-- 导入Excel -->
  <el-dialog title="请导入Excel文件" :visible.sync="importExcelDialog" :show-close="false" custom-class="comfirm-dialog" size="tiny">
    <div class="f12 tl">
      请先下载模板，按照模板导入数据，否则将无法导入
    </div>
    <div class="tc mt-20 excel-upload">
      <a href="http://oxjaqeywu.bkt.clouddn.com/import_template.xlsx">
        <div class=" disinblock tc file-list-content word radius3 color-white cb cp p15 bg-color-green mt-5">
          <i class="iconfont f40 icon-excle mt-10"></i>
        </div>
      </a>
    </div>
    <div class="dialog-footer tc mt-40">
      <span class="pr mr-10">
      <el-button class="btn-blue shadow" type="primary"><i class="el-icon-upload f14 mr-5"></i>上传</el-button>
      <input id="excelFile" @change="excelChange($event)" class="pa cp" type="file" name="" value="上传">
</span>
      <el-button class="btn-white shadow" @click='importExcelDialog = false'><i class="iconfont icon-quxiao1 f14 mr-5"></i>取 消</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  formatDateShort,
  beautyDate
} from '../../assets/js/psy.js'
import singlePage from '../../component/singleProject/singleProject.vue';
import selectUser from '../../component/selectUser/selectUser.vue';
export default {
  components: {
    'single-project': singlePage,
    'select-user': selectUser
  },
  data() {
    return {
      exportState : true,
      buttonLoading: false,
      buttonLoadingSubmit: false,
      buttonLoadingConfirm: false,
      routerExistence: this.$route.query.projectId,
      fromPathPage: this.$route.query.fromPathPage,
      exportLoading: false,
      importExcelDialog: false,
      examineProjectDialog: false,
      distributionUser: [],
      technicalDirector: [],
      multipleSelection: [],
      loginUser: this.$store.state.app.userInfo.userName,
      userInfo: this.$store.state.app.userInfo,
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
      distributeData: {
        managerShow: false,

        singleName: '',
        // 数据
        constructionContentData: [],
        userData: [],
        // 单项工程基本信息
        name: '',
        professional: '',
        consultant: '',
        constructionContent: [],
        isQdBdTogether: '否',
        jobRequirement: '',
        otherContent: '',
        firstDraftTimeStr: '',
        endDraftTimeStr: '',
        // 单项工程列表信息
        loading: false,
        singleListData: [],
        // 单项工程基本信息
        projectName: '',
        dataIssueDateStr: '',
        projectDirector: '',
        projectManager: '',
        isSporadicProject: '否'
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
        firstDraftTimeStr: [{
          required: true,
          message: '请选择初稿日期'
        }]
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
      editProjectData: {
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
        // 档案资料
        costFiles: []
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
        }],
        delegateUnitContact: [{
          required: true,
          message: '请输入委托单位联系人'
        }],
        delegateUnitName: [{
          required: true,
          message: '请输入委托单位名称'
        }],
        delegateUnitPhone: [{
          required: true,
          message: '请输入委托单位电话'
        }],
        agreedJobCompletionDateStr: [{
          required: true,
          message: '选择约定作业完成日期'
        }]
      },
      projectSearch: {
        name: '',
        entrust: '',
        reportNum: '',
        build: '',
        principal: '',
        date: '',
        backNum: '',
        type: '',
        statute: '进行中',
        professional: '',
        informationReceivedDateStrFrom: '',
        informationReceivedDateStrTo: ''
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
        isReportProject: '',
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
        delegateUnitName: null,
        processState: null,
        workProjectCategory: null,
        reportNumbers: null,
        unitName: null,
        archiveDateStr: null,
        archiveNumber: null,
        projectDirector: null,
      },
      fillReportData: {
        workType: null,
        // 价格确认
        estimatePrice: null,
        takeCost: null,
        reviewCost: null,
        subtractIncreaseFrontal: null,
        // 项目报告基本信息
        investmentProperties: null,
        consultingType: null,
        contractType: null,
        engineeringStructure: null,
        upperNumber: null,
        undergroundNumber: null,
        constructionAreaOrSize: null,
        measurementUnit: null,
        engineeringPurpose: null,
        reportDateStr: null,
        reportNumbers: null,
        reportContentBriefly: null,
        // 归档资料确认
        archiveContent: [],
        archiveInstructions: null,
        archivesManager: null,
        archivesManagerData: [],
        // 附件信息
        files: [],
        // 按钮显示
        submitSetInfoShow: false
      },
      fillReportRules: {
        investmentProperties: [{
          required: true,
          message: '请选择投资性质'
        }],
        consultingType: [{
          required: true,
          message: '请选择咨询类型'
        }],
        engineeringStructure: [{
          required: true,
          message: '请选择工程结构'
        }],
        constructionAreaOrSize: [{
          required: true,
          message: '请输入建筑面积或规模'
        }],
        engineeringPurpose: [{
          required: true,
          message: '请选择工程用途'
        }],
        reportDateStr: [{
          required: true,
          message: '请选择日期'
        }],
        archiveInstructions: [{
          required: true,
          message: '请输入归档说明'
        }],
        archivesManager: [{
          required: true,
          message: '请选择档案管理员'
        }]
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
      fillReportFiles: [],
      supplementFiles: [],
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
        leaderIssue: false
      },
      consultantChange:''
    }
  },
  filters: {
    setDownloadUrl(url) {
      return `${location.origin}/icms/cost/project/download?id=${url}`;
    }
  },
  mounted() {
    this.roleBtnShow() //按钮隐藏
    if (this.$route.query.projectId) {
      this.searchInfo.id = this.$route.query.projectId
      this.getProjectList(this.pageNum, this.searchInfo);
    } else {
      this.roleChangeState();
    }
    this.getdistributionInfo(); //获取部门人员
  },
  methods: {
    editExcelBtn(row) {
      let excelData = {
        costId: row.costId,
        fileId: row.id
      }
      this.publicFun.httpRequest("get", `cost/project/getPageOfficeLinkUrl`, null, (status, data, message) => {
        if (status == 0) {
          location.href = data
        } else {
          this.$message.error(message);
        }
      }, excelData);
    },
    roleChangeState() { //根据角色进入不同的状态
      if (this.userInfo.userRoleNames.indexOf("档案管理员") != -1) {
        this.searchInfo.processState = "项目归档";
        this.projectSearch.processState = "项目归档";
        this.projectSearch.statute = "项目归档";
        this.getProjectList(this.pageNum, this.searchInfo);
      } else if (this.userInfo.userRoleNames.indexOf("领导") != -1) {
        this.searchInfo.processState = "领导签发";
        this.projectSearch.processState = "领导签发";
        this.projectSearch.statute = "领导签发";
        this.getProjectList(this.pageNum, this.searchInfo);
      } else {
        this.searchInfo.processState = "进行中";
        this.projectSearch.processState = "进行中";
        this.projectSearch.statute = "进行中";
        this.getProjectList(this.pageNum, this.searchInfo);

      }
    },
    roleBtnShow() {
      let meanRole = this.$store.state.app.userInfo.menus;
      //console.log("项目于管理", meanRole);
      meanRole.forEach((grandpa) => {
        if (grandpa.menuName == "造价咨询") {
          grandpa.children.forEach((parent) => {
            if (parent.menuName == "项目管理") {
              parent.children.forEach((child) => {
                if (child.menuName == "删除") {
                  this.roleBtnInfo.delete = true;
                } else if (child.menuName == "分配") {
                  this.roleBtnInfo.distributeSingle = true;
                  this.roleBtnInfo.transferDistribute = true;
                } else if (child.menuName == "修改") {
                  this.roleBtnInfo.edit = true;
                } else if (child.menuName == "填写报告") {
                  this.roleBtnInfo.whiteReport = true;
                } else if (child.menuName == "签发") {
                  this.roleBtnInfo.leaderIssue = true;
                } else if (child.menuName == "归档") {
                  this.roleBtnInfo.fillSave = true;
                } else if (child.menuName == "审核") {
                  this.roleBtnInfo.examineBtnShow = true
                }
              })
            }
          })
        }
      });

      this.userInfo.userRoleNames.indexOf("项目登记员") != -1 ? this.roleBtnInfo.creatNewProject = true : this.roleBtnInfo.creatNewProject = false;
    },
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
          projectName: this.projectSearch.name,
          delegateUnitName: this.projectSearch.entrust,
          processState: this.projectSearch.statute,
          workProjectCategory: this.projectSearch.type,
          reportNumbers: this.projectSearch.reportNum,
          unitName: this.projectSearch.build,
          archiveDateStr: this.projectSearch.date ? formatDateShort(this.projectSearch.date) : "",
          archiveNumber: this.projectSearch.backNum,
          projectDirector: this.projectSearch.principal,
        }
        this.$message({
          message: '正在为您生成Excel文件，请稍后……',
          duration: 0
        });
        this.exportLoading = true;
        this.publicFun.httpRequest("get", `cost/project/export`, null, (status, data, message) => {
          if (status == 0) {
            let excelData = [
              ["序号", "收到日期", "报告编号", "项目名称", "项目负责人", "委托单位", "建设单位", "施工单位", "合同价", "送审价", "专业编制金额", "审定金额", "提交归档日期", "备注", ],
            ];
            for (let item in data) {
              let excelSaveArray = [item != "removeByValue" ? parseInt(item) + 1 : "", data[item].informationReceivedDateStr, data[item].reportNumbers, data[item].projectName, data[item].projectDirector, data[item].delegateUnitName, data[
                  item].unitName, data[item].constructionUnitName,
                data[item].contractEstimationPrice, data[item].reviewAmount, data[item].professionalAmountSum, data[item].projectValidationAmount, data[item].submitArchiveDateStr, data[item].remark
              ]
              excelData.push(excelSaveArray)
            };
            buildExcel(excelData, `造价咨询项目汇总表`);
            this.exportLoading = false;
            this.$message.closeAll();
          } else {
            that.$message.error(message);
            this.exportLoading = false;
          }
        }, exportData);
      }).catch(() => {});
    },
    excelChange(event) { //excel转化成JSON
      this.exportState = true;
      if (typeof require !== 'undefined') var XLSX = require('xlsx');
      handleFile(event);

      function to_json(workbook) {
        var result = {};
        workbook.SheetNames.forEach(function(sheetName) {
          var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          if (roa.length > 0) {
            result[sheetName] = roa;
          }
        });
        return result;
      }
      var that = this;

      function handleFile(e) {
        var files = e.target.files;
        var i, f;
        for (i = 0; i != files.length; ++i) {
          f = files[i];
          var reader = new FileReader();
          var name = f.name;
          reader.onload = function(e) {
            var data = e.target.result;
            var workbook;
            workbook = XLSX.read(data, {
              type: 'binary'
            });
            let excelData = to_json(workbook);
            let xlsxData = excelData.Sheet1;
            //console.log(xlsxData);
            let excelPostArray = [];
            xlsxData.forEach((item) => {
              let excelPostData = {};
              if (item["收到日期"]) {
                excelPostData.informationReceivedDateStr = beautyDate(item["收到日期"]);
              } else {
                that.$message.error({
                  showClose:true,
                  message:`您未填写 “收到日期” ，位于第 ${item['序号']} 行，请检查后上传`,
                  duration:0
                });
                document.querySelector("#excelFile").value = "";
                that.exportState = false;
              }
              if (item["项目名称"]) {
                excelPostData.projectName = item["项目名称"].trim();
              } else {
                that.$message.error({
                  showClose:true,
                  message:`您未填写 “项目名称” ，位于第 ${item['序号']} 行，请检查后上传`,
                  duration:0
                });
                document.querySelector("#excelFile").value = "";
                that.exportState = false;
              }
              if (item["委托单位"]) {
                excelPostData.delegateUnitName = item["委托单位"].trim();
              } else {
                that.$message.error({
                  showClose:true,
                  message:`您未填写 “委托单位” ，位于第 ${item['序号']} 行，请检查后上传`,
                  duration:0
                });
                document.querySelector("#excelFile").value = "";
                that.exportState = false;
              }
              if (item["委托单位联系人"]) {
                excelPostData.delegateUnitContact = item["委托单位联系人"].trim();
              } else {
                that.$message.error({
                  showClose:true,
                  message:`您未填写 “委托单位联系人” ，位于第 ${item['序号']} 行，请检查后上传`,
                  duration:0
                });
                document.querySelector("#excelFile").value = "";
                that.exportState = false;
              }
              if (item["委托单位电话"]) {
                excelPostData.delegateUnitPhone = item["委托单位电话"].trim();
              } else {
                that.$message.error({
                  showClose:true,
                  message:`您未填写 “委托单位电话” ，位于第 ${item['序号']} 行，请检查后上传`,
                  duration:0
                });
                document.querySelector("#excelFile").value = "";
                that.exportState = false;
              }
              if (item["约定作业完成日期"]) {
                excelPostData.agreedJobCompletionDateStr = beautyDate(item["约定作业完成日期"]);
              } else {
                that.$message.error({
                  showClose:true,
                  message:`您未填写 “约定作业完成日期” ，位于第 ${item['序号']} 行，请检查后上传`,
                  duration:0
                });
                document.querySelector("#excelFile").value = "";
                that.exportState = false;
              }
              if (item["工作项目类别"]) {
                excelPostData.workProjectCategoryStr = item["工作项目类别"].trim();
              } else {
                that.$message.error({
                  showClose:true,
                  message:`您未填写 “工作项目类别” ，位于第 ${item['序号']} 行，请检查后上传`,
                  duration:0
                });
                document.querySelector("#excelFile").value = "";
                that.exportState = false;
              }
              if (item["技术负责人"]) {
                excelPostData.technicalDirector = item["技术负责人"].trim();
              } else {
                that.$message.error({
                  showClose:true,
                  message:`您未填写 “技术负责人” ，位于第 ${item['序号']} 行，请检查后上传`,
                  duration:0
                });
                document.querySelector("#excelFile").value = "";
                that.exportState = false;
              }
              if (item["项目分配人"]) {
                excelPostData.projectAssignPerson = item["项目分配人"].trim();
              } else {
                that.$message.error({
                  showClose:true,
                  message:`您未填写 “项目分配人” ，位于第第 ${item['序号']} 行，请检查后上传`,
                  duration:0
                });
                document.querySelector("#excelFile").value = "";
                that.exportState = false;
              }
              if (item["登记日期"]) {
                excelPostData.enrollmentDateStr = beautyDate(item["登记日期"]);
              } else {
                that.$message.error({
                  showClose:true,
                  message:`您未填写 “登记日期” ，位于第 ${item['序号']} 行，请检查后上传`,
                  duration:0
                });
                document.querySelector("#excelFile").value = "";
                that.exportState = false;
              }
              excelPostData.unitName = item["建设单位"] ? item["建设单位"].trim() : null;
              excelPostData.constructionUnitName = item["施工单位"] ? item["施工单位"].trim() : null;
              excelPostData.contractEstimationPrice = item["合同价"] ? item["合同价"].trim() : null;
              excelPostData.reviewAmount = item["送审价"] ? item["送审价"].trim() : null;
              excelPostData.approveType = item["审核类型"] ? item["审核类型"].trim() : null;
              excelPostArray.push(excelPostData);
            });
            // console.log("导入的数据", excelPostArray)
            if (that.exportState) {
              that.publicFun.httpRequest("post", `cost/project/import`, excelPostArray, (status, data, message) => {
                if (status == 0) {
                  document.querySelector("#excelFile").value = "";
                  that.$message.success(message);
                  that.importExcelDialog = false;
                  that.getProjectList(this.pageNum, this.searchInfo);
                } else {
                  that.$message.error(message);
                  document.querySelector("#excelFile").value = "";
                }
              });
            }

          };
          reader.readAsBinaryString(f);
        }
        return false;
      }
    },
    examineForLeader() { //发送领导
      let forLeaderData = {
        "approveOpinion": this.examineProjectData.issueOpinion,
        "approveResult": "通过",
        "id": this.examineProjectData.id,
        "isReportProject": this.examineProjectData.issueEdit,
        "isSendMsg": "否",
        "lead": this.examineProjectData.lead,
        "processState": this.examineProjectData.processState,
        "projectName": this.examineProjectData.projectName,
        "version": this.examineProjectData.version,
        "workProjectCategoryStr": this.examineProjectData.workProjectCategoryStr
      }
      this.buttonLoading = true;
      this.publicFun.httpRequest("post", `cost/project/sendLeaderApprove`, forLeaderData, (status, data, message) => {
        if (status == 0) {
          if (this.routerExistence) {
            this.$message.success(message);
            setTimeout(() => {
              this.buttonLoading = false;
              if (this.fromPathPage == "wait") {
                this.$router.push({
                  path: '/waitList',
                  query: {
                    fromPath: "costProject"
                  }
                });
              } else {
                this.$router.push({
                  path: '/home'
                });
              }

            }, 500)
          } else {
            this.$message.success(message);
            this.examineProjectDialog = false;
            this.buttonLoading = false;
            this.getProjectList(this.pageNum, this.searchInfo);
          }
        } else {
          this.$message.error(message);
        }
      });
    },
    examineProjectBtn(row) {
      //console.log(row)
      this.examineProjectData.id = row.id;
      this.examineProjectData.lead = row.lead;
      this.examineProjectData.processState = row.processState;
      this.examineProjectData.projectName = row.projectName;
      this.examineProjectData.version = row.version;
      this.examineProjectData.workProjectCategoryStr = row.workProjectCategoryStr;
      this.singleRejectData.costConsultationId = row.id;

      this.examineProjectDialog = true;
      this.examineProjectData.loading = true;
      this.getSingleLists(row.id);
    },
    getSingleLists(id) {
      this.publicFun.httpRequest("get", `cost/project/getSingles?costId=${id}`, null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(() => {
            this.examineProjectData.loading = false;
          });
          this.examineProjectData.singleData = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    singleReviewReject(row) { //复核驳回
      //console.log("复核驳回", row)
      this.singleRejectData.reviewer = row.reviewer;
      this.singleRejectData.beforeProcessState = row.beforeProcessState;
      this.singleRejectData.consultant = row.consultant;
      this.singleRejectData.id = row.id;
      this.singleRejectData.isQdBdTogether = row.isQdBdTogether;
      this.singleRejectData.workProjectCategory = row.workProjectCategory;
      this.$prompt('复核意见', '驳回原因', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false
      }).then(({
        value
      }) => {
        let submitCostData = {
          "approveOpinion": value,
          "approveResult": "驳回",
          "approveType": "",
          "beforeProcessState": "完成",
          "cementAmount": 0,
          "cementConsumptionIndicator": 0,
          "constructionArea": 0,
          "constructionContent": "",
          "constructionUnit": "",
          "consultant": this.singleRejectData.consultant,
          "costConsultationId": this.singleRejectData.costConsultationId,
          "endDraftTimeStr": "",
          "firstDraftCheckTimeStr": "",
          "firstDraftTimeStr": "",
          "id": this.singleRejectData.id,
          "isQdBdTogether": this.singleRejectData.isQdBdTogether,
          "isSendMsg": "",
          "issuedDateStr": "",
          "jobRequirement": "",
          "manDaysAmount": 0,
          "manDaysConsumptionIndicator": 0,
          "name": this.singleRejectData.name,
          "otherContent": "",
          "processState": "",
          "professional": "",
          "professionalAmount": 0,
          "professionalUnilateralCost": 0,
          "projectManager": "",
          "projectName": "",
          "readyMixedConcreteAmount": 0,
          "readyMixedConcreteConsumptionIndicator": 0,
          "rejectFlag": "",
          "remarks": "",
          "reviewAmount": 0,
          "reviewer": this.singleRejectData.reviewer,
          "singleContractAmount": 0,
          "singleFiles": "",
          "singleReductionRate": 0,
          "singleReviewAmount": 0,
          "singleValidationAmount": 0,
          "steelAmount": 0,
          "steelConsumptionIndicator": 0,
          "subtractAmount": 0,
          "workProjectCategory": this.singleRejectData.workProjectCategory
        }
        this.publicFun.httpRequest("post", `cost/single/submitCostSingleApprove`, submitCostData, (status, data, message) => {
          if (status == 0) {
            if (this.routerExistence) {
              this.$message.success(message);
              setTimeout(() => {
                if (this.fromPathPage == "wait") {
                  this.$router.push({
                    path: '/waitList',
                    query: {
                      fromPath: "costProject"
                    }
                  });
                } else {
                  this.$router.push({
                    path: '/home'
                  });
                }
              }, 500)
            } else {
              this.$message.success(message);
              this.singleRejectDialog = false;
              this.getSingleLists(this.singleRejectData.costConsultationId);
              this.getProjectList(this.pageNum, this.searchInfo);
            }
          } else {
            this.$message.error(message);
          }
        });
      }).catch(() => {});
    },
    singleRejectBtn(row) { //单项工程驳回按钮
      // console.log("单项工程", row)
      this.singleRejectDialog = true;
      this.singleRejectData.loading = true;
      this.publicFun.httpRequest("get", `cost/project/getSingles?costId=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(() => {
            this.singleRejectData.loading = false;
          });
          this.singleRejectData.singleData = data;
          this.singleRejectData.name = row.projectName;
          this.singleRejectData.costConsultationId = row.id;
        } else {
          this.$message.error(message);
        }
      });
    },
    getdistributionInfo() {

      this.publicFun.httpRequest("get", `role/getUsersByRoleName?roleName=项目分配人`, null, (status, data, message) => {
        if (status == 0) {
          data.forEach((item) => {
            this.distributionUser.push(item.userName);
          });
          this.newProjectData.projectAssignPerson = data[0].userName;
          this.editProjectData.projectAssignPerson = data[0].userName;
          this.transferData.distribution = data[0].userName;
          this.publicFun.httpRequest("get", `role/getUsersByRoleNameLeftLike?roleName=主管`, null, (status, data, message) => {
            if (status == 0) {
              data.forEach((item) => {
                this.distributionUser.push(item.userName);
              });
            } else {
              this.$message.error(message);
            }
          });
        } else {
          this.$message.error(message);
        }
      });
      this.publicFun.httpRequest("get", `role/getUsersByRoleNameLeftLike?roleName=技术负责人`, null, (status, data, message) => {
        if (status == 0) {
          this.newProjectData.technicalDirector = data.length > 0 ? data[0].userName : "";
          this.editProjectData.technicalDirector = data.length > 0 ? data[0].userName : "";
          data.forEach((item) => {
            this.technicalDirector.push(item.userName);
          });
        } else {
          this.$message.error(message);
        }
      });

    },
    confirmNextBtn() {
      let submitCostData = {
        "bizId": this.editProjectData.id,
        "id": 0,
        "isSendMsg": this.checkNextSms ? "是" : "否",
        "processOpinion": null,
        "processResult": null,
        "processState": null,
        "processTimeStr": null,
        "processor": null,
        "type": "biz_cost"
      }
      this.buttonLoadingConfirm = true;
      this.publicFun.httpRequest("post", `cost/project/sumbitToProjectAssign`, submitCostData, (status, data, message) => {
        if (status == 0) {
          this.buttonLoadingConfirm = false;
          this.$message.success(message);
          this.confirmNextDialog = false;
          this.editCostCreatDialog = false;
          this.getProjectList(this.pageNum, this.searchInfo);
        } else {
          this.$message.error(message);
        }
      });
    },
    // 提交造价咨询
    submitEditProject(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let updateData = {
            "agreedJobCompletionDateStr": formatDateShort(this.editProjectData.agreedJobCompletionDateStr),
            "approveType": this.editProjectData.approveType,
            "constructionUnitName": this.editProjectData.constructionUnitName,
            "consultingType": this.editProjectData.consultingType,
            "contractAmount": this.editProjectData.contractAmount,
            "contractEstimationPrice": this.editProjectData.contractEstimationPrice,
            "contractNumber": this.editProjectData.contractNumber,
            "contractPaymentMethod": this.editProjectData.contractPaymentMethod,
            "contractStatus": this.editProjectData.contractStatus,
            "contractType": this.editProjectData.contractType,
            "delegateUnitContact": this.editProjectData.delegateUnitContact,
            "delegateUnitName": this.editProjectData.delegateUnitName,
            "delegateUnitPhone": this.editProjectData.delegateUnitPhone,
            "engineeringPurpose": this.editProjectData.engineeringPurpose,
            "engineeringStructure": this.editProjectData.engineeringStructure,
            "enrollmentDateStr": formatDateShort(this.editProjectData.enrollmentDateStr),
            "id": this.editProjectData.id,
            "informationReceivedDateStr": formatDateShort(this.editProjectData.informationReceivedDateStr),
            "investmentProperties": this.editProjectData.investmentProperties,
            "isProjectDirectorReject": this.editProjectData.isProjectDirectorReject,
            "isReportProject": this.editProjectData.isReportProject,
            "measurementUnit": this.editProjectData.measurementUnit,
            "processState": this.editProjectData.processState,
            "projectAssignPerson": this.editProjectData.projectAssignPerson,
            "projectContractAmount": this.editProjectData.projectContractAmount,
            "projectDetailRequirements": this.editProjectData.projectDetailRequirements,
            "projectLocation": this.editProjectData.projectLocation,
            "projectManager": this.editProjectData.projectManager,
            "projectName": this.editProjectData.projectName,
            "projectReductionRate": this.editProjectData.projectReductionRate,
            "projectReviewAmount": this.editProjectData.projectReviewAmount,
            "projectValidationAmount": this.editProjectData.projectValidationAmount,
            "reviewAmount": this.editProjectData.reviewAmount,
            "submitArchiveDateStr": formatDateShort(this.editProjectData.submitArchiveDateStr),
            "technicalDirector": this.editProjectData.technicalDirector,
            "unitContact": this.editProjectData.unitContact,
            "unitName": this.editProjectData.unitName,
            "unitPhone": this.editProjectData.unitPhone,
            "version": this.editProjectData.version,
            "workProjectCategory": this.editProjectData.workProjectCategory,
            "costFiles": this.newProjectData.costFiles.length > 0 ? JSON.stringify(this.newProjectData.costFiles) : null
          }
          this.buttonLoadingSubmit = true;
          this.publicFun.httpRequest("put", `cost/project/update`, updateData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoadingSubmit = false;
              this.checkNextSms = null;
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
    // 修改造价咨询保存
    saveEditProject(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let updateData = {
            "agreedJobCompletionDateStr": formatDateShort(this.editProjectData.agreedJobCompletionDateStr),
            "approveType": this.editProjectData.approveType,
            "constructionUnitName": this.editProjectData.constructionUnitName,
            "consultingType": this.editProjectData.consultingType,
            "contractAmount": this.editProjectData.contractAmount,
            "contractEstimationPrice": this.editProjectData.contractEstimationPrice,
            "contractNumber": this.editProjectData.contractNumber,
            "contractPaymentMethod": this.editProjectData.contractPaymentMethod,
            "contractStatus": this.editProjectData.contractStatus,
            "contractType": this.editProjectData.contractType,
            "delegateUnitContact": this.editProjectData.delegateUnitContact,
            "delegateUnitName": this.editProjectData.delegateUnitName,
            "delegateUnitPhone": this.editProjectData.delegateUnitPhone,
            "engineeringPurpose": this.editProjectData.engineeringPurpose,
            "engineeringStructure": this.editProjectData.engineeringStructure,
            "enrollmentDateStr": formatDateShort(this.editProjectData.enrollmentDateStr),
            "id": this.editProjectData.id,
            "informationReceivedDateStr": formatDateShort(this.editProjectData.informationReceivedDateStr),
            "investmentProperties": this.editProjectData.investmentProperties,
            "isProjectDirectorReject": this.editProjectData.isProjectDirectorReject,
            "isReportProject": this.editProjectData.isReportProject,
            "measurementUnit": this.editProjectData.measurementUnit,
            "processState": this.editProjectData.processState,
            "projectAssignPerson": this.editProjectData.projectAssignPerson,
            "projectContractAmount": this.editProjectData.projectContractAmount,
            "projectDetailRequirements": this.editProjectData.projectDetailRequirements,
            "projectLocation": this.editProjectData.projectLocation,
            "projectManager": this.editProjectData.projectManager,
            "projectName": this.editProjectData.projectName,
            "projectReductionRate": this.editProjectData.projectReductionRate,
            "projectReviewAmount": this.editProjectData.projectReviewAmount,
            "projectValidationAmount": this.editProjectData.projectValidationAmount,
            "reviewAmount": this.editProjectData.reviewAmount,
            "submitArchiveDateStr": formatDateShort(this.editProjectData.submitArchiveDateStr),
            "technicalDirector": this.editProjectData.technicalDirector,
            "unitContact": this.editProjectData.unitContact,
            "unitName": this.editProjectData.unitName,
            "unitPhone": this.editProjectData.unitPhone,
            "version": this.editProjectData.version,
            "workProjectCategory": this.editProjectData.workProjectCategory,
            "costFiles": this.newProjectData.costFiles.length > 0 ? JSON.stringify(this.newProjectData.costFiles) : null
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("put", `cost/project/update`, updateData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.editCostCreatDialog = false;
              this.getProjectList(this.pageNum, this.searchInfo);
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
    // 修改造价咨询信息弹窗
    editCostCreatBtn(row) {
      if (this.newProjectData.costFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      // console.log(row)
      this.editCostCreatDialog = true;
      this.newProjectData.costFiles = [];
      this.editProjectData.id = row.id;
      this.editProjectData.version = row.version;
      this.editProjectData.forCheckedShow = false;
      this.publicFun.httpRequest("get", `cost/project/get?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          //console.log("项目信息", data)
          this.editProjectData = data.project;
          this.editProjectData.files = data.files;
          if (data.project.workProjectCategory == "6" || data.project.workProjectCategory == "4") {
            this.editProjectData.forCheckedShow = true;
          }
        } else {
          this.$message.error(message);
        }
      });
    },
    // 批量签发
    multipleIssue() {
      if (this.multipleSelection.length == 0) {
        this.$message.error("请选择项目");
      } else {
        this.$confirm('确定要批量签发吗？', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning',
          showClose: false
        }).then(() => {
          let multipleDataArray = [];
          this.multipleSelection.forEach((item) => {
            multipleDataArray.push(item.id)
          });
          let multipleData = multipleDataArray.join(",");
          this.publicFun.httpRequest("post", `cost/project/batchLeaderSign?ids=${multipleData}`, null, (status, data, message) => {
            if (status == 0) {
              this.$message.success(message);
              this.getProjectList(this.pageNum, this.searchInfo);
            } else {
              this.$message.error(message);
            }
          });
        }).catch(() => {});
      }
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
    saveLeaderIssueBtn() {
      let saveLeaderIssueData = {
        "approveOpinion": this.leaderIssueData.issueOpinion,
        "approveResult": this.leaderIssueData.issueEdit,
        "id": this.leaderIssueData.id,
        "isSendMsg": "否",
        "processState": this.leaderIssueData.processState,
        "projectDirector": this.leaderIssueData.projectDirector,
        "projectName": this.leaderIssueData.projectName,
        "technicalDirector": this.leaderIssueData.technicalDirector,
        "version": this.leaderIssueData.version,
        "workProjectCategoryStr": this.leaderIssueData.workProjectCategoryStr
      }
      this.buttonLoading = true;
      this.publicFun.httpRequest("post", `cost/project/submitLeaderSign`, saveLeaderIssueData, (status, data, message) => {
        if (status == 0) {
          if (this.routerExistence) {
            this.$message.success(message);
            setTimeout(() => {
              this.buttonLoading = false;
              if (this.fromPathPage == "wait") {
                this.$router.push({
                  path: '/waitList',
                  query: {
                    fromPath: "costProject"
                  }
                });
              } else {
                this.$router.push({
                  path: '/home'
                });
              }
            }, 500)
          } else {
            this.leaderIssueDialog = false;
            this.buttonLoading = false;
            this.$message.success(message);
            this.getProjectList(this.pageNum, this.searchInfo);
          }

        } else {
          this.$message.error(message);
        }
      });
    },
    leaderIssueBtn(row) {
      this.leaderIssueData.id = row.id;
      this.leaderIssueData.version = row.version;
      this.leaderIssueData.processState = row.processState;
      this.leaderIssueData.projectName = row.projectName;
      this.leaderIssueData.workProjectCategoryStr = row.workProjectCategoryStr;
      this.leaderIssueData.projectDirector = row.projectDirector;
      this.leaderIssueData.technicalDirector = row.technicalDirector;
      this.leaderIssueDialog = true;
      this.publicFun.httpRequest("get", `cost/project/getSingles?costId=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.leaderIssueData.singleData = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    uploadSupplementData(row) {
      this.supplementFileDialog = true;
      this.supplementId = row.id;
    },
    saveSupplement() {
      let saveSupplementData = {
        costArchiveFiles: this.supplementFiles.length != 0 ? JSON.stringify(this.supplementFiles) : null,
        id: this.supplementId
      }
      this.buttonLoading = true;
      this.publicFun.httpRequest("post", `cost/project/saveUploadArchiveFiles`, saveSupplementData, (status, data, message) => {
        if (status == 0) {
          this.buttonLoading = false;
          this.$message.success(message);
          this.supplementFileDialog = false;
          this.getProjectList(this.pageNum, this.searchInfo);
        } else {
          this.$message.error(message);
        }
      });
    },
    saveDataFileBtn(row) { // 项目归档
      this.saveDataFileDialog = true;
      this.saveDataFileData.workType = row.workProjectCategory;
      this.saveDataFileData.id = row.id;
      this.saveDataFileData.name = row.projectName;
      this.saveDataFileData.archiveContent = [];
      this.fillReportData.archiveContent = [];
      this.publicFun.httpRequest("get", `cost/project/getCostReport?projectId=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.saveDataFileData.infoFiles = data.costFiles;
          this.saveDataFileData.archiveContentOfReport = data.report.archiveContent ? data.report.archiveContent.split(",") : null;
          this.saveDataFileData.archiveInstructionsOfReport = data.report.archiveInstructions ? data.report.archiveInstructions : "--"
        } else {
          this.$message.error(message);
        }
      });

      this.publicFun.httpRequest("get", `cost/project/getCostArchive?projectId=${row.id}&projectType=biz_cost`, null, (status, data, message) => {
        if (status == 0) {
          this.saveDataFileData.saveId = data.archive ? data.archive.id : 0;
          this.saveDataFileData.archiveNumber = data.archive ? data.archive.archiveNumber : null;
          this.saveDataFileData.reportDateStr = data.archive ? data.archive.reportDateStr : null;
          this.saveDataFileData.archiveDateStr = data.archive ? data.archive.archiveDateStr : null;
          this.saveDataFileData.archiveInstructions = data.archive ? data.archive.archiveInstructions : null;
          this.saveDataFileData.archiveContent = data.archive ? data.archive.archiveContent ? data.archive.archiveContent.split(",") : [] : [];
        } else {
          this.$message.error(message);
        }
      });
    },
    submitArchiveReject(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let saveCostArchiveData = {
            "archiveContent": null,
            "archiveContents": this.saveDataFileData.archiveContent.join(","),
            "archiveDateStr": formatDateShort(this.saveDataFileData.archiveDateStr),
            "archiveInstructions": this.saveDataFileData.archiveInstructions,
            "archiveNumber": this.saveDataFileData.archiveNumber,
            "dossierName": null,
            "dossierNumber": null,
            "id": this.saveDataFileData.saveId,
            "projectId": this.saveDataFileData.id,
            "projectName": this.saveDataFileData.name,
            "projectType": "biz_cost",
            "reportDateStr": formatDateShort(this.saveDataFileData.reportDateStr)
          }
          this.buttonLoadingSubmit = true;
          this.publicFun.httpRequest("post", `cost/project/submitCostArchive`, saveCostArchiveData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoadingSubmit = false;
              this.$message.success(message);
              this.saveDataFileDialog = false;
              this.getProjectList(this.pageNum, this.searchInfo);
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
    saveArchiveReject(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let saveCostArchiveData = {
            "archiveContent": null,
            "archiveContents": this.saveDataFileData.archiveContent.join(","),
            "archiveDateStr": formatDateShort(this.saveDataFileData.archiveDateStr),
            "archiveInstructions": this.saveDataFileData.archiveInstructions,
            "archiveNumber": this.saveDataFileData.archiveNumber,
            "dossierName": null,
            "dossierNumber": null,
            "id": this.saveDataFileData.saveId,
            "projectId": this.saveDataFileData.id,
            "projectName": this.saveDataFileData.name,
            "projectType": "biz_cost",
            "reportDateStr": formatDateShort(this.saveDataFileData.reportDateStr)
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("post", `cost/project/saveCostArchive`, saveCostArchiveData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.saveDataFileDialog = false;
              this.getProjectList(this.pageNum, this.searchInfo);
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
    archiveReject() {
      if (this.saveDataFileData.approveOpinion) {
        let archiveRejectData = {
          approveOpinion: this.saveDataFileData.approveOpinion
        }
        this.buttonLoadingConfirm = true;
        this.publicFun.httpRequest("post", `cost/project/archiveReject?costId=${this.saveDataFileData.id}`, archiveRejectData, (status, data, message) => {
          if (status == 0) {
            this.buttonLoadingConfirm = false;
            this.$message.success(message);
            this.saveDataFileDialog = false;
            document.querySelector("#app").click();
            this.saveDataFileData.approveOpinion = null;
            this.getProjectList(this.pageNum, this.searchInfo);
          } else {
            this.$message.error(message);
          }
        });

      } else {
        this.$message.error("请填写驳回理由");
        document.querySelector("#archive-reject textarea").focus();
      }
    },
    fillReport(row) { // 填写报告
      //console.log("row信息", row)
      this.fillReportData.submitSetInfoShow = false;
      this.fillReportDialog = true;
      this.fillLoading = true;
      this.reportNumArray = [];
      if (this.fillReportFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.fillReportFiles = [];
      this.publicFun.httpRequest("get", "role/getUsersByRoleName?roleName=档案管理员", null, (status, data, message) => {
        if (status == 0) {
          this.fillReportData.archivesManagerData = data;
        } else {
          this.$message.error(message);
        }
      });
      this.publicFun.httpRequest("get", `cost/project/getCostReport?projectId=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(() => {
            this.fillLoading = false;
          });
          this.fillReportData.workType = row.workProjectCategory;

          this.fillReportData.estimatePrice = data.report.estimatePrice;
          this.fillReportData.takeCost = data.report.takeCost;
          this.fillReportData.reviewCost = data.report.reviewCost;
          this.fillReportData.subtractIncreaseFrontal = data.report.subtractIncreaseFrontal;

          this.fillReportData.investmentProperties = data.report.investmentProperties;
          this.fillReportData.consultingType = data.report.consultingType;
          this.fillReportData.contractType = data.report.contractType ? data.report.contractType : "1";
          this.fillReportData.engineeringStructure = data.report.engineeringStructure;
          this.fillReportData.upperNumber = data.report.upperNumber;
          this.fillReportData.undergroundNumber = data.report.undergroundNumber;
          this.fillReportData.constructionAreaOrSize = data.report.constructionAreaOrSize;
          this.fillReportData.measurementUnit = data.report.measurementUnit ? data.report.measurementUnit : "1";
          this.fillReportData.engineeringPurpose = data.report.engineeringPurpose;
          this.fillReportData.reportDateStr = data.report.reportDateStr;
          this.fillReportData.reportNumbers = data.report.reportNumbers;
          this.fillReportData.reportContentBriefly = data.report.reportContentBriefly;

          this.fillReportData.archiveContent = data.report.archiveContent ? data.report.archiveContent.split(",") : [];
          this.fillReportData.archiveInstructions = data.report.archiveInstructions;
          this.fillReportData.archivesManager = data.report.archivesManager;

          this.fillReportData.files = data.costFiles,

            this.fillReportData.id = row.id
        } else {
          this.$message.error(message);
        }
      });
    },
    submitSetInfo() {
      if (this.fillReportFiles.length > 0 || this.fillReportData.files.length > 0) {
        let submitSetData = {
          "archiveContents": this.fillReportData.archiveContent.join(","),
          "archiveContent": null,
          "archiveInstructions": this.fillReportData.archiveInstructions,
          "archivesManager": this.fillReportData.archivesManager,
          "constructionAreaOrSize": this.fillReportData.constructionAreaOrSize,
          "consultingType": this.fillReportData.contractType,
          "consultingTypeStr": this.fillReportData.consultingType,
          "contractType": this.fillReportData.contractType,
          "contractTypeStr": this.fillReportData.contractTyp,
          "costReportFiles": this.fillReportFiles.length != 0 ? JSON.stringify(this.fillReportFiles) : null,
          "engineeringPurpose": this.fillReportData.engineeringPurpose,
          "engineeringPurposeStr": this.fillReportData.engineeringPurpose,
          "engineeringStructure": this.fillReportData.engineeringStructure,
          "engineeringStructureStr": this.fillReportData.engineeringStructure,
          "estimatePrice": this.fillReportData.estimatePrice,
          "investmentProperties": this.fillReportData.investmentProperties,
          "investmentPropertiesStr": this.fillReportData.investmentProperties,
          "measurementUnit": this.fillReportData.measurementUnit,
          "measurementUnitStr": this.fillReportData.measurementUnit,
          "projectId": this.fillReportData.id,
          "rejectFlag": "",
          "reportContentBriefly": this.fillReportData.reportContentBriefly,
          "reportDateStr": this.fillReportData.reportDateStr ? formatDateShort(this.fillReportData.reportDateStr) : null,
          "reportNumbers": this.fillReportData.reportNumbers,
          "reviewCost": this.fillReportData.reviewCost,
          "subtractIncreaseFrontal": this.fillReportData.subtractIncreaseFrontal,
          "takeCost": this.fillReportData.takeCost,
          "undergroundNumber": this.fillReportData.undergroundNumber,
          "upperNumber": this.fillReportData.upperNumber
        }
        this.buttonLoadingSubmit = true;
        this.publicFun.httpRequest("post", `cost/project/submitToArchive`, submitSetData, (status, data, message) => {
          if (status == 0) {
            this.buttonLoadingSubmit = false;
            this.$message.success(message);
            this.fillReportDialog = false;
            this.getProjectList(this.pageNum, this.searchInfo);
          } else {
            this.$message.error(message);
          }
        });
      } else {
        this.$message.error("您还没有上传归档资料,不能提交归档！");
      }

    },
    saveFillReport(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let fillReportData = {
            "archiveContents": this.fillReportData.archiveContent.join(","),
            "archiveContent": null,
            "archiveInstructions": this.fillReportData.archiveInstructions,
            "archivesManager": this.fillReportData.archivesManager,
            "constructionAreaOrSize": this.fillReportData.constructionAreaOrSize,
            "consultingType": this.fillReportData.contractType,
            "consultingTypeStr": this.fillReportData.consultingType,
            "contractType": this.fillReportData.contractType,
            "contractTypeStr": this.fillReportData.contractTyp,
            "costReportFiles": this.fillReportFiles.length != 0 ? JSON.stringify(this.fillReportFiles) : null,
            "engineeringPurpose": this.fillReportData.engineeringPurpose,
            "engineeringPurposeStr": this.fillReportData.engineeringPurpose,
            "engineeringStructure": this.fillReportData.engineeringStructure,
            "engineeringStructureStr": this.fillReportData.engineeringStructure,
            "estimatePrice": this.fillReportData.estimatePrice,
            "investmentProperties": this.fillReportData.investmentProperties,
            "investmentPropertiesStr": this.fillReportData.investmentProperties,
            "measurementUnit": this.fillReportData.measurementUnit,
            "measurementUnitStr": this.fillReportData.measurementUnit,
            "projectId": this.fillReportData.id,
            "rejectFlag": "",
            "reportContentBriefly": this.fillReportData.reportContentBriefly,
            "reportDateStr": this.fillReportData.reportDateStr ? formatDateShort(this.fillReportData.reportDateStr) : null,
            "reportNumbers": this.fillReportData.reportNumbers,
            "reviewCost": this.fillReportData.reviewCost,
            "subtractIncreaseFrontal": this.fillReportData.subtractIncreaseFrontal,
            "takeCost": this.fillReportData.takeCost,
            "undergroundNumber": this.fillReportData.undergroundNumber,
            "upperNumber": this.fillReportData.upperNumber
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("post", `cost/project/saveCostReport`, fillReportData, (status, data, message) => {
            if (status == 0) {
              //console.log(data);
              this.buttonLoading = false;
              this.fillReportData.submitSetInfoShow = true;
              this.$message.success(message);
              this.fillReportData.reportNumbers = data
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
    creatNewDialog() {
      this.creatNew = true;
      if (this.$refs["newProjectData"]) {
        this.$refs["newProjectData"].resetFields();
        this.$refs.upload.clearFiles();
        this.newProjectData.costFiles = [];
      }
    },
    changeProfessional() { //改变所属专业
      //console.log("所属专业", this.distributeData.professional);
      switch (this.distributeData.professional) {
        case "土建":
          this.distributeData.constructionContentData = ["基抗支护工程", "桩基工程", "主体结构工程", "防水工程", "节能保温工程", "钢结构、网架工程", "大型土石方工程", "构建制作与吊装工程"]
          this.getUserByRoleName("土建");
          break;
        case "装饰":
          this.distributeData.constructionContentData = ["内墙饰面", "楼地面饰面", "室外工程", "零星及其它工程", "外墙饰面（不含幕墙）", "幕墙工程", "门窗工程"]
          this.getUserByRoleName("装饰");
          break;
        case "安装":
          this.distributeData.constructionContentData = ["动力照明", "给排水", "通风空调", "消防工程", "零星及其它项目", "通讯与智能化工程", "电梯安装", "工业设备安装"]
          this.getUserByRoleName("安装");
          break;
        case "市政":
          this.distributeData.constructionContentData = ["道路工程", "桥涵工程", "给排水工程", "水工构筑物", "零星及其它项目", "防洪堤挡土墙", "燃气与集中供热工程", "大型土石方工程"]
          this.getUserByRoleName("市政");
          break;
        case "钢筋":
          this.distributeData.constructionContentData = []
          this.getUserByRoleName("钢筋");
          break;
        case "景观绿化":
          this.distributeData.constructionContentData = ["道路", "庭园", "仿古建筑", "零星及其它项目", "公园场地", "绿化"]
          this.getUserByRoleName("景观绿化");
          break;
      }
      this.distributeData.constructionContent = [];
    },
    delSingleProject(row, index) {
      this.$confirm('确认要删除此项目吗？', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.publicFun.httpRequest("delete", `cost/project/deleteSingle?id=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.distributeData.singleListData.splice(index, 1);
          } else {
            this.$message.error(message);
          }
        });
      }).catch(() => {});
    },
    editSingleProject(row) {
      // console.log(row);
      this.distributeData.id = row.id;
      this.distributeData.changed = true;

      this.distributeData.costConsultationId = row.costConsultationId
      this.distributeData.singleName = row.projectName;
      this.distributeData.professional = row.professional;
      this.getUserByRoleName(row.professional);
      this.consultantChange = row.consultant;
      this.distributeData.isQdBdTogether = row.isQdBdTogether;
      this.distributeData.jobRequirement = row.jobRequirement;
      this.distributeData.otherContent = row.otherContent;
      this.distributeData.firstDraftTimeStr = row.firstDraftTimeStr;
      this.distributeData.endDraftTimeStr = row.endDraftTimeStr;
      // console.log("测试",row.constructionContent)
      if(row.constructionContent){
        setTimeout(()=>{
          this.distributeData.constructionContent = row.constructionContent ? row.constructionContent.split(",") : null;
        },100)
      }

    },
    saveSingleData() {
      if (this.distributeData.changed) {
        let editSingleData = {
          "cementAmount": null,
          "cementConsumptionIndicator": null,
          "constructionArea": null,
          "constructionContent": null,
          "constructionContents": this.distributeData.constructionContent ? this.distributeData.constructionContent.join(",") : null,
          "constructionUnit": null,
          "consultant": this.distributeData.consultant,
          "costConsultationId": this.distributeData.costConsultationId,
          "endDraftTimeStr": this.distributeData.endDraftTimeStr ? formatDateShort(this.distributeData.endDraftTimeStr) : null,
          "firstDraftTimeStr": this.distributeData.firstDraftTimeStr ? formatDateShort(this.distributeData.firstDraftTimeStr) : null,
          "isQdBdTogether": this.distributeData.approveType == '既做清单又做标底' ? this.distributeData.isQdBdTogether : null,
          "issuedDateStr": null,
          "jobRequirement": this.distributeData.jobRequirement,
          "manDaysAmount": null,
          "manDaysConsumptionIndicator": null,
          "name": this.distributeData.name,
          "otherContent": this.distributeData.otherContent,
          "processState": null,
          "professional": this.distributeData.professional,
          "professionalAmount": null,
          "professionalUnilateralCost": null,
          "readyMixedConcreteAmount": null,
          "readyMixedConcreteConsumptionIndicator": null,
          "remarks": null,
          "reviewAmount": null,
          "steelAmount": null,
          "steelConsumptionIndicator": null,
          "subtractAmount": null,
          "id": this.distributeData.id
        }
        this.buttonLoading = true;
        this.publicFun.httpRequest("put", `cost/project/updateSingle`, editSingleData, (status, data, message) => {
          if (status == 0) {
            this.buttonLoading = false;
            this.$message.success(message);
            this.publicFun.httpRequest("get", `cost/project/getSingles?costId=${this.distributeData.costConsultationId}`, null, (status, data, message) => {
              if (status == 0) {
                this.distributeData.singleListData = data;

                this.resetSingleBtn(); //复原创建单项工程表单
              } else {
                this.$message.error(message);
              }
            });
          } else {
            this.$message.error(message);
          }
        });
      } else {
        let addSingleData = {
          "cementAmount": null,
          "cementConsumptionIndicator": null,
          "constructionArea": null,
          "constructionContent": null,
          "constructionContents": this.distributeData.constructionContent ? this.distributeData.constructionContent.join(",") : null,
          "constructionUnit": null,
          "consultant": this.distributeData.consultant,
          "costConsultationId": this.distributeData.costConsultationId,
          "endDraftTimeStr": this.distributeData.endDraftTimeStr ? formatDateShort(this.distributeData.endDraftTimeStr) : null,
          "firstDraftTimeStr": this.distributeData.firstDraftTimeStr ? formatDateShort(this.distributeData.firstDraftTimeStr) : null,
          "isQdBdTogether": this.distributeData.approveType == '既做清单又做标底' ? this.distributeData.isQdBdTogether : null,
          "issuedDateStr": null,
          "jobRequirement": this.distributeData.jobRequirement,
          "manDaysAmount": null,
          "manDaysConsumptionIndicator": null,
          "name": this.distributeData.name,
          "otherContent": this.distributeData.otherContent,
          "processState": null,
          "professional": this.distributeData.professional,
          "professionalAmount": null,
          "professionalUnilateralCost": null,
          "readyMixedConcreteAmount": null,
          "readyMixedConcreteConsumptionIndicator": null,
          "remarks": null,
          "reviewAmount": null,
          "steelAmount": null,
          "steelConsumptionIndicator": null,
          "subtractAmount": null
        }
        this.buttonLoading = true;
        this.publicFun.httpRequest("post", `cost/project/addSingle`, addSingleData, (status, data, message) => {
          if (status == 0) {
            this.buttonLoading = false;
            this.$message.success(message);
            this.publicFun.httpRequest("get", `cost/project/getSingles?costId=${this.distributeData.costConsultationId}`, null, (status, data, message) => {
              if (status == 0) {
                this.distributeData.singleListData = data;
                this.resetSingleBtn(); //复原创建单项工程表单
              } else {
                this.$message.error(message);
              }
            });
          } else {
            this.$message.error(message);
          }
        });
      }
    },
    saveSingleBtn() {
      if (!this.distributeData.singleName) {
        this.$message.error("请填写单项工程名称");
        return false;
      } else if (this.distributeData.workProjectCategory == "4" || this.distributeData.workProjectCategory == "6") {
        if (!this.distributeData.firstDraftTimeStr) {
          this.$message.error("请填写初稿日期");
          document.querySelector("#firstDraftTimeStr input").focus()
          return false;
        } else {
          this.saveSingleData();
        }
      } else {
        this.saveSingleData();
      }
    },
    resetSingleBtn() {
      this.distributeData.professional = "土建";
      this.distributeData.constructionContentData = ["基抗支护工程", "桩基工程", "主体结构工程", "防水工程", "节能保温工程", "钢结构、网架工程", "大型土石方工程", "构建制作与吊装工程"]
      this.getUserByRoleName("土建");
      this.distributeData.constructionContent = [];
      this.distributeData.jobRequirement = null;
      this.distributeData.otherContent = null;
      this.distributeData.firstDraftTimeStr = null;
      this.distributeData.endDraftTimeStr = null;
      this.distributeData.singleName = this.distributeData.name;
      this.distributeData.isQdBdTogether = "否";
      this.distributeData.changed = false;
      this.consultantChange = '';
    },
    changeSelectUser(name) { //改变项目负责人
      //console.log("改变的项目负责人", name)
      this.distributeData.projectDirector = name.userName;
      document.querySelector(".el-dialog").click();
    },
    changeManagerUser(name) { //改变项目经理
      //console.log("改变的项目经理", name)
      this.distributeData.projectManager = name.userName;
      document.querySelector(".el-dialog").click();
    },
    submitSingleProject() { //单项工程提交
      if (this.distributeData.singleListData.length > 0) {
        if (!this.distributeData.projectDirector) {
          this.$message.error("请填写项目负责人");
          document.querySelector("#projectDirector input").focus();
          return false;
        } else if (this.distributeData.managerShow) {
          if (!this.distributeData.projectManager) {
            this.$message.error("请填写项目经理");
            document.querySelector("#projectManager input").focus();
            return false;
          } else {
            let submitSingleData = {
              "dataIssueDateStr": this.distributeData.dataIssueDateStr ? formatDateShort(this.distributeData.dataIssueDateStr) : null,
              "id": this.distributeData.costConsultationId,
              "isSporadicProject": this.distributeData.isSporadicProject,
              "processState": "单项工程审核",
              "projectDirector": this.distributeData.projectDirector,
              "projectManager": this.distributeData.projectManager,
              "projectName": this.distributeData.name,
              "version": this.distributeData.version,
              "workProjectCategoryStr": this.distributeData.workProjectCategoryStr
            }
            //console.log(submitSingleData)
            this.buttonLoadingSubmit = true;
            this.publicFun.httpRequest("post", `cost/project/submitAllSingleFlow`, submitSingleData, (status, data, message) => {
              if (status == 0) {
                this.buttonLoadingSubmit = false;
                this.$message.success(message);
                this.distributeSingleDialog = false;
                this.getProjectList(this.pageNum, this.searchInfo);
              } else {
                this.$message.error(message);
              }
            });
          }
        } else {
          let submitSingleData = {
            "dataIssueDateStr": this.distributeData.dataIssueDateStr ? formatDateShort(this.distributeData.dataIssueDateStr) : null,
            "id": this.distributeData.costConsultationId,
            "isSporadicProject": this.distributeData.isSporadicProject,
            "processState": "单项工程审核",
            "projectDirector": this.distributeData.projectDirector,
            "projectManager": this.distributeData.projectManager,
            "projectName": this.distributeData.name,
            "version": this.distributeData.version,
            "workProjectCategoryStr": this.distributeData.workProjectCategoryStr
          }
          //console.log(submitSingleData)
          this.buttonLoadingSubmit = true;
          this.publicFun.httpRequest("post", `cost/project/submitAllSingleFlow`, submitSingleData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoadingSubmit = false;
              this.$message.success(message);
              this.distributeSingleDialog = false;
              this.getProjectList(this.pageNum, this.searchInfo);
            } else {
              this.$message.error(message);
            }
          });
        }
      } else {
        this.$message.error("请先创建单项工程");
      }
    },
    distributeSingle(row) { //分配单项工程
      // console.log("分配单项工程", row)
      this.distributeSingleDialog = true;

      this.resetSingleBtn();

      row.workProjectCategory == "2" || row.workProjectCategory == "6" || row.workProjectCategory == "9" ? this.distributeData.managerShow = true : this.distributeData.managerShow = false

      this.distributeData.loading = true;
      this.distributeData.name = row.projectName;
      this.distributeData.version = row.version;
      this.distributeData.workProjectCategoryStr = row.workProjectCategoryStr;
      this.distributeData.workProjectCategory = row.workProjectCategory;
      this.distributeData.isSporadicProject = row.isSporadicProject == "是" ? "是" : "否";
      this.distributeData.costConsultationId = row.id;
      this.distributeData.approveType = row.approveType;
      // console.log("名称", this.distributeData.singleName)

      if (row.dataIssueDateStr) {
        this.distributeData.dataIssueDateStr = row.dataIssueDateStr;
      } else {
        this.distributeData.dataIssueDateStr = new Date();
      }
      this.publicFun.httpRequest("get", `cost/project/getSingles?costId=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.$refs["distributeData"].resetFields();
          this.distributeData.projectDirector = row.projectDirector;
          this.distributeData.projectManager = row.projectManager;
          this.publicFun.handleIELoading(() => {
            this.distributeData.loading = false;
          });
          this.distributeData.singleListData = data;
          this.distributeData.singleName = row.projectName;
          // //console.log("data", this.distributeData.singleListData)

        } else {
          this.$message.error(message);
        }
      });
    },
    getUserByRoleName(name) {
      this.publicFun.httpRequest("get", `role/getUsersByRoleName?roleName=${name}工程师`, null, (status, data, message) => {
        if (status == 0) {
          this.distributeData.userData = data;
          if(this.consultantChange){
              this.distributeData.consultant = this.consultantChange ;
          }else{
            this.distributeData.consultant = data.length > 0 ? data[0].userName : null;
          }
        } else {
          this.$message.error(message);
        }
      });
    },
    transferProject(row) { //转交分配
      //console.log(row);
      this.transferDialog = true;
      this.transferData.id = row.id;
      this.transferData.version = row.version;
    },
    confirmTransfer() {
      if (this.transferData.distribution == this.loginUser) {
        this.$message.error("转交分配不能是当前登录用户，请重新选择【项目分配人】");
      } else {
        let submitTransferData = {
          "approveOpinion": this.transferData.opinions,
          "approveResult": "转交",
          "id": this.transferData.id,
          "projectAssignPerson": this.transferData.distribution,
          "version": this.transferData.version
        }
        //console.log(submitTransferData)
        this.publicFun.httpRequest("post", `cost/project/submitTransferCostSingleAssign`, submitTransferData, (status, data, message) => {
          if (status == 0) {
            this.$message.success("转交分配成功");
            this.getProjectList(this.pageNum, this.searchInfo);
            this.transferDialog = false;
          } else {
            this.$message.error(message);
          }
        });
      }
    },
    showSingleData(row) { //查看单项工程 popover
      this.singleData.singleLoading = true;
      this.publicFun.httpRequest("get", `cost/single/getSingle?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.singleData = {
            singleLoading: false,
            name: data.single.name ? data.single.name : "--",
            professional: data.single.professional ? data.single.professional : "--",
            consultant: data.single.consultant ? data.single.consultant : "--",
            constructionContent: data.single.constructionContent ? data.single.constructionContent : "--",
            isQdBdTogether: data.single.isQdBdTogether ? data.single.isQdBdTogether : "--",
            jobRequirement: data.single.jobRequirement ? data.single.jobRequirement : "--",
            otherContent: data.single.otherContent ? data.single.otherContent : "--",
            firstDraftTimeStr: data.single.firstDraftTimeStr ? data.single.firstDraftTimeStr : "--",
            endDraftTimeStr: data.single.endDraftTimeStr ? data.single.endDraftTimeStr : "--",
            // 单项工程相关报告信息
            constructionArea: data.single.constructionArea ? data.single.constructionArea : "--",
            steelAmount: data.single.steelAmount ? data.single.steelAmount : "--",
            steelConsumptionIndicator: data.single.steelConsumptionIndicator ? data.single.steelConsumptionIndicator : "--",
            cementAmount: data.single.cementAmount ? data.single.cementAmount : "--",
            cementConsumptionIndicator: data.single.cementConsumptionIndicator ? data.single.cementConsumptionIndicator : "--",
            readyMixedConcreteAmount: data.single.readyMixedConcreteAmount ? data.single.readyMixedConcreteAmount : "--",
            readyMixedConcreteConsumptionIndicator: data.single.readyMixedConcreteConsumptionIndicator ? data.single.readyMixedConcreteConsumptionIndicator : "--",
            professionalAmount: data.single.professionalAmount ? data.single.professionalAmount : "--",
            professionalUnilateralCost: data.single.professionalUnilateralCost ? data.single.professionalUnilateralCost : "--",
            manDaysAmount: data.single.manDaysAmount ? data.single.manDaysAmount : "--",
            manDaysConsumptionIndicator: data.single.manDaysConsumptionIndicator ? data.single.manDaysConsumptionIndicator : "--",
            remarks: data.single.remarks ? data.single.remarks : "--",
            reviewer: data.single.reviewer ? data.single.reviewer : "--",
            // 电子附件
            files: data.files
          }
        } else {
          this.$message.error(message);
        }
      });
    },
    viewProjectProgress(row) {
      this.projectProgressDialog = true;
      this.progressLoading = {
        history: true,
        children: true
      };
      this.progressData.mainData = {
        projectName: row.projectName ? row.projectName : "--",
        createUser: row.createUser ? row.createUser : "--",
        projectDirector: row.projectDirector ? row.projectDirector : "--",
        workProjectCategoryStr: row.workProjectCategoryStr ? row.workProjectCategoryStr : "--",
        projectAssignPerson: row.projectAssignPerson ? row.projectAssignPerson : "--",
        lead: row.lead ? row.lead : "--",
        approveType: row.approveType ? row.approveType : "--",
        technicalDirector: row.technicalDirector ? row.technicalDirector : "--",
        archivesManager: row.archivesManager ? row.archivesManager : "--",
        projectManager: row.projectManager ? row.projectManager : "--"
      }
      switch (row.processState) {
        case "项目登记":
          this.progressData.mainData.processState = 0;
          break;
        case "项目分配":
          this.progressData.mainData.processState = 1;
          break;
        case "单项工程审核":
          this.progressData.mainData.processState = 2;
          break;
        case "技术负责人审核":
          this.progressData.mainData.processState = 3;
          break;
        case "领导签发":
          this.progressData.mainData.processState = 4;
          break;
        case "填写报告":
          this.progressData.mainData.processState = 5;
          break;
        case "项目归档":
          this.progressData.mainData.processState = 6;
          break;
        case "上传档案补充资料":
          this.progressData.mainData.processState = 7;
          break;
        case "完成":
          this.progressData.mainData.processState = 9;
          break;
        default:
          this.progressData.mainData.processState = 0;
      }
      //console.log("状态值", row.processState)
      this.publicFun.httpRequest("get", `history/get?type=biz_cost&bizId=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(() => {
            this.progressLoading.history = false;
          });
          this.progressData.history = data;
        } else {
          this.$message.error(message);
        }
      });
      this.publicFun.httpRequest("get", `cost/project/getSingles?costId=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(() => {
            this.progressLoading.children = false;
          });
          this.progressData.children = data;
          //console.log("步骤条数据", data)
          // 步骤条
          this.progressData.children.forEach((item) => {
            if (item.workProjectCategory == "6") {
              item.stepData = ["初稿编制", "项目经理编制复核", "初稿编制复核", "初稿核对", "项目经理核对复核", "初稿核对复核", "完成"];
              switch (item.processState) {
                case "初稿编制":
                  item.processStateString = 0;
                  break;
                case "项目经理编制复核":
                  item.processStateString = 1;
                  break;
                case "初稿编制复核":
                  item.processStateString = 2;
                  break;
                case "初稿核对":
                  item.processStateString = 3;
                  break;
                case "项目经理核对复核":
                  item.processStateString = 4;
                  break;
                case "初稿核对复核":
                  item.processStateString = 5;
                  break;
                case "完成":
                  item.processStateString = 7;
                  break;
              }
            } else if (item.workProjectCategory == "2") {
              if (item.approveType == "既做清单又做标底") {
                if (item.isQdBdTogether == "否") {
                  item.stepData = ["上传清单", "项目经理审核清单", "审核清单", "上传标底", "项目经理审核标底", "审核标底", "完成"];
                  switch (item.processState) {
                    case "上传清单":
                      item.processStateString = 0;
                      break;
                    case "项目经理审核清单":
                      item.processStateString = 1;
                      break;
                    case "审核清单":
                      item.processStateString = 2;
                      break;
                    case "上传标底":
                      item.processStateString = 3;
                      break;
                    case "项目经理审核标底":
                      item.processStateString = 4;
                      break;
                    case "审核标底":
                      item.processStateString = 5;
                      break;
                    case "完成":
                      item.processStateString = 7;
                      break;
                  }
                } else {
                  item.stepData = ["上传清单标底", "项目经理审核清单标底", "审核清单标底", "完成"];
                  switch (item.processState) {
                    case "上传清单标底":
                      item.processStateString = 0;
                      break;
                    case "项目经理审核清单标底":
                      item.processStateString = 1;
                      break;
                    case "审核清单标底":
                      item.processStateString = 2;
                      break;
                    case "完成":
                      item.processStateString = 4;
                      break;
                  }
                }
              } else if (item.approveType == "只做清单") {
                item.stepData = ["上传清单", "项目经理审核清单", "审核清单", "完成"];
                switch (item.processState) {
                  case "上传清单":
                    item.processStateString = 0;
                    break;
                  case "项目经理审核清单":
                    item.processStateString = 1;
                    break;
                  case "审核清单":
                    item.processStateString = 2;
                    break;
                  case "完成":
                    item.processStateString = 4;
                    break;
                }
              } else if (item.approveType == "只做标底") {
                item.stepData = ["上传标底", "项目经理审核标底", "审核标底", "完成"];
                switch (item.processState) {
                  case "上传标底":
                    item.processStateString = 0;
                    break;
                  case "项目经理审核标底":
                    item.processStateString = 1;
                    break;
                  case "审核标底":
                    item.processStateString = 2;
                    break;
                  case "完成":
                    item.processStateString = 4;
                    break;
                }
              }

            } else if (item.workProjectCategory == "3") {
              item.stepData = ["上传标底", "审核标底", "完成"];
              switch (item.processState) {
                case "上传标底":
                  item.processStateString = 0;
                  break;
                case "审核标底":
                  item.processStateString = 1;
                  break;
                case "完成":
                  item.processStateString = 3;
                  break;
              }
            } else if (item.workProjectCategory == "1") {
              if (item.approveType == "既做清单又做标底") {
                if (item.isQdBdTogether == "否") {
                  item.stepData = ["上传清单", "审核清单", "上传标底", "审核标底", "完成"];
                  switch (item.processState) {
                    case "上传清单":
                      item.processStateString = 0;
                      break;
                    case "审核清单":
                      item.processStateString = 1;
                      break;
                    case "上传标底":
                      item.processStateString = 2;
                      break;
                    case "审核标底":
                      item.processStateString = 3;
                      break;
                    case "完成":
                      item.processStateString = 5;
                      break;
                  }
                } else {
                  item.stepData = ["上传清单标底", "审核清单标底", "完成"];
                  switch (item.processState) {
                    case "上传清单标底":
                      item.processStateString = 0;
                      break;
                    case "审核清单标底":
                      item.processStateString = 1;
                      break;
                    case "完成":
                      item.processStateString = 3;
                      break;
                  }
                }
              } else if (item.approveType == "只做清单") {
                item.stepData = ["上传清单", "审核清单", "完成"];
                switch (item.processState) {
                  case "上传清单":
                    item.processStateString = 0;
                    break;
                  case "审核清单":
                    item.processStateString = 1;
                    break;
                  case "完成":
                    item.processStateString = 3;
                    break;
                }
              } else if (item.approveType == "只做标底") {
                item.stepData = ["上传标底", "审核标底", "完成"];
                switch (item.processState) {
                  case "上传标底":
                    item.processStateString = 0;
                    break;
                  case "审核标底":
                    item.processStateString = 1;
                    break;
                  case "完成":
                    item.processStateString = 3;
                    break;
                }
              }
            } else if (item.workProjectCategory == "5") {
              item.stepData = ["上传标底", "审核标底", "完成"];
              switch (item.processState) {
                case "上传标底":
                  item.processStateString = 0;
                  break;
                case "审核标底":
                  item.processStateString = 1;
                  break;
                case "完成":
                  item.processStateString = 3;
                  break;
              }
            } else if (item.workProjectCategory == "4") {
              item.stepData = ["初稿编制", "初稿编制复核", "初稿核对", "初稿核对复核", "完成"];
              switch (item.processState) {
                case "初稿编制":
                  item.processStateString = 0;
                  break;
                case "初稿编制复核":
                  item.processStateString = 1;
                  break;
                case "初稿核对":
                  item.processStateString = 2;
                  break;
                case "初稿核对复核":
                  item.processStateString = 3;
                  break;
                case "完成":
                  item.processStateString = 5;
                  break;
              }
            } else if (item.workProjectCategory == "7") {
              if (item.approveType == "既做清单又做标底") {
                if (item.isQdBdTogether == "否") {
                  item.stepData = ["上传清单", "审核清单", "上传标底", "审核标底", "完成"];
                  switch (item.processState) {
                    case "上传清单":
                      item.processStateString = 0;
                      break;
                    case "审核清单":
                      item.processStateString = 1;
                      break;
                    case "上传标底":
                      item.processStateString = 2;
                      break;
                    case "审核标底":
                      item.processStateString = 3;
                      break;
                    case "完成":
                      item.processStateString = 5;
                      break;
                    default:
                      item.processStateString = 0;
                  }
                } else {
                  item.stepData = ["上传清单标底", "审核清单标底", "完成"];
                  switch (item.processState) {
                    case "上传清单标底":
                      item.processStateString = 0;
                      break;
                    case "审核清单标底":
                      item.processStateString = 1;
                      break;
                    case "完成":
                      item.processStateString = 3;
                      break;
                    default:
                      item.processStateString = 0;
                  }
                }
              } else if (item.approveType == "只做清单") {
                item.stepData = ["上传清单", "审核清单", "完成"];
                switch (item.processState) {
                  case "上传清单":
                    item.processStateString = 0;
                    break;
                  case "审核清单":
                    item.processStateString = 1;
                    break;
                  case "完成":
                    item.processStateString = 3;
                    break;
                  default:
                    item.processStateString = 0;
                }
              } else if (item.approveType == "只做标底") {
                item.stepData = ["上传标底", "审核标底", "完成"];
                switch (item.processState) {
                  case "上传标底":
                    item.processStateString = 0;
                    break;
                  case "审核标底":
                    item.processStateString = 1;
                    break;
                  case "完成":
                    item.processStateString = 3;
                    break;
                  default:
                    item.processStateString = 0;
                }
              }
            } else if (item.workProjectCategory == "8") {
              item.stepData = ["上传清单", "审核清单", "完成"];
              switch (item.processState) {
                case "上传清单":
                  item.processStateString = 0;
                  break;
                case "审核清单":
                  item.processStateString = 1;
                  break;
                case "完成":
                  item.processStateString = 3;
                  break;
              }
            } else if (item.workProjectCategory == "5") {
              item.stepData = ["上传标底", "审核标底", "完成"];
              switch (item.processState) {
                case "上传标底":
                  item.processStateString = 0;
                  break;
                case "审核标底":
                  item.processStateString = 1;
                  break;
                case "完成":
                  item.processStateString = 3;
                  break;
              }
            } else if (item.workProjectCategory == "4") {
              item.stepData = ["初稿编制", "初稿编制复核", "初稿核对", "初稿核对复核", "完成"];
              switch (item.processState) {
                case "初稿编制":
                  item.processStateString = 0;
                  break;
                case "初稿编制复核":
                  item.processStateString = 1;
                  break;
                case "初稿核对":
                  item.processStateString = 2;
                  break;
                case "初稿核对复核":
                  item.processStateString = 3;
                  break;
                case "完成":
                  item.processStateString = 5;
                  break;
              }
            } else if (item.workProjectCategory == "9") {
              if (item.approveType == "既做清单又做标底") {
                if (item.isQdBdTogether == "否") {
                  item.stepData = ["上传清单", "项目经理审核清单", "审核清单", "上传标底", "项目经理审核标底", "审核标底", "完成"];
                  switch (item.processState) {
                    case "上传清单":
                      item.processStateString = 0;
                      break;
                    case "项目经理审核清单":
                      item.processStateString = 1;
                      break;
                    case "审核清单":
                      item.processStateString = 2;
                      break;
                    case "上传标底":
                      item.processStateString = 3;
                      break;
                    case "项目经理审核标底":
                      item.processStateString = 4;
                      break;
                    case "审核标底":
                      item.processStateString = 5;
                      break;
                    case "完成":
                      item.processStateString = 7;
                      break;
                    default:
                      item.processStateString = 0;
                  }
                } else {
                  item.stepData = ["上传清单标底", "项目经理审核清单标底", "审核清单标底", "完成"];
                  switch (item.processState) {
                    case "上传清单标底":
                      item.processStateString = 0;
                      break;
                    case "项目经理审核清单标底":
                      item.processStateString = 1;
                      break;
                    case "审核清单标底":
                      item.processStateString = 2;
                      break;
                    case "完成":
                      item.processStateString = 4;
                      break;
                    default:
                      item.processStateString = 0;
                  }
                }
              } else if (item.approveType == "只做清单") {
                item.stepData = ["上传清单", "项目经理审核清单", "审核清单", "完成"];
                switch (item.processState) {
                  case "上传清单":
                    item.processStateString = 0;
                    break;
                  case "项目经理审核清单":
                    item.processStateString = 1;
                    break;
                  case "审核清单":
                    item.processStateString = 2;
                    break;
                  case "完成":
                    item.processStateString = 4;
                    break;
                  default:
                    item.processStateString = 0;
                }
              } else if (item.approveType == "只做标底") {
                item.stepData = ["上传标底", "项目经理审核标底", "审核标底", "完成"];
                switch (item.processState) {
                  case "上传标底":
                    item.processStateString = 0;
                    break;
                  case "项目经理审核标底":
                    item.processStateString = 1;
                    break;
                  case "审核标底":
                    item.processStateString = 2;
                    break;
                  case "完成":
                    item.processStateString = 4;
                    break;
                  default:
                    item.processStateString = 0;
                }
              }
            }
          });
          //console.log(this.progressData.children)
        } else {
          this.$message.error(message);
        }
      });
    },
    changeWorkProjectCategory() {
      let status = this.newProjectData.workProjectCategory;
      this.newProjectData.forCheckedShow = false;
      switch (status) {
        case "1":
          this.approveTypeStatus = true;
          this.approveTypeData = ["既做清单又做标底", "只做清单", "只做标底"]
          break;
        case "2":
          this.approveTypeStatus = true;
          this.approveTypeData = ["既做清单又做标底", "只做清单", "只做标底"]
          break;
        case "3":
          this.approveTypeStatus = true;
          this.approveTypeData = ["只做标底"]
          break;
        case "4":
          this.approveTypeStatus = false;
          this.approveTypeData = [];
          this.newProjectData.forCheckedShow = true;
          break;
        case "5":
          this.approveTypeStatus = true;
          this.approveTypeData = ["只做标底"]
          break;
        case "6":
          this.approveTypeStatus = false;
          this.approveTypeData = [];
          this.newProjectData.forCheckedShow = true;
          break;
        case "7":
          this.approveTypeStatus = true;
          this.approveTypeData = ["既做清单又做标底", "只做清单", "只做标底"]
          break;
        case "8":
          this.approveTypeStatus = true;
          this.approveTypeData = ["只做清单"]
          break;
        case "9":
          this.approveTypeStatus = true;
          this.approveTypeData = ["既做清单又做标底", "只做清单", "只做标底"]
          break;
      }
    },
    newConfirmNextBtn() {
      let submitCostData = {
        "bizId": this.newProjectData.id,
        "id": 0,
        "isSendMsg": this.newCheckNextSmscheckNextSms ? "是" : "否",
        "processOpinion": null,
        "processResult": null,
        "processState": null,
        "processTimeStr": null,
        "processor": null,
        "type": "biz_cost"
      }
      this.buttonLoadingConfirm = true;
      this.publicFun.httpRequest("post", `cost/project/sumbitToProjectAssign`, submitCostData, (status, data, message) => {
        if (status == 0) {
          this.buttonLoadingConfirm = false;
          this.$message.success(message);
          this.newConfirmNextDialog = false;
          this.creatNew = false;
          this.getProjectList(1);
        } else {
          this.$message.error(message);
        }
      });
    },
    submitNewProject(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let postProjectData = {
            "agreedJobCompletionDateStr": this.newProjectData.agreedJobCompletionDateStr ? formatDateShort(this.newProjectData.agreedJobCompletionDateStr) : null,
            "approveType": this.approveTypeStatus ? this.newProjectData.approveType : null,
            "constructionUnitName": this.newProjectData.forCheckedShow ? this.newProjectData.constructionUnitName : null,
            "consultingType": this.newProjectData.consultingType,
            "contractAmount": this.newProjectData.contractAmount,
            "contractEstimationPrice": this.newProjectData.forCheckedShow ? this.newProjectData.contractEstimationPrice : null,
            "contractNumber": this.newProjectData.contractNumber,
            "contractPaymentMethod": this.newProjectData.contractPaymentMethod,
            "contractStatus": this.newProjectData.contractStatus,
            "contractType": this.newProjectData.contractType,
            "costFiles": this.newProjectData.costFiles.length > 0 ? JSON.stringify(this.newProjectData.costFiles) : null,
            "delegateUnitContact": this.newProjectData.delegateUnitContact,
            "delegateUnitName": this.newProjectData.delegateUnitName,
            "delegateUnitPhone": this.newProjectData.delegateUnitPhone,
            "engineeringPurpose": this.newProjectData.engineeringPurpose,
            "engineeringStructure": this.newProjectData.engineeringStructure,
            "enrollmentDateStr": this.newProjectData.enrollmentDateStr ? formatDateShort(this.newProjectData.enrollmentDateStr) : null,
            "informationReceivedDateStr": this.newProjectData.informationReceivedDateStr ? formatDateShort(this.newProjectData.informationReceivedDateStr) : null,
            "investmentProperties": this.newProjectData.investmentProperties,
            "isReportProject": null,
            "measurementUnit": this.newProjectData.measurementUnit,
            "projectAssignPerson": this.newProjectData.projectAssignPerson,
            "projectDetailRequirements": this.newProjectData.projectDetailRequirements,
            "projectLocation": this.newProjectData.projectLocation,
            "projectName": this.newProjectData.projectName,
            "reviewAmount": this.newProjectData.forCheckedShow ? this.newProjectData.reviewAmount : null,
            "technicalDirector": this.newProjectData.technicalDirector,
            "unitContact": this.newProjectData.unitContact,
            "unitName": this.newProjectData.unitName,
            "unitPhone": this.newProjectData.unitPhone,
            "updateUser": null,
            "workProjectCategory": this.newProjectData.workProjectCategory
          }
          this.buttonLoadingSubmit = true;
          this.publicFun.httpRequest("post", 'cost/project/add', postProjectData, (status, data, message) => {
            if (status == 0) {
              this.newCheckNextSms = null;
              this.newConfirmNextDialog = true;
              this.newProjectData.id = data.id;
              this.buttonLoadingSubmit = false;
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
    saveNewProject(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let postProjectData = {
            "agreedJobCompletionDateStr": this.newProjectData.agreedJobCompletionDateStr ? formatDateShort(this.newProjectData.agreedJobCompletionDateStr) : null,
            "approveType": this.approveTypeStatus ? this.newProjectData.approveType : null,
            "constructionUnitName": this.newProjectData.forCheckedShow ? this.newProjectData.constructionUnitName : null,
            "consultingType": this.newProjectData.consultingType,
            "contractAmount": this.newProjectData.contractAmount,
            "contractEstimationPrice": this.newProjectData.forCheckedShow ? this.newProjectData.contractEstimationPrice : null,
            "contractNumber": this.newProjectData.contractNumber,
            "contractPaymentMethod": this.newProjectData.contractPaymentMethod,
            "contractStatus": this.newProjectData.contractStatus,
            "contractType": this.newProjectData.contractType,
            "costFiles": this.newProjectData.costFiles.length > 0 ? JSON.stringify(this.newProjectData.costFiles) : null,
            "delegateUnitContact": this.newProjectData.delegateUnitContact,
            "delegateUnitName": this.newProjectData.delegateUnitName,
            "delegateUnitPhone": this.newProjectData.delegateUnitPhone,
            "engineeringPurpose": this.newProjectData.engineeringPurpose,
            "engineeringStructure": this.newProjectData.engineeringStructure,
            "enrollmentDateStr": this.newProjectData.enrollmentDateStr ? formatDateShort(this.newProjectData.enrollmentDateStr) : null,
            "informationReceivedDateStr": this.newProjectData.informationReceivedDateStr ? formatDateShort(this.newProjectData.informationReceivedDateStr) : null,
            "investmentProperties": this.newProjectData.investmentProperties,
            "isReportProject": null,
            "measurementUnit": this.newProjectData.measurementUnit,
            "projectAssignPerson": this.newProjectData.projectAssignPerson,
            "projectDetailRequirements": this.newProjectData.projectDetailRequirements,
            "projectLocation": this.newProjectData.projectLocation,
            "projectName": this.newProjectData.projectName,
            "reviewAmount": this.newProjectData.forCheckedShow ? this.newProjectData.reviewAmount : null,
            "technicalDirector": this.newProjectData.technicalDirector,
            "unitContact": this.newProjectData.unitContact,
            "unitName": this.newProjectData.unitName,
            "unitPhone": this.newProjectData.unitPhone,
            "updateUser": null,
            "workProjectCategory": this.newProjectData.workProjectCategory
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("post", 'cost/project/add', postProjectData, (status, data, message) => {
            if (status == 0) {
              this.$message({
                type: 'success',
                message: message
              });
              this.creatNew = false;
              this.buttonLoading = false;
              this.getProjectList(1);
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
    delProject(row) { //删除单条项目
      this.$confirm('确认要删除此项目吗？', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.publicFun.httpRequest("delete", `cost/project/delete?id=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.getProjectList(this.pageNum, this.searchInfo);
          }
        })
      }).catch(() => {});
    },
    showSuccess(val, response) {
      //console.log(val, response)
    },
    searchProject() {
      this.searchInfo = {
        projectName: this.projectSearch.name,
        delegateUnitName: this.projectSearch.entrust,
        processState: this.projectSearch.statute,
        workProjectCategory: this.projectSearch.type,
        reportNumbers: this.projectSearch.reportNum,
        unitName: this.projectSearch.build,
        archiveDateStr: this.projectSearch.date ? formatDateShort(this.projectSearch.date) : "",
        archiveNumber: this.projectSearch.backNum,
        projectDirector: this.projectSearch.principal,
        professional: this.projectSearch.professional,
        informationReceivedDateStrFrom: this.projectSearch.informationReceivedDateStrFrom ? formatDateShort(this.projectSearch.informationReceivedDateStrFrom) : "",
        informationReceivedDateStrTo: this.projectSearch.informationReceivedDateStrTo ? formatDateShort(this.projectSearch.informationReceivedDateStrTo) : "",
      }
      this.getProjectList(1, this.searchInfo);
      this.pageNum = 1;
    },
    getProjectList(page, searchInfo) {
      let params = {
        page: page,
        rows: 10,
        projectName: searchInfo ? searchInfo.projectName ? searchInfo.projectName.trim() : null : null,
        delegateUnitName: this.userInfo.departmentName == "外部企业" ? this.userInfo.userName : searchInfo ? searchInfo.delegateUnitName ? searchInfo.delegateUnitName.trim() : null : null,
        processState: searchInfo ? searchInfo.processState ? searchInfo.processState : null : null,
        workProjectCategory: searchInfo ? searchInfo.workProjectCategory ? searchInfo.workProjectCategory : null : null,
        reportNumbers: searchInfo ? searchInfo.reportNumbers ? searchInfo.reportNumbers.trim() : null : null,
        unitName: searchInfo ? searchInfo.unitName ? searchInfo.unitName.trim() : null : null,
        archiveDateStr: searchInfo ? searchInfo.archiveDateStr ? searchInfo.archiveDateStr : null : null,
        archiveNumber: searchInfo ? searchInfo.archiveNumber ? searchInfo.archiveNumber.trim() : null : null,
        projectDirector: searchInfo ? searchInfo.projectDirector ? searchInfo.projectDirector.trim() : null : null,
        id: searchInfo ? searchInfo.id ? searchInfo.id : null : null,
        professional: searchInfo ? searchInfo.professional ? searchInfo.professional.trim() : null : null,
        informationReceivedDateStrFrom: searchInfo ? searchInfo.professional ? searchInfo.informationReceivedDateStrFrom : null : null,
        informationReceivedDateStrTo: searchInfo ? searchInfo.professional ? searchInfo.informationReceivedDateStrTo : null : null,
      }
      this.listLoading = true;
      this.publicFun.httpRequest("get", 'cost/project/list', null, (status, data, message) => {
        if (status == 0) {
          this.ProjectList = data.rows;
          this.publicFun.handleIELoading(() => {
            this.listLoading = false;
          });
          this.total = data.total;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    projectCurrentChange(val) {
      this.getProjectList(val, this.searchInfo);
      this.pageNum = val;
    },
    viewProject(row) {
      this.viewProjectDialog = true;
      this.viewLoading = true;
      let params = {
        id: row.id
      }
      this.publicFun.httpRequest("get", 'cost/project/get', null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(() => {
            this.viewLoading = false;
          });
          this.viewProjectData = {
            // 项目合同信息
            contractNum: data.project.contractNumber ? data.project.contractNumber : "--",
            contractType: data.project.contractTypeStr ? data.project.contractTypeStr : "--",
            signStatus: data.project.contractStatus ? data.project.contractStatus : "--",
            contractMoney: data.project.contractAmount ? data.project.contractAmount : "--",
            priceMethod: data.project.contractPaymentMethod ? data.project.contractPaymentMethod : "--",
            // 项目基本信息
            projectName: data.project.projectName ? data.project.projectName : "--",
            projectWay: data.project.engineeringPurposeStr ? data.project.engineeringPurposeStr : "--",
            projectStructure: data.project.engineeringStructureStr ? data.project.engineeringStructureStr : "--",
            unit: data.project.measurementUnitStr ? data.project.measurementUnitStr : "--",
            askType: data.project.consultingTypeStr ? data.project.consultingTypeStr : "--",
            workType: data.project.workProjectCategoryStr ? data.project.workProjectCategoryStr : "--",
            approveType: data.project.approveType ? data.project.approveType : "--",
            companyName: data.project.delegateUnitName ? data.project.delegateUnitName : "--",
            companyPerson: data.project.delegateUnitContact ? data.project.delegateUnitContact : "--",
            companyTel: data.project.delegateUnitPhone ? data.project.delegateUnitPhone : "--",
            investmentPropertiesStr: data.project.investmentPropertiesStr ? data.project.investmentPropertiesStr : "--",
            projectLocation: data.project.projectLocation ? data.project.projectLocation : "--",
            dataReceivedDate: data.project.informationReceivedDateStr ? data.project.informationReceivedDateStr : "--",
            registerDate: data.project.enrollmentDateStr ? data.project.enrollmentDateStr : "--",
            appointmentDoneDate: data.project.agreedJobCompletionDateStr ? data.project.agreedJobCompletionDateStr : "--",
            projectRequirement: data.project.projectDetailRequirements ? data.project.projectDetailRequirements : "--",
            technologyLeader: data.project.technicalDirector ? data.project.technicalDirector : "--",
            projectDistribution: data.project.projectAssignPerson ? data.project.projectAssignPerson : "--",
            projectManager: data.project.projectManager ? data.project.projectManager : "--",
            isReportProject: data.project.isReportProject ? data.project.isReportProject : "--",
            // 建设单位信息
            buildName: data.project.delegateUnitName ? data.project.delegateUnitName : "--",
            buildPerson: data.project.delegateUnitContact ? data.project.delegateUnitContact : "--",
            buildTel: data.project.delegateUnitPhone ? data.project.delegateUnitPhone : "--",
            // 项目送审信息
            constructionName: data.project.constructionUnitName ? data.project.constructionUnitName : "--",
            submitPrice: data.project.reviewAmount ? data.project.reviewAmount : "--",
            constructionPrice: data.project.projectContractAmount ? data.project.projectContractAmount : "--",
            // 项目审定信息
            submitInfoPrice: data.project.projectReviewAmount ? data.project.projectReviewAmount : "--",
            contractPrice: data.project.projectContractAmount ? data.project.projectContractAmount : "--",
            donePrice: data.project.projectValidationAmount ? data.project.projectValidationAmount : "--",
            increaseProbability: data.project.projectReductionRate ? data.project.projectReductionRate : "--",
            // 项目基本文档
            normalFiles: data.docs,
            // 档案资料
            infoFiles: data.files,

            workProjectCategory: data.project.workProjectCategory
          }
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    uploadRemove(file, fileList) {
      //console.log("移除文件", file)
      this.newProjectData.costFiles.forEach((item) => {
        if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1) {
          this.newProjectData.costFiles.removeByValue(item);
        }
      });
    },
    uploadSuccess(response, file, fileList) {
      //console.log("文件上传成功", response)
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: "项目登记",
        createUser: this.loginUser
      }
      this.newProjectData.costFiles.push(fileData);
    },
    fileError(err, file, fileList) {
      this.$message.error("很抱歉，上传失败，请检查文件大小或稍后再试");
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    uploadFillRemove(file, fileList) {
      //console.log("移除文件", file)
      this.fillReportFiles.forEach((item) => {
        if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1) {
          this.fillReportFiles.removeByValue(item);
        }
      });
    },
    uploadFillSuccess(response, file, fileList) {
      //console.log("文件上传成功", response);
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: "填写报告",
        createUser: this.loginUser
      }
      this.fillReportFiles.push(fileData);
    },
    supplementFileRemove(file, fileList) {
      //console.log("移除文件", file)
      this.supplementFiles.forEach((item) => {
        if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1) {
          this.supplementFiles.removeByValue(item);
        }
      });
    },
    supplementFileSuccess(response, file, fileList) {
      //console.log("文件上传成功", response);
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: "上传档案补充资料",
        createUser: this.loginUser
      }
      this.supplementFiles.push(fileData);
    },
    fillNumMinus() {
      this.reportNumArray = this.fillReportData.reportNumbers.split(",");
      if (this.reportNumArray.length > 1) {
        this.reportNumArray.pop();
        this.fillReportData.reportNumbers = this.reportNumArray.join(",");
      } else {
        this.reportNumArray = this.reportNumArray[0].split('-');
        this.fillReportData.reportNumbers = this.reportNumArray[0];
        this.reportNumArray = [];
      }
    },
    fillNumAdd() {
      let reportNum = this.fillReportData.reportNumbers;

      if (reportNum.indexOf("-") != -1) {
        this.reportNumArray = this.fillReportData.reportNumbers.split(",");
      }
      if (this.reportNumArray.length > 8) {
        this.reportNumArray.push(reportNum.split("-")[0] + "-" + parseInt(this.reportNumArray.length + 1));
      } else {
        this.reportNumArray.push(reportNum.split("-")[0] + "-" + "0" + parseInt(this.reportNumArray.length + 1));
      }
      this.fillReportData.reportNumbers = this.reportNumArray.join(",");
    },
    delFillFile(row, index) {
      this.$confirm('确认要删除此文件吗？', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.publicFun.httpRequest("delete", `cost/project/deleteCostFile?id=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.fillReportData.files.splice(index, 1);
            this.editProjectData.files.splice(index, 1);
          } else {
            this.$message.error(message);
          }
        });
      }).catch(() => {

      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
