<template>
<section class="app-main">
  <!-- <levelbar></levelbar> -->
  <transition name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
</section>
</template>

<script>
// import Levelbar from './Levelbar';
export default {
  name: 'AppMain',
  // components: {
  //   Levelbar
  // },
  computed: {

  },
   mounted() {
     window.addEventListener('scroll', this.handleScroll)
   },
   mothods:{
     handleScroll(){
       console.log(123)
     }
   }
}
</script>
<style lang="stylus">
.app-main
  padding-top 65px
</style>
