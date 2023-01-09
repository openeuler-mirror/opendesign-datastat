<!-- eslint-disable vue/no-useless-template-attributes -->
<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { useI18n } from 'vue-i18n';
import FormSearch from '../contributors/FormSearch.vue';
import { openCommunityInfo } from '@/api/index';
import { useCompanyStore } from '@/stores/company';
import { usePersonalStore } from '@/stores/personal';
import { useCommonStore } from '@/stores/common';
import { hasPermission, hasPermissions } from 'shared/utils/login';
import TheForm from '@/components/TheForm.vue';
import OMobileTemplate from 'shared/components/OMobileTemplate.vue';
import MenberAndGroupRelationship from './current/MenberAndGroupRelationship.vue';
import { formatNumber, toThousands } from 'shared/utils/helper';
import logo from '@/assets/datastat-black.png';
import logoZh from '@/assets/datastat-zh-black.png';
import communityLogo from '@/assets/openeuler.png';
import bg_mo from '@/assets/bg_mo.png';
import atomLogo from '@/assets/atom.png';
import SpecialInterestGroupDiagram from './current/SpecialInterestGroupDiagram.vue';
import CommitteeAndSpecialGroupRelationship from './current/CommitteeAndSpecialGroupRelationship.vue';
import { useRoute, useRouter } from 'vue-router';
import { IObject } from 'shared/@types/interface';
import MobileTemplate from '@/components/MobileTemplate.vue';
import { Right } from '@element-plus/icons-vue';
import { useStaffStore } from '@/stores/staff';
const useStaff = useStaffStore();
const router = useRouter();
const route = useRoute();
const useCompany = useCompanyStore();
const usePersonal = usePersonalStore();
const useCommon = useCommonStore();
const { t, locale } = useI18n();

const swiperRef: any = ref(null);
const onSwiper = (swiper: any) => {
  swiperRef.value = swiper;
};
const onSlideChange = (swiper: any) => {
  useCommon.isBlackHeader = swiper.activeIndex < 2;
  useCommon.moNav = swiper.activeIndex;
  router.replace({
    query: {
      num: swiper.activeIndex,
    },
  });
};
// 监听导航跳转
watch(
  () => useCommon.moNav,
  () => {
    !swiperRef.value.destroyed && swiperRef.value.slideTo(useCommon.moNav);
  }
);

// 个人信息
const progressFormat = (item: number) => {
  return (100 / useCompany.companyMaxNum) * item;
};
const formOption = computed(() => {
  return [
    {
      label: t('from.type'),
      id: 'contributeType',
      active: 'pr',
      list: [
        { label: t('home.prs'), value: 'pr' },
        { label: t('home.issues'), value: 'issue' },
        { label: t('home.comments'), value: 'comment' },
      ],
    },
    {
      label: t('from.timeRange'),
      id: 'timeRange',
      active: 'mother',
      list: [
        { label: t('from.lastonemonth'), value: 'lastonemonth' },
        { label: t('from.lasthalfyear'), value: 'lasthalfyear' },
        { label: t('from.lastoneyear'), value: 'lastoneyear' },
        { label: t('from.all'), value: 'all' },
      ],
    },
  ];
});
// theform组件调用
const componentName = 'personal';
const getContributeInfo = () => {
  usePersonal.getPersonalData();
};
const loading = ref(true);

const progressColor = ref('#002FA7');
const personalFormat = (item: number) => {
  return (100 / usePersonal.personalMaxNum) * item;
};
onMounted(() => {
  usePersonal.getPersonalData();
  useCommon.getAllData();
  loading.value = false;
  !swiperRef.value.destroyed && swiperRef.value.slideTo(route.query.num || 0);
});

const modules = [Pagination];
const isblack = computed(() => useCommon.isBlackHeader);

const search404 = ref(false);
const searchStsate = (item: boolean) => {
  search404.value = item;
};

locale.value = localStorage.getItem('lang') || 'zh';

const contributeType = ref('');
const switchType = () => {
  switch (usePersonal.personalForm.contributeType) {
    case 'pr':
      contributeType.value = 'home.prs';
      break;
    case 'issue':
      contributeType.value = 'home.issues';
      break;
    case 'comment':
      contributeType.value = 'home.comments';
      break;
  }
};
switchType();
watch(
  () => usePersonal.personalForm.contributeType,
  () => {
    switchType();
  }
);
watch(
  () => locale.value,
  () => {
    usePersonal.getPersonalData();
    useCommon.getAllData();
    switchType();
  }
);

// 滚动事件
const isScroll = ref(false);
const slideRef = ref<any>(null);
const isScroll1 = ref(false);
const slideRef1 = ref<any>(null);
onMounted(() => {
  slideRef.value?.addEventListener(
    'scroll',
    () => {
      nextTick(() => {
        isScroll.value = slideRef.value?.scrollTop > 200 ? true : false;
      });
    },
    true
  );
  slideRef1.value?.addEventListener(
    'scroll',
    () => {
      nextTick(() => {
        isScroll1.value = slideRef1.value?.scrollTop > 200 ? true : false;
      });
    },
    true
  );
});

const backtop = () => {
  slideRef.value.scrollTop = 0;
};
const backtop1 = () => {
  slideRef1.value.scrollTop = 0;
};
const goToCompany = (data: IObject) => {
  if (
    hasPermissions(data.company_cn) ||
    (hasPermission('companyread_all') &&
      data.company_cn !== '个人贡献者' &&
      data.company_en !== 'independent')
  ) {
    data;
    router.push(`/${useCommon.language}/mobile/company/${data.company_cn}`);
  } else {
  }
};
const goToSigs = (title: any) => {
  router.push(`/${useCommon.language}/mobile/sig/${title}`);
  useStaff.dialogFormVisible = false;
};

// 跳转个人详情
const goToUser = (data: IObject) => {
  router.push(`/${useCommon.language}/mobile/user/${data}`);
};
</script>
<template>
  <swiper
    :class="{ black: isblack }"
    :pagination="true"
    :modules="modules"
    @swiper="onSwiper"
    @slide-change="onSlideChange"
  >
    <swiper-slide
      class="slide-page1"
      :style="'background-image:url(' + bg_mo + ')'"
    >
      <div class="overview-page">
        <p class="overview-page-item">
          {{ t('home.user')
          }}<span class="num">{{ toThousands(useCommon.allData.users) }}</span>
        </p>
        <p class="overview-page-item">
          {{ t('home.contributors')
          }}<span class="num">{{
            toThousands(useCommon.allData.contributors)
          }}</span>
        </p>
        <p class="overview-page-item">
          {{ t('home.partners')
          }}<span class="num">{{
            toThousands(useCommon.allData.partners)
          }}</span>
        </p>
      </div>

      <p class="time">{{ useCommon.time }}</p>
    </swiper-slide>
    <swiper-slide
      class="slide-page2"
      :style="'background-image:url(' + bg_mo + ')'"
    >
      <div class="overview-page2">
        <p class="overview-page2-item">
          {{ t('home.prs') }}
          <span class="num">{{ formatNumber(useCommon.allData.prs) }}</span>
        </p>
        <p class="overview-page2-item">
          {{ t('home.issues') }}
          <span class="num">{{ formatNumber(useCommon.allData.issues) }}</span>
        </p>
        <p class="overview-page2-item">
          {{ t('home.comments') }}
          <span class="num">{{
            formatNumber(useCommon.allData.comments)
          }}</span>
        </p>
        <p class="overview-page2-item">
          {{ t('home.sigs') }}
          <span class="num">{{ formatNumber(useCommon.allData.sigs) }}</span>
        </p>
        <p class="overview-page2-item">
          {{ t('home.repos')
          }}<span class="num">{{ toThousands(useCommon.allData.repos) }}</span>
        </p>
      </div>
      <p class="time">{{ useCommon.time }}</p>
    </swiper-slide>
    <swiper-slide class="slide-page3">
      <div ref="slideRef" class="slide-panel">
        <div v-if="isScroll" class="backtop" @click="backtop">
          {{ useCommon.language === 'zh' ? '点击回到顶部' : 'Back to Top' }}
        </div>
        <div class="slide-panel-content">
          <h3 class="title">{{ t('companyContributor') }}</h3>
          <form-search @search-state="searchStsate" />
          <div v-if="search404" class="search404">
            <img class="cover" src="@/assets/404.png" alt="404" />
            <p class="text">{{ t('searchTips') }}</p>
          </div>
          <ul v-else class="company-content">
            <li
              v-for="(item, index) in useCompany.companyData"
              :key="'com' + index"
              class="company-content-item"
            >
              <p class="name" @click="goToCompany(item)">
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
                    cursor: hasPermission('companyread_all')
                      ? 'pointer'
                      : 'auto',
                    color: hasPermission('companyread_all')
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
              <div class="progress">
                <div
                  class="progress-inner"
                  :style="{
                    width: progressFormat(item.contribute) + '%',
                  }"
                >
                  <span v-if="progressFormat(item.contribute) > 80">
                    {{ toThousands(item.contribute) }}</span
                  >
                </div>
                <span v-if="progressFormat(item.contribute) < 80" class="val">{{
                  toThousands(item.contribute)
                }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </swiper-slide>
    <swiper-slide class="slide-page3">
      <div ref="slideRef1" class="slide-panel">
        <div v-if="isScroll1" class="backtop" @click="backtop1">
          {{ useCommon.language === 'zh' ? '点击回到顶部' : 'Back to Top' }}
        </div>
        <div class="slide-panel-content">
          <h3 class="title">{{ t('userContributor') }}</h3>
          <the-form
            :option="formOption"
            :component-name="componentName"
            @get-contribute-info="getContributeInfo"
          ></the-form>
          <el-table
            v-loading="loading"
            :data="usePersonal.personalData"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              width="48"
              align="center"
              :label="t('Number')"
            />
            <el-table-column
              prop="gitee_id"
              align="left"
              label="Gitee ID"
              show-overflow-tooltip
              width="110"
              ><template #default="scope">
                <div>
                  <span
                    :style="{
                      cursor: 'pointer',
                      color: '#002FA7',
                    }"
                    @click="goToUser(scope.row.gitee_id)"
                    >{{ scope.row.gitee_id }}</span
                  >
                </div>
              </template></el-table-column
            >
            <el-table-column :label="t(contributeType)">
              <template #default="scope">
                <div class="box">
                  <span class="num">{{
                    toThousands(scope.row.contribute)
                  }}</span>
                  <el-progress
                    :show-text="false"
                    :stroke-width="8"
                    :color="progressColor"
                    :percentage="personalFormat(scope.row.contribute)"
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </swiper-slide>
    <swiper-slide>
      <mobile-template header="groupActive">
        <template #content>
          <special-interest-group-diagram></special-interest-group-diagram>
        </template>
      </mobile-template>
    </swiper-slide>
    <!-- <el-dialog
      v-model="useStaff.dialogFormVisible"
      top="40vh"
      :show-close="false"
    >
      <div class="info">
        <h3>{{ useStaff.title }}</h3>
        <p>
          <span class="index">{{ t('ranking') }}</span>
          <span class="numberIndex"> #{{ useStaff.sigRank }}</span>
        </p>
      </div>
      <div class="info">
        <p>
          <span class="index">{{ t('active') }}</span>
          <span class="numberIndex">
            {{
              (Math.round(useStaff.sigContrubution * 100) / 100).toFixed(2)
            }}</span
          >
        </p>
      </div>
      <div class="info">
        <p>
          <span style="cursor: pointer" @click="goToSigs(useStaff.title)">{{
            t('viewDetail')
          }}</span>
          <span>
            <el-icon
              :size="16"
              class="right-btn"
              @click="goToSigs(useStaff.title)"
            >
              <right class="app-text-btn" />
            </el-icon>
          </span>
        </p>
      </div>
    </el-dialog> -->
    <!-- <swiper-slide>
      <o-mobile-template header="companyRelations">
        <template #content>
          <menber-and-group-relationship></menber-and-group-relationship>
        </template>
      </o-mobile-template>
    </swiper-slide> -->
    <swiper-slide>
      <o-mobile-template header="groupRelations">
        <template #content>
          <committee-and-special-group-relationship></committee-and-special-group-relationship>
        </template>
      </o-mobile-template>
    </swiper-slide>
    <swiper-slide class="slide-page3">
      <div class="slide-panel foot-panel">
        <div class="atom-item">
          <img :src="atomLogo" alt="" />
          <p>
            {{ t('footer.atom') }}
          </p>
        </div>

        <div class="foot-item-logo">
          <img :src="useCommon.language === 'zh' ? logoZh : logo" alt="" />
          <span class="line">|</span>
          <img :src="communityLogo" alt="" />
        </div>
        <div class="foot-item-link">
          <router-link
            :to="useCommon.language === 'zh' ? '/zh/about' : '/en/about'"
            >{{ t('footer.about') }}</router-link
          >
          <a :href="t('footer.privacyLink')">{{ t('footer.privacy') }}</a>
          <a :href="t('footer.legalLink')">{{ t('footer.legal') }}</a>
        </div>
        <div class="foot-item-cy">
          <p class="mail">{{ openCommunityInfo.email }}</p>
          <p class="cy">{{ t('footer.copyright') }}</p>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>
<style lang="scss" scoped>
@import '@/shared/styles/style.scss';
.swiper {
  height: 100vh;
  background: #f5f6f8;
  &.black {
    :deep(.swiper-pagination) {
      .swiper-pagination-bullet {
        background: #f5f6f8;
      }
      .swiper-pagination-bullet-active {
        background: #406fe7;
      }
    }
  }
  .mobile-video {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 1;
    video {
      height: 100%;
    }
  }

  .gotop {
    position: absolute;
    top: 0;
    left: 50%;
    color: #999;
    transform: translateX(-50%);
    font-size: 12px;
  }

  .time {
    position: absolute;
    bottom: 64px;
    left: 16px;
    display: inline-block;
    height: 14px;
    font-size: 10px;
    color: #ffffff;
    line-height: 14px;
    opacity: 0.8;
  }
  .slide-page1,
  .slide-page2 {
    position: relative;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    background: #000 no-repeat top center/cover;
  }
  .slide-page1 {
    .overview-page {
      display: grid;
      align-items: end;
      height: 100%;
      grid-template-rows: 60%;
      padding: 0 16px 114px;
      position: relative;
      z-index: 2;
      &-item {
        color: #d3dce9;
        font-size: 16px;
        .num {
          display: block;
          font-size: 40px;
          color: #fff;
        }
      }
    }
  }
  .slide-page2 {
    .overview-page2 {
      display: grid;
      align-items: end;
      height: 100%;
      grid-template-rows: 55%;
      padding: 0 16px 114px;
      position: relative;
      z-index: 2;
      &-item {
        color: #d3dce9;
        font-size: 12px;
        .num {
          display: block;
          font-size: 32px;
          color: #fff;
        }
        &:first-child {
          grid-column: 1 / 4;
        }
        &:nth-child(2) {
          grid-column: 1 / 4;
        }
        &:nth-child(3) {
          grid-column: 1 / 4;
        }
      }
    }
  }
  .slide-page3 {
    padding: 48px 16px 62px;
    box-sizing: border-box;
    .slide-panel {
      background: #fff;
      height: 100%;
      overflow: hidden auto;

      position: relative;
      scroll-behavior: smooth;
      &-content {
        padding: 16px;
        .title {
          font-size: 18px;
          margin-bottom: 24px;
        }
        :deep(.contributions-statistical) {
          margin: 0;

          .searchInput {
            padding-left: 0;
          }
        }
        :deep(.el-form) {
          .el-form-item {
            display: block;
            padding: 0;
            margin-bottom: 16px;
            &__label {
              font-size: 12px;
              margin-bottom: 5px;
              line-height: 20px;
              display: block;
            }
            .el-radio {
              height: 24px;
              padding: 0 6px;
              margin: 0 5px 12px 0;
              &__label {
                font-size: 12px;
              }
            }
          }
        }
      }
    }
    .foot-panel {
      display: grid;
      place-content: center;
      height: 100%;
      padding: 0;
      background: none;
      .foot-item-logo {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          height: 32px;
        }
        .line {
          margin: 0 16px;
        }
      }
      .foot-item-link {
        display: flex;
        justify-content: center;
        margin: 40px 0;
        a {
          color: #555;
          font-size: 12px;
          padding: 0 8px;
          border-right: 1px solid #555;
          &:last-child {
            border: 0 none;
          }
        }
      }
      .foot-item-cy {
        text-align: center;
        line-height: 21px;
        p {
          font-size: 12px;
          color: #555;
        }
        .cy {
          color: #999;
          margin-top: 8px;
        }
      }
      .atom-item {
        text-align: center;
        margin-bottom: 60px;
        img {
          height: 40px;
        }
        p {
          font-size: 12px;
          color: #999;
          margin-top: 8px;
          width: 325px;
        }
      }
    }
    :deep(.el-table) {
      .cell {
        font-size: 12px;
        padding: 0 5px;
        .box {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
      .el-progress {
        flex: 1;
        display: inline-block;
        margin-left: 5px;
        &-bar__outer {
          background: none !important;
        }
      }
    }
  }
}

.search404 {
  text-align: center;
  margin-bottom: 40px;
  .cover {
    width: 80%;
    margin-bottom: 15px;
  }
  .text {
    font-size: 14px;
    color: #555;
  }
}
.company-content {
  &-item {
    padding: 16px 0;
    list-style: none;
    border-bottom: 1px solid #dfe1e8;
    .name {
      font-size: 14px;
      color: #000;
      line-height: 22px;
      .index {
        color: #9097a3;
        font-size: 14px;
        margin-right: 10px;
      }
    }
  }
}
.progress {
  height: 24px;
  display: flex;
  width: 100%;
  align-items: center;
  margin-top: 10px;
  &-inner {
    background: #002fa7;
    box-shadow: 4px 8px 12px rgba(0, 92, 219, 0.25);
    font-size: 12px;
    color: #fff;
    height: 100%;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    padding-right: 8px;
    transition: all 0.3s ease-in;
  }
  .val {
    color: #000;
    font-size: 12px;
    margin-left: 8px;
  }
}
:deep(.swiper-pagination) {
  left: 14px;
  bottom: 30px;
  text-align: left;
  .swiper-pagination-bullet {
    width: 20px;
    height: 2px;
    background: #000;
    opacity: 0.3;
    border-radius: 0;
    &-active {
      background: #406fe7;
      opacity: 1;
    }
  }
}
.bar-tooltip {
  padding: 12px 16px;
  box-shadow: 4px 8px 16px 0px rgba(10, 11, 13, 0.05),
    0px 0px 32px 0px rgba(10, 11, 13, 0.1);
  .lable {
    font-size: 12px;
    font-family: HarmonyOS_Sans_SC;
    color: #4e5865;
    line-height: 16px;

    .text {
      font-weight: 100;
    }
  }
  .info {
    color: #4e5865;
    display: flex;
    justify-content: center;
    margin-top: 6px;
    min-width: 180px;
    align-items: center;
    position: relative;
  }
}
.index {
  font-size: 12px;
  font-family: HarmonyOS_Sans_SC;
  color: #4e5865;
  line-height: 16px;
}
p {
  margin-top: 10px;
}
// 按钮样式
.app-text-btn {
  cursor: pointer;
  color: rgba(#002fa7, 1);
  &:active {
    color: rgba(0, 47, 167, 0.7);
  }
}
.right-btn {
  position: absolute;
  left: 120px;
}
.numberIndex {
  position: absolute;
  right: 12px;
}
</style>
