import zh from './cookie-zh';
import en from './cookie-en';

export default (messages: { zh: any; en: any }) => {
  messages.zh.cookie = zh;
  messages.en.cookie = en;
};
