<template>
  <LoadingIndicator/>
  <router-link :to="$router.getRouteById('home')" class="header-link">
    <div class="header">
      <h1>Monte Carlo</h1>
      <h2>forecast tool</h2>
    </div>
  </router-link>
  <div class="content">
    <router-view></router-view>
  </div>
</template>

<script>
import LoadingIndicator from '@/components/LoadingIndicator.vue';

export default {
  name: 'App',
  components: {
    LoadingIndicator,
  },
};
</script>

<style lang="scss">
@use '@/assets/core/animation/variables' as animation;
@use '@/assets/core/color/variables' as color;
@use '@/assets/core/typography/variables' as typography;

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: var(--typography-font-size);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: color.$text;
}

body {
  margin: 0;
}

small {
  font-size: var(--typography-font-size-small);
}

ol > li::marker {
  font-size: var(--typography-font-size-small);
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

button {
  padding: 12px;
  border: solid 1px darken(color.$secondary, 10%);
  border-radius: 8px;
  background-color: color.$secondary;
  color: color.$light;
  font-weight: bold;
  transition: background-color animation.$transition-time-standard, border-color animation.$transition-time-standard;

  &:hover {
    border-color: color.$secondary;
    background-color: lighten(color.$secondary, 5%);
    cursor: pointer;
  }

  &:active {
    border-color: color.$light;
    background-color: darken(color.$secondary, 10%);
  }

  &:disabled {
    background-color: color.$mutedLight;
    border-color: color.$mutedVeryLight;
    color: color.$mutedVeryLight;
  }
}
</style>

<style lang="scss" scoped>
@use '@/assets/core/color/variables' as color;
@use '@/assets/core/responsive/mixins' as responsive;

.header-link {
  text-decoration: none;
}

.header {
  height: 70px;
  background-color: color.$dark;
  background-image: url('/public/partial-roulette.svg'), linear-gradient(
          145deg, color.$mutedVeryDark 30px, color.$dark 43px, color.$dark
  );
  background-position: left top;
  background-repeat: no-repeat;
  background-size: 86px 86px;
  padding: 8px 8px 8px 100px;

  @include responsive.breakpoint(medium) {
    height: 80px;
    background-size: 96px 96px;
    padding-left: 110px;
  }

  h1 {
    color: color.$mutedLight;
  }

  h2 {
    color: color.$mutedSlightlyDark;
  }
}

.content {
  background-color: color.$light;
  padding: 8px;
}
</style>
