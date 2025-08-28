import { createI18n } from 'vue-i18n';

import zhLanguage from './lang/zhLanguage';
import enLanguage from './lang/enLanguage';
import cookie from './cookie';
import feedback from './feedback';

const messages = {
  zh: {
    ...zhLanguage,
    feedback: feedback.zh
  },
  en: {
    ...enLanguage,
    feedback: feedback.en
  },
};

cookie(messages);
const i18n = createI18n({
  locale: localStorage.getItem('lang') || 'zh',
  allowComposition: true,
  messages,
});
export default i18n;
