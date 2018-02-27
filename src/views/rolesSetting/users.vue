<template>
<div id="systemSetting-content" class="app-container">
  <header class="p25 bg-color-white shadow radius5 header-search">
    <div>
      <el-form :model="userSearch" ref="userSearch" :inline="true" label-width="80px">
        <el-form-item label="登录名:" class="mt-10" prop="userLoginName">
          <el-input @keyup.enter.native="userSaerchBtn" class="w" size="small" v-model="userSearch.userLoginName" placeholder="请输入登录名"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名:" class="mt-10" prop="userName">
          <el-input @keyup.enter.native="userSaerchBtn" class="w" size="small" v-model="userSearch.userName" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="角色:" class="mt-10" prop="userRoleName">
          <el-select v-model="userSearch.userRoleName" filterable placeholder="请输入角色" :clearable="true">
            <el-option v-for="item in rolesOptions" :key="item.roleName" :label="item.roleName" :value="item.roleName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:" class="mt-10" prop="status">
          <el-select size="small" placeholder="请选择状态" v-model="userSearch.userStatus">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="启用"></el-option>
            <el-option label="停用" value="停用"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="mt-30 mb-5 tc">
      <el-button @click="userSaerchBtn" type="primary" class="btn-orange shadow mt-15"><i class="iconfont icon-shiliangzhinengduixiang f13 mr-5"></i>查 询</el-button>
      <el-button @click='resetForm("userSearch")' type="primary" class="btn-red shadow mt-15"><i class="iconfont icon-1 f13 mr-5"></i>重 置</el-button>
      <el-button @click="userCreat" type="primary" class="btn-green shadow mt-15"><i class="iconfont icon-iconfont707 f13 mr-5"></i>新增用户</el-button>
    </div>
  </header>
  <article class="mt-30">
    <el-table :data="userData" v-loading.body="listLoading" fit highlight-current-row>
      <el-table-column align="center" label='序号' width="70" type="index"></el-table-column>
      <el-table-column label="登录名" width="80" prop="userLoginName">
      </el-table-column>
      <el-table-column label="用户姓名" width="120" align="center" prop="userName"></el-table-column>
      <el-table-column label="部门" align="center" prop="departmentName"></el-table-column>
      <el-table-column label="角色" width="200" align="left" prop="userRoleNames"></el-table-column>
      <el-table-column label="创建日期" width="200" align="center" prop="createTime"></el-table-column>
      <el-table-column align="center" prop="userStatus" label="状态" width="80"></el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewUser(scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="changeUserBtn(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="resetUser(scope.row)">重置密码</el-button>
          <el-button type="text" size="small" @click="stopStartUser(scope.row)">{{scope.row.userStatus == "启用" ? "停用" : "启用"}}</el-button>
      </template>
      </el-table-column>
    </el-table>
  </article>
  <footer class="mt-30 cb pagination" v-if="total">
    <el-pagination @current-change="userCurrentChange" :current-page.sync="userPage" :page-size="10" layout="prev, pager, next, jumper" :total="total" class="fr">
    </el-pagination>
    <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{total}}条记录</span>
  </footer>
  <el-dialog :visible.sync="userCreatNew" size="tiny" custom-class="icms-dialog">
    <span slot="title">新增 - 用户信息</span>
    <div class="dialog-box">
      <div class="add-department">
        <el-form :model="addUser" ref="addUser" label-width="100px" :rules="userRules">
          <el-form-item label="登陆名：" prop="loginName">
            <el-input v-model="addUser.loginName" placeholder="请输入登陆名"></el-input>
          </el-form-item>
          <el-form-item label="用户姓名：" prop="name">
            <el-input v-model="addUser.name" placeholder="请输入用户姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：" prop="tel">
            <el-input v-model.number="addUser.tel" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱：" prop="email">
            <el-input v-model="addUser.email" placeholder="请输入电子邮箱"></el-input>
          </el-form-item>
          <el-form-item label="部门：" prop="department">
            <el-cascader v-model="addUser.department" class="w" :options="deprtmentOptions" :clearable="true" :change-on-select="true" :props="{ value: 'id',label: 'departmentName',children: 'children'}"></el-cascader>
          </el-form-item>
          <el-form-item label="角色：" prop="roles">
            <el-select class="w" v-model="addUser.roles" multiple placeholder="请选择" @change="changeUserRole">
              <el-option v-for="item in rolesOptions" :key="item.id" :label="item.roleName" :value="item.roleName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer tc mt-10 mb-20">
        <el-button class="btn-orange shadow" type="primary" @click='addUserBtn("addUser")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
        <el-button class="btn-white shadow" @click='resetForm("addUser")'><i class="iconfont icon-reset mr-5 f14"></i>重 置</el-button>
      </div>
    </div>
  </el-dialog>
  <el-dialog :visible.sync="userChangeInfo" size="tiny" custom-class="icms-dialog">
    <span slot="title">修改 - 用户信息</span>
    <div class="dialog-box">
      <div class="add-department">
        <el-form :model="changeUser" ref="changeUser" label-width="100px" :rules="userRules">
          <el-form-item label="登陆名：" prop="loginName">
            <el-input v-model="changeUser.loginName" placeholder="请输入登陆名"></el-input>
          </el-form-item>
          <el-form-item label="用户姓名：" prop="name">
            <el-input v-model="changeUser.name" placeholder="请输入用户姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：" prop="tel">
            <el-input v-model.number="changeUser.tel" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱：" prop="email">
            <el-input v-model="changeUser.email" placeholder="请输入电子邮箱"></el-input>
          </el-form-item>
          <el-form-item label="部门：" prop="department">
            <el-cascader v-model="changeUser.department" class="w" :options="deprtmentOptions" :clearable="true" :change-on-select="true" :props="{ value: 'id',label: 'departmentName',children: 'children'}"></el-cascader>
          </el-form-item>
          <el-form-item label="角色：" prop="roles">
            <el-select class="w" v-model="changeUser.roles" multiple placeholder="请选择" @change="changeUserRole">
              <el-option v-for="item in rolesOptions" :key="item.roleName" :label="item.roleName" :value="item.roleName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer tc mt-10 mb-20">
        <el-button class="btn-orange shadow" type="primary" @click='changeSaveUserBtn("changeUser")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
        <el-button class="btn-white shadow" @click='resetForm("changeUser")'><i class="iconfont icon-reset mr-5 f14"></i>重 置</el-button>
      </div>
    </div>
  </el-dialog>
  <el-dialog :visible.sync="userViewDialog" size="tiny" custom-class="icms-dialog">
    <span slot="title">查看 - 用户信息</span>
    <div class="dialog-box" v-loading="viewUserLoading">
      <div class="add-department">
        <el-form label-width="40%">
          <el-form-item label="登陆名：">
            {{viewUserData.loginName?viewUserData.loginName:"--"}}
          </el-form-item>
          <el-form-item label="用户姓名：">
            {{viewUserData.name?viewUserData.name:"--"}}
          </el-form-item>
          <el-form-item label="手机号码：">
            {{viewUserData.tel?viewUserData.tel:"--"}}
          </el-form-item>
          <el-form-item label="电子邮箱：">
            {{viewUserData.email?viewUserData.email:"--"}}
          </el-form-item>
          <el-form-item label="部门：">
            {{viewUserData.department?viewUserData.department:"--"}}
          </el-form-item>
          <el-form-item label="角色：">
            {{viewUserData.roles?viewUserData.roles:"--"}}
          </el-form-item>
        </el-form>
        </el-form>
      </div>

    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    var checkTel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号码'));
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入正确的手机号码'));
      } else {
        if (value.toString().length < 11 || value.toString().length > 11) {
          callback(new Error('请输入11位手机号码'));
        } else {
          callback();
        }
      }
    };
    return {
      userViewDialog: false,
      viewUserLoading: true,
      userChangeInfo: false,
      rolesOptions: [],
      userSearch: {
        userLoginName: "",
        userName: "",
        userRoleName: "",
        userStatus: ""
      },
      addUser: {
        name: "",
        loginName: "",
        tel: "",
        department: "",
        email: "",
        roles: []
      },
      changeUser: {
        name: "",
        loginName: "",
        tel: "",
        department: "",
        email: "",
        roles: [],
        roleId:[],
        id: ""
      },
      viewUserData: {
        name: "",
        loginName: "",
        tel: "",
        department: "",
        email: "",
        roles: ""
      },
      userRules: {
        loginName: [{
          required: true,
          message: '请输入登录名',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入用户姓名',
          trigger: 'blur'
        }],
        tel: [{
          required: true,
          message: '请输入手机号码',
          // validator: checkTel
        }],
        email: [{
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: 'blur,change'
        }],
        department: [{
          required: true,
          message: '选择部门'
        }]
      },
      deprtmentOptions: [],
      userCreatNew: false,
      listLoading: true,
      userData: [],
      total: 0,
      userPage: 1
    }
  },
  created() {
    this.getUserData(1, this.userSearch);
    this.getDepartmentList();
    this.getRolesList();
  },
  methods: {
    userSaerchBtn() {
      this.userSearch.userName = this.userSearch.userName ? this.userSearch.userName.trim() : null;
      this.userSearch.userLoginName = this.userSearch.userLoginName ? this.userSearch.userLoginName.trim() : null;

      this.getUserData(1, this.userSearch);
      this.userPage = 1
    },
    getUserData(page, searchData) {
      let params = {
        page: page,
        rows: 10,
        userStatus: searchData.userStatus ? searchData.userStatus : null,
        userName: searchData.userName ? searchData.userName : null,
        userLoginName: searchData.userLoginName ? searchData.userLoginName : null,
        userRoleName: searchData.userRoleName ? searchData.userRoleName : null
      };
      this.publicFun.httpRequest("get", `user/list`, null, (status, data, message) => {
        if (status == 0) {
          this.listLoading = false;
          this.userData = data.rows;
          this.total = data.total;
        }
      }, params)
    },
    userCurrentChange(val) {
      this.getUserData(val, this.userSearch);
      this.userPage = val;
    },
    getDepartmentList() {
      this.publicFun.httpRequest("get", 'department/getTree', null, (status, data, message) => {
        if (status == 0) {
          this.deprtmentOptions = data;
          this.deprtmentOptions.forEach((index) => {
            if (index.children.length == 0) {
              delete index.children;
            } else {
              index.children.forEach((item) => {
                if (item.children.length == 0) {
                  delete item.children;
                }
              })
            }
          })
        }
      });
    },
    addUserBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let userAddData = {
            "departmentId": this.addUser.department[this.addUser.department.length - 1],
            "id": 0,
            "userEmail": this.addUser.email,
            "userLoginName": this.addUser.loginName,
            "userName": this.addUser.name,
            "userPhone": this.addUser.tel.toString(),
            "userRoleNames": this.addUser.roles.join(","),
            "userRoleIds": this.changeUser.roleId.join(",")
          }
          // console.log(userAddData)
          this.publicFun.httpRequest("post", 'user/add', userAddData, (status, data, message) => {
            if (status == 0) {
              this.$message({
                type: 'success',
                message: message
              });
              this.userCreatNew = false;
              this.resetForm("addUser")
              this.getUserData(this.userPage);
            } else {
              this.$message({
                type: 'error',
                message: message
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    viewUser(row) {
      this.userViewDialog = true;
      this.publicFun.httpRequest("get", `user/get?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.viewUserData = {
            name: data.userName,
            loginName: data.userLoginName,
            tel: data.userPhone,
            department: data.departmentName,
            email: data.userEmail ? data.userEmail : "暂无信息",
            roles: data.userRoleNames
          }
          this.viewUserLoading = false;
        }
      });
    },
    resetUser(row) {
      this.$confirm('您确认要重置密码吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.publicFun.httpRequest("put", `user/resetPwd?id=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.$message({
              type: 'success',
              message: message,
              duration: 8000,
              showClose: true
            });
          }
        });
      }).catch(() => {

      });
    },
    stopStartUser(row) {
      if (row.userStatus == "启用") {
        this.$confirm('您确认要停用该用户吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.publicFun.httpRequest("put", `user/disable?id=${row.id}`, null, (status, data, message) => {
            if (status == 0) {
              this.$message({
                type: 'success',
                message: message
              });
              this.getUserData(this.userPage, this.userSearch);
            }
          });
        }).catch(() => {});
      } else {
        this.$confirm('您确认要启用该用户吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.publicFun.httpRequest("put", `user/enable?id=${row.id}`, null, (status, data, message) => {
            if (status == 0) {
              this.$message({
                type: 'success',
                message: message
              });
              this.getUserData(this.userPage, this.userSearch);
            }
          });
        }).catch(() => {});
      }
    },
    userCreat() {
      this.userCreatNew = true;
    },
    changeUserBtn(row) {
      this.userChangeInfo = true;
      this.publicFun.httpRequest("get", `user/get?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          // console.log(data);
          this.changeUser = {
            name: data.userName,
            loginName: data.userLoginName,
            tel: data.userPhone,
            department: [data.departmentId],
            email: data.userEmail,
            roles: data.userRoleNames ? data.userRoleNames.split(",") : [],
            id: data.id,
            roleId:data.userRoleIds ? data.userRoleIds.split(",") : [],
          }
        }
      });
    },
    changeUserRole(value) {
      //console.log(this.rolesOptions)
      // console.log(value)
      this.changeUser.roleId=[];
      value.forEach((item)=>{
        this.rolesOptions.forEach((child)=>{
          if(item==child.roleName){
          this.changeUser.roleId.push(child.id)
          }
        })
      })
      //console.log(this.changeUser.roleId)

    },
    changeSaveUserBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var updateData = {
            "departmentId": this.changeUser.department[this.changeUser.department.length - 1],
            "id": this.changeUser.id,
            "userEmail": this.changeUser.email,
            "userLoginName": this.changeUser.loginName,
            "userName": this.changeUser.name,
            "userPhone": this.changeUser.tel.toString(),
            "userRoleNames": this.changeUser.roles.join(","),
            "userRoleIds": this.changeUser.roleId.join(",")
          }
          //console.log(updateData)
          this.publicFun.httpRequest("put", 'user/update', updateData, (status, data, message) => {
            if (status == 0) {
              this.userChangeInfo = false;
              this.$message({
                type: 'success',
                message: message
              });
              this.getUserData(this.userPage, this.userSearch);
            }
          });
        } else {
          return false;
        }
      });

    },
    getRolesList() {
      this.publicFun.httpRequest("get", 'role/listAllRoles', null, (status, data, message) => {
        if (status == 0) {
          this.rolesOptions = data;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="stylus">
.add-department
  padding 10px 25px 10px 0
#systemSetting-content
  .el-form--inline .el-form-item
    margin-bottom 0
</style>
