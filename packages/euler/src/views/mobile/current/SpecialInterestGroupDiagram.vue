<template>

  <div ref="slideRef" class="main-menu">
    <!-- <div v-if="isScroll" class="backtop" @click="backtop">
      {{ useCommon.language === 'zh' ? '点击回到顶部' : 'Back to Top' }}
    </div> -->
    <div class="activation">
      <span class="sp">{{ t('active') }}</span>
      <p class="spp">0</p>
      <span class="liveness"></span>
      <p class="spp">1</p>
    </div>
    <div class="Innovation">{{ t('repositoryTechnology') }}</div>

    <div v-for="value in getInnovationValue()" :key="value.feature">
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
        <!-- <template #content>
          <div class="titlelable">{{ value.feature }}</div>
          <div class="info">
            <p>
              <span class="index">{{ t('numberofsigs') }}</span>
              <span class="titlenumberIndex"> {{ value.arry.length }}</span>
            </p>
          </div>
          <div class="info">
            <p>
              <span v-if="value.arry.length" class="index">{{
                t('averageActiveness')
              }}</span>
              <span v-else class="index">{{
                t('averageActiveness') + ' 0'
              }}</span>
              <span class="titlenumberIndex">
                {{
                  (Math.round((value.arry.reduce((sum = 0, obj:any) => (sum += obj.score), 0)/
                    value.arry.length) * 100) / 100).toFixed(2)

                }}</span
              >
            </p>
          </div>
        </template> -->
      </div>

      <div class="wrapper">
        <div
          v-for="(val, ind) in value.arry.sort((a:any, b:any) =>
              (a.sig_names + '').localeCompare(b.sig_names + '')
            )"
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
              {{ val.sig_names }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="Community">{{ t('governanceAndOperation') }}</div>
    <div v-for="value in getCommunityValue()" :key="value.feature">
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
        <!-- <template #content>
          <div class="titlelable">{{ value.feature }}</div>
          <div class="info">
            <p>
              <span class="index">{{ t('numberofsigs') }}</span>
              <span class="titlenumberIndex"> {{ value.arry.length }}</span>
            </p>
          </div>
          <div class="info">
            <p>
              <span v-if="value.arry.length" class="index">{{
                t('averageActiveness')
              }}</span>
              <span v-else class="index">{{
                t('averageActiveness') + ' 0'
              }}</span>
              <span class="titlenumberIndex">
                {{
                  (Math.round((value.arry.reduce((sum = 0, obj:any) => (sum += obj.score), 0)/
                    value.arry.length) * 100) / 100).toFixed(2)

                }}</span
              >
            </p>
          </div>
        </template> -->
      </div>

      <div class="wrapper">
        <!-- <el-tooltip
          v-for="(val, ind) in value.arry.sort((a:any, b:any) =>
              (a.sig_names + '').localeCompare(b.sig_names + '')
            )"
          :key="ind"
          placement="bottom-end"
          effect="light"
          :show-after="showAfter"
          class:bar-tooltip
          :show-arrow="false"
        > -->
        <div
          v-for="(val, ind) in value.arry.sort((a:any, b:any) =>
              (a.sig_names + '').localeCompare(b.sig_names + '')
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
          >
            <span class="detail-menu-span" @click="goTo(val)">
              {{ val.sig_names }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogFormVisible" top="40vh" :show-close="false">
    <div class="info">
      <h3>{{ title }}</h3>
      <p>
        <span class="index">{{ t('ranking') }}</span>
        <span class="numberIndex"> #{{ sigRank }}</span>
      </p>
    </div>
    <div class="info">
      <p>
        <span class="index">{{ t('active') }}</span>
        <span class="numberIndex">
          {{ (Math.round(sigContrubution * 100) / 100).toFixed(2) }}</span
        >
      </p>
    </div>
    <div class="info">
      <p>
        <span style="cursor: pointer" @click="goToSigs(title)">查看详情</span>
        <span>
          <el-icon :size="16" class="right-btn" @click="goToSigs(title)">
            <right class="app-text-btn" />
          </el-icon>
        </span>
      </p>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Right } from '@element-plus/icons-vue';
import { useCommonStore } from '@/stores/common';
import { querySigScoreAll } from 'shared/api';
import { useI18n } from 'vue-i18n';
import { IObject } from 'shared/@types/interface';
const { t } = useI18n();
const useCommon = useCommonStore();
const router = useRouter();
const showAfter = 200;
const listData = ref([]);
const listArry = ref([{ feature: '', arry: [] }] as IObject[]);
const getList = () => {
  const query = {
    community: 'openeuler',
  };
  querySigScoreAll(query).then((data) => {
    listData.value = data?.data || [];
    const arry = listData.value
      .reduce((pre: any, next: any) => {
        const findOne: any = pre.find((it: any) => it.feature === next.feature);
        if (findOne) {
          findOne.arry.push(next);
        } else if (next.feature !== '') {
          pre.push({
            feature: next.feature,
            arry: [next],
            group: next.group,
          });
        }
        return pre;
      }, [])
      .sort((a: any, b: any) => b['arry'].length - a['arry'].length);
    listArry.value = arry;
  });
};
const getInnovationValue = () => {
  return listArry.value.filter((item) => {
    return item.group === '代码仓管理/技术创新';
  });
};
const getCommunityValue = () => {
  return listArry.value.filter((item) => {
    return item.group === '社区治理运营';
  });
};
getList();
const dialogFormVisible = ref(false);
const title = ref('');
const sigRank = ref('');
const sigContrubution = ref(0);
const goTo = (item: any) => {
  // router.push(`/${useCommon.language}/mobile/sig/${item.sig_names}`);
  dialogFormVisible.value = true;
  title.value = item.sig_names;
  sigRank.value = item.rank;
  sigContrubution.value = item.score;
};
const goToSigs = (title: any) => {
  router.push(`/${useCommon.language}/mobile/sig/${title}`);
};
// 滚动事件
const isScroll = ref(false);
const slideRef = ref<any>(null);
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
});
const backtop = () => {
  slideRef.value.scrollTop = 0;
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
