<template>
  <div class="sidebar">
    <div class="head">
      <img class="head-img" src="@/assets/img/svg/logo.svg" />
    </div>
    <div class="menu">
      <div
        :class="
          $route.name === 'home' || $route.name === 'nodedetail'
            ? 'menu-item active'
            : 'menu-item'
        "
        @click="goPage('/')"
      >
        <img src="@/assets/img/svg/home.svg" />
        <span>Home</span>
        <div class="menu-active-btn">
          <img src="@/assets/img/svg/right-arrow.svg" />
        </div>
      </div>
      <div
        :class="
          $route.path.substr(1, 6) === 'mynode'
            ? 'menu-item active'
            : 'menu-item'
        "
        @click="goPage('mynode')"
      >
        <img src="@/assets/img/svg/mynode.svg" />
        <span>My Node</span>
        <div class="menu-active-btn">
          <img src="@/assets/img/svg/right-arrow.svg" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SideBar',
  methods: {
    goPage($url) {
      this.$router.push($url)
    }
  }
}
</script>
<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  box-sizing: border-box;
  width: 310px;
  height: 100vh;
  left: 0;
  background: #ffffff;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
  border-radius: 20px 0px 0px 20px;
  padding: 43px 40px;
}
.head {
  position: fixed;
  top: 43px;
  .head-img {
    width: 230px;
  }
}
.menu {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  .active {
    background: #f9fafe;
    transition: all ease 0.3s;
    position: relative;
    .menu-active-btn {
      position: absolute;
      right: 10px;
      top: 9px;
      opacity: 1 !important;
      width: 48px;
      height: 34px;
      background: #00fff0;
      border-radius: 8px;
      transition: opacity ease 0.3s;
    }
  }
  .menu-item:hover {
    background: #f9fafe;
    transition: all ease 0.3s;
    position: relative;
    .menu-active-btn {
      position: absolute;
      right: 10px;
      top: 9px;
      opacity: 1;
      width: 48px;
      height: 34px;
      background: #00fff0;
      border-radius: 8px;
      transition: opacity ease 0.3s;
    }
  }
  .menu-item {
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    width: 230px;
    height: 52px;
    border-radius: 12px;
    transition: all ease 0.3s;
    padding: 10px;
    box-sizing: border-box;
    margin-bottom: 20px;
    .menu-active-btn {
      position: absolute;
      right: 10px;
      top: 9px;
      opacity: 0;
      width: 48px;
      height: 34px;
      background: #00fff0;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity ease 0.3s;
      img {
        width: 14px;
      }
    }
    img {
      width: 36px;
    }
    span {
      margin-left: 20px;
      font-family: "Open Sans";
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      color: #002568;
    }
  }
}
</style>
