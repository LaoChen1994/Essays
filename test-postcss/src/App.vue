<template>
<div id="app">
  <HelloWorld msg="Welcome to Your Vue.js App" />
</div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
};
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
}

#app {
  padding: 0;
  margin: 0;
}
</style>
