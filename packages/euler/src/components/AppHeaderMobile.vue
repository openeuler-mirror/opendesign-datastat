<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '@/stores/common';
import { openCommunityInfo } from '@/api/index';
import { useRoute, useRouter } from 'vue-router';

import logoWhite from '@/assets/datastat.png';
import logoWhiteZh from '@/assets/datastat-zh-mo.png';
import logoBlack from '@/assets/datastat-black.png';
import logoBlackZh from '@/assets/datastat-zh-black.png';
import communityLogoSmall from '@/assets/openeuler-small.png';
import communityLogoSmallWhite from '@/assets/openeuler-small-white.png';

import menuIcons from '~icons/app/menu';
import xIcons from '~icons/app/x';

const useCommon = useCommonStore();
const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const navList = computed(() => {
  return [
    {
      id: 'overview',
      label: t('nav.overview'),
      zh: 'zh_overview',
      en: 'en_overview',
    },
    {
      id: 'detail',
      label: t('nav.contributors'),
      zh: 'zh_detail',
      en: 'en_detail',
    },
  ];
});

const drawer = ref(false);
const menuIcon = ref('menu');
const isblack = computed(() => useCommon.isBlackHeader);
const drawerBlack = computed(() => (isblack.value ? 'black' : ''));
const navActive = ref('overview');
watch(
  () => {
    return useCommon.isBlackHeader;
  },
  (val) => {
    navActive.value = val ? 'overview' : 'detail';
  }
);

// 移动端菜单事件
const changeMenu = () => {
  if (!drawer.value) {
    menuIcon.value = 'x';
    drawer.value = true;
  } else {
    drawer.value = false;
    menuIcon.value = 'menu';
  }
};
// 关闭drawer
const handleClose = () => {
  changeMenu();
};
// mo导航事件
const moNavClick = (id: string) => {
  changeMenu();
  setTimeout(() => {
    if (id === 'overview') {
      useCommon.moNav = 0;
    } else {
      useCommon.moNav = 2;
    }
  }, 200);
};

const language = computed(() => (useCommon.language === 'zh' ? false : true));

const languageRadio = ref(language.value);
const chaneLanguage = () => {
  let lang = languageRadio.value ? 'en' : 'zh';
  localStorage.setItem('lang', lang);
  locale.value = lang;
  const { href } = window.location;
  const newHref = href.split('/').slice(-1).toString();
  useCommon.setLanguage(lang);
  router.push(`/${lang}/${newHref}`);
  webSiteTitle();
  drawer.value = false;
};
const webSiteTitle = () => {
  document.title =
    useCommon.language === 'zh' ? 'openEuler 贡献看板' : 'openEuler DATASTAT';
};
webSiteTitle();

// 判断是否是主页面
const isHome = ref(false);
watch(
  () => {
    return route.path;
    webSiteTitle();
  },
  (path) => {
    const p = path.split('/').slice(-1).toString();
    isHome.value = p === 'mobile' ? true : false;
  }
);
// 点击logo回首页
const goMobileHome = () => {
  if (!isHome.value) {
    const lang = useCommon.language === 'zh' ? '/zh/mobile' : '/en/mobile';
    router.push(lang);
  }
  useCommon.moNav = 0;
  useCommon.isBlackHeader = true;
};
</script>

<template>
  <div
    v-if="isHome"
    class="menu-bar"
    :class="{ white: isblack }"
    @click="changeMenu"
  >
    <o-icon
      ><menu-icons v-if="!drawer"></menu-icons><x-icons v-else></x-icons
    ></o-icon>
  </div>
  <div class="header-logo">
    <template v-if="isblack">
      <img
        class="logo"
        alt="logo"
        :src="!language ? logoWhiteZh : logoWhite"
        @click="goMobileHome"
      />
      <span class="line"></span>
      <a target="_blank" :href="openCommunityInfo.link"
        ><img class="community-logo" :src="communityLogoSmallWhite"
      /></a>
    </template>
    <template v-else>
      <img
        class="logo"
        alt="logo"
        :src="!language ? logoBlackZh : logoBlack"
        @click="goMobileHome"
      />
      <span class="line" style="background: #000"></span>
      <a target="_blank" :href="openCommunityInfo.link"
        ><img class="community-logo" :src="communityLogoSmall"
      /></a>
    </template>
  </div>
  <el-drawer
    v-model="drawer"
    append-to-body
    title=""
    :modal-class="drawerBlack"
    :size="'45%'"
    :with-header="false"
    direction="ltr"
    :before-close="handleClose"
  >
    <div class="drawer-panel">
      <div class="drawer-nav">
        <a
          v-for="item in navList"
          :key="item.id"
          class="link"
          :class="{ active: navActive === item.id }"
          href="javascript:;"
          @click="moNavClick(item.id)"
          >{{ item.label }}</a
        >
      </div>
      <div class="action">
        <el-switch
          v-model="languageRadio"
          size="large"
          active-text="English"
          inactive-text="中文"
          active-color="#002fa7"
          @click="chaneLanguage"
        />
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss">
:deep(.el-switch) {
  color: #999;
}
.el-overlay {
  top: 48px !important;
  height: calc(100% - 48px) !important;
  width: 100%;
  overflow: hidden;
  &.black {
    background-color: rgba(255, 255, 255, 0.5) !important;
    .el-drawer {
      background: #191e27;
      &__body {
        .drawer-nav {
          .link {
            color: #fff;
          }
          .active {
            color: #fff;
            background: #000;
            &::after {
              display: block;
            }
          }
        }
      }
    }
  }
  .el-drawer {
    background: #f5f6f8;
    &__body {
      padding: 0;
      overflow: hidden;
      .drawer-panel {
        position: relative;
        height: 100%;
        .action {
          position: absolute;
          bottom: 20px;
          left: 16px;
          color: #999;
        }
      }
      .drawer-nav {
        .link {
          display: block;
          line-height: 48px;
          padding: 0 16px;
          color: #000;
          font-size: 12px;
          position: relative;
          &::after {
            width: 36px;
            height: 2px;
            background: #002fa7;
            position: absolute;
            bottom: 0;
            left: 16px;
            content: '';
            display: none;
          }
        }
        .active {
          color: #000;
          background: #fff;
          &::after {
            display: block;
          }
        }
      }
    }
  }
}
</style>
