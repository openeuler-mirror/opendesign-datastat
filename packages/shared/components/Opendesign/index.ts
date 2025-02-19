import type { App } from 'vue';

// import './style/variable.scss';

import { Button } from './button';

const components = [Button];
export default {
  install(app: App): void {
    components.forEach((component) => {
      app.use(component as any);
    });
  },
};
