<template>
  <transition name="fade">
    <div v-show="isLoading" class="loading-overlay">
      <div class="loading-inner-container">
        <img
            v-show="isLoading"
            alt="spinning roulette wheel as a loading indicator"
            class="spinner"
            src="/full-roulette.svg"
        />
        <div v-if="hasLoadingMessages" class="loading-messages">
          <p v-for="(message, key) in loadingMessages" :key="key">{{ message }}</p>
        </div>
      </div>
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
      loadingMessages: 'loading/loadingMessages',
    }),
    hasLoadingMessages() {
      return Object.keys(this.loadingMessages).length > 0;
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/core/animation/variables' as animation;
@use '@/assets/core/color/variables' as color;
@use '@/assets/core/typography/variables' as typography;

.loading-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(color.$dark, 0.8);

  .loading-inner-container {
    position: fixed;
    top: 50%;
    left: 10%;
    right: 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    perspective: 100px;

    .spinner {
      border: solid 0.3em rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
      opacity: 0.8;
      transform: rotateX(30deg);
      animation: spin 3s linear infinite;
    }

    .loading-messages {
      margin-top: 8px;
      padding: 8px;
      border-radius: 8px;
      text-align: center;
      font-size: var(--typography-font-size-small);
      color: color.$mutedLight;
    }
  }

  @keyframes spin {
    0% {
      transform: rotateX(30deg) rotateZ(0deg);
    }
    100% {
      transform: rotateX(30deg) rotateZ(360deg);
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
