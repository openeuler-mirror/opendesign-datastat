export interface NavConfig {
  id: string;
  i18n: string;
  index: number;
  test?: boolean;
  children?: NavConfig[];
}

export const moNavList: NavConfig[] = [
  {
    id: 'overview',
    i18n: 'nav.overview',
    index: 0,
  },
  {
    id: 'detail',
    i18n: 'nav.contributors',
    index: 2,
    children: [
      {
        id: 'companyContributor',
        i18n: 'companyContributor',
        index: 2,
      },
      {
        id: 'userContributor',
        i18n: 'userContributor',
        index: 3,
      },
      {
        id: 'groupActive',
        i18n: 'groupActive',
        index: 4,
        // test: true,
      },
      // {
      //   id: 'companyRelations',
      //   i18n: 'companyRelations',
      //   index: 5,
      //   test: true,
      // },
      {
        id: 'groupRelations',
        i18n: 'groupRelations',
        index: 5,
        // test: true,
      },
    ],
  },
];
export const companyNavList: NavConfig[] = [
  {
    id: 'Currentcontributionranking',
    i18n: 'Currentcontributionranking',
    index: 0,
  },
  {
    id: 'ecological',
    i18n: 'ecological',
    index: 1,
  },
  {
    id: 'SIGContribution',
    i18n: 'SIGContribution',
    index: 2,
  },
  {
    id: 'staffContributor',
    i18n: 'staffContributor',
    index: 3,
  },
];
export const sigNavList: NavConfig[] = [
  {
    id: '简介',
    i18n: '简介',
    index: 0,
  },
  // {
  //   id: 'currentVitalityIndex',
  //   i18n: 'currentVitalityIndex',
  //   index: 1,
  // },
  // {
  //   id: 'historicalVitalityIndicators',
  //   i18n: 'historicalVitalityIndicators',
  //   index: 2,
  // },
  // {
  //   id: 'companyContributor',
  //   i18n: 'companyContributor',
  //   index: 3,
  // },
  {
    id: 'userContributor',
    i18n: 'userContributor',
    index: 1,
  },
];
export const personNavList: NavConfig[] = [
  {
    id: 'individual',
    i18n: 'individual',
    index: 0,
  },
  {
    id: 'SIGContribution',
    i18n: 'SIGContribution',
    index: 1,
  },
  {
    id: 'DynamicContribute',
    i18n: 'DynamicContribute',
    index: 2,
  },
];
