<template>
    <svg class="progress-bar" :width="size" :height="size" viewBox="0 0 100 100">
      <circle class="progress-background" :r="radius" cx="50" cy="50" />
      <circle class="progress-foreground" :r="radius" cx="50" cy="50" :style="progressStyle" />
      <text class="progress-text" x="50" y="50">{{ progressText }}</text>
    </svg>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  
  export default defineComponent({
    name: 'CircleProgressBar',
    props: {
      total: {
        type: Number,
        required: true,
      },
      current: {
        type: Number,
        required: true,
      },
      size: {
        type: Number,
        default: 120,
      },
    },
    computed: {
      progress(): number {
        return Math.min(Math.max(this.current / this.total, 0), 1);
      },
      radius(): number {
        return 45;
      },
      circumference(): number {
        return this.radius * 2 * Math.PI;
      },
      progressStyle(): Record<string, string> {
        const progress = this.progress * this.circumference;
        return {
          strokeDasharray: `${progress} ${this.circumference}`,
        };
      },
      progressText(): string {
        const progress = Math.round(this.progress * 100);
        return `${this.current + '/' + this.total}`;//`${progress}%`
        
      },
    },
  });
  </script>
  
  <style>
  .progress-bar {
    margin-bottom: 1%;
    display: inline-block;
  }
  
  .progress-background {
    fill: none;
    stroke: #ccc;
    stroke-width: 10;
  }
  
  .progress-foreground {
    fill: none;
    stroke: #1d9114;
    stroke-width: 10;
    stroke-linecap: round;
    stroke-dasharray: 0 1000;
    transform: rotate(-90deg);
    transform-origin: center;
    transition: stroke-dasharray 0.5s ease-out;
  }
  
  .progress-text {
    fill: #333;
    font-size: 100%;
    text-anchor: middle;
    dominant-baseline: middle;
    font-weight: bold;
  }
  </style>
  