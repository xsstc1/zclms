<template>
<div id="singleProject">
  <div class="f13 p15">
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
    <div class="icms-dialog-content pr mt-30" v-loading="singleData.singleLoading">
      <nav class="pa">
        单项工程相关报告信息
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
  </div>
</div>
</template>
<script>
export default {
  name: "singleProject",
  filters: {
    setSingleDownloadUrl(url) {
      return `${location.origin}/icms/cost/single/download?id=${url}`;
    }
  },
  props: {
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
    }
  }
}
</script>
