<template>
  <div class="userInfo">
    <div class="title">{{ t('individual') }}</div>
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
      <span>{{ t('community') }}： </span>
      <span v-for="items in sigInfo" :key="items.value" class="item">
        <span
          v-if="items.sig === 'TC'"
          class="usertypecolorboxTC"
          :style="({
                              '--color': '45deg, #B461F6 0%, #7D32EA 100%',
                            } as any)"
          >TC</span
        >
        <span
          v-if="items.sig !== 'TC'"
          style="cursor: pointer"
          @click="goToSig(items.sig)"
          >{{ items.sig }}</span
        >

        <span v-for="item in items.type" :key="item.value"
          ><span
            v-if="item === 'committers'"
            class="usertypecolorbox"
            :style="({
                              '--color': '225deg, #FEB32A 0%, #F6D365 100%',
                            } as any)"
            >Committer</span
          ><span
            v-if="item === 'maintainers' && items.sig !== 'TC'"
            class="usertypecolorbox"
            :style="({
                              '--color': '45deg, #005CD3 0%, #002FA7 100%',
                            } as any)"
            >Maintainer
          </span></span
        >
      </span>
    </div>
  </div>
  <data-show :user="props.user"></data-show>
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { queryUserOwnertype } from 'shared/api';
import { openCommunityInfo } from '@/api';
import { IObject } from 'shared/@types/interface';
import DataShow from './DataShow.vue';
const useCommon = useCommonStore();
const router = useRouter();
const { t } = useI18n();
const props = defineProps({
  user: {
    type: String,
    default: '',
  },
});
// 获取侧边栏明细
const sigInfo = ref({
  mailing_list: '',
} as IObject);
const querySigInfoData = () => {
  const params = {
    community: openCommunityInfo.name,
    user: props.user,
  };
  queryUserOwnertype(params).then((data) => {
    sigInfo.value = data?.data || {};
    sigInfo.value.sort((a: any, b: any) =>
      a['sig'].localeCompare(b['sig'], 'zh')
    );
    sigInfo.value.forEach((item: any, index: any) => {
      if (item.sig === 'TC') {
        sigInfo.value.unshift(sigInfo.value.splice(index, 1)[0]);
      }
    });
    sigInfo.value.map((item: any) =>
      item.type.sort((a: any, b: any) => b.length - a.length)
    );
    sigInfo.value.sort((a: any, b: any) =>
      b['type'][0].localeCompare(a['type'][0], 'zh')
    );
  });
};

const goToSig = (data: IObject) => {
  router.push(`/${useCommon.language}/sig/${data}`);
};
watch(
  () => props.user,
  () => querySigInfoData()
);
</script>
<style scoped lang="scss">
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
.usertypecolorbox {
  margin-left: 5px;
  background: linear-gradient(var(--color));
  border-radius: 2px;
  font-size: 10px;
  font-family: HarmonyOS_Sans_SC;
  color: #ffffff;
  line-height: 12px;
  height: 16px;
  width: 73px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.usertypecolorboxTC {
  background: linear-gradient(var(--color));
  border-radius: 2px;
  font-size: 10px;
  font-family: HarmonyOS_Sans_SC;
  color: #ffffff;
  line-height: 12px;
  width: 32px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
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
    display: flex;
  }
}
</style>
