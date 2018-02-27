<template>
<div id="department-content" class="app-container">
  <header class="p20 bg-color-white shadow radius5 tr header-article-search">
    <form action="javascript:return true">
      <input name="search" autocomplete="off" type="search" @keyup.enter="roleSearchBtn" v-model="roleSearch" class="roles-search f13" placeholder="请输入您想查找的角色名" /><button @click="roleSearchBtn" type="primary" class="btn-orange shadow roles-search-btn el-button color-white">查询</button>
      <el-button @click="addRolesBtn" type="primary" class="btn-green shadow"><i class="iconfont icon-iconfont707 f12 mr-5"></i>新增角色</el-button>
    </form>
  </header>
  <article class="mt-30" v-loading="listLoading">
    <el-table ref="multipleTable" :data="rolesData" fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
      <el-table-column label="角色名" width="200" prop="roleName">

      </el-table-column>

      <el-table-column label="角色描述" align="left" prop="roleDescription"></el-table-column>
      <el-table-column label="创建时间" width="250" align="center" prop="createTime"></el-table-column>
      <el-table-column align="center" prop="person" label="操作" width="250">
        <template slot-scope="scope">
        <el-button type="text" size="small" @click="roleChange(scope.row)">修改</el-button>
        <el-button type="text" size="small" @click="roleDel(scope.row)">删除</el-button>
          <el-button @click="roleSetting(scope.row)" type="text" size="small">权限配置</el-button>
      </template>
      </el-table-column>
    </el-table>
  </article>

  <footer class="mt-30 cb pagination" v-if="total">
    <el-pagination @current-change="rolesCurrentChange" :current-page.sync="beginPage" :page-size="15" layout="prev, pager, next, jumper" :total="total" class="fr">
    </el-pagination>
    <span class="fr f13 color-8 pagination-text mr-15 mt-8">每页15条，共{{total}}条记录</span>
  </footer>
  <el-dialog :visible.sync="addRolesDialog" size="tiny" custom-class="icms-dialog">
    <span slot="title">新增-角色信息</span>
    <div class="dialog-box">
      <div class="add-department">
        <el-form :model="addRoles" ref="addRoles" label-width="100px" :rules="rolesRules">
          <el-form-item label="角色名：" prop="name">
            <el-input v-model="addRoles.name" placeholder="请输入角色名"></el-input>
          </el-form-item>
          <el-form-item label="角色描述：" prop="discribe">
            <el-input v-model="addRoles.discribe" placeholder="请输入角色描述"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer tc mt-10 mb-20">
        <el-button class="btn-orange shadow" type="primary" @click='addRolesData("addRoles")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
        <el-button class="btn-white shadow" @click="resetForm('addRoles')"><i class="iconfont icon-reset mr-5 f14"></i>重 置</el-button>
      </div>
    </div>
  </el-dialog>
  <el-dialog :visible.sync="changeRolesDialog" size="tiny" custom-class="icms-dialog">
    <span slot="title">新增-角色信息</span>
    <div class="dialog-box">
      <div class="add-department">
        <el-form :model="changeRoles" ref="changeRoles" label-width="100px" :rules="rolesRules">
          <el-form-item label="角色名：" prop="name">
            <el-input v-model="changeRoles.name" placeholder="请输入角色名"></el-input>
          </el-form-item>
          <el-form-item label="角色描述：" prop="discribe">
            <el-input v-model="changeRoles.discribe" placeholder="请输入角色描述"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer tc mt-10 mb-20">
        <el-button class="btn-orange shadow" type="primary" @click='changeRolesData("changeRoles")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
        <el-button class="btn-white shadow" @click='resetChangeRoles'><i class="iconfont icon-reset mr-5 f14"></i>重 置</el-button>
      </div>
    </div>
  </el-dialog>
  <el-dialog :visible.sync="roleSettingDialog" size="tiny" custom-class="icms-dialog">
    <span slot="title">权限管理</span>
    <div class="dialog-box">
      <div class="mt-10 cb">
        <div class="fl w30 mt-10 tr pr-20">
          设置权限：
        </div>
        <div class="fl w70 role-setting-box" v-loading="rolesLoading">
          <section class="role-setting">
            <el-tree :data="roleLists" :default-expanded-keys="checkArr" :default-checked-keys="checkArr" show-checkbox node-key="id" ref="tree" highlight-current :props="defaultProps">
            </el-tree>
          </section>
        </div>
      </div>
      <div slot="footer" class="dialog-footer tc mt-30 mb-20 bt-1 pt-40">
        <el-button class="btn-orange shadow" type="primary" @click="saveRolesEdit"><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
        <el-button class="btn-white shadow" @click="roleSettingDialog = false"><i class="iconfont icon-quxiao1 f14 mr-5"></i>取 消</el-button>
      </div>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      roleSearch: "",
      addRolesDialog: false,
      changeRolesDialog: false,
      roleSettingDialog: false,
      listLoading: true,
      rolesLoading: true,
      roleSelectId: null,
      rolesData: [],
      checkArr: [],
      rolesCheckList: [],
      total: 0,
      beginPage: 1,
      roleLists: [],
      addRoles: {
        name: "",
        discribe: ""
      },
      changeRoles: {
        name: "",
        discribe: "",
        id: ""
      },
      rolesRules: {
        name: [{
          required: true,
          message: '请输入角色名',
          trigger: 'blur'
        }],
        discribe: []
      },
      defaultProps: {
        children: 'children',
        label: 'text'
      }
    }
  },
  created() {
    this.getRolesData(1);
  },
  methods: {
    roleSearchBtn() {
      this.listLoading = true;
      let url = this.roleSearch ? `role/getRolesByRoleNameLike?roleName=${this.roleSearch}` : "role/getRolesByRoleNameLike?roleName"
      this.publicFun.httpRequest("get", url, null, (status, data, message) => {
        if (status == 0) {
          //console.log(data)
          this.listLoading = false;
          this.rolesData = data;
          this.total = data.length;
        }
      })
    },
    getRolesData(page) {
      this.publicFun.httpRequest("get", `role/list?page=${page}&rows=15`, null, (status, data, message) => {
        if (status == 0) {
          this.listLoading = false;
          this.rolesData = data.rows;
          this.total = data.total;
        }
      })
    },
    roleSetting(row) {
      this.roleSettingDialog = true;
      this.checkArr = [];
      this.rolesLoading = true;
      this.publicFun.httpRequest("get", `rolemenu/getRoleMenusTree?roleId=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          this.roleSelectId = row.id;
          this.roleLists = data;
          this.rolesLoading = false;
          data.forEach((item) => {
            item.children.forEach((child) => {
              if (child.checked === true) {
                this.checkArr.push(child.id)
              }
              child.children.forEach((index) => {
                if (index.checked === true) {
                  this.checkArr.push(index.id)
                }
              })
            })
          })
        }
      })
    },
    saveRolesEdit() {
      let saveRolesArr = this.$refs.tree.getCheckedKeys();
      var saveRolesData = [];
      saveRolesArr.forEach((item) => {
        let saveRolesObj = {
          "id": item.toString(),
          "roleId": this.roleSelectId
        }
        saveRolesData.push(saveRolesObj);
      });
      //console.log("保存的值", saveRolesData)
      this.publicFun.httpRequest("post", `role/saveRoleMenus?roleId=${this.roleSelectId}`, saveRolesData, (status, data, message) => {
        if (status == 0) {
          this.roleSettingDialog = false;
          this.$message({
            message: message,
            type: 'success'
          });
        } else {
          this.$message.error(message);
        }
      })
    },
    rolesCurrentChange(val) {
      this.getRolesData(val);
      this.beginPage = val;
    },
    addRolesData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let rolesData = {
            "id": 0,
            "roleDescription": this.addRoles.discribe,
            "roleName": this.addRoles.name
          }
          this.publicFun.httpRequest("post", 'role/add', rolesData, (status, data, message) => {
            if (status == 0) {
              this.addRolesDialog = false;
              this.$refs["addRoles"].resetFields();
              this.$message({
                message: '恭喜你，添加角色成功',
                type: 'success'
              });
              this.getRolesData(this.beginPage);
            }
          })
        } else {
          return false;
        }
      });
    },
    roleChange(row) {
      //console.log(row);
      this.changeRolesDialog = true;
      this.changeRoles.name = row.roleName;
      this.changeRoles.discribe = row.roleDescription;
      this.changeRoles.id = row.id;
    },
    changeRolesData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let changeRolesData = {
            "id": this.changeRoles.id,
            "roleDescription": this.changeRoles.discribe,
            "roleName": this.changeRoles.name
          }
          this.publicFun.httpRequest("put", 'role/update', changeRolesData, (status, data, message) => {
            if (status == 0) {
              this.changeRolesDialog = false;
              this.$message({
                message: '恭喜你，修改角色成功',
                type: 'success'
              });
              this.getRolesData(this.beginPage);
            }
          })
        } else {
          return false;
        }
      });
    },
    roleDel(row) {
      this.$confirm('确认要删除此角色吗？', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.publicFun.httpRequest("delete", `role/delete?id=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.getRolesData(this.beginPage);
          }
        })

      }).catch(() => {

      });
    },
    addRolesBtn() { //新增公告
      this.addRolesDialog = true;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    resetChangeRoles() {
      this.changeRoles = {
        name: "",
        discribe: "",
        id: ""
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
#department-content
  .add-department
    padding 10px 25px 10px 0
  .roles-search-btn
    border-top-left-radius 0
    border-bottom-left-radius 0
  .role-setting
    .el-tree
      border none
</style>
