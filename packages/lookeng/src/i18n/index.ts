import { createI18n } from 'vue-i18n';

import zhLanguage from './lang/zhLanguage';
import enLanguage from './lang/enLanguage';

const messages = {
  zh: {
    ...zhLanguage,
  },
  en: {
    ...enLanguage,
  },
};
const setI18nLang = () => {
  const lang = localStorage.getItem('lang');
  if (lang === null) {
    localStorage.setItem('lang', 'zh');
    return 'zh';
  } else if (lang === 'en') {
    return 'en';
  } else if (lang === 'zh') {
    return 'zh';
  }
};
const i18n = createI18n({
  locale: setI18nLang(),
  allowComposition: true,
  messages,
});
export default i18n;
