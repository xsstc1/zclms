<template>
<div id="messageSend-content" class="app-container">
  <!-- <header class="p25 radius5 shadow bg-color-white">
    <el-button type="primary" class="btn-orange">发送</el-button>
    <el-button @click="setTimeSend" type="primary" class="btn-red">定时发送</el-button>
  </header> -->
  <article class="p25 bg-color-white shadow radius5">
    <el-row :gutter="30" class="mt-25">
      <el-col :sm="13">
        <el-row :gutter="10">
          <el-col :sm="5" class="tr mobile-tl">
            <div class="mt-10">
              收件人:
            </div>
          </el-col>
          <el-col :sm="19">
            <el-select id="sms-select" class="w" v-model="sendPhoneNum" allow-create multiple clearable filterable remote placeholder="请选择收件人" :remote-method="remoteMethod" :loading="phoneLoading">
              <el-option v-for="item in sendPhoneSearch" :key="item.id" :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="mt-25">
          <el-col :sm="5" class="tr mobile-tl">
            <div class="mt-10">
              短信内容:
            </div>
          </el-col>
          <el-col :sm="19">
            <el-input id="sms-content" v-model="smsContent" type="textarea" :rows="20" placeholder="请输入内容"></el-input>
            <div class="mt-15">
              建议短信内容控制在 70 个字符以内，否则运营商会分割成多条短信发送，当前已输入<span class="f20 color-red"> {{smsContent.length}} </span>个字
            </div>
            <div class="mt-15">
              <el-checkbox v-model="checked">附加发送人信息：{{addSendPerson.name}}
                <{{addSendPerson.phone}}>
              </el-checkbox>
            </div>
            <div class="mt-20 mb-25">
              <el-button :loading="sendLoading" @click="sendSMS" type="primary" class="btn-blue shadow mt-15"><i class="iconfont icon-svg35 f14 mr-5"></i>发 送</el-button>
              <el-button @click="setTimeDialog = true" type="primary" class="btn-orange shadow mt-15"><i class="iconfont icon-dingshifasong f14 mr-5"></i>定时发送</el-button>
            </div>
          </el-col>
        </el-row>

      </el-col>
      <el-col :sm="11">
        <div class="messageSend-person p20 mt-10">
          <nav>
            选择联系人
          </nav>
          <el-tree  ref="tree" :data="telDataSave" show-checkbox node-key="text" :props="defaultProps" @check-change="telDirectoryChange">
          </el-tree>
          <!-- <el-tree :accordion="true" ref="tree" lazy :default-expanded-keys="[1]" @node-expand="handleNodeClick" @check-change="telDirectoryChange" class="mt-10 bn" :load="loadSMS" :data="telDirectory" show-checkbox node-key="text" :props="defaultProps"></el-tree> -->
        </div>
      </el-col>
    </el-row>
  </article>
  <el-dialog :visible.sync="setTimeDialog" size="tiny" custom-class="icms-dialog">
    <span slot="title">定时发送</span>
    <div class="dialog-box">
      <div class="p20">
        <div>
          选择定时发送的时间
        </div>
        <div class="mt-10">
          <el-date-picker :editable="false" id="sms-settime" :picker-options="pickerOptions" class="w" v-model="sendTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </div>
        <div class="mt-10 color-8">
          此信息将在<strong class="color-black ml-5 mr-5">{{sendTime | setData}}</strong>发送到对方手机
        </div>
      </div>
      <div slot="footer" class="dialog-footer tc mt-10 mb-20">
        <el-button :loading="sendLoading" class="btn-orange shadow mt-15" type="primary" @click="setTimeSendSMS"><i class="iconfont icon-svg35 f13 mr-5"></i>发 送</el-button>
        <el-button class="btn-white shadow mt-15" @click="setTimeDialog = false"><i class="iconfont icon-quxiao1 f14 mr-5"></i>取 消</el-button>
      </div>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  formatDate
} from '../../assets/js/psy.js'
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      userInfo: this.$store.state.app.userInfo,
      addSendPerson: {
        name: "",
        phone: ""
      },
      phoneLoading: false,
      sendLoading: false,
      setTimeDialog: false,
      sendPhoneSearch: [],
      sendPhoneList: [],
      checked: false,
      sendPhoneNum: [],
      senSMSData: [],
      sendTime: "",
      smsContent: "",
      sendPersonSelect: "",
      telDirectory: [],
      telDataSave: [],
      defaultProps: {
        label: 'text',
        children: 'children'
      }
    }
  },
  filters: {
    setData(value) {
      if (value) {
        return formatDate(value)
      }
    }
  },
  mounted() {
    let userInfo = this.userInfo;
    this.addSendPerson = {
      name: userInfo.userName,
      phone: userInfo.userPhone
    }
    //console.log("用户信息", userInfo)
    this.getTelDirectory()
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.phoneLoading = true;
        this.publicFun.httpRequest("get", `sms/getUsersByLoginNameOrUserNameOrUserPhoneLike?queryParam=${query}`, null, (status, data, message) => {
          if (status == 0) {
            this.phoneLoading = false;
            this.sendPhoneList = data;
            this.sendPhoneSearch = this.sendPhoneList.filter(item => {
              return item.name.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }
        });
      } else {
        this.sendPhoneSearch = [];
      }
    },
    getAllPhone() {
      this.publicFun.httpRequest("get", 'sms/getUsersByLoginNameOrUserNameOrUserPhoneLike?queryParam=1', null, (status, data, message) => {
        if (status == 0) {
          this.sendPhoneSearch = data;
        }
      }, null);
    },
    sendSMS() {
      if (this.sendPhoneNum.length == 0) {
        this.$message.error('请您选择收信人');
        document.querySelector("#sms-select input").focus();
      } else if (this.smsContent == "") {
        this.$message.error('请您输入短信内容');
        document.querySelector("#sms-content textarea").focus();
      } else {
        this.setSmsSendData(null);
      }
    },
    setTimeSendSMS() {
      if (this.sendTime == "") {
        this.$message.error('请选择定时发送的时间');
        document.querySelector("#sms-settime input").focus();
      } else if (this.sendPhoneNum.length == 0) {
        this.$message.error('请您选择收信人');
        document.querySelector("#sms-select input").focus();
      } else if (this.smsContent == "") {
        this.$message.error('请您输入短信内容');
        document.querySelector("#sms-content textarea").focus();
      } else {
        this.setSmsSendData(formatDate(this.sendTime));
      }
    },
    setSmsSendData(sendTime) {
      this.sendLoading = true;
      this.senSMSData.length = 0;
      this.sendPhoneNum.forEach((item) => {
        if (item.length == 11) {
          var telPerson = {
            name: null,
            tel: item
          }
        } else {
          var telPerson = {
            name: item.split("(")[0],
            tel: item.split("<")[1].substring(0, item.split("<")[1].length - 1).length == 11 ? item.split("<")[1].substring(0, item.split("<")[1].length - 1) : null
          }
        }
        this.senSMSData.push(telPerson);
      });
      let messageData = [];
      this.senSMSData.forEach((index) => {
        let smsObj = {
          "msgContent": this.checked ? this.smsContent + " — " + this.addSendPerson.name : this.smsContent,
          "receiveName": index.name,
          "receivePhone": index.tel,
          "sendName": this.userInfo.userName,
          "sendPhone": this.userInfo.userPhone,
          "timingTimeStr": sendTime ? sendTime : null
        }
        messageData.push(smsObj);
      });
      // //console.log("最终的发送数据", messageData)
      this.publicFun.httpRequest("post", 'sms/add', messageData, (status, data, message) => {
        if (status == 0) {
          this.sendLoading = false;
          this.$message({
            message: '恭喜你，已成功发送',
            type: 'success'
          });
          this.sendPhoneNum = [];
          this.smsContent = "";
          this.setTimeDialog = false;
        }
      });
    },
    handleNodeClick(data) {
      // //console.log("下拉数据", data);
    },
    loadSMS(node, resolve) {
      let id = node.data.id ? node.data.id : -1;
      this.getTelDirectory(id, (telData) => {
        //console.log(telData);
        if (node.level === 0) {
          // //console.log(this.telDataSave)
          return resolve(this.telDataSave);
        }
        if (node.level > 3) return resolve([]);
        if (node.data.text === "所有联系人") {
          resolve(telData[0].children);
        } else {
          resolve(telData);
        }
      })
    },
    telDirectoryChange(data, checked, indeterminate) {
      this.sendPersonSelect = data
      let treeData = this.$refs.tree.getCheckedKeys();
      let treeArray = [];
      treeData.forEach((item) => {
        if (item.indexOf("<")==-1&&item.indexOf("(")==-1) {
          // treeData.removeByValue(item)
        }else{
          // //console.log("数据",item)
          treeArray.push(item)
        }
      });
      this.sendPhoneNum = treeArray;
      // //console.log("选中值",treeData)
    },
    setTimeSend() {
      this.setTimeDialog = true
    },
    getTelDirectory() {
      // let params = {
      //   id: id
      // }
      this.publicFun.httpRequest("get", 'sms/getUsersTree', null, (status, data, message) => {
        if (status == 0) {
          //console.log("数据",data)
          this.telDataSave = data.children;
          // callback(data);
        }
      });
    }
  }
};
</script>

<style lang="stylus">
#messageSend-content
  .messageSend-person
    border 1px solid #798da5
    border-radius 5px
    .el-tree-node__content
      border-radius 3px
    .el-date-editor
      width 100%
    .el-tree
      border none
</style>
