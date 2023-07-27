<template>
  <div>
    <div class="contributors-panel">
      <div class="note-caption">{{ t('Note') }}</div>
      <div class="ranking-list">
        <div class="ranking-list-item">
          <el-table :data="hightSig" style="width: 100%">
            <el-table-column align="left" show-overflow-tooltip>
              <template #header>
                <span class="list-title"> {{ t('Committee') }} </span>
              </template>
              <template #default="scope">
                <div class="group-father">
                  <span class="group-name">{{ scope.row.name }}</span>
                  <a
                    :href="`http://gitee.com/${scope.row.user}`"
                    class="group-email"
                    >@{{ scope.row.user }}</a
                  >
                </div>
              </template></el-table-column
            >
            <el-table-column align="left">
              <template #header
                ><div class="list-title">
                  {{ t('interestGroup') }}
                </div>
              </template>
              <template #default="scope">
                <div class="Sgroup">
                  <span
                    v-for="(value, index) in scope.row.sigs"
                    :key="index"
                    class="group-email"
                    @click="goToSig(value)"
                    >{{ value
                    }}{{ index < scope.row.sigs.length - 1 ? ',' : '' }}
                  </span>
                </div>
              </template></el-table-column
            >
          </el-table>
        </div>
        <div class="ranking-list-item">
          <el-table
            :data="lowSig"
            style="
               {
                width: 100%;
              }
            "
          >
            <el-table-column align="left" show-overflow-tooltip>
              <template #header>
                <span class="list-title"> {{ t('Committee') }} </span>
              </template>
              <template #default="scope">
                <div class="group-father">
                  <span class="group-name">{{ scope.row.name }}</span>
                  <a
                    :href="`http://gitee.com/${scope.row.user}`"
                    class="group-email"
                    >@{{ scope.row.user }}</a
                  >
                </div>
              </template></el-table-column
            >
            <el-table-column align="left">
              <template #header
                ><div class="list-title">
                  {{ t('interestGroup') }}
                </div> </template
              ><template #default="scope">
                <div class="Sgroup">
                  <span
                    v-for="(value, index) in scope.row.sigs"
                    :key="index"
                    class="group-email"
                    @click="goToSig(value)"
                    >{{ value
                    }}{{ index < scope.row.sigs.length - 1 ? ',' : '' }}
                  </span>
                </div>
              </template></el-table-column
            >
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';
import { queryTCSigs } from 'shared/api';
import { useCommonStore } from '@/stores/common';
import { useRouter } from 'vue-router';
const { t } = useI18n();
const router = useRouter();
const useCommon = useCommonStore();
// 小组关系列表
const groupData = ref([]);
const number = ref(0);
const getGroup = () => {
  const query = {
    community: 'openeuler',
  };
  queryTCSigs(query).then((data) => {
    groupData.value = data?.data || [];
    number.value = Math.ceil(
      groupData.value.sort((a: any, b: any) => a.name?.localeCompare(b.name))
        .length / 2
    );
  });
};
getGroup();

const lowSig = computed(() =>
  groupData.value.slice(number.value, groupData.value.length)
);
const hightSig = computed(() => groupData.value.slice(0, number.value));
const goToSig = (item: any) => {
  const routeData: any = router.resolve(
    `/${useCommon.language}/mobile/sig/${item}`
  );
  window.open(routeData.href, '_self');
};
</script>
<style scoped lang="scss">
@import '@/shared/styles/style.scss';
.activation {
  .liveness {
    display: inline-block;
    width: 120px;
    height: 4px;
    background: linear-gradient(270deg, #002fa7 0%, rgba(0, 47, 167, 0.2) 100%);
  }
  .sp {
    display: inline-block;
    width: 36px;
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
.contributors-panel {
  background: #fff;
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
.diagram-legend {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #555;
  .point {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .one-point {
    background-color: #002fa7;
  }
  .two-point {
    margin-left: 24px;
    background-color: #feb32a;
  }
}
.note-caption {
  font-size: 12px;
  font-family: HarmonyOS_Sans_SC;
  color: #555555;
  line-height: 22px;
  margin-bottom: 16px;
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
.group-father {
  text-align-last: justify;
  text-align: justify;
  width: 60px;
  // margin-left: 24px;
}
.group-email {
  font-size: 12px;
  font-family: HarmonyOS_Sans_SC_Medium;
  color: #002fa7;
  line-height: 22px;
  display: inline-block;
  &:hover {
    cursor: pointer;
  }
}
.group-name {
  // width: 42px;
  height: 22px;
  font-size: 12px;
  font-family: HarmonyOS_Sans_SC;
  color: #000000;
  line-height: 22px;
  text-align-last: justify;
  text-align: justify;
  // padding: 5px;
}
.diagram {
  display: flex;
  justify-content: center;
}
.list {
  padding-right: 0px;
}

.goToAllSig {
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
.list-title {
  font-size: 12px;
}
</style>
