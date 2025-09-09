import i18n from '@/i18n';
import { computed, ref } from 'vue';

const contributionTypeLabelMap = {
  pr: 'PR',
  issue: 'Issue',
  comment: 'Comment',
} as Record<string, string>;

export default function useCommonFilters(_i18n = i18n.global) {
  const contributionTypeOptions = computed(() => [
    { label: _i18n.t('common.home.prs'), value: 'pr' },
    { label: _i18n.t('common.home.issues'), value: 'issue' },
    { label: _i18n.t('common.home.comments'), value: 'comment' },
  ]);
  const contributionType = ref(contributionTypeOptions.value[0].value);
  const contributionTypeLabel = computed(() => contributionTypeLabelMap[contributionType.value]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const initialTimeRange = [new Date(2024, 10, 1), today];
  const timeRange = ref<Date[]>(initialTimeRange);
  const disabledTimeRange = (date: Date) => {
    return date < initialTimeRange[0] || date > initialTimeRange[1];
  };

  const commentTypeOptions = computed(() => [
    { label: _i18n.t('common.from.all'), value: '' },
    { label: _i18n.t('common.General'), value: 'normal' },
    { label: _i18n.t('common.Order'), value: 'command' },
  ]);
  const commentType = ref('');

  return {
    contributionTypeOptions,
    contributionType,
    contributionTypeLabel,
    timeRange,
    disabledTimeRange,
    commentTypeOptions,
    commentType,
  };
}
