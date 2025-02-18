<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import { IObject } from 'shared/@types/interface';
import OAnchor from 'shared/components/OAnchor.vue';
import { onMounted, ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { sigsProcessing, processing } from 'shared/utils/helper';
import {
  queryCompanySigDetails,
  queryCompanyUsers,
  queryCompanySigs,
} from 'shared/api';
import OEchartCircularPile from 'shared/components/OEchartCircularPile.vue';
import OEchartTreemap from 'shared/components/OEchartTreemap.vue';
import TheForm from '@/components/TheForm.vue';
import TheProgress from '@/components/TheProgress.vue';
import { useStaffStore } from '@/stores/staff';
import OFormRadio from '@/components/OFormRadio.vue';
import { Search } from '@element-plus/icons-vue';
import IconUser from '~icons/app/search';
import OIcon from 'shared/components/OIcon.vue';
import { useRouter } from 'vue-router';
import ONoDataImage from 'shared/components/ONoDataImage.vue';
import { ElScrollbar } from 'element-plus';
import TableList from './TableList.vue';
import DataShow from './DataShow.vue';
const router = useRouter();
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
const sigsData = ref({} as IObject);
const treeData = ref({} as IObject);
const oechartData = ref({
  D0: 0,
  D1: 0,
  D2: 0,
});
const oechartTreeValue = ref([] as IObject[]);
const oechartTreeGroup = ref([] as IObject[]);
oechartTreeGroup.value = [];
const oechartSecondTreeValue = ref([] as IObject[]);
const sumPrMerged = ref(0);
const getoechartTreeValue = () => {
  const query = {
    company: sencondTitleValue.value,
    timeRange: 'all',
    community: 'openeuler',
  };
  queryCompanyUsers(query).then((data) => {
    const Data = processing(data?.data || []);
    oechartData.value.D0 = Data.sigData['0'];
    oechartData.value.D1 = Data.sigData['1'];
    oechartData.value.D2 = Data.sigData['2'];
  });
};
const param = ref({
  company: computed(() => sencondTitleValue.value),
  timeRange: 'all',
  community: 'openeuler',
});
const getTreeSearchValue = () => {
  queryCompanySigDetails(param.value).then((data) => {
    const firstTree: any = [];
    const secondTree: any = [];
    treeData.value = data?.data;
    treeData.value.forEach((item: any) => {
      if (item.feature !== 'null') {
        firstTree.push({
          key: '',
          label: item.sig,
          value: item.user,
          group: item.feature,
        });

        secondTree.push({
          key: '',
          label: item.sig,
          value: item.contribute,
          group: item.feature,
        });
      }
    });
    oechartTreeValue.value = firstTree;
    oechartSecondTreeValue.value = secondTree;
    sumPrMerged.value = secondTree.reduce(
      (pre: any, next: any) => pre + next.value,
      0
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
        } else if (next.group !== '' && next.group) {
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
const drownData = ref([] as IObject[]);
const getDrownData = () => {
  drownData.value = allcompany.value.map((item: IObject) => {
    const key = useCommon.language === 'zh' ? 'company_cn' : 'company_en';
    return {
      value: item.company_cn,
      label: item[key],
    };
  });
  reallData.value = drownData.value.sort((a, b) =>
    a.value.localeCompare(b.value)
  );
};
const getSigsData = () => {
  const query = {
    company: sencondTitleValue.value,
    timeRange: 'all',
    community: 'openeuler',
  };
  queryCompanySigDetails(query).then((data) => {
    sigsData.value = sigsProcessing(data?.data || []);
  });
};
const clickDrownItem = (item: IObject) => {
  sencondTitle.value = item.label;
  sencondTitleValue.value = item.label;
  getallData();
};

watch(
  () => useCommon.language,
  () => {
    getSencondTitle(sencondTitle.value);
  }
);
const getallData = () => {
  getDrownData();
  // getSigsData();
  getoechartTreeValue();
  getContributeInfo();
  getTreeSearchValue();
  clean();
};
onMounted(() => {
  getSencondTitle();
  loading.value = false;
});

const lastformOption = computed(() => {
  return [
    {
      label: t('from.type'),
      id: 'contributeType',
      active: 'pr',
      list: [
        { label: t('home.prs'), value: 'pr' },
        { label: t('home.issues'), value: 'issue' },
        { label: t('home.comments'), value: 'comment' },
      ],
    },
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
const componentName = 'staff';
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
      typeLable.value = 'home.prs';
      break;
    case 'issue':
      typeLable.value = 'home.issues';
      break;
    case 'comment':
      typeLable.value = 'home.comments';
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
// 总数据
const tableData = computed(() =>
  useStaff.tableData.map((item: any, index: any) => ({
    ...item,
    rank: index + 1,
  }))
);
// 默认显示第1页
const currentPage = ref(1);
// 显示第几页
const handleCurrentChange = (val: any) => {
  // 改变默认的页数
  if (!val?.isTrusted) {
    currentPage.value = val;
  }
};
const anchorData = ['ecological', 'SIGContribution', 'staffContributor'];

// 搜索过滤
const searchInput = ref('');
const reallData = ref([] as IObject[]);

const querySearch = () => {
  if (searchInput.value !== '') {
    const newList = drownData.value.filter((item: any) =>
      item.label.toLowerCase().includes(searchInput.value)
    );
    reallData.value = newList;
  } else {
    reallData.value = drownData.value;
  }
};
// 清除搜索
const clearSearchInput = () => {
  getDrownData();
  searchInput.value = '';
};
const clean = () => {
  searchInput.value = '';
};
// 贡献表搜索
const reallListData = ref([] as IObject[]);
const searchListInput = ref('');
const filterReallData = () => {
  const box = contributionSelectBox.value.filter((item) => {
    if (item.isSelected) {
      return item;
    }
  });
  if (box.length) {
    return (reallListData.value = reallListData.value.filter((item) => {
      return box.some((it) => {
        if (it.key === 'TC') {
          return it.isSelected && item.is_TC_owner;
        } else {
          return it.isSelected && item.usertype === it.key;
        }
      });
    }));
  }
};
const queryListSearch = () => {
  if (searchListInput.value !== '') {
    const newList = tableData.value.filter((item: any) =>
      item.gitee_id.toLowerCase().includes(searchListInput.value)
    );
    reallListData.value = newList;
    filterReallData();
  } else {
    reallListData.value = tableData.value;
    filterReallData();
  }
};
const clearListSearchInput = () => {
  reallListData.value = tableData.value;
  searchListInput.value = '';
};
watch(
  () => tableData.value,
  () => {
    reallListData.value = tableData.value;
    currentPage.value = 1;
  }
);
const goToHome = () => {
  router.push(`/${useCommon.language}/detail`);
};
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const inputSlider = (value: number) => {
  scrollbarRef.value?.setScrollTop(value);
};
const showDropdown = (e: any) => {
  if (e) {
    let number = 0;
    reallData.value.forEach((item: any, index) => {
      if (item.label === sencondTitle.value) {
        number = index;
      }
    });
    inputSlider(number * 32);
  }
};
// 跳转个人详情
const goToUser = (data: IObject) => {
  const routeData: any = router.resolve({
    path: `/${useCommon.language}/user/${data}`,
  });
  window.open(routeData.href, '_blank');
};

// 新增员工筛选
const contributionSelectBox = ref([
  {
    color: 'linear-gradient(45deg, #b461f6 0%, #7d32ea 100%)',
    isSelected: false,
    label: 'Committee',
    key: 'TC',
    name: 'TC',
  },
  {
    color: 'linear-gradient(45deg, #005cd3 0%, #002fa7 100%)',
    isSelected: false,
    label: 'SIG Maintainer',
    key: 'maintainers',
    name: 'Maintainer',
  },
  {
    color: 'linear-gradient(225deg, #feb32a 0%, #f6d365 100%)',
    isSelected: false,
    label: 'SIG Committer',
    key: 'committers',
    name: 'Committer',
  },
]);

// 按颜色过滤
const getcontributeValue = (item: any) => {
  item.isSelected = !item.isSelected;
  queryListSearch();
};
</script>
<template>
  <div class="container">
    <o-anchor top="11rem" :data="anchorData" :offset-value="400"></o-anchor>
    <div class="wrap">
      <div class="step">
        <span class="step-one" @click="goToHome()">{{
          t('nav.contributors')
        }}</span>
        <span> > {{ sencondTitle }}</span>
      </div>
      <div class="main">
        <div class="main-left">
          <div class="main-left-top">
            <div class="edropdown">
              <el-dropdown
                placement="bottom-start"
                @visible-change="showDropdown"
              >
                <div :title="sencondTitle" class="main-left-title">
                  {{ sencondTitle }}
                  <span class="btnc"></span>
                </div>

                <template #dropdown>
                  <div class="searchInput">
                    <el-input
                      v-model="searchInput"
                      clearable
                      :debounce="300"
                      class="w-50 m-2"
                      placeholder="请输入单位名称搜索"
                      :prefix-icon="Search"
                      @input="querySearch"
                      @clear="clearSearchInput"
                    />
                  </div>

                  <el-scrollbar ref="scrollbarRef" height="400px">
                    <el-dropdown-item
                      v-for="item in reallData"
                      :key="item.value"
                      class="dropdownItem"
                      @click="clickDrownItem(item)"
                    >
                      {{ item.label }}</el-dropdown-item
                    >
                  </el-scrollbar>
                </template>
              </el-dropdown>
            </div>
          </div>

          <data-show :company="sencondTitle"></data-show>
          <div class="circularPile">
            <div class="circularPile-sp">
              {{ t('Contributordistribution') }}
            </div>
            <div
              v-if="
                oechartData.D0 === 0 &&
                oechartData.D1 === 0 &&
                oechartData.D2 === 0
              "
              class="nosp"
            >
              {{ t('noContributor') }}
            </div>
            <div v-else class="sp">
              <o-echart-circular-pile
                id="circularPile"
                :data="oechartData"
                width="232px"
                height="232px"
              ></o-echart-circular-pile>
            </div>
          </div>
        </div>
        <div class="main-right">
          <div class="Treemap">
            <h3 id="ecological" class="topstafftitle">
              {{ `${sencondTitle} ${t('ecological')}` }}
            </h3>
            <div class="theFirstForm">
              <o-form-radio
                :option="firstformOption"
                @get-contribute-info="getTreeContributeInfo($event)"
              >
              </o-form-radio>
            </div>
            <div class="color-box">
              <div
                v-for="item in oechartTreeGroup"
                :key="item.key"
                class="blue-box"
              >
                <div
                  class="box"
                  :style="{ 'background-color': item.color }"
                ></div>
                {{ item.label }}
              </div>
            </div>
            <div class="firstsmalltitle">{{ t('Numbercontributors') }}</div>
            <div v-if="treeData.length" class="firstTreemap">
              <o-echart-treemap
                id="firstTreemap"
                :value="(oechartTreeValue as any)"
                :group="(oechartTreeGroup as any)"
                :type="firstformOption[0].active"
              ></o-echart-treemap>
            </div>
            <div v-else><o-no-data-image></o-no-data-image></div>
            <div class="smalltitle">{{ t('Commitcontribution') }}</div>
            <div v-if="sumPrMerged !== 0" class="secondTreemap">
              <o-echart-treemap
                id="secondTreemap"
                :value="(oechartSecondTreeValue as any)"
                :group="(oechartTreeGroup as any)"
                :type="firstformOption[0].active"
              ></o-echart-treemap>
            </div>
            <div v-else><o-no-data-image></o-no-data-image></div>
          </div>
          <div class="contributors-panel">
            <h3 id="SIGContribution" class="sigContribution">
              {{ sencondTitle + ' ' + t('SIGContribution') }}
            </h3>

            <table-list :company="sencondTitle" />
          </div>
          <div class="lastcontributors-panel">
            <h3 id="staffContributor" class="stafftitle">
              {{ `${sencondTitle} ${t('staffContributor')}` }}
            </h3>
            <div class="theSecondForm">
              <the-form
                :option="lastformOption"
                :component-name="componentName"
                @get-contribute-info="getContributeInfo"
                ><template #searchInput>
                  <div class="searchListInput">
                    <el-input
                      v-model="searchListInput"
                      :trigger-on-focus="false"
                      clearable
                      :debounce="300"
                      size="large"
                      :placeholder="t('enterGitee')"
                      @change="queryListSearch"
                      @clear="clearListSearchInput"
                    >
                      <template #prefix>
                        <o-icon class="search-icon"
                          ><icon-user></icon-user
                        ></o-icon> </template
                    ></el-input>
                  </div> </template
              ></the-form>
            </div>
            <div class="edcolor-box">
              <div
                v-for="value in contributionSelectBox"
                :key="value.label"
                class="yellow-box"
                style="cursor: pointer"
                @click="getcontributeValue(value)"
              >
                <div
                  class="box"
                  :style="{
                    background: value.isSelected ? value.color : '#cccccc',
                  }"
                >
                  {{ value.name }}
                </div>
                <span
                  :style="{
                    color: value.isSelected ? '' : '#cccccc',
                  }"
                  >{{ t(value.label) }}</span
                >
              </div>
            </div>

            <div class="ranking-list">
              <div class="ranking-list-item">
                <p class="caption"></p>
                <el-table
                  v-loading="loading"
                  :data="
                    reallListData.slice(
                      (currentPage - 1) * 10,
                      currentPage * 10
                    )
                  "
                  style="width: 100%"
                >
                  <el-table-column
                    prop="rank"
                    align="center"
                    :label="t('Number')"
                    width="120"
                  />
                  <el-table-column
                    prop="gitee_id"
                    align="left"
                    label="Gitee ID"
                    show-overflow-tooltip
                    width="400"
                    ><template #default="scope">
                      <div class="usertype-box">
                        <span class="num"
                          ><span
                            :style="{
                              cursor: 'pointer',
                            }"
                            @click="goToUser(scope.row.gitee_id)"
                            >{{ scope.row.gitee_id }}</span
                          ><span v-if="scope.row.is_TC_owner" class="TCbox"
                            >TC</span
                          ><span
                            v-if="scope.row.usertype === 'committers'"
                            class="usertypecolorbox"
                            :style="({
                              '--color': '225deg, #FEB32A 0%, #F6D365 100%',
                            } as any)"
                            >Committer</span
                          ><span
                            v-if="scope.row.usertype === 'maintainers'"
                            class="usertypecolorbox"
                            :style="({
                              '--color': '45deg, #005CD3 0%, #002FA7 100%',
                            } as any)"
                            >Maintainer
                          </span>
                        </span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="left"
                    class-name="type-label"
                    :label="t(typeLable)"
                  >
                    <template #default="scope">
                      <div class="box">
                        <span class="num">{{ scope.row.contribute }}</span>

                        <the-progress
                          :item="scope.row.contribute"
                          :component-name="componentName"
                        ></the-progress>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="demo-pagination-block">
              <el-pagination
                v-show="reallListData.length > 10"
                class="o-pagination"
                :current-page="currentPage"
                :page-size="10"
                background
                layout="prev, pager, next,slot, jumper"
                :total="reallListData.length"
                @current-change="handleCurrentChange"
                ><span
                  >{{ currentPage }}/{{
                    Math.ceil(reallListData.length / 10)
                  }}</span
                ><span
                  class="el-pagination__jump"
                  style="cursor: pointer"
                  @click="handleCurrentChange"
                  >{{ t('Goto') }}</span
                >
              </el-pagination>
              <span
                v-if="reallListData.length > 10"
                class="el-pagination el-pagination__jump"
                >{{ t('page') }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <app-footer></app-footer>
    </footer>
  </div>
</template>
<style lang="scss" scoped>
@import '@/shared/styles/style.scss';
.container {
  margin-top: 80px;
  min-height: 900px;
  background-color: #f5f6f8;
}
.step {
  padding: 40px 0;
  font-size: 12px;
  &-one {
    color: #002fa7;
    cursor: pointer;
  }
  &-two {
    color: #555555;
  }
}
.main {
  display: grid;
  grid-template-columns: 28% 72%;
  &-left {
    padding-right: 24px;
  }
  &-left-title {
    font-size: 24px;
    font-family: HarmonyOS_Sans_SC_Medium;
    color: #002fa7;
    line-height: 32px;
    text-overflow: ellipsis;
    width: 350px;
    white-space: nowrap;
    overflow: hidden;
  }
  &-left-top {
    display: flex;
    position: relative;
    margin-bottom: 72px;
  }
}

.circularPile {
  margin-top: 60px;
  margin-bottom: 60px;
  &-sp {
    width: 280px;
    height: 24px;
    font-size: 16px;
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
.edropdown {
  position: absolute;
  right: 10px;
}
.firstTreemap {
  padding: 24px;
}
.secondTreemap {
  padding: 24px;
}
.contributors-panel {
  padding: 24px;
  background: #fff;
  margin-top: 60px;
  .title {
    font-size: 24px;
    color: #000;
    font-weight: normal;
    margin-bottom: 20px;
  }
}
.Treemap {
  background-color: #ffffff;
}
.theFirstForm {
  padding-left: 24px;
}
.theSecondForm {
  padding-left: 24px;
  padding-right: 24px;
}
.ranking-list {
  display: grid;
  grid-template-columns: 100%;
  padding-left: 24px;
  padding-right: 24px;
  .caption {
    font-size: 16px;
    color: #000;
    line-height: 24px;
    margin-bottom: 8px;
  }
  .box {
    display: flex;
    .num {
      width: 50px;
      text-align: right;
    }
  }
  .usertype-box {
    display: flex;
    align-items: left;
    .num {
      text-align: left;
      display: flex;
      align-items: center;
      color: #002fa7;
      .TCbox {
        display: inline-block;
        width: 32px;
        height: 22px;
        background: linear-gradient(45deg, #b461f6 0%, #7d32ea 100%);
        border-radius: 2px;
        font-size: 10px;
        font-family: HarmonyOS_Sans_SC;
        color: #ffffff;
        line-height: 12px;
        margin-left: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
.stafftitle {
  padding-left: 24px;
  padding-top: 24px;
  margin-bottom: 22px;
  margin-top: 22px;
  font-size: 16px;
  font-family: HarmonyOS_Sans_SC;
  color: #000000;
  line-height: 24px;
}
.sigContribution {
  font-size: 16px;
  font-family: HarmonyOS_Sans_SC;
  color: #000000;
  line-height: 24px;
  margin-bottom: 22px;
}
.topstafftitle {
  padding: 24px;
  font-size: 16px;
  font-family: HarmonyOS_Sans_SC;
  color: #000000;
  line-height: 24px;
}
.smalltitle {
  margin-bottom: 8px;
  margin-top: 8px;
  margin-left: 24px;
  width: 280px;
  font-size: 16px;
  font-family: HarmonyOS_Sans_SC;
  color: #000000;
  line-height: 24px;
}
.color-box {
  display: inline-block;
  margin-left: 24px;
  padding-bottom: 16px;
  padding-top: 19px;
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
.edcolor-box {
  display: flex;
  margin-left: 24px;
  padding-bottom: 20px;
  .yellow-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      // width: 73px;
      padding: 0 8px;
      height: 22px;
      background: linear-gradient(45deg, #005cd3 0%, #002fa7 100%);
      border-radius: 2px;
      font-size: 10px;
      font-family: HarmonyOS_Sans_SC;
      color: #ffffff;
      line-height: 12px;
      text-align: center;
      margin-right: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.demo-pagination-block {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.usertypecolorbox {
  margin-left: 5px;
  background: linear-gradient(var(--color));
  border-radius: 2px;
  font-size: 10px;
  font-family: HarmonyOS_Sans_SC;
  color: #ffffff;
  line-height: 12px;
  height: 16px;
  width: 73px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.searchInput {
  width: 350px;
  margin: 10px;
  .search-icon {
    font-size: 20px;
  }
  :deep(.el-autocomplete) {
    width: 100%;
    &.active .el-input__inner {
      box-shadow: 0 0 0 1px #002fa7 inset;
    }
  }
  :deep(.el-input__prefix) {
    left: 12px;
    align-items: center;
  }
  @media screen and (min-width: 900px) {
    :deep(.el-input__inner) {
      padding-left: 40px;
    }
  }
  @media screen and (max-width: 900px) {
    :deep(.el-input__prefix) {
      left: 10px;
    }
  }
  :deep(.el-input__inner:focus) {
    box-shadow: 0 0 0 1px #002fa7 inset;
  }
}
.searchListInput {
  width: 88%;
  margin-left: 86px;
  margin-top: -16px;
  margin-bottom: 20px;

  .search-icon {
    font-size: 20px;
  }
  :deep(.el-autocomplete) {
    width: 100%;
    &.active .el-input__inner {
      box-shadow: 0 0 0 1px #002fa7 inset;
    }
  }
  :deep(.el-input__prefix) {
    left: 12px;
    align-items: center;
  }
  @media screen and (min-width: 900px) {
    :deep(.el-input__inner) {
      padding-left: 40px;
    }
  }
  @media screen and (max-width: 900px) {
    :deep(.el-input__prefix) {
      left: 10px;
    }
  }
  :deep(.el-input__inner:focus) {
    box-shadow: 0 0 0 1px #002fa7 inset;
  }
  :deep(.el-input__inner) {
    height: 56px;
  }
}
.btnc {
  background-image: url('@/assets/down.png');
  width: 24px;
  height: 24px;
  position: absolute;
  right: -15px;
}
.lastcontributors-panel {
  padding-bottom: 24px;
  background: #fff;
  margin-top: 60px;
  .title {
    font-size: 24px;
    color: #000;
    font-weight: normal;
    margin-bottom: 20px;
  }
}
.firstsmalltitle {
  margin-left: 24px;
  width: 280px;
  font-size: 16px;
  font-family: HarmonyOS_Sans_SC;
  color: #000000;
  line-height: 24px;
}
.dropdownItem {
  color: #b461f6;
}
</style>
<style lang="scss">
.o-pagination {
  --o-pagination-font-color: #000000;
  --o-pagination-font-color_active: #002fa7;
  --o-pagination-bg-color: #e5e5e5;
  --o-pagination-bg-color_hover: var(--o-color-brand5);
  --o-pagination-bg-color_selected: var(--o-color-brand5);
  --o-pagination-number-border-color_active: var(--o-color-brand1);

  &.el-pagination {
    justify-content: center;
    @media screen and (max-width: 768px) {
      display: none;
    }
    padding: 2px 0px;
    .el-pagination__sizes {
      margin: 0 0 0 0;
    }
    .el-input {
      --el-input-bg-color: var(--o-pagination-bg-color);
      --el-input-text-color: var(--o-pagination-font-color);
    }
    .el-input__wrapper {
      border-radius: 0px;
      box-shadow: none;
      height: 36px;
    }
    .el-pagination__editor {
      justify-content: center !important;
      margin: 0 8px !important;
      min-width: 56px !important;
    }
    .el-select {
      --el-select-border-color-hover: none;
      --el-select-input-focus-border-color: none;
      & .el-input .el-select__caret {
        color: var(--o-pagination-font-color);
      }
    }
    .el-select-dropdown__wrap {
      background-color: #000 !important;
    }
    .el-pager li {
      color: var(--o-pagination-font-color);
      background: var(--o-pagination-bg-color);
      border-radius: 0px;
      line-height: 36px;
      height: 36px;
      width: 36px;
      &:hover {
        color: #ffffff !important;
        background-color: var(--o-pagination-font-color_active);
      }
    }
    .el-pager li.is-active.number {
      background: var(--o-pagination-font-color_active);
      color: #ffffff !important;
      font-weight: 400;
      font-size: 14px;
    }
    .btn-next,
    .btn-prev {
      width: 36px;
      height: 36px;
      color: var(--o-pagination-font-color);
      border-radius: 0px;
      background: var(--o-pagination-bg-color);
    }
    .btn-prev:disabled {
      background: #e5e5e5;
    }
    .btn-next {
      margin-right: 16px !important;
    }
    .btn-next:disabled {
      background: #e5e5e5;
    }

    .el-pagination__jump {
      height: 36px;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #999999;
      border-radius: 0px;
      margin-left: 6px;
      .el-input__wrapper {
        flex-grow: 0.273;
      }
    }
  }
}
</style>
