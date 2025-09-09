<script setup lang="ts">
import SectionCard from '@/components/SectionCard.vue';
import ToggleRadios from '@/components/ToggleRadios.vue';
import useCommonFilters from '@/composables/useCommonFilters';
import { ODivider, OIcon, OIconSearch, OInput, OLink, OOption, OPagination, ORadio, ORadioGroup, OSelect } from '@opensig/opendesign';
import { refDebounced } from '@vueuse/core';
import { request } from 'shared/plugins/axios';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import IconEmpty from '~icons/app/empty.svg';

const { t } = useI18n();
const route = useRoute();
const userName = computed(() => route.params.id as string);

const defaultSigOption = { label: '全部', value: '' };
const sigs = ref<{ label: string; value: string }[]>([defaultSigOption]);
const selectedSig = ref('');
const onClearSigs = () => {
  nextTick(() => {
    selectedSig.value = '';
  });
};
const updateSigs = () => {
  const commonParams = {
    community: 'openubmc',
    user: userName.value,
  } as Record<string, any>;
  if (timeRange.value?.length === 2) {
    const end = new Date(timeRange.value[1]);
    end.setDate(end.getDate() + 1);
    commonParams.start = timeRange.value[0].getTime();
    commonParams.end = end.getTime();
  }
  sigs.value = [defaultSigOption];

  const set = new Set<string>();
  ['pr', 'issue', 'comment']
    .map((type) => {
      const params = { ...commonParams, contributeType: type };
      return request.get('/api-magic/stat_new/sigcontribute', { params }).then((res) => res.data ?? {});
    })
    .forEach((res) => {
      res.then((res) => {
        if (res.code !== 1 || !res.data) return;
        sigs.value.push(
          ...res.data
            .filter((item: any) => {
              if (set.has(item.sig_name)) return false;
              set.add(item.sig_name);
              return true;
            })
            .map((item: any) => ({ label: item.sig_name, value: item.sig_name }))
        );
      });
    });
};
watch(userName, updateSigs);

const { contributionTypeOptions, contributionType, contributionTypeLabel, timeRange, commentType, commentTypeOptions, disabledTimeRange } = useCommonFilters();

const searchInput = ref('');
const searchInputDebounced = refDebounced(searchInput, 300);

const total = ref(0);
const listData = ref<
  {
    info: string;
    repo: string;
    time: string;
    url: string;
    no: string;
  }[]
>([]);
const page = ref(1);
const pageSize = ref(10);

const commonParams = computed(() => {
  const res = {
    community: 'openubmc',
    contributeType: contributionType.value,
    user: userName.value,
    sig: selectedSig.value,
    filter: searchInput.value,
    comment_type: contributionType.value === 'comment' ? commentType.value : null,
  };
  if (timeRange.value?.length === 2) {
    const end = new Date(timeRange.value[1]);
    end.setDate(end.getDate() + 1);
    Object.assign(res, {
      start: timeRange.value[0].getTime(),
      end: end.getTime(),
    });
  }
  return res;
});

const queryTotal = () => {
  request
    .get(`/api-magic/stat_new/${contributionType.value}/count`, { params: commonParams.value })
    .then((res) => res.data ?? {})
    .then((res) => {
      if (res.code !== 1 || !res.data) {
        total.value = 0;
        return;
      }
      total.value = res.data[contributionType.value];
    })
    .catch(() => (total.value = 0));
};

const queryData = () => {
  request
    .get(`/api-magic/stat_new/${contributionType.value}/detail`, {
      params: {
        ...commonParams.value,
        page: page.value,
        pageSize: pageSize.value,
      },
    })
    .then((res) => res.data ?? {})
    .then((res) => {
      if (res.code !== 1 || !res.data) {
        listData.value = [];
        return;
      }
      listData.value = res.data;
    })
    .catch(() => (listData.value = []));
};

const updateData = async () => {
  await nextTick();
  page.value = 1;
  queryTotal();
  queryData();
};

watch([userName, searchInputDebounced], updateData);
onMounted(() => {
  updateData();
  updateSigs();
});

const onPageChange = () => {
  queryData();
};
</script>

<template>
  <SectionCard>
    <template #header> {{ userName }} {{ t('common.DynamicContribute') }} </template>

    <ElForm label-width="auto" label-position="right" style="--el-text-color-regular: #000">
      <ElFormItem :label="`SIG${t('common.filtrate')}`">
        <OSelect v-model="selectedSig" clearable @change="updateData" @clear="onClearSigs">
          <OOption v-for="item in sigs" :key="item.value" :value="item.value" :label="item.label" />
        </OSelect>
      </ElFormItem>
      <ElFormItem :label="t('common.from.type')">
        <ToggleRadios v-model="contributionType" :options="contributionTypeOptions" @change="updateData" />
      </ElFormItem>
      <ElFormItem v-if="contributionType === 'comment'" label=" ">
        <div v-if="contributionType === 'comment'">
          <ORadioGroup v-model="commentType" @change="updateData">
            <ORadio v-for="item in commentTypeOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </ORadio>
          </ORadioGroup>
        </div>
      </ElFormItem>
      <ElFormItem :label="t('common.from.timeRange')">
        <ElDatePicker
          unlink-panels
          v-model="timeRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="updateData"
          :disabled-date="disabledTimeRange"
        />
      </ElFormItem>
    </ElForm>

    <ODivider style="--o-divider-gap: 24px" />

    <OInput v-model="searchInput" :placeholder="t('common.enterWord')" clearable>
      <template #prefix
        ><OIcon style="font-size: 16px"><OIconSearch /></OIcon
      ></template>
    </OInput>

    <p class="result-desc">{{ contributionTypeLabel }} {{ t('common.total') }}（{{ total }}）{{ t('common.bar') }}</p>

    <template v-if="listData.length">
      <template v-for="(item, index) in listData" :key="`${contributionType}_${item.no}_${page}_${index}`">
        <p class="list-data-item-time">{{ item.time }}</p>
        <div class="list-data-item" v-if="contributionType !== 'comment'">
          在
          <OLink hover-underline color="primary" :href="`https://gitcode.com/${item.repo}`" rel="noopener noreferrer" target="_blank">{{ item.repo }}</OLink>
          创建了<OLink hover-underline color="primary" :href="item.url" rel="noopener noreferrer" target="_blank"
            >{{ contributionType === 'pr' ? 'Pull Request' : 'Issue' }} {{ item.info }}</OLink
          >
        </div>
        <div class="list-data-item" v-else>
          评论了
          <OLink hover-underline color="primary" :href="`https://gitcode.com/${item.repo}`" rel="noopener noreferrer" target="_blank">{{ item.repo }}</OLink>
          的Pull Request<OLink hover-underline color="primary" :href="item.url" rel="noopener noreferrer" target="_blank">{{ item.info }}</OLink>
        </div>
      </template>
    </template>
    <div v-else class="empty-pic">
      <OIcon style="margin-bottom: 16px"><IconEmpty /></OIcon>
      暂无数据
    </div>

    <OPagination
      v-if="total > 0"
      v-model:page="page"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50]"
      :total="total"
      show-total
      style="margin-top: 24px"
      @change="onPageChange"
    />
  </SectionCard>
</template>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  padding-right: 40px;
  @include text1;
  line-height: var(--o-control_size-m) !important;
}
.o-pagination {
  --pagination-item-bg-color-current: var(--o-color-primary1);
  --pagination-item-color-current: #fff;
}
:deep(.o-pagination-wrap) {
  justify-content: flex-end;
}

.empty-pic {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.list-data-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 8px;
  &:not(:last-child) {
    margin-bottom: 16px;
  }
}

.result-desc {
  @include text1;
  margin: 24px 0;
}

.content-card {
  padding: 24px;
  background: #fff;
  border-radius: 4px;

  .card-title {
    @include h1;
    margin-bottom: 32px;
  }
}
</style>
