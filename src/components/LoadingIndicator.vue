<template>
  <transition name="fade">
    <div v-show="isLoading" class="loading-overlay">
      <img class="spinner" src="/full-roulette.svg" alt="spinning roulette wheel as a loading indicator"/>
    </div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'LoadingIndicator',
  computed: {
    ...mapGetters({
      isLoading: 'loading/isLoading',
    }),
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/core/animation/variables' as animation;

.loading-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  pointer-events: none;

  .spinner {
    border: solid 0.3em rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    opacity: 0.5;
    animation: spin 3s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity animation.$transition-time-slower;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
