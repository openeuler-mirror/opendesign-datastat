<script setup lang="ts">
import CommonLayout from '@/components/CommonLayout.vue';
import { OBreadcrumb, OBreadcrumbItem } from '@opensig/opendesign';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Sidebar from './Sidebar.vue';
import ContributionData from './ContributionData.vue';
import ContributeDynamic from './ContributeDynamic.vue';

const { locale, t } = useI18n();
const route = useRoute();
</script>

<template>
  <CommonLayout>
    <OBreadcrumb>
      <OBreadcrumbItem :to="`/${locale}/detail`">{{ t('common.nav.contributors') }}</OBreadcrumbItem>
      <OBreadcrumbItem style="color: var(--o-color-primary1)">{{ route.params.id }}</OBreadcrumbItem>
    </OBreadcrumb>

    <ElRow style="margin-top: 26px" :gutter="32">
      <ElCol :span="7">
        <Sidebar />
      </ElCol>
      <ElCol :span="17">
        <ContributionData />
        <ContributeDynamic style="margin-top: 32px;" />
      </ElCol>
    </ElRow>
  </CommonLayout>
</template>
