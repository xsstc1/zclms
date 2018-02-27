<template>
<div id="selectUser">
  <div class="f13 select-user p10">
    <nav class="p15 color-white">
      选择项目负责人
    </nav>
    <header>
      <el-form label-position="right" label-width="40%">
        <el-row :gutter="16" class="mt-15">
          <el-col :sm="8">
            <el-form-item label="用户姓名：" class="mt-10 w">
              <el-input @keyup.enter.native="searchUserBtn" @ v-model="searchParams.userName" class="w" size="small" placeholder="请输入用户姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="6">
            <el-form-item label="角色：" class="mt-10 w">
              <el-input @keyup.enter.native="searchUserBtn" v-model="searchParams.userRoleName" class="w" size="small" placeholder="请输入角色名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="6">
            <el-form-item label="部门：" class="mt-10 w">
              <el-input @keyup.enter.native="searchUserBtn" v-model="searchParams.departmentName" class="w" size="small" placeholder="请输入部门"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="4" class="tc">
            <el-button @click="searchUserBtn" class="btn-orange shadow mt-10" type="primary"><i class="iconfont icon-shiliangzhinengduixiang f14 mr-5"></i>查 询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </header>
    <section class="p20">
      <el-table class="noShadow" :data="selectUser.list" style="width: 100%">
        <el-table-column type="index" width="40" label="编号" align="center"></el-table-column>
        <el-table-column prop="userLoginName" width="100" label="登录名"></el-table-column>
        <el-table-column prop="userName" width="120" label="用户姓名" align="center"></el-table-column>
        <el-table-column prop="departmentName" width="150" label="部门" align="center"></el-table-column>
        <el-table-column min-width="130" prop="userRoleNames" label="角色"></el-table-column>
        <el-table-column prop="userStatus" width="80" label="状态"></el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template slot-scope="scope">
                <el-button @click="selectBtn(scope.row)" class="color-green" type="text" size="small">选择</el-button>
            </template>
        </el-table-column>
      </el-table>
    </section>
    <footer class="cb pagination p20" v-if="selectUser.total">
      <el-pagination @current-change="changePageSearch" :current-page.sync="searchParams.page" :page-size="10" layout="prev, pager, next, jumper" :total="selectUser.total" class="fr">
      </el-pagination>
      <!-- <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页10条，共{{selectUser.total}}条记录</span> -->
    </footer>
  </div>
</div>
</template>
<script>
export default {
  name: "selectUser",
  data() {
    return {
      selectUser: {
        pageNum: 1,
        list: [],
        total: 0
      },
      searchParams: {
        page: 1,
        rows: 10,
        userName: null,
        userRoleName: null,
        departmentName: null
      }
    }
  },
  mounted() {
    this.searchUser(this.searchParams);
  },
  methods: {
    searchUserBtn() {
      this.searchParams.page = 1;
      this.searchUser(this.searchParams);
    },
    selectBtn(row){
      this.$emit("selectUserData",row)
    },
    searchUser(params) {
      this.publicFun.httpRequest("get", 'user/searchUsers', null, (status, data, message) => {
        if (status == 0) {
          console.log("搜索出来的人", data);
          this.selectUser.list = data.rows;
          this.selectUser.total = data.total;
        } else {
          this.$message.error(message);
        }
      }, params);
    },
    changePageSearch(val) {
      this.searchParams.page = val;
      this.searchUser(this.searchParams);
    }
  }
}
</script>
<style lang="stylus">
.select-user
  nav
    background-color #5a6677
  .select-user-role
    width 125px

</style>
