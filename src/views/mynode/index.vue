<template>
  <div class="node">
    <router-link :to="{ path: '' }"></router-link>
    <router-link :to="{ path: '/mynode/register' }"></router-link>
    <router-link :to="{ path: '/mynode/detail' }"></router-link>
    <router-view />
    <!-- <MyNodes></MyNodes> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import MyNodes from '@/views/mynode/nodes.vue'
export default {
  name: 'NodeView',
  components: {
    // MyNodes
  }
}
</script>
<style lang="scss" scoped>
.node {
  width: 100%;
  padding: 0 60px;
  box-sizing: border-box;
}
</style>
