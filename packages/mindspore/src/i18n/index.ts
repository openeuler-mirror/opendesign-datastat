import { createI18n } from 'vue-i18n';

import zhLanguage from './lang/zhLanguage';
import enLanguage from './lang/enLanguage';
import cookie from './cookie';
const messages = {
  zh: {
    ...zhLanguage,
  },
  en: {
    ...enLanguage,
  },
};
cookie(messages);
const i18n = createI18n({
  locale: localStorage.getItem('lang') || 'zh',
  allowComposition: true,
  messages,
});
export default i18n;
