<template>
  <div class="container"> 
    <card cover-url="/image/tetris-cover.jpg" start-action=""></card>
</div>
</template>
<script>
import Card from './component/card/index.vue'
import '../assets/image/tetris-cover.jpg'
export default {
    components: {
      Card,
    }
};
</script>
<style lang="less" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background-color:  #212121;
}
</style>

