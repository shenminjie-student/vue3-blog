<script setup>
import HelloWorld from './components/HelloWorld.vue'
import NavigationBar from './components/NavigationBar.vue'
import FooterBar from './components/FooterBar.vue'
import SpecialEffects from './components/SpecialEffects.vue'
import NeonBanner from './components/NeonBanner.vue'
</script>

<template>
  <div class="App">
    <SpecialEffects />
    <NeonBanner />
    <NavigationBar />
    <router-view />
    <footer-bar />
  </div>
</template>

<style scoped>
  * {
    background-color: black;
  }

  .App {
    min-height: 100vh;
    background-color: black;
  }
</style>
