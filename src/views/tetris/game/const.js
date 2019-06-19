export const BLOCK_STATE = {
  EMPTY: 0,
  ACTIVE: 1,
  // meaning this block can not drop down
  BLOCKED: 2,
  // meaning block fixed
  FIXED: 3,
};

export const GAME_SIZE_WIDTH = 10;
export const GAME_SIZE_HEIGHT = 20;

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
  HARD_DROP: 'hard_drop',
};
