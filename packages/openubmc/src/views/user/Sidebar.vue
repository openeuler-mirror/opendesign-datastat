<script setup lang="ts">
import { ODivider, OIcon, OIconSearch, OInput, OLink, OOption, OSelect, OVirtualList } from '@opensig/opendesign';
import { request } from 'shared/plugins/axios';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import IconGitCode from '~icons/app/gitcode.svg';
import cosePng from '@/assets/cose.png';
import { binarySearch } from '@/shared/utils';
import { usePersonalStore } from '@/stores/person';
import { useI18n } from 'vue-i18n';
import SectionCard from '@/components/SectionCard.vue';
import { refDebounced } from '@vueuse/core';
import useCommonFilters from '@/composables/useCommonFilters';

const route = useRoute();
const router = useRouter();
const userStore = usePersonalStore();

const { locale } = useI18n();
const userName = computed({
  get() {
    return route.params.id as string;
  },
  set(id) {
    router.push({ name: 'user-detail', params: { id, lang: locale.value ?? 'zh' } });
  },
});

const userSearchInput = ref('');
const userSearchInputDebounced = refDebounced(userSearchInput, 300);
const allUsers = computed(() => {
  if (userSearchInputDebounced.value) {
    return userStore.allUsers.filter((item) => item.toUpperCase().includes(userSearchInputDebounced.value.toUpperCase()));
  }
  return userStore.allUsers;
});

const currentUserIndex = computed(() => binarySearch(allUsers.value, userName.value, (current, target) => current.localeCompare(target, 'en')));

const getAllUsers = () => {
  if (userStore.allUsers?.length) return;
  request
    .get('/api-magic/stat_new/userlist?community=openubmc')
    .then((res) => res.data ?? {})
    .then((res) => {
      if (res.code !== 1 || !res.data) return;
      const collator = Intl.Collator('en');
      userStore.allUsers = Object.keys(res.data).sort((a, b) => collator.compare(a, b));
    });
};

const userInfo = ref<{ user_login: string; html_url: string } | null>();

const getUserInfo = () => {
  userInfo.value = null;
  request
    .get('/api-magic/stat_new/user/info', { params: { community: 'openubmc', user: userName.value } })
    .then((res) => res.data ?? {})
    .then((res) => {
      if (res.code !== 1 || !res.data) return;
      userInfo.value = res.data;
    });
};

const vListRef = useTemplateRef('virtualList');
const onSelectOptionsVisibleChange = (visible: boolean) => {
  if (visible) {
    setTimeout(() => {
      vListRef.value?.scrollToView(currentUserIndex.value);
    }, 50);
  }
};

const userRoleInfo = ref<
  {
    sig_name: string;
    role: string[];
  }[]
>([]);

const getUserRoleInfo = () => {
  userRoleInfo.value = [];
  request
    .get('/api-magic/sig/user/ownertype', { params: { community: 'openubmc', user: userName.value } })
    .then((res) => res.data ?? {})
    .then((res) => {
      if (res.code !== 1 || !res.data) return;
      userRoleInfo.value = res.data;
      userStore;
    });
};
const userRoleLabelMap = {
  maintainer: 'Maintainer',
  committer: 'Committer',
  contributor: 'Contributor',
};

const timeRange = ref<Date[]>([]);

const contributeData = ref<{ sig: number; pr: number; comment: number; issue: number }>();
const getContributeData = () => {
  const params = {
    community: 'openubmc',
    user: userName.value,
  } as Record<string, any>;
  if (timeRange.value?.length === 2) {
    params.start = timeRange.value[0].getTime();
    params.end = timeRange.value[1].getTime();
  }
  request
    .get('/api-magic/stat_new/count', { params })
    .then((res) => res.data ?? {})
    .then((res) => {
      if (res.code !== 1 || !res.data) return;
      contributeData.value = res.data;
    });
};

const onUserChange = () => {
  getUserInfo();
  getUserRoleInfo();
  getContributeData();
};

watch(userName, onUserChange);

onMounted(() => {
  getAllUsers();
  onUserChange();
});

const toSigDetail = (sig: string) => {
  router.push({ name: 'sig-detail', params: { id: sig, lang: locale.value ?? 'zh' } });
};

const { disabledTimeRange } = useCommonFilters()
</script>

<template>
  <SectionCard class="content-card">
    <OSelect v-model="userName" @change="onUserChange" style="width: 100%" @options-visible-change="onSelectOptionsVisibleChange">
      <OInput style="width: 100%" v-model="userSearchInput">
        <template #prefix
          ><OIcon><OIconSearch /></OIcon
        ></template>
      </OInput>
      <OVirtualList
        v-if="allUsers.length"
        ref="virtualList"
        :list="allUsers"
        style="max-height: inherit; margin-top: 4px"
        :item-size="40"
        :default-start-index="currentUserIndex"
      >
        <template #default="{ item }">
          <OOption :key="item" :label="item" :value="item" />
        </template>
      </OVirtualList>
    </OSelect>

    <p style="margin-top: 18px">
      <OLink color="primary" hover-underline style="--link-gap: 10px" :href="userInfo?.html_url ?? ''" target="_blank" rel="noopener noreferrer">
        <template #icon
          ><OIcon style="font-size: 24px"><IconGitCode /></OIcon
        ></template>
        gitcode主页
      </OLink>
    </p>

    <ODivider style="--o-divider-gap: 16px" />

    <template v-if="userRoleInfo.length">
      <p class="user-role-title title">
        <img :src="cosePng" />
        <span class="user-role-text">社区角色</span>
      </p>

      <div class="user-role-content">
        <div class="user-role-item" v-for="item in userRoleInfo" :key="item.sig_name" @click="toSigDetail(item.sig_name)">
          {{ item.sig_name }}
          <span v-for="role in item.role" :key="role" :data-role="role" class="user-role-tag">{{
            userRoleLabelMap[role as keyof typeof userRoleLabelMap]
          }}</span>
        </div>
      </div>

      <ODivider style="--o-divider-gap: 16px" />
    </template>

    <p class="title">贡献</p>
    <ElDatePicker
      style="margin-top: 24px; --el-date-editor-daterange-width: 100%"
      unlink-panels
      v-model="timeRange"
      type="daterange"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="getContributeData"
      :disabled-date="disabledTimeRange"
    />
    <ElRow v-if="contributeData" style="margin-top: 24px">
      <ElCol :span="12">
        <p class="contribute-detail-title">合并请求PR</p>
        <p class="contribute-detail">{{ contributeData.pr.toLocaleString('en-US') }}</p>
        <p class="contribute-detail-title">评审Comment</p>
        <p class="contribute-detail">{{ contributeData.comment.toLocaleString('en-US') }}</p>
      </ElCol>
      <ElCol :span="12">
        <p class="contribute-detail-title">需求&问题 Issue</p>
        <p class="contribute-detail">{{ contributeData.issue.toLocaleString('en-US') }}</p>
        <p class="contribute-detail-title">SIG数量</p>
        <p class="contribute-detail">{{ contributeData.sig.toLocaleString('en-US') }}</p>
      </ElCol>
    </ElRow>
  </SectionCard>
</template>

<style lang="scss" scoped>
.title {
  font-weight: bold;
}
.contribute-detail {
  @include h4;
  margin-top: 4px;
  font-weight: bold;
}
.contribute-detail-title {
  &:not(:first-child) {
    margin-top: 24px;
  }
  @include text1;
  color: rgb(78, 88, 110);
}
.user-role-title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  .user-role-text {
    margin-left: 8px;
  }
}
.user-role-content {
  padding-left: 32px;
  .user-role-item {
    color: var(--o-color-primary1);
    &:not(:last-child) {
      margin-bottom: 8px;
    }
    @include text1;
    .user-role-tag {
      @include tip2;
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      color: #fff;
      margin-left: 8px;

      &[data-role='maintainer'] {
        background-color: rgb(0, 98, 220);
      }
      &[data-role='committer'] {
        background-color: rgb(240, 188, 0);
      }
      &[data-role='contributor'] {
        background-color: rgb(0, 167, 179);
      }
    }
  }
}
.user-desc {
  @include text2;
}

.content-card {
  padding: 24px;
  height: 100%;
}
</style>
