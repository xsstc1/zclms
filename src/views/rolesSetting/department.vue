<template>
<div id="department-content" class="app-container">
  <header class="p20 bg-color-white shadow radius5 tr">
    <el-button @click="addDepartmentDialog = true" type="primary" class="btn-green shadow"><i class="iconfont icon-iconfont707 f12 mr-5"></i>新增部门</el-button>
  </header>
  <article class="mt-30" v-loading="listLoading">
    <el-table ref="multipleTable" :data="departmentData" fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95" type="index"></el-table-column>
      <el-table-column label="部门名称" width="300">
        <template slot-scope="scope">
          <span :class="{ departmentParent: !scope.row.child }">{{scope.row.child  ? ` —  ${scope.row.departmentName}` : scope.row.departmentName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="部门描述" align="left">
        <template slot-scope="scope">
          {{scope.row.departmentDescription == "" ? "暂无" : scope.row.departmentDescription}}
        </template>
      </el-table-column>
      <el-table-column label="排序" width="80" align="center" prop="departmentSortIndex"></el-table-column>
      <el-table-column align="center" prop="person" label="操作" width="250">
        <template slot-scope="scope">
        <el-button @click="departmentChange(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="departmentDel(scope.row)" type="text" size="small">删除</el-button>
      </template>
      </el-table-column>
    </el-table>
  </article>
  <el-dialog :visible.sync="addDepartmentDialog" size="tiny" custom-class="icms-dialog">
    <span slot="title">新增-部门信息</span>
    <div class="dialog-box">
      <div class="add-department">
        <el-form :model="addData" ref="addData" label-width="100px" :rules="departmentRules">
          <el-form-item label="部门名称：" prop="name">
            <el-input v-model="addData.name" placeholder="请输入部门名称"></el-input>
          </el-form-item>
          <el-form-item label="部门排序：" prop="sort">
            <el-input v-model.number="addData.sort" placeholder="请输入部门排序"></el-input>
          </el-form-item>
          <el-form-item label="上级部门：" prop="department">
            <el-cascader v-model="addData.department" class="w" :options="deprtmentOptions" :clearable="true" :change-on-select="true" :props="{ value: 'id',label: 'departmentName',children: 'children'}"></el-cascader>
          </el-form-item>
          <el-form-item label="部门描述：" prop="discribe">
            <el-input v-model="addData.discribe" placeholder="请输入部门描述"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer tc mt-10 mb-20">
        <el-button class="btn-orange shadow" type="primary" @click='saveDepartmentAdd("addData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
        <el-button class="btn-white shadow" @click="resetForm('addData')"><i class="iconfont icon-reset mr-5 f14"></i>重 置</el-button>
      </div>
    </div>
  </el-dialog>

  <el-dialog :visible.sync="changeDepartmentDialog" size="tiny" custom-class="icms-dialog">
    <span slot="title">修改-部门信息</span>
    <div class="dialog-box">
      <div class="add-department">
        <el-form :model="changeData" ref="changeData" label-width="100px" :rules="departmentRules">
          <el-form-item label="部门名称：" prop="name">
            <el-input v-model="changeData.name" placeholder="请输入部门名称"></el-input>
          </el-form-item>
          <el-form-item label="部门排序：" prop="sort">
            <el-input v-model.number="changeData.sort" placeholder="请输入部门排序"></el-input>
          </el-form-item>
          <el-form-item label="上级部门：" prop="department">
            <el-cascader v-model="changeData.department" class="w" :options="deprtmentOptions" :clearable="true" :change-on-select="true" :props="{ value: 'id',label: 'departmentName',children: 'children'}"></el-cascader>
          </el-form-item>
          <el-form-item label="部门描述：" prop="discribe">
            <el-input v-model="changeData.discribe" placeholder="请输入部门描述"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer tc mt-10 mb-20">
        <el-button class="btn-orange shadow" type="primary" @click='saveDepartmentChange("changeData")'><i class="iconfont icon-save f14 mr-5"></i>保 存</el-button>
        <el-button class="btn-white shadow" @click="resetForm('changeData')"><i class="iconfont icon-reset mr-5 f14"></i>重 置</el-button>
      </div>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      addDepartmentDialog: false,
      changeDepartmentDialog: false,
      listLoading: true,
      departmentData: [],
      deprtmentOptions: [],
      addData: {
        name: "",
        sort: "",
        department: "",
        discribe: ""
      },
      changeData: {
        name: "",
        sort: "",
        department: "",
        discribe: "",
        id: ""
      },
      departmentRules: {
        name: [{
          required: true,
          message: '请输入部门名称',
          trigger: 'blur'
        }],
        sort: [{
          required: true,
          trigger: 'blur',
          type: 'number',
          message: '请输入部门排序,且必须为数字值',
        }],
        department: [],
        discribe: []
      }
    }
  },
  created() {
    this.getDepartmentList();
  },
  methods: {
    getDepartmentList() {
      this.publicFun.httpRequest("get", 'department/getTree', null, (status, data, message) => {
        if (status == 0) {
          this.departmentData = [];
          // this.departmentData = data;
          data.forEach((index) => {
            let listData = {
              departmentName: index.departmentName,
              departmentDescription: index.departmentDescription,
              departmentSortIndex: index.departmentSortIndex,
              id: index.id,
              child: false
            }
            this.departmentData.push(listData);
            if (index.children.length != 0) {
              index.children.forEach((child) => {
                let listData = {
                  departmentName: child.departmentName,
                  departmentDescription: child.departmentDescription,
                  departmentSortIndex: child.departmentSortIndex,
                  id: child.id,
                  child: true
                }
                this.departmentData.push(listData);
              })
            }
          })
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
          //console.log(" this.deprtmentOptions", this.deprtmentOptions)
          //console.log(this.departmentData)
          this.listLoading = false;
        }
      });
    },
    departmentDel(row) {
      this.$confirm('确认要删除此部门吗？', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.publicFun.httpRequest("delete", `department/delete?id=${row.id}`, null, (status, data, message) => {
          if (status == 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.getDepartmentList();
          }
        })

      }).catch(() => {

      });
    },
    departmentChange(row) {
      this.changeDepartmentDialog = true;
      this.publicFun.httpRequest("get", `department/get?id=${row.id}`, null, (status, data, message) => {
        if (status == 0) {
          //console.log(data);
          this.changeData.name = data.departmentName;
          this.changeData.sort = data.departmentSortIndex;
          this.changeData.discribe = data.departmentDescription;
          this.changeData.department = [data.departmentParentId];
          this.changeData.id = data.id;
        } else {
          this.$message({
            message: message,
            type: 'error'
          });
        }
      })
    },
    saveDepartmentAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let addData = {
            "departmentDescription": this.addData.discribe,
            "departmentName": this.addData.name,
            "departmentParentId": this.addData.department ? this.addData.department.length == 0 ? "-1" : this.addData.department[this.addData.department.length - 1] : "-1",
            "departmentSortIndex": this.addData.sort,
            "id": 0
          }
          this.publicFun.httpRequest("post", 'department/add', addData, (status, data, message) => {
            if (status == 0) {
              this.addDepartmentDialog = false;
              this.$message({
                message: '恭喜你，新增部门成功',
                type: 'success'
              });
              this.getDepartmentList();
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
    saveDepartmentChange(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let changeData = {
            "departmentDescription": this.changeData.discribe,
            "departmentName": this.changeData.name,
            "departmentParentId": this.changeData.department ? this.changeData.department.length == 0 ? "-1" : this.changeData.department[this.changeData.department.length - 1] : "-1",
            "departmentSortIndex": this.changeData.sort,
            "id": this.changeData.id
          }
          this.publicFun.httpRequest("put", 'department/update', changeData, (status, data, message) => {
            if (status == 0) {
              this.changeDepartmentDialog = false;
              this.resetForm('addData')
              this.$message({
                message: '恭喜你，修改成功',
                type: 'success'
              });
              this.getDepartmentList();
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
};
</script>

<style lang="stylus" scoped>
#department-content
  .add-department
    padding 10px 25px 10px 0
  .departmentParent
    font-weight 800
</style>
