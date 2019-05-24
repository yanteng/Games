<template>
  <div class="container">
    <card
      v-for="(game, index) in gameList"
      :key="index"
      :cover="game.cover"
      :title="game.title"
      class="game-card"
    ></card>
  </div>
</template>
<script>
import Card from "./component/card/index.vue";
import { gameList } from './app-data.js'
export default {
  components: {
    Card
  },
  data() {
    return {
      gameList: gameList,
    };
  }
};
</script>
<style lang="less" scoped>
.container {
  padding: 50px;
  width: 100vw;
  height: 100vh;
  background-color: #212121;
  display: flex;
  .game-card {
    margin: 32px;
  }
}
</style>

