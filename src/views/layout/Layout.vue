<template>
<div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
  <navbar></navbar>
  <div class="sidebar-wrapper shadow">
    <sidebar class="sidebar-container"></sidebar>
  </div>
  <div class="main-container" @click="closeSiderBar">
    <app-main></app-main>
  </div>
</div>
</template>

<script>
import Cookies from 'js-cookie';
import {
  Navbar,
  Sidebar,
  AppMain
} from './';
export default {
  name: 'layout',
  data(){
    return{
      sidebarWidth:false
    }
  },
  components: {
    Navbar,
    AppMain,
    Sidebar
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  mounted() {
    let screenWidth = document.body.clientWidth;
    let sidebarStatus = Cookies.get("sidebarStatus");
    if (screenWidth <= 1200) {
      this.sidebar.opened = false;
    }else{
      if(sidebarStatus==0){
        this.sidebar.opened = true;
      }
    }
  },methods:{
    closeSiderBar(){
      if(this.$store.getters.sidebar.opened){
        let screenWidth = document.body.clientWidth;
        if (screenWidth <= 1200) {
          this.$store.getters.sidebar.opened=false
        }

      }

    }
  }
}
</script>

<style lang="stylus">
.app-wrapper
  position relative
  height 100%
  width 100%
  &.hideSidebar
      .sidebar-wrapper
          transform translate(-180px, 0)
          .sidebar-container
              transform translate(132px, 0)
          &:hover
              transform translate(0, 0)
              .sidebar-container
                  transform translate(0, 0)
      .main-container
          // margin-left 40px
  .sidebar-wrapper
      width 180px
      position: fixed
      top 0
      bottom 0
      left 0
      z-index 10
      overflow hidden
      transition all .28s ease-out
  .sidebar-container
      transition all .28s ease-out
      position absolute
      top 0
      bottom 0
      left 0
      right -17px
      overflow-y scroll
  .main-container
      min-height 100%
      transition all .28s ease-out
      // margin-left 180px
</style>
