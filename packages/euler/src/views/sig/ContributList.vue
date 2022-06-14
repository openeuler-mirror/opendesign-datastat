<script setup lang="ts">
import TheProgress from '@/components/TheProgress.vue';
import TheForm from '@/components/TheForm.vue';
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { openCommunityInfo } from '@/api/index';
import { querySigUserContribute } from 'shared/api/index';
import { sortExp } from 'shared/utils/helper';
import { IObject } from 'shared/@types/interface';
const { t } = useI18n();
const props = defineProps({
  sig: {
    type: String,
    required: true,
    default: '',
  },
});
const param = ref({
  contributeType: 'PR',
  timeRange: 'lastonemonth',
  community: openCommunityInfo.name,
  sig: computed(() => props.sig),
} as IObject);
const memberData = ref([]);
const memberMax = ref(0);
const getMemberData = () => {
  querySigUserContribute(param.value).then((data) => {
    const memberList = data.data.sort(sortExp('contribute', false));
    memberMax.value = memberList[0].contribute;
    memberData.value = memberList;
  });
};
getMemberData();

const lastformOption = computed(() => {
  return [
    {
      label: t('from.type'),
      id: 'contributeType',
      active: 'pr',
      list: [
        { label: t('home.prs'), value: 'PR' },
        { label: t('home.issues'), value: 'Issue' },
        { label: t('home.comments'), value: 'Comment' },
      ],
    },
    {
      label: t('from.timeRange'),
      id: 'timeRange',
      active: 'mother',
      list: [
        { label: t('from.lastonemonth'), value: 'lastonemonth' },
        { label: t('from.lasthalfyear'), value: 'lasthalfyear' },
        { label: t('from.lastoneyear'), value: 'lastoneyear' },
        { label: t('from.all'), value: 'all' },
      ],
    },
  ];
});
// theform组件调用
const componentName = 'member';
const loading = ref(true);
const getContributeInfo = (e: IObject) => {
  param.value[e.id] = e.active;
  getMemberData();
};
const typeLable = ref('');
const switchType = () => {
  switch (param.value.contributeType) {
    case 'PR':
      typeLable.value = t('home.prs');
      break;
    case 'Issue':
      typeLable.value = t('home.issues');
      break;
    case 'Comment':
      typeLable.value = t('home.comments');
      break;
  }
};
switchType();
watch(
  () => props.sig,
  () => {
    getMemberData();
  }
);
onMounted(() => {
  loading.value = false;
});
// // 总数据
// const tableData = computed(() => useStaff.memberData);
// 默认显示第1页
const currentPage = ref(1);
// 显示第几页
const handleCurrentChange = (val: number) => {
  // 改变默认的页数
  currentPage.value = val;
};
//  index修改
const indexMethod = (index: number) => {
  return (currentPage.value - 1) * 10 + index + 1;
};
</script>
<template>
  <div>
    <div class="theSecondForm">
      <the-form
        :option="lastformOption"
        :component-name="componentName"
        @get-contribute-info="getContributeInfo($event)"
      ></the-form>
    </div>
    <div class="edcolor-box">
      <div class="blue-box">
        <div class="box"></div>
        Maintainer
      </div>
      <div class="yellow-box">
        <div class="box"></div>
        Committer
      </div>
      <div class="red-box">
        <div class="box"></div>
        Contributor
      </div>
    </div>
    <div class="leader">
      <div class="leader-box">Leader</div>
      <span>SIG Leader</span>
    </div>

    <div class="ranking-list">
      <div class="ranking-list-item">
        <p class="caption"></p>
        <el-table
          v-loading="loading"
          :data="memberData.slice((currentPage - 1) * 10, currentPage * 10)"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            :index="indexMethod"
            align="center"
            :label="t('ranking')"
            width="120"
          />
          <el-table-column
            prop="gitee_id"
            align="left"
            label="Gitee ID"
            show-overflow-tooltip
            width="200"
            ><template #default="scope">
              <div class="usertype-box">
                <span
                  v-show="scope.row.usertype !== 'committers'"
                  class="usertypecolorbox"
                  :style="({
                    '--color':
                      scope.row.usertype === 'maintainers'
                        ? '#002FA7'
                        : '#4AAEAD',
                  } as any)"
                ></span>
                <span
                  v-show="scope.row.usertype === 'committers'"
                  class="usertypecolorbox"
                  :style="({
                    '--color': '#FEB32A',
                  } as any)"
                ></span>
                <span class="num">{{ scope.row.gitee_id }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            class-name="type-label"
            :label="typeLable"
          >
            <template #default="scope">
              <div class="box">
                <span class="num">{{ scope.row.contribute }}</span>

                <the-progress
                  :item="scope.row.contribute"
                  :component-name="componentName"
                  :member-list="memberMax"
                  :usertype="scope.row.usertype"
                ></the-progress>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="demo-pagination-block">
      <el-pagination
        v-show="memberData.length > 0"
        background
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="memberData.length"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
@import '@/shared/styles/style.scss';
.theSecondForm {
  padding-left: 24px;
  padding-right: 24px;
}
.ranking-list {
  display: grid;
  grid-template-columns: 100%;
  padding-left: 24px;
  padding-right: 24px;
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
  .usertype-box {
    display: flex;
    align-items: center;
    .num {
      width: 100px;
      text-align: left;
    }
  }
}
.edcolor-box {
  display: flex;
  margin-left: 20px;
  padding-bottom: 10px;

  .blue-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 12px;
      height: 12px;
      background: linear-gradient(45deg, #005cd3 0%, #002fa7 100%);
      border-radius: 50%;
      margin-right: 8px;
    }
  }
  .yellow-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 12px;
      height: 12px;
      background: linear-gradient(225deg, #feb32a 0%, #f6d365 100%);
      border-radius: 2px;
      font-size: 10px;
      font-family: HarmonyOS_Sans_SC;
      color: #ffffff;
      line-height: 12px;
      text-align: center;
      margin-right: 8px;
      border-radius: 50%;
    }
  }
  .red-box {
    margin-right: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 12px;
      height: 12px;
      background: linear-gradient(225deg, #4aaead 0%, #6bfbfa 100%);
      border-radius: 2px;
      font-size: 10px;
      font-family: HarmonyOS_Sans_SC;
      color: #ffffff;
      line-height: 12px;
      text-align: center;
      margin-right: 8px;
      border-radius: 50%;
    }
  }
}
.demo-pagination-block {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.usertypecolorbox {
  width: 12px;
  height: 12px;
  // background: linear-gradient(var(--color));
  background: var(--color);
  border-radius: 50%;
  margin-right: 8px;
}
.leader {
  margin-bottom: 10px;
  margin-left: 20px;
  display: flex;
  &-box {
    width: 58px;
    height: 16px;
    background: linear-gradient(45deg, #005cd3 0%, #002fa7 100%);
    border-radius: 2px;
    color: #ffffff;
    margin-right: 10px;
    text-align: center;
  }
}
</style>
