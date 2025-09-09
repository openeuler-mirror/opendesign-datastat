<script setup lang="ts">
import SectionCard from '@/components/SectionCard.vue';
import { request } from 'shared/plugins/axios';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const list = ref<any[]>([]);
const { t } = useI18n();
const route = useRoute();

const querySigs = () => {
  request
    .get('/api-magic/sig/scoreAll', { params: { community: 'openubmc' } })
    .then((res) => res.data ?? {})
    .then((res) => {
      if (res.code === 1 && res.data) {
        list.value = res.data;
      } else {
        list.value = [];
      }
    });
};

onMounted(querySigs);
</script>

<template>
  <SectionCard>
    <template #header>{{ t('common.groupActive') }}</template>
    <div class="activeness">
      <p class="title">{{ t('common.active') }}</p>
      <p>0</p>
      <p class="bar"></p>
      <p>1</p>
    </div>

    <div class="sig-overview-content">
      <a
        class="item"
        v-for="item in list"
        :key="item.sig_name"
        :href="`/${route.params.lang}/sig/${item.sig_name}`"
        :style="{ background: `rgba(var(--o-ubmc-color), ${item.score.toFixed(2)})` }"
        target="_blank"
        rel="noopener noreferrer"
      >
        <p>
          {{ item.sig_name }}
        </p>
      </a>
    </div>
  </SectionCard>
</template>
<style lang="scss" scoped>
.activeness {
  display: flex;
  align-items: center;
  .title {
    margin-right: 16px;
  }
  p:not(.title):not(:last-child) {
    margin-right: 8px;
  }
  .bar {
    width: 100px;
    height: 8px;
    background: linear-gradient(90deg, rgba(var(--o-ubmc-color), 0.1) 0%, var(--o-color-primary1) 100%);
  }
}

.sig-overview-content {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  column-gap: 16px;
  row-gap: 16px;
  margin-top: 16px;

  .item {
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;

    p {
      color: #fff;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 150px;
    }
  }
}
</style>
