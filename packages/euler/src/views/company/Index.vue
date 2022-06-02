<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import { IObject } from 'shared/@types/interface';
import OAnchor from 'shared/components/OAnchor.vue';
import { onMounted, ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { ArrowDown } from '@element-plus/icons-vue';
import { sigsProcessing, treeProcessing } from 'shared/utils/helper';
import {
  queryCompanySigDetails,
  queryCompanyUserContribute,
  queryCompanyContribute,
} from 'shared/api';
import OEchartCircularPile from 'shared/components/OEchartCircularPile.vue';
import OEchartTreemap from 'shared/components/OEchartTreemap.vue';
import TheForm from '@/components/TheForm.vue';
import TheProgress from '@/components/TheProgress.vue';
import { useStaffStore } from '@/stores/staff';
import TreemapSearch from './TreemapSearch.vue';
const useStaff = useStaffStore();
const useCommon = useCommonStore();
const route = useRoute();
const sencondTitle = ref('');
const sencondTitleValue = ref('');
const { t } = useI18n();
const allcompany = ref([]);
const getSencondTitle = (value?: string) => {
  const query = {
    timeRange: 'lastonemonth',
    community: 'openeuler',
    contributeType: 'PR',
  };
  queryCompanyContribute(query).then((data) => {
    allcompany.value = data?.data || [];
    const name = value || route.params.name;
    const findOne =
      allcompany.value.find(
        (item: IObject) => item.company_cn === name || item.company_en === name
      ) || allcompany.value[0];
    const key = useCommon.language === 'zh' ? 'company_cn' : 'company_en';
    sencondTitle.value = (findOne && findOne[key]) || name;
    sencondTitleValue.value = findOne.company_cn || name;
    getallData();
  });
};
const sigsData = ref([]);
const treeData = ref([]);
const mergeRequest = ref(0);
const issueData = ref(0);
const comment = ref(0);
const contributors = ref(0);
const oechartData = ref({
  D0: 0,
  D1: 0,
  D2: 0,
});
const oechartTreeValue = ref([
  {
    key: '',
    label: 'sig1',
    value: 1,
    group: '内核',
  },
  {
    key: '',
    label: 'sig3',
    value: 15,
    group: '基础系统',
  },
  {
    key: '',
    label: 'sig2',
    value: 10,
    group: '桌面系统',
  },
]);
const oechartSecondTreeValue = ref([
  {
    key: '',
    label: 'sig-KIRAN-DESKTOP',
    value: 10,
    group: '应用',
  },
]);
const getoechartTreeValue = () => {
  const query = {
    company: sencondTitleValue.value,
    timeRange: 'lastonemonth',
    community: 'openeuler',
  };
  queryCompanySigDetails(query).then((data) => {
    treeData.value = treeProcessing(data?.data || []);
    // treeData.value.sigs.map((item) => {
    //   oechartTreeValue.value = item;
    //   // oechartTreeValue.value.label = item.sig;
    //   // oechartTreeValue.value.value = item.D0;
    //   // oechartTreeValue.value.group = item.group;
    // });
    for (let { sig: n, D0: f, group: p } of treeData.value.sigs) {
      console.log(`Name: ${n}, Father: ${f},group:${p}`);
      oechartTreeValue.value.label = n;
      oechartTreeValue.value.value = f;
      oechartTreeValue.value.group = p;
      console.log(oechartTreeValue.value.label);
    }
    console.log(oechartTreeValue.value.label);
    contributors.value = getItemListData(treeData.value.sigs, 'D0');
    oechartData.value.D0 = getItemListData(treeData.value.sigs, 'D0');
    oechartData.value.D1 = getItemListData(treeData.value.sigs, 'D1');
    oechartData.value.D2 = getItemListData(treeData.value.sigs, 'D2');
  });
};
// const getItemTreeData = (data, template) => {
//   return data.map((item) => item[template]);
// };
const drownData = ref([]);
const getDrownData = () => {
  drownData.value = allcompany.value.map((item) => {
    const key = useCommon.language === 'zh' ? 'company_cn' : 'company_en';
    return {
      value: item.company_cn,
      label: item[key],
    };
  });
};
const getSigsData = () => {
  const query = {
    company: sencondTitleValue.value,
    timeRange: 'lastonemonth',
    community: 'openeuler',
  };
  queryCompanySigDetails(query).then((data) => {
    sigsData.value = sigsProcessing(data?.data || []);
  });
};
// const getPieData = () => {
//   const query = {
//     company: sencondTitleValue.value,
//     timeRange: 'lasthalfyear',
//     community: 'openeuler',
//   };
//   queryCompanyUsers(query).then((data) => {
//     pieData.value = pieProcessing(data?.data || []);
//     oechartData.value.D0 = pieData.value.D0;
//     oechartData.value.D1 = pieData.value.D1;
//     oechartData.value.D2 = pieData.value.D2;
//     // contributors.value = getItemPieData('Contribute');
//     // comment.value = getItemPieData('Issue_Comment');
//   });
// };

const getprlistData = () => {
  const query = {
    company: sencondTitleValue.value,
    timeRange: 'lastonemonth',
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
    timeRange: 'lastonemonth',
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
    timeRange: 'lastonemonth',
    community: 'openeuler',
    contributeType: 'comment',
  };
  queryCompanyUserContribute(query).then((data) => {
    const value = data?.data || [];
    comment.value = getItemListData(value, 'contribute');
  });
};

const getItemListData = (data, template) => {
  return data.reduce((sum, e) => sum + Number(e[template]), 0);
};
const clickDrownItem = (item) => {
  sencondTitle.value = item.label;
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
};
onMounted(() => {
  getSencondTitle();
  useStaff.getStaffData();
  loading.value = false;
});
const lastformOption = computed(() => {
  return [
    {
      label: t('from.type'),
      id: 'contributeType',
      active: 'pr',
      list: [
        { label: t('home.prs'), value: 'PR' },
        { label: t('home.issues'), value: 'Issue' },
        { label: t('home.comments'), value: 'Comment' },
      ],
    },
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
// theform组件调用
const componentName = 'staff';
const loading = ref(true);
const getContributeInfo = () => {
  useStaff.getStaffData();
};
const typeLable = ref('');
const switchType = () => {
  switch (useStaff.staffForm.contributeType) {
    case 'PR':
      typeLable.value = t('home.prs');
      break;
    case 'Issue':
      typeLable.value = t('home.issues');
      break;
    case 'Comment':
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
const hightRanking = computed(() => useStaff.hightRanking);
// const changeColor = (type) => {
//   return (type) => {
//     if (type === 'maintainers') {
//       return { color: '225deg, #FEB32A 0%, #F6D365 100%' };
//     } else if (type === 'contributor') {
//       return { color: '225deg, #4AAEAD 0%, #6BFBFA 100%' };
//     } else if (type === 'tc') {
//       return { color: '45deg, #005CD3 0%, #002FA7 100%' };
//     }
//   };
// };

const anchorData = ['ecological', 'staffContributor'];
</script>
<template>
  <div class="container">
    <o-anchor top="11rem" :data="anchorData" :offset-value="400"></o-anchor>
    <div class="wrap">
      <div class="step">
        <span class="step-one">{{ t('nav.contributors') }}</span>
        <span> > {{ sencondTitle }}</span>
      </div>
      <div class="main">
        <div class="main-left">
          <div class="main-left-top">
            <div class="main-left-title">{{ sencondTitle }}</div>
            <div class="edropdown">
              <el-dropdown>
                <div class="btnc">
                  <el-icon :size="20">
                    <arrowDown />
                  </el-icon>
                </div>

                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="item in drownData"
                      :key="item.value"
                      @click="clickDrownItem(item)"
                    >
                      {{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>

          <div class="left-title">当前/最近一个月的贡献排名</div>
          <div class="left-first">
            <div class="left-first-child">
              <span>合并请求 PR</span>
              <div class="left-first-child-data">{{ mergeRequest }}</div>
            </div>
            <div class="left-first-child">
              <span>需求&问题 Issue</span>
              <div class="left-first-child-data">{{ issueData }}</div>
            </div>
            <div class="left-first-child">
              <span>评审 Comment</span>
              <div class="left-first-child-data">{{ comment }}</div>
            </div>
            <div class="left-first-child">
              <span>贡献者数量</span>
              <div class="left-first-child-data">{{ contributors }}</div>
            </div>
          </div>

          <div class="circularPile">
            <div class="circularPile-sp">贡献者分布</div>
            <o-echart-circular-pile
              id="circularPile"
              :data="oechartData"
            ></o-echart-circular-pile>
          </div>

          <div class="left-second">
            <span class="left-second-sp">参与的SIG:</span>
            <div class="atlas">
              <span
                v-for="item in sigsData.sigs"
                :key="item.value"
                class="atlas-sp"
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
              <!-- <the-form
                :option="firstformOption"
                :component-name="componentName"
                @get-contribute-info="getTreeContributeInfo"
              ></the-form> -->
              <treemap-search></treemap-search>
            </div>
            <div class="color-box">
              <div class="blue-box">
                <div class="box"></div>
                桌面/图形系统
              </div>
              <div class="yellow-box">
                <div class="box"></div>
                架构/处理器/内核/驱动
              </div>
              <div class="red-box">
                <div class="box"></div>
                基础功能/特性/工具
              </div>
              <div class="green-box">
                <div class="box"></div>
                行业解决方案/应用
              </div>
            </div>
            <div class="smalltitle">贡献者数量</div>
            <div class="firstTreemap">
              <o-echart-treemap
                id="firstTreemap"
                :value="oechartTreeValue"
              ></o-echart-treemap>
            </div>
            <div class="smalltitle">提交贡献</div>
            <div class="secondTreemap">
              <o-echart-treemap
                id="secondTreemap"
                :value="oechartSecondTreeValue"
              ></o-echart-treemap>
            </div>
          </div>

          <div class="contributors-panel">
            <h3 id="staffContributor" class="stafftitle">
              {{ `${sencondTitle} ${t('staffContributor')}` }}
            </h3>
            <div class="theSecondForm">
              <the-form
                :option="lastformOption"
                :component-name="componentName"
                @get-contribute-info="getContributeInfo"
              ></the-form>
            </div>
            <div class="edcolor-box">
              <div class="blue-box">
                <div class="box">TC</div>
                技术委员会委员
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
                  :data="hightRanking"
                  style="width: 100%"
                >
                  <el-table-column
                    type="index"
                    align="center"
                    :label="t('ranking')"
                    width="120"
                  />
                  <el-table-column
                    prop="gitee_id"
                    align="left"
                    label="Gitee ID"
                    show-overflow-tooltip
                    width="300"
                    ><template #default="scope">
                      <div class="usertype-box">
                        <span class="num"
                          >{{ scope.row.gitee_id
                          }}<span
                            class="usertypecolorbox"
                            :style="{
                              '--color':
                                scope.row.usertype === 'maintainers'
                                  ? '225deg,#FEB32A 0%, #F6D365 100%'
                                  : '225deg,#4AAEAD 0%, #6BFBFA 100%',
                            }"
                            >{{ scope.row.usertype }}</span
                          ></span
                        >
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
                v-model:currentPage="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 30, 40]"
                :small="small"
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="100"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
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
    width: 300px;
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
      width: 300px;
      height: 22px;
      font-size: 16px;
      font-family: HarmonyOS_Sans_SC_Medium;
      color: #002fa7;
      line-height: 22px;
      margin-bottom: 8px;
    }
  }
}

.circularPile {
  margin-top: 60px;
  margin-bottom: 60px;
  &-sp {
    margin-bottom: 30px;
    width: 80px;
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
  margin-bottom: 20px;

  padding: 5px;
}
.secondTreemap {
  margin-bottom: 60px;
  padding: 5px;
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
  padding-top: 10px;
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

    .num {
      width: 100px;
      text-align: right;
    }
  }
}
.stafftitle {
  padding-left: 24px;
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
  margin-bottom: 20px;
  margin-left: 20px;
  width: 80px;
  height: 24px;
  font-size: 16px;
  font-family: HarmonyOS_Sans_SC;
  color: #000000;
  line-height: 24px;
}
.color-box {
  display: flex;
  margin-left: 20px;
  padding-bottom: 20px;
  .blue-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 12px;
      height: 12px;
      background: #002fa7;
      margin-right: 8px;
    }
  }
  .yellow-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 12px;
      height: 12px;
      background: #feb32a;
      margin-right: 8px;
    }
  }
  .red-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 12px;
      height: 12px;
      background: #4aaead;
      margin-right: 8px;
    }
  }
  .green-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 12px;
      height: 12px;
      background: #fc756c;
      margin-right: 8px;
    }
  }
}
.edcolor-box {
  display: flex;
  margin-left: 20px;
  padding-bottom: 20px;

  .blue-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 29px;
      height: 16px;
      background: linear-gradient(45deg, #005cd3 0%, #002fa7 100%);
      border-radius: 2px;
      font-size: 10px;
      font-family: HarmonyOS_Sans_SC;
      color: #ffffff;
      line-height: 12px;
      text-align: center;
      margin-right: 8px;
    }
  }
  .yellow-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 65px;
      height: 16px;
      background: linear-gradient(225deg, #feb32a 0%, #f6d365 100%);
      border-radius: 2px;
      font-size: 10px;
      font-family: HarmonyOS_Sans_SC;
      color: #ffffff;
      line-height: 12px;
      text-align: center;
      margin-right: 8px;
    }
  }
  .red-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 65px;
      height: 16px;
      background: linear-gradient(225deg, #4aaead 0%, #6bfbfa 100%);
      border-radius: 2px;
      font-size: 10px;
      font-family: HarmonyOS_Sans_SC;
      color: #ffffff;
      line-height: 12px;
      text-align: center;
      margin-right: 8px;
    }
  }
}
.demo-pagination-block {
  margin-left: 20px;
  margin-top: 10px;
}
.usertypecolorbox {
  margin-left: 5px;
  background: linear-gradient(var(--color));
  border-radius: 2px;
  font-size: 10px;
  font-family: HarmonyOS_Sans_SC;
  color: #ffffff;
  line-height: 12px;
}
</style>
