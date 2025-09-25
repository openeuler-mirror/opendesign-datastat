import { createI18n } from 'vue-i18n';
import zhLanguage from './lang/zhLanguage';
import enLanguage from './lang/enLanguage';
import header from './header'
import footer from './footer'

export default createI18n({
  legacy: false,
  locale: 'zh',
  messages: {
    zh: {
      common: zhLanguage,
      header: header.zh,
      footer: footer.zh
    },
    en: {
      common: enLanguage,
    },
  },
});
