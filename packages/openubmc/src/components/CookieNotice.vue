<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { type DialogActionT, OButton, ODialog, OIcon, OIconClose, OSwitch, isBoolean } from '@opensig/opendesign';

import { getCookie, removeCookie, setCookie } from 'shared/utils/cookies';

import { useI18n } from 'vue-i18n';
import { useScreen } from 'shared/hooks/useScreen';
import ContentWrapper from './ContentWrapper.vue';

const { leLaptop, lePadV } = useScreen();

const { t } = useI18n();

const route = useRoute();

// 是否允许分析cookie
const analysisAllowed = ref(false);

const COOKIE_KEY = 'agreed-cookiepolicy';
const COOKIE_AGREED_STATUS = {
  NOT_SIGNED: '0', // 未签署
  ALL_AGREED: '1', // 同意所有cookie
  NECCESSARY_AGREED: '2', // 仅同意必要cookie
};

const getUserCookieStatus = () => {
  return getCookie(COOKIE_KEY) || COOKIE_AGREED_STATUS.NOT_SIGNED;
}

// 是否未签署
const isNotSigned = () => {
  return getUserCookieStatus() === COOKIE_AGREED_STATUS.NOT_SIGNED;
};

// 是否全部同意
const isAllAgreed = () => {
  return getUserCookieStatus() === COOKIE_AGREED_STATUS.ALL_AGREED;
};

// -------------------- 展示底部提示 --------------------
const isNoticeVisible = ref(false);

// 显示/隐藏cookie提示
const toggleNoticeVisible = (val: boolean) => {
  if (isBoolean(val)) {
    isNoticeVisible.value = val;
  } else {
    isNoticeVisible.value = !isNoticeVisible.value;
  }
};

// -------------------- 同意/拒绝cookie --------------------
// 用户同意所有cookie
const acceptAll = () => {
  removeCookie(COOKIE_KEY, import.meta.env.VITE_COOKIE_DOMAIN);
  setCookie(COOKIE_KEY, COOKIE_AGREED_STATUS.ALL_AGREED, 180, import.meta.env.VITE_COOKIE_DOMAIN);
  toggleNoticeVisible(false);
};

// 用户拒绝所有cookie，即仅同意必要cookie
const rejectAll = () => {
  removeCookie(COOKIE_KEY, import.meta.env.VITE_COOKIE_DOMAIN);
  setCookie(COOKIE_KEY, COOKIE_AGREED_STATUS.NECCESSARY_AGREED, 180, import.meta.env.VITE_COOKIE_DOMAIN);
  toggleNoticeVisible(false);
};

// -------------------- 展示弹出框 --------------------
const isDlgVisible = ref(false);

// 弹出框设置
const dlgActions: Array<DialogActionT> = [
  {
    id: 'save',
    color: 'primary',
    label: t('cookie.saveSetting'),
    variant: 'outline',
    size: 'large',
    round: 'pill',
    onClick: () => {
      if (analysisAllowed.value) {
        acceptAll();
      } else {
        rejectAll();
      }
      isDlgVisible.value = false;
    },
  },
  {
    id: 'allowAll',
    color: 'primary',
    label: t('cookie.allowAll'),
    variant: 'outline',
    size: 'large',
    round: 'pill',
    onClick: () => {
      analysisAllowed.value = true;
      acceptAll();
      isDlgVisible.value = false;
    },
  },
];

// 弹窗框关闭
const onDlgChange = () => {
  // 关闭时
  if (!isAllAgreed()) {
    setTimeout(() => {
      analysisAllowed.value = false;
    }, 800);
  }
};

// --------------------初次加载 & 路由变化 --------------------
watch(
  () => route.path,
  () => {
    // 解决根路由加载时多上报的问题
    if (route.path === '/' && route.path !== window?.location?.pathname) {
      return;
    }

    if (isNotSigned()) {
      toggleNoticeVisible(true);
    }

    if (isAllAgreed()) {
      if (!analysisAllowed.value) {
        analysisAllowed.value = true;
      }
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="cookie-notice" v-if="isNoticeVisible">
    <ContentWrapper>
      <div class="cookie-notice-content">
        <div class="cookie-notice-left">
          <div class="title">{{ t('cookie.title', { communityName: t('common.communityName') }) }}</div>
          <p class="cookie-desc">
            {{ t('cookie.desc') }}
            <RouterLink :to="'/cookies'" target="_blank" rel="noopener noreferrer">
              {{ t('cookie.link') }}
            </RouterLink>
          </p>
        </div>
        <div class="cookie-notice-right">
          <OButton round="pill" variant="outline" color="primary" @click="acceptAll">
            {{ t('cookie.acceptAll') }}
          </OButton>
          <OButton round="pill" variant="outline" color="primary" @click="rejectAll">
            {{ t('cookie.rejectAll') }}
          </OButton>
          <OButton round="pill" variant="outline" color="primary" @click="isDlgVisible = true">
            {{ t('cookie.manage') }}
          </OButton>
        </div>
      </div>
      <OIcon class="cookie-notice-close" style="font-size: 32px;">
        <OIconClose @click="toggleNoticeVisible(false)" />
      </OIcon>
      <ODialog
        v-model:visible="isDlgVisible"
        :size="leLaptop ? 'medium' : 'large'"
        :phone-half-full="lePadV"
        class="cookie-dlg"
        :actions="dlgActions"
        @change="onDlgChange"
      >
        <template #header>
          <span class="cookie-dlg-title">{{ t('cookie.manage') }}</span>
        </template>
        <div class="cookie-dlg-content">
          <div class="content-item">
            <div class="item-header">
              <span class="item-title">{{ t('cookie.necessaryCookie') }}</span>
              <span class="item-extra">{{ t('cookie.necessaryCookieTip') }}</span>
            </div>
            <div class="item-detail">
              {{ t('cookie.necessaryCookieDetail') }}
            </div>
          </div>
          <div class="content-item">
            <div class="item-header">
              <span class="item-title">{{ t('cookie.analyticalCookie') }}</span>
              <span class="item-extra">
                <OSwitch v-model="analysisAllowed"></OSwitch>
              </span>
            </div>
            <div class="item-detail">
              {{ t('cookie.analyticalCookieDetail') }}
            </div>
          </div>
        </div>
      </ODialog>
    </ContentWrapper>
  </div>
</template>

<style lang="scss" scoped>
@use 'shared/styles/mixin/hover.scss' as *;
.cookie-notice {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  width: 100%;
  background-color: rgba(var(--o-mixedgray-1), 0.9);
  box-shadow: var(--o-shadow-1);
  padding: 0 var(--layout-doc-menu-offset-left);

  .cookie-notice-wrapper {
    width: 100%;
    padding: 8px 40px;
    position: relative;
  }
}

.cookie-notice-content {
  display: flex;
  justify-content: space-between;
  backdrop-filter: blur(5px);


  @include respond-to('<=pad_v') {
    padding-bottom: 16px;
    flex-direction: column;
    align-items: center;
  }
}

.content-wrapper {
  position: relative;
  padding-top: 16px;
  padding-bottom: 16px;
}

.cookie-notice-left {
  margin-right: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .title {
    @include tip1;
    font-weight: 500;
    flex-shrink: 0;
    margin-right: 16px;
  }

  @include respond-to('<=pad_v') {
    margin: 0;
    flex-direction: column;
    align-items: center;
    .title {
      margin-right: 0;
      margin-bottom: 8px;
    }
  }

  .cookie-title {
    @include text1;
    color: var(--o-color-info1);
    font-weight: 500;
    @include respond-to('<=pad_v') {
      font-size: 16px;
      line-height: 24px;
      text-align: center;
    }
  }

  .cookie-desc {
    @include tip2;
    color: var(--o-color-info2);
  }
}

.cookie-notice-right {
  display: flex;
  align-items: center;
  .o-btn {
    @include respond-to('<=pad_v') {
      width: 100%;
    }

    @include hover {
      color: #fff;
      background-color: var(--btn-bd-color-hover);
    }
  }

  .o-btn + .o-btn {
    margin-left: 24px;

    @include respond-to('<=pad_v') {
      margin-left: 0;
      margin-top: 12px;
    }
  }

  @include respond-to('<=pad_v') {
    width: 100%;
    margin-top: 16px;
    align-items: center;
    justify-content: center;
    gap: 24px;
    .o-btn {
      max-width: 110px;
    }
    .o-btn + .o-btn {
      margin-top: 0;
    }
  }
}

.cookie-notice-close {
  position: absolute;
  top: 12px;
  left: 100%;
  @include x-svg-hover;
  cursor: pointer;
  color: var(--o-color-info1);
  transform-origin: center;
  @include hover {
    color: var(--o-color-primary2);
  }

  &.active {
    color: var(--o-color-primary3);
  }
}

.cookie-dlg {
  .cookie-dlg-title {
    color: var(--o-color-info1);
  }
  .cookie-dlg-content {
    .content-item + .content-item {
      margin-top: 24px;
    }

    .content-item {
      .item-header {
        display: flex;
        align-items: center;
        .item-title {
          @include h4;
          color: var(--o-color-info1);
          font-weight: 500;
        }

        .item-extra {
          display: flex;
          align-items: center;
          @include tip1;
          color: var(--o-color-info3);
          margin-left: 24px;
        }
      }

      .item-detail {
        @include text1;
        color: var(--o-color-info2);
        margin-top: 12px;
      }
    }
  }
}
</style>

