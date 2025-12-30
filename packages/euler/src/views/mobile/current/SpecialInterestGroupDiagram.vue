<template>
  <div ref="slideRef" class="main-menu">
    <div class="activation">
      <span class="sp">{{ t('active') }}</span>
      <p class="spp">0</p>
      <span class="liveness"></span>
      <p class="spp">1</p>
    </div>
    <div class="Innovation">{{ t('repositoryTechnology') }}</div>

    <div v-for="value in innovationData" :key="value.feature">
      <div
        :key="value.feature"
        placement="bottom-end"
        effect="light"
        :show-after="showAfter"
        class:bar-tooltip
        :show-arrow="false"
      >
        <div
          class="start-menu menu-item"
          :style="({
                '--diaphaneity': (20 + Number((Math.round((value.arry.reduce((sum = 0, obj:any) => (sum += obj.score), 0)/
                    value.arry.length) * 100) / 100).toFixed(2)) * 80) / 100,

              } as any)"
        >
          <span class="start-menu-span">{{ value.feature }}</span>
        </div>
      </div>

      <div class="wrapper">
        <div
          v-for="(val, ind) in value.arry"
          :key="ind"
          placement="bottom-end"
          effect="light"
          :show-after="showAfter"
          class:bar-tooltip
          :show-arrow="false"
        >
          <div
            class="detail-menu menu-item"
            :style="({
                '--diaphaneity': (20 + Number(val.score) * 80) / 100,
                '--color': Number(val.score) < 0.5 ? '#555555' : '#FFFFFF',
              } as any)"
            @click="goTo(val)"
          >
            <span class="detail-menu-span" @click="goTo(val)">
              {{ val.sig_name }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="Community">{{ t('governanceAndOperation') }}</div>
    <div v-for="value in communityData" :key="value.feature">
      <div :key="value.feature">
        <div
          class="start-menu menu-item"
          :style="({
                '--diaphaneity': (20 + Number((Math.round((value.arry.reduce((sum = 0, obj:any) => (sum += obj.score), 0)/
                    value.arry.length) * 100) / 100).toFixed(2)) * 80) / 100,

              } as any)"
        >
          <span class="start-menu-span">{{ value.feature }}</span>
        </div>
      </div>

      <div class="wrapper">
        <div
          v-for="(val, ind) in value.arry"
          :key="ind"
        >
          <div
            class="detail-menu menu-item"
            :style="({
                '--diaphaneity': (20 + Number(val.score) * 80) / 100,
                '--color': Number(val.score) < 0.5 ? '#555555' : '#FFFFFF',
              } as any)"
            @click="goTo(val)"
          >
            <span class="detail-menu-span" @click="goTo(val)">
              {{ val.sig_name }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { useCommonStore } from '@/stores/common';
import { useI18n } from 'vue-i18n';
import { querySigScoreAll } from 'shared/api/api-new';
const { t } = useI18n();
const useCommon = useCommonStore();
const router = useRouter();
const showAfter = 200;
const communityData = shallowRef<{ feature: string, arry: any[] }[]>([]);
const innovationData = shallowRef<{ feature: string, arry: any[] }[]>([]);
const featureTranslateMap = reactive<Record<string, string>>({});
const getList = () => {
  const query = {
    community: "openeuleropen",
  };
  querySigScoreAll(query).then((res) => {
    if (!res?.data) return;
    const commMap = new Map<string, any[]>();
    const innovMap = new Map<string, any[]>();
    for (const item of res.data) {
      featureTranslateMap[item.feature_zh] = item.feature_en;
      const map = item.group_zh === '代码仓管理/技术创新' ? innovMap : commMap;
      const findOne = map.get(item.feature_zh);
      if (findOne) {
        findOne.push(item);
      } else {
        map.set(item.feature_zh, [item]);
      }
    }
    communityData.value = Array.from(commMap.entries()).map(([feature, arry]) => ({ feature, arry })).sort((a, b) => b.arry.length - a.arry.length);
    innovationData.value = Array.from(innovMap.entries()).map(([feature, arry]) => ({ feature, arry })).sort((a, b) => b.arry.length - a.arry.length);
  });
};
getList();
interface Form {
  sig_name: string;
  rank: number;
  score: number;
}
const goTo = (item: Form) => {
  router.push(`/${useCommon.language}/mobile/sig/${item.sig_name}`);
};
</script>
<style scoped lang="scss">
.main-menu {
  margin-top: 18px;

  .Community {
    padding-top: 24px;
    padding-bottom: 24px;
    color: #000000;
    font-size: 14px;
  }
  .Innovation {
    padding-bottom: 24px;
    padding-top: 10px;
    color: #000000;
    font-size: 14px;
  }
}

@media screen and (max-width: 1430px) {
  .menu-item {
    width: 68px;
    height: 68px;
    display: flex;
    font-size: 12px;
  }
}
.start-menu {
  height: 40px;
  width: auto;
  background: #ffffff;
  border: 2px solid rgba(0, 47, 167, var(--diaphaneity));
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000000;
  font-family: HarmonyOS_Sans_SC;
  line-height: 24px;
  &-span {
    font-size: 12px;
    font-weight: 500;
  }
}
.detail-menu {
  height: 68px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 47, 167, var(--diaphaneity));
  font-size: 8px;
  font-family: HarmonyOS_Sans_SC;
  line-height: 16px;
  color: var(--color);
  cursor: pointer;
  transition: all 0.3s;
  width: auto;
  &-span {
    width: auto;
    word-break: break-word;
    text-align: center;
  }
  overflow: hidden;
}
.detail-menu:hover {
  transform: scaleY(1.1) scaleX(1.1) translateZ(0);
  border: 2px solid #000000;
}
.wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr); // 宽度平均分成四等份
  /* 声明行间距和列间距 */
  grid-gap: 8px;
  margin-bottom: 16px;
}
.activation {
  .liveness {
    display: inline-block;
    width: 120px;
    height: 4px;
    background: linear-gradient(270deg, #002fa7 0%, rgba(0, 47, 167, 0.2) 100%);
  }
  .sp {
    display: inline-block;
    height: 16px;
    font-size: 12px;
    font-family: HarmonyOS_Sans_SC;
    color: #4e5865;
    line-height: 16px;
    text-align: center;
  }
  .spp {
    display: inline-block;
    width: 7px;
    height: 16px;
    font-size: 12px;
    font-family: HarmonyOS_Sans_SC;
    color: #8d98aa;
    line-height: 16px;
    margin-left: 8px;
    margin-right: 8px;
  }
}
</style>
<style lang="scss">
.el-dialog__header {
  padding: 0px !important;
}
.el-dialog__body {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
