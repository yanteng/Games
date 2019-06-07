<template>
  <div class="container">
    <transition name="slide">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<style lang="less" scoped>
.container {
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

