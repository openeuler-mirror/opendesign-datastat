<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import { IObject } from 'shared/@types/interface';
import OAnchor from 'shared/components/OAnchor.vue';
import { onMounted, ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { ArrowDown } from '@element-plus/icons-vue';
import {
  sigsProcessing,
  treeProcessing,
  processing,
} from 'shared/utils/helper';
import {
  queryCompanySigDetails,
  queryCompanyUserContribute,
  queryCompanyUsers,
  queryCompanyName,
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
const router = useRouter();
const useStaff = useStaffStore();
const useCommon = useCommonStore();
const route = useRoute();
const sencondTitle = ref('');
const sencondTitleValue = ref('');
const { t } = useI18n();
const allcompany = ref([]);
const getSencondTitle = (value?: string) => {
  const community = 'openeuler';
  queryCompanyName(community).then((data) => {
    allcompany.value = data?.data.openeuler || [];
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
const mergeRequest = ref(0);
const issueData = ref(0);
const comment = ref(0);
const contributors = ref(0);
const oechartData = ref({
  D0: 0,
  D1: 0,
  D2: 0,
});
const oechartTreeValue = ref([] as IObject[]);
const oechartTreeGroup = ref([] as IObject[]);
oechartTreeGroup.value = [];
const oechartSecondTreeValue = ref([] as IObject[]);
const getoechartTreeValue = () => {
  const query = {
    company: sencondTitleValue.value,
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
const param = ref({
  company: computed(() => sencondTitleValue.value),
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
const getprlistData = () => {
  const query = {
    company: sencondTitleValue.value,
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
    company: sencondTitleValue.value,
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
    company: sencondTitleValue.value,
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
  getprlistData();
  getissuelistData();
  getcommentlistData();
  getDrownData();
  getSigsData();
  getoechartTreeValue();
  getContributeInfo();
  getTreeSearchValue();
  clean();
};
onMounted(() => {
  getSencondTitle();
  useStaff.getStaffData(sencondTitleValue.value);
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
// 总数据
const tableData = computed(() => useStaff.tableData);
// 默认显示第1页
const currentPage = ref(1);
// 显示第几页
const handleCurrentChange = (val: number) => {
  // 改变默认的页数
  currentPage.value = val;
};
//  index修改
const indexMethod = (index: number) => {
  return (currentPage.value - 1) * 10 + index + 1;
};
const anchorData = ['ecological', 'staffContributor'];

// 搜索过滤
const searchInput = ref('');
const reallData = ref([] as IObject[]);

const querySearch = () => {
  if (searchInput.value !== '') {
    const newList = drownData.value.filter((item: any) =>
      item.label.toLowerCase().includes(searchInput.value)
    );
    reallData.value = newList;
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
const queryListSearch = () => {
  if (searchListInput.value !== '') {
    const newList = tableData.value.filter((item: any) =>
      item.gitee_id.toLowerCase().includes(searchListInput.value)
    );
    reallListData.value = newList;
  } else {
    reallListData.value = tableData.value;
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
  }
);
const goTo = (item: any) => {
  const routeData: any = router.resolve(`/${useCommon.language}/sig/${item}`);
  window.open(routeData.href, '_blank');
};
const goToHome = () => {
  router.push(`/${useCommon.language}/detail`);
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
              <el-dropdown placement="bottom-start">
                <div class="main-left-title">
                  <span :title="sencondTitle">{{ sencondTitle }}</span>
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

                  <el-scrollbar height="400px">
                    <el-dropdown-item
                      v-for="item in reallData"
                      :key="item.value"
                      @click="clickDrownItem(item)"
                    >
                      {{ item.label }}</el-dropdown-item
                    >
                  </el-scrollbar>
                </template>
              </el-dropdown>
            </div>
          </div>

          <div class="left-title">{{ t('Currentcontributionranking') }}</div>
          <div class="left-first">
            <div class="left-first-child">
              <span>{{ t('Mergerequest') }} PR</span>
              <div class="left-first-child-data">{{ mergeRequest }}</div>
            </div>
            <div class="left-first-child">
              <span title="Needs & Problems Issue"
                >{{ t('NeedsProblems') }} Issue</span
              >
              <div class="left-first-child-data">{{ issueData }}</div>
            </div>
            <div class="left-first-child">
              <span title="123">{{ t('review') }} Comment</span>
              <div class="left-first-child-data">{{ comment }}</div>
            </div>
            <div class="left-first-child">
              <span title="Number of contributors">{{
                t('Numbercontributors')
              }}</span>
              <div class="left-first-child-data">{{ contributors }}</div>
            </div>
          </div>

          <div class="circularPile">
            <div class="circularPile-sp">
              {{ t('Contributordistribution') }}
            </div>
            <o-echart-circular-pile
              id="circularPile"
              :data="oechartData"
            ></o-echart-circular-pile>
          </div>

          <div class="left-second">
            <span v-if="sigsData.sigs?.length === 0" class="left-second-sp"
              >暂未参与SIG</span
            >
            <span v-else class="left-second-sp"
              >{{ t('participation') }}SIG:</span
            >
            <div class="atlas">
              <span
                v-for="item in sigsData.sigs"
                :key="item.value"
                class="atlas-sp"
                @click="goTo(item)"
              >
                {{ item }}
              </span>
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
            <div v-if="treeData.sigs?.length" class="firstTreemap">
              <o-echart-treemap
                id="firstTreemap"
                :value="(oechartTreeValue as any)"
                :group="(oechartTreeGroup as any)"
              ></o-echart-treemap>
            </div>
            <div v-else class="noDataTreemap"></div>
            <div class="smalltitle">{{ t('Commitcontribution') }}</div>
            <div v-if="treeData.sigs?.length" class="secondTreemap">
              <o-echart-treemap
                id="secondTreemap"
                :value="(oechartSecondTreeValue as any)"
                :group="(oechartTreeGroup as any)"
              ></o-echart-treemap>
            </div>
            <div v-else class="noDataTreemap"></div>
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
                      placeholder="请输入Gitee ID搜索"
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
              <div class="blue-box">
                <div class="box">TC</div>
                {{ t('Committee') }}
              </div>
              <div class="yellow-box">
                <div class="box">Maintainer</div>
                SIG Maintainer
              </div>
              <div class="red-box">
                <div class="box">Committer</div>
                SIG Committer
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
                    type="index"
                    :index="indexMethod"
                    align="center"
                    :label="t('ranking')"
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
                          >{{ scope.row.gitee_id
                          }}<span v-if="scope.row.is_TC_owner" class="TCbox"
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
                    :label="typeLable"
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
                :current-page="currentPage"
                background
                :page-size="10"
                layout="total, prev, pager, next, jumper"
                :total="reallListData.length"
                @current-change="handleCurrentChange"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <footer>
    <app-footer></app-footer>
  </footer>
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
  &-left-title {
    font-size: 24px;
    font-family: HarmonyOS_Sans_SC_Medium;
    color: #002fa7;
    line-height: 32px;
    text-overflow: ellipsis;
    width: 380px;
    white-space: nowrap;
    overflow: hidden;
  }
  &-left-top {
    display: flex;
    position: relative;
  }
}
.left-first {
  width: 370px;
  height: 176px;
  display: flex;
  flex-wrap: wrap;
  &-child {
    text-align: center;
    width: 180px;
    height: 80px;
    font-size: 16px;
    font-family: HarmonyOS_Sans_SC;
    color: #4e5865;
    line-height: 24px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    &-data {
      font-size: 40px;
      font-family: HarmonyOS_Sans_SC;
      color: #000000;
      line-height: 48px;
    }
  }
}
.left-title {
  margin-bottom: 16px;
  margin-top: 24px;
  font-size: 16px;
  font-family: HarmonyOS_Sans_SC;
  color: #000000;
  line-height: 24px;
  padding-top: 24px;
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
    font-family: HarmonyOS_Sans_SC;
    color: #000000;
    line-height: 24px;
  }
  .atlas {
    width: 248px;
    margin-top: 16px;
    display: flex;
    flex-direction: column;

    &-sp {
      min-width: 80px;
      height: 22px;
      font-size: 16px;
      font-family: HarmonyOS_Sans_SC_Medium;
      color: #002fa7;
      line-height: 22px;
      margin-bottom: 8px;
      cursor: pointer;
    }
  }
}

.circularPile {
  margin-top: 60px;
  margin-bottom: 60px;
  &-sp {
    margin-bottom: 30px;
    width: 280px;
    height: 24px;
    font-size: 16px;
    font-family: HarmonyOS_Sans_SC;
    color: #000000;
    line-height: 24px;
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
  padding: 5px;
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
  // padding-top: 10px;
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
      width: 200px;
      text-align: left;
      display: flex;
      align-items: center;
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

  .blue-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 32px;
      height: 22px;
      background: linear-gradient(45deg, #b461f6 0%, #7d32ea 100%);
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
  .yellow-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 73px;
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
  .red-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 72px;
      height: 22px;
      background: linear-gradient(225deg, #feb32a 0%, #f6d365 100%);
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
  margin-top: 10px;
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
  margin-left: 110px;
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
}
.btnc {
  background-image: url('@/assets/down.png');
  width: 24px;
  height: 24px;
  position: absolute;
        right: 5px;
}
.lastcontributors-panel {
  // padding-top: 24px;
  background: #fff;
  margin-top: 60px;
  margin-bottom: 60px;
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
.noSig {
  margin-top: 10px;
}
.noDataTreemap {
  background-image: url(@/assets/nodata.png);
  background-repeat: no-repeat;
  background-position: center;
  height: 576px;
}
</style>
