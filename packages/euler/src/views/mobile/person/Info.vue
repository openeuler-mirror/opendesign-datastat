<template>
  <div class="userInfo">
    <div class="title">{{ t('individual') }}</div>
  </div>
  <div class="first">
    <div class="home"></div>
    <div class="toHome">
      <a style="color: #002fa7" target="_blank" :href="accountUrl">
        {{ t('toHome') }}
      </a>
    </div>
  </div>
  <div class="first">
    <div class="Maintainer"></div>
    <div class="List">
      <span>{{ t('community') }}： </span>
      <span v-for="items in sigInfo" :key="items.value" class="item">
        <span v-if="items.sig === 'TC'" class="usertypecolorboxTC" style="--color: 45deg, #b461f6 0%, #7d32ea 100%">TC</span>
        <span v-if="items.sig !== 'TC'" style="cursor: pointer" @click="goToSig(items.sig)">{{ items.sig }}</span>

        <span v-for="item in items.type" :key="item.value"
          ><span v-if="item === 'committers'" class="usertypecolorbox" style="--color: 225deg, #feb32a 0%, #f6d365 100%">Committer</span
          ><span v-if="item === 'maintainers' && items.sig !== 'TC'" class="usertypecolorbox" style="--color: 45deg, #005cd3 0%, #002fa7 100%"
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
import { onBeforeMount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { IObject } from 'shared/@types/interface';
import DataShow from './DataShow.vue';
import { queryUserAccountUrl } from 'shared/api/api-new';
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

const accountUrl = ref('');

const getUserAccountUrl = async () => {
  const res = await queryUserAccountUrl({ community: 'openeuler', user: props.user });
  accountUrl.value = res.data.html_url ?? '';
};


onBeforeMount(() => {
  getUserAccountUrl();
});

const goToSig = (data: IObject) => {
  router.push(`/${useCommon.language}/sig/${data}`);
};
watch(
  () => props.user,
  () => {
    getUserAccountUrl();
  }
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
