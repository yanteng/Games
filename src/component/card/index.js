export default {
  props: {
    startAction: String,
    coverUrl: String
  },
  data() {
    return {
      bgImage: {
        backgroundImage: `url('${this.coverUrl}')`
      }
    }
  },
  methods: {
  },
}