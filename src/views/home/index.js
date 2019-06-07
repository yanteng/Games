import Card from "../../components/card/index.vue";
import { gameList } from "../../app-data.js"
export default {
  components: {
    Card
  },
  data() {
    return {
      gameList: gameList
    };
  }
};