<template>
  <div class="game-container">
    <div class="title">Tetris</div>
    <div class="screen">
      <blocks data="blocks"></blocks>
    </div>
    <div class="controller"></div>
  </div>
</template>

<script>
import {
  GAME_STATE, BLOCK_STATE, GAME_SIZE_WIDTH, GAME_SIZE_HEIGHT,
} from './game/const';
import { generateTetro, rotation } from './game/tetromino';

export default {
  data() {
    return {
      blocks: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.score = 0;
      this.state = GAME_STATE.STOPPED;
      this.level = 1;
      // this 2d array using for game data
      this.blocks = new Array(GAME_SIZE_HEIGHT).fill(
        new Array(GAME_SIZE_WIDTH).fill(BLOCK_STATE.EMPTY),
      );
      this.tetro = generateTetro(GAME_SIZE_WIDTH);
    },
  },
};
</script>
<style lang="less" scoped>
@import url('./share/style.less');
@import url('../../share/style.less');

  .game-container {
    .rem-px(width, 400);
    .rem-px(height, 600);
    background-color: #efcc19;
    .title {
      
    }
    @media @small-screen {
      max-width: 100%;
      height: 100%;
      background-color: black;
    }
  }
</style>
