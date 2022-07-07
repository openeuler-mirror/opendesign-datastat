<script lang="ts" setup>
import { watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: '#002FA7',
  },
});
const totalPage = ref(0);
watch(
  () => props.total,
  (total) => {
    totalPage.value = Math.ceil(total / props.pageSize);
    changePage(1);
  }
);
const emit = defineEmits(['currentChange']);
const changePage = (num: number) => {
  emit('currentChange', num);
};
const clickPrevPage = () => {
  if (props.currentPage > 1) {
    changePage(props.currentPage - 1);
  }
};
const clickNextPage = () => {
  if (props.currentPage < totalPage.value) {
    changePage(props.currentPage + 1);
  }
};
</script>

<template>
  <div class="o-pagination">
    <div
      class="prev"
      :class="{ disable: currentPage < 2 }"
      @click="clickPrevPage"
    >
      {{ '<' + ' ' + t('prevPage') }}
    </div>
    <div class="page">
      <span :style="{ color }">
        {{ currentPage }}
      </span>
      /
      <span>
        {{ totalPage }}
      </span>
    </div>
    <div
      class="next"
      :class="{ disable: currentPage === totalPage }"
      @click="clickNextPage"
    >
      {{ t('nextPage') + ' ' + '>' }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.o-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 12px;
  color: #555555;
  .disable {
    color: #ddd;
  }
}
</style>
