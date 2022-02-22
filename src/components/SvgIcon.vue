<template>
  <svg aria-hidden="true" class="icon-svg" :class="[size, name]">
    <use :xlink:href="symbolId"></use>
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#ffffff',
  },
  size: {
    validator(value) {
      return ['large', 'normal', 'small', ''].includes(value);
    },
    default: '',
  },
});

const symbolId = computed(() => {
  return `#${props.prefix}-${props.name}`;
});
</script>

<style lang="scss">
.icon-svg {
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: top;
  stroke: currentColor;
  fill: currentColor;
  outline: 0;

  &.large {
    font-size: 32px;
  }

  &.normal {
    font-size: 24px;
    transform: translate(0);
  }

  &.small {
    font-size: 16px;
  }
}
</style>
