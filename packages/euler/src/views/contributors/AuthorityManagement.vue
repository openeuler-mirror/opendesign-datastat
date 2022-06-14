<template>
  <div>
    <div class="contributors-panel">
      <h3 id="groupActive" class="title">
        {{ t('groupActive') }}
      </h3>
      <div class="activation">
        <span class="sp">{{ t('active') }}</span>
        <p class="spp">0</p>
        <span class="liveness"></span>
        <p class="spp">1</p>
      </div>

      <the-list></the-list>
    </div>
    <div class="contributors-panel">
      <h3 id="companyRelations" class="title">
        {{ t('companyRelations') }}
      </h3>
      <div class="diagram-legend">
        <div class="point one-point"></div>
        <span>{{ t('company') }}</span>
        <div class="point two-point"></div>
        <span>{{ t('interestGroup') }}</span>
      </div>
      <div class="diagram">
        <o-diagram :data="diagramData"></o-diagram>
      </div>
    </div>
    <div class="contributors-panel">
      <h3 id="groupRelations" class="title">{{ t('groupRelations') }}</h3>
      <div class="note-caption">{{ t('Note') }}</div>
      <div class="ranking-list">
        <div class="ranking-list-item">
          <el-table v-loading="loading" :data="hightSig" style="width: 100%">
            <el-table-column
              align="center"
              :label="t('Committee')"
              width="200"
              show-overflow-tooltip
            >
              <template #default="scope">
                <div class="group-father">
                  <span class="group-name">{{ scope.row.name }}</span>
                  <span class="group-email">{{ scope.row.email }}</span>
                </div>
              </template></el-table-column
            >
            <el-table-column align="left">
              <template #header
                ><div class="getheader">
                  {{ t('interestGroup') }}
                </div>
              </template>
              <template #default="scope">
                <div class="Sgroup">
                  <span
                    v-for="(value, index) in scope.row.group"
                    :key="index"
                    class="group-email"
                    >{{ value }},
                  </span>
                </div>
              </template></el-table-column
            >
          </el-table>
        </div>
        <div class="ranking-list-item">
          <el-table v-loading="loading" :data="lowSig" style="width: 100%">
            <el-table-column
              align="center"
              :label="t('Committee')"
              width="200"
              show-overflow-tooltip
              ><template #default="scope">
                <div class="group-father">
                  <span class="group-name">{{ scope.row.name }}</span>
                  <span class="group-email">{{ scope.row.email }}</span>
                </div>
              </template></el-table-column
            >
            <el-table-column align="left">
              <template #header
                ><div class="getheader">
                  {{ t('interestGroup') }}
                </div> </template
              ><template #default="scope">
                <div class="Sgroup">
                  <span
                    v-for="(value, index) in scope.row.group"
                    :key="index"
                    class="group-email"
                    >{{ value }},
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
import TheList from '@/components/TheList.vue';
import ODiagram from 'shared/components/ODiagram.vue';
import { useI18n } from 'vue-i18n';
import { grouprelationsList } from 'shared/utils/groupList';
import { onMounted, ref, computed, watch } from 'vue';
import { queryCompanySigs } from 'shared/api';
import { useCommonStore } from '@/stores/common';
const { t } = useI18n();
const useCommon = useCommonStore();
const hightSig = computed(() => grouprelationsList.slice(0, number));
const lowSig = computed(() =>
  grouprelationsList.slice(number, grouprelationsList.length)
);
const number = Math.ceil(grouprelationsList.length / 2);
const listData = ref([]);
const diagramData = ref({
  name: 'flare',
  children: [
    {
      name: 'sig',
      children: [
        {
          name: '',
          key: '',
          imports: [],
        },
      ],
    },
    {
      name: 'company',
      children: [
        {
          name: '',
          key: '',
          imports: [],
        },
      ],
    },
  ],
});
const getList = () => {
  const query = {
    timeRange: 'lastoneyear',
    community: 'openeuler',
  };
  queryCompanySigs(query).then((data) => {
    listData.value = data?.data || [];

    const sigArry = listData.value.reduce((pre, next) => {
      pre.push(...next.sigList);
      return pre;
    }, []);
    const sigsData = [...new Set(sigArry)];
    diagramData.value.children[0].children = sigsData.map((item) => {
      return {
        name: item,
        key: item,
        imports: [],
      };
    });

    diagramData.value.children[1].children = listData.value.map((item) => {
      const imports = item.sigList.map((i) => `flare.sig.${i}`);
      return {
        name:
          useCommon.language === 'zh'
            ? item.company_cn
            : item.company_en === ''
            ? item.company_cn
            : item.company_en,
        key: item.company_cn,
        imports,
        length: imports.length,
      };
    });
  });
};
getList();
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
  padding: 24px;
  background: #fff;
  margin-top: 60px;
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
  font-size: 14px;
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
  margin-left: 35px;
}
.group-email {
  font-size: 14px;
  font-family: HarmonyOS_Sans_SC_Medium;
  color: #002fa7;
  line-height: 22px;
  &:hover {
    cursor: pointer;
  }
}
.group-name {
  width: 42px;
  height: 22px;
  font-size: 14px;
  font-family: HarmonyOS_Sans_SC;
  color: #000000;
  line-height: 22px;
  text-align-last: justify;
  text-align: justify;
  padding: 5px;
}
.Sgroup {
  margin-left: 65px;
}
.getheader {
  margin-left: 65px;
}
.diagram {
  display: flex;
  justify-content: center;
}
</style>
