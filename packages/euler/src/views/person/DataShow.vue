<template>
  <div class="edropdown">
    <el-dropdown placement="bottom-start">
      <div class="main-left-title">
        {{ t(timeTitle) }}{{t('zhcontribut')}}
        <span class="btnc"></span>
      </div>
      <template #dropdown>
        <el-dropdown-item
          v-for="item in timeRange"
          :key="item.value"
          class="dropdownItem"
          @click="clickDrownItem(item)"
        >
          {{ t(item.label)}}{{t('zhcontribut')}}</el-dropdown-item
        >
      </template>
    </el-dropdown>
  </div>
  <div class="left-first">
    <div class="left-first-child">
      <span :title="`${t('Mergerequest')} PR`">{{ t("Mergerequest") }} PR</span>
      <div class="left-first-child-data">
        {{ displayData.pr }}
      </div>
    </div>
    <div class="left-first-child">
      <span :title="`${t('NeedsProblems')} Issue`">{{ t("NeedsProblems") }} Issue</span>
      <div class="left-first-child-data">
        {{ displayData.issue }}
      </div>
    </div>
    <div class="left-first-child">
      <span :title="`${t('review')} Comment`">{{ t("review") }} Comment</span>
      <div class="left-first-child-data">
        {{ displayData.comment }}
      </div>
    </div>
    <div class="left-first-child">
      <span :title="`${t('SIGNumber')}`">{{ t("SIGNumber") }}</span>
      <div class="left-first-child-data">
        {{ displayData.sig }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toRefs, ref, onMounted, watch, computed, PropType } from "vue";
import { IObject } from "shared/@types/interface";
import { toThousands } from "shared/utils/helper";
import { useI18n } from "vue-i18n";


const { t } = useI18n();
const props = defineProps({
  user: {
    type: String,
    required: true,
    default: '',
  },
  data: {
    type: Object as PropType<{ pr: number; issue: number; comment: number; sig: number }>,
    required: true,
  },
});

const emit = defineEmits(['updateDetail']);
const { user } = toRefs(props);

const displayData = computed(() => {
  const data = props.data;
  return {
    pr: data.pr ? toThousands(data.pr) : '-',
    issue: data.issue ? toThousands(data.issue) : '-',
    comment: data.comment ? toThousands(data.comment) : '-',
    sig: data.sig ? toThousands(data.sig) : '-',
  };
})

const timeRange = [
  {
    label: 'from.lastonemonth',
    value: 'lastonemonth',
  },
  { label: 'from.lasthalfyear', value: 'lasthalfyear' },
  { label: 'from.lastoneyear', value: 'lastoneyear' },
  { label: 'from.all', value: 'all' },
];
const time = ref('');

watch(
  () => user.value,
  () => {
    emit('updateDetail', { user: props.user, timeRange: time.value });
  }
);
const timeTitle = ref('');
const clickDrownItem = (item: IObject) => {
  time.value = item.value;
  timeTitle.value = item.label;
  emit('updateDetail', { user: props.user, timeRange: time.value });
};
onMounted(() => {
  time.value = 'all';
  timeTitle.value = 'from.all';
  emit('updateDetail', { user: props.user, timeRange: time.value });
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
  background-image: url("@/assets/linedown.png");
  width: 24px;
  height: 24px;
  margin-left: 8px;
}
.main-left-title {
  display: flex;
  // width: 160px;
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
