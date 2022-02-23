<script setup>
import { toRefs } from 'vue';
import { formatNumber } from '../shared/utils';
import SvgIcon from './SvgIcon.vue';
const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    default: 0,
  },
});

const { icon, title, amount } = toRefs(props);
</script>

<template>
  <div class="icon-text">
    <div class="icon-text-left">
      <svg-icon :name="icon"></svg-icon>
    </div>
    <div class="icon-text-right">
      <p>{{ title }}</p>
      <p>{{ formatNumber(amount) }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.icon-text {
  display: flex;
  padding: 20px;
  border-radius: 10px;
  background-color: #161820;

  .icon-text-left {
    display: flex;
    align-items: center;
    font-size: 90px;
    height: 100%;
  }

  .icon-text-right {
    margin-left: 20px;
    display: grid;
    align-content: space-evenly;
    p {
      color: #fff;
      font-size: 36px;
    }

    & p:first-child {
      font-size: 14px;
      line-height: 24px;
    }
  }
}
</style>
