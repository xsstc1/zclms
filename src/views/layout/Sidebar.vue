<template>
    <sidebar-item></sidebar-item>
</template>

<script>
    import { mapGetters } from 'vuex';
    import SidebarItem from './SidebarItem.vue';
    export default {
      components: { SidebarItem }
    }
</script>

<style lang="stylus" scoped>
.el-menu
  min-height 100%
  top 64px
</style>
