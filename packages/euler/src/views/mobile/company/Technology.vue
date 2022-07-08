<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import { IObject } from 'shared/@types/interface';
import { onMounted, ref, watch, computed, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { treeProcessing } from 'shared/utils/helper';
import { queryCompanySigDetails, queryCompanySigs } from 'shared/api';
import OEchartTreemap from 'shared/components/OEchartTreemap.vue';
import { useStaffStore } from '@/stores/staff';
import ONoDataImage from 'shared/components/ONoDataImage.vue';
import MobileOFormRadio from '../sig/MobileOFormRadio.vue';
const useStaff = useStaffStore();
const useCommon = useCommonStore();
const route = useRoute();
const sencondTitle = ref('');
const sencondTitleValue = ref('');
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
const treeData = ref({} as IObject);
const oechartTreeValue = ref([] as IObject[]);
const oechartTreeGroup = ref([] as IObject[]);
oechartTreeGroup.value = [];
const oechartSecondTreeValue = ref([] as IObject[]);
const sumPrMerged = ref(0);
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
});
const { title } = toRefs(props);
const param = ref({
  company: computed(() => title.value),
  timeRange: 'all',
  community: 'openeuler',
});
const getTreeSearchValue = () => {
  queryCompanySigDetails(param.value).then((data) => {
    treeData.value = treeProcessing(data?.data || []);
    const firstTree: any = [];
    const secondTree: any = [];
    treeData.value.sigs.map((item: IObject) => {
      if (item.group !== 'null') {
        firstTree.push({
          key: '',
          label: item.sig,
          value: item.D0,
          group: item.group,
        });

        secondTree.push({
          key: '',
          label: item.sig,
          value: item.PR_Merged,
          group: item.group,
        });
      }
    });
    oechartTreeValue.value = firstTree;
    oechartSecondTreeValue.value = secondTree;
    sumPrMerged.value = eval(
      secondTree.map((item: any) => (item.value += item.value)).join('+')
    );
    const colorArr = [
      '#002FA7',
      '#FEB32A',
      '#4AAEAD',
      '#FC756C',
      '#A4DAFF',
      '#6236FF',
      '#3165F3',
      '#00BB85',
      '#F9762D',
      '#7400A5',
      '#1B7FCA',
      '#00685A',
      '#AC481C',
    ];
    oechartTreeGroup.value = oechartTreeValue.value
      .reduce((pre, next) => {
        const findone = pre.find((item: any) => item.group === next.group);
        if (findone) {
          findone.num += next.value;
        } else if (next.group !== '') {
          pre.push({
            group: next.group,
            num: next.value,
          });
        }
        return pre;
      }, [])
      .sort((a: any, b: any) => b.num - a.num)
      .map((item: any, index: any) => ({
        key: item.group,
        label: item.group,
        color: colorArr[index],
      }));
  });
};
watch(
  () => useCommon.language,
  () => {
    getSencondTitle(sencondTitle.value);
  }
);
const getallData = () => {
  getContributeInfo();
  getTreeSearchValue();
};

onMounted(() => {
  getSencondTitle();
  loading.value = false;
});

const firstformOption = computed(() => {
  return [
    {
      label: t('from.timeRange'),
      id: 'timeRange',
      active: 'all',
      list: [
        { label: t('from.lastonemonth'), value: 'lastonemonth' },
        { label: t('from.lasthalfyear'), value: 'lasthalfyear' },
        { label: t('from.lastoneyear'), value: 'lastoneyear' },
        { label: t('from.all'), value: 'all' },
      ],
    },
  ];
});
// theform组件调用
const loading = ref(true);
const getContributeInfo = () => {
  useStaff.getStaffData(sencondTitleValue.value);
};
// 树图变换
const getTreeContributeInfo = (e?: IObject) => {
  param.value.timeRange = e?.active;
  getTreeSearchValue();
};
const typeLable = ref('');
const switchType = () => {
  switch (useStaff.staffForm.contributeType) {
    case 'pr':
      typeLable.value = t('home.prs');
      break;
    case 'issue':
      typeLable.value = t('home.issues');
      break;
    case 'comment':
      typeLable.value = t('home.comments');
      break;
  }
};
switchType();
watch(
  () => useStaff.staffForm.contributeType,
  () => {
    switchType();
  }
);
watch(
  () => props.title,
  () => {
    getallData();
  },
  { deep: true }
);
</script>
<template>
  <div>
    <mobile-o-form-radio
      :option="firstformOption"
      @get-contribute-info="getTreeContributeInfo($event)"
    ></mobile-o-form-radio>
  </div>
  <div class="color-box">
    <div v-for="item in oechartTreeGroup" :key="item.key" class="blue-box">
      <div class="box" :style="{ 'background-color': item.color }"></div>
      {{ item.label }}
    </div>
  </div>
  <div class="firstsmalltitle">{{ t('Numbercontributors') }}</div>
  <div v-if="treeData.sigs?.length">
    <o-echart-treemap
      id="firstTreemap"
      :value="(oechartTreeValue as any)"
      :group="(oechartTreeGroup as any)"
      :type="firstformOption[0].active"
    ></o-echart-treemap>
  </div>
  <div v-else >
    <o-no-data-image></o-no-data-image>
  </div>
  <div class="smalltitle">{{ t('Commitcontribution') }}</div>
  <div v-if="sumPrMerged !== 0 && treeData.sigs?.length">
    <o-echart-treemap
      id="secondTreemap"
      :value="(oechartSecondTreeValue as any)"
      :group="(oechartTreeGroup as any)"
      :type="firstformOption[0].active"
    ></o-echart-treemap>
  </div>
  <div v-else>
    <o-no-data-image></o-no-data-image>
  </div>
</template>
<style lang="scss" scoped>
@import '../sig/styles/style.scss';
.container {
  margin-top: 40px;
  //   min-height: 900px;
  margin-left: -40px;
}

.firstTreemap {
  padding: 24px;
  width: 360px;
}
.secondTreemap {
  padding: 24px;
  width: 360px;
}
.theFirstForm {
  padding-left: 24px;
}
.smalltitle {
  margin-bottom: 8px;
  margin-top: 8px;

  width: 280px;
  font-size: 16px;
  font-family: HarmonyOS_Sans_SC;
  color: #000000;
  line-height: 24px;
}
.color-box {
  display: inline-block;
  padding-bottom: 16px;
  .blue-box {
    margin-right: 24px;
    height: 18px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #555555;
    line-height: 18px;
    display: inline-block;
    .box {
      width: 12px;
      height: 12px;
      background: #002fa7;
      margin-right: 8px;
      display: inline-block;
    }
  }
}
.firstsmalltitle {
  width: 280px;
  font-size: 16px;
  font-family: HarmonyOS_Sans_SC;
  color: #000000;
  line-height: 24px;
}
</style>
