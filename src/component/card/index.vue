<template>
  <div
    class="card"
    :style="bgImage"
    @mouseenter="displayMask(true)"
    @mouseleave="displayMask(false)"
  >
    <div class="mask" :class="{'mask-displayed': maskDisplayed}">
      <div class="title">{{ title }}</div>
      <div class="action share"></div>
      <div class="action start"></div>
    </div>
  </div>
</template>
<script src="./index.js"></script>
<style lang="less" src="./style.less" scoped></style>


