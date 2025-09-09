<script setup lang="ts">
import CommonLayout from '@/components/CommonLayout.vue';
import CompanyContribution from './CompanyContribution.vue';
import UserContribution from './UserContribution.vue';
import SigOverview from './SigOverview.vue';
import useScroll from 'shared/hooks/useScroll';
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import OBanner from 'shared/components/OBanner.vue';
import titleBg from '@/assets/title-bg.png';
import ChevronsUp from '~icons/shared/chevrons-up';

const { t, locale } = useI18n();
const { isScrollUp } = useScroll('up');
const router = useRouter();

watch(
  () => isScrollUp.value,
  () => {
    if (isScrollUp.value) {
      toOverview();
    }
  }
);

const toOverview = () => {
  router.push({ name: 'overview', params: { lang: locale.value } });
};
</script>

<template>
  <div>
    <OBanner :style="{ backgroundImage: 'url(' + titleBg + ')' }">
      <div class="banner-title" @click="toOverview">
        <div class="o-icon"><ChevronsUp></ChevronsUp></div>
        <h3 class="title">{{ t('common.backVitality') }}</h3>
      </div>
    </OBanner>
    <CommonLayout>
      <CompanyContribution />
      <UserContribution style="margin-top: 32px" />
      <SigOverview style="margin-top: 32px" />
    </CommonLayout>
  </div>
</template>

<style lang="scss" scoped>
.common-layout {
  padding-top: 28px;
}
.o-banner {
  height: 224px;
  padding-top: 80px;
}
.banner-title {
  cursor: pointer;
  height: 144px;
  text-align: center;
  padding-top: 80px;
  .title {
    font-size: 16px;
    font-weight: 100;
    color: #fff;
    line-height: 24px;
  }
  .o-icon {
    color: #fff;
    animation: chevronsUp 2s infinite;
  }
}
</style>
