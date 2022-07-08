<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import { IObject } from 'shared/@types/interface';
import { onMounted, ref, watch, computed, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { sigsProcessing } from 'shared/utils/helper';
import { queryCompanySigDetails, queryCompanySigs } from 'shared/api';
import TheForm from './TheForm.vue';
import TheProgress from '@/components/TheProgress.vue';
import { useStaffStore } from '@/stores/staff';
import OMobilePagination from 'shared/components/OMobilePagination.vue';
const useStaff = useStaffStore();
const useCommon = useCommonStore();
const route = useRoute();
const sencondTitle = ref('');
const sencondTitleValue = ref('');
const { t } = useI18n();
const allcompany = ref([]);
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
});
const { title } = toRefs(props);
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
const oechartTreeGroup = ref([] as IObject[]);
oechartTreeGroup.value = [];
const getSigsData = () => {
  const query = {
    company: computed(() => title.value),
    timeRange: 'all',
    community: 'openeuler',
  };
  queryCompanySigDetails(query).then((data) => {
    sigsData.value = sigsProcessing(data?.data || []);
  });
};

watch(
  () => useCommon.language,
  () => {
    getSencondTitle(sencondTitle.value);
  }
);
const getallData = () => {
  getSigsData();
  getContributeInfo();
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
// theform组件调用
const componentName = 'staff';
const loading = ref(true);
const getContributeInfo = () => {
  useStaff.getStaffData(title.value);
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
const tableData = computed(() =>
  useStaff.tableData.map((item: any, index: any) => ({
    ...item,
    rank: index + 1,
  }))
);
// 默认显示第1页
const currentPage = ref(1);
// 显示第几页
const handleCurrentChange = (val: number) => {
  // 改变默认的页数
  currentPage.value = val;
};

// 搜索过滤
const searchInput = ref('');
// 清除搜索
const clean = () => {
  searchInput.value = '';
};
// 贡献表搜索
const reallListData = ref([] as IObject[]);
watch(
  () => tableData.value,
  () => {
    reallListData.value = tableData.value;
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
        :data="reallListData.slice((currentPage - 1) * 10, currentPage * 10)"
        style="width: 100%"
      >
        <el-table-column
          prop="rank"
          align="center"
          :label="t('ranking')"
          width="40"
        />
        <el-table-column
          prop="gitee_id"
          align="left"
          label="Gitee ID"
          show-overflow-tooltip
          width="100"
          ><template #default="scope">
            <div class="usertype-box">
              <span class="num"
                >{{ scope.row.gitee_id
                }}<span v-if="scope.row.is_TC_owner" class="TCbox">TC</span
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
    <o-mobile-pagination
      v-show="reallListData.length > 10"
      :current-page="currentPage"
      :page-size="10"
      :total="reallListData.length"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<style lang="scss" scoped>
@import '@/shared/styles/style.scss';
.ranking-list {
  display: grid;
  grid-template-columns: 100%;

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
.edcolor-box {
  display: flex;
  padding-bottom: 20px;
  .blue-box {
    margin-right: 8px;
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
    margin-right: 8px;
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
</style>