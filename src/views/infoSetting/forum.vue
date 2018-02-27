<template>
<div id="article-content" class="app-container">
  <header class="p20 bg-color-white shadow radius5 tr header-article-search">
    <form action="javascript:return true">
      <input name="search" autocomplete="off" type="search" @keyup.enter="searchArticle" id="search-input" v-model="searchArticleContent" class="roles-search f13" placeholder="请输入您想查找的文章标题" /><button type="primary" @click="searchArticle" class="btn-orange roles-search-btn el-button color-white shadow">搜索</button>
      <el-button v-if="roleBtnInfo.submitArticle" @click="addArticleBtn" type="primary" class="btn-green shadow"><i class="iconfont icon-iconfont707 f12 mr-5"></i>发布文章</el-button>
    </form>
  </header>
  <article class="mt-30">
    <el-table ref="multipleTable" :data="tableData" v-loading.body="listLoading" fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
      <el-table-column min-width="180" label="标题" align="left">
        <template slot-scope="scope">
          <router-link class="color-green" :to="{ path: 'infoShow', query: { articleId: scope.row.id }}">
            {{scope.row.title}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="200" align="left" prop="createtimeStr"></el-table-column>
      <el-table-column label="作者" width="120" align="left" prop="author"></el-table-column>
      <el-table-column v-if="roleBtnInfo.submitArticle" align="center" prop="person" label="操作" width="250">
        <template slot-scope="scope">
        <el-button @click="editArticle(scope.row)" type="text" size="small">修改文章</el-button>
        <el-button @click="diOrAbleArticle(scope.row)" type="text" size="small">{{scope.row.status == "启用" ? "停用" : "启用"}}</el-button>
        <el-button @click="delArticle(scope.row)" type="text" size="small">删除</el-button>
        <el-button @click="topArticle(scope.row)" type="text" size="small">置顶</el-button>
      </template>
      </el-table-column>
    </el-table>
  </article>

  <footer class="mt-30 cb pagination" v-show="total">
    <el-pagination @current-change="handleCurrentChange" :current-page.sync="pageNum" :page-size="10" layout="prev, pager, next, jumper" :total="total" class="fr">
    </el-pagination>
    <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{total}}条记录</span>
  </footer>
  <el-dialog :visible.sync="addArticleDialog" size="small" custom-class="icms-dialog">
    <span slot="title">发布文章</span>
    <div class="dialog-box">
      <div class="add-department">
        <el-form label-width="100px">
          <el-form-item label="文章标题：">
            <el-input id="aricle-title" v-model="articleTitle" placeholder="请输入文章标题"></el-input>
          </el-form-item>
          <el-form-item label="文章内容：">
            <div class="article-edit">
              <quill-editor v-model="content" :options="editorOption"></quill-editor>
            </div>
          </el-form-item>
          <el-form-item label="附件文件：">
            <el-upload ref="upload" class="upload-file w" :on-remove="articleRemove" :on-error="articleError" :on-success="articleSuccess" drag action="icms/info/upload" accept="*" multiple>
              <i class="el-icon-upload f16 color-gray"></i>
              <div class="el-upload__text">将文件拖到此处，或点击上传</div>
              <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer tc mt-10 mb-20">
        <el-button class="btn-orange shadow" type="primary" @click="saveArticle"><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
        <el-button class="btn-white shadow" @click="addArticleDialog = false"><i class="iconfont icon-quxiao1 f14 mr-5"></i>取 消</el-button>

      </div>
    </div>
  </el-dialog>
  <el-dialog :visible.sync="editArticleDialog" size="small" custom-class="icms-dialog">
    <span slot="title">修改文章</span>
    <div class="dialog-box">
      <div class="add-department" v-loading="editLoading">
        <el-form label-width="100px">
          <el-form-item label="文章标题：">
            <el-input id="aricle-edit-title" v-model="editArticleData.title" placeholder="请输入文章标题"></el-input>
          </el-form-item>
          <el-form-item label="文章内容：">
            <div class="article-edit">
              <quill-editor v-model="editArticleData.content" :options="editorOption"></quill-editor>
            </div>
          </el-form-item>
          <el-form-item label="附件文件：">
            <el-upload ref="upload" class="upload-file w" :on-remove="articleEditRemove" :on-error="articleError" :on-success="articleEditSuccess" drag action="icms/info/upload" accept="*" multiple>
              <i class="el-icon-upload f16 color-gray"></i>
              <div class="el-upload__text">将文件拖到此处，或点击上传</div>
              <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
            </el-upload>
          </el-form-item>
          <el-form-item class="file-list">
            <div class="fl mt-10 mr-20 " v-for="item in editArticleData.filesShow">
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div class="f14" slot="content">点击删除 {{item.name}}</div>
                <div @click="delEditFile(item.name)" class="tc file-list-content radius5 shadow word color-white cb cp" :class="item.type">
                  <i class="iconfont f40 w20" :class="item.type"></i>
                </div>
              </el-tooltip>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer tc mt-10 mb-20">
        <el-button class="btn-orange shadow" type="primary" @click="saveEditArticle"><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
        <el-button class="btn-white shadow" @click="editArticleDialog = false"><i class="iconfont icon-quxiao1 f14 mr-5"></i>取 消</el-button>
      </div>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      typeId: 2,
      content: '',
      editLoading: false,
      searchArticleContent: "",
      addArticleDialog: false,
      editArticleDialog: false,
      roleSettingDialog: false,
      roleBtnInfo: {
        submitArticle: false
      },
      editArticleData: {
        title: null,
        content: '',
        files: [],
        id: null
      },
      listLoading: true,
      articleTitle: "",
      pageNum: 1,
      fileName: [],
      total: 0,
      tableData: [],
      editorOption: {
        placeholder: '请输入内容',
        modules: {
          toolbar: [
            [{
              'size': ['small', false, 'large', 'huge']
            }],
            ['bold', 'italic', 'underline', 'strike'],
            [{
              'color': []
            }, {
              'background': []
            }],
            [{
              'align': []
            }],
            [{
              'list': 'ordered'
            }, {
              'list': 'bullet'
            }],
            ['link', 'image']
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          }
        }
      }
    }
  },
  created() {
    this.roleBtnShow();
    this.getAllInfo(this.pageNum, "");
  },
  methods: {
    addArticleBtn() {
      this.addArticleDialog = true;
      this.resetArticle();
    },
    roleBtnShow() {
      let meanRole = this.$store.state.app.userInfo.menus;
      //console.log("项目于管理", meanRole);
      meanRole.forEach((grandpa) => {
        if (grandpa.menuName == "我的首页") {
          grandpa.children.forEach((parent) => {
            if (parent.menuName == "内容发布") {
              this.roleBtnInfo.submitArticle = true;
            }
          })
        }
      });
    },
    getAllInfo(page, title) {
      let params = {
        page: page,
        rows: 10,
        classid: this.typeId,
        title: title.trim()
      }
      this.publicFun.httpRequest("get", 'info/list', null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(() => {
            this.listLoading = false;
          });
          this.tableData = data.rows;
          this.total = data.total;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    editArticle(row) {
      if (this.editArticleData.files.length != 0) {
        this.$refs.upload.clearFiles();
      }
      let params = {
        id: row.id
      }
      this.editLoading = true
      this.publicFun.httpRequest("get", 'info/get', null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(() => {
            this.editLoading = false;
          });
          if (data.file) {
            let fileData = data.file.split(";");
            var fileArr = [];
            fileData.forEach((item) => {
              if (item.indexOf(".zip") != -1 || item.indexOf(".rar") != -1 || item.indexOf(".zip") != -1 || item.indexOf(".7z") != -1) {
                var type = "icon-zip";
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
          this.editArticleData = {
            title: data.title,
            content: data.content,
            filesShow: fileArr,
            files: data.file ? data.file.split(";") : [],
            id: data.id
          }
          this.editArticleDialog = true;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    articleEditSuccess(response, file, fileList) {
      //console.log(response);
      this.editArticleData.files.push(response.record[0].fileName);
    },
    articleEditRemove(file, fileList) {
      this.editArticleData.files.forEach((item) => {
        if (item.split(".")[0].indexOf(file.name.split(".")[0]) != -1) {
          this.editArticleData.files.removeByValue(item);
        }
      })
    },
    delEditFile(name) {
      this.$confirm('确认删除此文件吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.editArticleData.files.removeByValue(name);
        this.editArticleData.filesShow.forEach((item) => {
          if (item.name == name) {
            this.editArticleData.filesShow.splice(item, 1)
          }
        });
      }).catch(() => {});
    },
    saveEditArticle() {
      if (this.editArticleData.title == "") {
        this.$message.error("请填写标题");
        document.querySelector("#aricle-edit-title input").focus();
      } else {
        let editArticle = {
          "classid": this.typeId,
          "content": this.editArticleData.content,
          "file": this.editArticleData.files.join(";"),
          "id": this.editArticleData.id,
          "title": this.editArticleData.title
        }
        //console.log("保存的数据", editArticle)
        this.publicFun.httpRequest("put", 'info/update', editArticle, (status, data, message) => {
          if (status == 0) {
            this.$message({
              type: 'success',
              message: '修改成功！'
            });
            this.editArticleDialog = false;
            this.getAllInfo(this.pageNum, "");
          } else {
            this.$message.error(message);
          }
        });
      }
    },
    searchArticle() {
      this.getAllInfo(1, this.searchArticleContent);
    },
    handleCurrentChange(val) {
      this.getAllInfo(val, "");
      this.pageNum = val
    },
    diOrAbleArticle(row) {
      if (row.status == "启用") {
        this.$confirm('确认要停用这篇文章吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false
        }).then(() => {
          let params = {
            id: row.id
          }
          this.publicFun.httpRequest("put", 'info/disable', null, (status, data, message) => {
            if (status == 0) {
              this.$message({
                type: 'success',
                message: '停用成功!'
              });
              this.getAllInfo(this.pageNum, "");
            } else {
              this.$message.error(message);
            }
          }, params);
        }).catch(() => {});
      } else if (row.status == "停用") {
        this.$confirm('确认要启用这篇文章吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false
        }).then(() => {
          let params = {
            id: row.id
          }
          this.publicFun.httpRequest("put", 'info/enable', null, (status, data, message) => {
            if (status == 0) {
              this.$message({
                type: 'success',
                message: '启用成功!'
              });
              this.getAllInfo(this.pageNum, "");
            } else {
              this.$message.error(message);
            }
          }, params);
        }).catch(() => {});
      }
    },
    delArticle(row) {
      this.$confirm('确认要删除这篇文章吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        let params = {
          id: row.id
        }
        this.publicFun.httpRequest("delete", 'info/delete', null, (status, data, message) => {
          if (status == 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getAllInfo(this.pageNum, "");
          } else {
            this.$message.error(message);
          }
        }, params);
      }).catch(() => {});
    },
    topArticle(row) {
      this.$confirm('确认要置顶这篇文章吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        let params = {
          id: row.id
        }
        this.publicFun.httpRequest("put", 'info/top', null, (status, data, message) => {
          if (status == 0) {
            this.$message({
              type: 'success',
              message: '置顶成功!'
            });
            this.getAllInfo(this.pageNum, "");
          } else {
            this.$message.error(message);
          }
        }, params);
      }).catch(() => {});
    },
    roleSetting() {
      this.roleSettingDialog = true;
    },
    articleSuccess(response, file, fileList) {
      this.fileName.push(response.record[0].fileName);
    },
    articleError(err, file, fileList) {
      this.$message.error("很抱歉，上传失败，请检查文件大小或稍后再试");
    },
    articleRemove(file, fileList) {
      this.fileName.forEach((item) => {
        if (item.split(".")[0].indexOf(file.name.split(".")[0]) != -1) {
          this.fileName.removeByValue(item);
        }
      })
    },
    delFile(file, error, xhr) {
      this.$refs.removeFile.removeFile(file);
    },
    saveArticle() {
      if (this.articleTitle == "") {
        this.$message.error("请填写标题");
        document.querySelector("#aricle-title input").focus();
      } else {
        let addArticle = {
          "classid": this.typeId,
          "content": this.content,
          "file": this.fileName.join(";"),
          "id": 0,
          "title": this.articleTitle
        }
        this.publicFun.httpRequest("post", 'info/add', addArticle, (status, data, message) => {
          if (status == 0) {
            this.$message({
              type: 'success',
              message: '发布成功！'
            });
            this.addArticleDialog = false;
            this.resetArticle();
            this.getAllInfo(this.pageNum, "");
          } else {
            this.$message.error(message);
          }
        });
      }
    },
    resetArticle() {
      if (this.fileName.length != 0) {
        this.$refs.upload.clearFiles();
      }
      this.articleTitle = null;
      this.content = '';
    }
  }
};
</script>
