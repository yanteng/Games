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
        backgroundImage: `url('${this.cover}')`
      },
      maskDisplayed: false
    }
  },
  methods: {
    displayMask: function(isDisplay) {
      this.maskDisplayed = isDisplay;
    },
    play: function() {
      this.$router.push(this.route)
    }
  },
}