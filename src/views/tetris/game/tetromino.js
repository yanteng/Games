import { BLOCK_STATE, MOVE_DIRECTIVE } from './const';

const S = () => ({
  shape: [[0, 1, 1], [1, 1, 0]],
  anchors: [[0, 1], [1, 0]],
});

const INV_S = () => ({
  shape: [[1, 1, 0], [0, 1, 1]],
  anchors: [[0, 1], [1, 0]],
});

const T = () => ({
  shape: [[1, 1, 1], [0, 1, 0]],
  anchors: [[0, 1], [1, 1], [1, 1], [1, 0]],
});

const L = () => ({
  shape: [[1, 0], [1, 0], [1, 1]],
  anchors: [[1, 1], [1, 1], [1, 0], [0, 1]],
});

const INV_L = () => ({
  shape: [[0, 1], [0, 1], [1, 1]],
  anchors: [[1, 1], [1, 1], [1, 0], [0, 1]],
});

const I = () => ({
  shape: [[1], [1], [1], [1]],
  anchors: [[1, 0], [0, 1]],
});

const O = () => ({
  shape: [[1, 1], [1, 1]],
  anchors: [[0, 0]],
});

// clockwise rotation a tetro
const rotation = function(tetro) {
  if (tetro.anchors.length > 1) {
    // eslint-disable-next-line no-param-reassign
    tetro.curAnchorIndex = (tetro.curAnchorIndex + 1) % tetro.anchors.length;
    // eslint-disable-next-line no-param-reassign
    tetro.shape = tetro.shape[0].map((col, i) => tetro.shape.map(row => row[i]).reverse());
  }
};

const generateTetro = function(mainPanelWidth = 0) {
  const tetroType = [S, INV_S, L, INV_L, O, I, T];
  const tetro = tetroType[Math.floor(Math.random() * tetroType.length)]();
  tetro.curAnchorIndex = 0;
  const rotationNum = Math.floor(Math.random() * tetro.anchors.length);
  (new Array(rotationNum)).fill(0).forEach(() => {
    rotation(tetro);
  });
  tetro.position = [tetro.anchors[rotationNum][0] - tetro.shape.length, mainPanelWidth / 2];
  return tetro;
};

const getTetroRect = (tetro) => {
  const anchor = tetro.anchors[tetro.curAnchorIndex];
  const y1 = tetro.position[0] - anchor[0];
  const x1 = tetro.position[1] - anchor[1];
  const y2 = y1 + tetro.shape.length - 1;
  const x2 = x1 + tetro.shape[0].length - 1;
  return {
    y1, x1, y2, x2,
  };
};

const deepCopyTetro = origin => JSON.parse(JSON.stringify(origin));

const isAvailablePosition = (mainPanel, tetro) => {
  const {
    y1, x1, y2, x2,
  } = getTetroRect(tetro);
  if (x1 < 0 || x2 >= mainPanel[0].length) return false;
  if (y2 >= mainPanel.length) return false;
  const { shape } = tetro;
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      // eslint-disable-next-line no-continue
      if (y1 + i < 0) continue;
      if (mainPanel[y1 + i][x1 + j] !== BLOCK_STATE.EMPTY && shape[i][j] !== BLOCK_STATE.EMPTY) {
        return false;
      }
    }
  }
  return true;
};

const moveTetro = function(directive = MOVE_DIRECTIVE.DOWN, tetro, blocks) {
  const tempTetro = deepCopyTetro(tetro);
  let canDrop = false;
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
    case MOVE_DIRECTIVE.HARD_DROP:
      canDrop = hardDrop(blocks, tempTetro);
      if (canDrop) Object.assign(tetro, tempTetro);
      return canDrop;
    default:
      break;
  }
  if (!isAvailablePosition(blocks, tempTetro)) {
    return false;
  }
  Object.assign(tetro, tempTetro);
  return true;
};

const findFullLines = function(blocks) {
  const fullLineRowIndexs = [];
  blocks.forEach((row, rowIndex) => {
    const fixedBlocks = row.filter(state => state === BLOCK_STATE.FIXED);
    if (fixedBlocks.length === row.length) {
      fullLineRowIndexs.push(rowIndex);
    }
  });
  return fullLineRowIndexs;
};

const hardDrop = function(blocks, tetro) {
  let moveStep = 0;
  while (isAvailablePosition(blocks, tetro)) {
    // eslint-disable-next-line no-param-reassign
    tetro.position[0] += 1;
    moveStep++;
  }
  // eslint-disable-next-line no-param-reassign
  if (moveStep) tetro.position[0] -= 1;
  // 没移动表示当前的 tetro 是不可移动的,返回 false
  return moveStep - 1 > 0;
};

export {
  generateTetro,
  rotation,
  deepCopyTetro,
  isAvailablePosition,
  getTetroRect,
  moveTetro,
  findFullLines,
  hardDrop,
};
