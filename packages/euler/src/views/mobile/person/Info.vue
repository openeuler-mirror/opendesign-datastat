<template>
  <div class="userInfo">
    <div class="title">个人简介</div>
    <el-avatar :size="120" :src="circleUrl" />
    <div class="slogan">{{ sigInfo.description }}</div>
  </div>
  <div class="first">
    <div class="home"></div>
    <div class="toHome">
      <a
        style="color: #002fa7"
        target="_blank"
        :href="`https://gitee.com/${props.user}`"
      >
        {{ t('toHome') }}</a
      >
    </div>
  </div>
  <div class="first">
    <div class="Maintainer"></div>
    <div class="List">
      <span>社区角色： </span>
      <a
        v-for="item in sigInfo.maintainers"
        :key="item.value"
        class="item"
        target="_blank"
        :href="`https://gitee.com/${item}`"
      >
        @{{ item }}
      </a>
    </div>
  </div>
  <data-show :user="props.user"></data-show>
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import OAnchor from 'shared/components/OAnchor.vue';
import { ref, onMounted, watch, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { querySigRepos, querySigName, querySigInfo } from 'shared/api';
import { openCommunityInfo } from '@/api';
import { IObject } from 'shared/@types/interface';
import { Search } from '@element-plus/icons-vue';
import { ElScrollbar } from 'element-plus';
import DataShow from './DataShow.vue';
const useCommon = useCommonStore();
const router = useRouter();
const route = useRoute();
const sencondTitle = ref('');
const { t } = useI18n();
const drownData = ref([] as any[]);
const props = defineProps({
  user: {
    type: String,
    default: '',
  },
});
// sencondTitle.value = props.user;
// const getDrownData = () => {
//   let community = 'openeuler';
//   querySigName(community).then((data) => {
//     const allSigs = data?.data || {};
//     allSigs.openeuler.sort((a: any, b: any) => a.localeCompare(b));
//     const findOne =
//       allSigs.openeuler.find((item: any) => item === route.params.name) ||
//       allSigs.openeuler[0];
//     sencondTitle.value = findOne;
//     const firstKeys = Object.keys(allSigs);
//     drownData.value = allSigs[firstKeys[0]];
//     reallData.value = drownData.value.sort((a, b) => a.localeCompare(b));
//     getllData();
//   });
// };

const anchorData = ['SIGContribution', 'DynamicContribute'];
const clickDrownItem = (item: string) => {
  sencondTitle.value = item;
  getllData();
};
const cubeData = ref([] as any[]);
const getCubeData = () => {
  const query = {
    timeRange: 'lastonemonth',
    community: 'openeuler',
    sig: sencondTitle.value,
  };
  querySigRepos(query).then((data) => {
    const value = data?.data || {};
    cubeData.value = value[sencondTitle.value];
  });
};

const getllData = () => {
  querySigInfoData();
  getCubeData();
  clean();
};
onMounted(() => {
  // getDrownData();
});
// 跳转首页
const goToTetail = () => {
  router.push(`/${useCommon.language}/detail`);
};
// 搜索过滤
const searchInput = ref('');
const reallData = ref([] as IObject[]);
const querySearch = () => {
  if (searchInput.value !== '') {
    const newList = drownData.value.filter((item: any) =>
      item.toLowerCase().includes(searchInput.value)
    );
    reallData.value = newList;
  }
};
// 清除搜索
const clearSearchInput = () => {
  // getDrownData();
  searchInput.value = '';
};
const clean = () => {
  searchInput.value = '';
};
// 获取侧边栏明细
const sigInfo = ref({
  mailing_list: '',
} as IObject);
const querySigInfoData = () => {
  const params = {
    community: openCommunityInfo.name,
    sig: sencondTitle.value,
  };
  querySigInfo(params).then((data) => {
    sigInfo.value = data?.data[0] || {};
  });
};
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const inputSlider = (value: number) => {
  scrollbarRef.value?.setScrollTop(value);
};
const showDropdown = (e: any) => {
  if (e) {
    let number = 0;
    reallData.value.forEach((item: any, index) => {
      if (item === sencondTitle.value) {
        number = index;
      }
    });
    inputSlider(number * 32);
  }
};
const state = reactive({
  circleUrl:
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
});

const { circleUrl } = toRefs(state);
</script>
<style scoped lang="scss">
.contributors-panel {
  padding: 24px;
  background: #fff;
  margin-bottom: 24px;
  .title {
    font-size: 16px;
    color: #000;
    font-weight: 600;
    margin-bottom: 24px;
  }
}
.container {
  margin-top: 80px;
  min-height: 900px;
  background-color: #f5f6f8;
}
.step {
  padding: 40px 0;
  font-size: 12px;
  &-one {
    color: #002fa7;
    cursor: pointer;
  }
  &-two {
    color: #555555;
  }
}
.main {
  display: grid;
  grid-template-columns: 28% 72%;
  &-left {
    padding-right: 24px;
    .edropdown {
      .btnc {
        background-image: url('@/assets/down.png');
        width: 24px;
        height: 24px;
        position: absolute;
        right: -15px;
      }
    }
    &-title {
      font-size: 24px;
      font-family: HarmonyOS_Sans_SC_Medium;
      color: #002fa7;
      line-height: 32px;
      text-overflow: ellipsis;
      width: 350px;
      white-space: nowrap;
      overflow: hidden;
    }
    &-top {
      display: flex;
      position: relative;
    }
    &-sp {
      display: flex;
      flex-direction: column;
      margin-top: 24px;
      .first {
        margin-top: 18px;
        display: flex;
        position: relative;
        .toHome {
          padding-top: 3px;
          color: #002fa7;
          cursor: pointer;
        }
        .List {
          padding-top: 3px;
          display: flex;
          flex-direction: column;
          .item {
            margin-top: 8px;
            font-size: 14px;
            font-family: HarmonyOS_Sans_SC_Medium;
            color: #002fa7;
            line-height: 22px;
          }
        }
        .home {
          background-image: url('@/assets/home-outlined.png');
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        .Maintainer {
          background-image: url('@/assets/cose.png');
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
      }
    }
  }
}
.searchInput {
  width: 350px;
  margin: 10px;
  .search-icon {
    font-size: 20px;
  }
  :deep(.el-autocomplete) {
    width: 100%;
    &.active .el-input__inner {
      box-shadow: 0 0 0 1px #002fa7 inset;
    }
  }
  :deep(.el-input__prefix) {
    left: 12px;
    align-items: center;
  }
  @media screen and (min-width: 900px) {
    :deep(.el-input__inner) {
      padding-left: 40px;
    }
  }
  @media screen and (max-width: 900px) {
    :deep(.el-input__prefix) {
      left: 10px;
    }
  }
  :deep(.el-input__inner:focus) {
    box-shadow: 0 0 0 1px #002fa7 inset;
  }
}
.userInfo {
  .title {
    margin-bottom: 16px;
  }
  .slogan {
    margin-top: 16px;
  }
}
.first {
  margin-top: 18px;
  display: flex;
  position: relative;
  .toHome {
    padding-top: 3px;
    color: #002fa7;
    cursor: pointer;
  }
  .List {
    padding-top: 3px;
    display: flex;
    flex-direction: column;
    .item {
      margin-top: 8px;
      font-size: 14px;
      font-family: HarmonyOS_Sans_SC_Medium;
      color: #002fa7;
      line-height: 22px;
    }
  }
  .home {
    background-image: url('@/assets/home-outlined.png');
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  .Maintainer {
    background-image: url('@/assets/cose.png');
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
}
</style>
