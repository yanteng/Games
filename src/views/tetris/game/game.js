/* eslint-disable object-curly-newline */
import { generateTetro, rotation } from './tetromino';

export const BLOCK_STATE = {
  EMPTY: 0,
  ACTIVE: 1,
  // meaning this block can not drop down
  BLOCKED: 2,
  // meaning block fixed
  FIXED: 3,
};

export const GAME_STATE = {
  STOPPED: 0,
  PAUSED: 1,
  RUNNING: 2,
};

export const MOVE_DIRECTIVE = {
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  ROTATION: 'rotation',
};

function getSpeedByGameLevel(level) {
  return 300 - level * 25;
}

const getTetroRect = (tetro) => {
  const anchor = tetro.anchors[tetro.curAnchorIndex];
  const y1 = tetro.position[0] - anchor[0];
  const x1 = tetro.position[1] - anchor[1];
  const y2 = y1 + tetro.shape.length - 1;
  const x2 = x1 + tetro.shape[0].length - 1;
  return { y1, x1, y2, x2 };
};

const deepCopyTetro = origin => JSON.parse(JSON.stringify(origin));

const isAvailablePosition = (mainPanel, tetro) => {
  const { y1, x1, y2, x2 } = getTetroRect(tetro);
  if (x1 <= 0 || x2 >= mainPanel[0].length) return false;
  if (y2 >= mainPanel.length) return false;
  const { shape } = tetro;
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (mainPanel[y1 + i][x1 + j] !== BLOCK_STATE.EMPTY && shape[i][j] !== BLOCK_STATE.EMPTY) {
        return false;
      }
    }
  }
  return true;
};

export const Game = function() {
  init();
  this.start = function() {
    this.state = GAME_STATE.RUNNING;
    setTimeout(dropDown, getSpeedByGameLevel(this.level));
  };
  this.pause = function() {};
  this.exit = function() {};
  // move tetro, if can not move return false
  this.move = function(directive = MOVE_DIRECTIVE.DOWN) {
    const tempTetro = deepCopyTetro(this.tetro);
    switch (directive) {
      case MOVE_DIRECTIVE.DOWN:
        tempTetro.position[0] += 1;
        break;
      case MOVE_DIRECTIVE.LEFT:
        tempTetro.position[1] -= 1;
        break;
      case MOVE_DIRECTIVE.RIGHT:
        tempTetro.position[1] += 1;
        break;
      case MOVE_DIRECTIVE.ROTATION:
        rotation(tempTetro);
        break;
      default:
        break;
    }
    if (!isAvailablePosition(this.mainPanel, tempTetro)) {
      if (directive === MOVE_DIRECTIVE.DOWN) {
        fixTetro();
        update();
        this.tetro = generateTetro();
      }
      return false;
    }
    this.tetro = tempTetro;
    update();
    return true;
  };

  const init = () => {
    this.score = 0;
    this.state = GAME_STATE.STOPPED;
    this.level = 1;
    this.panelWidth = 10;
    this.panelHeight = 20;
    // this 2d array using for game data
    this.mainPanel = new Array(this.panelHeight).fill(
      new Array(this.panelWidth).fill(BLOCK_STATE.EMPTY),
    );
    this.tetro = generateTetro(this.panelWidth);
    update();
  };
  // drop down, this function will called all the time
  const dropDown = () => {
    this.move(MOVE_DIRECTIVE.DOWN);
    setTimeout(dropDown, getSpeedByGameLevel(this.level));
  };
  // fix current tetro
  const fixTetro = () => {
    this.tetro = this.tetro.map(row => row.map(state => BLOCK_STATE.FIXED));
  };
  // update mainPanel with current tetro
  const update = () => {
    const { y1, x1 } = getTetroRect(this.tetro);
    this.tetro.forEach((row, rowIndex) => {
      row.forEach((state, colIndex) => {
        this.mainPanel[y1 + rowIndex][x1 + colIndex] = state;
      });
    });
  };
};
