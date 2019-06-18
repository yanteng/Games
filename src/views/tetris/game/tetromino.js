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
  tetro.position = [tetro.anchors[rotationNum][0], mainPanelWidth / 2];
  new Array(rotationNum).forEach((i) => {
    rotation(tetro);
  });
  return tetro;
};

export { generateTetro, rotation };
