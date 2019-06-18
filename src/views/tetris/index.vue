<template>
  <div class="game-container">
    <div class="title">T e t r i s</div>
    <div class="screen" style="--aspect-ratio:3/4;">
      <div>
        <blocks :data="blocks"></blocks>
        <info></info>
      </div>
    </div>
    <div class="controller"></div>
  </div>
</template>

<script>
import Blocks from './components/blocks.vue';
import Info from './components/info.vue';
import {
  GAME_STATE,
  BLOCK_STATE,
  GAME_SIZE_WIDTH,
  GAME_SIZE_HEIGHT,
} from './game/const';
import { generateTetro, rotation } from './game/tetromino';

export default {
  components: {
    Blocks,
    Info,
  },
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
@import url("./share/style.less");
@import url("../../share/style.less");

.game-container {
  .rem-px(width, 400);
  .rem-px(height, 600);
  .rem-px(border-radius, 20);
  background-color: #efcc19;
  box-shadow: inset 0 0 10px #fff;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media @small-screen {
    width: 100%;
    height: 100%;
  }

  .title {
    font-family: fantasy, auto;
    text-align: center;
    .rem-px(font-size, 32);
  }

  .screen {
    width: 90%;
    background-color: #9ead86;
    border: solid;
    .rem-px(border-width, 3);
    border-color: #987f0f #fae36c #fae36c #987f0f;
    
    @media @small-screen {
      width: 80%;
    }

    & > div {
      display: grid;
      grid-template-columns: 2fr 1fr;
    }
  }
}
</style>
