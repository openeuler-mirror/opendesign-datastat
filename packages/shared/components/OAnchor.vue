<script setup lang="ts">
import OIcon from './OIcon.vue';
import scrollTop from '~icons/app/scroll-top';
import { onMounted, onUnmounted, ref } from 'vue';
interface PreData {
  // 跳转关联元素的id
  id: string;
  label: string;
}
const props = defineProps({
  // 产生滚动条的盒子ID， 默认为body
  id: {
    type: String,
    default: '',
  },
  data: {
    type: Array as () => PreData[],
    required: true,
    default: () => [
      {
        id: 'companyContributor',
        label: '单位会员贡献',
      },
      {
        id: 'userContributor',
        label: '个人会员贡献',
      },
    ],
  },
  // 元素距离盒子顶部的校准值
  offsetValue: {
    type: Number,
    default: 200,
  },
  top: {
    type: String,
    default: '16rem',
  },
  right: {
    type: String,
    default: '40px',
  },
});
onMounted(() => {
  const body = props.id ? document.getElementById(props.id) : window;
  body?.addEventListener('scroll', scroll);
});

onUnmounted(() => {
  const body = props.id ? document.getElementById(props.id) : window;
  body?.removeEventListener('scroll', scroll);
});

const scroll = () => {
  const body = document.getElementById(props.id);
  const scrollTop =
    body?.scrollTop ||
    document.documentElement.scrollTop ||
    document.body.scrollTop;
  const clientHeight =
    body?.clientHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  const offsetTop = props.data.map((item) => {
    const top = document.getElementById(item.id)?.offsetTop || 0;
    return {
      id: item.id,
      top,
    };
  });
  offsetTop.sort((a, b) => b.top - a.top);
  selectId.value = offsetTop.reduce((pre, next, index) => {
    if (scrollTop + clientHeight > next.top + props.offsetValue && !pre) {
      pre = next.id;
    }
    // 如果最终没赋值，则取最后一个值（最上面的值）
    if (index === offsetTop.length - 1 && !pre) {
      pre = next.id;
    }
    return pre;
  }, '');
  console.log(scrollTop, clientHeight, selectId.value);
};
let selectId = ref('companyContributor');
const selectAnchor = (id: string) => {
  const doc = document.getElementById(id);
  doc?.scrollIntoView();
  selectId.value = id;
};
const scrollToTop = () => {
  const body = document.getElementById(props.id) || document.documentElement;
  body.scrollTop = 0;
};
</script>
<template>
  <div class="anchor" :style="{ top, right }">
    <o-icon class="icon" @click="scrollToTop"><scroll-top></scroll-top></o-icon>
    <div
      v-for="(item, index) in data"
      :key="item.id"
      class="line"
      :class="index ? '' : 'first-line'"
    >
      <div class="item">
        <div
          class="circle"
          :class="item.id === selectId ? 'selected-circle' : ''"
        ></div>
        <a class="label" @click="selectAnchor(item.id)">{{ item.label }}</a>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.anchor {
  position: fixed;
  width: 200px;
  .icon {
    font-size: 34px;
    cursor: pointer;
  }
  .line {
    border-left: 2px solid #bfbfbf;
    margin-left: 16px;
    position: relative;
    height: 48px;
    .item {
      position: absolute;
      bottom: -3px;
      left: -7px;
      .circle {
        width: 12px;
        height: 12px;
        border: 2px solid #bfbfbf;
        border-radius: 50%;
        display: inline-block;
        background-color: #ffffff;
      }
      .selected-circle {
        border-color: #002fa7;
      }
      .label {
        font-size: 16px;
        color: #000;
        margin-left: 8px;
        cursor: pointer;
      }
    }
  }
  .first-line {
    height: 30px;
  }
}
</style>
