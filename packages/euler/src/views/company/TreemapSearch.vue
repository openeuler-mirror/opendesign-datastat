<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useEcologicalStore } from '@/stores/ecological';
import TheForm from '@/components/TheForm.vue';
const { t } = useI18n();
const useEcological = useEcologicalStore();
// 组织贡献from
const componentName = 'ecological';
const formOption = computed(() => {
  return [
    {
      label: t('from.timeRange'),
      id: 'timeRange',
      active: 'mother',
      list: [
        { label: t('from.lastonemonth'), value: 'lastonemonth' },
        { label: t('from.lasthalfyear'), value: 'lasthalfyear' },
        { label: t('from.lastoneyear'), value: 'lastoneyear' },
        { label: t('from.all'), value: 'all' },
      ],
    },
  ];
});
const getContributeInfo = () => {
  useEcological.getEcologicalData();
};
</script>

<template>
  <div class="contributions-statistical">
    <the-form
      :option="formOption"
      :component-name="componentName"
      @get-contribute-info="getContributeInfo"
    />
  </div>
</template>
<style lang="scss" scoped></style>
