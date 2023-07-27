<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '@/stores/common';
import { useRoute, useRouter } from 'vue-router';

import menuIcons from '~icons/app/menu';
import xIcons from '~icons/app/x';
import {
  moNavList,
  companyNavList,
  sigNavList,
  NavConfig,
  personNavList,
} from '@/shared/mobile-menu.config';
import { IObject } from 'shared/@types/interface';
import { hasPermission } from 'shared/utils/login';

const useCommon: any = useCommonStore();
const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();

const drawer = ref(false);
const menuIcon = ref('menu');
const isblack = computed(() => useCommon.isBlackHeader);
const drawerBlack = computed(() => (useCommon.isBlackHeader ? 'black' : ''));
const navActive = ref(0);
const swiperKey = ref('moNav');
watch(
  () => route.name,
  (name) => getSwiperKey(name)
);
const getSwiperKey = (name: any) => {
  if (name?.includes('sig')) {
    swiperKey.value = 'sigNav';
  } else if (name?.includes('company')) {
    swiperKey.value = 'companyNav';
  } else if (name?.includes('user')) {
    swiperKey.value = 'personNav';
  } else {
    swiperKey.value = 'moNav';
  }
};
// 所有swiper的index
const allSwiperConfig = ref({
  moNav: {
    index: computed(() => useCommon.moNav),
    list: moNavList,
  },
  companyNav: {
    index: computed(() => useCommon.companyNav),
    list: companyNavList,
  },
  sigNav: {
    index: computed(() => useCommon.sigNav),
    list: sigNavList,
  },
  personNav: {
    index: computed(() => useCommon.personNav),
    list: personNavList,
  },
} as IObject);

watch(
  () => useCommon[swiperKey.value],
  () => getNavActive()
);
const getNavActive = () => {
  navActive.value = allSwiperConfig.value[swiperKey.value].list.reduce(
    (pre: number, next: NavConfig, index: number) => {
      if (allSwiperConfig.value[swiperKey.value].index >= Number(next?.index)) {
        pre = index;
      }
      return pre;
    },
    0
  );
};

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
const moNavClick = (id: number) => {
  changeMenu();
  setTimeout(() => {
    useCommon[swiperKey.value] = id;
  }, 200);
};

const language = computed(() => (useCommon.language === 'zh' ? false : true));

const languageRadio = ref(language.value);
const chaneLanguage = () => {
  let lang = languageRadio.value ? 'en' : 'zh';
  localStorage.setItem('lang', lang);
  locale.value = lang;
  const { pathname } = window.location;
  const newHref = pathname.split('/');
  newHref[1] = lang;
  useCommon.setLanguage(lang);
  router.push(newHref.join('/'));
  drawer.value = false;
};
const showItem = (test: boolean): boolean => {
  if (test) {
    return hasPermission('sigRead');
  }
  return true;
};
</script>

<template>
  <div class="menu-bar" :class="{ white: isblack }" @click="changeMenu">
    <o-icon
      ><menu-icons v-if="!drawer"></menu-icons><x-icons v-else></x-icons
    ></o-icon>
  </div>
  <el-drawer
    v-model="drawer"
    append-to-body
    title=""
    :modal-class="drawerBlack"
    :size="'80%'"
    :with-header="false"
    direction="ltr"
    :before-close="handleClose"
  >
    <div class="drawer-panel">
      <div class="drawer-nav">
        <div
          v-for="(item, index) in allSwiperConfig[swiperKey].list"
          :key="item.id"
        >
          <a
            class="link"
            :class="{ active: navActive === index }"
            href="javascript:;"
            @click="moNavClick(item.index)"
            >{{ t(item.i18n) }}</a
          >
          <template v-for="it in item.children" :key="it.id">
            <div
              v-if="showItem(it.test)"
              class="child-link"
              :class="{
                'child-active': it.index === allSwiperConfig[swiperKey].index,
              }"
              @click="moNavClick(it.index)"
            >
              {{ t(it.i18n) }}
            </div>
          </template>
        </div>
      </div>
      <div class="action">
        <el-switch
          v-if="drawerBlack === 'black'"
          v-model="languageRadio"
          size="large"
          active-text="English"
          inactive-text="中文"
          active-color="#002fa7"
          class="blackSwitch"
          @click="chaneLanguage"
        />
        <el-switch
          v-else
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
.blackSwitch {
  .el-switch__label.is-active {
    color: #f5f6f8 !important;
  }
}
.menu-bar {
  position: absolute;
  left: 16px;
  top: 12px;
  &.white svg {
    color: #fff;
  }
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
          .child-link {
            color: #e2e2e2;
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
          font-weight: 500;
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
        .child-link {
          font-size: 12px;
          font-weight: 400;
          line-height: 2.5rem;
          margin-left: 2.5rem;
          color: #555555;
        }
        .child-active {
          color: #002fa7;
        }
      }
    }
  }
}
</style>
