<script setup lang="ts">
import SectionCard from '@/components/SectionCard.vue';
import ToggleRadios from '@/components/ToggleRadios.vue';
import useCommonFilters from '@/composables/useCommonFilters';
import { usePersonalStore } from '@/stores/person';
import { ODivider, OLink, ORadio, ORadioGroup } from '@opensig/opendesign';
import { createReusableTemplate } from '@vueuse/core';
import { useScreen } from 'shared/hooks/useScreen';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { lePad } = useScreen()
const route = useRoute();
const personStore = usePersonalStore();
const { t } = useI18n();

const contributionTypeOptions = computed(() => [
  { label: t('common.home.prs'), value: 'pr' },
  { label: t('common.home.issues'), value: 'issue' },
  { label: t('common.home.comments'), value: 'comment' },
]);
const contributionTypeLabelMap = computed(
  () =>
    ({
      pr: t('common.home.prs'),
      issue: t('common.home.issues'),
      comment: t('common.home.comments'),
    }) as Record<string, string>
);

const commentTypeOptions = computed(() => [
  { label: t('common.from.all'), value: '' },
  { label: t('common.General'), value: 'normal' },
  { label: t('common.Order'), value: 'command' },
]);

onMounted(() => {
  personStore.getPersonalData();
});

const [Define, Reuse] = createReusableTemplate();

const { disabledTimeRange } = useCommonFilters();
</script>

<template>
  <SectionCard>
    <template #header>{{ t('common.userContributor') }}</template>
    <div>
      <ElForm label-width="auto" label-position="right" style="--el-text-color-regular: #000">
        <ElFormItem :label="t('common.from.type')">
          <div>
            <ToggleRadios v-model="personStore.personalForm.contributeType" :options="contributionTypeOptions" @change="personStore.getPersonalData" />
            <div v-if="personStore.personalForm.contributeType === 'comment'" style="margin-top: 16px">
              <ORadioGroup v-model="personStore.commentType" @change="personStore.getPersonalData">
                <ORadio v-for="item in commentTypeOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </ORadio>
              </ORadioGroup>
            </div>
          </div>
        </ElFormItem>
        <ElFormItem :label="t('common.from.timeRange')">
          <ElDatePicker
            v-model="personStore.personalForm.timeRange"
            unlink-panels
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="personStore.getPersonalData"
            :disabled-date="disabledTimeRange"
          />
        </ElFormItem>
      </ElForm>

      <ODivider direction="h" style="--o-divider-gap: 24px" />

      <div class="ranking-list">
        <Define v-slot="{ data, title, index }">
          <div class="ranking-list-item">
            <p class="caption">{{ title }}</p>
            <el-table
              v-loading="false"
              :data="data"
              style="width: 100%"
              :header-cell-style="{ backgroundColor: 'rgb(232, 232, 235)', color: '#000', fontWeight: '500px' }"
            >
              <el-table-column type="index" align="center" :index="index ?? 1" :label="t('common.Number')" width="100" />
              <el-table-column prop="user_login" align="left" label="GitCode ID" show-overflow-tooltip width="180"
                ><template #default="scope">
                  <OLink color="primary" :href="`/${route.params.lang}/user/${scope.row.user_login}`" target="_blank" rel="noreferrer noopener">
                    {{ scope.row.user_login }}
                  </OLink>
                </template>
              </el-table-column>
              <el-table-column :label="contributionTypeLabelMap[personStore.personalForm.contributeType]">
                <template #header>
                  <p class="bar-column-header">{{ contributionTypeLabelMap[personStore.personalForm.contributeType] }}</p>
                </template>
                <template #default="{ row }">
                  <div class="box">
                    <span class="num">{{ row.contribute }}</span>
                    <ElProgress
                      style="width: 280px"
                      :show-text="false"
                      :stroke-width="8"
                      :percentage="personStore.personalMaxNum ? (100 / personStore.personalMaxNum) * row.contribute : 0"
                    />
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </Define>

        <Reuse :data="personStore.highRanking" :title="lePad ? 'Top 1-20' : 'Top 1-10'" />
        <Reuse :data="personStore.lowRanking" title="Top 11-20" :index="11" />
      </div>
    </div>
  </SectionCard>
</template>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  padding-right: 40px;
  @include text1;
  line-height: var(--o-control_size-m) !important;
}

.custom-header {
  padding-left: 62px;
}

:deep(.el-progress) {
  margin-left: 10px;

  .el-progress-bar__outer {
    background: none;
  }
}

@media screen and (max-width: 1200px) {
  .ranking-list-item {
    margin-right: 0;
  }
}

.ranking-list {
  --el-color-primary: var(--o-color-primary1);
  display: flex;
  .ranking-list-item {
    flex: 1;
    &:first-child {
      margin-right: 32px;
    }
  }
  .bar-column-header {
    padding-left: 50px;
  }
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
}
</style>
