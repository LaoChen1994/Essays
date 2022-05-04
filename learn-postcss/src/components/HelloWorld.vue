<template>
<div class="wrap">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.wrap {
  width: 750px;
  display: flex;
  background: #333;
  height: 100px;
  font-size: 37.5px;
  text-align: center;
  line-height: 100px;
}

.item {
  width: 250px;
  box-sizing: border-box;
  background: red;
}

.item:nth-child(2n) {
  background: blue;
}
</style>
