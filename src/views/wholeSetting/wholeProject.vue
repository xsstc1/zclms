<template>
<div id="project-setting" class="app-container">
  <header class="p25 bg-color-white pr shadow radius5 header-search" v-if="!routerExistence">
    <el-form :inline="true" ref="projectSearch" :model="projectSearch" class="demo-form-inline" label-width="120px">
      <el-form-item label="项目名称:" prop="projectName">
        <el-input size="small" v-model="projectSearch.projectName" placeholder="请填写项目名称"></el-input>
      </el-form-item>
      <el-form-item label="项目经理:" prop="projectManager">
        <el-input size="small" v-model="projectSearch.projectManager" placeholder="请填写项目经理"></el-input>
      </el-form-item>
      <el-form-item label="委托单位名称:" prop="delegateUnitName">
        <el-input size="small" v-model="projectSearch.delegateUnitName" placeholder="请填写委托单位名称"></el-input>
      </el-form-item>
      <el-form-item label="流程状态:" prop="processState">
        <el-select placeholder="请选择流程状态" v-model="projectSearch.processState">
          <el-option label="全部" value=""></el-option>
          <el-option label="项目登记" value="项目登记"></el-option>
          <el-option label="项目分配" value="项目分配"></el-option>
          <el-option label="项目进行中" value="项目进行中"></el-option>
          <el-option label="完成" value="完成"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="tc wait-header-btn f13 mb-10">
      <el-button class="btn-orange shadow mt-15" type="primary" @click="searchProject"><i class="iconfont icon-shiliangzhinengduixiang f12 mr-5"></i>查 询</el-button>
      <el-button @click='resetForm("projectSearch")' type="primary" class="btn-indigo shadow mt-15"><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
      <el-button v-if="roleBtnInfo.creatNewProject&&(userInfo.userRoleNames.indexOf('分管副总')!=-1||userInfo.userRoleNames.indexOf('项目登记员')!=-1)" class="btn-blue shadow mt-15" type="primary" @click="creatNewDialog"><i class="iconfont icon-iconfont707 f12 mr-5"></i>新 建</el-button>

      <el-button @click="exportWholeList" :loading="exportLoading" class="btn-green shadow mt-15" type="primary"><i class="iconfont icon-excel f12 mr-5"></i>导出Excel</el-button>
    </div>
  </header>
  <article class="mt-30">
    <el-table @selection-change="handleSelectionChange" ref="multipleTable" :data="ProjectList" v-loading.body="listLoading" fit highlight-current-row>
      <el-table-column align="center" label='序号' width="60" type="index"></el-table-column>
      <el-table-column align="center" label='项目编号' width="90">
        <template slot-scope="scope">
          {{scope.row.projectNumber ? scope.row.projectNumber : "--"}}
        </template>
      </el-table-column>
      <el-table-column min-width="190" label="项目名称">
        <template slot-scope="scope">
        <router-link class='inlineBlock color-green' :to="{ path: 'wholeSingle', query: { projectName: scope.row.projectName }}">
        {{scope.row.projectName}}
        </router-link>
      </template>
      </el-table-column>
      <el-table-column align="center" label='项目经理' width="90">
        <template slot-scope="scope">
          {{scope.row.projectManager ? scope.row.projectManager : "--"}}
        </template>
      </el-table-column>
      <el-table-column align="left" label='委托单位名称' width="220">
        <template slot-scope="scope">
          {{scope.row.delegateUnitName ? scope.row.delegateUnitName : "--"}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='资料收到日期' width="110">
        <template slot-scope="scope">
          {{scope.row.informationReceivedDateStr ? scope.row.informationReceivedDateStr : "--"}}
        </template>
      </el-table-column>
      <el-table-column align="left" label='流程状态' width="140" prop="processState"></el-table-column>
      <el-table-column align="center" label="  操作管理" width="400">
        <template slot-scope="scope">
          <span class="pl-15 fl tl">
            <el-button @click="viewProject(scope.row)" type="text" size="small">基本信息</el-button>
            <el-button @click="viewProjectProgress(scope.row)" type="text" size="small">工程进度</el-button>
            <el-button v-if="scope.row.projectManager==loginUser||roleBtnInfo.edit" @click="editCostCreatBtn(scope.row)" type="text" size="small">修改</el-button>
            <el-button v-if="roleBtnInfo.delete&&scope.row.createUser==loginUser&&scope.row.processState=='项目登记'" @click="delProject(scope.row)" type="text" size="small">删除</el-button>
            <el-button v-if="roleBtnInfo.distributeSingle&&scope.row.vicePresident==loginUser&&scope.row.processState!='完成'&&scope.row.processState!='项目登记'" @click="distributeSingle(scope.row)" type="text" size="small">分配</el-button>
            <el-button v-if="scope.row.processState=='项目进行中'||scope.row.processState=='完成'&&scope.row.vicePresident==loginUser" @click="projectWorkBtn(scope.row)" type="text" size="small">项目工作</el-button>
            <el-button v-if="scope.row.processState=='项目进行中'&&userInfo.userRoleNames.indexOf('分管副总')!=-1&&scope.row.vicePresident==loginUser" @click="endProjectBtn(scope.row)" type="text" size="small">结束</el-button>
            <el-button @click="sengMessageBtn(scope.row)" type="text" size="small">留言簿</el-button>
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

  <!-- 新增全过程 -->
  <el-dialog :visible.sync="creatNew" size="small" custom-class="icms-dialog">
    <span slot="title">新增 - 全过程项目信息</span>
    <div class="dialog-box">
      <el-form :model="newProjectData" ref="newProjectData" :inline="true" label-width="35%" :rules="newProjectRules">

        <div class="icms-dialog-content pr mt-10">
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
              <el-form-item label="项目编号：" class="mt-10 w creat-new-form" prop="projectNumber">
                <el-input class="w" v-model="newProjectData.projectNumber" size="small" placeholder="请输入项目编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="合同编号：" class="mt-10 w creat-new-form" prop="contractNumber">
                <el-input class="w" v-model="newProjectData.contractNumber" size="small" placeholder="请输入合同编号"></el-input>
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
              <el-form-item label="约定作业完成日期：" class="mt-10 w creat-new-form" prop="agreedJobCompletionDateStr">
                <el-date-picker :editable="false" v-model="newProjectData.agreedJobCompletionDateStr" size="mini" type="date" placeholder="选择约定作业完成日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="工程所在地：" class="mt-10 w creat-new-form" prop="projectLocation">
                <el-input class="w" v-model="newProjectData.projectLocation" size="small" placeholder="请输入工程所在地"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="重要性：" class="mt-10 w creat-new-form" prop="importance">
                <el-radio-group v-model="newProjectData.importance">
                  <el-radio class="radio" label="普通">普通</el-radio>
                  <el-radio class="radio" label="重点">重点</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="分管副总：" class="mt-10 w creat-new-form" prop="vicePresident">
                <el-select v-model="newProjectData.vicePresident" size="mini" placeholder="请选择分管副总">
                  <el-option v-for="item in vicePresident" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="委托单位名称：" class="mt-10 w creat-new-form" prop="delegateUnitName">
                <el-input class="w" v-model="newProjectData.delegateUnitName" size="small" placeholder="请输入委托单位名称"></el-input>
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
              <el-form-item label="委托单位联系方式：" class="mt-10 w creat-new-form" prop="delegateUnitPhone">
                <el-input type="text" v-model="newProjectData.delegateUnitPhone" class="w" size="small" placeholder="请输入委托单位电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="建设单位名称：" class="mt-10 w creat-new-form" prop="unitName">
                <el-input class="w" v-model="newProjectData.unitName" size="small" placeholder="请输入建设单位名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="建设单位联系人：" class="mt-10 w creat-new-form" prop="unitContact">
                <el-input v-model="newProjectData.unitContact" class="w" size="small" placeholder="请输入建设单位联系人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="建设单位联系方式：" class="mt-10 w creat-new-form" prop="unitPhone">
                <el-input v-model="newProjectData.unitPhone" class="w" size="small" placeholder="请输入建设单位联系方式"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            项目详细要求
          </nav>
          <el-upload class="upload-file w mt-10" ref="upload" :data="wholeFileType" :on-remove="uploadRemove" :on-error="fileError" :on-success="uploadSuccess" drag action="icms/wholeprocess/upload/uploadWholeprocessFile" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoadingSubmit" class="btn-blue shadow mt-15" type="primary" @click='submitNewProject("newProjectData")'><i class="iconfont icon-tijiao2 f14 mr-5"></i>提 交</el-button>
          <el-button :loading="buttonLoading" class="btn-orange shadow mt-15" type="primary" @click='saveNewProject("newProjectData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow mt-15" @click='resetForm("newProjectData")'><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 修改全过程 -->
  <el-dialog :visible.sync="editCostCreatDialog" size="small" custom-class="icms-dialog">
    <span slot="title">修改 - 全过程项目信息</span>
    <div class="dialog-box">
      <el-form :model="editProjectData" ref="editProjectData" :inline="true" label-width="35%" :rules="newProjectRules">

        <div class="icms-dialog-content pr mt-10">
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
              <el-form-item label="项目编号：" class="mt-10 w creat-new-form" prop="projectNumber">
                <el-input class="w" v-model="editProjectData.projectNumber" size="small" placeholder="请输入项目编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="合同编号：" class="mt-10 w creat-new-form" prop="contractNumber">
                <el-input class="w" v-model="editProjectData.contractNumber" size="small" placeholder="请输入合同编号"></el-input>
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
              <el-form-item label="约定作业完成日期：" class="mt-10 w creat-new-form" prop="agreedJobCompletionDateStr">
                <el-date-picker :editable="false" v-model="editProjectData.agreedJobCompletionDateStr" size="mini" type="date" placeholder="选择约定作业完成日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="工程所在地：" class="mt-10 w creat-new-form" prop="projectLocation">
                <el-input class="w" v-model="editProjectData.projectLocation" size="small" placeholder="请输入工程所在地"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="重要性：" class="mt-10 w creat-new-form" prop="importance">
                <el-radio-group v-model="editProjectData.importance">
                  <el-radio class="radio" label="普通">普通</el-radio>
                  <el-radio class="radio" label="重点">重点</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="分管副总：" class="mt-10 w creat-new-form" prop="vicePresident">
                <el-select v-model="editProjectData.vicePresident" size="mini" placeholder="请选择分管副总">
                  <el-option v-for="item in vicePresident" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="委托单位名称：" class="mt-10 w creat-new-form" prop="delegateUnitName">
                <el-input class="w" v-model="editProjectData.delegateUnitName" size="small" placeholder="请输入委托单位名称"></el-input>
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
              <el-form-item label="委托单位联系方式：" class="mt-10 w creat-new-form" prop="delegateUnitPhone">
                <el-input type="text" v-model="editProjectData.delegateUnitPhone" class="w" size="small" placeholder="请输入委托单位电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="建设单位名称：" class="mt-10 w creat-new-form" prop="unitName">
                <el-input class="w" v-model="editProjectData.unitName" size="small" placeholder="请输入建设单位名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="建设单位联系人：" class="mt-10 w creat-new-form" prop="unitContact">
                <el-input v-model="editProjectData.unitContact" class="w" size="small" placeholder="请输入建设单位联系人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="建设单位联系方式：" class="mt-10 w creat-new-form" prop="unitPhone">
                <el-input v-model="editProjectData.unitPhone" class="w" size="small" placeholder="请输入建设单位联系方式"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            项目详细要求
          </nav>
          <el-table class="noShadow" :data="editProjectData.files" style="width: 100%">
            <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
            <el-table-column prop="fileName" label="文件名称"></el-table-column>
            <el-table-column prop="createTimeStr" width="170" label="上传时间"></el-table-column>
            <el-table-column prop="createUser" width="100" label="上传人"></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope" v-if="scope.row">
                <el-button v-if="scope.row.processState=='项目登记'" @click="delFillFile(scope.row,scope.$index)" class="color-green" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
          </el-table>
          <el-upload class="upload-file w mt-10" ref="upload" :data="wholeFileType" :on-remove="uploadRemove" :on-error="fileError" :on-success="uploadSuccess" drag action="icms/wholeprocess/upload/uploadWholeprocessFile" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoadingSubmit" class="btn-blue shadow mt-15" type="primary" @click='submitEditProject("editProjectData")'><i class="iconfont icon-tijiao2 f14 mr-5"></i>提 交</el-button>
          <el-button :loading="buttonLoading" class="btn-orange shadow mt-15" type="primary" @click='saveEditProject("editProjectData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow mt-15" @click='resetForm("editProjectData")'><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 分配单项工程  -->
  <el-dialog :visible.sync="distributeSingleDialog" size="small" custom-class="icms-dialog">
    <span slot="title">新增 - 单项工程信息</span>
    <div class="dialog-box">
      <el-form :model="distributeData" ref="distributeData" label-position="right" label-width="130px" :rules="distributeRules">
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
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoading" class="btn-red shadow" type="primary" @click='saveSingleBtn'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
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
            <el-table-column min-width="170" label="包含内容">
              <template slot-scope="scope">
                  {{scope.row.constructionContent ? scope.row.constructionContent : "--"}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                  <el-popover placement="right" trigger="click" width="900" popper-class="single-dialog icms-dialog">
                    <div class="p15">
                    <div class="icms-dialog-content pr mt-15" v-loading="singleData.singleLoading">
                      <nav class="pa">
                        单项工程基本信息
                      </nav>
                      <el-row :gutter="16" class="mt-15">
                        <el-col :sm="6" :xs="12">
                          <div class="grid-content tr">单项工程名称：</div>
                        </el-col>
                        <el-col :sm="18" :xs="12">
                          <div class="grid-content">{{singleData.name}}</div>
                        </el-col>
                      </el-row>
                      <el-row :gutter="16" class="mt-15">
                        <el-col :sm="6" :xs="12">
                          <div class="grid-content tr">所属专业：</div>
                        </el-col>
                        <el-col :sm="6" :xs="12">
                          <div class="grid-content">{{singleData.professional}}</div>
                        </el-col>
                        <el-col :sm="12" :xs="12">
                          <el-col :sm="14" :xs="12">
                            <div class="grid-content tr">专业咨询员：</div>
                          </el-col>
                          <el-col :sm="10">
                            <div class="grid-content">{{singleData.consultant}}</div>
                          </el-col>
                        </el-col>
                      </el-row>
                      <el-row :gutter="16" class="mt-15">
                        <el-col :sm="6" :xs="12">
                          <div class="grid-content tr">包含内容：</div>
                        </el-col>
                        <el-col :sm="18" :xs="12">
                          <div class="grid-content">{{singleData.constructionContent}}</div>
                        </el-col>
                      </el-row>

                      <el-row :gutter="16" class="mt-15">
                        <el-col :sm="6" :xs="12">
                          <div class="grid-content tr">工作要求：</div>
                        </el-col>
                        <el-col :sm="18" :xs="12">
                          <div class="grid-content">{{singleData.jobRequirement}}</div>
                        </el-col>
                      </el-row>
                      <el-row :gutter="16" class="mt-15">
                        <el-col :sm="6" :xs="12">
                          <div class="grid-content tr">其它内容：</div>
                        </el-col>
                        <el-col :sm="18" :xs="12">
                          <div class="grid-content">{{singleData.otherContent}}</div>
                        </el-col>
                      </el-row>

                    </div>
                  </div>
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
              <el-form-item label="项目经理：" class="mt-10 w" prop="projectManager">
                <el-input v-model="distributeData.projectManager" class="w90 fl" size="small" placeholder="请选择项目经理"></el-input>
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
  <!-- 项目基本信息 -->
  <el-dialog :visible.sync="viewProjectDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 全过程项目信息</span>
    <div class="dialog-box" v-loading="viewLoading">
      <div class="icms-dialog-content  pr mt-10">
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
            <div class="grid-content tr">项目编号：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.projectNumber}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">合同编号：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.contractNumber}}</div>
            </el-col>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">资料收到日期：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.informationReceivedDateStr}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">约定作业完成日期：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.agreedJobCompletionDateStr}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">工程所在地：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.projectLocation}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">重要性：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.importance}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">委托单位名称：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{viewProjectData.delegateUnitName}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">委托单位联系人：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.delegateUnitContact}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">委托单位联系方式：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.delegateUnitPhone}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">建设单位名称：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{viewProjectData.unitName}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">建设单位联系人：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.unitContact}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">建设单位联系方式：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.unitPhone}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">分管副总：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectData.vicePresident}}</div>
          </el-col>
          <el-col :sm="10">
            <el-col :sm="12" :xs="12">
              <div class="grid-content tr">项目经理：</div>
            </el-col>
            <el-col :sm="12" :xs="12">
              <div class="grid-content">{{viewProjectData.projectManager}}</div>
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content  pr mt-40">
        <nav class="pa">
          项目详细要求
        </nav>
        <el-table class="noShadow" :data="viewProjectData.infoFiles" style="width: 100%" highlight-current-row>
          <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
          <el-table-column prop="fileName" label="文件名称"></el-table-column>
          <el-table-column prop="createTimeStr" width="170" label="上传时间"></el-table-column>
          <el-table-column prop="createUser" width="90" label="上传人"></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <a target="_blank" :href="scope.row.id | setInfoDownloadUrl">
                <el-button type="text" size="small">下载</el-button>
              </a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
  <!-- 查看工程进度 -->
  <el-dialog :visible.sync="projectProgressDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 工程进度信息</span>
    <div class="dialog-box">
      <div class="icms-dialog-content pr p15">
        <nav class="pa">
          项目基本信息
        </nav>
        <el-row :gutter="16">
          <el-col :sm="12">
            项目编号：{{progressData.mainData.projectNumber}}
          </el-col>
          <el-col :sm="12">
            项目名称：{{progressData.mainData.projectName}}
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-10">
          <el-col :sm="12">
            分管副总： {{progressData.mainData.vicePresident}}
          </el-col>
          <el-col :sm="12">
            项目经理： {{progressData.mainData.projectManager}}
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content pr mt-40">
        <nav class="pa">
          项目主流程进度信息
        </nav>
        <el-row class="oa" :gutter="16">
          <el-col :sm="20" :offset="2">
            <el-steps class="pl-10" :space="120" :active="progressData.mainData.processState" finish-status="success" :align-center="true" :center="true">
              <el-step title="项目登记"></el-step>
              <el-step title="项目分配"></el-step>
              <el-step title="项目进行中"></el-step>
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
          <el-table-column prop="processTimeStr" width="190" label="处理时间"></el-table-column>
          <el-table-column prop="processResult" label="处理结果"></el-table-column>
          <el-table-column label="处理意见" width="200">
            <template slot-scope="scope">
              {{scope.row.processOpinion?scope.row.processOpinion:"--"}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
  <!-- 新建确定提交下一步 -->
  <el-dialog title="您确定要提交到下一步流程吗？" :visible.sync="newConfirmNextDialog" :show-close="false" custom-class="comfirm-dialog" size="tiny">
    <span><el-checkbox v-model="newCheckNextSms">短信提醒</el-checkbox></span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="newConfirmNextDialog = false">取 消</el-button>
    <el-button :loading="buttonLoadingConfirm" type="primary" @click="newConfirmNextBtn">确 定</el-button>
  </span>
  </el-dialog>
  <!-- 修改确定提交下一步 -->
  <el-dialog title="您确定要提交到下一步流程吗？" :visible.sync="confirmNextDialog" :show-close="false" custom-class="comfirm-dialog" size="tiny">
    <span><el-checkbox v-model="checkNextSms">短信提醒</el-checkbox></span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="confirmNextDialog = false">取 消</el-button>
    <el-button :loading="buttonLoadingConfirm" type="primary" @click="confirmNextBtn">确 定</el-button>
  </span>
  </el-dialog>
  <!-- 项目工作提交下一步 -->
  <el-dialog title="您确定要提交到下一步流程吗？" :visible.sync="projectWorkNextDialog" :show-close="false" custom-class="comfirm-dialog" size="tiny">
    <span><el-checkbox v-model="projectWorkNextSms">短信提醒</el-checkbox></span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="projectWorkNextDialog = false">取 消</el-button>
    <el-button :loading="buttonLoadingConfirm" type="primary" @click="projectWorkNextBtn">确 定</el-button>
  </span>
  </el-dialog>

  <!-- 项目工作弹窗 -->
  <el-dialog :visible.sync="projectWorkDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 项目工作信息</span>
    <div class="dialog-box">
      <header class="bg-color-white pr header-search" v-if="!routerExistence">
        <el-form :inline="true" ref="projectWork" :model="projectWork" class="demo-form-inline" label-width="80px">
          <el-form-item label="工作类型:" prop="jobTypeProjectWork">
            <el-select placeholder="请选择工作类型" v-model="projectWork.jobTypeProjectWork">
              <el-option label="全部" value=""></el-option>
              <el-option label="实施方案" value="实施方案"></el-option>
              <el-option label="交底资料" value="交底资料"></el-option>
              <el-option label="合同" value="合同"></el-option>
              <el-option label="月报" value="月报"></el-option>
              <el-option label="动态成本" value="动态成本"></el-option>
              <el-option label="收发文登记" value="收发文登记"></el-option>
              <el-option label="点工表" value="点工表"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上报时间:" prop="createTimeStr">
            <el-date-picker :editable="false" v-model="projectWork.createTimeStr" size="mini" type="date" placeholder="选择资料收到日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="流程状态:" prop="processStateProjectWork">
            <el-select placeholder="请选择流程状态" v-model="projectWork.processStateProjectWork">
              <el-option label="全部" value=""></el-option>
              <el-option label="项目工作" value="项目工作"></el-option>
              <el-option label="分管副总审核" value="分管副总审核"></el-option>
              <el-option label="完成" value="完成"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="tc wait-header-btn f13 mb-10">
          <el-button class="btn-orange shadow mt-15" type="primary" @click="searchProjectWork"><i class="iconfont icon-shiliangzhinengduixiang f12 mr-5"></i>查 询</el-button>
          <!-- <el-button @click='resetForm("projectWork")' type="primary" class="btn-blue shadow"><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button> -->
          <el-button v-if="projectWork.creatNewProject" @click='creatProjectWorkBtn' type="primary" class="btn-blue shadow mt-15"><i class="iconfont icon-iconfont707 f13 mr-5"></i>新 增</el-button>
          <el-button @click="exportProjectWorkList" :loading="exportLoading" class="btn-green shadow mt-15" type="primary"><i class="iconfont icon-excel f12 mr-5"></i>导出Excel</el-button>
        </div>
      </header>
      <section class="p20">
        <el-table class="noShadow" style="width: 100%" :data="projectWork.projectData">
          <el-table-column type="index" width="40" label="编号" align="center"></el-table-column>
          <el-table-column width="160" label="工作类型">
            <template slot-scope="scope">
              {{scope.row.jobType=="合同"||scope.row.jobType=="其他"||scope.row.jobType=="实施方案"?scope.row.jobType:scope.row.jobTypeStr}}
            </template>
          </el-table-column>
          <el-table-column prop="contractNumber" width="170" label="合同编号" align="left">
            <template slot-scope="scope">
              {{scope.row.contractNumber?scope.row.contractNumber:"--"}}
            </template>
          </el-table-column>
          <el-table-column min-width="180" label="合同名称" align="left">
            <template slot-scope="scope">
              {{scope.row.contractName?scope.row.contractName:"--"}}
            </template>
          </el-table-column>
          <el-table-column width="150" label="合同金额">
            <template slot-scope="scope">
              {{scope.row.contractAmount?scope.row.contractAmount:"--"}}
            </template>
          </el-table-column>
          </el-table-column>
          <el-table-column prop="createTime" width="190" label="上报时间"></el-table-column>
          <el-table-column prop="processState" width="120" label="状态"></el-table-column>
          <el-table-column label="操作" width="200" align="left">
            <template slot-scope="scope">
              <el-button @click="viewProjectWorkBtn(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="ProjectWorkProgressBtn(scope.row)" type="text" size="small">工作进度</el-button>
              <el-button v-if="ProjectProgressData.projectManager == loginUser&&scope.row.processState=='项目工作'" @click="editProjectWorkBtn(scope.row)" type="text" size="small">修改</el-button>
              <el-button v-if="userInfo.userRoleNames.indexOf('分管副总')!=-1&&scope.row.processState=='分管副总审核'" @click="reviewProjectWorkBtn(scope.row)" type="text" size="small">审核</el-button>
              <el-button v-if="scope.row.processState=='项目工作'&&scope.row.createUser==loginUser" @click="delProjectWorkBtn(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>
      <footer class="cb pagination p20" v-show="projectWork.total&&!routerExistence">
        <el-pagination @current-change="changePageSearch" :current-page.sync="projectWork.page" :page-size="10" layout="prev, pager, next, jumper" :total="projectWork.total" class="fr">
        </el-pagination>
        <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{projectWork.total}}条记录</span>
      </footer>
    </div>
  </el-dialog>
  <!-- 新增 - 项目工作  -->
  <el-dialog :visible.sync="creatProjectWorkDialog" size="small" custom-class="icms-dialog">
    <span slot="title">{{creatProjectWorkData.title}}</span>
    <div class="dialog-box">
      <el-form :model="creatProjectWorkData" ref="creatProjectWorkData" :inline="true" label-width="35%" :rules="creatProjectWorkDataRules">
        <div class="icms-dialog-content pr mt-10">
          <nav class="pa">
            技术核定单基本信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14" :xs="12">
              <el-form-item label="工作类型：" class="mt-10 w creat-new-form" prop="jobType">
                <el-select @change="changeProjectWorkType" placeholder="请选择工作类型" v-model="creatProjectWorkData.jobType">
                  <el-option label="实施方案" value="实施方案"></el-option>
                  <el-option label="交底资料" value="交底资料"></el-option>
                  <el-option label="合同" value="合同"></el-option>
                  <el-option label="月报" value="月报"></el-option>
                  <el-option label="动态成本" value="动态成本"></el-option>
                  <el-option label="收发文登记" value="收发文登记"></el-option>
                  <el-option label="点工表" value="点工表"></el-option>
                  <el-option label="其他" value="其他"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="10" v-if="creatProjectWorkData.dataShow">
              <el-form-item label="时间：" class="mt-10 w creat-new-form" prop="jobMonth">
                <el-col :sm="12" :xs="12">
                  <el-date-picker :editable="false" :clearable="false" v-model="creatProjectWorkData.jobMonth" type="month" placeholder="请选择年月"></el-date-picker>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content pr mt-40" v-if="creatProjectWorkData.contractShow">
          <nav class="pa">
            技术核定单基本信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14" :xs="12">
              <el-form-item label="合同名称：" class="mt-10 w creat-new-form" prop="contractName">
                <el-input class="w" v-model="creatProjectWorkData.contractName" size="small" placeholder="请填写合同名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14" :xs="12">
              <el-form-item label="合同编号：" class="mt-10 w creat-new-form" prop="contractNumber">
                <el-input class="w" v-model="creatProjectWorkData.contractNumber" size="small" placeholder="请填写合同编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="发包人：" class="mt-10 w creat-new-form" prop="sendPackagePerson">
                <el-input class="w" v-model="creatProjectWorkData.sendPackagePerson" size="small" placeholder="请填写发包人"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14" :xs="12">
              <el-form-item label="合同金额（元）：" class="mt-10 w creat-new-form" prop="contractAmount">
                <el-input class="w" v-model="creatProjectWorkData.contractAmount" size="small" placeholder="请填写合同金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="承包人：" class="mt-10 w creat-new-form" prop="contractor">
                <el-input class="w" v-model="creatProjectWorkData.contractor" size="small" placeholder="请填写承包人"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14" :xs="12">
              <el-form-item label="合同类型：" class="mt-10 w creat-new-form" prop="contractType">
                <el-input class="w" v-model="creatProjectWorkData.contractType" size="small" placeholder="请填写合同类型"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="开工日期：" class="mt-10 w creat-new-form" prop="startDateStr">
                <el-date-picker :editable="false" v-model="creatProjectWorkData.startDateStr" class="w" size="small" type="date" placeholder="请选择开工日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14" :xs="12">
              <el-form-item label="合同工期（天）：" class="mt-10 w creat-new-form" prop="contractPeriod">
                <el-input class="w" v-model="creatProjectWorkData.contractPeriod" size="small" placeholder="请填写合同工期"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="竣工日期：" class="mt-10 w creat-new-form" prop="completionDateStr">
                <el-date-picker :editable="false" v-model="creatProjectWorkData.completionDateStr" class="w" size="small" type="date" placeholder="请选择竣工日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14" :xs="12">
              <el-form-item label="质量要求：" class="mt-10 w creat-new-form" prop="qualityRequirement">
                <el-input type="textarea" class="w" v-model="creatProjectWorkData.qualityRequirement" size="small" placeholder="请填写质量要求"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14" :xs="12">
              <el-form-item label="付款方式：" class="mt-10 w creat-new-form" prop="payType">
                <el-radio-group v-model="creatProjectWorkData.payType">
                  <el-radio class="radio" label="转账">转账</el-radio>
                  <el-radio class="radio" label="现金">现金</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="签订日期：" class="mt-10 w creat-new-form" prop="signDateStr">
                <el-date-picker :editable="false" v-model="creatProjectWorkData.signDateStr" class="w" size="small" type="date" placeholder="请选择签订日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14" :xs="12">
              <el-form-item label="备注：" class="mt-10 w creat-new-form" prop="remark">
                <el-input type="textarea" class="w" v-model="creatProjectWorkData.remark" size="small" placeholder="请填写备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content  pr mt-40" v-if="creatProjectWorkData.fileList">
          <nav class="pa">
            项目工作附件信息
          </nav>
          <el-table class="noShadow" :data="creatProjectWorkData.enclosureFiles" style="width: 100%">
            <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
            <el-table-column prop="fileName" label="文件名称"></el-table-column>
            <el-table-column prop="createTimeStr" width="170" label="上传时间"></el-table-column>
            <el-table-column prop="createUser" width="100" label="上传人"></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                  <el-button v-if="creatProjectWorkData.delShow" @click="delWholeAnalysisFile(scope.row,scope.$index)" class="color-green" type="text" size="small">删除</el-button>
                  </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="icms-dialog-content  pr mt-40">
          <nav class="pa">
            上传附件 - 其它附件
          </nav>
          <el-upload class="upload-file w mt-10" ref="upload" :data="wholeWorkFileType" :on-remove="uploadWholeContractRemove" :on-error="fileError" :on-success="uploadChildDataSuccess" drag action="icms/wholeprocess/upload/uploadWholeprocessFile" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoadingSubmit" v-if="creatProjectWorkData.editSave&&creatProjectWorkData.submitSHow&&creatProjectWorkData.processState=='项目工作'" class="btn-green shadow mt-15" type="primary" @click='submitEditSaveProjectWorkData("creatProjectWorkData")'><i class="iconfont icon-save f14 mr-5"></i>提 交</el-button>
          <el-button :loading="buttonLoadingSubmit" v-if="creatProjectWorkData.newSave&&creatProjectWorkData.submitSHow" class="btn-green shadow mt-15" type="primary" @click='submitSaveProjectWorkData("creatProjectWorkData")'><i class="iconfont icon-save f14 mr-5"></i>提 交</el-button>
          <el-button :loading="buttonLoading" v-if="creatProjectWorkData.editSave" class="btn-orange shadow mt-15" type="primary" @click='editSaveProjectWorkData("creatProjectWorkData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button :loading="buttonLoading" v-if="creatProjectWorkData.newSave" class="btn-orange shadow mt-15" type="primary" @click='saveProjectWorkData("creatProjectWorkData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow mt-15" @click='creatOtherDialog=false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 普通审核 -->
  <el-dialog :visible.sync="reviewEndDialog" size="tiny" custom-class="icms-dialog">
    <span slot="title">审核-项目工作</span>
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

  <!-- 查看项目工作 -->
  <el-dialog :visible.sync="viewProjectWorkDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 项目工作</span>
    <div class="dialog-box">
      <div class="icms-dialog-content  pr mt-10">
        <nav class="pa">
          项目基本信息
        </nav>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="4" :xs="12">
            <div class="grid-content tr">工作类型：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewProjectWorkData.jobTypeStr}}</div>
          </el-col>
          <el-col :sm="12">
            <el-col :sm="8" :xs="12">
              <div class="grid-content tr">上报时间：</div>
            </el-col>
            <el-col :sm="16" :xs="12">
              <div class="grid-content">{{viewProjectWorkData.createTimeStr}}</div>
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content  pr mt-40">
        <nav class="pa">
          项目详细要求
        </nav>
        <el-table class="noShadow" :data="viewProjectWorkData.infoFiles" style="width: 100%" highlight-current-row>
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
  <!-- 查看项目进度 -->
  <el-dialog :visible.sync="viewProjectProgressDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 项目进度</span>
    <div class="dialog-box">
      <div class="icms-dialog-content  pr mt-10">
        <nav class="pa">
          项目基本信息
        </nav>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="4" :xs="12">
            <div class="grid-content tr">工项目编号：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{ProjectProgressData.projectNumber?ProjectProgressData.projectNumber:"--"}}</div>
          </el-col>
          <el-col :sm="12">
            <el-col :sm="8" :xs="12">
              <div class="grid-content tr">项目名称：</div>
            </el-col>
            <el-col :sm="16" :xs="12">
              <div class="grid-content">{{ProjectProgressData.projectName?ProjectProgressData.projectName:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="4" :xs="12">
            <div class="grid-content tr">分管副总：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{ProjectProgressData.vicePresident?ProjectProgressData.vicePresident:"--"}}</div>
          </el-col>
          <el-col :sm="12">
            <el-col :sm="8" :xs="12">
              <div class="grid-content tr">项目经理：</div>
            </el-col>
            <el-col :sm="16" :xs="12">
              <div class="grid-content">{{ProjectProgressData.projectManager?ProjectProgressData.projectManager:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content  pr mt-40">
        <nav class="pa">
          项目工作基本信息
        </nav>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="4" :xs="12">
            <div class="grid-content tr">工作类型：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{ProjectProgressData.jobTypeStr}}</div>
          </el-col>
          <el-col :sm="12">
            <el-col :sm="8" :xs="12">
              <div class="grid-content tr">上报时间：</div>
            </el-col>
            <el-col :sm="16" :xs="12">
              <div class="grid-content">{{ProjectProgressData.createTimeStr}}</div>
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content pr p15 mt-40">
        <nav class="pa">
          专业工作流程进度信息
        </nav>
        <el-row :gutter="16" class="oa">
          <el-col :sm="24">
            <el-steps class="oa pl-10" :space="120" :active="ProjectProgressData.processStateNum" finish-status="success" :align-center="true" :center="true">
              <el-step v-for="item in ProjectProgressData.stepData" key="null" :title="item"></el-step>
            </el-steps>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content pr mt-40">
        <nav class="pa">
          项目工作流程处理信息
        </nav>
        <el-table class="noShadow" :data="ProjectProgressData.historyInfo" style="width: 100%" highlight-current-row>
          <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
          <el-table-column prop="processState" label="处理步骤"></el-table-column>
          <el-table-column prop="processor" width="100" label="处理人"></el-table-column>
          <el-table-column prop="processTimeStr" width="190" label="处理时间"></el-table-column>
          <el-table-column prop="processResult" width="90" label="处理结果"></el-table-column>
          <el-table-column label="处理意见" width="150">
            <template slot-scope="scope">
                {{scope.row.processOpinion?scope.row.processOpinion:"--"}}
                </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
  <!-- 留言簿弹窗 -->
  <el-dialog :visible.sync="sendMessageDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 项目留言簿</span>
    <div class="dialog-box">
      <header class="bg-color-white pr header-search">
        <el-form :inline="true" ref="sendMessageSearch" :model="sendMessageSearch" class="demo-form-inline" label-width="80px">
          <el-form-item label="留言内容:" prop="leaveMsgContent">
            <el-input class="w" v-model="sendMessageSearch.leaveMsgContent" size="small" placeholder="请填写留言内容"></el-input>
          </el-form-item>
          <el-form-item label="回复内容:" prop="replyMsgContent">
            <el-input class="w" v-model="sendMessageSearch.replyMsgContent" size="small" placeholder="请填写回复内容"></el-input>
          </el-form-item>
        </el-form>
        <div class="tc wait-header-btn f13 mb-10">
          <el-button class="btn-orange shadow mt-15" type="primary" @click="searchSendMessageBtn"><i class="iconfont icon-shiliangzhinengduixiang f12 mr-5"></i>查 询</el-button>
          <el-button @click='resetForm("sendMessageSearch")' type="primary" class="btn-indigo shadow mt-15"><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
          <el-button v-if="userInfo.userRoleNames.indexOf('企业用户')!=-1" @click='creatSendMessageBtn' type="primary" class="btn-blue shadow mt-15"><i class="iconfont icon-iconfont707 f13 mr-5"></i>新增留言</el-button>
        </div>
      </header>
      <section class="p20">
        <el-table class="noShadow" style="width: 100%" :data="sendMessageSearch.lists">
          <el-table-column type="index" width="40" label="编号" align="center"></el-table-column>
          <el-table-column min-width="170" prop="leaveMsgContent" label="业主留言"></el-table-column>
          <el-table-column prop="leaveTimeStr" width="150" label="留言时间" align="left"></el-table-column>
          <el-table-column prop="leaveUser" width="150" label="留言人" align="left"></el-table-column>
          <el-table-column prop="replyMsgContent" width="200" label="回复留言 "></el-table-column>
          <el-table-column prop="replyTimeStr" width="100" label="回复时间"></el-table-column>
          <el-table-column prop="replyUser" width="100" label="回复人"></el-table-column>
          <el-table-column label="操作" width="150" align="left">
            <template slot-scope="scope">
              <el-button @click="viewSendMessageBtn(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="editSendMessageBtn(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click="replaySendMessageBtn(scope.row)" type="text" size="small">回复</el-button>
              <el-button @click="delSendMessageBtn(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>
      <footer class="cb pagination p20">
        <el-pagination @current-change="changeSendMessageSearch" :current-page.sync="sendMessageSearch.page" :page-size="10" layout="prev, pager, next, jumper" :total="sendMessageSearch.total" class="fr">
        </el-pagination>
        <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{sendMessageSearch.total}}条记录</span>
      </footer>
    </div>
  </el-dialog>
  <!-- 新增留言 -->
  <el-dialog :visible.sync="creatSendMessageDialog" size="small" custom-class="icms-dialog">
    <span slot="title">新增 - 留言信息</span>
    <div class="dialog-box">
      <el-form :model="creatSendMessage" ref="creatSendMessage" :inline="true" label-width="35%" :rules="creatSendMessageRules">

        <div class="icms-dialog-content pr mt-10">
          <nav class="pa">
            业主留言
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14" :xs="12">
              <el-form-item label="留言内容：" class="mt-10 w creat-new-form" prop="leaveMsgContent">
                <el-input type="textarea" class="w" v-model="creatSendMessage.leaveMsgContent" size="small" placeholder="请输入留言内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14" :xs="12">
              <el-form-item label="留言人：" class="mt-10 w creat-new-form" prop="leaveUser">
                <el-input class="w" v-model="creatSendMessage.leaveUser" size="small" placeholder="请输入留言人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="留言时间：" class="mt-10 w creat-new-form" prop="leaveTimeStr">
                <el-date-picker :editable="false" v-model="creatSendMessage.leaveTimeStr" size="mini" type="date" placeholder="选择资料收到日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button v-if="creatSendMessage.editShow" class="btn-orange shadow" type="primary" @click='editSaveSengMessageBtn("creatSendMessage")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button v-if="creatSendMessage.newShow" class="btn-orange shadow" type="primary" @click='saveSengMessageBtn("creatSendMessage")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='creatSendMessageDialog=false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 查看留言 -->
  <el-dialog :visible.sync="viewSendMessageDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 留言簿</span>
    <div class="dialog-box">
      <div class="icms-dialog-content  pr mt-10">
        <nav class="pa">
          留言簿
        </nav>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="4" :xs="12">
            <div class="grid-content tr">留言内容：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewSendMessageData.leaveMsgContent?viewSendMessageData.leaveMsgContent:"--"}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="4" :xs="12">
            <div class="grid-content tr">留言人：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewSendMessageData.leaveUser?viewSendMessageData.leaveUser:"--"}}</div>
          </el-col>
          <el-col :sm="12" :xs="12">
            <el-col :sm="8" :xs="12">
              <div class="grid-content tr">留言时间：</div>
            </el-col>
            <el-col :sm="16">
              <div class="grid-content">{{viewSendMessageData.leaveTimeStr?viewSendMessageData.leaveTimeStr:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="4" :xs="12">
            <div class="grid-content tr">回复内容：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewSendMessageData.replyMsgContent?viewSendMessageData.replyMsgContent:"--"}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="4" :xs="12">
            <div class="grid-content tr">回复人：</div>
          </el-col>
          <el-col :sm="8" :xs="12">
            <div class="grid-content">{{viewSendMessageData.replyUser?viewSendMessageData.replyUser:"--"}}</div>
          </el-col>
          <el-col :sm="12" :xs="12">
            <el-col :sm="8" :xs="12">
              <div class="grid-content tr">回复时间：</div>
            </el-col>
            <el-col :sm="16">
              <div class="grid-content">{{viewSendMessageData.replyTimeStr?viewSendMessageData.replyTimeStr:"--"}}</div>
            </el-col>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-dialog>
  <!-- 回复留言 -->
  <el-dialog :visible.sync="replaySendMessageDialog" size="small" custom-class="icms-dialog">
    <span slot="title">回复 - 留言簿</span>
    <div class="dialog-box">
      <div class="icms-dialog-content  pr mt-10">
        <nav class="pa">
          留言簿
        </nav>
        <el-form :model="replaySendMessageData" ref="replaySendMessageData" :inline="true" label-width="35%" :rules="replaySendMessageRules">
          <el-row :gutter="16">
            <el-col :sm="14" :xs="12">
              <el-form-item label="留言内容：" class="mt-10 w creat-new-form">
                {{replaySendMessageData.leaveMsgContent?replaySendMessageData.leaveMsgContent:"--"}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14" :xs="12">
              <el-form-item label="留言人：" class="mt-10 w creat-new-form">
                {{replaySendMessageData.leaveUser?replaySendMessageData.leaveUser:"--"}}
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="留言时间：" class="mt-10 w creat-new-form">
                {{replaySendMessageData.leaveTimeStr?replaySendMessageData.leaveTimeStr:"--"}}
              </el-form-item>
            </el-col>
          </el-row>


          <el-row :gutter="16" class="mt-20">
            <el-col :sm="14" :xs="12">
              <el-form-item label="回复内容：" class="mt-10 w creat-new-form" prop="replyMsgContent">
                <el-input type="textarea" class="w" v-model="replaySendMessageData.replyMsgContent" size="small" placeholder="请输入回复内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="14" :xs="12">
              <el-form-item label="回复人：" class="mt-10 w creat-new-form" prop="replyUser">
                <el-input class="w" v-model="replaySendMessageData.replyUser" size="small" placeholder="请输入回复人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="10">
              <el-form-item label="回复时间：" class="mt-10 w creat-new-form" prop="replyTimeStr">
                <el-date-picker :editable="false" v-model="replaySendMessageData.replyTimeStr" size="mini" type="date" placeholder="选择回复时间"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </div>
      <div class="dialog-footer tc mt-40">
        <el-button class="btn-orange shadow" type="primary" @click='saveReplaySengMessageBtn("replaySendMessageData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
        <el-button class="btn-white shadow" @click='replaySendMessageDialog=false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
      </div>
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
      buttonLoading: false,
      buttonLoadingSubmit: false,
      buttonLoadingConfirm: false,
      routerExistence: this.$route.query.projectId,
      fromPathPage: this.$route.query.fromPathPage,
      wholeFileType: {
        fileType: "项目详细要求"
      },
      wholeWorkFileType: {
        fileType: "项目工作"
      },
      vicePresident: [],
      replaySendMessageDialog: false,
      replaySendMessageData: {
        "leaveMsgContent": null,
        "leaveTimeStr": null,
        "leaveUser": null,
        "replyMsgContent": null,
        "replyTimeStr": new Date(),
        "replyUser": null
      },
      replaySendMessageRules: {
        replyMsgContent: [{
          required: true,
          message: '请输入回复内容'
        }],
      },
      viewSendMessageDialog: false,
      viewSendMessageData: {
        "leaveMsgContent": null,
        "leaveTimeStr": null,
        "leaveUser": null,
        "replyMsgContent": null,
        "replyTimeStr": null,
        "replyUser": null
      },
      sendMessageDialog: false,
      sendMessageSearch: {
        leaveMsgContent: '',
        replyMsgContent: '',
        pageNum: 1,
        total: 0,
        lists: []
      },
      creatSendMessageDialog: false,
      creatSendMessage: {
        editShow: false,
        newShow: true,

        leaveMsgContent: '',
        leaveUser: '',
        leaveTimeStr: new Date()
      },
      creatSendMessageRules: {
        leaveMsgContent: [{
          required: true,
          message: '请输入留言内容'
        }],
      },
      viewProjectWorkDialog: false,
      viewProjectWorkData: {
        jobTypeStr: '',
        createTimeStr: '',
        infoFiles: []
      },
      viewProjectProgressDialog: false,
      ProjectProgressData: {
        projectNumber: '',
        projectName: '',
        projectManager: '',
        vicePresident: '',
        projectManager: '',
        jobTypeStr: '',
        createTimeStr: '',
        processStateNum: 0,
        stepData: [],
        historyInfo: []
      },
      projectWorkNextDialog: false,
      reviewEndDialog: false,
      reviewEndData: {
        issueEdit: "通过",
        issueOpinion: ""
      },
      projectWorkNextSms: null,
      projectWorkDialog: false, //项目工作弹窗
      creatProjectWorkDialog: false,
      creatProjectWorkData: {
        title: '新增 - 项目工作信息',
        delShow: true,
        newSave: true,
        editSave: false,
        fileList: false,

        dataShow: false,
        contractShow: false,
        submitSHow: true,

        jobType: "实施方案",
        jobYear: new Date(),
        jobMonth: new Date(),

        contractName: '',
        contractNumber: '',
        sendPackagePerson: '',
        contractAmount: '',
        contractor: '',
        contractor: '',
        contractType: '',
        startDateStr: '',
        contractPeriod: '',
        completionDateStr: '',
        qualityRequirement: '',
        payType: '转账',
        signDateStr: '',
        remark: '',

        enclosureFiles: [],
        uploadFiles: []
      },
      creatProjectWorkDataRules: {
        contractName: [{
          required: true,
          message: '请填写合同名称'
        }],
        contractNumber: [{
          required: true,
          message: '请填写合同编号'
        }],
        contractAmount: [{
          required: true,
          message: '请填写合同金额'
        }],
        startDateStr: [{
          required: true,
          message: '请填写开工日期'
        }],
        completionDateStr: [{
          required: true,
          message: '请填写竣工日期'
        }],
        signDateStr: [{
          required: true,
          message: '请填写签订日期'
        }]

      },
      exportLoading: false,
      importExcelDialog: false,
      examineProjectDialog: false,
      distributionUser: [],
      multipleSelection: [],
      loginUser: this.$store.state.app.userInfo.userName,
      userInfo: this.$store.state.app.userInfo,
      singleRejectDialog: false,
      newConfirmNextDialog: false,
      confirmNextDialog: false,
      checkNextSms: null,
      newCheckNextSms: null,
      editCostCreatDialog: false,
      supplementFileDialog: false,
      saveDataFileDialog: false,
      listLoading: true,
      viewLoading: false,
      projectWork: {
        creatNewProject: false,

        jobTypeProjectWork: '',
        createTimeStr: '',
        processStateProjectWork: '',
        id: null,
        page: 1,
        total: 0,
        projectData: []
      },
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
      distributeSingleDialog: false,
      creatNew: false,
      pageNum: 1,
      total: 0,
      newProjectData: {
        // 项目基本信息
        projectName: '',
        projectNumber: '',
        contractNumber: '',
        informationReceivedDateStr: '',
        agreedJobCompletionDateStr: '',
        projectLocation: '',
        importance: '普通',
        vicePresident: '',
        delegateUnitName: '',
        delegateUnitContact: '',
        delegateUnitPhone: '',
        unitName: '',
        unitContact: '',
        unitPhone: '',
        // 档案资料
        projectDetailRequirementsFiles: []
      },
      editProjectData: {
        // 项目基本信息
        projectName: '',
        projectNumber: '',
        contractNumber: '',
        informationReceivedDateStr: '',
        agreedJobCompletionDateStr: '',
        projectLocation: '',
        importance: '普通',
        vicePresident: '',
        delegateUnitName: '',
        delegateUnitContact: '',
        delegateUnitPhone: '',
        unitName: '',
        unitContact: '',
        unitPhone: '',
        // 档案资料
        projectDetailRequirementsFiles: []
      },
      newProjectRules: {
        projectName: [{
          required: true,
          message: '请输入项目名称',
          trigger: 'blur'
        }],
        delegateUnitName: [{
          required: true,
          message: '请输入委托单位名称',
        }],
        delegateUnitContact: [{
          required: true,
          message: '请输入委托单位联系人'
        }],
        delegateUnitPhone: [{
          required: true,
          message: '请输入委托单位电话'
        }],
        unitName: [{
          required: true,
          message: '请输入建设单位名称'
        }],
        unitContact: [{
          required: true,
          message: '请输入建设单位联系人'
        }],
        unitPhone: [{
          required: true,
          message: '请输入建设单位联系方式'
        }]
      },
      projectSearch: {
        projectName: '',
        projectManager: '',
        delegateUnitName: '',
        processState: ''
      },
      viewProjectData: {
        // 项目基本信息
        projectName: '',
        projectNumber: '',
        contractNumber: '',
        informationReceivedDateStr: '',
        agreedJobCompletionDateStr: '',
        projectLocation: '',
        importance: '',
        delegateUnitName: '',
        delegateUnitContact: '',
        delegateUnitPhone: '',
        unitName: '',
        unitContact: '',
        unitPhone: '',
        vicePresident: '',
        projectManager: '',
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
      },
      wholeProcessId: '',
      consultantChange: ''
    }
  },
  filters: {
    setDownloadUrl(url) {
      return `${location.origin}/icms/wholeprocess/download/pmJobFile?id=${url}`;
    },
    setInfoDownloadUrl(url) {
      return `${location.origin}/icms/wholeprocess/download/wholeProcessFile?id=${url}`;
    }
  },
  mounted() {
    this.roleBtnShow() //按钮隐藏
    this.setWaitFun() //代办事件处理
    this.getdistributionInfo();
  },
  methods: {
    roleBtnShow() {
      let meanRole = this.$store.state.app.userInfo.menus;
      //console.log("项目于管理", meanRole);
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
    setWaitFun() {
      if (this.$route.query.projectId && this.$route.query.jobId) {
        this.searchInfo.id = this.$route.query.projectId
        this.getProjectList(this.pageNum, this.searchInfo);
        this.projectWorkDialog = true;
        this.projectWork.id = this.$route.query.jobId;
        this.searchProjectWorkFunc();
      } else if (this.$route.query.projectId) {
        this.searchInfo.id = this.$route.query.projectId
        this.getProjectList(this.pageNum, this.searchInfo);
      } else {
        this.getProjectList(this.pageNum);
      }
    },
    saveReplaySengMessageBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let submitData = {
            "id": this.replaySendMessageData.editId,
            "leaveMsgContent": this.replaySendMessageData.leaveMsgContent,
            "leaveTime": null,
            "leaveTimeStr": formatDateShort(this.replaySendMessageData.leaveTimeStr),
            "leaveUser": this.replaySendMessageData.leaveUser,
            "moduleName": "全过程",
            "projectId": this.wholeProjectId,
            "replyMsgContent": this.replaySendMessageData.replyMsgContent,
            "replyTime": null,
            "replyTimeStr": formatDateShort(this.replaySendMessageData.replyTimeStr),
            "replyUser": this.replaySendMessageData.replyMsgContent
          }
          this.publicFun.httpRequest("put", `guestbook/update`, submitData, (status, data, message) => {
            if (status == 0) {
              this.$message.success(message);
              this.replaySendMessageDialog = false;
              this.getSengMessageList()
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
    replaySendMessageBtn(row) {
      this.replaySendMessageDialog = true;
      this.replaySendMessageData.leaveMsgContent = row.leaveMsgContent;
      this.replaySendMessageData.leaveTimeStr = row.leaveTimeStr;
      this.replaySendMessageData.leaveUser = row.leaveUser;
      this.replaySendMessageData.editId = row.id;
      this.replaySendMessageData.replyMsgContent = row.replyMsgContent;
      this.replaySendMessageData.replyTimeStr = row.replyTimeStr;
      this.replaySendMessageData.replyUser = row.replyUser ? row.replyUser : this.$store.state.app.userInfo.userName;
    },
    viewSendMessageBtn(row) {
      this.viewSendMessageDialog = true;
      this.viewSendMessageData = {
        "leaveMsgContent": row.leaveMsgContent,
        "leaveTimeStr": row.leaveTimeStr,
        "leaveUser": row.leaveUser,
        "replyMsgContent": row.replyMsgContent,
        "replyTimeStr": row.replyTimeStr,
        "replyUser": row.replyUser
      }
    },
    editSaveSengMessageBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let submitData = {
            "id": this.creatSendMessage.editId,
            "leaveMsgContent": this.creatSendMessage.leaveMsgContent,
            "leaveTime": null,
            "leaveTimeStr": formatDateShort(this.creatSendMessage.leaveTimeStr),
            "leaveUser": this.creatSendMessage.leaveUser,
            "moduleName": "全过程",
            "projectId": this.wholeProjectId,
            "replyMsgContent": null,
            "replyTime": null,
            "replyTimeStr": null,
            "replyUser": null
          }
          this.publicFun.httpRequest("put", `guestbook/update`, submitData, (status, data, message) => {
            if (status == 0) {
              this.$message.success(message);
              this.creatSendMessageDialog = false;
              this.getSengMessageList()
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
    editSendMessageBtn(row) {
      this.creatSendMessageDialog = true;
      this.creatSendMessage = {
        editShow: true,
        newShow: false,

        leaveMsgContent: row.leaveMsgContent,
        leaveUser: row.leaveUser,
        leaveTimeStr: row.leaveTimeStr
      }
      this.creatSendMessage.editId = row.id;
    },
    delSendMessageBtn(row) {
      this.$confirm('确认要删除此项目吗？', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.publicFun.httpRequest("delete", `guestbook/delete?id=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.getSengMessageList();
          }
        })
      }).catch(() => {});

    },
    saveSengMessageBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let submitData = {
            "id": -1,
            "leaveMsgContent": this.creatSendMessage.leaveMsgContent,
            "leaveTime": null,
            "leaveTimeStr": formatDateShort(this.creatSendMessage.leaveTimeStr),
            "leaveUser": this.creatSendMessage.leaveUser,
            "moduleName": "全过程",
            "projectId": this.wholeProjectId,
            "replyMsgContent": null,
            "replyTime": null,
            "replyTimeStr": null,
            "replyUser": null
          }
          this.publicFun.httpRequest("post", `guestbook/add`, submitData, (status, data, message) => {
            if (status == 0) {
              this.$message.success(message);
              this.creatSendMessageDialog = false;
              this.getSengMessageList()
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
    sengMessageBtn(row) {
      //console.log(row)
      this.wholeProjectId = row.id;
      this.sendMessageDialog = true;
      this.getSengMessageList();
    },
    searchSendMessageBtn() {
      this.getSengMessageList();
    },
    creatSendMessageBtn() {
      this.creatSendMessageDialog = true;
      this.creatSendMessage = {
        editShow: false,
        newShow: true,

        leaveMsgContent: '',
        leaveUser: '',
        leaveTimeStr: new Date()
      }
    },
    changeSendMessageSearch(val) {
      this.sendMessageSearch.pageNum = val;
      this.getSengMessageList();
    },
    getSengMessageList() {
      let params = {
        page: this.sendMessageSearch.pageNum,
        rows: 10,
        projectId: this.wholeProjectId,
        moduleName: "全过程",
        leaveMsgContent: this.sendMessageSearch.leaveMsgContent.trim(),
        replyMsgContent: this.sendMessageSearch.replyMsgContent.trim()
      }
      this.publicFun.httpRequest("get", 'guestbook/list', null, (status, data, message) => {
        if (status == 0) {
          //console.log(data);
          this.sendMessageSearch.lists = data.rows;
          this.sendMessageSearch.total = data.total;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    endProjectBtn(row) {
      this.publicFun.httpRequest("get", `wholeprocess/isWholeProcessAllFlowsFinished?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          if (data) {
            this.$confirm('该项目所有子流程已全部完成，可以结束项目！', {
              cancelButtonText: '取消',
              confirmButtonText: '确定',
              type: 'warning',
              showClose: false
            }).then(() => {
              this.publicFun.httpRequest("post", `wholeprocess/finishedAllFlows?id=${row.id}`, null, (status, data, message) => {
                if (status == 0) {
                  this.getProjectList();
                } else {
                  this.$message.error(message);
                }
              });
            }).catch(() => {});
          } else {
            this.$confirm('该项目所有子流程尚未全部完成，是否强制结束项目？', {
              cancelButtonText: '取消',
              confirmButtonText: '确定',
              type: 'error',
              showClose: false
            }).then(() => {
              this.publicFun.httpRequest("post", `wholeprocess/finishedAllFlows?id=${row.id}`, null, (status, data, message) => {
                if (status == 0) {
                  this.getProjectList();
                } else {
                  this.$message.error(message);
                }
              });
            }).catch(() => {});
          }
        } else {
          this.$message.error(message);
        }
      });
    },
    delProjectWorkBtn(row, index) {
      this.$confirm('确认要删除此项目吗？', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.publicFun.httpRequest("delete", `wholeprocess/deletePMJob?jobId=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.searchProjectWorkFunc();
          } else {
            this.$message.error(message);
          }
        });
      }).catch(() => {});
    },
    viewProjectWorkBtn(row) {
      this.viewProjectWorkDialog = true;
      this.viewProjectWorkData = {
        jobTypeStr: row.jobTypeStr,
        createTimeStr: row.createTimeStr,
        infoFiles: []
      }
      this.publicFun.httpRequest("get", `wholeprocess/getPMJobFilesByJobId?jobId=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.viewProjectWorkData.infoFiles = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    ProjectWorkProgressBtn(row) {
      this.viewProjectProgressDialog = true;
      this.ProjectProgressData.jobTypeStr = row.jobTypeStr;
      this.ProjectProgressData.createTimeStr = row.createTimeStr;
      this.ProjectProgressData.stepData = ["项目工作", "分管副总审核", "完成"];
      switch (row.processState) {
        case "项目工作":
          this.ProjectProgressData.processStateNum = 0;
          break;
        case "分管副总审核":
          this.ProjectProgressData.processStateNum = 1;
          break;
        case "完成":
          this.ProjectProgressData.processStateNum = 3;
          break;
      }
      this.publicFun.httpRequest("get", `history/get?type=biz_wholeprocess_pm&bizId=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.ProjectProgressData.historyInfo = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    submitEndReviewBtn() {
      let reviewData = {
        id: this.creatProjectWorkData.editId,
        version: this.creatProjectWorkData.version,
        approveResult: this.reviewEndData.issueEdit,
        approveOpinion: this.reviewEndData.issueOpinion
      }
      this.buttonLoading = true;
      this.publicFun.httpRequest("post", `wholeprocess/submitProjectWorkFlow`, reviewData, (status, data, message) => {
        if (status == 0) {
          if (this.routerExistence) {
            this.$message.success(message);
            setTimeout(() => {
              this.buttonLoading = false;
              if (this.fromPathPage == "wait") {
                this.$router.push({
                  path: '/waitList',
                  query: {
                    fromPath: "wholeProject"
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
            this.reviewEndDialog = false;
            this.buttonLoading = false;
            this.searchProjectWorkFunc()
          }
        } else {
          this.$message.error(message);
        }
      });
    },
    reviewProjectWorkBtn(row) {
      //console.log(row)
      this.reviewEndDialog = true;
      this.creatProjectWorkData.editId = row.id;
      this.creatProjectWorkData.version = row.version;
    },
    submitEditSaveProjectWorkData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let contractData = {
            "approveOpinion": null,
            "approveResult": null,
            "completionDate": null,
            "completionDateStr": formatDateShort(this.creatProjectWorkData.completionDateStr),
            "contractAmount": this.creatProjectWorkData.contractAmount,
            "contractName": this.creatProjectWorkData.contractName,
            "contractNumber": this.creatProjectWorkData.contractNumber,
            "contractPeriod": this.creatProjectWorkData.contractPeriod,
            "contractType": this.creatProjectWorkData.contractType,
            "contractor": this.creatProjectWorkData.contractor,
            "createTime": null,
            "createTimeStr": null,
            "createUser": null,
            "id": this.creatProjectWorkData.editId,
            "isSendMsg": null,
            "jobMonth": this.publicFun.formatDateMonth(this.creatProjectWorkData.jobMonth),
            "jobType": this.creatProjectWorkData.jobType,
            "jobTypeStr": null,
            "jobYear": this.publicFun.formatDateYear(this.creatProjectWorkData.jobMonth),
            "payType": this.creatProjectWorkData.payType,
            "processState": null,
            "projectWorkFiles": this.creatProjectWorkData.uploadFiles.length > 0 ? JSON.stringify(this.creatProjectWorkData.uploadFiles) : null,
            "qualityRequirement": this.creatProjectWorkData.qualityRequirement,
            "remark": this.creatProjectWorkData.remark,
            "sendPackagePerson": this.creatProjectWorkData.sendPackagePerson,
            "signDateDate": null,
            "signDateStr": formatDateShort(this.creatProjectWorkData.signDateStr),
            "startDate": null,
            "startDateStr": formatDateShort(this.creatProjectWorkData.startDateStr),
            "updateTime": null,
            "updateUser": null,
            "version": this.creatProjectWorkData.version,
            "wholeProcessId": this.wholeProcessId
          }
          this.buttonLoadingSubmit = true;
          this.publicFun.httpRequest("put", `wholeprocess/updatePMJob`, contractData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoadingSubmit = false;
              this.projectWorkNextDialog = true;
              this.searchProjectWorkFunc()
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
    editSaveProjectWorkData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let contractData = {
            "approveOpinion": null,
            "approveResult": null,
            "completionDate": null,
            "completionDateStr": formatDateShort(this.creatProjectWorkData.completionDateStr),
            "contractAmount": this.creatProjectWorkData.contractAmount,
            "contractName": this.creatProjectWorkData.contractName,
            "contractNumber": this.creatProjectWorkData.contractNumber,
            "contractPeriod": this.creatProjectWorkData.contractPeriod,
            "contractType": this.creatProjectWorkData.contractType,
            "contractor": this.creatProjectWorkData.contractor,
            "createTime": null,
            "createTimeStr": null,
            "createUser": null,
            "id": this.creatProjectWorkData.editId,
            "isSendMsg": null,
            "jobMonth": this.publicFun.formatDateMonth(this.creatProjectWorkData.jobMonth),
            "jobType": this.creatProjectWorkData.jobType,
            "jobTypeStr": null,
            "jobYear": this.publicFun.formatDateYear(this.creatProjectWorkData.jobMonth),
            "payType": this.creatProjectWorkData.payType,
            "processState": null,
            "projectWorkFiles": this.creatProjectWorkData.uploadFiles.length > 0 ? JSON.stringify(this.creatProjectWorkData.uploadFiles) : null,
            "qualityRequirement": this.creatProjectWorkData.qualityRequirement,
            "remark": this.creatProjectWorkData.remark,
            "sendPackagePerson": this.creatProjectWorkData.sendPackagePerson,
            "signDateDate": null,
            "signDateStr": formatDateShort(this.creatProjectWorkData.signDateStr),
            "startDate": null,
            "startDateStr": formatDateShort(this.creatProjectWorkData.startDateStr),
            "updateTime": null,
            "updateUser": null,
            "version": this.creatProjectWorkData.version,
            "wholeProcessId": this.wholeProcessId
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("put", `wholeprocess/updatePMJob`, contractData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.creatProjectWorkDialog = false;
              this.searchProjectWorkFunc()
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
    editProjectWorkBtn(row) {
      //console.log("数据", row)
      this.creatProjectWorkDialog = true;
      if (this.creatProjectWorkData.uploadFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.creatProjectWorkData = {
        title: '修改 - 项目工作信息',
        delShow: false,
        newSave: false,
        editSave: true,
        fileList: true,

        dataShow: false,
        contractShow: false,
        submitSHow: true,
        processState: row.processState,

        jobType: row.jobType,
        jobYear: row.jobYear,
        jobMonth: row.jobYear + "-" + row.jobMonth,

        contractName: row.contractName,
        contractNumber: row.contractNumber,
        sendPackagePerson: row.sendPackagePerson,
        contractAmount: row.contractAmount,
        contractor: row.contractor,
        contractor: row.contractor,
        contractType: row.contractType,
        startDateStr: row.startDateStr,
        contractPeriod: row.contractPeriod,
        completionDateStr: row.completionDateStr,
        qualityRequirement: row.qualityRequirement,
        payType: row.payType,
        signDateStr: row.signDateStr,
        remark: row.remark,

        enclosureFiles: [],
        uploadFiles: []
      }
      this.creatProjectWorkData.editId = row.id;
      this.creatProjectWorkData.version = row.version;
      if (row.jobType == "实施方案" || row.jobType == "其他") {
        this.creatProjectWorkData.dataShow = false;
        this.creatProjectWorkData.contractShow = false;
        this.creatProjectWorkData.submitSHow = true;
      } else if (row.jobType == "合同") {
        this.creatProjectWorkData.dataShow = false;
        this.creatProjectWorkData.contractShow = true;
        this.creatProjectWorkData.submitSHow = false;
      } else if (row.jobType == "收发文登记") {
        this.creatProjectWorkData.dataShow = true;
        this.creatProjectWorkData.contractShow = false;
        this.creatProjectWorkData.submitSHow = false;
      } else {
        this.creatProjectWorkData.dataShow = true;
        this.creatProjectWorkData.contractShow = false;
        this.creatProjectWorkData.submitSHow = true;
      }
      this.publicFun.httpRequest("get", `wholeprocess/getPMJobFilesByJobId?jobId=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.creatProjectWorkData.enclosureFiles = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    projectWorkNextBtn() {

      let submitData = {
        id: this.creatProjectWorkData.editId,
        version: this.creatProjectWorkData.editSave ? this.creatProjectWorkData.version + 1 : this.creatProjectWorkData.version,
        isSendMsg: this.projectWorkNextSms,
        approveResult: "通过"
      }
      // //console.log("submitData",submitData)
      this.buttonLoadingConfirm = true;
      this.publicFun.httpRequest("post", `wholeprocess/submitProjectWorkFlow`, submitData, (status, data, message) => {
        if (status == 0) {
          this.buttonLoadingConfirm = false;
          this.$message.success(message);
          this.projectWorkNextDialog = false;
          this.creatProjectWorkDialog = false;
          this.searchProjectWorkFunc()
        } else {
          this.$message.error(message);
        }
      });
    },
    submitSaveProjectWorkData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let contractData = {
            "approveOpinion": null,
            "approveResult": null,
            "completionDate": null,
            "completionDateStr": formatDateShort(this.creatProjectWorkData.completionDateStr),
            "contractAmount": this.creatProjectWorkData.contractAmount,
            "contractName": this.creatProjectWorkData.contractName,
            "contractNumber": this.creatProjectWorkData.contractNumber,
            "contractPeriod": this.creatProjectWorkData.contractPeriod,
            "contractType": this.creatProjectWorkData.contractType,
            "contractor": this.creatProjectWorkData.contractor,
            "createTime": null,
            "createTimeStr": null,
            "createUser": null,
            "id": -1,
            "isSendMsg": null,
            "jobMonth": this.publicFun.formatDateMonth(this.creatProjectWorkData.jobMonth),
            "jobType": this.creatProjectWorkData.jobType,
            "jobTypeStr": null,
            "jobYear": this.publicFun.formatDateYear(this.creatProjectWorkData.jobMonth),
            "payType": this.creatProjectWorkData.payType,
            "processState": null,
            "projectWorkFiles": this.creatProjectWorkData.uploadFiles.length > 0 ? JSON.stringify(this.creatProjectWorkData.uploadFiles) : null,
            "qualityRequirement": this.creatProjectWorkData.qualityRequirement,
            "remark": this.creatProjectWorkData.remark,
            "sendPackagePerson": this.creatProjectWorkData.sendPackagePerson,
            "signDateDate": null,
            "signDateStr": formatDateShort(this.creatProjectWorkData.signDateStr),
            "startDate": null,
            "startDateStr": formatDateShort(this.creatProjectWorkData.startDateStr),
            "updateTime": null,
            "updateUser": null,
            "version": 1,
            "wholeProcessId": this.wholeProcessId
          }
          this.buttonLoadingSubmit = true;
          this.publicFun.httpRequest("post", `wholeprocess/addPMJob`, contractData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoadingSubmit = false;
              this.projectWorkNextDialog = true;
              this.creatProjectWorkData.editId = data.id;
              this.creatProjectWorkData.version = data.version;
              this.searchProjectWorkFunc()

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
    saveProjectWorkData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let contractData = {
            "approveOpinion": null,
            "approveResult": null,
            "completionDate": null,
            "completionDateStr": formatDateShort(this.creatProjectWorkData.completionDateStr),
            "contractAmount": this.creatProjectWorkData.contractAmount,
            "contractName": this.creatProjectWorkData.contractName,
            "contractNumber": this.creatProjectWorkData.contractNumber,
            "contractPeriod": this.creatProjectWorkData.contractPeriod,
            "contractType": this.creatProjectWorkData.contractType,
            "contractor": this.creatProjectWorkData.contractor,
            "createTime": null,
            "createTimeStr": null,
            "createUser": null,
            "id": -1,
            "isSendMsg": null,
            "jobMonth": this.publicFun.formatDateMonth(this.creatProjectWorkData.jobMonth),
            "jobType": this.creatProjectWorkData.jobType,
            "jobTypeStr": null,
            "jobYear": this.publicFun.formatDateYear(this.creatProjectWorkData.jobMonth),
            "payType": this.creatProjectWorkData.payType,
            "processState": null,
            "projectWorkFiles": this.creatProjectWorkData.uploadFiles.length > 0 ? JSON.stringify(this.creatProjectWorkData.uploadFiles) : null,
            "qualityRequirement": this.creatProjectWorkData.qualityRequirement,
            "remark": this.creatProjectWorkData.remark,
            "sendPackagePerson": this.creatProjectWorkData.sendPackagePerson,
            "signDateDate": null,
            "signDateStr": formatDateShort(this.creatProjectWorkData.signDateStr),
            "startDate": null,
            "startDateStr": formatDateShort(this.creatProjectWorkData.startDateStr),
            "updateTime": null,
            "updateUser": null,
            "version": 1,
            "wholeProcessId": this.wholeProcessId
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("post", `wholeprocess/addPMJob`, contractData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false
              this.$message.success(message);
              this.creatProjectWorkDialog = false;
              this.searchProjectWorkFunc()
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
    changeProjectWorkType() {
      if (this.creatProjectWorkData.jobType == "实施方案" || this.creatProjectWorkData.jobType == "其他") {
        this.creatProjectWorkData.dataShow = false;
        this.creatProjectWorkData.contractShow = false;
        this.creatProjectWorkData.submitSHow = true;
      } else if (this.creatProjectWorkData.jobType == "合同") {
        this.creatProjectWorkData.dataShow = false;
        this.creatProjectWorkData.contractShow = true;
        this.creatProjectWorkData.submitSHow = false;
      } else if (this.creatProjectWorkData.jobType == "收发文登记") {
        this.creatProjectWorkData.dataShow = true;
        this.creatProjectWorkData.contractShow = false;
        this.creatProjectWorkData.submitSHow = false;
      } else {
        this.creatProjectWorkData.dataShow = true;
        this.creatProjectWorkData.contractShow = false;
        this.creatProjectWorkData.submitSHow = true;
      }
    },
    creatProjectWorkBtn() {
      this.creatProjectWorkDialog = true;
      if (this.creatProjectWorkData.uploadFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.creatProjectWorkData = {
        title: '新增 - 项目工作信息',
        delShow: true,
        newSave: true,
        editSave: false,
        fileList: false,

        dataShow: false,
        contractShow: false,
        submitSHow: true,

        jobType: "实施方案",
        jobYear: new Date(),
        jobMonth: new Date(),

        contractName: '',
        contractNumber: '',
        sendPackagePerson: '',
        contractAmount: '',
        contractor: '',
        contractor: '',
        contractType: '',
        startDateStr: '',
        contractPeriod: '',
        completionDateStr: '',
        qualityRequirement: '',
        payType: '转账',
        signDateStr: '',
        remark: '',

        enclosureFiles: [],
        uploadFiles: []
      }
    },
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
    exportProjectWorkList() {
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
          id: this.projectWork.id,
          wholeProcessId: this.wholeProcessId,
          jobType: this.projectWork.jobTypeProjectWork,
          createTimeStr: formatDateShort(this.projectWork.createTimeStr),
          processState: this.projectWork.processStateProjectWork
        }
        this.$message({
          message: '正在为您生成Excel文件，请稍后……',
          duration: 0
        });
        this.exportLoading = true;
        this.publicFun.httpRequest("get", `wholeprocess/exportPMJobs`, null, (status, data, message) => {
          if (status == 0) {
            let excelData = [
              ["序号", "工作类型", "合同编号", "合同名称", "合同金额", "承包人", "上报时间", "流程状态"]
            ];
            for (let item in data) {
              let excelSaveArray = [parseInt(item) + 1, data[item].jobType, data[item].contractNumber, data[item].contractName, data[item].contractAmount, data[item].contractor, data[item].createTimeStr, data[item].processState]
              excelData.push(excelSaveArray)
            };
            //console.log("excelData", excelData)
            buildExcel(excelData, `《${this.ProjectProgressData.projectName}》项目工作列表`);
            this.exportLoading = false;
            this.$message.closeAll();
          } else {
            that.$message.error(message);
            this.exportLoading = false;
          }
        }, exportData);
      }).catch(() => {});
    },
    exportWholeList() { //批量导出
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
          projectName: this.projectSearch.projectName.trim(),
          projectManager: this.projectSearch.projectManager.trim(),
          delegateUnitName: this.projectSearch.delegateUnitName.trim(),
          processState: this.projectSearch.processState,
        }
        this.$message({
          message: '正在为您生成Excel文件，请稍后……',
          duration: 0
        });
        this.exportLoading = true;
        this.publicFun.httpRequest("get", `wholeprocess/exportProjects`, null, (status, data, message) => {
          if (status == 0) {
            let excelData = [
              ["序号", "项目编号", "项目名称", "委托单位名称", "委托单位联系人", "委托单位联系方式", "项目经理"]
            ];
            for (let item in data) {
              let excelSaveArray = [item != "removeByValue" ? parseInt(item) + 1 : "", data[item].projectNumber, data[item].projectName, data[item].delegateUnitName, data[item].delegateUnitContact, data[item].delegateUnitPhone, data[item].projectManager]
              excelData.push(excelSaveArray)
            };
            //console.log("excelData", excelData)
            buildExcel(excelData, `全过程项目列表`);
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
                that.$message.error(`您未填写 “收到日期” ，位于${item['序号']}行，请检查后上传`);
                document.querySelector("#excelFile").value = "";
              }
              if (item["项目名称"]) {
                excelPostData.projectName = item["项目名称"];
              } else {
                that.$message.error(`您未填写 “项目名称” ，位于${item['序号']}行，请检查后上传`);
                document.querySelector("#excelFile").value = "";
              }
              if (item["委托单位"]) {
                excelPostData.delegateUnitName = item["委托单位"];
              } else {
                that.$message.error(`您未填写 “委托单位” ，位于${item['序号']}行，请检查后上传`);
                document.querySelector("#excelFile").value = "";
              }
              if (item["委托单位联系人"]) {
                excelPostData.delegateUnitContact = item["委托单位联系人"];
              } else {
                that.$message.error(`您未填写 “委托单位联系人” ，位于${item['序号']}行，请检查后上传`);
                document.querySelector("#excelFile").value = "";
              }
              if (item["委托单位电话"]) {
                excelPostData.delegateUnitPhone = item["委托单位电话"];
              } else {
                that.$message.error(`您未填写 “委托单位电话” ，位于${item['序号']}行，请检查后上传`);
                document.querySelector("#excelFile").value = "";
              }
              if (item["约定作业完成日期"]) {
                excelPostData.agreedJobCompletionDateStr = beautyDate(item["约定作业完成日期"]);
              } else {
                that.$message.error(`您未填写 “约定作业完成日期” ，位于${item['序号']}行，请检查后上传`);
                document.querySelector("#excelFile").value = "";
              }
              if (item["工作项目类别"]) {
                excelPostData.workProjectCategoryStr = item["工作项目类别"];
              } else {
                that.$message.error(`您未填写 “工作项目类别” ，位于${item['序号']}行，请检查后上传`);
                document.querySelector("#excelFile").value = "";
              }
              if (item["技术负责人"]) {
                excelPostData.technicalDirector = item["技术负责人"];
              } else {
                that.$message.error(`您未填写 “技术负责人” ，位于${item['序号']}行，请检查后上传`);
                document.querySelector("#excelFile").value = "";
              }
              if (item["项目分配人"]) {
                excelPostData.projectAssignPerson = item["项目分配人"];
              } else {
                that.$message.error(`您未填写 “项目分配人” ，位于${item['序号']}行，请检查后上传`);
                document.querySelector("#excelFile").value = "";
              }
              if (item["登记日期"]) {
                excelPostData.enrollmentDateStr = beautyDate(item["登记日期"]);
              } else {
                that.$message.error(`您未填写 “登记日期” ，位于${item['序号']}行，请检查后上传`);
                document.querySelector("#excelFile").value = "";
              }
              excelPostData.unitName = item["建设单位"] ? item["建设单位"] : null;
              excelPostData.constructionUnitName = item["施工单位"] ? item["施工单位"] : null;
              excelPostData.contractEstimationPrice = item["合同价"] ? item["合同价"] : null;
              excelPostData.reviewAmount = item["送审价"] ? item["送审价"] : null;
              excelPostData.approveType = item["审核类型"] ? item["审核类型"] : null;
              excelPostArray.push(excelPostData);
            });
            //console.log("导入的数据", excelPostArray)
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
          };
          reader.readAsBinaryString(f);
        }
        return false;
      }
    },
    searchProjectWork() {
      this.searchProjectWorkFunc()
    },
    projectWorkBtn(row) {
      // console.log("信息", row)
      if (row.projectManager == this.loginUser) {
        this.projectWork.creatNewProject = true
      } else {
        this.projectWork.creatNewProject = false
      }
      this.projectWork.jobTypeProjectWork = '';
      this.projectWork.createTimeStr = '';
      this.projectWork.processStateProjectWork = '';
      this.projectWorkDialog = true;
      this.wholeProcessId = row.id;
      this.searchProjectWorkFunc();
      this.ProjectProgressData.projectNumber = row.projectNumber;
      this.ProjectProgressData.projectName = row.projectName;
      this.ProjectProgressData.vicePresident = row.vicePresident;
      this.ProjectProgressData.projectManager = row.projectManager;

    },
    changePageSearch(val) {
      this.projectWork.page = val;
      this.searchProjectWorkFunc()

    },
    searchProjectWorkFunc() { //搜索项目工作信息
      let searchProjectWorkData = {
        page: this.projectWork.page,
        rows: 10,
        id: this.projectWork.id,
        wholeProcessId: this.wholeProcessId,
        jobType: this.projectWork.jobTypeProjectWork,
        createTimeStr: formatDateShort(this.projectWork.createTimeStr),
        processState: this.projectWork.processStateProjectWork
      }
      this.publicFun.httpRequest("get", `wholeprocess/listPMJobs`, null, (status, data, message) => {
        if (status == 0) {
          //console.log("项目工作", data)
          this.projectWork.projectData = data.rows;
          this.projectWork.total = data.total;

        } else {
          this.$message.error(message);
        }
      }, searchProjectWorkData);
    },
    getdistributionInfo() {
      this.newProjectData.technicalDirector = "简素";
      this.editProjectData.technicalDirector = "简素";
      this.publicFun.httpRequest("get", `role/getUsersByRoleName?roleName=项目分配人`, null, (status, data, message) => {
        if (status == 0) {
          data.forEach((item) => {
            this.distributionUser.push(item.userName);
          });
          this.newProjectData.projectAssignPerson = data.length > 0 ? data[0].userName : '';
          this.editProjectData.projectAssignPerson = data.length > 0 ? data[0].userName : '';
          this.transferData.distribution = data.length > 0 ? data[0].userName : '';
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
      this.publicFun.httpRequest("get", `role/getUsersByRoleNameLeftLike?roleName=分管副总`, null, (status, data, message) => {
        if (status == 0) {
          this.newProjectData.vicePresident = data.length > 0 ? data[0].userName : '';
          this.editProjectData.vicePresident = data.length > 0 ? data[0].userName : '';
          data.forEach((item) => {
            this.vicePresident.push(item.userName);
          });
        } else {
          this.$message.error(message);
        }
      });

    },
    confirmNextBtn() {
      let submitCostData = {
        "approveOpinion": null,
        "approveResult": "通过",
        "id": this.editProjectData.id,
        "isSendMsg": this.newCheckNextSmscheckNextSms ? "是" : "否",
        "processState": this.editProjectData.processState,
        "projectManager": this.editProjectData.projectManager,
        "version": this.editProjectData.version + 1
      }
      this.buttonLoadingConfirm = true;
      this.publicFun.httpRequest("post", `wholeprocess/submitFlow`, submitCostData, (status, data, message) => {
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
            "agreedJobCompletionDateStr": this.editProjectData.agreedJobCompletionDateStr,
            "approveOpinion": null,
            "approveResult": null,
            "contractNumber": this.editProjectData.contractNumber,
            "delegateUnitContact": this.editProjectData.delegateUnitContact,
            "delegateUnitName": this.editProjectData.delegateUnitName,
            "delegateUnitPhone": this.editProjectData.delegateUnitPhone,
            "id": this.editProjectData.id,
            "importance": this.editProjectData.importance,
            "informationReceivedDateStr": this.editProjectData.informationReceivedDateStr,
            "isSendMsg": "否",
            "projectDetailRequirementsFiles": this.newProjectData.projectDetailRequirementsFiles.length > 0 ? JSON.stringify(this.newProjectData.projectDetailRequirementsFiles) : null,
            "projectLocation": this.editProjectData.projectLocation,
            "projectManager": this.editProjectData.projectManager,
            "projectName": this.editProjectData.projectName,
            "projectNumber": this.editProjectData.projectNumber,
            "unitContact": this.editProjectData.unitContact,
            "unitName": this.editProjectData.unitName,
            "unitPhone": this.editProjectData.unitPhone,
            "vicePresident": this.editProjectData.vicePresident,
            "version": this.editProjectData.version
          }
          this.buttonLoadingSubmit = true;
          this.publicFun.httpRequest("put", `wholeprocess/update`, updateData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoadingSubmit = false;
              this.checkNextSms = null;
              this.confirmNextDialog = true;
              this.editProjectData.id = data.id;
              this.editProjectData.version = data.version;
              this.editProjectData.processState = data.processState;
              this.editProjectData.projectManager = data.projectManager;
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
            "agreedJobCompletionDateStr": this.editProjectData.agreedJobCompletionDateStr,
            "approveOpinion": null,
            "approveResult": null,
            "contractNumber": this.editProjectData.contractNumber,
            "delegateUnitContact": this.editProjectData.delegateUnitContact,
            "delegateUnitName": this.editProjectData.delegateUnitName,
            "delegateUnitPhone": this.editProjectData.delegateUnitPhone,
            "id": this.editProjectData.id,
            "importance": this.editProjectData.importance,
            "informationReceivedDateStr": this.editProjectData.informationReceivedDateStr,
            "isSendMsg": "否",
            "projectDetailRequirementsFiles": this.newProjectData.projectDetailRequirementsFiles.length > 0 ? JSON.stringify(this.newProjectData.projectDetailRequirementsFiles) : null,
            "projectLocation": this.editProjectData.projectLocation,
            "projectManager": this.editProjectData.projectManager,
            "projectName": this.editProjectData.projectName,
            "projectNumber": this.editProjectData.projectNumber,
            "unitContact": this.editProjectData.unitContact,
            "unitName": this.editProjectData.unitName,
            "unitPhone": this.editProjectData.unitPhone,
            "vicePresident": this.editProjectData.vicePresident,
            "version": this.editProjectData.version
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("put", `wholeprocess/update`, updateData, (status, data, message) => {
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
    // 修改全过程信息弹窗
    editCostCreatBtn(row) {
      if (this.newProjectData.projectDetailRequirementsFiles.length > 0) {
        this.$refs.upload.clearFiles();
      }
      this.editCostCreatDialog = true;
      this.newProjectData.projectDetailRequirementsFiles = [];
      this.editProjectData.id = row.id;
      this.editProjectData.version = row.version;
      this.editProjectData.forCheckedShow = false;
      this.publicFun.httpRequest("get", `wholeprocess/get?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          //console.log("全过程信息", data)
          this.editProjectData = data.wholeprocess;
          this.editProjectData.files = data.files;
        } else {
          this.$message.error(message);
        }
      });
    },
    delFillFile(row, index) {
      this.$confirm('确认要删除此文件吗？', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.publicFun.httpRequest("delete", `wholeprocess/deleteWholeProcessFile?id=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.editProjectData.files.splice(index, 1);
          } else {
            this.$message.error(message);
          }
        });
      }).catch(() => {

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
        this.publicFun.httpRequest("delete", `wholeprocess/deleteSingle?id=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.distributeData.singleListData.splice(index, 1);
          } else {
            this.$message.error(message);
          }
        });
      }).catch(() => {});
    },
    editSingleProject(row) {
      console.log("改变的值",row);
      this.distributeData.id = row.id;
      this.distributeData.changed = true;

      this.distributeData.wholeProcessId = row.wholeProcessId
      this.distributeData.singleName = row.name;
      this.distributeData.professional = row.professional;
      this.getUserByRoleName(row.professional);
      this.consultantChange = row.consultant;
      this.distributeData.consultant = row.consultant ;
      this.distributeData.isQdBdTogether = row.isQdBdTogether;
      this.distributeData.jobRequirement = row.jobRequirement;
      this.distributeData.otherContent = row.otherContent;
      this.distributeData.firstDraftTimeStr = row.firstDraftTimeStr;
      this.distributeData.endDraftTimeStr = row.endDraftTimeStr;
      if(row.constructionContent){
        setTimeout(()=>{
          this.distributeData.constructionContent = row.constructionContent ? row.constructionContent.split(",") : null;
        },100)
      }


    },
    saveSingleBtn() {
      if (this.distributeData.name) {
        if (this.distributeData.changed) {
          let editSingleData = {
            "constructionContent": null,
            "constructionContents": this.distributeData.constructionContent ? this.distributeData.constructionContent.join(",") : null,
            "consultant": this.distributeData.consultant,
            "createTime": null,
            "createUser": null,
            "id": this.distributeData.id,
            "jobRequirement": this.distributeData.jobRequirement,
            "jobRequirementFiles": null,
            "name": this.distributeData.name,
            "otherContent": this.distributeData.otherContent,
            "professional": this.distributeData.professional,
            "projectManager": null,
            "projectName": null,
            "projectNumber": null,
            "projectOwner": null,
            "updateTime": null,
            "updateUser": null,
            "version": 0,
            "vicePresident": null,
            "wholeProcessId": this.distributeData.wholeProcessId
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("put", `wholeprocess/updateSingle`, editSingleData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.publicFun.httpRequest("get", `wholeprocess/getSinglesByProjectId?wholeProcessId=${this.distributeData.wholeProcessId}`, null, (status, data, message) => {
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
            "constructionContent": null,
            "constructionContents": this.distributeData.constructionContent ? this.distributeData.constructionContent.join(",") : null,
            "consultant": this.distributeData.consultant,
            "createTime": null,
            "createUser": null,
            "id": -1,
            "jobRequirement": this.distributeData.jobRequirement,
            "jobRequirementFiles": null,
            "name": this.distributeData.name,
            "otherContent": this.distributeData.otherContent,
            "professional": this.distributeData.professional,
            "projectManager": null,
            "projectName": null,
            "projectNumber": null,
            "projectOwner": null,
            "updateTime": null,
            "updateUser": null,
            "version": 0,
            "vicePresident": null,
            "wholeProcessId": this.distributeData.costConsultationId
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("post", `wholeprocess/addSingle`, addSingleData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.publicFun.httpRequest("get", `wholeprocess/getSinglesByProjectId?wholeProcessId=${this.distributeData.costConsultationId}`, null, (status, data, message) => {
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

      } else {
        this.$message.error("请填写单项工程名称");
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
    changeManagerUser(name) { //改变项目经理
      //console.log("改变的项目经理", name)
      this.distributeData.projectManager = name.userName;
      document.querySelector(".el-dialog").click();
    },
    submitSingleProject(formName) { //单项工程提交
      if (this.distributeData.singleListData.length > 0) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let submitSingleData = {
              "approveOpinion": null,
              "approveResult": "通过",
              "id": this.distributeData.costConsultationId,
              "isSendMsg": this.distributeData.isSporadicProject,
              "processState": null,
              "projectManager": this.distributeData.projectManager,
              "version": this.distributeData.version
            }
            //console.log(submitSingleData)
            this.buttonLoadingSubmit = true;
            this.publicFun.httpRequest("post", `wholeprocess/submitFlow`, submitSingleData, (status, data, message) => {
              if (status == 0) {
                this.buttonLoadingSubmit = false;
                this.$message.success(message);
                this.distributeSingleDialog = false;
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
      } else {
        this.$message.error("请先创建单项工程");
      }
    },
    distributeSingle(row) { //分配单项工程
      //console.log("分配单项工程", row)
      this.distributeSingleDialog = true;
      this.resetSingleBtn();

      this.distributeData.loading = true;
      this.distributeData.name = row.projectName;
      this.distributeData.version = row.version;
      this.distributeData.workProjectCategoryStr = row.workProjectCategoryStr;
      this.distributeData.projectManager = row.projectManager;
      this.distributeData.singleName = row.projectName;
      this.distributeData.projectDirector = row.projectDirector;
      this.distributeData.costConsultationId = row.id;
      if (row.dataIssueDateStr) {
        this.distributeData.dataIssueDateStr = row.dataIssueDateStr;
      } else {
        this.distributeData.dataIssueDateStr = new Date();
      }
      this.publicFun.httpRequest("get", `wholeprocess/getSinglesByProjectId?wholeProcessId=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(() => {
            this.distributeData.loading = false;
          });
          this.distributeData.singleListData = data;
          //console.log("data", this.distributeData.singleListData)
        } else {
          this.$message.error(message);
        }
      });
    },
    getUserByRoleName(name) {
      this.publicFun.httpRequest("get", `role/getUsersByRoleName?roleName=${name}工程师`, null, (status, data, message) => {
        if (status == 0) {
          this.distributeData.userData = data;
          // console.log(consultant)
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
    showSingleData(row) { //查看单项工程 popover
      //console.log("单项信息", row)
      this.singleData = {
        name: row.name ? row.name : "--",
        professional: row.professional ? row.professional : "--",
        consultant: row.consultant ? row.consultant : "--",
        constructionContent: row.constructionContent ? row.constructionContent : "--",
        jobRequirement: row.jobRequirement ? row.jobRequirement : "--",
        otherContent: row.otherContent ? row.otherContent : "--"
      }
    },
    viewProjectProgress(row) {
      this.projectProgressDialog = true;
      this.progressLoading = {
        history: true,
        children: true
      };
      //console.log("进度信息", row)
      this.progressData.mainData = {
        projectNumber: row.projectNumber ? row.projectNumber : "--",
        projectName: row.projectName ? row.projectName : "--",
        vicePresident: row.vicePresident ? row.vicePresident : "--",
        projectManager: row.projectManager ? row.projectManager : "--"
      }
      switch (row.processState) {
        case "项目登记":
          this.progressData.mainData.processState = 0;
          break;
        case "项目分配":
          this.progressData.mainData.processState = 1;
          break;
        case "项目进行中":
          this.progressData.mainData.processState = 2;
          break;
        case "完成":
          this.progressData.mainData.processState = 4;
          break;
        default:
          this.progressData.mainData.processState = 0;
      }
      //console.log("状态值", row.processState)
      this.publicFun.httpRequest("get", `history/get?type=biz_wholeprocess&bizId=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(() => {
            this.progressLoading.history = false;
          });
          this.progressData.history = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    newConfirmNextBtn() {
      let submitCostData = {
        "approveOpinion": null,
        "approveResult": "通过",
        "id": this.newProjectData.id,
        "isSendMsg": this.newCheckNextSmscheckNextSms ? "是" : "否",
        "processState": this.newProjectData.processState,
        "projectManager": this.newProjectData.projectManager,
        "version": this.newProjectData.version
      }
      this.buttonLoadingConfirm = true;
      this.publicFun.httpRequest("post", `wholeprocess/submitFlow`, submitCostData, (status, data, message) => {
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
            "agreedJobCompletionDateStr": formatDateShort(this.newProjectData.agreedJobCompletionDateStr),
            "approveOpinion": null,
            "approveResult": null,
            "contractNumber": this.newProjectData.contractNumber,
            "delegateUnitContact": this.newProjectData.delegateUnitContact,
            "delegateUnitName": this.newProjectData.delegateUnitName,
            "delegateUnitPhone": this.newProjectData.delegateUnitPhone,
            "id": 0,
            "importance": this.newProjectData.importance,
            "informationReceivedDateStr": formatDateShort(this.newProjectData.informationReceivedDateStr),
            "isSendMsg": "否",
            "projectDetailRequirementsFiles": this.newProjectData.projectDetailRequirementsFiles.length > 0 ? JSON.stringify(this.newProjectData.projectDetailRequirementsFiles) : null,
            "projectLocation": this.newProjectData.projectLocation,
            "projectManager": null,
            "projectName": this.newProjectData.projectName,
            "projectNumber": this.newProjectData.projectNumber,
            "unitContact": this.newProjectData.unitContact,
            "unitName": this.newProjectData.unitName,
            "unitPhone": this.newProjectData.unitPhone,
            "vicePresident": this.newProjectData.vicePresident
          }
          this.buttonLoadingSubmit = true;
          this.publicFun.httpRequest("post", 'wholeprocess/add', postProjectData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoadingSubmit = false;
              this.$message.success("项目已成功保存");
              this.getProjectList(1);
              this.newCheckNextSms = null;
              this.newConfirmNextDialog = true;
              this.newProjectData.id = data.id;
              this.newProjectData.version = data.version;
              this.newProjectData.processState = data.processState;
              this.newProjectData.projectManager = data.projectManager;

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
            "agreedJobCompletionDateStr": formatDateShort(this.newProjectData.agreedJobCompletionDateStr),
            "approveOpinion": null,
            "approveResult": null,
            "contractNumber": this.newProjectData.contractNumber,
            "delegateUnitContact": this.newProjectData.delegateUnitContact,
            "delegateUnitName": this.newProjectData.delegateUnitName,
            "delegateUnitPhone": this.newProjectData.delegateUnitPhone,
            "id": 0,
            "importance": this.newProjectData.importance,
            "informationReceivedDateStr": formatDateShort(this.newProjectData.informationReceivedDateStr),
            "isSendMsg": "否",
            "projectDetailRequirementsFiles": this.newProjectData.projectDetailRequirementsFiles.length > 0 ? JSON.stringify(this.newProjectData.projectDetailRequirementsFiles) : null,
            "projectLocation": this.newProjectData.projectLocation,
            "projectManager": null,
            "projectName": this.newProjectData.projectName,
            "projectNumber": this.newProjectData.projectNumber,
            "unitContact": this.newProjectData.unitContact,
            "unitName": this.newProjectData.unitName,
            "unitPhone": this.newProjectData.unitPhone,
            "vicePresident": this.newProjectData.vicePresident
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("post", 'wholeprocess/add', postProjectData, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message({
                type: 'success',
                message: message
              });
              this.creatNew = false;
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
        this.publicFun.httpRequest("delete", `wholeprocess/delete?id=${row.id}`, null, (status, data, message) => {
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
    searchProject() {
      this.searchInfo = {
        projectName: this.projectSearch.projectName,
        projectManager: this.projectSearch.projectManager,
        delegateUnitName: this.projectSearch.delegateUnitName,
        processState: this.projectSearch.processState,
      }
      this.getProjectList(1, this.searchInfo);
      this.pageNum = 1;
    },
    getProjectList(page, searchInfo) {
      let params = {
        page: page,
        rows: 10,
        projectName: searchInfo ? searchInfo.projectName ? searchInfo.projectName.trim() : null : null,
        projectManager: searchInfo ? searchInfo.projectManager ? searchInfo.projectManager.trim() : null : null,
        delegateUnitName: searchInfo ? searchInfo.delegateUnitName ? searchInfo.delegateUnitName.trim() : null : null,
        processState: searchInfo ? searchInfo.processState ? searchInfo.processState : null : null,
        id: searchInfo ? searchInfo.id ? searchInfo.id : null : null,
      }
      this.listLoading = true;
      this.publicFun.httpRequest("get", 'wholeprocess/list', null, (status, data, message) => {
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
      this.publicFun.httpRequest("get", 'wholeprocess/get', null, (status, data, message) => {
        if (status == 0) {
          //console.log("全过程信息", data)
          this.publicFun.handleIELoading(() => {
            this.viewLoading = false;
          });
          this.viewProjectData = {
            // 项目基本信息
            projectName: data.wholeprocess.projectName ? data.wholeprocess.projectName : "--",
            projectNumber: data.wholeprocess.projectNumber ? data.wholeprocess.projectNumber : "--",
            contractNumber: data.wholeprocess.contractNumber ? data.wholeprocess.contractNumber : "--",
            informationReceivedDateStr: data.wholeprocess.informationReceivedDateStr ? data.wholeprocess.informationReceivedDateStr : "--",
            agreedJobCompletionDateStr: data.wholeprocess.agreedJobCompletionDateStr ? data.wholeprocess.agreedJobCompletionDateStr : "--",
            projectLocation: data.wholeprocess.projectLocation ? data.wholeprocess.projectLocation : "--",
            importance: data.wholeprocess.importance ? data.wholeprocess.importance : "--",
            delegateUnitName: data.wholeprocess.delegateUnitName ? data.wholeprocess.delegateUnitName : "--",
            delegateUnitContact: data.wholeprocess.delegateUnitContact ? data.wholeprocess.delegateUnitContact : "--",
            delegateUnitPhone: data.wholeprocess.delegateUnitPhone ? data.wholeprocess.delegateUnitPhone : "--",
            unitName: data.wholeprocess.unitName ? data.wholeprocess.unitName : "--",
            unitContact: data.wholeprocess.unitContact ? data.wholeprocess.unitContact : "--",
            unitPhone: data.wholeprocess.unitPhone ? data.wholeprocess.unitPhone : "--",
            vicePresident: data.wholeprocess.vicePresident ? data.wholeprocess.vicePresident : "--",
            projectManager: data.wholeprocess.projectManager ? data.wholeprocess.projectManager : "--",
            // 档案资料
            infoFiles: data.files
          }
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    uploadRemove(file, fileList) {
      //console.log("移除文件", file)
      this.newProjectData.projectDetailRequirementsFiles.forEach((item) => {
        if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1) {
          this.newProjectData.projectDetailRequirementsFiles.removeByValue(item);
        }
      });
    },
    uploadSuccess(response, file, fileList) {
      //console.log("文件上传成功", response)
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: "项目详细要求",
        createUser: this.loginUser
      }
      this.newProjectData.projectDetailRequirementsFiles.push(fileData);
    },
    uploadWholeContractRemove(file, fileList) {
      //console.log("移除文件", file)
      this.creatProjectWorkData.uploadFiles.forEach((item) => {
        if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1) {
          this.creatProjectWorkData.uploadFiles.removeByValue(item);
        }
      });
    },
    uploadChildDataSuccess(response, file, fileList) { //进度款文件上传
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: "项目工作",
        createUser: this.loginUser,
        createTimeStr: response.record[0].createTimeStr
      }
      this.creatProjectWorkData.uploadFiles.push(fileData);
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
