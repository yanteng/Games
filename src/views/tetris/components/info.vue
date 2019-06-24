<template>
  <div class="info-container">
    <div class="max-value">
      <div>Max Value</div>
      <div>1</div>
    </div>
    <div>
      <div>score</div>
      <div>{{ score }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    score: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style lang="less" scoped>

</style>
