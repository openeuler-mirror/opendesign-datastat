<script setup lang="ts">
import SectionCard from '@/components/SectionCard.vue';
import ToggleRadios from '@/components/ToggleRadios.vue';
import useCommonFilters from '@/composables/useCommonFilters';
import { ODivider, OIcon, OIconSearch, OInput } from '@opensig/opendesign';
import { refDebounced } from '@vueuse/core';
import { request } from 'shared/plugins/axios';
import { formatNumber } from 'shared/utils/helper';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import IconEmpty from '~icons/app/empty.svg';

const { t } = useI18n();
const route = useRoute();

const userName = computed(() => route.params.id as string);

const { contributionTypeOptions, contributionType, timeRange, disabledTimeRange } = useCommonFilters();

const displayCountOptions = [
  { label: '全部', value: 0 },
  { label: 'Top10', value: 10 },
];

const contributionData = ref<{ contribute: number; sig_name: string; rank: number; percent: number }[]>([]);
const displayCount = ref(10);
const searchSigName = ref('');
const searchSigNameDebounced = refDebounced(searchSigName);
const displayData = computed(() => {
  let res = contributionData.value;
  if (displayCount.value) {
    res = res.slice(0, displayCount.value);
  }
  let search = searchSigNameDebounced.value.trim()
  console.log(search)
  if (search) {
    search = search.toLowerCase();
    res = res.filter(item => item.sig_name.toLowerCase().includes(search));
  }
  return res;
});

const max = computed(() => contributionData.value?.[0]?.contribute ?? 0);
const queryData = () => {
  const params = {
    community: 'openubmc',
    contributeType: contributionType.value,
    user: userName.value,
  } as Record<string, any>;
  if (timeRange.value?.length === 2) {
    params.start = timeRange.value[0].getTime();
    params.end = timeRange.value[1].getTime();
  }
  request
    .get('/api-magic/stat_new/sigcontribute', { params })
    .then((res) => res.data ?? {})
    .then((res) => {
      if (res.code !== 1 || !res.data) {
        contributionData.value = [];
        return;
      }
      const max = res.data[0].contribute;
      contributionData.value = res.data.map((item: any) => ({
        ...item,
        percent: Math.floor(item.contribute * 100 / max)
      }));
    })
    .catch(() => (contributionData.value = []));
};

onMounted(queryData);
watch(userName, queryData);

const router = useRouter();
const toSigDetail = (id: string) => router.push({ name: 'sig-detail', params: { id } });
</script>

<template>
  <SectionCard>
    <template #header> {{ userName }} SIG {{ t('common.contribute') }} </template>

    <ElForm label-width="auto" label-position="right" style="--el-text-color-regular: #000">
      <ElFormItem :label="t('common.from.type')">
        <ToggleRadios v-model="contributionType" :options="contributionTypeOptions" @change="queryData" />
      </ElFormItem>
      <ElFormItem :label="t('common.from.timeRange')">
        <ElDatePicker
          v-model="timeRange"
          unlink-panels
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="queryData"
          :disabled-date="disabledTimeRange"
        />
      </ElFormItem>
    </ElForm>

    <ODivider />

    <ElForm label-width="auto" label-position="right" style="--el-text-color-regular: #000">
      <ElFormItem label="显示范围">
        <ToggleRadios v-model="displayCount" :options="displayCountOptions" @change="queryData" />
      </ElFormItem>
    </ElForm>

    <OInput v-model="searchSigName" placeholder="请输入SIG名称搜索">
      <template #prefix><OIcon style="font-size: 16px"><OIconSearch /></OIcon></template>
    </OInput>

    <div class="bar-panel">
      <template v-if="displayData.length">
        <ul class="bar-content">
          <li v-for="(item, index) in displayData" :key="item.sig_name" class="bar-content-item">
            <p class="infos">
              <span class="index">{{ index + 1 }}</span>
              <span class="name" @click="toSigDetail(item.sig_name)">{{ item.sig_name }}</span>
            </p>
  
            <ElTooltip placement="bottom-start" effect="light" popper-class="bar-tooltip" :show-arrow="false">
              <template #content>
                <div class="info">
                  <p>
                    <span class="index">{{ item.rank }}</span>
                    {{ item.sig_name }}
                  </p>
                  <span class="num">{{ item.contribute }} </span>
                  <span>{{ item.percent + '%' }} </span>
                </div>
              </template>
              <div class="progress">
                <div class="progress-inner" :style="{ width: item.percent + '%' }">
                  <span v-if="item.percent >= 80">{{ formatNumber(item.contribute) }}</span>
                </div>
                <span v-if="item.percent < 80" class="val">{{ formatNumber(item.contribute) }}</span>
              </div>
            </ElTooltip>
          </li>
        </ul>
        <div v-if="displayData.length" class="bar-columns">
          <div class="num"><span>0</span></div>
          <div class="num">
            <span>{{ formatNumber(Math.floor(max / 2)) }}</span>
          </div>
          <div class="num">
            <span>{{ max }}</span>
          </div>
        </div>
      </template>
      <div v-else class="empty-pic">
        <OIcon>
          <IconEmpty />
        </OIcon>
        <p>暂无数据</p>
      </div>
    </div>
  </SectionCard>
</template>
<style lang="scss" scoped>
.o-divider {
  --o-divider-gap: 24px;
}

.empty-pic {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

:deep(.el-form-item__label) {
  padding-right: 40px;
  @include text1;
  line-height: var(--o-control_size-m) !important;
}

.bar-panel {
  position: relative;
  padding-bottom: 12px;
  .bar-columns {
    position: absolute;
    bottom: 0;
    top: 0;
    left: 324px;
    display: flex;
    justify-content: space-between;
    right: 0;
    .num {
      color: #9097a3;
      font-size: 12px;
      position: relative;
      display: flex;
      align-items: end;
      min-width: 8px;
      &::after {
        position: absolute;
        top: 0;
        left: 48%;
        width: 1px;
        border-left: 1px dashed #ccc;
        bottom: 20px;
        content: '';
      }
      &:last-child {
        &::after {
          left: inherit;
          right: 0;
        }
      }
    }
  }
}
.bar-content {
  position: relative;
  z-index: 2;
  .bar-content-item {
    margin: 16px 0;
    list-style: none;
    display: flex;
    justify-content: space-between;
    .infos {
      font-size: 16px;
      line-height: 22px;

      display: flex;
      .index {
        width: 16px;
        margin-right: 8px;
        font-size: 16px;
        color: #9097a3;
        text-align: center;
      }
      .name {
        cursor: pointer;
        color: var(--o-color-primary1);
        width: 304px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
.progress {
  height: 24px;
  display: flex;
  width: 100%;
  align-items: center;
  .progress-inner {
    background: var(--o-color-primary1);
    box-shadow: 4px 8px 12px 0px rgba(0, 92, 219, 0.25);
    font-size: 12px;
    color: #fff;
    height: 100%;
    display: flex;
    justify-content: end;
    align-items: center;
    padding-right: 0px;
    transition: all 0.3s ease-in-out;
    span {
      padding-right: 4px;
    }
  }
  .val {
    color: #000;
    font-size: 12px;
    margin-left: 8px;
  }
}
.bar-tooltip {
  padding: 12px 16px;
  box-shadow:
    4px 8px 16px 0px rgba(10, 11, 13, 0.05),
    0px 0px 32px 0px rgba(10, 11, 13, 0.1);

  .lable {
    color: #9097a3;
    font-weight: bold;
    .text {
      font-weight: 100;
    }
  }
  .info {
    color: #4e5865;
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    .index {
      color: #9097a3;
    }
    .num {
      font-size: 16px;
      color: #000000;
      margin-right: 8px;
      margin-left: 16px;
      .percentage {
        margin-left: 10px;
        font-size: 12px;
        color: #4e5865;
      }
    }
  }
}
</style>
