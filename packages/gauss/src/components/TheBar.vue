<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCompanyStore } from '@/stores/company';
import { useCommonStore } from '@/stores/common';
import { formatNumber, percentageTotal } from 'shared/utils/helper';

const useCompany = useCompanyStore();
const useCommon = useCommonStore();
const { t } = useI18n();

// 个人信息
const progressFormat = (item: number) => {
  return (100 / useCompany.companyMaxNum) * item;
};

// 格式化统计周期文字
const timeRangeText = ref('');
const switchTime = () => {
  switch (useCompany.companyForm.timeRange) {
    case 'lastonemonth':
      timeRangeText.value = t('from.lastonemonth');
      break;
    case 'lasthalfyear':
      timeRangeText.value = t('from.lasthalfyear');
      break;
    case 'lastoneyear':
      timeRangeText.value = t('from.lastoneyear');
      break;
    default:
      timeRangeText.value = t('from.all');
      break;
  }
};
switchTime();
watch(
  () => [useCompany.companyForm.timeRange, useCommon.language],
  () => {
    switchTime();
  }
);

const typeLable = ref('');
const switchType = () => {
  switch (useCompany.companyForm.contributeType) {
    case 'PR':
      typeLable.value = t('home.prs');
      break;
    case 'Issue':
      typeLable.value = t('home.issues');
      break;
    case 'Comment':
      typeLable.value = t('home.comments');
      break;
  }
};
switchType();
watch(
  () => [useCompany.companyForm.contributeType, useCommon.language],
  () => {
    switchType();
  }
);

// el-tooltip showAfter
const showAfter = 200;
</script>

<template>
  <div class="bar-panel">
    <ul class="bar-content">
      <li
        v-for="(item, index) in useCompany.companyData"
        :key="'com' + index"
        class="bar-content-item"
      >
        <p class="infos">
          <span class="index">{{ item.index }}</span>
          <span
            class="name"
            :title="
              useCommon.language === 'zh'
                ? item.company_zh
                : item.company_en === ''
                ? item.company_zh
                : item.company_en
            "
            >{{
              useCommon.language === 'zh'
                ? item.company_zh
                : item.company_en === ''
                ? item.company_zh
                : item.company_en
            }}</span
          >
        </p>

        <el-tooltip
          placement="bottom-start"
          effect="light"
          :show-after="showAfter"
          popper-class="bar-tooltip"
          :show-arrow="false"
        >
          <template #content>
            <div class="lable">
              {{ timeRangeText }} <span class="text">{{ t('de') }}</span>
              {{ typeLable }}
            </div>
            <div class="info">
              <p>
                <span class="index">{{ +index + 1 }}</span>
                {{
                  useCommon.language === 'zh'
                    ? item.company_zh
                    : item.company_en === ''
                    ? item.company_zh
                    : item.company_en
                }}
              </p>
              <span class="num"
                >{{ item.contribute }}
                <span class="percentage">{{
                  percentageTotal(item.contribute, useCompany.total)
                }}</span>
              </span>
            </div>
          </template>
          <div class="progress">
            <div
              class="progress-inner"
              :style="{
                width: progressFormat(item.contribute) + '%',
              }"
            >
              <span v-if="progressFormat(item.contribute) > 80">{{
                formatNumber(item.contribute)
              }}</span>
            </div>
            <span v-if="progressFormat(item.contribute) < 80" class="val">{{
              formatNumber(item.contribute)
            }}</span>
          </div>
        </el-tooltip>
      </li>
    </ul>
    <div v-if="useCompany.companyData.length > 0" class="bar-columns">
      <div class="num"><span>0</span></div>
      <div class="num">
        <span>{{ formatNumber(useCompany.companyMaxNum / 2) }}</span>
      </div>
      <div class="num">
        <span>{{ formatNumber(useCompany.companyMaxNum) }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$color: #7d32ea;
.bar-panel {
  position: relative;
  height: 100%;
  padding-bottom: 12px;

  .bar-columns {
    position: absolute;
    bottom: 0;
    top: 0;
    left: 324px;
    display: flex;
    justify-content: space-between;
    right: 0;
    .num {
      color: #9097a3;
      font-size: 12px;
      position: relative;
      display: flex;
      align-items: end;
      min-width: 8px;
      &::after {
        position: absolute;
        top: 0;
        left: 48%;
        width: 1px;
        border-left: 1px dashed #ccc;
        bottom: 20px;
        content: '';
      }
      &:last-child {
        &::after {
          left: inherit;
          right: 0;
        }
      }
    }
  }
}
.bar-content {
  position: relative;
  z-index: 2;
  &-item {
    margin: 16px 0;
    list-style: none;
    display: flex;
    justify-content: space-between;
    .infos {
      font-size: 16px;
      color: #000000;
      line-height: 22px;

      display: flex;
      .index {
        width: 16px;
        margin-right: 8px;
        font-size: 16px;
        color: #9097a3;
        text-align: center;
      }
      .name {
        width: 304px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
.progress {
  height: 24px;
  display: flex;
  width: 100%;
  align-items: center;
  &-inner {
    background: $color;
    box-shadow: 4px 8px 12px 0px rgba(125, 50, 234, 0.25);
    font-size: 12px;
    color: #fff;
    height: 100%;
    display: flex;
    justify-content: end;
    align-items: center;
    padding-right: 0px;
    transition: all 0.3s ease-in-out;
    span {
      padding-right: 8px;
    }
  }
  .val {
    color: #000;
    font-size: 12px;
    margin-left: 8px;
  }
}
.bar-tooltip {
  padding: 12px 16px;
  box-shadow: 4px 8px 16px 0px rgba(10, 11, 13, 0.05),
    0px 0px 32px 0px rgba(10, 11, 13, 0.1);

  .lable {
    color: #9097a3;
    font-weight: bold;
    .text {
      font-weight: 100;
    }
  }
  .info {
    color: #4e5865;
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    min-width: 280px;
    .index {
      color: #9097a3;
    }
    .num {
      font-size: 16px;
      color: #000000;
      margin-left: 40px;
      .percentage {
        margin-left: 10px;
        font-size: 12px;
        color: #4e5865;
      }
    }
  }
}
</style>
