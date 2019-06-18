<template>
  <div class="block-container">
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
import { BLOCK_STATE } from '../game/const';

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
@import url('../share/style.less');
@import url('../../../share/style.less');

.block-container {
  border: 1px black solid;
  .rem-px(margin, 5);
  display: grid;
  grid-template-rows: repeat(20, 5%);
  .row {
    display: grid;
    grid-template-columns: repeat(10, 10%);
    margin: 1px;
    .block {
      border: 1px black solid;
      margin: 1px;
    }
  }
}
</style>
