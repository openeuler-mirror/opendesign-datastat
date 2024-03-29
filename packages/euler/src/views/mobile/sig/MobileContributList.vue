<script setup lang="ts">
import TheProgress from '@/components/TheProgress.vue';
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { openCommunityInfo } from '@/api/index';
import { querySigUserContribute } from 'shared/api/index';
import { sortExp } from 'shared/utils/helper';
import { IObject } from 'shared/@types/interface';
import OMobilePagination from 'shared/components/OMobilePagination.vue';
import MobileOFormRadio from './MobileOFormRadio.vue';
import { useRouter } from 'vue-router';
import { useCommonStore } from '@/stores/common';
const useCommon = useCommonStore();
const router = useRouter();
const { t } = useI18n();
const props = defineProps({
  sig: {
    type: String,
    required: true,
    default: '',
  },
});
const contributionSelectBox = ref([
  {
    color: '#002fa7',
    isSelected: true,
    label: 'Maintainer',
    key: 'maintainers',
  },
  { color: '#feb32a', isSelected: true, label: 'Committer', key: 'committers' },
  {
    color: '#4aaead',
    isSelected: true,
    label: 'Contributor',
    key: 'contributor',
  },
]);
const filterReallData = () => {
  reallData.value = reallData.value.filter((item) => {
    return contributionSelectBox.value.some((it) => {
      return it.isSelected && item.usertype === it.key;
    });
  });
};
const reallData = ref([] as IObject[]);
const param = ref({
  contributeType: 'pr',
  timeRange: 'lastonemonth',
  community: openCommunityInfo.name,
  sig: computed(() => props.sig),
} as IObject);
const memberData = ref([]);
const memberMax = ref(0);
const searchInput = ref('');
const getMemberData = () => {
  querySigUserContribute(param.value).then((data) => {
    const memberList = data?.data?.sort(sortExp('contribute', false)) || [];
    if (memberList.length === 0) {
      memberMax.value = 0;
      memberData.value = [];
    } else {
      memberMax.value = memberList[0].contribute;
      memberData.value = memberList.map((item: any, index: any) => ({
        ...item,
        rank: index + 1,
      }));
      reallData.value = memberData.value;
    }
    filterReallData();
  });
};

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
      active: 'lastonemonth',
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
const componentName = 'member';
const loading = ref(true);
const getContributeInfo = (e: IObject) => {
  param.value[e.id] = e.active;
  getMemberData();
  switchType();
};
const typeLable = ref('');
const switchType = () => {
  switch (param.value.contributeType) {
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
  () => props.sig,
  () => {
    getMemberData();
  }
);
onMounted(() => {
  loading.value = false;
});
// 默认显示第1页
const currentPage = ref(1);
// 显示第几页
const handleCurrentChange = (val: number) => {
  // 改变默认的页数
  currentPage.value = val;
};
// 搜索过滤

const querySearch = () => {
  if (searchInput.value !== '') {
    const newList = memberData.value.filter((item: any) =>
      item.gitee_id.toLowerCase().includes(searchInput.value)
    );
    reallData.value = newList;
    filterReallData();
  } else {
    getMemberData();
  }
};

// 按颜色过滤
const getcontributeValue = (item: any) => {
  item.isSelected = !item.isSelected;
  querySearch();
};
// 跳转个人详情
const goToUser = (data: IObject) => {
  router.push({
    path: `/${useCommon.language}/mobile/user/${data}`,
  });
};
</script>
<template>
  <div>
    <div class="theSecondForm">
      <mobile-o-form-radio
        :option="lastformOption"
        @get-contribute-info="getContributeInfo($event)"
      ></mobile-o-form-radio>
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
            'background-color': value.isSelected ? value.color : '#cccccc',
          }"
        ></div>
        <span>{{ value.label }}</span>
      </div>
    </div>
    <div class="leader">
      <div class="leader-box">Leader</div>
      <span>SIG Leader</span>
    </div>
    <div class="ranking-table">
      <el-table
        v-loading="loading"
        :data="reallData.slice((currentPage - 1) * 10, currentPage * 10)"
        style="width: 100%"
      >
        <el-table-column
          prop="rank"
          align="center"
          :label="t('Number')"
          width="40"
        />
        <el-table-column
          prop="gitee_id"
          align="left"
          label="Gitee ID"
          show-overflow-tooltip
          ><template #default="scope">
            <div class="usertype-box">
              <span
                v-show="scope.row.usertype !== 'committers'"
                class="usertypecolorbox"
                :style="({
                    '--color':
                      scope.row.usertype === 'maintainers'
                        ? '#002FA7'
                        : '#4AAEAD',
                  } as any)"
              ></span>
              <span
                v-show="scope.row.usertype === 'committers'"
                class="usertypecolorbox"
                :style="({
                    '--color': '#FEB32A',
                  } as any)"
              ></span>
              <span
                class="num"
                :style="{
                  cursor: 'pointer',
                }"
                @click="goToUser(scope.row.gitee_id)"
                >{{ scope.row.gitee_id }}</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" :label="t(typeLable)">
          <template #default="scope">
            <div class="box">
              <div class="num">{{ scope.row.contribute }}</div>
              <the-progress
                width="90%"
                :item="scope.row.contribute"
                :component-name="componentName"
                :member-list="memberMax"
                :usertype="scope.row.usertype"
              ></the-progress>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="demo-pagination-block">
      <o-mobile-pagination
        v-show="reallData.length > 10"
        :current-page="currentPage"
        :page-size="10"
        :total="reallData.length"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
@import './styles/style.scss';
.ranking-table {
  :deep(.el-table th.el-table__cell) {
    font-size: 12px;
  }
  :deep(.el-table .el-table__cell) {
    font-size: 12px;
  }
  .box {
    display: grid;
    grid-template-columns: 25% auto;
    .el-progress {
      margin-left: 0;
    }
  }
  .usertype-box {
    display: flex;
    align-items: center;
    .num {
      text-align: left;
      color: #002fa7;
    }
  }
}
.edcolor-box {
  display: flex;
  padding-bottom: 10px;
  font-size: 12px;
  .yellow-box {
    margin-right: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 12px;
      height: 12px;

      background: #feb32a;
      border-radius: 2px;
      font-size: 10px;
      font-family: HarmonyOS_Sans_SC;
      color: #ffffff;
      line-height: 12px;
      text-align: center;
      margin-right: 8px;
      border-radius: 50%;
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
  width: 12px;
  height: 12px;
  background: var(--color);
  border-radius: 50%;
  margin-right: 8px;
}
.leader {
  margin-bottom: 10px;
  display: flex;
  font-size: 12px;
  align-items: center;
  &-box {
    width: 37px;
    height: 16px;
    background: #0062dc;
    border-radius: 2px;
    color: #ffffff;
    margin-right: 10px;
    text-align: center;
    line-height: 16px;
    font-size: 8px;
    font-family: Helvetica-Light, Helvetica;
    font-weight: 300;
  }
}
</style>
