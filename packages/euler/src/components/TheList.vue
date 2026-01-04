<template>
  <div class="main-menu">
    <div class="Innovation">{{ t("repositoryTechnology") }}</div>
    <el-row>
      <div v-for="value in innovationData" :key="value.feature">
        <div
          class="start-menu menu-item"
          :style="({
                '--diaphaneity': (20 + Number((Math.round((value.arry.reduce((sum = 0, obj:any) => (sum += obj.score), 0)/
                    value.arry.length) * 100) / 100).toFixed(2)) * 80) / 100,

              } as any)"
        >
          <span v-if="useCommon.language === 'zh'" class="start-menu-span">{{
            value.feature
          }}</span>
          <span v-if="useCommon.language === 'en'" class="start-menu-span-en">{{
            featureTranslateMap[value.feature]
          }}</span>
        </div>
        <el-col>
          <div
            v-for="(val, ind) in value.arry.sort((a:any, b:any) =>
              (a.sig_name + '').localeCompare(b.sig_name + '')
            )"
            :key="ind"
          >
            <div
              class="detail-menu menu-item"
              :style="({
                '--diaphaneity': (20 + Number(val.score) * 80) / 100,
                '--color': Number(val.score) < 0.5 ? '#555555' : '#FFFFFF',
              } as any)"
              @click="goTo(val)"
              :title="val.sig_name"
            >
              <span class="detail-menu-span" @click="goTo(val)">
                {{ val.sig_name }}</span
              >
            </div>
          </div>
        </el-col>
      </div>
    </el-row>
    <div class="Community">{{ t("governanceAndOperation") }}</div>
    <el-row>
      <div v-for="value in communityData" :key="value.feature">
        <div
          class="start-menu menu-item"
          :style="({
                '--diaphaneity': (20 + Number((Math.round((value.arry.reduce((sum = 0, obj:any) => (sum += obj.score), 0)/
                    value.arry.length) * 100) / 100).toFixed(2)) * 80) / 100,

              } as any)"
        >
          <span v-if="useCommon.language === 'zh'" class="start-menu-span">{{
            value.feature
          }}</span>
          <span v-if="useCommon.language === 'en'" class="start-menu-span-en">{{
            featureTranslateMap[value.feature]
          }}</span>
        </div>
        <el-col>
          <div
            v-for="(val, ind) in value.arry.sort((a:any, b:any) =>
              (a.sig_name + '').localeCompare(b.sig_name + '')
            )"
            :key="ind"
          >
            <div
              class="detail-menu menu-item"
              :style="({
                '--diaphaneity': (20 + Number(val.score) * 80) / 100,
                '--color': Number(val.score) < 0.5 ? '#555555' : '#FFFFFF',
              } as any)"
              @click="goTo(val)"
              :title="val.sig_name"
            >
              <span class="detail-menu-span" @click="goTo(val)">
                {{ val.sig_name }}</span
              >
            </div>
          </div>
        </el-col>
      </div></el-row
    >
  </div>
</template>
<script setup lang="ts">
import { reactive, shallowRef } from "vue";
import { useRouter } from "vue-router";
import { useCommonStore } from "@/stores/common";
import { useI18n } from "vue-i18n";
import { querySigScoreAll } from "shared/api/api-new";
const { t } = useI18n();
const useCommon = useCommonStore();
const router = useRouter();
const communityData = shallowRef<{ feature: string, arry: any[] }[]>([]);
const innovationData = shallowRef<{ feature: string, arry: any[] }[]>([]);
const featureTranslateMap = reactive<Record<string, string>>({});

const getList = () => {
  const query = {
    community: "openeuler",
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
const goTo = (item: any) => {
  const routeData: any = router.resolve(`/${useCommon.language}/sig/${item.sig_name}`);
  window.open(routeData.href, "_blank");
};
</script>
<style scoped lang="scss">
.main-menu {
  margin-top: 18px;

  .Community {
    padding-top: 24px;
    padding-bottom: 24px;
    color: #000000;
  }
  .Innovation {
    padding-bottom: 24px;
    padding-top: 10px;
    color: #000000;
  }
}

@media screen and (min-width: 1430px) {
  .menu-item {
    width: 180px;
    font-size: 16px;
  }
}
@media screen and (max-width: 1430px) {
  .menu-item {
    width: 160px;
    font-size: 14px;
  }
}
.start-menu {
  height: 80px;
  background: #ffffff;
  border: 2px solid rgba(0, 47, 167, var(--diaphaneity));
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000000;
  margin-right: 10px;
  font-family: HarmonyOS_Sans_SC;
  line-height: 24px;
}
.start-menu-span-en {
  width: 160px;
  text-align: center;
  word-wrap: break-word;
}

.detail-menu {
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  background-color: rgba(0, 47, 167, var(--diaphaneity));
  font-size: 14px;
  font-family: HarmonyOS_Sans_SC;
  line-height: 22px;
  color: var(--color);
  cursor: pointer;
  transition: all 0.3s;
  &-span {
    width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-align: center;
  }
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.detail-menu:hover {
  transform: scaleY(1.1) scaleX(1.1) translateZ(0);
  border: 2px solid #000000;
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
  left: 80px;
  bottom: 6px;
}
.numberIndex {
  position: absolute;
  right: 12px;
}
.lable {
  min-width: 100px;
}
.titlelable {
  min-width: 160px;
}
.titlenumberIndex {
  position: absolute;
  right: 16px;
}
</style>
