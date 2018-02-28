import Vue from 'vue'
import VueRouter from "vue-router";

Vue.use(VueRouter);

// 定义组件
import login from '../component/public/login.vue';
import leaveWeChat from '../component/public/leaveWeChat.vue';



import Layout from '../views/layout/Layout.vue';
import home from '../views/home/index.vue';

/* wait page */
import waitList from '../views/wait/index.vue';

/* message page */
import messageSend from '../views/messageSetting/messageSend.vue';
import messageQuery from '../views/messageSetting/messageQuery.vue';

/*role page*/
import departmentAdmin from '../views/rolesSetting/department.vue';
import roleAdmin from '../views/rolesSetting/roles.vue';
import userAdmin from '../views/rolesSetting/users.vue';

/*info page*/
import allInfo from '../views/infoSetting/allInfo.vue';
import notice from '../views/infoSetting/notice.vue';
import infoShow from '../views/infoSetting/infoShow.vue';
import forum from '../views/infoSetting/forum.vue';
import statute from '../views/infoSetting/statute.vue';
import inside from '../views/infoSetting/inside.vue';
import price from '../views/infoSetting/price.vue';
import honor from '../views/infoSetting/honor.vue';
import achievement from '../views/infoSetting/achievement.vue';
import culture from '../views/infoSetting/culture.vue';

/*cost page*/
import projectSetting from '../views/costSetting/projectSetting.vue';
import singleSetting from '../views/costSetting/singleSetting.vue';
import overDueProject from '../views/costSetting/overDueProject.vue';
import overDueSingle from '../views/costSetting/overDueSingle.vue';
import costFiles from '../views/costSetting/costFiles.vue';

/*whole page*/
import wholeProject from '../views/wholeSetting/wholeProject.vue';
import wholeSingle from '../views/wholeSetting/wholeSingle.vue';
import wholeOverDue from '../views/wholeSetting/wholeOverDue.vue';
import wholeFile from '../views/wholeSetting/wholeFile.vue';
import projectWork from '../views/wholeSetting/projectWork.vue';
import leaveMessage from '../views/wholeSetting/leaveMessage.vue'

/*monitoring page*/
import singleProjectSearch from '../views/monitoring/singleProjectSearch.vue';
import checkQuestionSearch from '../views/monitoring/checkQuestionSearch.vue';

/*bidding agent*/
import biddingCompany from '../views/biddingAgent/biddingCompany.vue';

/*output page*/
import costAllOutput from '../views/outputSetting/costAllOutput.vue';

// 创建一个路由器实例，并且配置路由规则
export const mainRoutes = [{
    path: '/',
    redirect: '/home',
    name: 'index',
    component: Layout,
    children: [{
        path: 'home',
        name: '首页',
        component: home
    }]
}, {
    path: '/login',
    component: login
},{
    path: '/leaveWeChat',
    component: leaveWeChat
}]

export const pagesRoutes = [{
        path: '/home',
        redirect: '/home',
        name: '平台首页',
        component: Layout,
        hidden: false,
        dropdown: false,
        icon: " icon-shouye",
        children: [{
            path: 'home',
            name: '平台首页',
            component: home
        }]
    },
    {
        path: '/infoSetting',
        redirect: 'noredirect',
        name: '资讯管理',
        icon: "icon-zixun1",
        component: Layout,
        hidden: false,
        dropdown: true,
        children: [{
            path: 'allInfo',
            name: '所有栏目',
            component: allInfo
        }, {
            path: 'notice',
            name: '公告栏',
            component: notice
        }, {
            path: 'infoShow',
            name: '文章详情',
            hidden: true,
            component: infoShow
        }, {
            path: 'forum',
            name: '论坛',
            component: forum
        }, {
            path: 'statute',
            name: '法规制度',
            component: statute
        }, {
            path: 'inside',
            name: '内部资料',
            component: inside
        }, {
            path: 'price',
            name: '材料价格',
            component: price
        }, {
            path: 'honor',
            name: '企业荣誉',
            component: honor
        }, {
            path: 'achievement',
            name: '企业经营与业绩',
            component: achievement
        }, {
            path: 'culture',
            name: '企业文化',
            component: culture
        }]
    },
    //  {
    //     path: '/costSetting',
    //     redirect: 'noredirect',
    //     name: '造价咨询',
    //     icon: "icon-jiageprice1",
    //     dropdown: true,
    //     hidden: false,
    //     component: Layout,
    //     children: [{
    //         path: 'projectSetting',
    //         name: '项目管理',
    //         component: projectSetting
    //     }, {
    //         path: 'singleSetting',
    //         name: '单项工程',
    //         component: singleSetting
    //     }, {
    //         path: 'overDueProject',
    //         name: '项目逾期',
    //         component: overDueProject
    //     }, {
    //         path: 'overDueSingle',
    //         name: '单项逾期',
    //         component: overDueSingle
    //     }, {
    //         path: 'costFiles',
    //         name: '造价咨询文件',
    //         component: costFiles
    //     }]
    // },
    {
        path: '/outputSetting',
        redirect: 'noredirect',
        name: '产值管理',
        icon: "icon-emijiage",
        dropdown: true,
        hidden: false,
        component: Layout,
        children: [{
            path: 'costAllOutput',
            name: '造价产值总账',
            component: costAllOutput
        }, {
            path: 'checkQuestionSearch',
            name: '工程代理',
            component: checkQuestionSearch
        }, {
            path: 'biddingCompany',
            name: '采购单位维护',
            component: biddingCompany
        }]
    },
    // {
    //     path: '/wholeSetting',
    //     redirect: 'noredirect',
    //     name: '全过程管理',
    //     icon: "icon-guocheng",
    //     dropdown: true,
    //     hidden: false,
    //     component: Layout,
    //     children: [{
    //         path: 'wholeProject',
    //         name: '项目管理',
    //         component: wholeProject
    //     }, {
    //         path: 'wholeSingle',
    //         name: '单项工程',
    //         component: wholeSingle
    //     }, {
    //         path: 'wholeOverDue',
    //         name: '专业工作逾期',
    //         component: wholeOverDue
    //     }, {
    //         path: 'wholeFile',
    //         name: '全过程文件',
    //         component: wholeFile
    //     }, {
    //         path: 'projectWork',
    //         name: '项目工作',
    //         hidden:true,
    //         component: projectWork
    //     }, {
    //         path: 'leaveMessage',
    //         name: '留言簿',
    //         hidden:true,
    //         component: leaveMessage
    //     }]
    // },
    // {
    //     path: '/monitoring',
    //     redirect: 'noredirect',
    //     name: '业务监控',
    //     icon: "icon-jiankong1",
    //     dropdown: true,
    //     hidden: false,
    //     component: Layout,
    //     children: [{
    //         path: 'singleProjectSearch',
    //         name: '单项工程查询',
    //         component: singleProjectSearch
    //     }, {
    //         path: 'checkQuestionSearch',
    //         name: '审核单问题查询',
    //         component: checkQuestionSearch
    //     }]
    // },
    // {
    //     path: '/',
    //     redirect: '/waitList',
    //     name: 'waitList',
    //     component: Layout,
    //     hidden: true,
    //     children: [{
    //         path: 'waitList',
    //         name: '待办列表',
    //         component: waitList
    //     }]
    // },
    // {
    //     path: '/messageSetting',
    //     redirect: 'noredirect',
    //     name: '短信管理',
    //     icon: "icon-shortmessage",
    //     dropdown: true,
    //     hidden: false,
    //     component: Layout,
    //     children: [{
    //         path: 'messageSend',
    //         name: '短信发送',
    //         component: messageSend
    //     }, {
    //         path: 'messageQuery',
    //         name: '短信查询',
    //         component: messageQuery
    //     }]
    // },
    // {
    //     path: '/roleSetting',
    //     redirect: 'noredirect',
    //     dropdown: true,
    //     hidden: false,
    //     name: '权限管理',
    //     icon: "icon-shezhitianchong",
    //     component: Layout,
    //     children: [{
    //             path: 'departmentAdmin',
    //             name: '部门管理',
    //             component: departmentAdmin
    //         }, {
    //             path: 'roleAdmin',
    //             name: '角色管理',
    //             component: roleAdmin
    //         },
    //         {
    //             path: 'userAdmin',
    //             name: '用户管理',
    //             component: userAdmin
    //         }
    //     ]
    // }
];

export default new VueRouter({
    mode: 'hash',
    base: __dirname,
    routes: mainRoutes
});
