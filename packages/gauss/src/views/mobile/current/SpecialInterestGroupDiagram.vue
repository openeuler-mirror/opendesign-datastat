<template>
  <div ref="slideRef" class="main-menu">
    <!-- <div class="activation">
      <span class="sp">{{ t('active') }}</span>
      <p class="spp">0</p>
      <span class="liveness"></span>
      <p class="spp">1</p>
    </div>
    <div class="Innovation">{{ t('repositoryTechnology') }}</div> -->

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

                '--color':'#FFFFFF',
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
    <!-- <div class="Community">{{ t('governanceAndOperation') }}</div>
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
      </div>

      <div class="wrapper">
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
    </div> -->
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCommonStore } from '@/stores/common';
import { querySigScoreAll } from 'shared/api';
import { IObject } from 'shared/@types/interface';
const useCommon = useCommonStore();
const router = useRouter();
const showAfter = 200;
const listData = ref([]);
const listArry = ref([{ feature: '', arry: [] }] as IObject[]);
const getList = () => {
  const query = {
    community: 'opengauss',
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
    return item.group === null;
  });
};
getList();
interface Form {
  sig_names: string;
  rank: number;
  score: number;
}
const goTo = (item: Form) => {
  // useStaff.dialogFormVisible = true;
  // useStaff.title = item.sig_names;
  // useStaff.sigRank = item.rank;
  // useStaff.sigContrubution = item.score;
  router.push(`/${useCommon.language}/mobile/sig/${item.sig_names}`);
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
  // border: 2px solid rgba(0, 47, 167, var(--diaphaneity));
  border: 2px solid #7d32ea;
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
  // background-color: rgba(0, 47, 167, var(--diaphaneity));
  background: #7d32ea;
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
<style lang="scss" scoped>
.el-dialog__header {
  padding: 0px !important;
}
.el-dialog__body {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
