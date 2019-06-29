<template>
  <div class="info-container">
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
