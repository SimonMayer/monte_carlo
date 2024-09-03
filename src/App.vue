<template>
  <LoadingIndicator/>
  <div class="header">
    <h1>Monte Carlo</h1>
    <h2>forecast tool</h2>
  </div>
  <div class="content">
    <DashboardPage/>
  </div>
</template>

<script>
import DashboardPage from '@/components/DashboardPage.vue';
import LoadingIndicator from '@/components/LoadingIndicator.vue';

export default {
  name: 'App',
  components: {
    LoadingIndicator,
    DashboardPage,
  },
};
</script>

<style lang="scss">
@use "@/assets/core/color/variables" as color;

$fontSizeBase: 16px;
$fontSizeSmall: calc($fontSizeBase / 1.2);

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: $fontSizeBase;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: color.$text;
}

body {
  margin: 0;
}

small {
  font-size: $fontSizeSmall;
}

ol > li::marker {
  font-size: $fontSizeSmall;
}

h1, h2, h3, h4, h5, h6, h7 {
  margin: 0;
}

h3 {
  margin-bottom: 8px;
}

a {
  color: color.$link;
}
</style>

<style lang="scss" scoped>
@use "@/assets/core/color/variables" as color;

.header,
.content {
  background-color: color.$light;
  padding: 8px;
}

.header {
  background-color: color.$dark;

  h1 {
    color: color.$primary;
  }

  h2 {
    color: color.$secondary;
  }
}
</style>
