<template>
<div id="infoShow" class="app-container">
  <header class="p25 bg-color-white shadow radius5 tl" v-loading.body="articleLoading">
    <div class="f18">
      {{article.title}}
    </div>
    <div class="f12 color-gray mt-8">
      <span><i class="iconfont icon-zuozhe f12 mr-5"></i>{{article.author}}</span>
      <span class="ml-20"><i class="iconfont icon-date f12 mr-5"></i>{{article.time}}</span>
    </div>
  </header>
  <article class="mt-30 bg-color-white shadow radius5 p25" v-loading.body="articleLoading">
    <div class="no-content tc mt-50 mb-50" v-if="contentShow">
      <i class="iconfont icon-zanwushuju1"></i>
      <p>暂无内容</p>
    </div>
    <div class="ql-editor" v-html="article.content"></div>
  </article>
  <section class="file-list oh" v-if="fileShow">
    <div class="mt-30 f16 color-gray">
      下载附件
    </div>
    <div class="fl mt-15 mr-20" v-for="item in article.files">
      <a :href="item.name | setDownloadUrl" target="_blank">
        <el-tooltip class="item" effect="dark" placement="top-start">
          <div class="f14" slot="content">点击下载 {{item.name}}</div>
          <div :title="item.name" class="tc file-list-content radius5 shadow word mt-15 color-white cb cp" :class="item.type">
            <i class="iconfont f40 w20" :class="item.type"></i>
          </div>
        </el-tooltip>
      </a>
    </div>
  </section>
</div>
</template>
<script>
export default {
  name: "infoShow",
  data() {
    return {
      articleLoading: true,
      contentShow: false,
      article: {
        title: "",
        author: "",
        time: "",
        content: ""
      },
      fileShow: false
    }
  },
  filters: {
    setDownloadUrl(url) {
      return `${location.origin}/icms/info/download?fileName=${url}`;
    }
  },
  mounted() {
    var articleId = this.$router.history.current.query.articleId;
    this.getArticle(articleId);
  },
  methods: {
    getArticle(articleId) {
      this.publicFun.httpRequest("get", `info/get?id=${articleId}`, null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(() => {
            this.articleLoading = false;
          });
          if (data.file) {
            let fileData = data.file.split(";");
            var fileArr = [];
            fileData.forEach((item) => {
              if (item.indexOf(".zip") != -1 || item.indexOf(".rar") != -1 || item.indexOf(".zip") != -1 || item.indexOf(".7z") != -1) {
                var type = "icon-zip";
                // console.log(item)
              } else if (item.indexOf(".doc") != -1 || item.indexOf(".docx") != -1) {
                var type = "icon-word";
              } else if (item.indexOf(".xls") != -1 || item.indexOf(".xlsx") != -1) {
                var type = "icon-excle";
              } else if (item.indexOf(".ppt") != -1 || item.indexOf(".pptx") != -1) {
                var type = "icon-ppt";
              } else if (item.indexOf(".jpg") != -1 || item.indexOf(".JPG") != -1 || item.indexOf(".jepg") != -1 || item.indexOf(".png") != -1 || item.indexOf(".bmp") != -1 || item.indexOf(".BMP") != -1 || item.indexOf(".gif") != -1) {
                var type = "icon-jpg";
              } else if (item.indexOf(".pdf") != -1) {
                var type = "icon-pdf";
              } else {
                var type = "icon-other";
              }
              let fileObj = {
                name: item,
                type: type
              }
              fileArr.push(fileObj)
            });
            this.fileShow = true;
          } else {
            var fileArr = [];
          }
          this.article = {
            title: data.title,
            author: data.author,
            time: data.createtimeStr,
            content: data.content,
            files: fileArr
          }
          if (data.content == "") {
            this.contentShow = true;
          }
          // console.log(this.article);
        } else {
          this.$message.error(message);
        }
      });
    }
  }
}
</script>
<style lang="stylus">
.file-list
  .file-list-content
    width 80px
    height 80px
    line-height 85px
    background-color #ffac44
    i
      font-size 30px
    &:before
      content ""
  .icon-word
    background-color #4d84d4
  .icon-excle
    background-color #18b761
  .icon-ppt
    background-color #dd5b27
  .icon-zip
    background-color #dc8e00
  .icon-pdf
    background-color #ff6d6d
  .icon-jpg
    background-color #ff7171
</style>
