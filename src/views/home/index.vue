<template>
  <div class="container">
    <card
      v-for="(game, index) in gameList"
      :key="index"
      :cover="game.cover"
      :title="game.title"
      :route="game.route"
      class="game-card"
    ></card>
  </div>
</template>
<script src="./index.js"></script>
<style lang="less" src="./style.less" scoped></style>

