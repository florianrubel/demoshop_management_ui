import { createApp } from 'vue';
import { createPinia } from 'pinia';

import i18n from '~/i18n';

import App from '~/App.vue';
import router from '~/router';

import vSanitizeHtml from '~/directives/sanitizeHtml';

import '~/scss/index.scss';

const app = createApp(App);

app
    .use(createPinia())
    .use(router)
    .use(i18n)
    .directive('sanitize-html', vSanitizeHtml as never);

app.mount('#app');
