<template>
<div id="wait-content" class="app-container">
  <el-tabs type="card" v-loading="listLoading" :value="waitSelected">
    <el-tab-pane name="造价咨询">
      <span slot="label">造价咨询（{{cost}}）</span>
      <el-table :data="costData" fit highlight-current-row>
        <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
        <el-table-column min-width="250" label="待办事项"><template slot-scope="scope">
          <el-tooltip popper-class="wait-text" :content="scope.row.content" placement="top">
          <span :title="scope.row.content" class='inlineBlock color-old-green text-short cp' @click="goToCost(scope.row)" v-html="scope.row.content.indexOf('驳回')!=-1?`<span class='color-red'>${scope.row.content}</span>`:`${scope.row.content}`"></span>
        </el-tooltip>
        </template>
        </el-table-column>
        <el-table-column label="时间" width="150" align="center" prop="createTimeStr"></el-table-column>
        <el-table-column label="截止日期" width="150" align="center">
          <template slot-scope="scope">
            <span v-html="dueDateStr(scope.row)"></span>
          </template>
        </el-table-column>
        <el-table-column label="逾期（天）" width="100" align="center">
          <template slot-scope="scope">
            <span v-html="assignDueDays(scope.row)"></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="专业工程师" width="300">
          <template slot-scope="scope">
            {{scope.row.consultant?scope.row.consultant:"--"}}
          </template>
        </el-table-column>
      </el-table>
      <footer class="mt-30 cb pagination" v-if="cost">
        <el-pagination @current-change="costCurrentChange" :current-page.sync="costPage" layout="prev, pager, next, jumper" :page-size="15" :total="cost" class="fr">
        </el-pagination>
        <span class="fr f13 color-8 pagination-text mr-15">每页 15 条，共 {{cost}} 条记录</span>
      </footer>
    </el-tab-pane>
    <el-tab-pane name="工程代理">
      <span slot="label">工程代理（{{project}}）</span>
      <el-table :data="projectData" fit highlight-current-row>
        <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
        <el-table-column label="待办事项">
          <template slot-scope="scope">
          <router-link class='inlineBlock' to="costSetting/projectSetting">
          {{scope.row.content}}
          </router-link>
        </template>
        </el-table-column>
        <el-table-column label="时间" width="300" align="center" prop="createTimeStr"></el-table-column>
        <el-table-column align="center" prop="consultant" label="项目负责人" width="300"></el-table-column>
      </el-table>
      <footer class="mt-30 cb pagination" v-if="project">
        <el-pagination @current-change="projectCurrentChange" :current-page.sync="projectPage" layout="prev, pager, next, jumper" :page-size="15" :total="project" class="fr">
        </el-pagination>
        <span class="fr f13 color-8 pagination-text mr-15">每页 15 条，共 {{project}} 条记录</span>
      </footer>
    </el-tab-pane>
    <el-tab-pane name="采购代理">
      <span slot="label">采购代理（{{buy}}）</span>
      <el-table :data="buyData" fit highlight-current-row>
        <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
        <el-table-column label="待办事项">
          <template slot-scope="scope">
          <router-link class='inlineBlock' to="/waitDetails">
          {{scope.row.content}}
          </router-link>
        </template>
        </el-table-column>
        <el-table-column label="时间" width="300" align="center" prop="createTimeStr"></el-table-column>
        <el-table-column align="center" prop="engineering_projectDirector" label="项目负责人" width="300"></el-table-column>
      </el-table>
      <footer class="mt-30 cb pagination" v-if="project">
        <el-pagination @current-change="buyCurrentChange" :current-page.sync="buyPage" layout="prev, pager, next, jumper" :page-size="15" :total="buy" class="fr">
        </el-pagination>
        <span class="fr f13 color-8 pagination-text mr-15">每页 15 条，共 {{buy}} 条记录</span>
      </footer>
    </el-tab-pane>
    <el-tab-pane name="全过程">
      <span slot="label">全过程（{{whole}}）</span>
      <el-table :data="wholeData" fit highlight-current-row>
        <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
        <el-table-column label="待办事项">
          <template slot-scope="scope">
            <el-tooltip popper-class="wait-text" :content="scope.row.content" placement="top">
              <span :title="scope.row.content" class='inlineBlock color-old-green text-short cp' @click="goToWhole(scope.row)" v-html="scope.row.content.indexOf('驳回')!=-1?`<span class='color-red'>${scope.row.content}</span>`:`${scope.row.content}`"></span>
            </el-tooltip>
        </template>
        </el-table-column>
        <el-table-column label="时间" width="150" align="center" prop="createTimeStr"></el-table-column>
        <el-table-column label="截止日期" width="150" align="center">
          <template slot-scope="scope">
            <span v-html='scope.row.jobCommitDeadlineDateStr?`<span class="color-red">${scope.row.jobCommitDeadlineDateStr}</span>`:"--"'></span>
            </template>
        </el-table-column>
        <el-table-column label="逾期（天）" width="100" align="center" prop="createTimeStr">
          <template slot-scope="scope">
            <span v-html='scope.row.consultantjobDueDays>0?`<span class="color-red">${scope.row.consultantjobDueDays}</span>`:"--"'></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="专业工程师" width="300">
          <template slot-scope="scope">
            <span v-html="wholeprocessProjectManager(scope.row)"></span>
          </template>
        </el-table-column>
      </el-table>
      <footer class="mt-30 cb pagination" v-if="whole">
        <el-pagination @current-change="wholeCurrentChange" :current-page.sync="wholePage" layout="prev, pager, next, jumper" :page-size="15" :total="whole" class="fr">
        </el-pagination>
        <span class="fr f13 color-8 pagination-text mr-15">每页 15 条，共 {{whole}} 条记录</span>
      </footer>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
export default {
  data() {
    return {
      waitSelected: "造价咨询",
      fromPath: this.$route.query.fromPath,
      listLoading: true,
      cost: 0,
      project: 0,
      buy: 0,
      whole: 0,
      costPage: this.$store.state.app.costPageNum ? this.$store.state.app.costPageNum : 1,
      costData: [],
      projectPage: 1,
      projectData: [],
      buyPage: 1,
      buyData: [],
      wholePage: this.$store.state.app.wholePageNum ? this.$store.state.app.wholePageNum : 1,
      wholeData: []
    }
  },
  mounted() {
    this.getCostList(this.costPage, "cost");
    this.getProjectList(1, "agent_engineering");
    this.getBuyList(1, "agent_buy");
    this.getWholeList(this.wholePage, "wholeprocess");
    this.changeTab()
  },
  methods: {
    changeTab() {
      if (this.fromPath == "wholeProject") {
        this.waitSelected = "全过程"
      }else if(this.fromPath == "costProject"){
        this.waitSelected = "造价咨询"
      }
    },
    dueDateStr(row) {
      if (row.type == "biz_cost") {
        return row.dueDays > 0 ? `<span class="color-red">${row.dueDateStr}</span>` : row.dueDateStr
      } else {
        if (row.content.indexOf("初稿") != -1) {
          return row.firstDraftTimeStr ? `<span class="color-red">${row.firstDraftTimeStr}</span>` : "--"
        } else if (row.content.indexOf("核对稿") != -1) {
          return row.firstDraftCheckTimeStr ? `<span class="color-red">${row.firstDraftCheckTimeStr}</span>` : "--"
        } else if (row.content.indexOf("上传标底") != -1) {
          return row.assignTimeStr ? `<span class="color-red">${row.assignTimeStr}</span>` : "--"
        } else {
          return "--"
        }
      }
    },
    wholeprocessProjectManager(row) {
      if (row.type == "biz_wholeprocess_consultant") {
        return row.wholeprocess_consultant
      } else if (row.type == "biz_wholeprocess_pm") {
        return row.wholeprocess_projectManager
      } else {
        return "--"
      }

    },
    assignDueDays(row) {
      if (row.type == "biz_cost") {

        return row.dueDays > 0 ? `<span class="color-red">${Math.abs(row.dueDays)}</span>` : "--"
      } else {
        if (row.content.indexOf("初稿") != -1) {
          return row.firstDraftDueDays > 0 ? `<span class="color-red">${Math.abs(row.firstDraftDueDays)}</span>` : "--"
        } else if (row.content.indexOf("核对稿") != -1) {
          return row.firstDraftCheckDueDays > 0 ? `<span class="color-red">${Math.abs(row.firstDraftCheckDueDays)}</span>` : "--"
        } else if (row.content.indexOf("上传标底") != -1) {
          return row.assignDueDays > 0 ? `<span class="color-red">${Math.abs(row.assignDueDays)}</span>` : "--"
        } else {
          return "--"
        }
      }
    },
    goToCost(row) {
      if (row.type == "biz_cost_single") {
        this.$router.push({
          path: "costSetting/singleSetting",
          query: {
            projectId: row.singleId,
            fromPathPage:"wait"
          }
        });
      } else if (row.type == "biz_cost") {
        this.$router.push({
          path: "costSetting/projectSetting",
          query: {
            projectId: row.projectId,
            fromPathPage:"wait"
          }
        });
      }
    },
    goToWhole(row) {
      //console.log("全过程",row)
      if (row.type == "biz_wholeprocess_consultant") {
        this.$router.push({
          path: "wholeSetting/wholeSingle",
          query: {
            projectId: row.singleId,
            jobId: row.jobId,
            content: row.content,
            fromPathPage:"wait"
          }
        });
      } else if (row.type == "biz_wholeprocess_pm") {
        this.$router.push({
          path: "wholeSetting/wholeProject",
          query: {
            projectId: row.projectId,
            jobId: row.jobId,
            fromPathPage:"wait"
          }
        });
      } else if (row.type == "biz_wholeprocess") {
        this.$router.push({
          path: "wholeSetting/wholeProject",
          query: {
            projectId: row.projectId,
            fromPathPage:"wait"
          }
        });
      }
    },
    getCostList(page, type) {
      this.publicFun.httpRequest("get", `home/mission/list?page=${page}&rows=15&type=${type}`, null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(()=>{
            this.listLoading = false;
          });

          // //console.log("待办", data);
          this.costData = data.rows;
          this.cost = data.total;
        }
      })
    },
    costCurrentChange(val) {
      this.getCostList(val, "cost");
      this.$store.state.app.costPageNum = val;
    },
    getProjectList(page, type) {
      this.publicFun.httpRequest("get", `home/mission/list?page=${page}&rows=15&type=${type}`, null, (status, data, message) => {
        if (status == 0) {
          // //console.log("工程管理", data);
          this.projectData = data.rows;
          this.project = data.total;
        }
      })
    },
    projectCurrentChange(val) {
      this.getProjectList(val, "agent_engineering");
    },
    getBuyList(page, type) {
      this.publicFun.httpRequest("get", `home/mission/list?page=${page}&rows=15&type=${type}`, null, (status, data, message) => {
        if (status == 0) {
          // //console.log("采购", data);
          this.buyData = data.rows;
          this.buy = data.total;
        }
      })
    },
    buyCurrentChange(val) {
      this.getbuyList(val, "agent_buy");
    },
    getWholeList(page, type) {
      this.publicFun.httpRequest("get", `home/mission/list?page=${page}&rows=15&type=${type}`, null, (status, data, message) => {
        if (status == 0) {
          // //console.log("全过程", data);
          this.wholeData = data.rows;
          this.whole = data.total;
        }
      })
    },
    wholeCurrentChange(val) {
      this.getWholeList(val, "wholeprocess");
      this.$store.state.app.wholePageNum = val;

    },
  }
};
</script>

<style lang="stylus">
#wait-content
  .el-tabs__content
    overflow inherit
  .el-tabs__header
    padding 15px
    border none
    background-color #fff
    border-radius 5px
    font-weight 600
    box-shadow 0px 1px 3px rgba(0, 0, 0, 0.12)
    .el-tabs__nav
      border 1px solid #324157
      border-radius 5px
      .el-tabs__item
        height 38px
        line-height 37px
      .el-tabs__item:nth-child(2)
        border-right 1px solid #324157
        border-left 1px solid #324157
      .el-tabs__item:nth-child(3)
        border-right 1px solid #324157
    .el-tabs__item.is-active
      border 1px solid transparent
      background-color #37c3d2
      border-radius 0
      color #fff
  a
    transition all .3s
  .el-table__body tr.current-row>td,.el-table--enable-row-hover .el-table__body tr:hover>td
    background-color #f1f1f1
    a
      color #ec852a
      text-decoration underline
  .pagination
    .pagination-text
      margin-top 8px

</style>
