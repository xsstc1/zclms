<template>
<div class="home-container p20">
  <!-- <div class='dashboard-text'>name:{{name}}</div>
    <div class='dashboard-text'>role:<span v-for='role in roles' :key='role'>{{role}}</span></div> -->
  <header class="cb">
    <!-- <div class="w20 fl p0-10 mb-10 header-sub-title">
      <router-link :to="{ path: 'waitList'}">
        <div class="home-wait bg-color-white radius5 cb oh">
          <div class="fl w40 tc home-icon"><i class="iconfont icon-daiban f50 color-white"></i></div>
          <div class="fl w60 tl home-title color-white">
            <div class="f14">
              待办事项
            </div>
            <div class="f35 beauty-num">
              <countTo :startVal='0' :endVal='waitCounts' :duration='3000'></countTo>
            </div>
          </div>
        </div>
      </router-link>
    </div> -->
    <div class="w25 fl p0-10 mb-10 header-sub-title">
      <router-link :to="{ path: 'infoSetting/culture'}">
        <div class="home-culture bg-color-white radius5 cb oh">
          <div class="fl w40 tc home-icon"><i class="iconfont icon-bendiwenhua f50 color-white"></i></div>
          <div class="fl w60 tl home-title">
            <div class="f14">
              企业文化
            </div>
            <div class="f35 beauty-num">
              <countTo :startVal='0' :endVal='cultureCounts' :duration='4000'></countTo>
            </div>
          </div>
        </div>
      </router-link>
    </div>
    <div class="w25 fl p0-10 mb-10 header-sub-title" v-if='userInfo.departmentName!="外部企业"'>
      <router-link :to="{ path: 'infoSetting/notice'}">
        <div class="home-notice bg-color-white radius5 cb oh">
          <div class="fl w40 tc home-icon"><i class="iconfont icon-icon03 f50 color-white"></i></div>
          <div class="fl w60 tl home-title">
            <div class="f14">
              通知公告
            </div>
            <div class="f35 beauty-num">
              <countTo :startVal='0' :endVal='noticeCounts' :duration='5000'></countTo>
            </div>
          </div>
        </div>
      </router-link>
    </div>
    <div class="w25 fl p0-10 mb-10 header-sub-title" v-if='userInfo.departmentName!="外部企业"'>
      <router-link :to="{ path: 'infoSetting/inside'}">
        <div class="home-info bg-color-white radius5 cb oh">
          <div class="fl w40 tc home-icon"><i class="iconfont icon-ziliao f50 color-white"></i></div>
          <div class="fl w60 tl home-title">
            <div class="f14">
              内部资料
            </div>
            <div class="f35 beauty-num">
              <countTo :startVal='0' :endVal='infoCounts' :duration='4000'></countTo>
            </div>
          </div>
        </div>
      </router-link>
    </div>
    <div class="w25 fl p0-10 mb-10 header-sub-title">
      <router-link :to="{ path: 'infoSetting/honor'}">
        <div class="home-honor bg-color-white radius5 cb oh">
          <div class="fl w40 tc home-icon"><i class="iconfont icon-rongyu f50 color-white"></i></div>
          <div class="fl w60 tl home-title">
            <div class="f14">
              企业荣誉
            </div>
            <div class="f35 beauty-num">
              <countTo :startVal='0' :endVal='honorCounts' :duration='3000'></countTo>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </header>
  <article class="p10">
    <el-row :gutter="20">
      <!-- <el-col :span="12" :xs="24" class="mt-25">
        <div class="grid-content home-list-wait bg-color-white oh radius5 shadow" v-loading.body="indexLoading">
          <nav class="color-m6 f14 cb bbs-1 p15">
            <div class="fl">
              <i class="iconfont icon-daiban mr-5"></i>待办事项
            </div>
            <div class="fr f13">
              <router-link :to="{ path: 'waitList'}">
                更多>>
              </router-link>
            </div>
          </nav>
          <section>
            <div class="no-content tc mt-50" v-if="waitShow">
              <i class="iconfont icon-zanwushuju1"></i>
              <p>暂无内容</p>
            </div>
            <nav class="cb f14 fb" v-if="!waitShow">
              <div class="fl w50 mobile-width">
                <span class="p0-10 text-short">待办主题</span>
              </div>
              <div class="fl w15 hidden-xs">
                <span class="p0-10 text-short">通知时间</span>
              </div>
              <div class="fl w15 hidden-xs">
                <span class="p0-10 text-short">项目类型</span>
              </div>
              <div class="fl w20 hidden-xs">
                <span class="p0-10 text-short">状态</span>
              </div>
            </nav>
            <ul class="f14">
              <li class="cb" v-for="(item,index) in waitContent">
                <div class="fl w50 text-short mobile-width">
                  <el-tooltip popper-class="wait-text" :content="item.content" placement="top">
                    <span :class="colorWaitType(item)" class="p0-10 cp" @click="goToCost(item)">{{item.content}}</span>
                  </el-tooltip>

                </div>
                <div class="fl w15 text-short hidden-xs">
                  <span :title="item.createTimeStr" class="p0-10">{{item.createTimeStr}}</span>
                </div>
                <div class="fl w15 text-short hidden-xs">
                  <span class="p0-10">{{item.type=="biz_cost"||item.type=="biz_cost_single"?"造价咨询":item.type=="biz_wholeprocess_consultant"||item.type=="biz_wholeprocess_pm"||item.type=="biz_wholeprocess"?"全过程":"--"}}</span>
                </div>
                <div class="fl w20 text-short hidden-xs">
                  <span class="p0-10">{{item.currentState}}</span>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </el-col> -->
      <el-col :span="12" :xs="24" class="mt-25">
        <div class="grid-content home-list-price bg-color-white oh radius5 shadow" v-loading.body="indexLoading">
          <nav class="color-m6 f14 cb bbs-1 p15">
            <div class="fl">
              <i class="iconfont icon-jiage mr-5"></i>材料价格
            </div>
            <div class="fr f13">
              <router-link to="/infoSetting/price">更多>></router-link>
            </div>
          </nav>
          <section>
            <div class="no-content tc mt-50" v-if="priceShow">
              <i class="iconfont icon-zanwushuju1"></i>
              <p>暂无内容</p>
            </div>
            <nav class="cb f14 fb" v-if="!priceShow">
              <div class="fl w60 mobile-width">
                <span class="p0-10 text-short">主题</span>
              </div>
              <div class="fl w20">
                <span class="p0-10 text-short hidden-xs">发布时间</span>
              </div>
              <div class="fl w20">
                <span class="p0-10 text-short hidden-xs">发布人</span>
              </div>
            </nav>
            <ul class="f14">
              <li class="cb" v-for="(item , index) in priceContent">
                <div class="fl w60 text-short mobile-width">
                  <router-link :to="{ path: 'infoSetting/infoShow', query: { articleId: item.id }}">
                    <span :title="item.title" class="p0-10">{{item.title}}</span>
                  </router-link>
                </div>
                <div class="fl w20 text-short">
                  <span class="p0-10 hidden-xs">{{item.createTimeStr}}</span>
                </div>
                <div class="fl w20 text-short">
                  <span class="p0-10 hidden-xs">{{item.author}}</span>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </el-col>
      <el-col :span="12" :xs="24" class="mt-25" v-if='userInfo.departmentName!="外部企业"'>
        <div class="grid-content home-list-notice bg-color-white oh radius5 shadow" v-loading.body="indexLoading">
          <nav class="color-m6 f14 cb bbs-1 p15">
            <div class="fl">
              <i class="iconfont icon-icon03 mr-5"></i>公告栏
            </div>
            <div class="fr f13">
              <router-link to="/infoSetting/notice">更多>></router-link>
            </div>
          </nav>
          <section>
            <div class="no-content tc mt-50" v-if="noticeShow">
              <i class="iconfont icon-zanwushuju1"></i>
              <p>暂无内容</p>
            </div>
            <nav class="cb f14 fb" v-if="!noticeShow">
              <div class="fl w60 mobile-width">
                <span class="p0-10 text-short">主题</span>
              </div>
              <div class="fl w20">
                <span class="p0-10 text-short hidden-xs">发布时间</span>
              </div>
              <div class="fl w20">
                <span class="p0-10 text-short hidden-xs">发布人</span>
              </div>
            </nav>
            <ul class="f14">
              <li class="cb" v-for="(item, index) in noticeContent">
                <div class="fl w60 text-short mobile-width">
                  <router-link :to="{ path: 'infoSetting/infoShow', query: { articleId: item.id }}">
                    <span :title="item.title" class="p0-10">{{item.title}}</span>
                  </router-link>
                </div>
                <div class="fl w20 text-short">
                  <span class="p0-10 hidden-xs">{{item.createTimeStr}}</span>
                </div>
                <div class="fl w20 text-short">
                  <span class="p0-10 hidden-xs">{{item.author}}</span>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </el-col>
      <el-col :span="12" :xs="24" class="mt-25">
        <div class="grid-content home-list-rule bg-color-white oh radius5 shadow" v-loading.body="indexLoading">
          <nav class="color-m6 f14 cb bbs-1 p15">
            <div class="fl">
              <i class="iconfont icon-guizhangzhidu mr-5"></i>法规制度
            </div>
            <div class="fr f13">
              <router-link to="/infoSetting/statute">更多>></router-link>
            </div>
          </nav>
          <section>
            <div class="no-content tc mt-50" v-if="ruleShow">
              <i class="iconfont icon-zanwushuju1"></i>
              <p>暂无内容</p>
            </div>
            <nav class="cb f14 fb" v-if="!ruleShow">
              <div class="fl w60">
                <span class="p0-10 text-short mobile-width">主题</span>
              </div>
              <div class="fl w20">
                <span class="p0-10 text-short hidden-xs">发布时间</span>
              </div>
              <div class="fl w20">
                <span class="p0-10 text-short hidden-xs">发布人</span>
              </div>
            </nav>
            <ul class="f14">
              <li class="cb" v-for="(item , index) in ruleContent">
                <div class="fl w60 text-short mobile-width">
                  <router-link :to="{ path: 'infoSetting/infoShow', query: { articleId: item.id }}">
                    <span :title="item.title" class="p0-10">{{item.title}}</span>
                  </router-link>
                </div>
                <div class="fl w20 text-short">
                  <span class="p0-10 hidden-xs">{{item.createTimeStr}}</span>
                </div>
                <div class="fl w20 text-short">
                  <span class="p0-10 hidden-xs">{{item.author}}</span>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </el-col>
      <el-col :span="12" :xs="24" class="mt-25" v-if='userInfo.departmentName!="外部企业"'>
        <div class="grid-content home-list-info bg-color-white oh radius5 shadow" v-loading.body="indexLoading">
          <nav class="color-m6 f14 cb bbs-1 p15">
            <div class="fl">
              <i class="iconfont icon-ziliao mr-5"></i>内部资料
            </div>
            <div class="fr f13">
              <router-link to="/infoSetting/inside">更多>></router-link>
            </div>
          </nav>
          <section>
            <div class="no-content tc mt-50" v-if="insideShow">
              <i class="iconfont icon-zanwushuju1"></i>
              <p>暂无内容</p>
            </div>
            <nav class="cb f14 fb" v-if="!insideShow">
              <div class="fl w60">
                <span class="p0-10 text-short mobile-width">主题</span>
              </div>
              <div class="fl w20">
                <span class="p0-10 text-short hidden-xs">发布时间</span>
              </div>
              <div class="fl w20">
                <span class="p0-10 text-short hidden-xs">发布人</span>
              </div>
            </nav>
            <ul class="f14">
              <li class="cb" v-for="(item,index) in insideContent">
                <div class="fl w60 text-short mobile-width">
                  <router-link :to="{ path: 'infoSetting/infoShow', query: { articleId: item.id }}">
                    <span :title="item.title" class="p0-10">{{item.title}}</span>
                  </router-link>
                </div>
                <div class="fl w20 text-short">
                  <span class="p0-10 hidden-xs">{{item.createTimeStr}}</span>
                </div>
                <div class="fl w20 text-short">
                  <span class="p0-10 hidden-xs">{{item.author}}</span>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </el-col>
      <el-col :span="12" :xs="24" class="mt-25">
        <div class="grid-content home-list-company bg-color-white oh radius5 shadow">
          <nav class="color-m6 f14 cb bbs-1 p15">
            <div class="fl">
              <i class="iconfont icon-qiye mr-5"></i>企业专栏
            </div>
          </nav>
          <section>
            <el-row class="f16 color-white">
              <el-col :span="12" :xs="24" class="mt-35">
                <router-link to="/infoSetting/honor">
                  <div class="grid-content tc">
                    <span class="text-short home-company-honor">企业荣誉</span>
                  </div>
                </router-link>
              </el-col>
              <el-col :span="12" :xs="24" class="mt-35">
                <router-link to="/infoSetting/achievement">
                  <div class="grid-content tc">
                    <span class="text-short home-company-achievement">企业经营业绩</span>
                  </div>
                </router-link>
              </el-col>
              <el-col :span="12" :xs="24" class="mt-35">
                <router-link to="/infoSetting/culture">
                  <div class="grid-content tc">
                    <span class="text-short home-company-culture">企业文化</span>
                  </div>
                </router-link>
              </el-col>
              <el-col :span="12" :xs="24" class="mt-35 mb-40">
                <router-link to="/infoSetting/forum">
                  <div class="grid-content tc">
                    <span class="text-short home-company-forum">论坛</span>
                  </div>
                </router-link>
              </el-col>
            </el-row>
          </section>
        </div>
      </el-col>
    </el-row>
  </article>
</div>
</template>

<script>
import countTo from 'vue-count-to';
export default {
  name: 'home',
  components: {
    countTo
  },
  data() {
    return {
      userInfo: this.$store.state.app.userInfo,
      indexLoading: false,
      waitCounts: 0,
      cultureCounts: 0,
      noticeCounts: 0,
      infoCounts: 0,
      honorCounts: 0,
      noticeContent: [],
      noticeShow: false,
      waitContent: [],
      waitShow: false,
      priceContent: [],
      priceShow: false,
      ruleContent: [],
      ruleShow: false,
      insideContent: [],
      insideShow: false
    }
  },
  mounted() {
    this.indexLoading = true;
    this.publicFun.httpRequest("get", 'home/index?rows=6', null, (status, data, message) => {
      if (status == 0) {
        this.publicFun.handleIELoading(() => {
          this.indexLoading = false;
        });
        let headerInfo = data;
        /***顶部数字区***/
        this.waitCounts = headerInfo.missionSum;
        headerInfo.countNoReadPostList.forEach((item) => {
          if (item.classid == 8) {
            this.cultureCounts = item.counts;
          } else if (item.classid == 6) {
            this.honorCounts = item.counts;
          } else if (item.classid == 1) {
            this.noticeCounts = item.counts;
          } else if (item.classid == 4) {
            this.infoCounts = item.counts;
          }
        });
        /***中间内容区***/
        //待办
        this.waitContent = headerInfo.missionList;
        if (headerInfo.missionSum == 0) {
          this.waitShow = true;
        }
        let indexInfo = headerInfo.indexPostList;
        indexInfo.forEach(params => {
          // 公告
          if (params.classid == 1) {
            this.noticeContent.push(params);
          }
          // 材料价格
          if (params.classid == 5) {
            this.priceContent.push(params);
          }
          // 法规制度
          if (params.classid == 3) {
            this.ruleContent.push(params);
          }
          // 内部资料
          if (params.classid == 4) {
            this.insideContent.push(params);
          }
        });
        // 公告显示
        if (this.noticeContent.length == 0) {
          this.noticeShow = true;
        }

        //价格显示
        if (this.priceContent.length == 0) {
          this.priceShow = true;
        }
        // 法规显示
        if (this.ruleContent.length == 0) {
          this.ruleShow = true;
        }
        // 内部资料显示
        if (this.insideContent.length == 0) {
          this.insideShow = true;
        }
      }
    });
  },
  methods: {
    colorWaitType: function(item) {
      return {
        color_whole: item.type.indexOf("wholeprocess") != -1,
        color_cost: item.type.indexOf("cost") != -1
      }
    },
    goToCost(row) {
      if (row.type == "biz_cost_single") {
        this.$router.push({
          path: "costSetting/singleSetting",
          query: {
            projectId: row.singleId,
            fromPathPage: "home"
          }
        });
      } else if (row.type == "biz_cost") {
        this.$router.push({
          path: "costSetting/projectSetting",
          query: {
            projectId: row.projectId,
            fromPathPage: "home"
          }
        });
      } else if (row.type == "biz_wholeprocess_consultant") {
        this.$router.push({
          path: "wholeSetting/wholeSingle",
          query: {
            projectId: row.singleId,
            jobId: row.jobId,
            content: row.content,
            fromPathPage: "home"
          }
        });
      } else if (row.type == "biz_wholeprocess_pm") {
        this.$router.push({
          path: "wholeSetting/wholeProject",
          query: {
            projectId: row.projectId,
            jobId: row.jobId,
            fromPathPage: "home"
          }
        });
      } else if (row.type == "biz_wholeprocess") {
        this.$router.push({
          path: "wholeSetting/wholeProject",
          query: {
            projectId: row.projectId,
            fromPathPage: "home"
          }
        });
      }
    }
  }

}
</script>

<style rel="stylesheet" lang="stylus" scoped>
.color_whole
  color #58239a
.color_cost
  color #098dad
.home-container
  .home-icon
    padding 20px 10px
  .home-title
    padding-left 25px
    margin-top 20px
  .beauty-num
    padding-left 2px
    font-size 45px
  .home-wait
    // background-color #f39c73
    .home-icon
      background-color #e2916a
  .home-culture
    // background-color #1dccab
    .home-icon
      background-color #1cbd9f
  .home-notice
    // background-color #f98a8a
    .home-icon
      background-color #e47a7a
  .home-info
    // background-color #5da8d4
    .home-icon
      background-color #5295bd
  .home-honor
    // background-color #37c3d2
    .home-icon
      background-color #32aab7
  .home-list-wait,.home-list-price,.home-list-notice,.home-list-rule,.home-list-info,.home-list-company
    border-top 2px solid #f37676
    min-height 345px
    section
      nav
        padding 10px 15px
      ul
        padding-bottom 8px
        li
          padding 10px 15px
          transition all .5s
          &:hover
            background-color #f1f1f1
  .home-list-price
    border-top 2px solid #5da8d4
  .home-list-notice
    border-top 2px solid #37c3d2
  .home-list-rule
    border-top 2px solid #e2916a
  .home-list-info
    border-top 2px solid #8b71f1
  .home-list-company
    border-top 2px solid #1dccab
    section
      span
        background-color #ccc
        border-radius 5px
        padding 25px 15px
        display inline-block
        width 75%
    .home-company-honor
      background-color #5da8d4
    .home-company-achievement
      background-color #1dccab
    .home-company-culture
      background-color #37c3d2
    .home-company-forum
      background-color #f39c73
@media screen and (max-width: 767px)
  .header-sub-title
    width 100%
    margin-bottom 20px
  .mobile-width
    width 100%
@media screen and (min-width: 768px) and (max-width: 1199px)
  .header-sub-title,.mobile-width
    width 50%
</style>
