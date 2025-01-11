import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueClickAway from 'vue3-click-away';

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
    .use(VueClickAway)
    .directive('sanitize-html', vSanitizeHtml as never);

app.mount('#app');
