<script setup lang="ts">
import TheProgress from '@/components/TheProgress.vue';
import OFormRadio from '@/components/OFormRadio.vue';
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { openCommunityInfo } from '@/api/index';
import { querySigUserContribute } from 'shared/api/index';
import { sortExp } from 'shared/utils/helper';
import { IObject } from 'shared/@types/interface';
import IconUser from '~icons/app/search';
import OIcon from 'shared/components/OIcon.vue';
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
getMemberData();

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
const clearSearchInput = () => {
  getMemberData();
  searchInput.value = '';
};

// 按颜色过滤
const getcontributeValue = (item: any) => {
  item.isSelected = !item.isSelected;
  querySearch();
};
</script>
<template>
  <div>
    <div class="theSecondForm">
      <o-form-radio
        :option="lastformOption"
        @get-contribute-info="getContributeInfo($event)"
      >
        <template #searchInput>
          <div class="searchInput">
            <el-input
              v-model="searchInput"
              :trigger-on-focus="false"
              clearable
              :debounce="300"
              size="large"
              placeholder="请输入Gitee ID搜索"
              @change="querySearch"
              @clear="clearSearchInput"
            >
              <template #prefix>
                <o-icon class="search-icon"
                  ><icon-user></icon-user
                ></o-icon> </template
            ></el-input>
          </div> </template
      ></o-form-radio>
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
    <div class="ranking-list">
      <div class="ranking-list-item">
        <p class="caption"></p>
        <el-table
          v-loading="loading"
          :data="reallData.slice((currentPage - 1) * 10, currentPage * 10)"
          style="width: 100%"
        >
          <el-table-column
            prop="rank"
            align="center"
            :label="t('ranking')"
            width="120"
          />
          <el-table-column
            prop="gitee_id"
            align="left"
            label="Gitee ID"
            show-overflow-tooltip
            width="200"
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
                <span class="num">{{ scope.row.gitee_id }}</span>
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
                  :member-list="memberMax"
                  :usertype="scope.row.usertype"
                ></the-progress>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="demo-pagination-block">
      <el-pagination
        v-show="reallData.length > 10"
        :current-page="currentPage"
        :page-size="10"
        background
        layout="total, prev, pager, next, jumper"
        :total="reallData.length"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
@import '@/shared/styles/style.scss';
.theSecondForm {
  padding-right: 24px;
}
.ranking-list {
  display: grid;
  grid-template-columns: 100%;
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
    align-items: center;
    .num {
      width: 100px;
      text-align: left;
    }
  }
}
.edcolor-box {
  display: flex;
  padding-bottom: 10px;

  .blue-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 12px;
      height: 12px;
      background: #002fa7;
      border-radius: 50%;
      margin-right: 8px;
    }
    .nobox {
      width: 12px;
      height: 12px;
      background: #000;
      border-radius: 50%;
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
  .red-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 12px;
      height: 12px;
      background: #4aaead;
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
  // background: linear-gradient(var(--color));
  background: var(--color);
  border-radius: 50%;
  margin-right: 8px;
}
.leader {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  &-box {
    width: 54px;
    height: 22px;
    background: #0062dc;
    border-radius: 2px;
    color: #ffffff;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-family: Helvetica-Light, Helvetica;
    font-weight: 300;
  }
}
.searchInput {
  width: 100%;
  margin: 10px 0 20px;
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
</style>
