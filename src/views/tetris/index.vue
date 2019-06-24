<template>
  <div class="game-container">
    <div class="title">T e t r i s</div>
    <div class="screen" style="--aspect-ratio:3/4;">
      <div>
        <blocks :data="blocks"></blocks>
        <info :score="score" :level="level"></info>
      </div>
    </div>
    <div class="controller">
      <div class="tetro-controller"></div>
      <div class="settings">
        <div class="start-btn" @click="onStart">{{ startBtnText }}</div>
      </div>
    </div>
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
  MOVE_DIRECTIVE,
} from './game/const';
import {
  generateTetro,
  getTetroRect,
  moveTetro,
  findFullLines,
} from './game/tetromino';
import {
  music, 
  MUSIC_NAME,
} from './game/music';

export default {
  components: {
    Blocks,
    Info,
  },
  data() {
    return {
      blocks: [],
      score: 0,
      gameState: GAME_STATE.STOPPED,
      level: 1,
      tetro: null,
      startBtnText: '开始',
      timer: null,
    };
  },
  mounted() {
    this.init();
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  },
  methods: {
    init() {
      music.loadMusic();
      // this 2d array using for game data
      this.blocks = new Array(GAME_SIZE_HEIGHT).fill(
        new Array(GAME_SIZE_WIDTH).fill(BLOCK_STATE.EMPTY),
      );
      this.newTetro();
    },
    newTetro() {
      this.tetro = generateTetro(GAME_SIZE_WIDTH);
    },
    drawActiveBlocks() {
      const { y1, x1 } = getTetroRect(this.tetro);
      this.tetro.shape.forEach((row, rowIndex) => {
        const yPos = y1 + rowIndex;
        if (yPos < 0) return;
        const newRow = this.blocks[yPos].slice(0);
        row.forEach((state, colIndex) => {
          const xPos = x1 + colIndex;
          if (newRow[xPos] === BLOCK_STATE.EMPTY) {
            newRow[xPos] = state;
          }
        });
        this.$set(this.blocks, yPos, newRow);
      });
    },
    getSpeedByGameLevel(level) {
      return 1000 - level * 25;
    },
    onKeyUp(event) {
      if (event.key !== 'Enter' && this.gameState !== GAME_STATE.RUNNING) return;
      switch (event.key) {
        case 'Enter':
          this.onStart();
          break;
        case 'ArrowUp':
          this.move(MOVE_DIRECTIVE.ROTATION);
          break;
        case ' ':
          this.move(MOVE_DIRECTIVE.HARD_DROP);
          break;
        default:
          break;
      }
    },
    onKeyDown(event) {
      if (this.gameState !== GAME_STATE.RUNNING) return;
      switch (event.key) {
        case 'ArrowRight':
          this.move(MOVE_DIRECTIVE.RIGHT);
          break;
        case 'ArrowLeft':
          this.move(MOVE_DIRECTIVE.LEFT);
          break;
        case 'ArrowDown':
          this.move(MOVE_DIRECTIVE.DOWN);
          break;
        default:
          break;
      }
    },
    changeBlocksState(originState, destState) {
      this.blocks.forEach((row, rowIndex) => {
        const newRow = this.blocks[rowIndex].slice(0);
        let changed = false;
        row.forEach((state, colIndex) => {
          if (state === originState) {
            newRow[colIndex] = destState;
            changed = true;
          }
        });
        if (changed) {
          this.$set(this.blocks, rowIndex, newRow);
        }
      });
    },
    clearActiveBlocks() {
      this.changeBlocksState(BLOCK_STATE.ACTIVE, BLOCK_STATE.EMPTY);
    },
    freezeActiveBlocks() {
      this.changeBlocksState(BLOCK_STATE.ACTIVE, BLOCK_STATE.FIXED);
      // 在固定活动砖块是,如果发现当前的 tetro 还在界外,则认为固定砖块失败,表示游戏结束
      return getTetroRect(this.tetro).y1 >= 0;
    },
    removeFullLine() {
      const fullLinesRowIndexs = findFullLines(this.blocks);
      fullLinesRowIndexs.forEach((rowIndex) => {
        this.blocks.splice(rowIndex, 1);
        this.blocks.unshift(new Array(GAME_SIZE_WIDTH).fill(BLOCK_STATE.EMPTY));
      });
      if (fullLinesRowIndexs.length !== 0) {
        music.play(MUSIC_NAME.CLEAR);
      }
      return fullLinesRowIndexs.length;
    },
    scoring() {
      if (!this.freezeActiveBlocks()) {
        this.gameState = GAME_STATE.STOPPED;
        music.play(MUSIC_NAME.GAME_OVER);
        clearTimeout(this.timer);
        return;
      }
      this.score += this.removeFullLine();
      this.newTetro();
    },
    autoDrop() {
      this.timer = setTimeout(
        () => this.move(),
        this.getSpeedByGameLevel(this.level),
      );
    },
    move(directives = MOVE_DIRECTIVE.DOWN) {
      this.clearActiveBlocks();
      const moveSuccess = moveTetro(directives, this.tetro, this.blocks);
      this.drawActiveBlocks();
      // 没有传参数表示自动降落. 只有在 harddrop 和自动降落中得分
      if (arguments.length === 0) {
        this.autoDrop();
        if (!moveSuccess) {
          this.scoring();
        }
      } else if (directives === MOVE_DIRECTIVE.HARD_DROP) {
        music.play(MUSIC_NAME.HARD_DROP);
        this.scoring();
      } else if (directives === MOVE_DIRECTIVE.ROTATION) {
        music.play(MUSIC_NAME.ROTATE);
      } else {
        music.play(MUSIC_NAME.MOVE);
      }
    },
    start() {
      if (this.gameState === GAME_STATE.STOPPED) {
        music.play(MUSIC_NAME.START);
      }
      this.startBtnText = '暂停';
      this.move();
      this.gameState = GAME_STATE.RUNNING;
    },
    pause() {
      this.startBtnText = '开始';
      this.gameState = GAME_STATE.PAUSED;
      clearTimeout(this.timer);
    },
    onStart() {
      if (this.gameState === GAME_STATE.RUNNING) {
        this.pause();
      } else if (this.gameState === GAME_STATE.PAUSED || this.gameState === GAME_STATE.STOPPED) {
        this.start();
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import url("./share/style.less");
@import url("../../share/less/varibles.less");
@import url("../../share/less/style.less");

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

  .controller {
    .settings {
      .start-btn {
        .rem-px(border-radius, 2);
        background-color: #2dc421;
        color: white;
      }
    }
    .tetro-controller {
      @media @small-screen {
        display: none;
      }
    }
  }
}
</style>
