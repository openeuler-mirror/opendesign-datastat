<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ODiagram from 'shared/components/ODiagram.vue';
import OViewonpc from 'shared/components/OViewonpc.vue';
import { queryCompanySigs } from 'shared/api';
import { IObject } from 'shared/@types/interface';
import { useCommonStore } from '@/stores/common';

const { t } = useI18n();
const useCommon = useCommonStore();
const diagramData = ref({
  name: 'flare',
  children: [
    {
      name: 'sig',
      children: [
        {
          name: '',
          key: '',
          imports: [],
        },
      ],
    },
    {
      name: 'company',
      children: [
        {
          name: '',
          key: '',
          imports: [],
        },
      ],
    },
  ],
});
const getList = () => {
  const query = {
    timeRange: 'lastoneyear',
    community: 'openeuler',
  };
  queryCompanySigs(query).then((data) => {
    const listData = data?.data || [];
    const sigArry = listData.reduce((pre: any, next: any) => {
      pre.push(...next.sigList);
      return pre;
    }, []);
    const sigsData = [...new Set(sigArry)];
    diagramData.value.children[0].children = sigsData.map((item: any) => {
      return {
        name: item,
        key: item,
        imports: [],
      };
    });
    diagramData.value.children[1].children = listData
      .filter((items: IObject) => items.sigList.length)
      .map((item: IObject) => {
        const imports = item.sigList.map((i: string) => `flare.sig.${i}`);
        return {
          name:
            useCommon.language === 'zh'
              ? item.company_cn
              : item.company_en === ''
              ? item.company_cn
              : item.company_en,
          key: item.company_cn,
          imports,
        };
      });
  });
};
getList();
</script>

<template>
  <div class="diagram-legend">
    <div class="point one-point"></div>
    <span>{{ t('company') }}</span>
    <div class="point two-point"></div>
    <span>{{ t('interestGroup') }}</span>
  </div>
  <div class="diagram">
    <o-diagram :data="diagramData"></o-diagram>
  </div>
  <o-viewonpc></o-viewonpc>
</template>
<style lang="scss" scoped>
.diagram-legend {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #555;
  .point {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .one-point {
    background-color: #002fa7;
  }
  .two-point {
    margin-left: 24px;
    background-color: #feb32a;
  }
}
.diagram {
  margin-top: 4rem;
}
</style>
