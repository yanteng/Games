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
      <div class="settings">
        <div class="rect-button start-btn" @click="onStart">{{ startBtnText }}</div>
        <div class="rect-button mute-btn" @click="onMute">静音</div>
      </div>
      <div class="tetro-controller">
        <div class="circle-button hard-drop-btn" @click="move(MOVE_DIRECTIVE.HARD_DROP)"></div>
        <div class="direction-btns">
          <div class="circle-button direction-btn" @click="move(MOVE_DIRECTIVE.ROTATION)"></div>
          <div class="circle-button direction-btn" @click="move(MOVE_DIRECTIVE.RIGHT)"></div>
          <div class="circle-button direction-btn" @click="move(MOVE_DIRECTIVE.LEFT)"></div>
          <div class="circle-button direction-btn" @click="move(MOVE_DIRECTIVE.DOWN)"></div>
        </div>
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
      MOVE_DIRECTIVE,
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
    onMute() {
      music.isMute = !music.isMute;
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

  .rect-button {
    cursor: pointer;
    .rem-px(padding-left, 6);
    .rem-px(padding-right, 6);
    .rem-px(padding-top, 8);
    .rem-px(padding-bottom, 8);
    .rem-px(font-size, 13);
    color: #fff;
    background-color: #2196f3;
    box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12);
    border-radius: 4px;
    transition:box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    .rem-px(margin, 8);
  }

  .circle-button {
    border-radius: 50%;
    background-color: #2196f3;
    box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);
  }

  .rect-button:active {
    box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12);
  }

  .controller {
    width: 100%;
    .settings {
      display: flex;
      .rem-px(padding-left, 30);
      .rem-px(padding-top, 10);

      .start-btn {
        background-color: #4caf50;
      }

      .mute-btn {
        background-color: #4caf50;
      }
    }
    .tetro-controller {
      display: none;

      @media @small-screen {
        display: flex;
        justify-content: space-evenly;
        align-items: center;

        .hard-drop-btn {
          .rem-px(width, 90);
          .rem-px(height, 90);
        }

        .direction-btns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          .rem-px(grid-column-gap, 10);
          .rem-px(grid-row-gap, 10);
          transform: rotate(45deg);

          .direction-btn {
            .rem-px(width, 60);
            .rem-px(height, 60);
          }
        }
      }
    }
  }
}
</style>
