<script setup lang="ts">
import { computed } from 'vue';
import { openCommunityInfo } from '@/api/index';
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '@/stores/common';
import { getYearByOffset } from 'shared/utils/helper';

import logo from '@/assets/datastat.png';
import logoZh from '@/assets/datastat-zh.png';
import communityLogo from '@/assets/openeuler-logo.png';
import atomLogo from '@/assets/atom-pc.svg';

const { t, locale } = useI18n();
const useCommon = useCommonStore();
const language = computed(() => useCommon.language);

locale.value = localStorage.getItem('lang') || 'zh';
const aboutCookie = computed(() => `https://www.openeuler.org/${locale.value || 'zh'}/other/cookies/`)
</script>

<template>
  <div class="footer wrap">
    <div class="footer-info">
      <div class="footer-logo">
        <img
          class="logo"
          alt="openEuler logo"
          :src="language == 'zh' ? logoZh : logo"
        />
        <span class="line"></span>
        <a target="_blank" :href="openCommunityInfo.link"
          ><img class="community-logo" :src="communityLogo"
        /></a>
      </div>
      <a
        class="footer-email"
        target="_blank"
        :href="`mailto:${openCommunityInfo.email}`"
        >{{ openCommunityInfo.email }}</a
      >
      <p class="copyright">
        {{ t('footer.copyright', { year: getYearByOffset() }) }}
      </p>
    </div>
    <div class="footer-option">
      <img class="atom-pc" :src="atomLogo" alt="" />
      <p class="text">{{ t('footer.atom') }}</p>
    </div>
    <ul class="footer-about">
      <li>
        <router-link
          target="_blank"
          :to="language === 'zh' ? '/zh/about' : '/en/about'"
          >{{ t('footer.about') }}</router-link
        >
      </li>
      <li>
        <a :href="t('footer.privacyLink')" target="_blank">{{
          t('footer.privacy')
        }}</a>
      </li>
      <li>
        <a :href="t('footer.legalLink')" target="_blank">{{
          t('footer.legal')
        }}</a>
      </li>
      <li>
        <a :href="aboutCookie" target="_blank">{{
          t('cookie.about')
        }}</a>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  // margin-top: 64px;
  height: 200px;
  padding: 60px 24px;
  display: grid;
  align-items: center;
  grid-template-columns: auto auto auto;
  .footer-logo {
    display: flex;
    align-items: center;
    .line {
      height: 24px;
      background: #fff;
      margin: 0 16px;
      display: block;
      width: 1px;
      opacity: 0.8;
    }
    .logo,
    .community-logo {
      height: 32px;
    }
  }
  .footer-email {
    display: block;
    line-height: inherit;
    font-size: 12px;
    color: #fff;
    margin-top: 16px;
  }

  .copyright {
    font-size: 12px;
    color: #fff;
    opacity: 0.8;
    margin-top: 8px;
  }
  .footer-option {
    width: 340px;
    text-align: center;
    .atom-pc {
      height: 48px;
    }
    .text {
      font-size: 12px;
      line-height: 20px;
      color: #fff;
      margin-top: 8px;
      opacity: 0.8;
    }
  }
  .footer-about {
    display: grid;
    justify-content: end;
    a {
      font-size: 14px;
      color: #ffffff;
      line-height: 26px;
    }
  }
}
</style>
