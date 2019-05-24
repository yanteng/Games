export default {
  props: {
    startAction: String,
    cover: String,
    title: String
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
      console.log(isDisplay)
    }
  },
}