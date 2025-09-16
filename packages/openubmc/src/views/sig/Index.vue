<script setup lang="ts">
import CommonLayout from '@/components/CommonLayout.vue';
import ToggleRadios from '@/components/ToggleRadios.vue';
import { OBreadcrumb, OBreadcrumbItem, OCheckbox, OCheckboxGroup, ODivider, OIcon, OIconSearch, OInput, OLink, OPagination } from '@opensig/opendesign';
import { refDebounced } from '@vueuse/core';
import { request } from 'shared/plugins/axios';
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Sidebar from './Sidebar.vue';
import useCommonFilters from '@/composables/useCommonFilters';
import SectionCard from '@/components/SectionCard.vue';

const { t } = useI18n();
const { locale } = useI18n();
const route = useRoute();

const sigName = computed(() => route.params.id as string);

watch(
  () => route.params.id as string,
  (val) => {
    if (val && typeof val === 'string') {
      getContributionData();
    }
  }
);

const { contributionTypeOptions, contributionType, contributionTypeLabel, timeRange } = useCommonFilters();

const searchGitcodeId = ref('');
const debouncedSearchGitCodeId = refDebounced(searchGitcodeId, 400);

const userTypeOptions = ref([
  { label: 'Maintainer', value: 'maintainer', color: 'rgb(0, 98, 220)' },
  { label: 'Committer', value: 'committer', color: 'rgb(240, 188, 0)' },
  { label: 'Contributor', value: 'contributor', color: 'rgb(0, 167, 179)' },
]);
const userType = ref(userTypeOptions.value.map((d) => d.value));
const userTypeColorMap = userTypeOptions.value.reduce(
  (acc, { value, color }) => {
    acc[value] = color;
    return acc;
  },
  {} as Record<string, string>
);

const contributionData = shallowRef<
  {
    contribute: number;
    user_login: string;
    usertype: string;
  }[]
>([]);
const maxContributionNum = computed(() => {
  if (contributionData.value.length === 0) return 0;
  return Math.max(...contributionData.value.map((d) => d.contribute));
});

const filteredDataList = computed(() => {
  let res = contributionData.value;
  if (userType.value.length) {
    res = res.filter((d) => userType.value.includes(d.usertype));
  }
  if (debouncedSearchGitCodeId.value) {
    const lowercase = debouncedSearchGitCodeId.value;
    res = res.filter((d) => d.user_login.toLocaleLowerCase().includes(lowercase));
  }
  return res;
});

const page = ref(1);
const pageSize = ref(10);
const pageSizes = [10, 15, 30, 50];
const displayContributionData = computed(() => {
  const start = (page.value - 1) * 10;
  return filteredDataList.value.slice(start, start + pageSize.value);
});

const onUserTypeChange = () => {
  page.value = 1;
};

const getContributionData = () => {
  const params = {
    community: 'openubmc',
    contributeType: contributionType.value,
    sig: sigName.value,
  } as Record<string, any>;
  if (timeRange.value?.length === 2) {
    params.start = timeRange.value[0].getTime();
    params.end = timeRange.value[1].getTime();
  }
  request
    .get('/api-magic/stat_new/sig/user/contribute', { params })
    .then((res) => res.data ?? {})
    .then((res) => {
      if (res.code === 1 && res.data) {
        contributionData.value = res.data;
      }
    });
};

onMounted(() => {
  getContributionData();
});

const router = useRouter();
const toUserDetail = (id: string) => {
  router.push({ name: 'user-detail', params: { id, lang: locale.value ?? 'zh' } });
};

const now = new Date();
now.setHours(0, 0, 0, 0);
const start = new Date(2024, 10, 1);
const disabledDate = (time: Date) => {
  return time < start || time > now;
}
</script>

<template>
  <CommonLayout>
    <OBreadcrumb>
      <OBreadcrumbItem :to="`/${locale}/detail`">{{ t('common.nav.contributors') }}</OBreadcrumbItem>
      <OBreadcrumbItem style="color: var(--o-color-primary1)">{{ route.params.id }}</OBreadcrumbItem>
    </OBreadcrumb>

    <ElRow style="margin-top: 24px" :gutter="24">
      <ElCol :span="7">
        <Sidebar />
      </ElCol>
      <ElCol :span="17">
        <SectionCard>
          <template #header> {{ sigName }}{{ t('common.userContributor') }} </template>
          <ElForm label-width="auto" label-position="right" style="--el-text-color-regular: #000">
            <ElFormItem :label="t('common.from.type')">
              <ToggleRadios v-model="contributionType" :options="contributionTypeOptions" @change="getContributionData" />
            </ElFormItem>
            <ElFormItem :label="t('common.from.timeRange')">
              <ElDatePicker
                v-model="timeRange"
                unlink-panels
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getContributionData"
                :disabled-date="disabledDate"
              />
            </ElFormItem>
          </ElForm>

          <ODivider />

          <div class="search-toggle">
            <OInput v-model="searchGitcodeId" :placeholder="t('common.enterGitee')">
              <template #prefix
                ><OIcon style="font-size: 16px"><OIconSearch /></OIcon
              ></template>
            </OInput>

            <OCheckboxGroup v-model="userType" @change="onUserTypeChange">
              <OCheckbox v-for="item in userTypeOptions" :key="item.value" :value="item.value">
                <template #checkbox="{ checked }">
                  <div class="user-type-radio">
                    <div class="dot" :style="{ backgroundColor: checked ? item.color : 'rgb(204, 204, 204)' }"></div>
                    <p class="desc">{{ item.label }}</p>
                  </div>
                </template>
              </OCheckbox>
            </OCheckboxGroup>
          </div>

          <div style="border-radius: 4px; overflow: hidden">
            <ElTable :data="displayContributionData" :header-cell-style="{ backgroundColor: 'rgb(232, 232, 235)', color: '#000', fontWeight: '500' }">
              <ElTableColumn :label="t('common.Number')" width="60">
                <template #default="{ $index }">
                  <span>{{ $index + 1 }}</span>
                </template>
              </ElTableColumn>
              <ElTableColumn label="GitCode ID" width="180">
                <template #default="{ row }">
                  <OLink color="primary" hover-underline style="--link-gap: 4px" @click="toUserDetail(row.user_login)">
                    <template #icon><div class="dot" :style="{ backgroundColor: userTypeColorMap[row.usertype as string] }"></div></template>
                    {{ row.user_login }}
                  </OLink>
                </template>
              </ElTableColumn>
              <ElTableColumn :label="contributionTypeLabel">
                <template #default="{ row }">
                  <div class="data-column-cell">
                    <span class="contribution-data">{{ row.contribute }}</span>
                    <ElProgress
                      v-if="row.contribute > 0"
                      :show-text="false"
                      :color="userTypeColorMap[row.usertype as string]"
                      :percentage="Math.floor((row.contribute * 100) / maxContributionNum)"
                    />
                  </div>
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
          <OPagination
            v-if="contributionData.length"
            :total="filteredDataList.length"
            :page-sizes="pageSizes"
            v-model:page="page"
            v-model:page-size="pageSize"
            show-total
            style="margin-top: 24px"
          />
        </SectionCard>
      </ElCol>
    </ElRow>
  </CommonLayout>
</template>

<style lang="scss" scoped>
.section-card {
  height: 100%;
}

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

.el-progress {
  width: 550px;
  :deep(.el-progress-bar__outer) {
    background-color: transparent;
  }
}

.data-column-cell {
  display: flex;
  align-items: center;

  .contribution-data {
    width: 50px;
    margin-right: 8px;
  }
}

.dot {
  display: inline-block;
  margin-right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
}

.user-type-radio {
  display: flex;
  align-items: center;
  .desc {
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
    line-height: 18px;
  }
}

.search-toggle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 28px;
}
</style>
