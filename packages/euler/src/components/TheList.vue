<template>
  <div class="main-menu">
    <el-row>
      <div v-for="(value, index) in listarry" :key="index">
        <el-tooltip
          :key="ind"
          placement="bottom-end"
          effect="light"
          :show-after="showAfter"
          class:bar-tooltip
          :show-arrow="false"
        >
          <div class="start-menu">
            <span class="start-menu-span">{{ value.name }}</span>
          </div>
          <template #content>
            <div class="lable">{{ value.name }}</div>
            <div class="info">
              <p>
                <span class="index">特别兴趣小组数量：</span>
                {{ value.number }}
              </p>
            </div>
            <div class="info">
              <p>
                <span class="index">平均活跃度：</span>
                {{ value.average }}
              </p>
            </div>
          </template>
        </el-tooltip>
        <el-col>
          <el-tooltip
            v-for="(val, ind) in value.arry"
            :key="ind"
            placement="bottom-end"
            effect="light"
            :show-after="showAfter"
            class:bar-tooltip
            :show-arrow="false"
          >
            <div
              class="detail-menu"
              :style="{
                '--diaphaneity': (20 + 80 * val.active) / 100,
                '--color': val.active < 0.5 ? '#555555' : '#FFFFFF',
              }"
            >
              <span class="detail-menu-span"> {{ val.name }}</span>
            </div>
            <template #content>
              <div class="lable">{{ val.name }}</div>
              <div class="info">
                <p>
                  <span class="index">活跃度排名：</span>
                  #{{ val.rank }}
                </p>
              </div>
              <div class="info">
                <p>
                  <span class="index">活跃度：</span>
                  {{ val.active }}
                </p>
              </div>
              <div class="info">
                <div>查看详情：</div>
                <div>
                  <el-icon :size="16" class="right-btn" @click="goTo(item)">
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
const useCommon = useCommonStore();
const router = useRouter();
const showAfter = 200;
const listData = ref([]);
const listArry = ref([
  {
    feature: '工具链/语言/运行',
    arry: [
      {
        name: 'sig-Rust',
        score: '0.5',
        rank: '1',
      },
    ],
  },
  {
    feature: '基础功能/特性/工具',
    arry: [
      {
        name: 'aig-ust',
        score: '0.85',
        rank: '1',
      },
    ],
  },
  {
    feature: '桌面/图形系统',
    arry: [
      {
        name: 'sig-android-middleware',
        score: '0.13',
        rank: '2',
      },
    ],
  },
  {
    feature: '通用中间组件',
    arry: [
      {
        name: 'sig-industrial-control',
        score: '0.65',
        rank: '1',
      },
    ],
  },
  {
    feature: '云原生基础设施',
    arry: [
      {
        name: 'caida-4',
        score: '0.85',
        rank: '1',
      },
    ],
  },
  {
    feature: '架构/处理器/内核/驱动',
    arry: [
      {
        name: 'cde',
        score: '0.2',
        rank: '2',
      },
    ],
  },
  {
    feature: '行业解决方案/应用',
    arry: [
      {
        name: 'caida4',
        score: '0.4',
        rank: '2',
      },
    ],
  },
]);
const getList = () => {
  const query = {
    community: 'openeuler',
  };
  querySigScoreAll(query).then((data) => {
    listData.value = data?.data || [];
    console.log('Data', listData);
    listData.value.map((item) => {
      switch (item.feature) {
        case '工具链':
          listArry.value[0].arry.push(item);
          break;
        case '基础系统':
          listArry.value[1].arry.push(item);
          break;
        case '桌面':
          listArry.value[2].arry.push(item);
          break;
        case '通用中间组件':
          listArry.value[3].arry.push(item);
          break;
        case '基础设施':
          listArry.value[4].arry.push(item);
          break;
        case '架构':
          listArry.value[5].arry.push(item);
          break;
        case '应用':
          listArry.value[6].arry.push(item);
          break;
      }
    });
  });
};
getList();
const goTo = (data: IObject) => {
  data;
  // router.push(`/${useCommon.language}/sig/${data.sig_names}`);
  router.push(`/${useCommon.language}/sig/Desktop`);
};

const listarry = ref([
  {
    id: '123',
    name: '工具链/语言/运行',
    number: '3',
    average: '0.5',
    arry: [
      {
        id: '1234',
        name: 'sig-Rust',
        active: '0.5',
        rank: '1',
      },
      {
        id: '1235',
        name: 'sigu-pust',
        active: '1',
        rank: '2',
      },
      {
        id: '1236',
        name: 'java',
        active: '0.2',
        rank: '3',
      },
    ],
  },
  {
    id: '123',
    name: '基础功能/特性/工具',
    number: 2,
    average: 0.4,
    arry: [
      {
        id: '1234',
        name: 'aig-ust',
        active: '0.85',
        rank: '1',
      },
      {
        id: '1235',
        name: 'yig-Rust',
        active: '0',
        rank: '2',
      },
    ],
  },
  {
    id: '123',
    name: '桌面/图形系统',
    arry: [
      {
        id: '1234',
        name: 'sig-android-middleware',
        active: '0.13',
        rank: '2',
      },
      {
        id: '1235',
        name: 'android-middleware',
        active: '0.93',
        rank: '1',
      },
    ],
  },
  {
    id: '123',
    name: '通用中间组件',
    arry: [
      {
        id: '12346',
        name: 'sig-industrial-control',
        active: '0.65',
        rank: '1',
      },
      {
        id: '12353',
        name: 'ig-industrial-control',
        active: '0.35',
        rank: '2',
      },
    ],
  },
  {
    id: '123',
    name: '云原生基础设施',
    arry: [
      {
        id: '1234',
        name: 'caida-4',
        active: '0.85',
        rank: '1',
      },
      {
        id: '1235',
        name: 'da5',
        active: '0.62',
        rank: '2',
      },
    ],
  },
  {
    id: '123',
    name: '架构/处理器/内核/驱动',
    arry: [
      {
        id: '1234',
        name: 'cde',
        active: '0.2',
        rank: '2',
      },
      {
        id: '1235',
        name: 'caida5',
        active: '0.4',
        rank: '1',
      },
    ],
  },
  {
    id: '123',
    name: '行业解决方案/应用',
    arry: [
      {
        id: '1234',
        name: 'caida4',
        active: '0.4',
        rank: '2',
      },
      {
        id: '1235',
        name: 'caida5',
        active: '0.75',
        rank: '1',
      },
    ],
  },
]);
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
