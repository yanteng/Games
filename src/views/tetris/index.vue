<template>
  <div class="game-container">
    <div class="title">T e t r i s</div>
    <div class="screen" style="--aspect-ratio:3/4;">
      <div>
        <blocks :data="blocks"></blocks>
        <info></info>
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

export default {
  components: {
    Blocks,
    Info,
  },
  data() {
    return {
      blocks: [],
      score: 0,
      state: GAME_STATE.STOPPED,
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
      // this 2d array using for game data
      this.blocks = new Array(GAME_SIZE_HEIGHT).fill(
        new Array(GAME_SIZE_WIDTH).fill(BLOCK_STATE.EMPTY),
      );
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
      if (event.key !== 'Enter' && this.state !== GAME_STATE.RUNNING) return;
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
      if (this.state !== GAME_STATE.RUNNING) return;
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
    },
    removeFullLine() {
      const fullLinesRowIndexs = findFullLines(this.blocks);
      fullLinesRowIndexs.forEach((rowIndex) => {
        this.blocks.splice(rowIndex, 1);
        this.blocks.unshift(new Array(GAME_SIZE_WIDTH).fill(BLOCK_STATE.EMPTY));
      });
      return fullLinesRowIndexs.length;
    },
    scoring() {
      this.freezeActiveBlocks();
      this.score += this.removeFullLine();
      this.tetro = generateTetro(GAME_SIZE_WIDTH);
    },
    move(directives = MOVE_DIRECTIVE.DOWN) {
      this.clearActiveBlocks();
      const moveSuccess = moveTetro(directives, this.tetro, this.blocks);
      this.drawActiveBlocks();
      if (directives === MOVE_DIRECTIVE.HARD_DROP) {
        this.scoring();
        return;
      }
      // 没有传参数表示 自动降落. 只有在 harddrop 和自动降落中得分
      if (arguments.length === 0) {
        if (!moveSuccess) {
          this.scoring();
        }
        this.timer = setTimeout(
          () => this.move(),
          this.getSpeedByGameLevel(this.level),
        );
      }
    },
    onStart() {
      if (this.state === GAME_STATE.RUNNING) {
        this.startBtnText = '开始';
        this.state = GAME_STATE.PAUSED;
        clearTimeout(this.timer);
      } else if (this.state === GAME_STATE.PAUSED || this.state === GAME_STATE.STOPPED) {
        this.startBtnText = '暂停';
        this.move();
        this.state = GAME_STATE.RUNNING;
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
