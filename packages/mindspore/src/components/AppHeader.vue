<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCommonStore } from '@/stores/common';
import { openCommunityInfo } from '@/api/index';
import AppHeaderMobile from './AppHeaderMobile.vue';
import { useI18n } from 'vue-i18n';
import ONav from 'shared/components/ONav.vue';
import { useRouter, useRoute } from 'vue-router';
import { IObject } from 'shared/@types/interface';

import logoWhite from '@/assets/datastat.png';
import logoWhiteZh from '@/assets/datastat-zh.png';
import communityLogoWhite from '@/assets/mindspore-logo.png';
import chevronDown from '~icons/app/chevron-down';

const useCommon = useCommonStore();
const router = useRouter();
const route = useRoute();
const { locale } = useI18n();

const navList = computed(() => {
  return [
    // {
    //   id: 'overview',
    //   label: t('nav.overview'),
    //   href: '/overview',
    // },
  ];
});
const language = computed(() => useCommon.language);
const ISPC = computed(() => useCommon.ISPC);

// 选择语言
const options = ref([
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
]);
const langAttr = ref<string>('中文');
// 选择语言
const handleCommand = (command: IObject): void => {
  langAttr.value = command.label;
  localStorage.setItem('lang', command.value);
  locale.value = command.value;
  const { href } = window.location;
  const newHref = href.split('/').slice(-1).toString();
  useCommon.setLanguage(command.value);
  router.push(`/${command.value}/${newHref}`);
};

const goHome = () => {
  const lang = language.value === 'zh' ? '/zh/overview' : '/en/overview';
  router.push(lang);
};

const isAbout = ref(false);
watch(
  () => {
    return route.path;
  },
  (path) => {
    const p = path.split('/').slice(-1).toString();
    isAbout.value = p === 'about' ? true : false;
  }
);

watch(
  () => {
    return locale.value;
  },
  (val) => {
    useCommon.language = val;
    webSiteTitle();
  }
);
const webSiteTitle = () => {
  document.title =
    language.value === 'zh' ? 'MindSpore 贡献看板' : 'MindSpore DATASTAT';
};
webSiteTitle();
</script>

<template>
  <div v-if="ISPC" class="app-header" :class="{ isabout: isAbout }">
    <div class="wrap">
      <div class="header-logo">
        <img
          class="logo"
          alt="logo"
          :src="language == 'zh' ? logoWhiteZh : logoWhite"
          @click="goHome"
        />
        <span class="line"></span>
        <a
          target="_blank"
          :href="
            language == 'zh'
              ? openCommunityInfo.link
              : openCommunityInfo.link_en
          "
          ><img class="community-logo" :src="communityLogoWhite"
        /></a>
      </div>
      <ONav :nav-items="navList"></ONav>
      <div class="language">
        <el-dropdown popper-class="language-change" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ language == 'zh' ? '中文' : 'English' }}</span
          >
          <o-icon><chevron-down></chevron-down></o-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, key) in options"
                :key="key"
                :class="{ active: language === item.value }"
                :command="item"
                >{{ item.label }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
  <div v-else class="app-header-mo">
    <app-header-mobile></app-header-mobile>
  </div>
</template>

<style lang="scss">
$color: #ffffff;
.app-header {
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  z-index: 99;
  .wrap {
    display: flex;
    height: 80px;
    align-items: center;
  }
  &.isabout {
    background: #000;
  }
}

.app-header-mo {
  height: 48px;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  .menu-bar {
    position: absolute;
    left: 16px;
    top: 12px;
    &.white svg {
      color: #fff;
    }
  }
  :deep(.svg-icon) {
    color: #fff;
  }
}

.header-logo {
  display: flex;
  align-items: center;
  .line {
    height: 16px;
    background: #fff;
    margin: 0 16px;
    display: block;
    width: 1px;
    opacity: 0.8;
  }
  .logo,
  .community-logo {
    height: 32px;
    cursor: pointer;
  }
}
@media screen and (max-width: 700px) {
  .header-logo .logo,
  .header-logo .community-logo {
    height: 24px;
  }
}
.language {
  width: 100px;
  text-align: right;
  .el-dropdown {
    color: #fff;
    cursor: pointer;
    &-link {
      color: #fff;
    }

    .o-icon {
      margin-left: 5px;
    }
  }
}
.el-dropdown-menu__item {
  justify-content: center;
}
</style>
