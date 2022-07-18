<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { querySigRepos, querySigInfo } from 'shared/api';
import { openCommunityInfo } from '@/api';
import { IObject } from 'shared/@types/interface';
const { t } = useI18n();
const props = defineProps({
  sig: {
    type: String,
    default: '',
  },
});
const { sig } = toRefs(props);
const cubeData = ref([] as any[]);
const getCubeData = () => {
  const query = {
    timeRange: 'lastonemonth',
    community: 'openeuler',
    sig: sig.value,
  };
  querySigRepos(query).then((data) => {
    const value = data?.data || {};
    cubeData.value = value[sig.value];
  });
};
// 获取侧边栏明细
const sigInfo = ref({
  mailing_list: '',
} as IObject);
const querySigInfoData = () => {
  const params = {
    community: openCommunityInfo.name,
    sig: sig.value,
  };
  querySigInfo(params).then((data) => {
    sigInfo.value = data?.data[0] || {};
  });
};
const getllData = () => {
  querySigInfoData();
  getCubeData();
};
watch(
  () => props.sig,
  () => {
    getllData();
  },
  { deep: true }
);
</script>
<template>
  <div class="container">
    <div class="wrap">
      <div class="main">
        <div class="main-left">
          <div class="main-left-sp">
            <div class="slogan">{{ sigInfo.description }}</div>
            <div class="first">
              <div class="home"></div>
              <div class="toHome">
                <a
                  style="color: #002fa7"
                  :href="`https://gitee.com/${sig}`"
                >
                  {{ t('toHome') }}</a
                >
              </div>
            </div>
            <div class="first">
              <div class="email"></div>
              <div class="List">
                <span>{{ t('MailingList') }}：</span>
                <a
                  v-if="sigInfo.mailing_list"
                  :href="`https://mailweb.openeuler.org/postorius/lists/${
                    sigInfo.mailing_list.split('@')[0]
                  }.${sigInfo.mailing_list.split('@')[1]}`"
                  class="item"
                >
                  {{ sigInfo.mailing_list }}
                </a>
              </div>
            </div>
            <div class="first">
              <div class="Maintainer"></div>
              <div class="List">
                <span>Maintainers： </span>
                <a
                  v-for="item in sigInfo.maintainers"
                  :key="item.value"
                  class="item"
                  :href="`https://gitee.com/${item}`"
                >
                  @{{ item }}
                </a>
              </div>
            </div>
            <div class="first">
              <div class="Mentor"></div>
              <div class="List">
                <span>Mentors：</span>
                <span
                  v-for="item in sigInfo.mentor"
                  :key="item.value"
                  class="item"
                >
                  {{ item }}
                </span>
                <span v-if="!sigInfo.mentor" class="noitem">
                  {{ t('noMentor') }}
                </span>
              </div>
            </div>
            <div class="first">
              <div class="store"></div>
              <div class="List">
                <span>{{ t('warehouse') }}：</span>
                <div class="atlas">
                  <a
                    v-for="item in cubeData"
                    :key="item"
                    class="item"
                    :href="item"
                  >
                    ./openeuler/
                    {{ item.split('/')[item.split('/').length - 1] }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  margin-top: -40px;
  min-height: 900px;
}
.main {
  //   display: grid;
  //   grid-template-columns: 28% 72%;
  &-left {
    &-sp {
      display: flex;
      flex-direction: column;
      margin-top: 50px;
      font-size: 12px;
      .first {
        margin-bottom: 16px;
        display: flex;
        position: relative;
        .toHome {
          padding-top: 5px;
          color: #002fa7;
          cursor: pointer;
        }
        .List {
          padding-top: 5px;
          display: flex;
          flex-direction: column;
          .item {
            margin-top: 5px;
            font-size: 12px;
            font-family: HarmonyOS_Sans_SC_Medium;
            color: #002fa7;
            line-height: 18px;
          }
        }
        .home {
          background-image: url('@/assets/home-outlined.png');
          width: 24px;
          height: 24px;
          margin-right: 4px;
        }
        .email {
          background-image: url('@/assets/email.png');
          width: 24px;
          height: 24px;
          margin-right: 4px;
        }
        .IRC {
          background-image: url('@/assets/chat.png');
          width: 24px;
          height: 24px;
          margin-right: 4px;
        }
        .Maintainer {
          background-image: url('@/assets/use-square.png');
          width: 24px;
          height: 24px;
          margin-right: 4px;
        }
        .Mentor {
          background-image: url('@/assets/user.png');
          width: 24px;
          height: 24px;
          margin-right: 4px;
        }
        .store {
          background-image: url('@/assets/cube.png');
          width: 24px;
          height: 24px;
          //   margin-right: 8px;
        }
      }
      .slogan {
        width: 300px;
        margin-bottom: 16px;
      }
    }
  }
}
.atlas {
  width: 350px;
  display: flex;
  flex-direction: column;
}
.noitem {
  margin-top: 8px;
  font-size: 12px;
  font-family: HarmonyOS_Sans_SC_Medium;
  line-height: 22px;
}
.wrap {
  padding: 0px;
}
</style>
