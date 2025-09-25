<script setup lang="ts">
import SectionCard from '@/components/SectionCard.vue';
import { binarySearch } from '@/shared/utils';
import { ODivider, OIcon, OIconSearch, OInput, OLink, OOption, OSelect } from '@opensig/opendesign';
import { createReusableTemplate, refDebounced } from '@vueuse/core';
import { request } from 'shared/plugins/axios';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import IconGitCode from '~icons/app/gitcode.svg';
import IconMail from '~icons/app/mail.svg';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const allSigs = ref<string[]>([]);
const { locale } = useI18n()
const sigName = computed({
  get() {
    return route.params.id as string;
  },
  set(id) {
    router.push({ name: 'sig-detail', params: { id, lang: locale.value ?? 'zh' } });
  }
});

const sigSearchInput = ref('')
const sigSearchInputDebounced = refDebounced(sigSearchInput, 300)
const filteredAllSigs = computed(() => {
  if (sigSearchInputDebounced.value) {
    return allSigs.value.filter((item) => item.toUpperCase().includes(sigSearchInputDebounced.value.toUpperCase()));
  }
  return allSigs.value;
});

watch(
  sigName,
  () => {
    getSigInfo()
  }
);

const currentSigIndex = computed(() => {
  return binarySearch(allSigs.value, sigName.value, (current, target) => current.localeCompare(target, 'en'));
});

const onAllSigsSelectVisible = async (val: boolean) => {
  if (!val) return;
  await nextTick();
  const sigsWrap = document.querySelector('.sigs-options-wrap')!;
  const sigOption = sigsWrap.querySelector('.o-option')!;
  const height = sigOption.getBoundingClientRect().height;
  sigsWrap.scrollTop = height * currentSigIndex.value;
};

const [SigInfo, ReusableSigInfo] = createReusableTemplate();

const sigInfo = ref<any>();
const getSigInfo = () => {
  request
    .get('/api-magic/stat_new/sig/info', { params: { community: 'openubmc', sig: sigName.value } })
    .then((res) => res.data ?? {})
    .then((res) => {
      if (res.code === 1 && res.data) {
        sigInfo.value = res.data;
      }
    });
};

onMounted(() => {
  request
    .get('/api-magic/stat/sig/list?community=openubmc')
    .then((res) => res.data ?? {})
    .then((res) => {
      if (res.code === 1 && res.data) {
        allSigs.value = res.data.sort(new Intl.Collator('en').compare);
      }
    });
  getSigInfo();
});
</script>
<template>
  <SectionCard>
    <OSelect v-model="sigName" option-wrap-class="sigs-options-wrap" @options-visible-change="onAllSigsSelectVisible" style="width: 100%">
      <OInput clearable style="width: 100%; position: sticky; top: 0;" v-model="sigSearchInput">
        <template #prefix
          ><OIcon><OIconSearch /></OIcon
        ></template>
      </OInput>
      <OOption v-for="sig in filteredAllSigs" :key="sig" :value="sig" :label="sig" />
    </OSelect>
    <p style="margin-top: 14px">
      <OLink color="primary" hover-underline style="--link-gap: 10px" :href="`https://www.openubmc.cn/sig/${sigName}`" target="_blank" rel="noopener noreferrer">
        <template #icon
          ><OIcon style="font-size: 24px"><IconGitCode /></OIcon
        ></template>
        {{ t('common.toHome') }}
      </OLink>
    </p>
    <template v-if="sigInfo">
      <p style="margin-top: 14px">
        <OLink color="primary" hover-underline style="--link-gap: 10px" :href="`mailto:${sigInfo.mailing_list}`">
          <template #icon
            ><OIcon style="font-size: 24px"><IconMail /></OIcon
          ></template>
          {{ sigInfo.mailing_list }}
        </OLink>
      </p>
      <p class="sig-desc">
        {{ sigInfo.description }}
      </p>
    </template>
    <ODivider />
    <SigInfo v-slot="{ title, data, linkPrefix }">
      <div class="member-repo-info">
        <p class="title">{{ title }} ({{ data.length }})</p>
        <ul class="member-repo-info-list">
          <li class="member-repo-info-list-item" v-for="item in data" :key="item">
            <OLink color="primary" hover-underline :href="`${linkPrefix}/${item}`" target="_blank" rel="noopener noreferrer">@{{ item }}</OLink>
          </li>
        </ul>
      </div>
    </SigInfo>

    <template v-if="sigInfo">
      <ReusableSigInfo :data="sigInfo.maintainers" title="Maintainer" link-prefix="https://gitcode.com" />
      <ReusableSigInfo :data="sigInfo.repositories" :title="t('common.warehouse')" link-prefix="https://gitcode.com" />
    </template>
  </SectionCard>
</template>
<style lang="scss" scoped>
:deep(.o-icon svg) {
  width: 1em;
  height: 1em;
}

.sig-desc {
  margin-top: 16px;
  @include text1;
  color: var(--o-color-info2);
}

.member-repo-info {
  .title {
    @include text2;
  }

  &:not(:last-child) {
    margin-bottom: 16px;
  }

  .member-repo-info-list {
    margin-top: 16px;
    padding-left: 32px;

    .member-repo-info-list-item {
      &:not(:last-child) {
        margin-bottom: 12px;
      }
      &::marker {
        content: '';
      }
    }
  }
}
</style>