<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { showGuard, logout } from 'shared/utils/login';

import Logo from '~icons/app/logo.svg';
import LogoWhite from '~icons/app/logo-white.svg';
import IconLocale from '~icons/shared/icon-locale.svg';
import { openCommunityInfo } from '@/shared/common';
import { OIcon, OIconChevronDown } from '@opensig/opendesign';
import HeaderNav from './HeaderNav.vue';
import useLoginStore from '@/stores/login';
import LoadingArc from './LoadingArc.vue';

const loginStore = useLoginStore();
const dialogVisible = ref(false);
const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();

const navList = computed(() => [
  {
    name: 'overview',
    label: t('common.nav.overview'),
  },
  {
    name: 'detail',
    label: t('common.nav.contributors'),
  },
]);

const isOverview = computed(() => {
  return route.name === 'overview' || route.name === 'detail';
});

const backgroundColor = computed(() => {
  return isOverview.value ? 'transparent' : '#fff';
});

const headerTextColor = computed(() => {
  return isOverview.value ? '#fff' : '#000';
});

const language = computed(() => locale.value ?? 'zh')

// 选择语言;
const options = reactive([
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
]);

// 选择语言
const changeLanguage = (command: string) => {
  locale.value = command;
  router.push({ name: route.name, params: { lang: command }});
};

const goHome = () => {
  router.push({ name: 'overview', params: { lang: locale.value ?? 'zh' }});
};

watch(
  locale,
  () => {
    document.title = language.value === 'zh' ? 'openUBMC 贡献看板' : 'openUBMC DATASTAT';
  },
  { immediate: true }
);

const isAbout = computed(() => {
  const p = route.path.split('/').slice(-1).toString();
  return p === 'about';
});

const jumpToUserZone = () => {
  window.open('https://www.openubmc.cn/my/collections', '_blank');
};

const logoutConfirm = () => {
  dialogVisible.value = false;
  logout();
}
</script>

<template>
  <header class="app-header" :class="{ isabout: isAbout }">
    <div class="wrap">
      <div class="header-logo">
        <p class="header-title" @click="goHome">{{ t('common.datastat') }}</p>
        <span class="line"></span>
        <a target="_blank" :href="openCommunityInfo.link">
          <OIcon style="width: 120px;">
            <LogoWhite v-if="isOverview" />
            <Logo v-else />
          </OIcon>
        </a>
      </div>
      <HeaderNav :lang="language" :navs="navList" style="--color: var(--o-color-primary1);"></HeaderNav>
      <!-- <div class="language">
        <el-dropdown popper-class="language-change" @command="changeLanguage">
          <div class="lang-change-icon-wrapper">
            <OIcon class="lang-change-icon">
              <IconLocale />
              <div class="lang-icon-label">{{ language === 'zh' ? '中' : 'EN' }}</div>
            </OIcon>
            <OIcon style="margin-left: 4px;"><OIconChevronDown /></OIcon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(item, key) in options" :key="key" :class="{ active: language === item.value }" :command="item.value">
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div> -->

      <div class="opt-user">
        <LoadingArc v-if="loginStore.logining" />
        <el-dropdown v-else-if="loginStore.logined">
          <div class="user-info">
            <el-avatar v-if="loginStore.photo" :src="loginStore.photo" :alt="loginStore.nickname || 'LogOut'" class="user-avatar" />
            <span class="user-name">{{ loginStore.username }}</span>
            <OIcon style="margin-left: 4px;"><OIconChevronDown /></OIcon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="jumpToUserZone">{{ t('common.personalCenter') }}</el-dropdown-item>
              <el-dropdown-item @click="dialogVisible = true">{{ t('common.logout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div v-else class="login" @click="showGuard">
          {{ t('common.login') }}
        </div>
      </div>
      <el-dialog v-model="dialogVisible" :title="t('common.pleaseConfirm')" width="30%">
        <span>{{ t('common.titleConfirm') }}</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">{{ t('common.Cancel') }}</el-button>
            <el-button type="primary" @click="logoutConfirm">{{ t('common.Confirm') }}</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </header>
</template>

<style lang="scss" scoped>
:deep(.o-badge-content) {
  top: 10px !important;
  right: 10px !important;
}
.app-header {
  background-color: v-bind(backgroundColor);
  position: absolute;
  min-width: 1024px;
  left: 0;
  right: 0;
  z-index: 99;
  top: 0;
  box-shadow: 0 3px 9px rgba(0, 18, 85, 0.08);
  .wrap {
    display: flex;
    height: var(--header-height);
    align-items: center;
  }

  transition: background-color 0.3s;
}

:deep(.nav-list .nav-item) {
  color: v-bind(headerTextColor);
}

:deep(.el-dropdown-menu__item) {
  justify-content: center;
}

.header-logo {
  display: flex;
  align-items: center;
  .header-title {
    cursor: pointer;
    font-size: 28px;
    font-weight: 600;
    white-space: nowrap;
    color: v-bind(headerTextColor);
  }
  .line {
    height: 16px;
    background: rgb(196,196,196);
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
@media screen and (max-width: 700px) {
  .header-logo .logo,
  .header-logo .community-logo {
    height: 24px;
  }
}
.language {
  text-align: right;
  .el-dropdown {
    color: #000;
    cursor: pointer;

    .o-icon {
      margin-left: 5px;
    }
  }

  .lang-change-icon-wrapper {
    display: flex;
    align-items: center;
  }

  .lang-change-icon {
    font-size: 24px;
    position: relative;
    color: v-bind(headerTextColor);
    transition: color 0.3s;
    svg {
      width: 1em;
      height: 1em;
    }
    .lang-icon-label {
      position: absolute;
      right: 0px;
      bottom: 2px;
      font-size: 10px;
      line-height: 10px;
      background-color: var(--e-color-bg2);
    }
  }
}
.el-dropdown-menu__item {
  justify-content: center;
}
.opt-user {
  margin-left: 20px;
  
  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
    }

    .user-name {
      @include text1;
      color: v-bind(headerTextColor);
      display: inline-block;
      margin-left: 8px;
      max-width: 90px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.login {
  // width: 96px;
  white-space: nowrap;
  height: 32px;
  color: v-bind(headerTextColor);
  line-height: 30px;
  // border: 1px solid #fff;
  text-align: center;
  // color: #fff;
  cursor: pointer;
  font-size: 16px;
}
</style>
