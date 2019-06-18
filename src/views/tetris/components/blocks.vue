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
      if (state === BLOCK_STATE.ACTIVE) return 'active';
      return 'empty';
    },
  },
};
</script>

<style lang="less" scoped>
@import url('../share/style.less');
@import url("../../../share/less/varibles.less");

.block-container {
  border: 1px black solid;
  .rem-px(margin, 5);
  display: grid;
  grid-template-rows: repeat(20, 5%);

  .row {
    display: grid;
    grid-template-columns: repeat(10, 10%);
    .rem-px(margin-bottom, 1);
    
    &:first-child {
      .rem-px(margin-top, 1);
    }

    .block {
      border: 1px black solid;
      .rem-px(margin-right, 1);
      position: relative;

      &:first-child {
        .rem-px(margin-left, 1);
      }

      &::after {
        content: "";
        width: 80%;
        height: 80%;
        background-color: black;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .active {
      opacity: 1;
    }

    .empty {
      opacity: 0.1;
    }
  }
}
</style>
