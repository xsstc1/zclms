<template>
<div id="app">
  <router-view></router-view>
</div>
</template>

<script>

import {
  mapGetters
} from 'vuex';
import 'babel-polyfill'
export default {
  name: 'app',
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  }
}
</script>
<style lang="stylus">
  @import './assets/css/style.styl'; // 全局自定义的css样式
</style>
