<template>
<el-menu :default-active="$route.path" :unique-opened="true" background-color="#324157"
      text-color="#fff"
      active-text-color="#ffd04b">
  <template v-for="item in meanRouter">
    <router-link :to="item.path" v-if="!item.hidden && !item.dropdown"><el-menu-item :index="item.path"><i class="iconfont mr-15" :class="item.icon"></i>{{item.name}}</el-menu-item></router-link>
    <el-submenu :index="item.name" v-if="!item.hidden && item.dropdown">
      <template slot="title"><i class="iconfont mr-15" :class="item.icon"></i>{{item.name}}</template>
  <template v-for="index in item.children">
      <router-link v-if="!index.hidden" :to="item.path+'/'+index.path"><el-menu-item :index="item.path+'/'+index.path">{{index.name}}</el-menu-item></router-link>
    </template>
  </el-submenu>
  </template>
</el-menu>
</template>

<script>
export default {
  name: 'SidebarItem',
  data() {
    return {
      meanRouter: this.$store.getters.addRouters,
      userRolesMean: this.$store.state.app.userInfo.menus
    }
  },
  mounted() {
    // this.fatherShow()
    // //console.log("用户权限", this.userRolesMean);
    // //console.log("用户菜单", this.meanRouter)
  },
  methods: {
    fatherShow() {
      this.meanRouter.forEach((item) => {
        item.hidden = true;
        this.userRolesMean.forEach((ele) => {
          if (ele.menuName == "业务监控") {
            if (item.name == "业务监控") {
              item.hidden = false;
              item.children.forEach((parent) => {
                parent.hidden = true;
                ele.children.forEach((child) => {
                  if (child.menuName == "单项工程查询") {
                    if (parent.name == "单项工程查询") {
                      parent.hidden = false
                    }
                  }else if (child.menuName == "审核单问题查询") {
                    if (parent.name == "审核单问题查询") {
                      parent.hidden = false
                    }
                  }
                })
              })
            }
          }
          else if (ele.menuName == "产值管理") {
            if (item.name == "招标代理") {
              item.hidden = false;
              item.children.forEach((parent) => {
                parent.hidden = true;
                ele.children.forEach((child) => {
                  if (child.menuName == "采购代理") {
                    if (parent.name == "采购代理") {
                      parent.hidden = false
                    }
                  }else if (child.menuName == "工程代理") {
                    if (parent.name == "工程代理") {
                      parent.hidden = false
                    }
                  }else if (child.menuName == "采购单位维护") {
                    if (parent.name == "采购单位维护") {
                      parent.hidden = false
                    }
                  }
                })
              })
            }
          }
          else if (ele.menuName == "全过程管理") {
            if (item.name == "全过程管理") {
              item.hidden = false;
              item.children.forEach((parent) => {
                parent.hidden = true;
                ele.children.forEach((child) => {
                  if (child.menuName == "项目管理") {
                    if (parent.name == "项目管理") {
                      parent.hidden = false
                    }
                  }else if (child.menuName == "单位工程") {
                    if (parent.name == "单项工程") {
                      parent.hidden = false
                    }
                  }else if (child.menuName == "专业工作逾期") {
                    if (parent.name == "专业工作逾期") {
                      parent.hidden = false
                    }
                  }else if (child.menuName == "全过程文件") {
                    if (parent.name == "全过程文件") {
                      parent.hidden = false
                    }
                  }
                })
              })
            }
          } else if (item.name == "平台首页") {
            item.hidden = false
          } else if (ele.menuName == "造价咨询") {
            if (item.name == "造价咨询") {
              item.hidden = false;
              item.children.forEach((parent) => {
                parent.hidden = true;
                ele.children.forEach((child) => {
                  if (child.menuName == "项目管理") {
                    if (parent.name == "项目管理") {
                      parent.hidden = false
                    }
                  }else if (child.menuName == "单项工程") {
                    if (parent.name == "单项工程") {
                      parent.hidden = false
                    }
                  }else if (child.menuName == "项目逾期") {
                    if (parent.name == "项目逾期") {
                      parent.hidden = false
                    }
                  }else if (child.menuName == "单项逾期") {
                    if (parent.name == "单项逾期") {
                      parent.hidden = false
                    }
                  }else if (child.menuName == "造价咨询文件") {
                    if (parent.name == "造价咨询文件") {
                      parent.hidden = false
                    }
                  }
                })
              })
            }
          } else if (ele.menuName == "短信管理") {
            if (item.name == "短信管理") {
              item.hidden = false
            }
          } else if (ele.menuName == "权限管理") {
            if (item.name == "权限管理") {
              item.hidden = false
            }
          }
          // 二级菜单
          else if (ele.menuName == "我的首页") {
            ele.children.forEach((child) => {
              if (child.menuName == "内容发布") {
                if (item.name == "资讯管理") {
                  item.hidden = false
                }
              }
            })
          }

        })
      })
    },
    childShow() {

    },
    handleOpen(key, keyPath) {
      //console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      //console.log(key, keyPath);
    }
  }

}
</script>

<style lang="stylus" scoped>
.sidebar-select
  i
    margin-right 8px
.hideSidebar .menu-indent
    display block
    text-indent 10px
.el-submenu .el-menu-item
  padding-left 50px!important

</style>
