<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  // 产生滚动条的盒子ID， 默认为body
  id: {
    type: String,
    default: '',
  },
  data: {
    type: Array as () => string[],
    required: true,
    default: () => ['companyContributor', 'userContributor'],
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
const { t } = useI18n();
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
    const top = document.getElementById(item)?.offsetTop || 0;
    return {
      id: item,
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
};
const selectId = ref('');
selectId.value = props.data.slice(0, 1).shift() || '';
const selectAnchor = (id: string) => {
  const doc = document.getElementById(id);
  doc?.scrollIntoView();
  setTimeout(() => {
    selectId.value = id;
  }, 20);
};
const scrollToTop = () => {
  const body = document.getElementById(props.id) || document.documentElement;
  body.scrollTop = 0;
};
const btnInfo = () => {
  window.open(
    'https://gitee.com/opengauss/infra/issues/new?issue%5Bassignee id%5D=0&issue%5Bmilestone id%5D=0',
    '_blank'
  );
};
</script>
<template>
  <div class="md-anchor" :style="{ top }">
    <div
      v-for="(item, index) in data"
      :key="index"
      :href="`#${item}`"
      class="anchor-link"
      :class="{ 'active-link': item === selectId }"
    >
      <div class="anchor-link-inner" @click="selectAnchor(item)">
        {{ t(item) }}
      </div>
    </div>
  </div>
  <div class="box">
    <div class="box-show" @click="btnInfo">
      <div class="title"><sapn>意反</sapn><sapn>见馈</sapn></div>
    </div>
  </div>
  <div class="box-down">
    <div class="box-show" @click="scrollToTop">
      <div class="title"><sapn>回顶</sapn><sapn>到部</sapn></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.box {
  height: 48px;
  width: 48px;
  background: #ffffff;
  box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
  margin-top: 400px;
  background-image: url('../../gauss/src/assets/edit.png');
  background-repeat: no-repeat;
  background-position: 50%;
  position: fixed;
  bottom: calc(20% + 52px);
  right: 150px;
  z-index: 99;
  @media screen and (max-width: 1700px) {
    right: 10px;
    z-index: 99;
    bottom: calc(30% + 52px);
  }
  .box-show {
    display: none;
    width: 48px;
    height: 48px;
    color: #fff;
    background: #7d32ea;
    line-height: 18px;
    cursor: pointer;
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    padding-top: 6px;
    .title {
      display: flex;
      width: 24px;
      height: 36px;
      margin: auto;
    }
  }
  &:hover .box-show {
    display: block;
  }
}
.box-down {
  height: 48px;
  width: 48px;
  background: #ffffff;
  box-shadow: 0px 1px 5px 0px rgba(45, 47, 51, 0.1);
  margin-top: 4px;
  background-image: url('../../gauss/src/assets/download.png');
  background-repeat: no-repeat;
  background-position: 50%;
  position: fixed;
  right: 150px;
  z-index: 99;
  bottom: calc(20%);
  @media screen and (max-width: 1700px) {
    right: 10px;
    z-index: 99;
    bottom: calc(30%);
  }
  .box-show {
    display: none;
    width: 48px;
    height: 48px;
    color: #fff;
    background: #7d32ea;
    line-height: 18px;
    cursor: pointer;
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    padding-top: 6px;
    .title {
      display: flex;
      width: 24px;
      height: 36px;
      margin: auto;
    }
  }
  &:hover .box-show {
    display: block;
  }
}
.md-anchor {
  position: fixed;
  right: 20px;
  max-width: 200px;
  z-index: 99;
  @media screen and (max-width: 1700px) {
    display: none;
  }
}
.anchor-link {
  display: block;
  cursor: pointer;
  color: #707070;
  line-height: 22px;
  font-size: 14px;
  border-left: 2px solid rgba(229, 229, 229, 1);
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  &:hover {
    color: #7d32ea;
  }
  &-inner {
    padding: 8px 16px;
  }
}
.active-link {
  color: #7d32ea;
  border-left: 2px solid #7d32ea;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}
</style>
