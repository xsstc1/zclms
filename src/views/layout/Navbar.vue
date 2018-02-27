<template>
<el-menu class="navbar" mode="horizontal">
  <hamburger class="hamburger-container color-hui hide show-xs show-md" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
  <div class="fl">
    <router-link to="/">
      <i class="iconfont icon-logo color-hui f45 fl mr-5"></i>
      <span class="f17 color-hui fl">中诚管理业务支撑平台</span>
    </router-link>
  </div>
  <div class="fr show-xs show-md mr-10 hide">
    <el-dropdown trigger="click" @command="mobileMean">
      <span class="color-hui">
        <i class="iconfont icon-zuozhe color-hu f19"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{userInfo.userName}}</el-dropdown-item>
        <el-dropdown-item divided><router-link class='inlineBlock mr-10' to="/waitList">待办</router-link></el-dropdown-item>
        <el-dropdown-item command="changePass">密码</el-dropdown-item>
        <el-dropdown-item command="loginOut">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
  <div class="fr mr-30 hidden-xs hidden-md">
    <span class="mr-10 f13 color-hui">欢迎您：{{userInfo.userName}}</span>
    <span class="f13 color-hui mr-20">【部门】{{userInfo.departmentName}}</span>
    <i class="iconfont icon-gongsi2 color-hui mr-5 f14"></i>
    <el-dropdown trigger="click" class="cp mr-50" @command="changeCompany">
      <span class="el-dropdown-link color-hui f13">{{userInfo.company=="NT"?"南通分公司":userInfo.company=="SZ"?"苏州总公司":userInfo.company=="NJ"?"南京分公司":"未知"}}<i class="el-icon-caret-bottom el-icon--right"></i></span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="SZ">苏州总公司</el-dropdown-item>
        <el-dropdown-item command="NT">南通分公司</el-dropdown-item>
        <el-dropdown-item command="NJ">南京分公司</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <router-link class='inlineBlock mr-10' to="/waitList">
      <el-button class="f13 color-hui" type="text">
        <i class="iconfont icon-daiban mr-5"></i>待办
      </el-button>
    </router-link>
    <el-button @click="editPassDialog = true" class="f13 color-hui" type="text"><i class="iconfont icon-mima mr-5"></i>密码</el-button>
    <el-button class="f13 color-hui" type="text" @click="logout"><i class="iconfont icon-tuichu mr-5"></i>退出</el-button>
  </div>
  <el-dialog title="修改密码" :visible.sync="editPassDialog" size="tiny" custom-class="icms-dialog changepass-dialog">
    <el-form class="change-pass" label-width="120px" :model="editPassForm" ref="editPassForm" :rules="editPassRules">
      <el-form-item label="新密码：" prop="pass">
        <el-input class="f13" type="password" v-model="editPassForm.pass" auto-complete="off" placeholder="请输入新密码,不少于6位的字母数字组合"></el-input>
      </el-form-item>
      <el-form-item label="重复密码：" prop="passAgain">
        <el-input class="f13" type="password" v-model="editPassForm.passAgain" auto-complete="off" placeholder="请重复新密码,不少于6位的字母数字组合"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer tc">
      <el-button type="primary" class="btn-red shadow" @click="saveEditPass('editPassForm')"><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
      <el-button class="btn-white shadow" @click='resetForm("editPassForm")'><i class="iconfont icon-reset mr-5 f14"></i>重 置</el-button>
    </div>
  </el-dialog>
</el-menu>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import Hamburger from '../../component/Hamburger/index.vue';
import Cookies from 'js-cookie';
export default {
  components: {
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  data() {
    var regPass = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (value.length < 6) {
              callback(new Error('密码长度必须不少于6位'));
            }else if(!regPass.test(value)){
              callback(new Error('密码必须包含数字和字母'));
            } else {
              if (this.editPassForm.passAgain !== '') {
                this.$refs.editPassForm.validateField('passAgain');
              }
              callback();
            }

      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.editPassForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      editPassDialog: false,
      userInfo: {
        name: "--",
        department: "--"
      },
      editPassForm: {
        pass: "",
        passAgain: ""
      },
      editPassRules: {
        pass: [{
          validator: validatePass,
          trigger: 'blur',
          required: true,
        }],
        passAgain: [{
          validator: validatePass2,
          trigger: 'blur',
          required: true,
        }],
      }
    }
  },
  mounted() {
    this.userInfo = this.$store.state.app.userInfo;
  },
  methods: {
    mobileMean(command) {
      if(command=="changePass"){
        this.editPassDialog = true;
      } else if(command=="loginOut"){
        this.logout();
      }
    },
    changeCompany(command) {
      let changeInfo = {
        currentUserLoginName: this.userInfo.userLoginName,
        company: command
      }
      this.publicFun.httpRequest("post", 'companyChange', null, (status, data, message) => {
        if (status == 0) {
          let changeData = data.currentUser;
          this.publicFun.loginOutRequest("get", 'logout', null, (status, data, message) => {
            if (status == 0) {
              let loginData = {
                company: changeData.company,
                loginName: changeData.userLoginName,
                loginPass: changeData.userPassword,
                isRememberMe: "true",
              }
              this.publicFun.httpRequest("post", 'login', loginData, (status, data, message) => {
                if (status == 0) {
                  if (data.token) {
                    Cookies.set('token', data.token, {
                      expires: 7
                    })
                  } else {
                    Cookies.set('token', null)
                  }
                  Cookies.set('session', true, {
                    expires: 7
                  });
                  window.localStorage.userInfo = JSON.stringify(data.currentUser);
                  this.$store.state.app.userInfo = data.currentUser;
                  location.reload();
                } else {
                  this.$message.error(message);
                }
              });
            } else {
              this.$message.error(message);
            }
          });
        } else {
          this.$message.error(message);
        }
      }, changeInfo);
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$confirm('确认要退出吗？', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.publicFun.loginOutRequest("get", 'logout', null, (status, data, message) => {
          if (status == 0) {
            Cookies.set("token", null);
            window.localStorage.clear();
            Cookies.set("session", false);
            this.$store.state.app.wholePageNum = 1;
            this.$store.state.app.costPageNum = 1;
            this.$router.push({
              path: '/login'
            });
          } else {
            this.$message.error(message);
          }
        });
      }).catch(() => {

      });
    },
    saveEditPass(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let newpwd = this.editPassForm.pass;
          this.publicFun.httpRequest("put", `user/editPwd?newpwd=${newpwd}`, null, (status, data, message) => {
            if (status == 0) {
              this.editPassDialog = false;
              this.$message({
                message: '恭喜您，修改密码成功，请用新密码重新登录！',
                type: 'success'
              });
              Cookies.set("token", null);
              window.localStorage.clear();
              Cookies.set("session", false);
              setTimeout(() => {
                this.$router.push({
                  path: '/login'
                });
              }, 3000)
            } else {
              this.$message({
                message: message,
                type: 'error'
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang="stylus">
.change-pass
  padding 20px 35px 15px 0
.changepass-dialog
  .el-dialog__header
    line-height 1.4
    span
      font-size 14px
      color #fff
      font-weight normal
  .el-dialog__footer
    margin-top -50px
    margin-bottom 20px
.navbar
  height 65px
  top 0
  line-height 65px
  border-radius 0px !important
  background-color #324157
  z-index 3000
  position fixed
  width 100%
  border-bottom none
  .icon-logo
    font-size 45px
  .hamburger-container
      line-height 70px
      height 70px
      float left
      padding 0 10px

  .errLog-container
      display inline-block
      position absolute
      right 150px

  .screenfull
      position absolute
      right 90px
      top 16px
      color red

  .avatar-container
      height 50px
      display inline-block
      position absolute
      right 35px
      .avatar-wrapper
          cursor pointer
          margin-top 5px
          position relative
          .user-avatar
              width 40px
              height 40px
              border-radius 10px

          .el-icon-caret-bottom
              position absolute
              right -20px
              top 25px
              font-size 12px
</style>
