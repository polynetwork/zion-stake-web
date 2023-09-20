<template>
  <div class="home">
    <Dashboard></Dashboard>
    <Overview></Overview>
    <Nodelist></Nodelist>
  </div>
</template>

<script>
import Dashboard from '@/views/home/dashboard.vue'
import Overview from '@/views/home/overview.vue'
import Nodelist from '@/views/home/nodelist.vue'
export default {
  name: 'HomeView',
  components: {
    Dashboard,
    Overview,
    Nodelist
  }
}
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  min-height: 100vh;
  padding: 0 60px;
  box-sizing: border-box;
}
</style>
