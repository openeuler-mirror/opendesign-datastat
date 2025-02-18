<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePersonalStore } from '@/stores/personal';
import { useCommonStore } from '@/stores/common';
import { useRouter } from 'vue-router';
import OBanner from 'shared/components/OBanner.vue';
import TheProgress from '@/components/TheProgress.vue';
import AppFooter from '@/components/AppFooter.vue';
import FormSearch from './FormSearch.vue';
import TheForm from '@/components/TheForm.vue';
import TheBar from '../../components/TheBar.vue';
import useScroll from 'shared/hooks/useScroll';
import OAnchor from 'shared/components/OAnchor.vue';
import titleBg from '@/assets/title-bg.png';
import chevronsUp from '~icons/app/chevrons-up';
import AuthorityManagement from './AuthorityManagement.vue';
import { hasPermission } from 'shared/utils/login';
const { t, locale } = useI18n();
const usePersonal = usePersonalStore();
const useCommon = useCommonStore();
const router = useRouter();
locale.value = localStorage.getItem('lang') || 'zh';
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
const loading = ref(true);
const getContributeInfo = () => {
  usePersonal.getPersonalData();
};
onMounted(() => {
  usePersonal.getPersonalData();
  loading.value = false;
});
const hightRanking = computed(() => usePersonal.hightRanking);
const lowRanking = computed(() => usePersonal.lowRanking);
const typeLable = ref('');
const switchType = () => {
  switch (usePersonal.personalForm.contributeType) {
    case 'pr':
      typeLable.value = t('home.prs');
      break;
    case 'issue':
      typeLable.value = t('home.issues');
      break;
    case 'comment':
      typeLable.value = t('home.comments');
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
// TOP20 index修改
const indexMethod = (index: number) => {
  return index + 11;
};
const search404 = ref(false);
const searchStsate = (item: boolean) => {
  search404.value = item;
};
const { isScrollUp } = useScroll('up');
watch(
  () => isScrollUp.value,
  () => {
    if (isScrollUp.value) {
      const lang =
        useCommon.language === 'zh' ? '/zh/overview' : '/en/overview';
      router.push(lang);
    }
  }
);
const anchorData = computed(() => {
  return hasPermission('sigRead')
    ? [
        'companyContributor',
        'userContributor',
        'groupActive',
        'companyRelations',
        'groupRelations',
      ]
    : ['companyContributor', 'userContributor'];
});
const goToCompany = () => {
  const routeData: any = router.resolve(`/${useCommon.language}/company`);
  window.open(routeData.href, '_blank');
};
</script>

<template>
  <div class="container">
    <o-banner :style="{ backgroundImage: 'url(' + titleBg + ')' }">
      <div class="banner-title">
        <o-icon class="icon"><chevrons-up></chevrons-up></o-icon>
        <h3 class="title">{{ t('backVitality') }}</h3>
      </div>
    </o-banner>
    <div class="area">
      <o-anchor top="18rem" :data="anchorData" :offset-value="400"></o-anchor>
      <div class="wrap">
        <div class="contributors-panel">
          <h3 id="companyContributor" class="title">
            {{ t('companyContributor') }}
          </h3>
          <form-search @search-state="searchStsate" />
          <div v-if="search404" class="search404">
            <img class="cover" src="@/assets/404.png" alt="404" />
            <p class="text">{{ t('searchTips') }}</p>
          </div>
          <the-bar v-else></the-bar>
          <div  class="goToCompany">
            <span class="title" @click="goToCompany">查看单位会员贡献详情</span
            ><img src="@/assets/right.png" alt="" @click="goToCompany" style="cursor:pointer"/>
          </div>
        </div>
        <div class="contributors-panel">
          <h3 id="userContributor" class="title">{{ t('userContributor') }}</h3>
          <the-form
            :option="formOption"
            :component-name="componentName"
            @get-contribute-info="getContributeInfo"
          ></the-form>

          <div class="ranking-list">
            <div class="ranking-list-item">
              <p class="caption">Top 1-10</p>
              <el-table
                v-loading="loading"
                :data="hightRanking"
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                  align="center"
                  :label="t('ranking')"
                  width="100"
                />
                <el-table-column
                  prop="gitee_id"
                  align="left"
                  label="Gitee ID"
                  show-overflow-tooltip
                  width="180"
                />
                <el-table-column
                  align="left"
                  class-name="type-label"
                  :label="typeLable"
                >
                  <template #default="scope">
                    <div class="box">
                      <span class="num">{{ scope.row.contribute }}</span>

                      <the-progress :item="scope.row.contribute"></the-progress>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="ranking-list-item">
              <p class="caption">Top 11-20</p>
              <el-table
                v-loading="loading"
                :data="lowRanking"
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                  :index="indexMethod"
                  align="center"
                  :label="t('ranking')"
                  width="100"
                ></el-table-column>
                <el-table-column
                  prop="gitee_id"
                  align="left"
                  show-overflow-tooltip
                  label="Gitee ID"
                  width="180"
                />
                <el-table-column
                  align="left"
                  class-name="type-label"
                  :label="typeLable"
                >
                  <template #default="scope">
                    <div class="box">
                      <span class="num">{{ scope.row.contribute }}</span>
                      <the-progress :item="scope.row.contribute"></the-progress>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <authority-management
          v-if="hasPermission('sigRead')"
        ></authority-management>
      </div>
      <footer>
        <app-footer></app-footer>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/shared/styles/style.scss';
.container {
  background: #000;
}
.o-banner {
  height: 224px;
  padding-top: 80px;
}
.contributors-panel {
  padding: 24px;
  background: #fff;
  margin-top: 60px;
  .title {
    font-size: 24px;
    color: #000;
    font-weight: normal;
    margin-bottom: 20px;
  }
  .Form-head {
    display: flex;
    width: auto;
    .Form-block {
      width: 180px;
      height: 80px;
      background: #ffffff;
      margin: 18px;
      padding: 18px;
      border: 2px solid #002fa7;
      align-items: center;
      line-height: 24px;
      .Form-block-sp {
        width: 163px;
        height: 24px;
        font-size: 12px;
        color: #000000;
        line-height: 24px;
      }
    }
  }
}
.banner-title {
  height: 144px;
  text-align: center;
  padding-top: 80px;
  .title {
    font-size: 16px;
    font-weight: 100;
    color: #fff;
    line-height: 24px;
  }
  .o-icon {
    color: #fff;
    animation: chevronsUp 2s infinite;
    display: inline-block;
  }
}

.search404 {
  text-align: center;
  margin-bottom: 40px;
  .cover {
    width: 360px;
    margin-bottom: 15px;
  }
  .text {
    font-size: 14px;
    color: #555;
  }
}
.ranking-list {
  display: grid;
  grid-template-columns: 46% 46%;
  grid-column-gap: 8%;
  .caption {
    font-size: 16px;
    color: #000;
    line-height: 24px;
    margin-bottom: 8px;
  }
  .box {
    display: flex;
    .num {
      width: 50px;
      text-align: right;
    }
  }
}
.goToCompany {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 38px;
  text-align: center;

  .title {
    cursor: pointer;
    margin-right: 8px;
    font-size: 14px;
    font-weight: 400;
    color: #555555;
    line-height: 22px;
    margin-top: 20px;
  }
}
</style>
