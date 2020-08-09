<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <hello-world msg="Welcome to Your Vue.js App" />
    <slot-con>123</slot-con>
    <button @click="showLifeCircle">show life circle</button>
    <life-circle v-if="isShowLife" />
    <Parent />
    <RefTest />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import SlotCon from "./components/SlotWrap.vue";
import LifeCircle from "./components/LifeCircle.vue";
import Parent from "./components/Provider/Parent";
import RefTest from "./components/RefTest.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
    SlotCon,
    LifeCircle,
    Parent,
    RefTest,
  },
  data() {
    return {
      isShowLife: false,
    };
  },
  methods: {
    showLifeCircle() {
      this.isShowLife = !this.isShowLife;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
