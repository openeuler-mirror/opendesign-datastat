<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import { IObject } from 'shared/@types/interface';
import { onMounted, ref, watch, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { sigsProcessing, processing } from 'shared/utils/helper';
import {
  queryCompanySigDetails,
  queryCompanyUserContribute,
  queryCompanyUsers,
  queryCompanySigs,
} from 'shared/api';
import OEchartCircularPile from 'shared/components/OEchartCircularPile.vue';
import DataShow from '@/views/company/DataShow.vue';
const useCommon = useCommonStore();
const route = useRoute();
const sencondTitle = ref('');
const sencondTitleValue = ref('');
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
});
const { title } = toRefs(props);
const { t } = useI18n();
const allcompany = ref([]);
const getSencondTitle = (value?: string) => {
  const query = {
    timeRange: 'lastoneyear',
    community: 'openeuler',
  };
  queryCompanySigs(query).then((data) => {
    allcompany.value = data?.data || [];
    allcompany.value.sort((a: any, b: any) =>
      a.company_cn.localeCompare(b.company_cn)
    );
    const name = value || route.params.name;
    const findOne: IObject =
      allcompany.value.find(
        (item: IObject) => item.company_cn === name || item.company_en === name
      ) || allcompany.value[0];
    const key = useCommon.language === 'zh' ? 'company_cn' : 'company_en';
    sencondTitle.value = (findOne && findOne[key]) || name;
    sencondTitleValue.value = findOne.company_cn || name;
    getallData();
  });
};

const sigsData = ref({} as IObject);
const mergeRequest = ref(0);
const issueData = ref(0);
const comment = ref(0);
const contributors = ref(0);
const oechartData = ref({
  D0: 0,
  D1: 0,
  D2: 0,
});
const oechartTreeGroup = ref([] as IObject[]);
oechartTreeGroup.value = [];
const getoechartTreeValue = () => {
  const query = {
    company: title.value,
    timeRange: 'all',
    community: 'openeuler',
  };
  queryCompanyUsers(query).then((data) => {
    const Data = processing(data?.data || []);
    contributors.value = Data.sigData['0'];
    oechartData.value.D0 = Data.sigData['0'];
    oechartData.value.D1 = Data.sigData['1'];
    oechartData.value.D2 = Data.sigData['2'];
  });
};
const getSigsData = () => {
  const query = {
    company: title.value,
    timeRange: 'all',
    community: 'openeuler',
  };
  queryCompanySigDetails(query).then((data) => {
    sigsData.value = sigsProcessing(data?.data || []);
  });
};
const getprlistData = () => {
  const query = {
    company: title.value,
    timeRange: 'all',
    community: 'openeuler',
    contributeType: 'pr',
  };
  queryCompanyUserContribute(query).then((data) => {
    const value = data?.data || [];
    mergeRequest.value = getItemListData(value, 'contribute');
  });
};

const getissuelistData = () => {
  const query = {
    company: title.value,
    timeRange: 'all',
    community: 'openeuler',
    contributeType: 'issue',
  };
  queryCompanyUserContribute(query).then((data) => {
    const value = data?.data || [];
    issueData.value = getItemListData(value, 'contribute');
  });
};

const getcommentlistData = () => {
  const query = {
    company: title.value,
    timeRange: 'all',
    community: 'openeuler',
    contributeType: 'comment',
  };
  queryCompanyUserContribute(query).then((data) => {
    const value = data?.data || [];
    comment.value = getItemListData(value, 'contribute');
  });
};

const getItemListData = (data: IObject[], template: string) => {
  return data.reduce((sum, e) => sum + Number(e[template]), 0);
};

watch(
  () => useCommon.language,
  () => {
    getSencondTitle(sencondTitle.value);
  }
);
const getallData = () => {
  getprlistData();
  getissuelistData();
  getcommentlistData();
  getSigsData();
  getoechartTreeValue();
};
watch(
  () => props.title,
  () => {
    getallData();
  },
  { deep: true }
);
onMounted(() => {
  getSencondTitle();
});
</script>
<template>
  <!-- <div class="left-first">
    <div class="left-first-child">
      <span>{{ t('Mergerequest') }} PR</span>
      <div class="left-first-child-data">
        {{ toThousands(mergeRequest) }}
      </div>
    </div>
    <div class="left-first-child">
      <span title="Needs & Problems Issue">{{ t('NeedsProblems') }} Issue</span>
      <div class="left-first-child-data">
        {{ toThousands(issueData) }}
      </div>
    </div>
    <div class="left-first-child">
      <span title="123">{{ t('review') }} Comment</span>
      <div class="left-first-child-data">
        {{ toThousands(comment) }}
      </div>
    </div>
    <div class="left-first-child">
      <span title="Number of contributors">{{ t('Numbercontributors') }}</span>
      <div class="left-first-child-data">
        {{ toThousands(contributors) }}
      </div>
    </div>
  </div> -->
  <data-show :company="title"></data-show>
  <div class="circularPile">
    <div class="circularPile-sp">
      {{ t('Contributordistribution') }}
    </div>
    <div
      v-if="
        oechartData.D0 === 0 && oechartData.D1 === 0 && oechartData.D2 === 0
      "
      class="nosp"
    >
      {{ t('noContributor') }}
    </div>
    <div v-else class="sp">
      <o-echart-circular-pile
        id="circularPile"
        :data="oechartData"
        width="200px"
        height="200px"
      ></o-echart-circular-pile>
    </div>
  </div>
</template>
<style lang="scss" scoped>
// @import '@/shared/styles/style.scss';
.left-first {
  width: 100%;
  height: 176px;
  display: flex;
  flex-wrap: wrap;
  &-child {
    text-align: center;
    width: 50%;
    height: 80px;
    font-size: 12px;
    font-family: HarmonyOS_Sans_SC;
    color: #4e5865;
    line-height: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    &-data {
      font-size: 24px;
      font-family: HarmonyOS_Sans_SC;
      color: #000000;
      line-height: 32px;
    }
  }
}
.left-second {
  width: 200px;
  font-size: 16px;
  font-family: HarmonyOS_Sans_SC;
  color: #000000;
  line-height: 24px;
  padding-top: 24px;
  padding-bottom: 24px;

  &-sp {
    width: 100px;
    height: 24px;
    font-size: 16px;
    font-weight: 600;
    font-family: HarmonyOS_Sans_SC;
    color: #000000;
    line-height: 24px;
  }
  &-nosp {
    width: 100px;
    height: 24px;
    font-size: 14px;
    margin-top: 8px;
    font-family: HarmonyOS_Sans_SC;
    color: #555555;
    line-height: 22px;
  }
  .atlas {
    width: 248px;
    margin-top: 8px;
    display: flex;
    flex-direction: column;

    &-sp {
      min-width: 80px;
      font-size: 12px;
      font-family: HarmonyOS_Sans_SC_Medium;
      color: #002fa7;
      line-height: 18px;
      margin-bottom: 4px;
      cursor: pointer;
    }
  }
}

.circularPile {
  margin-top: 1rem;
  margin-bottom: 1rem;
  &-sp {
    width: 280px;
    height: 24px;
    font-size: 16px;
    font-weight: 600;
    font-family: HarmonyOS_Sans_SC;
    color: #000000;
    line-height: 24px;
  }
  .nosp {
    margin-top: 8px;
    font-size: 14px;
    color: #555555;
    line-height: 22px;
  }
  .sp {
    margin-top: 16px;
  }
}
</style>
