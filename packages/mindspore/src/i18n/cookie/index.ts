import zh from './cookie-zh';
import en from './cookie-en';

export default (message: Record<string, any>) => {
  message.zh.cookie = zh;
  message.en.cookie = en;
};
