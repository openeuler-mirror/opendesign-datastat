<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { formType } from 'shared/@types/interface';
import { IObject } from 'shared/@types/interface';
import IconUser from '~icons/app/search';
import OIcon from 'shared/components/OIcon.vue';
import MobileOFormRadio from '../sig/MobileOFormRadio.vue';
import OMobilePagination from 'shared/components/OMobilePagination.vue';
import { toThousands } from 'shared/utils/helper';
import {
  queryUserSigContribute,
  queryUserContributeDetails,
} from 'shared/api/index';
const { t } = useI18n();
const props = defineProps({
  sig: {
    type: String,
    required: true,
    default: '',
  },
});
const selvalue = ref('');
const value = ref(50);
const cursorValue = ref();
const param = ref({
  user: computed(() => props.sig),
  community: 'openeuler',
  contributeType: 'pr',
  pageSize: computed(() => value.value),
  timeRange: 'lastonemonth',
} as IObject);
const selParam = () => {
  if (selvalue.value !== 'all' && selvalue.value !== '') {
    param.value = {
      user: props.sig,
      sig: computed(() => selvalue.value),
      community: 'openeuler',
      contributeType: typeData.value,
      pageSize: computed(() => value.value),
      timeRange: timeData.value,
      // lastCursor: cursorValue.value,
    };
  } else {
    param.value = {
      user: props.sig,
      community: 'openeuler',
      contributeType: typeData.value,
      pageSize: computed(() => value.value),
      timeRange: timeData.value,
      // lastCursor: cursorValue.value,
    };
  }
};
// 组织贡献from
const formOption = computed(() => {
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
const getContributeInfo = (e: IObject) => {
  param.value[e.id] = e.active;
  switchTime();
  switchType();
  getDetailsData();
};
// 格式化统计周期文字
const timeRangeText = ref('');
const timeData = ref('');
const switchTime = () => {
  switch (param.value.timeRange) {
    case 'lastonemonth':
      timeRangeText.value = t('from.lastonemonth');
      timeData.value = 'lastonemonth';
      break;
    case 'lasthalfyear':
      timeRangeText.value = t('from.lasthalfyear');
      timeData.value = 'lasthalfyear';
      break;
    case 'lastoneyear':
      timeRangeText.value = t('from.lastoneyear');
      timeData.value = 'lastoneyear';
      break;
    default:
      timeRangeText.value = t('from.all');
      timeData.value = 'all';
      break;
  }
};
switchTime();
const typeLable = ref('');
const typeData = ref('');
const switchType = () => {
  switch (param.value.contributeType) {
    case 'pr':
      typeLable.value = t('home.prs');
      typeData.value = 'pr';
      break;
    case 'issue':
      typeLable.value = t('home.issues');
      typeData.value = 'issue';
      break;
    case 'comment':
      typeLable.value = t('home.comments');
      typeData.value = 'comment';
      break;
  }
};
switchType();
// 搜索过滤
const searchInput = ref('');
// 搜索结果
const reallData = ref([] as IObject[]);
const querySearch = () => {
  if (searchInput.value !== '') {
    const newList = detailsData.value.filter(
      (item: any) =>
        item.info.toLowerCase().includes(searchInput.value) ||
        item.repo.toLowerCase().includes(searchInput.value) ||
        item.time
          .split('T')
          .slice(0, 1)
          .toString()
          .toLowerCase()
          .includes(searchInput.value)
    );
    reallData.value = newList;
  } else {
    getDetailsData();
  }
};
const clearSearchInput = () => {
  getDetailsData();
  searchInput.value = '';
};
watch(
  () => props.sig,
  () => {
    getprlistData();
    getDetailsData();
  }
);
watch(
  () => value.value,
  () => {
    getDetailsData();
  }
);
watch(
  () => selvalue.value,
  () => {
    selParam();
    getDetailsData();
  }
);
const options = [
  {
    value: '10',
    label: '10',
  },
  {
    value: '20',
    label: '20',
  },
  {
    value: '50',
    label: '50',
  },
];
const istrue = ref(true);
const changeTage = () => {
  istrue.value = !istrue.value;
};
const selData = ref();
const getprlistData = () => {
  const query = {
    user: props.sig,
    timeRange: 'all',
    community: 'openeuler',
    contributeType: 'pr',
  };
  queryUserSigContribute(query).then((data) => {
    const value = data?.data || [];
    const seldata: any = [];
    value.map((item: any) => {
      seldata.push({
        name: item.sig_name,
      });
    });
    selData.value = seldata.sort((a: { name: string }, b: { name: string }) =>
      a.name.localeCompare(b.name)
    );
  });
};
getprlistData();
const detailsData = ref();
const totalCount = ref(0);

const getDetailsData = () => {
  queryUserContributeDetails(param.value).then((data) => {
    const value = data?.data || [];
    totalCount.value = data?.totalCount || 0;
    detailsData.value = value;
    reallData.value = value;
    cursorValue.value = data?.cursor || '';
  });
};
getDetailsData();

// 默认显示第1页
const currentPage = ref(1);
// 显示第几页
const handleCurrentChange = (val: number) => {
  // 改变默认的页数
  currentPage.value = val;
};
</script>

<template>
  <div class="contributions-statistical">
    <div class="sel">
      <div class="title">SIG筛选</div>
      <el-select
        v-model="selvalue"
        class="m-2"
        placeholder="Select"
        size="large"
      >
        <el-option label="全部" value="all" />
        <el-option
          v-for="item in selData"
          :key="item.name"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
    </div>
    <div class="line"></div>
    <mobile-o-form-radio
      :option="formOption"
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
            :placeholder="t('enterWord')"
            @change="querySearch"
            @clear="clearSearchInput"
          >
            <template #prefix>
              <o-icon class="search-icon"
                ><icon-user></icon-user
              ></o-icon> </template
          ></el-input>
        </div>
      </template>
    </mobile-o-form-radio>
  </div>
   <div class="detail">
    <div v-if="param.contributeType === 'pr'" class="prType">
      <span
        :style="{
          cursor: 'pointer',
        }"
        @click="changeTage()"
        ><img v-if="istrue" src="@/assets/MainPR.png" alt="" />
        <img v-else src="@/assets/CommonPR.png" alt=""
      /></span>
      <span
        class="sp"
        :style="{
          cursor: 'pointer',
        }"
        @click="changeTage()"
        >主要特性PR</span
      >
      <span
        :style="{
          cursor: 'pointer',
        }"
        @click="changeTage()"
      >
        <img v-if="istrue" src="@/assets/CommonPR.png" alt="" /><img
          v-else
          src="@/assets/MainPR.png"
          alt="" /></span
      ><span
        class="sp"
        :style="{
          cursor: 'pointer',
        }"
        @click="changeTage()"
        >一般特性PR</span
      >
    </div>
    <div v-else-if="param.contributeType === 'issue'">
      <span><img src="@/assets/!.png" alt="" /> Issue</span>
    </div>
    <div v-else>
      <span> <img src="@/assets/text.png" alt="" /> Comment</span>
    </div>
    <!-- <div class="page">
      <span class="sp"
        >共<span class="num">{{ toThousands(totalCount) }}</span
        >条结果</span
      >
      <span
        >每页显示<span class="num">
          <el-select v-model="value" class="m-2" placeholder="10" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            /> </el-select></span
        >条</span
      >
    </div> -->
  </div>
  <div class="bar-panel">
    <ul class="bar-content">
      <li
        v-for="(item, index) in reallData.slice(
          (currentPage - 1) * 10,
          currentPage * 10
        )"
        :key="'com' + index"
        class="bar-content-item"
      >
        <div class="index">
          {{ item.time.split('T').slice(0, 1).toString() }}
        </div>
        <p class="infos">
          <img
            v-if="param.contributeType === 'pr' && item.is_main_feature === 1"
            src="@/assets/MainPR.png"
            alt=""
          />
          <img
            v-if="param.contributeType === 'pr' && item.is_main_feature === 0"
            src="@/assets/CommonPR.png"
            alt=""
          />
          <span v-if="param.contributeType === 'pr'">在</span
          ><span v-else> 评论了</span
          ><a
            class="index"
            :href="`https://gitee.com/${item.repo}`"
            target="_blank"
            >{{ item.repo }}</a
          ><span v-if="param.contributeType === 'pr'">创建了Pull Request</span
          ><span v-else-if="param.contributeType === 'issue'">创建了 任务</span
          ><span v-else> 的 Pull Request</span>
          <a :href="item.url" target="_blank" class="rigth-index"
            >!{{ item.no }} {{ item.info }}</a
          >
        </p>
      </li>
    </ul>
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
</template>

<style lang="scss" scoped>
@import '@/shared/styles/style.scss';
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
  :deep(.el-input__inner) {
    height: 56px;
  }
}
.bar-panel {
  position: relative;
  height: 100%;
  padding-bottom: 12px;
}
.bar-content {
  position: relative;
  z-index: 2;
  &-item {
    margin: 16px 0;
    list-style: none;
    // display: flex;
    // justify-content: space-between;
    .infos {
      font-size: 16px;
      color: #000000;
      // line-height: 22px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      .index {
        // width: 16px;
        // width:auto;
        margin-right: 8px;
        font-size: 16px;
        color: #002fa7;
        // text-align: center;
      }
      .rigth-index {
        margin-left: 8px;
        color: #002fa7;
      }
    }
  }
}
.detail {
  display: flex;
  align-items: center;
  position: relative;
  .sp {
    // width: 69px;
    height: 18px;
    font-size: 3px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #555555;
    line-height: 18px;
    margin-left: 2px;
    margin-right: 4px;
  }
  .page {
    position: absolute;
    right: 0;
    font-size: 3px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #555555;
    line-height: 22px;
    .num {
      font-size: 3px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #000000;
      line-height: 24px;
      padding-left: 5px;
      padding-right: 5px;
    }
  }
}
.sel {
  margin-bottom: 14px;
  // display: flex;
  // align-items: center;
  .title {
    margin-bottom: 14px;
    width: 122px;
    font-size: 12px;
  }
}
.line {
  border-bottom: 1px solid #dfe1e8;
  margin-bottom: 18px;
}
.demo-pagination-block {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<style lang="scss">
.num {
  .el-select .el-input__inner {
    width: 48px;
    height: 24px;
  }
}
.sel {
  .el-select .el-input__inner {
    // width: 368px;
    height: 32px;
  }
}
.el-select-dropdown__item {
  padding: 0 15px 0 15px;
}
</style>
