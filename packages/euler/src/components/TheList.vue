<template>
  <div class="main-menu">
    <el-row>
      <div v-for="(value, index) in listArry" :key="index">
        <el-tooltip
          :key="value.name"
          placement="bottom-end"
          effect="light"
          :show-after="showAfter"
          class:bar-tooltip
          :show-arrow="false"
        >
          <div class="start-menu">
            <span class="start-menu-span">{{ value.feature }}</span>
          </div>
          <template #content>
            <div class="lable">{{ value.feature }}</div>
            <div class="info">
              <p>
                <span class="index">特别兴趣小组数量：</span>
                {{ value.arry.length }}
              </p>
            </div>
            <div class="info">
              <p>
                <span v-if="value.arry.length" class="index"
                  >平均活跃度：
                  {{
                    value.arry.reduce((sum = 0, obj) => (sum += obj.score), 0) /
                    value.arry.length
                  }}</span
                >
                <span v-else class="index">平均活跃度：0</span>
              </p>
            </div>
          </template>
        </el-tooltip>
        <el-col>
          <el-tooltip
            v-for="(val, ind) in value.arry.sort((a, b) =>
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
              class="detail-menu"
              :style="({
                '--diaphaneity': (20 + Number(val.active) * 80) / 100,
                '--color': Number(val.active) < 0.5 ? '#555555' : '#FFFFFF',
              } as any)"
            >
              <span class="detail-menu-span"> {{ val.sig_names }}</span>
            </div>
            <template #content>
              <div class="lable">{{ val.sig_names }}</div>
              <div class="info">
                <p>
                  <span class="index">活跃度排名：</span>
                  #{{ val.rank }}
                </p>
              </div>
              <div class="info">
                <p>
                  <span class="index">活跃度：</span>
                  {{ val.score }}
                </p>
              </div>
              <div class="info">
                <div>查看详情：</div>
                <div>
                  <el-icon :size="16" class="right-btn" @click="goTo(val)">
                    <right class="app-text-btn" />
                  </el-icon>
                </div>
              </div>
            </template>
          </el-tooltip>
        </el-col>
      </div>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Right } from '@element-plus/icons-vue';
import { useCommonStore } from '@/stores/common';
import { querySigScoreAll } from 'shared/api';
import { IObject } from 'shared/@types/interface';
const useCommon = useCommonStore();
const router = useRouter();
const showAfter = 200;
const listData = ref([]);
const listArry = ref([
  {
    feature: '行业解决方案/应用',
    arry: [],
  },
  {
    feature: '桌面/图形系统',
    arry: [],
  },

  {
    feature: '架构/处理器/内核/驱动',
    arry: [],
  },
  {
    feature: '工具链/语言/运行',
    arry: [],
  },
  {
    feature: '云原生基础设施',
    arry: [],
  },
  {
    feature: '通用中间组件',
    arry: [],
  },
  {
    feature: '基础功能/特性/工具',
    arry: [],
  },
]);
const getList = () => {
  const query = {
    community: 'openeuler',
  };
  querySigScoreAll(query).then((data) => {
    listData.value = data?.data || [];
    console.log('Data', listData);
    listData.value.map((item: any) => {
      switch (item.feature) {
        case '工具链/语言/运行':
          listArry.value[3].arry.push(item);
          break;
        case '基础功能/特性/工具':
          listArry.value[6].arry.push(item);
          break;
        case '桌面/图形系统':
          listArry.value[1].arry.push(item);
          break;
        case '通用中间组件':
          listArry.value[5].arry.push(item);
          break;
        case '云原生基础设施':
          listArry.value[4].arry.push(item);
          break;
        case '架构/处理器/内核/驱动':
          listArry.value[2].arry.push(item);
          break;
        case '行业解决方案/应用':
          listArry.value[0].arry.push(item);
          break;
      }
    });
  });
};
getList();
// const { arry } = toRefs(listArry);
// const sortBy = (i) => {
//   return function (a, b) {
//     return b[i] - a[i];
//   };
// };
// const getsort = () => {
//   listArry.value.sort(sortBy('arry.length'));
// };
// getsort();
const goTo = (item) => {
  router.push(`/${useCommon.language}/sig/${item.sig_names}`);
};
</script>
<style scoped lang="scss">
.main-menu {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 18px;
}
.start-menu {
  width: 180px;
  height: 80px;
  background: #ffffff;
  border: 2px solid rgba(0, 47, 167, 0.4);
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000000;
  margin-right: 8px;
  font-size: 16px;
  font-family: HarmonyOS_Sans_SC;
  line-height: 24px;
  &:hover {
    border: 2px solid rgba(0, 47, 167, 0.8);
  }
}
.detail-menu {
  width: 180px;
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
  left: 70px;
  bottom: 6px;
}
</style>
