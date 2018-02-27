<template>
<div id="systemSetting-content" class="app-container">
  <header class="p20 bg-color-white shadow radius5" v-if="!routerExistence">
    <div class="mt-5">
      <el-form :inline="true" ref="singleSearchData" :model="singleSearchData" class="demo-form-inline" label-width="140px">
        <el-form-item label="项目名称：" class="mt-10" prop="projectName">
          <el-input @keyup.enter.native="singleSearchBtn" size="small" v-model="singleSearchData.projectName" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="单项工程名称：" class="mt-10" prop="name">
          <el-input @keyup.enter.native="singleSearchBtn" size="small" v-model="singleSearchData.name" placeholder="请输入单项工程名称"></el-input>
        </el-form-item>
        <el-form-item label="专业咨询员：" class="mt-10" prop="consultant">
          <el-input @keyup.enter.native="singleSearchBtn" size="small" v-model="singleSearchData.consultant" placeholder="请输入专业咨询员"></el-input>
        </el-form-item>
        <el-form-item label=" 所属专业：" class="mt-10" prop="professional">
          <el-select v-model="singleSearchData.professional" size="small" placeholder="请选择所属专业">
            <el-option label="全部" value=""></el-option>
            <el-option label="土建" value="土建"></el-option>
            <el-option label="装饰" value="装饰"></el-option>
            <el-option label="安装" value="安装"></el-option>
            <el-option label="市政" value="市政"></el-option>
            <el-option label="钢筋" value="钢筋"></el-option>
            <el-option label="景观绿化" value="景观绿化"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" 单项工程流程状态：" class="mt-10" prop="processState">
          <el-select v-model="singleSearchData.processState" size="small" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="上传清单" value="上传清单"></el-option>
            <el-option label="上传标底" value="上传标底"></el-option>
            <el-option label="上传清单标底" value="上传清单标底"></el-option>
            <el-option label="审核清单" value="审核清单"></el-option>
            <el-option label="审核标底" value="审核标底"></el-option>
            <el-option label="审核清单标底" value="审核清单标底"></el-option>
            <el-option label="项目经理审核清单" value="项目经理审核清单"></el-option>
            <el-option label="项目经理审核标底" value="项目经理审核标底"></el-option>
            <el-option label="项目经理审核清单标底" value="项目经理审核清单标底"></el-option>
            <el-option label="初稿编制" value="初稿编制"></el-option>
            <el-option label="初稿编制复核" value="初稿编制复核"></el-option>
            <el-option label="初稿核对" value="初稿核对"></el-option>
            <el-option label="初稿核对复核" value="初稿核对复核"></el-option>
            <el-option label="项目经理编制复核" value="项目经理编制复核"></el-option>
            <el-option label="项目经理核对复核" value="项目经理核对复核"></el-option>
            <el-option label="初稿审核" value="初稿审核"></el-option>
            <el-option label="完成" value="完成"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="mt-30 mb-15 tc">
      <el-button @click='singleSearchBtn' type="primary" class="btn-orange shadow"><i class="iconfont icon-shiliangzhinengduixiang f13 mr-5"></i>查 询</el-button>
      <el-button @click='resetForm("singleSearchData")' type="primary" class="btn-indigo shadow"><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
    </div>
  </header>
  <article class="mt-30">
    <el-table :data="singleDataContent" v-loading="listLoading" fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
      <el-table-column label="项目名称" width="220">
        <template slot-scope="scope">
          <span class="color-green cp" @click="viewProject(scope.row)">{{scope.row.projectName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单项工程名称" width="220" align="left" prop="name"></el-table-column>
      <el-table-column label="所属专业" align="left" prop="professional"></el-table-column>
      <el-table-column label="专业咨询员" width="120" align="center" prop="consultant"></el-table-column>
      <el-table-column label="流程状态" width="140" align="left" prop="processState"></el-table-column>
      <el-table-column align="left" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="openSingleView(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="viewProjectProgress(scope.row)" type="text" size="small">工程进度</el-button>
          <el-button @click="setInfoDataBtn(scope.row)" v-if='roleBtn.checkFile&&scope.row.consultant==loginUser&&(scope.row.processState == "初稿编制"||scope.row.processState == "初稿核对"||scope.row.processState == "上传清单"||scope.row.processState == "上传标底"||scope.row.processState == "上传清单标底")' type="text" size="small">{{scope.row.processState =="初稿编制" || scope.row.processState =="初稿核对" ? scope.row.processState : "上传电子件"}}</el-button>
          <el-button v-if="roleBtn.reviewAgainShow&&scope.row.reviewer==loginUser&&(scope.row.processState == '审核清单' || scope.row.processState == '审核标底' || scope.row.processState == '审核清单标底' || scope.row.processState == '初稿编制复核'|| scope.row.processState == '初稿核对复核')" @click="reviewAgain(scope.row)" type="text" size="small">复核</el-button>
          <el-button v-if="roleBtn.reviewAgainShow&&scope.row.projectManager==loginUser&&(scope.row.processState == '项目经理审核清单'|| scope.row.processState == '项目经理审核标底'|| scope.row.processState == '项目经理审核清单标底'|| scope.row.processState == '项目经理编制复核'|| scope.row.processState == '项目经理核对复核')" @click="reviewAgain(scope.row)" type="text" size="small">复核</el-button>
        </template>
      </el-table-column>
    </el-table>
  </article>

  <footer class="mt-30 cb pagination" v-if="total&&!routerExistence">
    <el-pagination @current-change="singleCurrentChange" :current-page.sync="pageNum" :page-size="10" layout="prev, pager, next, jumper" :total="total" class="fr">
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
            <div class="grid-content">{{viewProjectData.investmentNature}}</div>
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
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{viewProjectData.projectManager}}</div>
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
      <div class="icms-dialog-content  pr mt-40">
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
      <div class="icms-dialog-content  pr mt-40">
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
    </div>
  </el-dialog>
  <el-dialog :visible.sync="openSingleViewDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 单项工程信息</span>
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
        <el-col :sm="12">
          <el-col :sm="14" :xs="12">
            <div class="grid-content tr">专业咨询员：</div>
          </el-col>
          <el-col :sm="10" :xs="12">
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
          <div class="grid-content tr">是否清单标底一起上传：</div>
        </el-col>
        <el-col :sm="18" :xs="12">
          <div class="grid-content">{{singleData.isQdBdTogether}}</div>
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
      <el-row :gutter="16" class="mt-15">
        <el-col :sm="6" :xs="12">
          <div class="grid-content tr">初稿日期：</div>
        </el-col>
        <el-col :sm="6" :xs="12">
          <div class="grid-content">{{singleData.firstDraftTimeStr}}</div>
        </el-col>
        <el-col :sm="12">
          <el-col :sm="14" :xs="12">
            <div class="grid-content tr">定稿日期：</div>
          </el-col>
          <el-col :sm="10" :xs="12">
            <div class="grid-content">{{singleData.endDraftTimeStr}}</div>
          </el-col>
        </el-col>
      </el-row>
    </div>
    <div class="icms-dialog-content pr mt-30" v-loading="singleData.singleLoading">
      <nav class="pa">
        单项工程相关报告信息
      </nav>
      <el-row :gutter="16" class="mt-15">
        <el-col :sm="6" :xs="12">
          <div class="grid-content tr">建筑面积（平方米）：</div>
        </el-col>
        <el-col :sm="18" :xs="12">
          <div class="grid-content">{{singleData.constructionArea}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="16" class="mt-15">
        <el-col :sm="6" :xs="12">
          <div class="grid-content tr">钢材用量（t）：</div>
        </el-col>
        <el-col :sm="6" :xs="12">
          <div class="grid-content">{{singleData.steelAmount}}</div>
        </el-col>
        <el-col :sm="12">
          <el-col :sm="14" :xs="12">
            <div class="grid-content tr">钢材消耗指标（kg/㎡）：</div>
          </el-col>
          <el-col :sm="10" :xs="12">
            <div class="grid-content">{{singleData.steelConsumptionIndicator}}</div>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="16" class="mt-15">
        <el-col :sm="6" :xs="12">
          <div class="grid-content tr">水泥用量（t）：</div>
        </el-col>
        <el-col :sm="6" :xs="12">
          <div class="grid-content">{{singleData.cementAmount}}</div>
        </el-col>
        <el-col :sm="12">
          <el-col :sm="14" :xs="12">
            <div class="grid-content tr">水泥消耗指标（kg/㎡）：</div>
          </el-col>
          <el-col :sm="10" :xs="12">
            <div class="grid-content">{{singleData.cementConsumptionIndicator}}</div>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="16" class="mt-15">
        <el-col :sm="6" :xs="12">
          <div class="grid-content tr">预拌砼用量（m³）：</div>
        </el-col>
        <el-col :sm="6" :xs="12">
          <div class="grid-content">{{singleData.readyMixedConcreteAmount}}</div>
        </el-col>
        <el-col :sm="12">
          <el-col :sm="14" :xs="12">
            <div class="grid-content tr">预拌砼消耗指标（m³/㎡）：</div>
          </el-col>
          <el-col :sm="10" :xs="12">
            <div class="grid-content">{{singleData.readyMixedConcreteConsumptionIndicator}}</div>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="16" class="mt-15">
        <el-col :sm="6" :xs="12">
          <div class="grid-content tr">专业编制金额（元）：</div>
        </el-col>
        <el-col :sm="6" :xs="12">
          <div class="grid-content">{{singleData.professionalAmount}}</div>
        </el-col>
        <el-col :sm="12">
          <el-col :sm="14" :xs="12">
            <div class="grid-content tr">专业单方造价（元/㎡）：</div>
          </el-col>
          <el-col :sm="10" :xs="12">
            <div class="grid-content">{{singleData.professionalUnilateralCost}}</div>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="16" class="mt-15">
        <el-col :sm="6" :xs="12">
          <div class="grid-content tr">人工工日用量（工日）：</div>
        </el-col>
        <el-col :sm="6" :xs="12">
          <div class="grid-content">{{singleData.manDaysAmount}}</div>
        </el-col>
        <el-col :sm="12">
          <el-col :sm="14" :xs="12">
            <div class="grid-content tr">人工工日消耗指标（工日/㎡）：</div>
          </el-col>
          <el-col :sm="10" :xs="12">
            <div class="grid-content">{{singleData.manDaysConsumptionIndicator}}</div>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="16" class="mt-15">
        <el-col :sm="6" :xs="12">
          <div class="grid-content tr">备注：</div>
        </el-col>
        <el-col :sm="18" :xs="12">
          <div class="grid-content">{{singleData.remarks}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="16" class="mt-15">
        <el-col :sm="6" :xs="12">
          <div class="grid-content tr">复核人：</div>
        </el-col>
        <el-col :sm="18" :xs="12">
          <div class="grid-content">{{singleData.reviewer}}</div>
        </el-col>
      </el-row>
    </div>
    <div class="icms-dialog-content  pr mt-30" v-loading="singleData.singleLoading">
      <nav class="pa">
        项目基本文档
      </nav>
      <el-table class="noShadow" :data="singleData.normalFiles" style="width: 100%">
        <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
        <el-table-column min-width="150" prop="fileName" label="文件名称"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
              <el-button @click="editExcelBtn(scope.row)" type="text" size="small">编辑</el-button>
            </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="icms-dialog-content pr mt-30" v-loading="singleData.singleLoading">
      <nav class="pa">
        单项工程附件信息
      </nav>
      <el-table class="noShadow" :data="singleData.files" style="width: 100%">
        <el-table-column type="index" width="40" label="编号" align="center"></el-table-column>
        <el-table-column prop="fileName" width="210" label="文件名称"></el-table-column>
        <el-table-column prop="fileType" width="190" label="文件类型" align="center"></el-table-column>
        <el-table-column prop="createTimeStr" width="170" label="上传时间" align="center"></el-table-column>
        <el-table-column prop="createUser" label="上传人"></el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
                <a target="_blank" :href="scope.row.id | setSingleDownloadUrl">
                  <el-button class="color-green" type="text" size="small">下载</el-button>
                </a>
              </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
  <el-dialog :visible.sync="projectProgressDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 工程进度信息</span>
    <div class="dialog-box">
      <div class="icms-dialog-content pr p15 mt-15">
        <nav class="pa">
          项目基本信息
        </nav>
        <el-row :gutter="16">
          <el-col :sm="9">
            单项工程名称：{{progressData.mainData.projectName}}
          </el-col>
          <el-col :sm="8">
            专业咨询员：{{progressData.mainData.consultant}}
          </el-col>
          <el-col :sm="7">
            复核人：{{progressData.mainData.reviewer}}
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content pr mt-40">
        <nav class="pa">
          单项工程流程信息
        </nav>
        <el-row :gutter="16">
          <el-col :sm="24">
            <el-steps class="oa pl-10" :space="130" :active="progressData.mainData.processState" finish-status="success" :align-center="true" :center="true">
              <el-step v-for="item in stepData" key="null" :title="item"></el-step>
            </el-steps>
          </el-col>
        </el-row>
      </div>
      <div class="icms-dialog-content  pr mt-40" v-loading="progressLoading.history">
        <nav class="pa">
          单项工程历史信息
        </nav>
        <el-table class="noShadow" :data="progressData.history" style="width: 100%">
          <el-table-column prop="processState" width="130" label="处理步骤" align="left"></el-table-column>
          <el-table-column prop="processor" width="100" label="处理人"></el-table-column>
          <el-table-column prop="processTimeStr" width="190" label="处理时间"></el-table-column>
          <el-table-column prop="processResult" label="处理结果"></el-table-column>
          <el-table-column align="left" prop="processOpinion" label="处理意见" width="250">
            <template slot-scope="scope">
                {{scope.row.processOpinion?scope.row.processOpinion:"--"}}
              </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
  <!-- 初稿编制 -->
  <el-dialog :visible.sync="setInfoDialog" size="small" custom-class="icms-dialog">
    <span slot="title">编辑 - 工程信息</span>
    <div class="dialog-box">
      <div class="icms-dialog-content pr p15 mt-15" v-loading="singleData.singleLoading">
        <nav class="pa">
          单项工程附件信息
        </nav>
        <el-table class="noShadow" :data="singleData.files" style="width: 100%">
          <el-table-column type="index" width="40" label="编号" align="center"></el-table-column>
          <el-table-column prop="fileName" width="210" label="文件名称"></el-table-column>
          <el-table-column prop="fileType" width="190" label="文件类型" align="center"></el-table-column>
          <el-table-column prop="createTimeStr" width="170" label="上传时间" align="center"></el-table-column>
          <el-table-column prop="createUser" label="上传人"></el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
                <el-button v-if="singleProcessState == '初稿核对' ? false : true" @click="delSingleFile(scope.row,scope.$index)" class="color-green" type="text" size="small">删除</el-button>
              </template>
          </el-table-column>
        </el-table>
        <el-upload class="upload-file w bt-1 mt-10 pt-30" ref="upload" :on-remove="requireRemove" :on-error="fileError" :on-success="requireSuccess" drag action="icms/cost/single/upload" accept="*" multiple>
          <i class="el-icon-upload f16 color-gray"></i>
          <div class="el-upload__text">将文件拖到此处，或点击上传</div>
          <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
        </el-upload>
      </div>
      <div class="icms-dialog-content  pr mt-40" v-loading="singleData.singleLoading">
        <nav class="pa">
          项目基本文档
        </nav>
        <el-table class="noShadow" :data="singleData.normalFiles" style="width: 100%">
          <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
          <el-table-column min-width="150" prop="fileName" label="文件名称"></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
                <el-button @click="editExcelBtn(scope.row)" type="text" size="small">编辑</el-button>
              </template>
          </el-table-column>
        </el-table>
      </div>
      <el-form :model="setInfoData" ref="setInfoData" label-width="220px" :rules="setInfoDataRules">
        <div class="icms-dialog-content  pr mt-40" v-loading="singleData.singleLoading">
          <nav class="pa">
            单项工程专业报告
          </nav>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="建筑面积（平方米）：" class="mt-10 w creat-new-form" prop="constructionArea">
                <el-input type="number" v-model="setInfoData.constructionArea" class="w" size="small" placeholder="请输入建筑面积"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="钢材用量（t）：" class="mt-10 w creat-new-form" prop="steelAmount">
                <el-input type="number" v-model="setInfoData.steelAmount" class="w" size="small" placeholder="请输入钢材用量"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="钢材消耗指标（kg/㎡）：" class="mt-10 w creat-new-form" prop="steelConsumptionIndicator">
                <el-input type="number" v-model="setInfoData.steelConsumptionIndicator" class="w" size="small" placeholder="请输入钢材消耗指标"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="水泥用量（t）：" class="mt-10 w creat-new-form" prop="cementAmount">
                <el-input type="number" v-model="setInfoData.cementAmount" class="w" size="small" placeholder="请输入水泥用量"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="水泥消耗指标（kg/㎡）：" class="mt-10 w creat-new-form" prop="cementConsumptionIndicator">
                <el-input type="number" v-model="setInfoData.cementConsumptionIndicator" class="w" size="small" placeholder="请输入水泥消耗指标"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="预拌砼用量（m³）：" class="mt-10 w creat-new-form" prop="readyMixedConcreteAmount">
                <el-input type="number" v-model="setInfoData.readyMixedConcreteAmount" class="w" size="small" placeholder="请输入预拌砼用量"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="预拌砼消耗指标（m³/㎡）：" class="mt-10 w creat-new-form" prop="readyMixedConcreteConsumptionIndicator">
                <el-input type="number" v-model="setInfoData.readyMixedConcreteConsumptionIndicator" class="w" size="small" placeholder="请输入预拌砼消耗指标"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="专业编制金额（元）：" class="mt-10 w creat-new-form" prop="professionalAmount">
                <el-input type="number" v-model="setInfoData.professionalAmount" class="w" size="small" placeholder="请输入专业编制金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="专业单方造价（元/㎡）：" class="mt-10 w creat-new-form" prop="professionalUnilateralCost">
                <el-input type="number" v-model="setInfoData.professionalUnilateralCost" class="w" size="small" placeholder="请输入专业单方造价"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="人工工日用量（工日）：" class="mt-10 w creat-new-form" prop="manDaysAmount">
                <el-input type="number" v-model="setInfoData.manDaysAmount" class="w" size="small" placeholder="请输入人工工日用量"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="人工工日消耗指标（工日/㎡）：" class="mt-10 w creat-new-form" prop="manDaysConsumptionIndicator">
                <el-input type="number" v-model="setInfoData.manDaysConsumptionIndicator" class="w" size="small" placeholder="请输入人工工日消耗指标"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="24">
              <el-form-item label="备注：" class="mt-10 w creat-new-form" prop="remarks">
                <el-input v-model="setInfoData.remarks" type="textarea" class="w" size="small" placeholder="请输入备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="复核人：" class="mt-10 w creat-new-form" prop="reviewer">
                <el-select v-model="setInfoData.reviewer" size="mini" placeholder="请选择复核人">
                  <el-option v-for="item in setInfoDataReviewer" :key="item.userName" :label="item.userName" :value="item.userName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content  pr mt-40" v-loading="singleData.singleLoading" v-if="this.singleProcessState == '初稿核对'&&this.submitSingleData.projectDirector==this.loginUser">
          <nav class="pa">
            单项工程审定信息
          </nav>
          <div class="f13 color-red">
            友情提醒：确保审定金额与实际报告上一致
          </div>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="送审金额（元）：" class="mt-10 w creat-new-form" prop="singleReviewAmount">
                <el-input type="number" v-model="setInfoData.singleReviewAmount" class="w" size="small" placeholder="请输入送审金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="合同金额（元）：" class="mt-10 w creat-new-form" prop="singleContractAmount">
                <el-input type="number" v-model="setInfoData.singleContractAmount" class="w" size="small" placeholder="请输入合同金额"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="12">
              <el-form-item label="审定金额（元）：" class="mt-10 w creat-new-form" prop="singleValidationAmount">
                <el-input type="number" v-model="setInfoData.singleValidationAmount" class="w" size="small" placeholder="请输入审定金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="核减（增）率（%）：" class="mt-10 w creat-new-form" prop="singleReductionRate">
                <el-input readonly v-model="setInfoData.singleReductionRate" class="w" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div class="icms-dialog-content pr mt-40" v-loading="singleData.singleLoading">
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
          <el-col :sm="12">
            <el-col :sm="14" :xs="12">
              <div class="grid-content tr">专业咨询员：</div>
            </el-col>
            <el-col :sm="10" :xs="12">
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
            <div class="grid-content tr">是否清单标底一起上传：</div>
          </el-col>
          <el-col :sm="18" :xs="12">
            <div class="grid-content">{{singleData.isQdBdTogether}}</div>
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
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="6" :xs="12">
            <div class="grid-content tr">初稿日期：</div>
          </el-col>
          <el-col :sm="6" :xs="12">
            <div class="grid-content">{{singleData.firstDraftTimeStr}}</div>
          </el-col>
          <el-col :sm="12">
            <el-col :sm="14" :xs="12">
              <div class="grid-content tr">定稿日期：</div>
            </el-col>
            <el-col :sm="10" :xs="12">
              <div class="grid-content">{{singleData.endDraftTimeStr}}</div>
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div class="dialog-footer tc mt-40">
        <el-button :loading="buttonLoadingSubmit" class="btn-blue shadow mt-15" type="primary" @click='submitSetInfo("setInfoData")'><i class="iconfont icon-tijiao2 f14 mr-5"></i>提 交</el-button>
        <el-button :loading="buttonLoading" class="btn-orange shadow mt-15" type="primary" @click='saveSetInfo("setInfoData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
        <el-button class="btn-white shadow mt-15" @click='resetForm("setInfoData")'><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
      </div>
    </div>
  </el-dialog>
  <!-- 修改确定提交下一步 -->
  <el-dialog title="您确定要提交到下一步【复核】吗？" :visible.sync="confirmNextDialog" :show-close="false" custom-class="comfirm-dialog" size="tiny">
    <span><el-checkbox v-model="checkNextSms">短信提醒</el-checkbox></span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="confirmNextDialog = false">取 消</el-button>
    <el-button :loading="buttonLoadingConfirm" type="primary" @click="confirmNextBtn">确 定</el-button>
  </span>
  </el-dialog>
  <!-- 复核 -->
  <el-dialog :visible.sync="reviewAgainDialog" size="tiny" custom-class="icms-dialog">
    <span slot="title">复核 - 单项工程</span>
    <div class="dialog-box">
      <el-form :model="reviewAgainData" ref="reviewAgainData" label-width="150px" :rules="reviewAgainDataRules">
        <el-row :gutter="16">
          <el-col :sm="24">
            <el-form-item label="复核操作：" class="w" prop="name">
              <el-radio-group v-model="reviewAgainData.issueEdit">
                <el-radio label="通过">通过</el-radio>
                <el-radio label="驳回">驳回</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :sm="24">
            <el-form-item label="复核意见：" class="mt-10 w" prop="name">
              <el-input type="textarea" v-model="reviewAgainData.issueOpinion" class="w90 fl" size="small" placeholder="请输入复核意见"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16" v-if="reviewAgainData.processState=='初稿编制复核'&&(reviewAgainData.workProjectCategory=='4'||reviewAgainData.workProjectCategory=='6')">
          <el-col :sm="24">
            <el-form-item label="初稿核对截止日期：" class="mt-10 w" prop="firstDraftCheckTimeStr">
              <el-date-picker :editable="false" v-model="reviewAgainData.firstDraftCheckTimeStr" size="small" type="date" placeholder="请选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoading" class="btn-blue shadow" type="primary" @click='submitReviewBtn("reviewAgainData")'><i class="iconfont icon-tijiao2 f14 mr-5"></i>确 定</el-button>
          <el-button class="btn-white shadow" @click='reviewAgainDialog = false'><i class="iconfont icon-quxiao1 f14 mr-5"></i>取 消</el-button>
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
      buttonLoading: false,
      buttonLoadingSubmit: false,
      buttonLoadingConfirm: false,
      routerExistence: this.$route.query.projectId,
      fromPathPage: this.$route.query.fromPathPage,
      roleBtn: {
        reviewAgainShow: false,
        checkFile: false
      },
      stepData: [],
      reviewAgainDialog: false,
      singleProcessState: null,
      confirmNextDialog: false,
      checkNextSms: false,
      setInfoDialog: false,
      viewProjectDialog: false,
      openSingleViewDialog: false,
      projectProgressDialog: false,
      viewLoading: false,
      reviewAgainData: {
        issueEdit: "通过",
        issueOpinion: null
      },
      reviewAgainDataRules: {
        firstDraftCheckTimeStr: [{
          required: true,
          message: '请选择初稿核对截止日期'
        }]
      },
      setInfoData: {
        constructionArea: null,
        steelAmount: null,
        steelConsumptionIndicator: null,
        cementAmount: null,
        cementConsumptionIndicator: null,
        readyMixedConcreteAmount: null,
        readyMixedConcreteConsumptionIndicator: null,
        professionalAmount: null,
        professionalUnilateralCost: null,
        manDaysAmount: null,
        manDaysConsumptionIndicator: null,
        remarks: null,
        reviewer: null,
        id: null,
        // 单项工程审定信息
        singleReviewAmount: null,
        singleContractAmount: null,
        singleValidationAmount: null,
        singleReductionRate: null
      },
      setInfoDataReviewer: [],
      setInfoDataRules: {
        reviewer: [{
          required: true,
          message: '请选择复核人'
        }]
      },
      singleSearchData: {
        page: 1,
        rows: 10,
        projectName: null,
        name: null,
        consultant: null,
        professional: null,
        processState: null
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
        investmentNature: '',
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
        increaseProbability: ''
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
        // 项目基本文档
        normalFiles: [],
        // 电子附件
        files: []
      },
      progressLoading: {
        history: false
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
        history: []
      },
      pageNum: 1,
      systemCreatNew: false,
      listLoading: false,
      singleDataContent: [],
      costFilesArray: [],
      total: 0,
      loginUser: '',
      loginInfo: '',
      submitSingleData: {}
    }
  },
  mounted() {
    this.loginUser = this.$store.state.app.userInfo.userName;
    if (this.$route.query.projectId) {
      this.singleSearchData.id = this.$route.query.projectId
      this.getSingleList(this.singleSearchData);
    } else if (this.$route.query.projectName) {
      this.singleSearchData.projectName = this.$route.query.projectName
      this.getSingleList(this.singleSearchData);
    } else {
      this.getSingleList(this.singleSearchData);
    }

    this.loginInfo = this.$store.state.app.userInfo;
    this.setRoleBtn();
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
    setRoleBtn() {
      let roleMenus = this.loginInfo.menus;
      //console.log("用户权限", roleMenus);
      roleMenus.forEach((grandpa) => {
        if (grandpa.menuName == "造价咨询") {
          grandpa.children.forEach((parent) => {
            if (parent.menuName == "单项工程") {
              parent.children.forEach((child) => {
                if (child.menuName.indexOf("复核") != -1) {
                  this.roleBtn.reviewAgainShow = true;
                } else if (child.menuName == "上传电子件") {
                  this.roleBtn.checkFile = true;
                }
              })
            }
          })
        }
      });
    },
    submitReviewBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let submitSetData = {
            "approveOpinion": this.reviewAgainData.issueOpinion,
            "approveResult": this.reviewAgainData.issueEdit,
            "approveType": null,
            "beforeProcessState": this.reviewAgainData.beforeProcessState,
            "cementAmount": null,
            "cementConsumptionIndicator": null,
            "constructionArea": null,
            "constructionContent": null,
            "constructionUnit": null,
            "consultant": this.reviewAgainData.consultant,
            "costConsultationId": this.reviewAgainData.costConsultationId,
            "endDraftTimeStr": null,
            "firstDraftCheckTimeStr": (this.reviewAgainData.workProjectCategory == "4" || this.reviewAgainData.workProjectCategory == '6') && this.reviewAgainData.processState == '初稿编制复核' ? this.publicFun.formatDateShort(this.reviewAgainData.firstDraftCheckTimeStr) :
              null,
            "firstDraftTimeStr": null,
            "id": this.reviewAgainData.id,
            "isQdBdTogether": this.reviewAgainData.isQdBdTogether,
            "isSendMsg": null,
            "issuedDateStr": null,
            "jobRequirement": null,
            "manDaysAmount": null,
            "manDaysConsumptionIndicator": null,
            "name": null,
            "otherContent": null,
            "processState": null,
            "professional": null,
            "professionalAmount": null,
            "professionalUnilateralCost": null,
            "projectManager": null,
            "projectName": null,
            "readyMixedConcreteAmount": null,
            "readyMixedConcreteConsumptionIndicator": null,
            "rejectFlag": null,
            "remarks": null,
            "reviewAmount": null,
            "reviewer": this.reviewAgainData.reviewer,
            "singleContractAmount": null,
            "singleFiles": null,
            "singleReductionRate": null,
            "singleReviewAmount": null,
            "singleValidationAmount": null,
            "steelAmount": null,
            "steelConsumptionIndicator": null,
            "subtractAmount": null,
            "workProjectCategory": this.reviewAgainData.workProjectCategory
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("post", "cost/single/submitCostSingleApprove", submitSetData, (status, data, message) => {
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
                this.reviewAgainDialog = false;
                this.buttonLoading = false;
                this.getSingleList(this.singleSearchData);
              }

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
    // 复核按钮
    reviewAgain(row) {
      console.log("复核信息", row)
      this.reviewAgainDialog = true;
      this.reviewAgainData.id = row.id;
      this.reviewAgainData.reviewer = row.reviewer;
      this.reviewAgainData.costConsultationId = row.costConsultationId;
      this.reviewAgainData.beforeProcessState = row.processState;
      this.reviewAgainData.isQdBdTogether = row.isQdBdTogether;
      this.reviewAgainData.consultant = row.consultant;
      this.reviewAgainData.workProjectCategory = row.workProjectCategory;
    },
    delSingleFile(row, index) {
      //console.log(index)
      this.$confirm('确认要删除此文件吗？', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.publicFun.httpRequest("delete", `cost/single/deleteSingleFile?id=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.singleData.files.splice(index, 1);
          } else {
            this.$message.error(message);
          }
        });
      }).catch(() => {

      });
    },
    // 确认提交
    confirmNextBtn() {
      let submitSetData = {
        "approveOpinion": null,
        "approveResult": null,
        "approveType": null,
        "beforeProcessState": this.submitSingleData.processState,
        "cementAmount": null,
        "cementConsumptionIndicator": null,
        "constructionArea": null,
        "constructionContent": null,
        "constructionUnit": null,
        "consultant": this.submitSingleData.consultant,
        "costConsultationId": this.submitSingleData.costConsultationId,
        "endDraftTimeStr": null,
        "firstDraftCheckTimeStr": null,
        "firstDraftTimeStr": null,
        "id": this.submitSingleData.id,
        "isQdBdTogether": this.submitSingleData.isQdBdTogether,
        "isSendMsg": this.checkNextSms ? "是" : "否",
        "issuedDateStr": null,
        "jobRequirement": null,
        "manDaysAmount": null,
        "manDaysConsumptionIndicator": null,
        "name": null,
        "otherContent": null,
        "processState": null,
        "professional": null,
        "professionalAmount": null,
        "professionalUnilateralCost": null,
        "projectManager": null,
        "projectName": null,
        "readyMixedConcreteAmount": null,
        "readyMixedConcreteConsumptionIndicator": null,
        "rejectFlag": null,
        "remarks": null,
        "reviewAmount": null,
        "reviewer": this.setInfoData.reviewer,
        "singleContractAmount": null,
        "singleFiles": null,
        "singleReductionRate": null,
        "singleReviewAmount": null,
        "singleValidationAmount": null,
        "steelAmount": null,
        "steelConsumptionIndicator": null,
        "subtractAmount": null,
        "workProjectCategory": this.submitSingleData.workProjectCategory
      }
      this.buttonLoadingConfirm = true;
      this.publicFun.httpRequest("post", "cost/single/submitCostSingleApprove", submitSetData, (status, data, message) => {
        if (status == 0) {
          this.buttonLoadingConfirm = false;
          this.$message.success(message);
          this.setInfoDialog = false;
          this.confirmNextDialog = false;
          this.getSingleList(this.singleSearchData);
        } else {
          this.$message.error(message);
        }
      });
    },
    // 提交单项信息
    submitSetInfo(formName) {
      //console.log("formName", formName)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.buttonLoadingSubmit = true;
          this.saveSingleProject((message) => {
            this.confirmNextDialog = true;
            this.buttonLoadingSubmit = false;
          });
        } else {
          this.$message.error("请填写必填项");
          return false;
        }
      });
    },
    // 保存单项信息
    saveSetInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          this.saveSingleProject((message) => {
            this.$message.success(message);
            this.setInfoDialog = false;
            this.buttonLoading = false;
          });
        } else {
          this.$message.error("请填写必填项");
          return false;
        }
      });
    },
    saveSingleProject(callback) {
      let saveInfoData = {
        "cementAmount": this.setInfoData.cementAmount,
        "cementConsumptionIndicator": this.setInfoData.cementConsumptionIndicator,
        "constructionArea": this.setInfoData.constructionArea,
        "id": this.setInfoData.id,
        "manDaysAmount": this.setInfoData.manDaysAmount,
        "manDaysConsumptionIndicator": this.setInfoData.manDaysConsumptionIndicator,
        "processState": this.setInfoData.processState,
        "professionalAmount": this.setInfoData.professionalAmount,
        "professionalUnilateralCost": this.setInfoData.professionalUnilateralCost,
        "readyMixedConcreteAmount": this.setInfoData.readyMixedConcreteAmount,
        "readyMixedConcreteConsumptionIndicator": this.setInfoData.readyMixedConcreteConsumptionIndicator,
        "remarks": this.setInfoData.remarks,
        "reviewer": this.setInfoData.reviewer,
        "singleContractAmount": this.setInfoData.singleContractAmount,
        "singleFiles": this.costFilesArray ? JSON.stringify(this.costFilesArray) : null,
        "singleReductionRate": this.setInfoData.singleReductionRate,
        "singleReviewAmount": this.setInfoData.singleReviewAmount,
        "singleValidationAmount": this.setInfoData.singleValidationAmount,
        "steelAmount": this.setInfoData.steelAmount,
        "steelConsumptionIndicator": this.setInfoData.steelConsumptionIndicator,
        "subtractAmount": 0
      }
      this.publicFun.httpRequest("post", "cost/single/saveCostSingle", saveInfoData, (status, data, message) => {
        if (status == 0) {

          callback(message);
        } else {
          this.$message.error(message);
        }
      });
    },
    setInfoDataBtn(row) {
      // console.log("单项工程基本信息", row)
      this.submitSingleData = row;
      this.singleProcessState = row.processState;
      this.setInfoDialog = true;
      if (this.costFilesArray.length != 0) {
        this.$refs.upload.clearFiles();
      }
      this.costFilesArray = [];

      this.viewNormalInfo(row);
      this.publicFun.httpRequest("get", `role/getUsersByRoleName?roleName=${row.professional}主管`, null, (status, data, message) => {
        if (status == 0) {
          this.setInfoDataReviewer = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    openSingleView(row) {
      this.openSingleViewDialog = true;
      this.viewNormalInfo(row);
    },
    viewNormalInfo(row) {
      this.singleData.singleLoading = true;
      this.publicFun.httpRequest("get", `cost/single/getSingle?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.singleData = {
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
            // 项目基本文档
            normalFiles: data.docs,
            // 电子附件
            files: data.files
          }
          this.publicFun.handleIELoading(() => {
            this.singleData.singleLoading = false;
          });
          this.setInfoData = {
            constructionArea: data.single.constructionArea,
            steelAmount: data.single.steelAmount,
            steelConsumptionIndicator: data.single.steelConsumptionIndicator,
            cementAmount: data.single.cementAmount,
            cementConsumptionIndicator: data.single.cementConsumptionIndicator,
            readyMixedConcreteAmount: data.single.readyMixedConcreteAmount,
            readyMixedConcreteConsumptionIndicator: data.single.readyMixedConcreteConsumptionIndicator,
            professionalAmount: data.single.professionalAmount,
            professionalUnilateralCost: data.single.professionalUnilateralCost,
            manDaysAmount: data.single.manDaysAmount,
            manDaysConsumptionIndicator: data.single.manDaysConsumptionIndicator,
            remarks: data.single.remarks,
            reviewer: data.single.reviewer,
            id: row.id,
            processState: row.processState,
            singleReviewAmount: data.single.singleReviewAmount,
            singleContractAmount: data.single.singleContractAmount,
            singleValidationAmount: data.single.singleValidationAmount,
            singleReductionRate: data.single.singleReductionRate
          }
          this.submitSingleData.projectDirector = data.single.projectDirector;
        } else {
          this.$message.error(message);
        }
      });
    },
    viewProjectProgress(row) {
      this.projectProgressDialog = true;
      this.progressLoading = {
        history: true
      };
      this.progressData.mainData = {
        projectName: row.projectName ? row.projectName : "--",
        consultant: row.consultant ? row.consultant : "--",
        reviewer: row.reviewer ? row.reviewer : "--",
      }
      // 步骤条
      this.stepData = [];
      this.progressData.mainData.processState = 0
      if (row.workProjectCategory == "6") {
        this.stepData = ["初稿编制", "项目经理编制复核", "初稿编制复核", "初稿核对", "项目经理核对复核", "初稿核对复核", "完成"];
        switch (row.processState) {
          case "初稿编制":
            this.progressData.mainData.processState = 0;
            break;
          case "项目经理编制复核":
            this.progressData.mainData.processState = 1;
            break;
          case "初稿编制复核":
            this.progressData.mainData.processState = 2;
            break;
          case "初稿核对":
            this.progressData.mainData.processState = 3;
            break;
          case "项目经理核对复核":
            this.progressData.mainData.processState = 4;
            break;
          case "初稿核对复核":
            this.progressData.mainData.processState = 5;
            break;
          case "完成":
            this.progressData.mainData.processState = 7;
            break;
        }
      } else if (row.workProjectCategory == "2") {
        if (row.approveType == "既做清单又做标底") {
          if (row.isQdBdTogether == "否") {
            this.stepData = ["上传清单", "项目经理审核清单", "审核清单", "上传标底", "项目经理审核标底", "审核标底", "完成"];
            switch (row.processState) {
              case "上传清单":
                this.progressData.mainData.processState = 0;
                break;
              case "项目经理审核清单":
                this.progressData.mainData.processState = 1;
                break;
              case "审核清单":
                this.progressData.mainData.processState = 2;
                break;
              case "上传标底":
                this.progressData.mainData.processState = 3;
                break;
              case "项目经理审核标底":
                this.progressData.mainData.processState = 4;
                break;
              case "审核标底":
                this.progressData.mainData.processState = 5;
                break;
              case "完成":
                this.progressData.mainData.processState = 7;
                break;
            }
          } else {
            this.stepData = ["上传清单标底", "项目经理审核清单标底", "审核清单标底", "完成"];
            switch (row.processState) {
              case "上传清单标底":
                this.progressData.mainData.processState = 0;
                break;
              case "项目经理审核清单标底":
                this.progressData.mainData.processState = 1;
                break;
              case "审核清单标底":
                this.progressData.mainData.processState = 2;
                break;
              case "完成":
                this.progressData.mainData.processState = 4;
                break;
            }
          }
        } else if (row.approveType == "只做清单") {
          this.stepData = ["上传清单", "项目经理审核清单", "审核清单", "完成"];
          switch (row.processState) {
            case "上传清单":
              this.progressData.mainData.processState = 0;
              break;
            case "项目经理审核清单":
              this.progressData.mainData.processState = 1;
              break;
            case "审核清单":
              this.progressData.mainData.processState = 2;
              break;
            case "完成":
              this.progressData.mainData.processState = 4;
              break;
          }
        } else if (row.approveType == "只做标底") {
          this.stepData = ["上传标底", "项目经理审核标底", "审核标底", "完成"];
          switch (row.processState) {
            case "上传标底":
              this.progressData.mainData.processState = 0;
              break;
            case "项目经理审核标底":
              this.progressData.mainData.processState = 1;
              break;
            case "审核标底":
              this.progressData.mainData.processState = 2;
              break;
            case "完成":
              this.progressData.mainData.processState = 4;
              break;
          }
        }

      } else if (row.workProjectCategory == "3") {
        this.stepData = ["上传标底", "审核标底", "完成"];
        switch (row.processState) {
          case "上传标底":
            this.progressData.mainData.processState = 0;
            break;
          case "审核标底":
            this.progressData.mainData.processState = 1;
            break;
          case "完成":
            this.progressData.mainData.processState = 3;
            break;
        }
      } else if (row.workProjectCategory == "1") {
        if (row.approveType == "既做清单又做标底") {
          if (row.isQdBdTogether == "否") {
            this.stepData = ["上传清单", "审核清单", "上传标底", "审核标底", "完成"];
            switch (row.processState) {
              case "上传清单":
                this.progressData.mainData.processState = 0;
                break;
              case "审核清单":
                this.progressData.mainData.processState = 1;
                break;
              case "上传标底":
                this.progressData.mainData.processState = 2;
                break;
              case "审核标底":
                this.progressData.mainData.processState = 3;
                break;
              case "完成":
                this.progressData.mainData.processState = 5;
                break;
            }
          } else {
            this.stepData = ["上传清单标底", "审核清单标底", "完成"];
            switch (row.processState) {
              case "上传清单标底":
                this.progressData.mainData.processState = 0;
                break;
              case "审核清单标底":
                this.progressData.mainData.processState = 1;
                break;
              case "完成":
                this.progressData.mainData.processState = 3;
                break;
            }
          }
        } else if (row.approveType == "只做清单") {
          this.stepData = ["上传清单", "审核清单", "完成"];
          switch (row.processState) {
            case "上传清单":
              this.progressData.mainData.processState = 0;
              break;
            case "审核清单":
              this.progressData.mainData.processState = 1;
              break;
            case "完成":
              this.progressData.mainData.processState = 3;
              break;
          }
        } else if (row.approveType == "只做标底") {
          this.stepData = ["上传标底", "审核标底", "完成"];
          switch (row.processState) {
            case "上传标底":
              this.progressData.mainData.processState = 0;
              break;
            case "审核标底":
              this.progressData.mainData.processState = 1;
              break;
            case "完成":
              this.progressData.mainData.processState = 3;
              break;
          }
        }
      } else if (row.workProjectCategory == "5") {
        this.stepData = ["上传标底", "审核标底", "完成"];
        switch (row.processState) {
          case "上传标底":
            this.progressData.mainData.processState = 0;
            break;
          case "审核标底":
            this.progressData.mainData.processState = 1;
            break;
          case "完成":
            this.progressData.mainData.processState = 3;
            break;
        }
      } else if (row.workProjectCategory == "4") {
        this.stepData = ["初稿编制", "初稿编制复核", "初稿核对", "初稿核对复核", "完成"];
        switch (row.processState) {
          case "初稿编制":
            this.progressData.mainData.processState = 0;
            break;
          case "初稿编制复核":
            this.progressData.mainData.processState = 1;
            break;
          case "初稿核对":
            this.progressData.mainData.processState = 2;
            break;
          case "初稿核对复核":
            this.progressData.mainData.processState = 3;
            break;
          case "完成":
            this.progressData.mainData.processState = 5;
            break;
        }
      } else if (row.workProjectCategory == "7") {
        if (row.approveType == "既做清单又做标底") {
          if (row.isQdBdTogether == "否") {
            this.stepData = ["上传清单", "审核清单", "上传标底", "审核标底", "完成"];
            switch (row.processState) {
              case "上传清单":
                this.progressData.mainData.processState = 0;
                break;
              case "审核清单":
                this.progressData.mainData.processState = 1;
                break;
              case "上传标底":
                this.progressData.mainData.processState = 2;
                break;
              case "审核标底":
                this.progressData.mainData.processState = 3;
                break;
              case "完成":
                this.progressData.mainData.processState = 5;
                break;
              default:
                this.progressData.mainData.processState = 0;
            }
          } else {
            this.stepData = ["上传清单标底", "审核清单标底", "完成"];
            switch (row.processState) {
              case "上传清单标底":
                this.progressData.mainData.processState = 0;
                break;
              case "审核清单标底":
                this.progressData.mainData.processState = 1;
                break;
              case "完成":
                this.progressData.mainData.processState = 3;
                break;
              default:
                this.progressData.mainData.processState = 0;
            }
          }
        } else if (row.approveType == "只做清单") {
          this.stepData = ["上传清单", "审核清单", "完成"];
          switch (row.processState) {
            case "上传清单":
              this.progressData.mainData.processState = 0;
              break;
            case "审核清单":
              this.progressData.mainData.processState = 1;
              break;
            case "完成":
              this.progressData.mainData.processState = 3;
              break;
            default:
              this.progressData.mainData.processState = 0;
          }
        } else if (row.approveType == "只做标底") {
          this.stepData = ["上传标底", "审核标底", "完成"];
          switch (row.processState) {
            case "上传标底":
              this.progressData.mainData.processState = 0;
              break;
            case "审核标底":
              this.progressData.mainData.processState = 1;
              break;
            case "完成":
              this.progressData.mainData.processState = 3;
              break;
            default:
              this.progressData.mainData.processState = 0;
          }
        }
      } else if (row.workProjectCategory == "8") {
        this.stepData = ["上传清单", "审核清单", "完成"];
        switch (row.processState) {
          case "上传清单":
            this.progressData.mainData.processState = 0;
            break;
          case "审核清单":
            this.progressData.mainData.processState = 1;
            break;
          case "完成":
            this.progressData.mainData.processState = 3;
            break;
        }
      } else if (row.workProjectCategory == "5") {
        this.stepData = ["上传标底", "审核标底", "完成"];
        switch (row.processState) {
          case "上传标底":
            this.progressData.mainData.processState = 0;
            break;
          case "审核标底":
            this.progressData.mainData.processState = 1;
            break;
          case "完成":
            this.progressData.mainData.processState = 3;
            break;
        }
      } else if (row.workProjectCategory == "4") {
        this.stepData = ["初稿编制", "初稿编制复核", "初稿核对", "初稿核对复核", "完成"];
        switch (row.processState) {
          case "初稿编制":
            this.progressData.mainData.processState = 0;
            break;
          case "初稿编制复核":
            this.progressData.mainData.processState = 1;
            break;
          case "初稿核对":
            this.progressData.mainData.processState = 2;
            break;
          case "初稿核对复核":
            this.progressData.mainData.processState = 3;
            break;
          case "完成":
            this.progressData.mainData.processState = 5;
            break;
        }
      } else if (row.workProjectCategory == "9") {
        if (row.approveType == "既做清单又做标底") {
          if (row.isQdBdTogether == "否") {
            this.stepData = ["上传清单", "项目经理审核清单", "审核清单", "上传标底", "项目经理审核标底", "审核标底", "完成"];
            switch (row.processState) {
              case "上传清单":
                this.progressData.mainData.processState = 0;
                break;
              case "项目经理审核清单":
                this.progressData.mainData.processState = 1;
                break;
              case "审核清单":
                this.progressData.mainData.processState = 2;
                break;
              case "上传标底":
                this.progressData.mainData.processState = 3;
                break;
              case "项目经理审核标底":
                this.progressData.mainData.processState = 4;
                break;
              case "审核标底":
                this.progressData.mainData.processState = 5;
                break;
              case "完成":
                this.progressData.mainData.processState = 7;
                break;
              default:
                this.progressData.mainData.processState = 0;
            }
          } else {
            this.stepData = ["上传清单标底", "项目经理审核清单标底", "审核清单标底", "完成"];
            switch (row.processState) {
              case "上传清单标底":
                this.progressData.mainData.processState = 0;
                break;
              case "项目经理审核清单标底":
                this.progressData.mainData.processState = 1;
                break;
              case "审核清单标底":
                this.progressData.mainData.processState = 2;
                break;
              case "完成":
                this.progressData.mainData.processState = 4;
                break;
              default:
                this.progressData.mainData.processState = 0;
            }
          }
        } else if (row.approveType == "只做清单") {
          this.stepData = ["上传清单", "项目经理审核清单", "审核清单", "完成"];
          switch (row.processState) {
            case "上传清单":
              this.progressData.mainData.processState = 0;
              break;
            case "项目经理审核清单":
              this.progressData.mainData.processState = 1;
              break;
            case "审核清单":
              this.progressData.mainData.processState = 2;
              break;
            case "完成":
              this.progressData.mainData.processState = 4;
              break;
            default:
              this.progressData.mainData.processState = 0;
          }
        } else if (row.approveType == "只做标底") {
          this.stepData = ["上传标底", "项目经理审核标底", "审核标底", "完成"];
          switch (row.processState) {
            case "上传标底":
              this.progressData.mainData.processState = 0;
              break;
            case "项目经理审核标底":
              this.progressData.mainData.processState = 1;
              break;
            case "审核标底":
              this.progressData.mainData.processState = 2;
              break;
            case "完成":
              this.progressData.mainData.processState = 4;
              break;
            default:
              this.progressData.mainData.processState = 0;
          }
        }
      }
      this.publicFun.httpRequest("get", `history/get?type=biz_cost_single&bizId=${row.id}`, null, (status, data, message) => {
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
    viewProject(row) {
      this.viewProjectDialog = true;
      this.viewLoading = true;
      let params = {
        id: row.costConsultationId
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
            projectStructure: data.project.engineeringStructure ? data.project.engineeringStructure : "--",
            unit: data.project.measurementUnitStr ? data.project.measurementUnitStr : "--",
            askType: data.project.consultingType ? data.project.consultingType : "--",
            workType: data.project.workProjectCategoryStr ? data.project.workProjectCategoryStr : "--",
            approveType: data.project.approveType ? data.project.approveType : "--",
            companyName: data.project.delegateUnitName ? data.project.delegateUnitName : "--",
            companyPerson: data.project.delegateUnitContact ? data.project.delegateUnitContact : "--",
            companyTel: data.project.delegateUnitPhone ? data.project.delegateUnitPhone : "--",
            investmentNature: data.project.investmentProperties ? data.project.investmentProperties : "--",
            projectLocation: data.project.projectLocation ? data.project.projectLocation : "--",
            dataReceivedDate: data.project.informationReceivedDateStr ? data.project.informationReceivedDateStr : "--",
            registerDate: data.project.enrollmentDateStr ? data.project.enrollmentDateStr : "--",
            appointmentDoneDate: data.project.agreedJobCompletionDateStr ? data.project.agreedJobCompletionDateStr : "--",
            projectRequirement: data.project.projectDetailRequirements ? data.project.projectDetailRequirements : "--",
            technologyLeader: data.project.technicalDirector ? data.project.technicalDirector : "--",
            projectDistribution: data.project.projectAssignPerson ? data.project.projectAssignPerson : "--",
            projectManager: data.project.projectManager ? data.project.projectManager : "--",
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
            increaseProbability: data.project.projectReductionRate ? data.project.projectReductionRate : "--"
          }
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    getSingleList(params) {
      this.listLoading = true;
      this.publicFun.httpRequest("get", "cost/single/listSingles", null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(() => {
            this.listLoading = false;
          });
          this.singleDataContent = data.rows;
          this.total = data.total;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    singleCurrentChange(val) {
      this.singleSearchData.page = val;
      this.getSingleList(this.singleSearchData);
      this.pageNum = val;
    },
    singleSearchBtn() {
      this.pageNum = 1;
      this.singleSearchData.name = this.singleSearchData.name ? this.singleSearchData.name.trim() : null;
      this.singleSearchData.projectName = this.singleSearchData.projectName ? this.singleSearchData.projectName.trim() : null;
      this.singleSearchData.consultant = this.singleSearchData.consultant ? this.singleSearchData.consultant.trim() : null;
      this.getSingleList(this.singleSearchData);
    },
    systemDel() {
      this.$confirm('确认要删除这条公告吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    systemCreat() { //新增公告
      this.systemCreatNew = true;
    },
    systemStop() { //停用
      this.$confirm('您确认要停用这则公告吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    requireRemove(file, fileList) {
      this.costFilesArray.forEach((item) => {
        if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1) {
          this.costFilesArray.removeByValue(item);
        }
      });
    },
    requireSuccess(response, file, fileList) {
      let fileData = {
        fileName: response.record[0].fileName,
        createUser: this.loginUser

      }
      this.costFilesArray.push(fileData);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    fileError(err, file, fileList) {
      this.$message.error("很抱歉，上传失败，请检查文件大小或稍后再试");
    },
  }
};
</script>

<style lang="stylus" scoped>
#systemSetting-content
  .el-form--inline .el-form-item
    margin-bottom 0
.el-form-item
  margin-bottom 5px
</style>
