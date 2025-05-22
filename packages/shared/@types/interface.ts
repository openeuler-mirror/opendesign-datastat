export interface IObject<T = any> {
  [key: string]: T;
}

export interface formType {
  contributeType: string;
  timeRange: string;
  company_cn: string;
  company_en: string;
}

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  zh?: string;
  en?: string;
}

export interface companyTypes {
  company_cn: string;
  company_en: string;
  contribute: number;
  index?: number | string;
}
