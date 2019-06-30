const MUSIC_NAME = {
  START: 'start',
  CLEAR: 'clear',
  HARD_DROP: 'hard_drop',
  GAME_OVER: 'game_over',
  ROTATE: 'rotate',
  MOVE: 'move',
};

const music = {
  buff: null,
  context: null,
  isMute: false,
  source() {
    const source = this.context.createBufferSource();
    source.buffer = this.buff;
    source.connect(this.context.destination);
    return source;
  },
  loadMusic() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    const audioSrc = 'static/music.mp3';

    const onSuccess = (request) => {
      const audioData = request.response;
      this.context.decodeAudioData(
        audioData,
        (buffer) => {
          this.buff = buffer;
        },
        e => window.console.log(`music decode error:${e.message}`),
      );
    };
    fetch(audioSrc, onSuccess);

    function fetch(url, resolve) {
      const request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onload = function() {
        resolve(request);
      };
      request.send();
    }
  },
  play(name) {
    if (!this.buff || this.isMute) return;
    switch (name) {
      case MUSIC_NAME.START:
        this.source().start(0, 3.7202, 3.6224);
        break;
      case MUSIC_NAME.MOVE:
        this.source().start(0, 2.9088, 0.1437);
        break;
      case MUSIC_NAME.CLEAR:
        this.source().start(0, 0, 0.7675);
        break;
      case MUSIC_NAME.GAME_OVER:
        this.source().start(0, 8.1276, 1.1437);
        break;
      case MUSIC_NAME.ROTATE:
        this.source().start(0, 2.2471, 0.0807);
        break;
      case MUSIC_NAME.HARD_DROP:
        this.source().start(0, 1.2558, 0.3546);
        break;
      default:
        break;
    }
  },
};

export { music, MUSIC_NAME };
