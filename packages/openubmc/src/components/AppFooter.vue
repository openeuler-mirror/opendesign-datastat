<script setup lang="tsx">
import { FOOTER_LINK, FRIEND_LINK } from '@/config/home';
import { getYearByOffset } from '@/shared/utils';
import { RECORDAL_URL, BEIAN_URL } from '@/config/url-config';
import { useScreen } from 'shared/hooks/useScreen';
import { ODivider } from '@opensig/opendesign';
import { useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

import IconLogoWhite from '~icons/app/logo-white.svg';

const { lePadV } = useScreen();
const wechatRef = useTemplateRef('wechatRef');

const { t } = useI18n()
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer-wrap content-width">
      <div class="footer-content">
        <div v-for="item in FOOTER_LINK" :key="item.title">
          <p class="content-title">{{ item.title }}</p>
          <div v-for="link in item.children" :key="link.title" class="link">
            <a v-if="link.link" :href="link.link" target="_blank" rel="noopener noreferrer">{{ link.title }}</a>
            <p v-else class="link-disabled">
              <span>{{ link.title }}</span>
              <span class="disabled-tag">{{ t('header.notOnline') }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="friend-link">
        <span>友情链接</span>
        <div class="link-wrapper">
          <a v-for="item in FRIEND_LINK" :key="item.link" :href="item.link" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
        </div>
      </div>
      <ODivider></ODivider>

      <div class="footer-attach">
        <div class="footer-attach-logo">
          <IconLogoWhite />
          <a href="mailto:contact@openubmc.cn">contact@openubmc.cn</a>
        </div>
        <div class="footer-attach-center">
          <p class="about-p">
            <a href="/privacy">{{ t('footer.privacyPolicy') }}</a>
            <span>&nbsp;|&nbsp;</span>
            <a href="/legal">{{ t('footer.legalStatement') }}</a>
            <span>&nbsp;|&nbsp;</span>
            <a href="/cookies">{{ t('footer.aboutCookies') }}</a>
          </p>
          <p class="copyright-p">
            <span>{{ t('footer.copyright', { year: getYearByOffset() }) }}</span>
            <span>&nbsp;</span>
            <a :href="RECORDAL_URL" target="_blank" rel="noopener noreferrer">{{ t('footer.recordal') }}</a>
          </p>
          <p>
            <img src="@/assets/category/home/recordal.png" />
            <a :href="BEIAN_URL" target="_blank" rel="noopener noreferrer">{{ t('footer.beian') }}</a>
          </p>
          <p class="mulan-p">
            <span>遵循&nbsp;</span>
            <span>木兰宽松许可证第2版（MulanPSL2）</span>
          </p>
        </div>
        <div class="footer-attach-wechat" ref="wechatRef">
          <ElPopover v-if="!lePadV" :wrapper="wechatRef" popper-class="qr-code-popover" placement="top">
            <template #reference>
              <div class="qr-popover">
                <img src="@/assets/category/home/wechat.svg" alt="" />
                <span>openUBMC公众号</span>
              </div>
            </template>
            <img class="qr-code" src="@/assets/category/home/wechat-qr.jpg" alt="" />
          </ElPopover>
          <template v-else>
            <img class="qr-code" src="@/assets/category/home/wechat-qr.jpg" alt="" />
            <span>openUBMC公众号</span>
          </template>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.app-footer {
  // height: 100%;
  color: rgb(var(--o-white));
  padding: 32px 0 16px;
  background-image: url('/footer-bg.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  @include respond-to('<=pad_v') {
    padding-top: 16px;
  }
  @include tip2;

  --bottom-padding-top: var(--o-gap-4);
  @include respond-to('<=pad_v') {
    --bottom-padding-top: var(--o-gap-2);
  }
  a {
    color: rgba(255, 255, 255, 0.8);

    @include hover {
      color: rgba(255, 255, 255, 1);
    }
  }
}

.app-footer-wrap {
  height: 100%;
  margin: auto;
}

.footer-content {
  display: flex;
  justify-content: center;
  gap: 80px;
  margin-bottom: 48px;
  @include respond-to('pad') {
    gap: 50px;
  }
  @include respond-to('<=pad_v') {
    display: none;
  }
  .content-title {
    @include h4;
    padding-bottom: 10px;
  }

  .link {
    @include tip1;
  }

  a {
    @include tip1;
    display: block;
  }

  .link + .link {
    margin-top: var(--o-gap-2);
  }

  .link-disabled {
    line-height: 16px;
    display: flex;
    color: rgba(255, 255, 255, 0.4);
    cursor: not-allowed;

    .disabled-tag {
      margin-left: var(--o-gap-1);
      border: 1px solid rgba(61, 63, 67, 1);
      border-radius: var(--o-radius-xs);
      font-size: 10px;
      color: rgba(255, 255, 255, 0.6);
      height: 16px;
      width: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.friend-link {
  display: flex;
  align-items: flex-start;
  gap: 12px 24px;
  flex-wrap: wrap;
  span {
    color: #fff;
    @include tip2;
    @include respond-to('phone') {
      @include tip1;
    }
  }
  .link-wrapper {
    display: flex;
    gap: 8px 24px;
    flex-wrap: wrap;
  }
  a {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    @include tip2;

    @include hover {
      color: rgba(255, 255, 255, 1);
    }
    @include respond-to('phone') {
      @include tip1;
    }
  }
}
.o-divider {
  --o-divider-bd-color: rgba(255, 255, 255, 0.15);
}

.footer-attach {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  @include tip1;
  .footer-attach-logo {
    display: flex;
    flex-direction: column;
    order: 2;
    a {
      color: #fff;
    }
    @include respond-to('<=pad_v') {
      align-items: center;
      margin: 16px 0;
      img {
        width: 100px;
      }
    }
  }
  .footer-attach-center {
    order: 2;
    color: rgba(255, 255, 255, 0.8);
    p + p {
      margin-top: 4px;
    }
    p {
      display: flex;
      align-items: center;
      justify-content: center;
      row-gap: 4px;
      &.about-p {
        margin-bottom: 6px;
        a {
          color: #fff;
        }
      }
      &.copyright-p {
        flex-wrap: wrap;
      }
      &.mulan-p {
        span:last-child {
          color: rgba(255, 255, 255, 1);
        }
      }
    }
    @include respond-to('<=pad_v') {
      order: 1;
    }
  }
  .footer-attach-wechat {
    order: 2;
    color: rgba(255, 255, 255, 0.8);
    .qr-popover {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      img {
        width: 25px;
        height: 20px;
      }
    }
    .o-popup {
      min-width: 96px !important;
    }

    @include respond-to('<=pad_v') {
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 8px;
    }
  }
  @include respond-to('<=pad_v') {
    flex-direction: column;
  }
}
</style>
<style lang="scss">
.qr-code {
  width: 80px;
  height: 80px;
}
.qr-code-popover {
  padding: 7px !important;
  min-width: 96px !important;
  width: 96px !important;
}
</style>
