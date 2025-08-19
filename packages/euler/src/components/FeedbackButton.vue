<script setup lang="ts">
import { computed, onUnmounted, ref, type CSSProperties, type Directive } from 'vue';

import { OIcon, ODivider, OPopup, OLink, OButton } from '@opensig/opendesign';

import { ElMessage } from 'element-plus';

import IconTop from '~icons/app/icon-top.svg';
import IconSmile from '~icons/app/icon-smile.svg';
import IconHeadset from '~icons/app/icon-headset.svg';
import IconCancel from '~icons/app/icon-close.svg';

import IconQuickIssue from '~icons/app/icon-quickissue.svg';
import IconChat from '~icons/app/icon-chat.svg';
import IconFAQ from '~icons/app/icon-faq.svg';
import IconEdit from '~icons/app/icon-edit.svg';

import { postFeedback } from '@/api/api-feedback';
import { useScreen } from 'shared/hooks/useScreen';
import { useI18n } from 'vue-i18n';

const { locale, t } = useI18n();
const { lePad: isPhone } = useScreen();

const forumURL = import.meta.env.VITE_SERVICE_FORUM_URL;

const placeholder = computed(() => {
  if (score.value / 10 < 7) {
    return t('feedback.recommendTip1');
  } else if (score.value / 10 < 9) {
    return t('feedback.recommendTip2');
  } else {
    return t('feedback.recommendTip3');
  }
});

const score = ref(0);
const scoreTip = computed(() => {
  return score.value / 10;
});

const feedbackRef = ref();
const issuebackRef = ref();
const inputText = ref('');

const popoverRef = ref();
const showPopup = ref(false);
const isReasonShow = ref(false);

// 鼠标进入图标区域
const onMouseEnter = () => {
  showPopup.value = true;
};

function closePopup() {
  showPopup.value = false;
  isReasonShow.value = false;
  inputText.value = '';
  score.value = 0;
}

function changeSlider() {
  isReasonShow.value = true;
}

const scorePosition = computed(() => {
  return score.value + '%';
});

const STEP = 10;

interface Mark {
  style: CSSProperties;
  label: string;
}

type Marks = Record<number, Mark | string>;
const marks = computed(() => {
  const temp: Marks = {};
  for (let i = 0; i < STEP + 1; i++) {
    temp[i * 10] = '';
  }
  return temp;
});

const isFocus = ref(false);

const vMounted: Directive<HTMLElement> = {
  mounted(el) {
    el.addEventListener('focus', () => {
      isFocus.value = true;
    });
    el.addEventListener('blur', () => {
      isFocus.value = false;
    });
  },
};

// ------------------ 提交反馈 -----------------
function submitFeedback() {
  if (!isReasonShow.value) {
    return;
  }
  const params = {
    feedbackPageUrl: window.location.href,
    feedbackText: inputText.value,
    feedbackValue: score.value / 10,
  };
  postFeedback(params)
    .then((res) => {
      if (res.code === 200) {
        ElMessage({
          message: '提交成功，感谢您的反馈！',
          type: 'success',
        });
        if (isPhone.value) {
          isShowFeedbackMb.value = false;
        }
        closePopup();
        dialogVisible.value = false;
      } else {
        ElMessage({
          message: res.msg,
          type: 'error',
        });
      }
    })
    .catch(() => {
      ElMessage({
        message: '提交失败，请刷新页面后重新提交！',
        type: 'error',
      });
    });
}

// ------------------ 满意度提示 -----------------
const isFloatTipShow = ref(true);
const closeFloatTip = () => {
  isFloatTipShow.value = false;
};

// ------------------ 滚到顶部 -----------------
function handleClickTop() {
  window.scrollTo(0, 0);
}

const floatData = computed(() => {
  if (locale.value === 'zh') {
    return [
      {
        img: IconChat,
        text: '社区论坛',
        tip: '发帖互助解决各类问题',
        id: 'forum',
        link: import.meta.env.VITE_SERVICE_FORUM_URL,
      },
      {
        img: IconQuickIssue,
        id: 'quickIssue',
        text: 'QuickIssue',
        tip: '快捷提交/查询社区Issues',
        link: `${import.meta.env.VITE_SERVICE_QUICKISSUE_URL}/zh/issues/`,
      },
      {
        img: IconEdit,
        id: 'feedback',
        text: '意见反馈',
        tip: '在Gitee中反馈意见',
        link: `https://gitee.com/openeuler/infrastructure/issues/new?issue%5Bassignee id%5D=0&issue%5Bmilestone id%5D=0`,
      },
      {
        img: IconFAQ,
        id: 'faq',
        text: 'FAQs',
        tip: '',
        link: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/faq/`,
      },
    ];
  }
  return [
    {
      img: IconEdit,
      id: 'feedback',
      text: 'Feedback',
      tip: 'Your voice matters',
      link: `https://gitee.com/openeuler/infrastructure/issues/new?issue%5Bassignee id%5D=0&issue%5Bmilestone id%5D=0`,
    },
    {
      img: IconFAQ,
      id: 'faq',
      text: 'FAQs',
      tip: '',
      link: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/faq/`,
    },
  ];
});

// ------------------ 移动端nss评分 -----------------
const dialogVisible = ref(false);
const isShowFeedbackMb = ref(true);

const marksMobile = computed(() => {
  const temp = [];
  for (let i = 0; i < STEP + 1; i++) {
    temp.push(i);
  }
  return temp;
});

const toggleDialogVisible = () => {
  dialogVisible.value = true;
};

const cancelDialog = () => {
  dialogVisible.value = false;
  isReasonShow.value = false;
  inputText.value = '';
  score.value = 0;
};

const closeFeedbackMb = () => {
  isShowFeedbackMb.value = false;
};

const setScore = (val: number) => {
  isReasonShow.value = true;
  score.value = val * 10;
};

// 页面滚动大于一屏时，显示回到顶部悬浮按钮
const showBackTop = ref(false);

const scrollHandler = () => {
  if (window.pageYOffset > window.innerHeight) {
    showBackTop.value = true;
  } else {
    showBackTop.value = false;
  }
};
window.addEventListener('scroll', scrollHandler);
onUnmounted(() => window.removeEventListener('scroll', scrollHandler));
</script>

<template>
  <div v-if="!isPhone" class="feedback">
    <div class="feedback-wrap">
      <div v-show="isFloatTipShow" class="float-tip">
        <h4 class="tip-title">{{ $t('feedback.feedback') }}</h4>
        <div class="tip-detail">{{ $t('feedback.welcomeFeedback') }}</div>
        <div class="tip-handle">
          <p class="tip-konwed" @click="closeFloatTip">{{ $t('feedback.gotIt') }}</p>
        </div>
      </div>

      <div class="nav-box1">
        <div class="nav-item" id="feedback" @mouseenter="onMouseEnter">
          <OIcon class="icon-smile" ref="feedbackRef">
            <IconSmile />
          </OIcon>
          <OPopup
            :visible="showPopup"
            position="rb"
            :target="feedbackRef"
            wrapper="#feedback"
            body-class="popup-feedback o-popup1"
            :auto-hide="isReasonShow ? false : true"
            :offset="24"
            trigger="hover"
          >
            <OIcon class="icon-cancel" @click="closePopup">
              <IconCancel />
            </OIcon>

            <div class="slider">
              <p class="slider-title">
                {{ $t('feedback.title1') }}
                <span class="title-name">{{ $t('feedback.title2') }}</span>
                {{ $t('feedback.title3') }}
              </p>
              <div class="slider-body">
                <div class="slider-tip">
                  <div v-show="isReasonShow" ref="popoverRef" class="slide-btn-tip">
                    {{ scoreTip }}
                  </div>
                </div>

                <ElSlider show-stops v-model="score" :step="10" :marks="marks" :show-tooltip="false" @input="changeSlider" />
              </div>

              <div class="grade-info">
                <span>{{ $t('feedback.grade1') }}</span>
                <span>{{ $t('feedback.grade2') }}</span>
              </div>
            </div>

            <div v-show="isReasonShow" class="reason">
              <div class="input-area" :class="{ 'is-focus': isFocus }">
                <textarea v-mounted v-model="inputText" :placeholder="placeholder" maxlength="500"></textarea>
                <p>
                  <span>{{ inputText.length }}</span
                  >/500
                </p>
              </div>
              <p class="more-info">
                {{ $t('feedback.moreInfo') }}<a :href="forumURL" target="_blank">{{ $t('feedback.moreInfo2') }} </a>
              </p>
              <div class="submit-btn">
                <OButton :disabled="!inputText?.length" size="medium" color="primary" variant="solid" @click="submitFeedback">
                  {{ $t('feedback.submit') }}
                </OButton>
              </div>
            </div>
          </OPopup>
        </div>

        <ODivider :style="{ '--o-divider-gap': '12px' }" />

        <div class="nav-item">
          <OIcon ref="issuebackRef" id="issueback" style="position: relative" class="icon-headset">
            <component :is="IconHeadset"> </component>
          </OIcon>

          <OPopup position="rb" :target="issuebackRef" wrapper="#issueback" body-class="popup-issueback" :offset="24" trigger="hover">
            <OLink v-for="item in floatData" :key="item.link" :href="item.link" target="_blank" class="popup-item">
              <OIcon><component :is="item.img"></component> </OIcon>

              <div class="text">
                <p class="text-name">
                  {{ item.text }}
                </p>

                <p v-if="item.tip" class="text-tip">{{ item.tip }}</p>
              </div>
            </OLink>
          </OPopup>
        </div>
      </div>

      <div class="nav-box2" v-show="showBackTop" @click="handleClickTop">
        <OIcon class="icon-top"><component :is="IconTop"></component> </OIcon>
      </div>
    </div>
  </div>

  <div v-else-if="isShowFeedbackMb && isPhone" class="feedback-mb">
    <div class="feedback-mb-head">
      <div class="head-title" @click="toggleDialogVisible">
        <OIcon class="icon-box"><component :is="IconSmile"></component> </OIcon>
        <p>
          {{ $t('feedback.title1') }}
          <span class="title-name">{{ $t('feedback.title2') }}</span>
          {{ $t('feedback.title3') }}
        </p>
      </div>
      <OIcon class="icon-box icon-close" @click="closeFeedbackMb"><component :is="IconCancel"></component> </OIcon>
    </div>

    <ElDialog :show-close="false" v-model="dialogVisible">
      <div class="o-popup1">
        <div class="slider">
          <p class="slider-title">
            {{ $t('feedback.title1') }}
            <span class="title-name">{{ $t('feedback.title2') }}</span>
            {{ $t('feedback.title3') }}
          </p>
          <ul class="score-list">
            <li
              v-for="item in marksMobile"
              :key="'mark' + item"
              :style="{ left: item * 10 + '%' }"
              :class="{ 'is-active': score / 10 === item }"
              @click="setScore(item)"
            >
              {{ item }}
            </li>
          </ul>
          <div class="slider-body">
            <el-slider v-model="score" :step="STEP" :marks="marks" show-stops :show-tooltip="false" @input="changeSlider" />
          </div>
          <div class="grade-info">
            <span>{{ $t('feedback.grade1') }}</span>
            <span>{{ $t('feedback.grade2') }}</span>
          </div>
        </div>
        <div v-show="isReasonShow" class="reason">
          <div class="input-area" :class="{ 'is-focus': isFocus }">
            <textarea v-mounted v-model="inputText" :placeholder="placeholder" maxlength="500"></textarea>
            <p>
              <span>{{ inputText.length }}</span
              >/500
            </p>
          </div>
          <p class="more-info">
            {{ $t('feedback.moreInfo') }}<a :href="forumURL" target="_blank">{{ $t('feedback.moreInfo2') }} </a>
          </p>
        </div>
        <div class="btn-box">
          <OButton type="outline" size="medium" @click="cancelDialog"> {{ $t('feedback.cancel') }} </OButton>
          <OButton type="outline" size="medium" @click="submitFeedback" :class="{ forbidden: !isReasonShow }"> {{ $t('feedback.submit') }} </OButton>
        </div>
      </div>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped>
@use '@/shared/styles/mixins/oStyles.scss' as *;

.o-btn {
  border-radius: var(--btn-height);
}

.feedback {
  @include o-styles;
  position: fixed;
  bottom: 280px;
  right: 80px;
  z-index: 1000;

  @media (max-width: 1700px) {
    right: 20px;
  }
  @media (max-width: 1560px) {
    right: 2px;
  }
  @media (max-width: 1526px) {
    right: 44px;
  }

  @include screen.respond-to('laptop') {
    right: 24px;
  }

  .dark-nav {
    border: 1px solid var(--o-color-control4-light);
  }

  .feedback-wrap {
    display: flex;
    flex-direction: column;
    position: relative;

    .float-tip {
      position: absolute;
      width: 180px;
      top: 0;
      right: 0;
      background-color: var(--o-color-fill2);
      border-radius: var(--o-radius-xs);
      box-shadow: var(--o-shadow-2);
      padding: 16px;
      transform: translate(34%, -110%);
      @media (max-width: 1700px) {
        transform: translate(0, -110%);
      }
      .tip-title {
        color: var(--o-color-info1);
        @include text1;
      }
      .tip-detail {
        @include tip2;
        color: var(--o-color-info1);
      }
      .tip-handle {
        margin-top: 8px;
        display: flex;
        justify-content: end;
        .tip-konwed {
          @include tip1;
          color: var(--o-color-info1);
          cursor: pointer;

          @include common.hover {
            color: var(--o-color-primary1);
          }
        }
      }
      &::after {
        display: block;
        content: '';
        width: 0;
        border-left: 8px solid transparent;
        border-top: 8px solid var(--o-color-fill2);
        border-right: 8px solid transparent;
        border-bottom: 8px solid transparent;
        position: absolute;
        bottom: -14px;
        left: 50%;
        @media (max-width: 1700px) {
          left: 84%;
        }
      }
    }

    .nav-box1,
    .nav-box2 {
      display: flex;
      flex-direction: column;
      padding: 12px;
      background-color: var(--o-color-fill2);
      border-radius: var(--o-radius-xs);
      box-shadow: var(--o-shadow-2);

      .nav-item {
        .o-icon {
          font-size: var(--o-font_size-h2);
          color: var(--o-color-info2);
          cursor: pointer;
        }

        @include common.hover {
          .icon-smile,
          .icon-headset {
            color: var(--o-color-primary1);
          }
        }

        .icon-cancel {
          @include h4;
          transition: all var(--o-duration-m1) var(--o-easing-standard-in);

          @include common.hover {
            transform: rotate(180deg);
            color: var(--o-color-primary1);
          }
        }
      }

      .popup-item {
        .o-icon {
          font-size: var(--o-font_size-h1);
          color: var(--o-color-info1);
        }
      }

      .o-popup1 {
        .slider {
          --el-slider-button-wrapper-offset: -14px;
          .slider-title {
            @include tip1;
            color: var(--o-color-info1);
            text-align: center;
            white-space: nowrap;
            .title-name {
              font-weight: 600;
            }
          }
          .slider-body {
            padding-top: 30px;
            .slider-tip {
              position: relative;

              .slide-btn-tip {
                width: 28px;
                height: 20px;
                text-align: center;
                font-size: var(--o-font_size-tip1);
                color: var(--o-color-info1);
                background-color: var(--o-color-fill2);
                border-radius: var(--o-radius-xs);
                box-shadow: 0 3px 8px rgba(18, 20, 23, 0.08);
                backdrop-filter: blur(5px);
                border: 1px solid var(--o-color-control4-light);
                position: absolute;
                top: -32px;
                transform: translateX(-50%);
                left: v-bind(scorePosition);
                line-height: 1.2;

                &::after {
                  content: '';
                  display: block;
                  width: 8px;
                  height: 8px;
                  transform: rotateZ(45deg);
                  border: 1px solid #000;
                  border-color: transparent var(--o-color-control4-light) var(--o-color-control4-light) transparent;
                  background-color: var(--o-color-fill2);
                  position: absolute;
                  bottom: -4px;
                  right: 9px;
                }
              }
            }

            :deep(.el-slider) {
              height: auto;
              height: 10px;

              .el-slider__runway {
                height: 8px;
                border-radius: var(--o-radius-xs);
                background-color: var(--o-color-control1-light);
              }

              .el-slider__bar {
                height: 10px;
                background-image: linear-gradient(270deg, #002fa7 0%, #21a9fc 100%);
                top: -1px;
                border-radius: 5px;
              }

              .el-slider__button-wrapper + div {
                position: relative;
                transform: translateY(2px);
                z-index: 2;

                & + div {
                  transform: translateY(2px);
                  & > .el-slider__stop:nth-of-type(1) {
                    transform: translatex(2px);
                  }
                }
              }

              .el-slider__stop {
                width: 2px;
                height: 2px;
                background-color: var(--o-color-control2);
                top: 1px;
              }

              .el-slider__marks-stop {
                background-color: var(--o-color-fill2);

                &:nth-last-of-type(1) {
                  transform: translateX(-4px);
                  background-color: var(--o-color-control2);
                }
              }

              .el-slider__button {
                position: relative;
                border: none;
                box-shadow: var(--o-shadow-2);

                &::after {
                  display: block;
                  content: '';
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  background-color: var(--o-color-primary1);
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                }
              }
            }
          }

          .grade-info {
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: var(--o-font_size-tip2);
            color: var(--o-color-info3);
            margin-top: 14px;
          }
        }

        .reason {
          margin-top: 16px;

          .input-area {
            border: 1px solid var(--o-color-control1);
            padding: 8px 16px;
            height: 88px;
            border-radius: var(--o-radius-xs);
            font-size: var(--o-font_size-tip2);
            line-height: 18px;
            position: relative;

            @include common.hover {
              border: 1px solid var(--o-color-primary1);
            }

            &.is-focus {
              border: 1px solid var(--o-color-primary1);
            }

            textarea {
              width: 100%;
              height: 100%;
              border: none;
              outline: none;
              resize: none;
              background-color: var(--o-color-fill2);
              color: var(--o-color-info1);
            }

            p {
              text-align: right;
              color: var(--o-color-info4);
              position: absolute;
              right: 8px;
              bottom: 8px;
            }
          }
          .more-info {
            margin-top: 8px;
            color: var(--o-color-info4);
            @include tip2;
            text-align: center;

            a {
              color: var(--o-color-primary1);
              @include common.hover {
                color: var(--o-color-primary2);
              }
            }
          }

          .submit-btn {
            margin-top: 16px;
            text-align: center;
            :deep(.o-button) {
              padding: 6px 26px;
              font-size: var(--o-font_size-tip1);
              border-radius: var(--o-radius-l);
              border-color: var(--o-color-primary1);
              color: var(--o-color-primary1);

              @include common.hover {
                border-color: var(--o-color-primary2);
                color: var(--o-color-primary2);
              }
            }
          }
        }
      }
    }

    .nav-box2 {
      margin-top: 12px;
      cursor: pointer;

      .icon-top {
        color: var(--o-color-info1);
        @include h2;

        @include common.hover {
          color: var(--o-color-primary1);
        }
      }
    }
  }
}

.feedback-mb {
  @include o-styles;
  position: sticky;
  bottom: 16px;
  z-index: 11;
  width: 100%;
  margin-bottom: 16px;
  max-width: var(--layout-content-max-width);
  padding-left: var(--layout-content-padding);
  padding-right: var(--layout-content-padding);

  .feedback-mb-head {
    height: 40px;
    padding: 12px;
    margin: 0 auto;
    text-align: center;
    background: linear-gradient(90deg, var(--o-color-control2-light) 0%, var(--o-color-control3-light) 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .o-icon {
      font-size: 16px;
    }
    .icon-close {
      position: absolute;
      right: 12px;
      top: 50%;
      cursor: pointer;
      transform: translateY(-50%);
      transition: all 0.25s cubic-bezier(0, 0, 0, 1);

      @include common.hover {
        transform: translateY(-50%) rotate(180deg);
        color: var(--o-color-primary1);
      }
    }
    .head-title {
      display: flex;
      height: 100%;
      align-items: center;
      font-size: 12px;
      line-height: 16px;
      white-space: nowrap;
      .title-name {
        font-weight: 600;
      }
      .o-icon {
        margin-right: 8px;
        color: var(--o-color-primary1);
      }
    }
  }
  :deep(.el-dialog) {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    margin-bottom: 0;
    margin-top: 0;
    background-color: transparent;
    border-radius: 8px 8px 0px 0px;
    padding: 0;

    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__body {
      padding: 0;
      border-radius: 8px 8px 0px 0px;
    }
  }

  .o-popup1 {
    width: 100%;
    background-color: var(--o-color-fill2);
    padding: 16px 24px;
    transform-origin: 100% 50%;
    border-radius: 8px 8px 0px 0px;
    cursor: default;
    .icon-cancel {
      position: absolute;
      top: 5px;
      right: 10px;
      cursor: pointer;
      color: var(--o-color-info1);
    }
    .slider {
      .slider-title {
        font-size: var(--o-font_size-tip1);
        line-height: 20px;
        color: var(--o-color-info1);
        text-align: center;
        white-space: nowrap;
        .title-name {
          font-weight: 600;
        }
      }
      .score-list {
        width: 100%;
        display: flex;
        position: relative;
        height: 18px;
        line-height: 18px;
        margin-top: 18px;
        ::marker {
          content: '';
        }
        li {
          position: absolute;
          transform: translateX(-50%);
          font-size: 14px;
          color: var(--o-color-info3);
          &.is-active {
            color: var(--o-color-info1);
            font-size: 16px;
          }
          &:nth-last-of-type(1) {
            left: 99% !important;
            white-space: nowrap;
          }
        }
      }
      .slider-body {
        margin-top: 10px;
        :deep(.el-slider) {
          height: auto;
          height: 12px;
          margin-top: 10px;
          .el-slider__button-wrapper {
            top: 50%;
            transform: translate(-50%, -50%);
          }
          .el-slider__runway {
            height: 100%;
            background-color: var(--o-color-fill3);
            border-radius: 8px;
          }
          .el-slider__bar {
            height: 100%;
            border-radius: 8px;
            background-image: linear-gradient(90deg, #62b2f6 0%, #002fa7 100%);
          }

          .el-slider__button-wrapper + div {
            position: relative;
            transform: translateY(5px);
            z-index: 2;
            & + div {
              transform: translateY(5px);
              & > .el-slider__stop:nth-of-type(1) {
                transform: translatex(2px);
              }
            }
          }

          .el-slider__stop {
            width: 2px;
            height: 2px;
            background-color: var(--o-color-control2);
          }

          .el-slider__marks {
            width: 100%;
            transform: translateY(-42px);
            .el-slider__marks-text:nth-last-child(1) {
              left: 99% !important;
              white-space: nowrap;
            }
          }

          .el-slider__marks-stop {
            background-color: var(--o-color-fill2);

            &:nth-last-of-type(1) {
              transform: translateX(-6px);
              background-color: var(--o-color-control2);
            }
          }
          .el-slider__button {
            position: relative;
            border: none;
            box-shadow: var(--o-shadow-2);
            &::after {
              display: block;
              content: '';
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: var(--o-color-primary1);
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
      }
      .grade-info {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: var(--o-font_size-tip2);
        color: var(--o-color-info3);
        margin-top: 8px;
        span {
          scale: 0.84;
        }
      }
    }
    .reason {
      margin-top: 16px;
      .input-area {
        border: 1px solid var(--o-color-control1);
        padding: 8px 16px;
        height: 88px;
        font-size: var(--o-font_size-tip2);
        line-height: var(--o-line_height-tip2);
        line-height: 18px;
        position: relative;
        border-radius: var(--o-radius-xs);
        @include common.hover {
          border: 1px solid var(--o-color-control3);
        }
        &.is-focus {
          border: 1px solid var(--o-color-control3);
        }
        textarea {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          resize: none;
          background-color: var(--o-color-fill2);
          color: var(--o-color-info1);
        }
        p {
          text-align: right;
          color: var(--o-color-info4);
          position: absolute;
          right: 6px;
          bottom: 6px;
        }
      }
      .more-info {
        margin-top: 8px;
        color: var(--o-color-info4);
        font-size: var(--o-font_size-tip2);
        line-height: 18px;
        text-align: center;
      }
    }
    .btn-box {
      margin-top: 12px;
      display: flex;
      justify-content: center;
      .o-btn {
        flex-grow: 1;
        justify-content: center;
        border: none;
        color: var(--o-color-info1);
        position: relative;
        padding: 0;
        border: none !important;
        background: transparent !important;
        &.forbidden {
          color: var(--o-color-info4);
        }
        &:nth-of-type(1)::after {
          display: block;
          content: '';
          width: 1px;
          height: 100%;
          background-color: var(--o-color-control4);
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }
  }
}

:deep(.o-popup) {
  cursor: default;

  .o-popup-wrap {
    box-shadow: none;
  }
  .popup-feedback {
    padding: 16px 30px;
    background-color: var(--o-color-fill2);
    box-shadow: var(--o-shadow-2);
    border-radius: var(--o-radius-xs);
    --popup-min-width: 360px;
    top: 12px;
    position: relative;

    .icon-cancel {
      position: absolute;
      top: 8px;
      right: 12px;
      color: var(--o-color-info2);
      cursor: pointer;
    }
  }

  .popup-issueback {
    padding: 24px;
    background-color: var(--o-color-fill2);
    border-radius: var(--o-radius-s);
    box-shadow: var(--o-shadow-2);
    --popup-min-width: 220px;
    position: relative;
    display: flex;
    flex-direction: column;

    .popup-item {
      width: 100%;
      .o-link-label {
        display: flex;
        align-items: flex-start;
        color: var(--o-color-info1);
        cursor: pointer;
      }

      @include common.hover {
        & .text .text-name {
          color: var(--o-color-primary1);
        }
      }

      & ~ .popup-item {
        margin-top: 12px;
      }

      .text {
        margin-left: 8px;
        text-align: left;
        align-self: center;

        .text-name {
          font-size: var(--o-font_size-tip1);
          line-height: 22px;
          font-weight: 600;
          a {
            color: var(--o-color-info1);
          }
        }
        .text-tip {
          font-size: var(--o-font_size-tip2);
          line-height: 18px;
          color: var(--o-color-info2);
          margin-top: 4px;
        }
      }
    }
  }
}
</style>
