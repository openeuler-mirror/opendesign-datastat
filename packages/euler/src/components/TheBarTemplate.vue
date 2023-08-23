<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '@/stores/common';
import { formatNumber, percentageTotal } from 'shared/utils/helper';
import { IObject } from 'shared/@types/interface';
import { useRouter } from 'vue-router';
import { hasPermission, hasPermissions } from 'shared/utils/login';
const router = useRouter();
const useCommon = useCommonStore();
const { t } = useI18n();

const props = defineProps({
  data: {
    type: Object,
    default() {
      return null;
    },
  },
  tipPrefix: {
    type: String,
    default() {
      return '';
    },
  },
  tipSuffix: {
    type: String,
    default() {
      return '';
    },
  },
});

// 个人信息
const progressFormat = (item: number) => {
  return (100 / props.data.companyMaxNum) * item;
};

// el-tooltip
const showAfter = 200;

// 跳转社区详情
const goToCompany = (data: IObject) => {
  if (
    hasPermissions(data.company_cn) ||
    (hasPermission('companyread_all') &&
      data.company_cn !== '个人贡献者' &&
      data.company_en !== 'independent')
  ) {
    const routeData: any = router.resolve(
      `/${useCommon.language}/company/${data.company_cn}`
    );
    window.open(routeData.href, '_blank');
  } else {
  }
};
</script>

<template>
  <div class="bar-panel">
    <ul class="bar-content">
      <li
        v-for="(item, index) in data.companyData"
        :key="'com' + index"
        class="bar-content-item"
      >
        <p class="infos">
          <span class="index">{{ item.index }}</span>
          <span
            v-if="
              item.company_cn === '个人贡献者' ||
              item.company_en === 'independent'
            "
            class="name"
            :style="{
              color: '#555555',
            }"
            >{{
              useCommon.language === 'zh'
                ? item.company_cn
                : item.company_en === ''
                ? item.company_cn
                : item.company_en
            }}</span
          >
          <span
            v-else
            class="name"
            :title="
              useCommon.language === 'zh'
                ? item.company_cn
                : item.company_en === ''
                ? item.company_cn
                : item.company_en
            "
            :style="{
              cursor:
                hasPermissions(item.company_cn) ||
                hasPermission('companyread_all')
                  ? 'pointer'
                  : 'auto',
              color:
                hasPermissions(item.company_cn) ||
                hasPermission('companyread_all')
                  ? '#002FA7'
                  : '#555555',
            }"
            @click="goToCompany(item)"
            >{{
              useCommon.language === 'zh'
                ? item.company_cn
                : item.company_en === ''
                ? item.company_cn
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
              {{ tipPrefix }} <span class="text">{{ t('de') }}</span>
              {{ tipSuffix }}
            </div>
            <div class="info">
              <p>
                <span class="index">{{ item.index }}</span>

                {{
                  useCommon.language === 'zh'
                    ? item.company_cn
                    : item.company_en === ''
                    ? item.company_cn
                    : item.company_en
                }}
              </p>
              <span class="num"
                >{{ item.contribute }}
                <span
                  v-if="hasPermission('companyread_all')"
                  class="percentage"
                  >{{
                    percentageTotal(item.contribute, data.total)
                  }}</span
                >
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
              <span v-if="progressFormat(item.contribute) > 80"
                >{{ formatNumber(item.contribute) }}
              </span>
              <span
                v-if="
                  progressFormat(item.contribute) > 80 &&
                  hasPermission('companyread_all')
                "
                >{{ percentageTotal(item.contribute, data.total) }}</span
              >
            </div>
            <span v-if="progressFormat(item.contribute) < 80" class="val"
              >{{ formatNumber(item.contribute) }}
            </span>
            <span
              v-if="
                progressFormat(item.contribute) < 80 &&
                hasPermission('companyread_all')
              "
              class="val"
              >{{ percentageTotal(item.contribute, data.total) }}</span
            >
          </div>
        </el-tooltip>
      </li>
    </ul>
    <div class="bar-columns">
      <div class="num"><span>0</span></div>
      <div class="num">
        <span>{{ formatNumber(data.companyMaxNum / 2) }}</span>
      </div>
      <div class="num">
        <span>{{ formatNumber(data.companyMaxNum) }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
      align-items: flex-end;
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
        // cursor: pointer;
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
    background: #002fa7;
    box-shadow: 4px 8px 12px 0px rgba(0, 92, 219, 0.25);
    font-size: 12px;
    color: #fff;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    // padding-right: 0px;
    transition: all 0.3s ease-in-out;
    span {
      padding-right: 1rem;
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
