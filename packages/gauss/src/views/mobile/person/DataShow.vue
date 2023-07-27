<template>
  <div class="edropdown">
    <el-dropdown placement="bottom-start">
      <div class="main-left-title">
        {{ t(timeTitle) }}{{ t('zhcontribut') }}
        <span class="btnc"></span>
      </div>
      <template #dropdown>
        <el-dropdown-item
          v-for="item in timeRange"
          :key="item.value"
          class="dropdownItem"
          @click="clickDrownItem(item)"
        >
          {{ t(item.label) }}{{ t('zhcontribut') }}</el-dropdown-item
        >
      </template>
    </el-dropdown>
  </div>
  <div class="left-first">
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
      <span>{{ t('review') }} Comment</span>
      <div class="left-first-child-data">
        {{ toThousands(comment) }}
      </div>
    </div>
    <div class="left-first-child">
      <span>{{ t('SIGNumber') }}</span>
      <div class="left-first-child-data">
        {{ toThousands(contributors) }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toRefs, ref, onMounted, watch } from 'vue';
import { queryUserSigContribute, queryUserContributeDetails } from 'shared/api';
import { IObject } from 'shared/@types/interface';
import { processing, toThousands } from 'shared/utils/helper';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
  user: {
    type: String,
    required: true,
    default: '',
  },
});
const { user } = toRefs(props);
const mergeRequest = ref(0);
const issueData = ref(0);
const comment = ref(0);
const contributors = ref(0);
const timeRange = [
  { label: 'from.lastonemonth', value: 'lastonemonth' },
  { label: 'from.lasthalfyear', value: 'lasthalfyear' },
  { label: 'from.lastoneyear', value: 'lastoneyear' },
  { label: 'from.all', value: 'all' },
];
const time = ref('');
const getItemListData = (data: IObject[], template: string) => {
  return data.reduce((sum, e) => sum + Number(e[template]), 0);
};
const getprlistData = () => {
  const query = {
    user: user.value,
    timeRange: time.value,
    community: 'opengauss',
    contributeType: 'pr',
  };
  queryUserContributeDetails(query).then((data) => {
    const value = data || [];
    mergeRequest.value = value.totalCount;
  });
};

const siglistData = () => {
  const query = {
    user: user.value,
    timeRange: time.value,
    community: 'opengauss',
    contributeType: 'pr',
  };
  queryUserSigContribute(query).then((data) => {
    const value = data?.data || [];
    contributors.value = value.length;
  });
};
const getissuelistData = () => {
  const query = {
    user: user.value,
    timeRange: time.value,
    community: 'opengauss',
    contributeType: 'issue',
  };
  queryUserContributeDetails(query).then((data) => {
    const value = data || [];
    issueData.value = value.totalCount;
  });
};

const getcommentlistData = () => {
  const query = {
    user: user.value,
    timeRange: time.value,
    community: 'opengauss',
    contributeType: 'comment',
  };
  queryUserContributeDetails(query).then((data) => {
    const value = data || [];
    comment.value = value.totalCount;
  });
};
const getAllData = () => {
  getprlistData();
  getissuelistData();
  getcommentlistData();
  siglistData();
};
watch(
  () => user.value,
  () => {
    getAllData();
  }
);
const timeTitle = ref('');
const clickDrownItem = (item: IObject) => {
  time.value = item.value;
  timeTitle.value = item.label;
  getAllData();
};
onMounted(() => {
  time.value = 'all';
  timeTitle.value = 'from.all';
});
</script>
<style scoped lang="scss">
.left-first {
  width: 370px;
  height: 176px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 24px;
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
.btnc {
  background-image: url('@/assets/down.png');
  width: 24px;
  height: 24px;
  margin-left: 24px;
}
.main-left-title {
  display: flex;
  height: 24px;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #000000;
  line-height: 24px;
  align-items: center;
}
.edropdown {
  margin-top: 24px;
}
</style>
