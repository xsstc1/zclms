<template>
<div id="systemSetting-content" class="app-container">
  <header class="p20 bg-color-white shadow radius5">
    <div class="mt-5">
      <el-form :inline="true" ref="costFileData" :model="costFileData" class="demo-form-inline" label-width="100px">
        <el-form-item label="单位名称：" class="mt-10" prop="companyName">
          <el-input @keyup.enter.native="costFileSearchBtn" size="small" v-model="costFileData.companyName" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="文件名称：" class="mt-10" prop="fileName">
          <el-input @keyup.enter.native="costFileSearchBtn" size="small" v-model="costFileData.fileName" placeholder="请输入单项工程名称"></el-input>
        </el-form-item>
        <el-form-item label="文件类型：" class="mt-10" prop="fileType">
          <el-select v-model="costFileData.fileType" size="small" placeholder="请选择所属专业" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="业主要求" value="业主要求"></el-option>
            <el-option label="重要文件" value="重要文件"></el-option>
            <el-option label="报告格式" value="报告格式"></el-option>
            <el-option label="政策文件" value="政策文件"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="mt-30 mb-15 tc">
      <el-button @click='costFileSearchBtn' type="primary" class="btn-orange shadow mt-15"><i class="iconfont icon-shiliangzhinengduixiang f13 mr-5"></i>查 询</el-button>
      <el-button @click='resetForm("costFileData")' type="primary" class="btn-indigo shadow mt-15"><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
      <el-button v-if="roleMenus.creatFile" @click='addCostFile' type="primary" class="btn-green shadow mt-15"><i class="iconfont icon-iconfont707 f13 mr-5"></i>新 增</el-button>
    </div>
  </header>
  <article class="mt-30">
    <el-table :data="costFileDataContent" v-loading="listLoading" fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
      <el-table-column label="单位名称">
        <template slot-scope="scope">
          <el-button @click="changeFileBtn(scope.row)" class="color-green" type="text">{{scope.row.companyName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label='操作' width="95">
        <template slot-scope="scope">
          <el-button type="text" class="color-green" @click="viewFileBtn(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </article>
  <footer class="mt-30 cb pagination" v-if="total">
    <el-pagination @current-change="costFileCurrentChange" :current-page.sync="pageNum" :page-size="10" layout="prev, pager, next, jumper" :total="total" class="fr">
    </el-pagination>
    <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{total}}条记录</span>
  </footer>
  <el-dialog :visible.sync="costFileDialog" size="small" custom-class="icms-dialog">
    <span slot="title">上传 - 造价咨询文件</span>
    <div class="dialog-box">
      <el-form :model="newCostFile" ref="newCostFile" class="demo-form-inline" label-width="120px" :rules="newCostFileRules">
        <div class="icms-dialog-content pr p15 mt-15">
          <nav class="pa">
            基本信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="单位名称：" prop="costCompanyName">
                <el-input id="costCompanyName" v-model="newCostFile.costCompanyName" class="w" size="small" placeholder="请输入单位名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content pr mt-40">
          <nav class="pa">
            附件类型 - 业主要求
          </nav>
          <el-upload class="upload-file w" ref="upload" :on-remove="requireRemove" :on-error="fileError" :on-success="requireSuccess" drag action="icms/ftp/upload" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="icms-dialog-content pr mt-40">
          <nav class="pa">
            附件类型 - 重要文件
          </nav>
          <el-upload ref="upload_one" class="upload-file w" :on-remove="importantRemove" :on-error="fileError" :on-success="importantSuccess" drag action="icms/ftp/upload" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="icms-dialog-content pr mt-40">
          <nav class="pa">
            附件类型 - 报告格式
          </nav>
          <el-upload ref="upload_two" class="upload-file w" :on-remove="reportRemove" :on-error="fileError" :on-success="reportSuccess" drag action="icms/ftp/upload" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="icms-dialog-content pr mt-40">
          <nav class="pa">
            附件类型 - 政策文件
          </nav>
          <el-upload ref="upload_three" class="upload-file w" :on-remove="roleRemove" :on-error="fileError" :on-success="roleSuccess" drag action="icms/ftp/upload" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoading" class="btn-orange shadow" type="primary" @click='saveNewCostFile("newCostFile")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='costFileDialog = false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 修改文件 -->
  <el-dialog :visible.sync="changeCostFileDialog" size="small" custom-class="icms-dialog">
    <span slot="title">修改 - 造价咨询文件</span>
    <div class="dialog-box">
      <el-form :model="changeCostFile" ref="changeCostFile" class="demo-form-inline" label-width="120px" :rules="changeCostFileRules">
        <div class="icms-dialog-content pr p15 mt-15" v-loading="changeCostFile.loading">
          <nav class="pa">
            基本信息
          </nav>
          <el-row :gutter="16">
            <el-col :sm="14">
              <el-form-item label="单位名称：" prop="costCompanyName">
                <el-input id="costChangeCompanyName" v-model="changeCostFile.costCompanyName" class="w" size="small" placeholder="请输入单位名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="icms-dialog-content pr mt-40">
          <nav class="pa">
            附件类型 - 业主要求
          </nav>
          <el-upload ref="upload" class="upload-file w" :on-remove="editRequireRemove" :on-error="fileError" :on-success="editRequireSuccess" drag action="icms/ftp/upload" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="icms-dialog-content pr mt-40">
          <nav class="pa">
            附件类型 - 重要文件
          </nav>
          <el-upload ref="upload_one" class="upload-file w" :on-remove="editImportantRemove" :on-error="fileError" :on-success="editImportantSuccess" drag action="icms/ftp/upload" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="icms-dialog-content pr mt-40">
          <nav class="pa">
            附件类型 - 报告格式
          </nav>
          <el-upload ref="upload_two" class="upload-file w" :on-remove="editReportRemove" :on-error="fileError" :on-success="editReportSuccess" drag action="icms/ftp/upload" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="icms-dialog-content pr mt-40">
          <nav class="pa">
            附件类型 - 政策文件
          </nav>
          <el-upload ref="upload_three" class="upload-file w" :on-remove="editRoleRemove" :on-error="fileError" :on-success="editRoleSuccess" drag action="icms/ftp/upload" accept="*" multiple>
            <i class="el-icon-upload f16 color-gray"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip">Tips:单个文件最大支持500MB</div>
          </el-upload>
        </div>
        <div class="dialog-footer tc mt-40">
          <el-button :loading="buttonLoading" class="btn-orange shadow" type="primary" @click='saveChangeCostFile("changeCostFile")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='changeCostFileDialog = false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 查看文件 -->
  <el-dialog :visible.sync="viewCostFileDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 造价咨询文件</span>
    <div class="dialog-box" v-loading="viewFileLoading">
      <el-table class="noShadow" :data="costFileCOntant" style="width: 100%">
        <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
        <el-table-column width="240" prop="fileName" label="文件名称"></el-table-column>
        <el-table-column prop="fileType" label="文件类型"></el-table-column>
        <el-table-column width="180" prop="createTimeStr" label="上传时间"></el-table-column>
        <el-table-column width="100" prop="createUser" label="上传人"></el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="scope">
            <a target="_blank" :href="scope.row.id | setCostFileDownloadUrl">
              <el-button class="color-green" type="text" size="small">下载</el-button>
            </a>
            <el-button v-if="roleMenus.delFile" @click="delFileBtn(scope.row,scope.$index)" class="color-green ml-5" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  filters: {
    setCostFileDownloadUrl(url) {
      return `${location.origin}/icms/ftp/download?id=${url}`;
    }
  },
  data() {
    return {
      buttonLoading: false,
      loginUser: this.$store.state.app.userInfo.userName,
      costFileDialog: false,
      changeCostFileDialog: false,
      viewCostFileDialog: false,
      viewFileLoading: false,
      roleMenus: {
        creatFile: false,
        delFile: false
      },
      newCostFile: {
        costCompanyName: ''
      },
      changeCostFile: {
        costCompanyName: '',
        id: '',
        loading: false
      },
      newCostFileRules: {
        costCompanyName: [{
          required: true,
          message: '请输入单位名称',
          trigger: 'blur'
        }]
      },
      changeCostFileRules: {
        costCompanyName: [{
          required: true,
          message: '请输入单位名称',
          trigger: 'blur'
        }]
      },
      costFileData: {
        page: 1,
        rows: 10,
        companyName: null,
        fileName: null,
        moduleType: "cost",
        fileType: null
      },
      costFileCOntant: [],
      costFilesArray: [],
      costEditFilesArray: [],
      pageNum: 1,
      listLoading: false,
      costFileDataContent: [],
      total: 0,
      loginInfo: this.$store.state.app.userInfo
    }
  },
  mounted() {
    this.setRoleBtn();
    this.getCostFileList(this.costFileData);
  },
  methods: {
    setRoleBtn() {
      let roleMenus = this.loginInfo.menus;
      //console.log("用户权限", roleMenus);
      roleMenus.forEach((grandpa) => {
        if (grandpa.menuName == "造价咨询") {
          grandpa.children.forEach((parent) => {
            if (parent.menuName == "造价咨询文件") {
              parent.children.forEach((child) => {
                if (child.menuName == "新增") {
                  this.roleMenus.creatFile = true;
                } else if (child.menuName == "删除") {
                  this.roleMenus.delFile = true;
                }
              })
            }
          })
        }
      });
    },
    delFileBtn(row, index) {
      this.$confirm('确认要删除此文件吗？', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.publicFun.httpRequest("delete", `ftp/delete?id=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.costFileCOntant.splice(index, 1);
          } else {
            this.$message.error(message);
          }
        });
      }).catch(() => {

      });
    },
    viewFileBtn(row) {
      this.viewCostFileDialog = true;
      this.viewFileLoading = true;
      this.publicFun.httpRequest("get", `ftp/getFiles?headId=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(() => {
            this.viewFileLoading = false;
          });
          this.costFileCOntant = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    requireRemove(file, fileList) {
      this.costFilesArray.forEach((item) => {
        if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1 && item.fileType == "业主要求") {
          this.costFilesArray.removeByValue(item);
        }
      });
    },
    requireSuccess(response, file, fileList) {
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: '业主要求',
        createUser: this.loginUser
      }
      this.costFilesArray.push(fileData);
    },
    editRequireRemove(file, fileList) {
      this.costEditFilesArray.forEach((item) => {
        if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1 && item.fileType == "业主要求") {
          this.costEditFilesArray.removeByValue(item);
        }
      });
    },
    editRequireSuccess(response, file, fileList) {
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: '业主要求',
        createUser: this.loginUser
      }
      this.costEditFilesArray.push(fileData);
    },
    importantRemove(file, fileList) {
      this.costFilesArray.forEach((item) => {
        if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1 && item.fileType == "重要文件") {
          this.costFilesArray.removeByValue(item);
        }
      });
    },
    importantSuccess(response, file, fileList) {
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: '重要文件',
        createUser: this.loginUser
      }
      this.costFilesArray.push(fileData);
    },
    editImportantRemove(file, fileList) {
      this.costEditFilesArray.forEach((item) => {
        if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1 && item.fileType == "重要文件") {
          this.costEditFilesArray.removeByValue(item);
        }
      });
    },
    editImportantSuccess(response, file, fileList) {
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: '重要文件',
        createUser: this.loginUser
      }
      this.costEditFilesArray.push(fileData);
    },
    reportRemove(file, fileList) {
      this.costFilesArray.forEach((item) => {
        if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1 && item.fileType == "报告格式") {
          this.costFilesArray.removeByValue(item);
        }
      });
    },
    reportSuccess(response, file, fileList) {
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: '报告格式',
        createUser: this.loginUser
      }
      this.costFilesArray.push(fileData);
    },
    editReportRemove(file, fileList) {
      this.costEditFilesArray.forEach((item) => {
        if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1 && item.fileType == "报告格式") {
          this.costEditFilesArray.removeByValue(item);
        }
      });
    },
    editReportSuccess(response, file, fileList) {
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: '报告格式',
        createUser: this.loginUser
      }
      this.costEditFilesArray.push(fileData);
    },
    roleRemove(file, fileList) {
      this.costFilesArray.forEach((item) => {
        if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1 && item.fileType == "政策文件") {
          this.costFilesArray.removeByValue(item);
        }
      });
    },
    roleSuccess(response, file, fileList) {
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: '政策文件',
        createUser: this.loginUser
      }
      this.costFilesArray.push(fileData);
    },
    editRoleRemove(file, fileList) {
      this.costEditFilesArray.forEach((item) => {
        if (item.fileName.split(".")[0].indexOf(file.name.split(".")[0]) != -1 && item.fileType == "政策文件") {
          this.costEditFilesArray.removeByValue(item);
        }
      });
    },
    editRoleSuccess(response, file, fileList) {
      let fileData = {
        fileName: response.record[0].fileName,
        fileType: '政策文件',
        createUser: this.loginUser
      }
      this.costEditFilesArray.push(fileData);
    },
    fileError(err, file, fileList) {
      this.$message.error("很抱歉，上传失败，请检查文件大小或稍后再试");
    },
    saveNewCostFile(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let costFileDPost = {
            "companyName": this.newCostFile.costCompanyName,
            "costFiles": this.costFilesArray.length != 0 ? JSON.stringify(this.costFilesArray) : null,
            "id": 0,
            "moduleType": "cost",
            "wholeProcessFiles": null
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("post", "ftp/add", costFileDPost, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.costFileDialog = false;
              this.newCostFile.costCompanyName = "";
            } else {
              this.$message.error(message);
            }
          });
        } else {
          document.querySelector("#costCompanyName input").focus();
          return false;
        }
      });
    },
    changeFileBtn(row) {
      if (this.roleMenus.creatFile) {
        if (this.costEditFilesArray.length > 0) {
          this.$refs.upload.clearFiles();
          this.$refs.upload_one.clearFiles();
          this.$refs.upload_two.clearFiles();
          this.$refs.upload_three.clearFiles();
        }
        this.costEditFilesArray = [];
        this.changeCostFileDialog = true;
        this.changeCostFile.loading = true;
        this.publicFun.httpRequest("get", `ftp/get?headId=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.changeCostFile = {
              costCompanyName: data.companyName,
              id: data.id
            }
            this.publicFun.handleIELoading(() => {
              this.changeCostFile.loading = false;
            });
          } else {
            this.$message.error(message);
          }
        });
      }
    },
    saveChangeCostFile(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let costFileDPost = {
            "companyName": this.changeCostFile.costCompanyName,
            "costFiles": this.costEditFilesArray.length != 0 ? JSON.stringify(this.costEditFilesArray) : null,
            "id": this.changeCostFile.id,
            "moduleType": "cost",
            "wholeProcessFiles": null
          }
          this.buttonLoading = true;
          this.publicFun.httpRequest("put", "ftp/update", costFileDPost, (status, data, message) => {
            if (status == 0) {
              this.buttonLoading = false;
              this.$message.success(message);
              this.changeCostFileDialog = false;
            } else {
              this.$message.error(message);
            }
          });
        } else {
          document.querySelector("#costChangeCompanyName input").focus();
          return false;
        }
      });
    },
    addCostFile() {
      this.costFileDialog = true;
      if (this.costFilesArray.length > 0) {
        this.$refs.upload.clearFiles();
        this.$refs.upload_one.clearFiles();
        this.$refs.upload_two.clearFiles();
        this.$refs.upload_three.clearFiles();
      }
      this.costFilesArray = [];
      this.newCostFile.costCompanyName = '';

    },
    getCostFileList(params) {
      this.listLoading = true;
      this.publicFun.httpRequest("get", "ftp/list", null, (status, data, message) => {
        if (status == 0) {
          this.publicFun.handleIELoading(() => {
            this.listLoading = false;
          });
          this.costFileDataContent = data.rows;
          this.total = data.total;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    costFileCurrentChange(val) {
      this.costFileData.page = val;
      this.getCostFileList(this.costFileData);
      this.pageNum = val;
    },
    costFileSearchBtn() {
      this.pageNum = 1;
      this.costFileData.companyName = this.costFileData.companyName ? this.costFileData.companyName.trim() : null;
      this.costFileData.fileName = this.costFileData.fileName ? this.costFileData.fileName.trim() : null;
      this.getCostFileList(this.costFileData);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
