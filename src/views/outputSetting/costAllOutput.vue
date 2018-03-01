<template>
    <div id="systemSetting-content" class="app-container">
        <header class="p20 bg-color-white shadow radius5">
            <div class="mt-5">
                <el-form :inline="true" ref="monitoringData" :model="monitoringData" class="demo-form-inline" label-width="140px">
                    <el-form-item label="项目类型：" class="mt-10" prop="workProjectCategory">
                        <el-select v-model="monitoringData.workProjectCategory" size="small" placeholder="请选择项目类别">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="标底编制" value="1"></el-option>
                            <el-option label="标底编制（全过程）" value="2"></el-option>
                            <el-option label="材料设备询价" value="3"></el-option>
                            <el-option label="结算审核" value="4"></el-option>
                            <el-option label="预算编制" value="5"></el-option>
                            <el-option label="待处理" value="6"></el-option>
                            <el-option label="标底（零星）" value="7"></el-option>
                            <el-option label="清单编制" value="8"></el-option>
                            <el-option label="全过程" value="9"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="核减率：" class="mt-10" prop="workProjectCategory">
                        <el-select v-model="monitoringData.workProjectCategory" size="small" placeholder="请选择项目类别">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="标底编制" value="1"></el-option>
                            <el-option label="标底编制（全过程）" value="2"></el-option>
                            <el-option label="材料设备询价" value="3"></el-option>
                            <el-option label="结算审核" value="4"></el-option>
                            <el-option label="预算编制" value="5"></el-option>
                            <el-option label="待处理" value="6"></el-option>
                            <el-option label="标底（零星）" value="7"></el-option>
                            <el-option label="清单编制" value="8"></el-option>
                            <el-option label="全过程" value="9"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="项目名称：" class="mt-10" prop="projectName">
                        <el-input size="small" v-model="monitoringData.projectName" placeholder="请输入项目名称"></el-input>
                    </el-form-item>
                    <el-form-item label="项目编号：" class="mt-10" prop="projectName">
                        <el-input size="small" v-model="monitoringData.projectName" placeholder="请输入项目名称"></el-input>
                    </el-form-item>
                    <el-form-item label="标底价：" class="mt-10" prop="workProjectCategory">
                        <el-select v-model="monitoringData.workProjectCategory" size="small" placeholder="请选择项目类别">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="1000万以上" value="1000万以上"></el-option>
                            <el-option label="2000万以上" value="2000万以上"></el-option>
                            <el-option label="5000万以上" value="5000万以上"></el-option>
                            <el-option label="1亿以上" value="1亿以上"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审定价：" class="mt-10" prop="workProjectCategory">
                        <el-select v-model="monitoringData.workProjectCategory" size="small" placeholder="请选择项目类别">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="1000万以上" value="1000万以上"></el-option>
                            <el-option label="2000万以上" value="2000万以上"></el-option>
                            <el-option label="5000万以上" value="5000万以上"></el-option>
                            <el-option label="1亿以上" value="1亿以上"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="施工单位：" class="mt-10" prop="consultant">
                        <el-input size="small" v-model="monitoringData.consultant" placeholder="请输入专业咨询员"></el-input>
                    </el-form-item>
                    <el-form-item label="建设单位：" class="mt-10" prop="consultant">
                        <el-input size="small" v-model="monitoringData.consultant" placeholder="请输入专业咨询员"></el-input>
                    </el-form-item>
                    <el-form-item label="收账情况：" class="mt-10" prop="workProjectCategory">
                        <el-select v-model="monitoringData.workProjectCategory" size="small" placeholder="请选择项目类别">
                            <el-option label="请选择" value=""></el-option>
                            <el-option label="标底编制" value="1"></el-option>
                            <el-option label="标底编制（全过程）" value="2"></el-option>
                            <el-option label="材料设备询价" value="3"></el-option>
                            <el-option label="结算审核" value="4"></el-option>
                            <el-option label="预算编制" value="5"></el-option>
                            <el-option label="待处理" value="6"></el-option>
                            <el-option label="标底（零星）" value="7"></el-option>
                            <el-option label="清单编制" value="8"></el-option>
                            <el-option label="全过程" value="9"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标识年份：" class="mt-10" prop="reportProjectFlag">
                        <el-select v-model="monitoringData.reportProjectFlag" size="small" placeholder="请选择工作项目类别">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="是" value="是"></el-option>
                            <el-option label="否" value="否"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开票公司：" class="mt-10" prop="delegateUnitName">
                        <el-input size="small" v-model="monitoringData.delegateUnitName" placeholder="请输入委托单位"></el-input>
                    </el-form-item>
                    <el-form-item label="项目负责人：" class="mt-10" prop="unitName">
                        <el-input size="small" v-model="monitoringData.unitName" placeholder="请输入建设单位"></el-input>
                    </el-form-item>
                    <span class="disinblock">
                        <el-form-item label="资料收到日期：" class="mt-10" prop="informationReceivedDateFrom">
                            <el-date-picker :editable="false" v-model="monitoringData.informationReceivedDateFrom" type="date" placeholder="请选择日期" clearable></el-date-picker>
                        </el-form-item>
                        <span class="ml-10 mr-15 mt-15 disinblock">至</span>
                        <el-form-item class="mt-10 block-xs" prop="informationReceivedDateTo">
                            <el-date-picker :editable="false" v-model="monitoringData.informationReceivedDateTo" type="date" placeholder="请选择日期" clearable></el-date-picker>
                        </el-form-item>
                    </span>
                    <span class="disinblock">
                        <el-form-item label="资料收到日期：" class="mt-10" prop="informationReceivedDateFrom">
                            <el-date-picker :editable="false" v-model="monitoringData.informationReceivedDateFrom" type="date" placeholder="请选择日期" clearable></el-date-picker>
                        </el-form-item>
                        <span class="ml-10 mr-15 mt-15 disinblock">至</span>
                        <el-form-item class="mt-10 block-xs" prop="informationReceivedDateTo">
                            <el-date-picker :editable="false" v-model="monitoringData.informationReceivedDateTo" type="date" placeholder="请选择日期" clearable></el-date-picker>
                        </el-form-item>
                    </span>
                </el-form>
            </div>
            <div class="mt-10 mb-15 tc">
                <el-button @click='monitoringSearchBtn' type="primary" class="btn-orange shadow mt-15">
                    <i class="iconfont icon-shiliangzhinengduixiang f13 mr-5"></i>查 询</el-button>
                <el-button @click='resetForm("monitoringData")' type="primary" class="btn-indigo shadow mt-15">
                    <i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
                <el-button @click='creatNewOutputBtn' type="primary" class="btn-blue shadow mt-15">
                    <i class="iconfont icon-iconfont707 f12 mr-5"></i>新 建</el-button>
                <el-button @click="exportWholeSingle" :loading="exportLoading" class="btn-green shadow mt-15" type="primary">
                    <i class="iconfont icon-excel f12 mr-5"></i>导出Excel</el-button>
            </div>
        </header>
        <article class="mt-30">
            <el-table :data="monitoringDataContent" v-loading="listLoading" fit highlight-current-row>
                <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
                <el-table-column min-width="100" label="所属专业" prop="professional"></el-table-column>
                <el-table-column label="专业咨询员" width="100" align="left" prop="consultant"></el-table-column>
                <el-table-column min-width="180" label="项目名称" prop="projectName"></el-table-column>
                <el-table-column label="项目类别" width="100" align="left" prop="workProjectCategoryStr"></el-table-column>
                <el-table-column label="资料收到日期" width="150" align="center" prop="informationReceivedDateStr"></el-table-column>
                <el-table-column label="委托单位名称" width="150" align="left" prop="delegateUnitName"></el-table-column>
                <el-table-column label="施工单位" width="180" align="left">
                    <template slot-scope="scope">
                        {{scope.row.constructionUnitName?scope.row.constructionUnitName:"--"}}
                    </template>
                </el-table-column>
                <el-table-column label="送审金额（元）" width="120" align="center">
                    <template slot-scope="scope">
                        {{scope.row.reviewAmount?scope.row.reviewAmount:"--"}}
                    </template>
                </el-table-column>
                <el-table-column label="当前状态" width="120" align="center" prop="processState"></el-table-column>
                <el-table-column label="初稿时间" width="150" align="center">
                    <template slot-scope="scope">
                        {{scope.row.firstDraftTimeStr?scope.row.firstDraftTimeStr:"--"}}
                    </template>
                </el-table-column>
                <el-table-column label="定稿时间" width="120" align="center">
                    <template slot-scope="scope">
                        {{scope.row.endDraftTimeStr?scope.row.endDraftTimeStr:"--"}}
                    </template>
                </el-table-column>
            </el-table>
        </article>

        <footer class="mt-30 cb pagination" v-if="total">
            <el-pagination @current-change="overDueCurrentChange" :current-page.sync="pageNum" :page-size="10" layout="prev, pager, next, jumper" :total="total" class="fr">
            </el-pagination>
            <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{total}}条记录</span>
        </footer>
        <el-dialog :visible.sync="outputNewDataDialog" size="small" custom-class="icms-dialog">
            <span slot="title">新增 - 造价产值数据</span>
            <div class="dialog-box" v-loading="viewLoading">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="项目信息" name="first">
                        <el-form :model="outputNewData" ref="outputNewData" label-width="100px" :rules="outputNewDataRules">
                            <div class="icms-dialog-content pr p30 mt-30">
                                <nav class="pa">
                                    造价产值数据
                                </nav>
                                <el-row :gutter="16">
                                    <el-col :sm="14">
                                        <el-form-item label="项目名称：" class="mt-10 w" prop="estimatePrice">
                                            <el-input v-model="outputNewData.estimatePrice" class="w" size="small" placeholder="请输入概算价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="10">
                                        <el-form-item label="项目负责人：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16">
                                    <el-col :sm="6">
                                        <el-form-item label="项目类型：" class="mt-10 w" prop="estimatePrice">
                                            <el-select v-model="monitoringData.workProjectCategory" size="small" placeholder="请选择项目类别">
                                                <el-option label="请选择" value=""></el-option>
                                                <el-option label="标底编制" value="1"></el-option>
                                                <el-option label="标底编制（全过程）" value="2"></el-option>
                                                <el-option label="材料设备询价" value="3"></el-option>
                                                <el-option label="结算审核" value="4"></el-option>
                                                <el-option label="预算编制" value="5"></el-option>
                                                <el-option label="待处理" value="6"></el-option>
                                                <el-option label="标底（零星）" value="7"></el-option>
                                                <el-option label="清单编制" value="8"></el-option>
                                                <el-option label="全过程" value="9"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="6">
                                        <el-form-item label="项目编号：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="6">
                                        <el-form-item label="建筑面积：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="6">
                                        <el-form-item label="合同价：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16">
                                    <el-col :sm="24">
                                        <el-form-item label="施工单位：" class="mt-10 w" prop="estimatePrice">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16">
                                    <el-col :sm="24">
                                        <el-form-item label="建设单位：" class="mt-10 w" prop="estimatePrice">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16">
                                    <el-col :sm="24">
                                        <el-form-item label="委托单位：" class="mt-10 w" prop="estimatePrice">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16">
                                    <el-col :sm="6">
                                        <el-form-item label="项目编号：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="6">
                                        <el-form-item label="项目编号：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="6">
                                        <el-form-item label="建筑面积：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="6">
                                        <el-form-item label="合同价：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16">
                                    <el-col :sm="6">
                                        <el-form-item label="项目编号：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="6">
                                        <el-form-item label="项目编号：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="6">
                                        <el-form-item label="建筑面积：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="6">
                                        <el-form-item label="合同价：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16">
                                    <el-col :sm="6">
                                        <el-form-item label="项目编号：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="6">
                                        <el-form-item label="项目编号：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="6">
                                        <el-form-item label="建筑面积：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16">
                                    <el-col :sm="6">
                                        <el-form-item label="项目编号：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="6">
                                        <el-form-item label="项目编号：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="6">
                                        <el-form-item label="建筑面积：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16">
                                    <el-col :sm="6">
                                        <el-form-item label="项目编号：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="6">
                                        <el-form-item label="项目编号：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="6">
                                        <el-form-item label="建筑面积：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16">
                                    <el-col :sm="6">
                                        <el-form-item label="项目编号：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="6">
                                        <el-form-item label="项目编号：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :sm="6">
                                        <el-form-item label="建筑面积：" class="mt-10 w" prop="takeCost">
                                            <el-input v-model="outputNewData.takeCost" class="w" size="small" placeholder="请输入建安工程造价"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="项目开票" name="second">配置管理</el-tab-pane>
                </el-tabs>

            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first',
      exportLoading: false,
      viewLoading: false,
      outputNewDataDialog: false,
      outputNewData: {},
      outputNewDataRules: {},
      monitoringData: {
        page: 1,
        rows: 10,
        projectName: '',
        consultant: '',
        workProjectCategory: '',
        reportProjectFlag: '',
        professional: '',
        processState: '',
        delegateUnitName: '',
        unitName: '',
        informationReceivedDateFrom: '',
        informationReceivedDateTo: ''
      },
      pageNum: 1,
      listLoading: false,
      monitoringDataContent: [],
      total: 0
    }
  },
  mounted() {
    this.getMonitoringList(this.monitoringData)
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    creatNewOutputBtn() {
      this.outputNewDataDialog = true
    },
    exportWholeSingle() {
      //批量导出

      this.$confirm('确定要导出吗？生成文件时间可能较长，请耐心等待。', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          const { buildExcel } = require('../../assets/js/jsonToXlsx.js')

          let exportData = {
            projectName: this.monitoringData.projectName
              ? this.monitoringData.projectName.trim()
              : null,
            consultant: this.monitoringData.consultant
              ? this.monitoringData.consultant.trim()
              : null,
            delegateUnitName: this.monitoringData.delegateUnitName
              ? this.monitoringData.delegateUnitName.trim()
              : null,
            unitName: this.monitoringData.unitName
              ? this.monitoringData.unitName.trim()
              : null,
            informationReceivedDateFrom: this.monitoringData
              .informationReceivedDateFrom
              ? this.publicFun.formatDateShort(
                  this.monitoringData.informationReceivedDateFrom
                )
              : null,
            informationReceivedDateTo: this.monitoringData
              .informationReceivedDateTo
              ? this.publicFun.formatDateShort(
                  this.monitoringData.informationReceivedDateTo
                )
              : null,
            workProjectCategory: this.monitoringData.workProjectCategory,
            reportProjectFlag: this.monitoringData.reportProjectFlag,
            professional: this.monitoringData.professional,
            processState: this.monitoringData.processState
          }
          //console.log("exportData", exportData)
          this.$message({
            message: '正在为您生成Excel文件，请稍后……',
            duration: 0
          })
          this.exportLoading = true

          this.publicFun.httpRequest(
            'get',
            `monitor/exportSingle`,
            null,
            (status, data, message) => {
              if (status == 0) {
                let excelData = [
                  [
                    '序号',
                    '所属专业',
                    '专业咨询员',
                    '项目名称',
                    '项目类别',
                    '资料收到日期',
                    '委托单位名称',
                    '施工单位',
                    '送审金额（元）',
                    '当前状态',
                    '初稿时间',
                    '定稿时间'
                  ]
                ]
                for (let item in data) {
                  let excelSaveArray = [
                    item != 'removeByValue' ? parseInt(item) + 1 : '',
                    data[item].professional,
                    data[item].consultant,
                    data[item].projectName,
                    data[item].workProjectCategory,
                    data[item].informationReceivedDateStr,
                    data[item].delegateUnitName,
                    data[item].constructionUnitName,
                    data[item].reviewAmount,
                    data[item].processState,
                    data[item].firstDraftTimeStr,
                    data[item].endDraftTimeStr
                  ]
                  excelData.push(excelSaveArray)
                }
                buildExcel(excelData, `单项工程查询表`)
                this.exportLoading = false
                this.$message.closeAll()
              } else {
                that.$message.error(message)
                this.exportLoading = false
              }
            },
            exportData
          )
        })
        .catch(() => {})
    },
    getMonitoringList(params) {
      this.listLoading = true
      this.publicFun.httpRequest(
        'get',
        'monitor/listSingle',
        null,
        (status, data, message) => {
          if (status == 0) {
            this.listLoading = false
            this.monitoringDataContent = data.rows
            this.total = data.total
          } else {
            this.$message.error(message)
          }
        },
        params
      )
    },
    overDueCurrentChange(val) {
      this.monitoringData.page = val
      this.getMonitoringList(this.monitoringData)
      this.pageNum = val
    },
    monitoringSearchBtn() {
      this.pageNum = 1
      this.monitoringData.projectName = this.monitoringData.projectName
        ? this.monitoringData.projectName.trim()
        : null
      this.monitoringData.consultant = this.monitoringData.consultant
        ? this.monitoringData.consultant.trim()
        : null
      this.monitoringData.delegateUnitName = this.monitoringData
        .delegateUnitName
        ? this.monitoringData.delegateUnitName.trim()
        : null
      this.monitoringData.unitName = this.monitoringData.unitName
        ? this.monitoringData.unitName.trim()
        : null
      this.monitoringData.informationReceivedDateFrom = this.monitoringData
        .informationReceivedDateFrom
        ? this.publicFun.formatDateShort(
            this.monitoringData.informationReceivedDateFrom
          )
        : null
      this.monitoringData.informationReceivedDateTo = this.monitoringData
        .informationReceivedDateTo
        ? this.publicFun.formatDateShort(
            this.monitoringData.informationReceivedDateTo
          )
        : null
      this.getMonitoringList(this.monitoringData)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
