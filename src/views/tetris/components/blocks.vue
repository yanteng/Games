<template>
  <div class="container">
    <div v-for="(row,rowIndex) in data" :key="rowIndex" class="row">
      <div
        v-for="(state, colIndex) in row"
        :key="colIndex"
        class="block"
        :class="getStateClass(state)"
      ></div>
    </div>
  </div>
</template>

<script>
import { BLOCK_STATE } from '../const';

export default {
  name: 'Blocks',
  props: {
    data: {
      required: true,
      type: Array,
    },
  },
  methods: {
    getStateClass(state) {
      if (state === BLOCK_STATE.FIXED) return 'fixed';
      return 'empty';
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  background-color: #9ead86;
  padding-bottom: 200%;
  .row {
    width: 100%;
    .block {
      box-sizing: border-box;
      width: 
    }
    .fixed {
    }
  }
}
</style>
