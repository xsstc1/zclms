<template>
<div id="systemSetting-content" class="app-container">
  <header class="p20 bg-color-white shadow radius5">
    <div class="mt-5">
      <el-form :inline="true" ref="biddingCompanyData" :model="biddingCompanyData" class="demo-form-inline" label-width="140px">
        <el-form-item label="采购单位名称：" class="mt-10" prop="buyUnitName">
          <el-input size="small" v-model="biddingCompanyData.buyUnitName" placeholder="请输入采购单位名称"></el-input>
        </el-form-item>
        <el-form-item label="采购单位联系人：" class="mt-10" prop="buyContacts">
          <el-input size="small" v-model="biddingCompanyData.buyContacts" placeholder="请输入采购单位联系人"></el-input>
        </el-form-item>
        <el-form-item label="采购单位电话：" class="mt-10" prop="buyPhone">
          <el-input size="small" v-model="biddingCompanyData.buyPhone" placeholder="请输入采购单位电话"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="mt-30 mb-15 tc">
      <el-button @click='biddingCompanySearchBtn' type="primary" class="btn-orange shadow mt-15"><i class="iconfont icon-shiliangzhinengduixiang f13 mr-5"></i>查 询</el-button>
      <el-button @click='resetForm("biddingCompanyData")' type="primary" class="btn-indigo shadow mt-15"><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
      <el-button @click='addBiddingCompany' type="primary" class="btn-blue shadow mt-15"><i class="iconfont icon-iconfont707 f13 mr-5"></i>新 增</el-button>
    </div>
  </header>
  <article class="mt-30">
    <el-table :data="biddingCompanyDataContent" v-loading="listLoading" fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
      <el-table-column align="left" label='采购单位名称' min-width="180" prop="buyUnitName"></el-table-column>
      <el-table-column align="left" label='采购单位联系人' width="140">
        <template slot-scope="scope">
          {{scope.row.buyContacts ? scope.row.buyContacts : "--"}}
        </template>
      </el-table-column>
      <el-table-column align="left" label='采购单位电话' width="150">
        <template slot-scope="scope">
          {{scope.row.buyPhone ? scope.row.buyPhone : "--"}}
        </template>
      </el-table-column>
      <el-table-column align="left" label='项目交易类型' width="110" prop="tradeCategory"></el-table-column>
      <el-table-column align="left" label='采购地区' width="110" prop="buyArea"></el-table-column>
      <el-table-column align="left" label='创建人' width="110" prop="createUser"></el-table-column>
      <el-table-column align="left" label='创建时间 ' width="180" prop="createTimeStr"></el-table-column>
      <el-table-column align="center" label='操作' width="200">
        <template slot-scope="scope">
          <el-button type="text" class="color-green f14" @click="editCompanyBtn(scope.row)">修改</el-button>
          <el-button type="text" class="color-green f14" @click="delCompanyBtn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </article>
  <footer class="mt-30 cb pagination" v-if="total">
    <el-pagination @current-change="costFileCurrentChange" :current-page.sync="pageNum" :page-size="10" layout="prev, pager, next, jumper" :total="total" class="fr">
    </el-pagination>
    <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{total}}条记录</span>
  </footer>
  <el-dialog :visible.sync="biddingCompanyDialog" size="tiny" custom-class="icms-dialog">
    <span slot="title">新增 - 采购单位信息</span>
    <div class="dialog-box">
      <el-form :model="newBiddingCompany" ref="newBiddingCompany" class="demo-form-inline" label-width="140px" :rules="newBiddingCompanyRules">
        <div class="pr mt-20">
          <el-row :gutter="16">
            <el-col :sm="22">
              <el-form-item label="单位名称：" prop="buyUnitName">
                <el-input id="costCompanyName" v-model="newBiddingCompany.buyUnitName" class="w" size="small" placeholder="请输入单位名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="22">
              <el-form-item label="采购单位联系人：" prop="buyContacts">
                <el-input id="costCompanyName" v-model="newBiddingCompany.buyContacts" class="w" size="small" placeholder="请输入采购单位联系人"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="22">
              <el-form-item label="采购单位电话：" prop="buyPhone">
                <el-input id="costCompanyName" v-model="newBiddingCompany.buyPhone" class="w" size="small" placeholder="请输入采购单位电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="22">
              <el-form-item label="项目交易类型：" prop="tradeCategory">
                <el-select class="w" v-model="newBiddingCompany.tradeCategory" size="small" placeholder="请选择项目交易类型">
                  <el-option label="政府采购" value="政府采购"></el-option>
                  <el-option label="社会标" value="社会标"></el-option>
                  <el-option label="其它" value="其它"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="22">
              <el-form-item label="采购地区：" prop="buyArea">
                <el-select class="w" v-model="newBiddingCompany.buyArea" size="small" placeholder="请选择采购地区">
                  <el-option label="市区" value="市区"></el-option>
                  <el-option label="新区" value="新区"></el-option>
                  <el-option label="园区" value="园区"></el-option>
                  <el-option label="吴中区" value="吴中区"></el-option>
                  <el-option label="吴江区" value="吴江区"></el-option>
                  <el-option label="相城区" value="相城区"></el-option>
                  <el-option label="姑苏区" value="姑苏区"></el-option>
                  <el-option label="其它" value="其它"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="dialog-footer tc mt-20 mb-20">
          <el-button class="btn-orange shadow" type="primary" @click='saveNewBiddingCompany("newBiddingCompany")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='biddingCompanyDialog = false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 修改文件 -->
  <el-dialog :visible.sync="changeBiddingCompanyDialog" size="small" custom-class="icms-dialog">
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

        </div>
        <div class="dialog-footer tc mt-40">
          <el-button class="btn-orange shadow" type="primary" @click='saveChangeCostFile("changeCostFile")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
          <el-button class="btn-white shadow" @click='changeBiddingCompanyDialog = false'><i class="iconfont icon-quxiao1 f13 mr-5"></i>取 消</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- 查看文件 -->
  <el-dialog :visible.sync="viewbiddingCompanyDialog" size="small" custom-class="icms-dialog">
    <span slot="title">查看 - 全过程文件</span>
    <div class="dialog-box" v-loading="viewFileLoading">
      <el-table class="noShadow" :data="costFileCOntant" style="width: 100%">
        <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
        <el-table-column width="240" prop="fileName" label="文件名称"></el-table-column>
        <el-table-column prop="fileType" label="文件类型"></el-table-column>
        <el-table-column width="170" prop="createTimeStr" label="上传时间"></el-table-column>
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
      loginUser: this.$store.state.app.userInfo.userName,
      loginInfo: this.$store.state.app.userInfo,
      biddingCompanyDialog: false,
      changeBiddingCompanyDialog: false,
      viewbiddingCompanyDialog: false,
      viewFileLoading: false,
      roleMenus: {
        creatFile: false,
        delFile: false
      },
      newBiddingCompany: {
        buyUnitName: '',
        buyContacts:'',
        buyPhone:'',
        tradeCategory:'',
        buyArea:''
      },
      changeCostFile: {
        costCompanyName: '',
        id: '',
        loading: false
      },
      newBiddingCompanyRules: {
        buyUnitName: [{
          required: true,
          message: '请输入采购单位名称',
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
      biddingCompanyData: {
        page: 1,
        rows: 10,
        buyPhone: null,
        buyContacts: null,
        buyUnitName: null
      },
      costFileCOntant: [],
      costFilesArray: [],
      pageNum: 1,
      listLoading: false,
      biddingCompanyDataContent: [],
      total: 0
    }
  },
  mounted() {
    this.setRoleBtn();
    this.getBiddingCompanyList(this.biddingCompanyData);
  },
  methods: {
    setRoleBtn() {
      let roleMenus = this.loginInfo.menus;
      //console.log("用户权限", roleMenus);
      roleMenus.forEach((grandpa) => {
        if (grandpa.menuName == "全过程管理") {
          grandpa.children.forEach((parent) => {
            if (parent.menuName == "全过程文件") {
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
    delCompanyBtn(row) {
      this.$confirm('确认要删除此记录吗？', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.publicFun.httpRequest("delete", `buyUnitName/delete?id=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.getBiddingCompanyList(this.biddingCompanyData);
          } else {
            this.$message.error(message);
          }
        });
      }).catch(() => {

      });
    },
    editCompanyBtn(row) {
      this.viewbiddingCompanyDialog = true;
      this.viewFileLoading = true;
      this.publicFun.httpRequest("get", `ftp/getFiles?headId=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.viewFileLoading = false;
          this.costFileCOntant = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    saveNewBiddingCompany(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let biddingCompanyPost = {
            "buyArea": this.newBiddingCompany.buyArea,
            "buyContacts": this.newBiddingCompany.buyContacts,
            "id": 0,
            "buyPhone": this.newBiddingCompany.buyPhone,
            "buyUnitName": this.newBiddingCompany.buyUnitName,
            "tradeCategory":this.newBiddingCompany.tradeCategory
          }
          this.publicFun.httpRequest("post", "buyUnitName/add", biddingCompanyPost, (status, data, message) => {
            if (status == 0) {
              this.$message.success(message);
              this.biddingCompanyDialog = false;
              this.$refs["newBiddingCompany"].resetFields();
              this.getBiddingCompanyList(this.biddingCompanyData);
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
        this.changeBiddingCompanyDialog = true;
        this.changeCostFile.loading = true;
        this.publicFun.httpRequest("get", `ftp/get?headId=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.changeCostFile = {
              costCompanyName: data.companyName,
              id: data.id,
              loading: false
            }
          } else {
            this.$message.error(message);
          }
        });
      }
    },
    saveChangeCostFile(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let biddingCompanyPost = {
            "companyName": this.changeCostFile.costCompanyName,
            "costFiles": null,
            "id": this.changeCostFile.id,
            "moduleType": "wholeProcess",
            "wholeProcessFiles": this.costFilesArray.length != 0 ? JSON.stringify(this.costFilesArray) : null
          }
          this.publicFun.httpRequest("put", "ftp/update", biddingCompanyPost, (status, data, message) => {
            if (status == 0) {
              this.$message.success(message);
              this.changeBiddingCompanyDialog = false;
              this.costFilesArray = [];
              this.getBiddingCompanyList(this.biddingCompanyData);
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
    addBiddingCompany(formName) {
      this.biddingCompanyDialog = true;
    },
    getBiddingCompanyList(params) {
      this.listLoading = true;
      this.publicFun.httpRequest("get", "buyUnitName/list", null, (status, data, message) => {
        if (status == 0) {
          this.listLoading = false;
          this.biddingCompanyDataContent = data.rows;
          this.total = data.total;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    costFileCurrentChange(val) {
      this.biddingCompanyData.page = val;
      this.getBiddingCompanyList(this.biddingCompanyData);
      this.pageNum = val;
    },
    biddingCompanySearchBtn() {
      this.pageNum = 1;
      this.biddingCompanyData.buyPhone = this.biddingCompanyData.buyPhone ? this.biddingCompanyData.buyPhone.trim() : null;
      this.biddingCompanyData.buyContacts = this.biddingCompanyData.buyContacts ? this.biddingCompanyData.buyContacts.trim() : null;
      this.biddingCompanyData.buyUnitName = this.biddingCompanyData.buyUnitName ? this.biddingCompanyData.buyUnitName.trim() : null;
      this.getBiddingCompanyList(this.biddingCompanyData);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
