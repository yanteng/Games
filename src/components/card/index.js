export default {
  props: {
    startAction: String,
    cover: String,
    title: String,
    route: String,
  },
  data() {
    return {
      bgImage: {
        backgroundImage: `url('${this.cover}')`,
      },
      maskDisplayed: false,
    };
  },
  methods: {
    displayMask(isDisplay) {
      this.maskDisplayed = isDisplay;
    },
    play() {
      this.$router.push(this.route);
    },
  },
};
