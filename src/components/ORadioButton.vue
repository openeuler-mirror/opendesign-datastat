<script setup>
import { toRefs, ref } from 'vue';

const props = defineProps({
  radioItem: {
    type: Array,
    default() {
      return null;
    },
  },
  radioActive: {
    type: String,
    default() {
      return '';
    },
  },
});
const emit = defineEmits(['radio-click']);
const { radioActive, radioItem } = toRefs(props);
const activeItem = ref(radioActive.value);

// 选中事件
const radioButtonChange = (item) => {
  if (item != radioActive.value) {
    activeItem.value = item;
    emit('radio-click', item);
  }
};
</script>

<template>
  <div ref="radiogroup" class="radio-group">
    <label
      v-for="item in radioItem"
      :key="item.id"
      class="radio-button"
      :class="item.label == activeItem ? 'active' : ''"
      @click="radioButtonChange(item.label)"
      ><span class="inner">{{ item.label }}</span></label
    >
  </div>
</template>

<style lang="scss" scoped>
:root {
  --color-primary: #409eff;
}
.radio-group {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0;
  .radio-button {
    position: relative;
    display: inline-block;
    outline: none;
    .inner {
      text-align: center;
      box-sizing: border-box;
      outline: none;
      margin: 0;
      position: relative;
      cursor: pointer;
      user-select: none;
      padding: 8px 15px;
      font-size: 14px;
      display: inline-block;
      border: 1px solid #dcdfe6;
      border-left: 0;
    }
    .radio-input {
      opacity: 0;
      outline: none;
      position: absolute;
      z-index: -1;
    }
    &:first-child .inner {
      border-radius: 4px 0 0 4px;
      border-left: 1px solid #dcdfe6;
    }
    &:last-child .inner {
      border-radius: 0 4px 4px 0;
    }
    &.active .inner {
      color: #fff;
      background-color: var(--color-primary);
      border-color: var(--color-primary);
    }
  }
}
</style>
