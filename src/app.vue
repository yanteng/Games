<template>
  <div class="app-container">
    <transition name="slide">
      <router-view class="game-view"></router-view>
    </transition>
  </div>
</template>

<style lang="less" scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(238,174,202);
  background: radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%);
  width: 100%;
  height: 100%;
  .slide-enter{
    top: 100%;
    transform: translateY(100%);
  }
  .slide-enter-active {
    transition: 0.5s;
  }
  .slide-enter-to {
    top: 0;
    transform: translateY(0);
  }
}
</style>
<style lang="less">
@import url('./share/style.less');

html{
  font-size: ~"@{base-font-size}px";
}
</style>
