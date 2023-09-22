<template>
  <div class="issueMain">
    <div>
      <div class="title">{{ t('IssueClose') }}</div>
      <p class="all">
        {{ closedIssue }} <span class="allData">/{{ allIssue }}</span>
      </p>
      <el-progress
        :text-inside="true"
        :stroke-width="24"
        :percentage="
          allIssue === 0 ? 0 : Math.floor((closedIssue * 100) / allIssue)
        "
      />
    </div>

    <div style="margin-top: 20px">
      <div class="title">{{ t('CveClose') }}</div>
      <p class="all">
        {{ fixedCve }}<span class="allData">/{{ allCve }}</span>
      </p>

      <el-progress
        :text-inside="true"
        :stroke-width="24"
        :percentage="allCve === 0 ? 0 : Math.floor((fixedCve * 100) / allCve)"
        status="exception"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { openCommunityInfo } from '@/api/index';
import { queryDefect } from 'shared/api/index';
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const props = defineProps({
  sig: {
    type: String,
    required: true,
    default: '',
  },
});
const param = ref({
  timeRange: 'default',
  community: openCommunityInfo.name,
  sigName: computed(() => props.sig),
});
const allCve = ref();
const fixedCve = ref();
const allIssue = ref();
const closedIssue = ref();

const getIssueData = () => {
  queryDefect(param.value).then((res) => {
    allCve.value = res.data.allCve;
    fixedCve.value = res.data.fixedCve;
    allIssue.value = res.data.allIssue;
    closedIssue.value = res.data.closedIssue;
  });
};
watch(
  () => props.sig,
  () => {
    getIssueData();
  }
);
onMounted(() => {
  getIssueData();
});
</script>
<style scoped lang="scss">
.issueMain {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
}
.title {
  height: 24px;
  font-size: 16px;
  color: #4e5865;
  line-height: 24px;
}

.all {
  font-size: 12px;
  color: #000000;
  line-height: 16px;
  margin-bottom: 12px;
  margin-top: 4px;
  .allData {
    color: #4e5865;
  }
}
</style>

<style lang="scss">
.issueMain {
  .el-progress-bar__inner {
    border-radius: 0px !important;
  }
  .el-progress-bar__outer {
    border-radius: 0px !important;
  }
}
</style>
