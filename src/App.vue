<script lang="ts" setup>
import {
    computed,
} from 'vue';
import { useI18n } from 'vue-i18n';

import type { NavItemDefinition } from '~/interfaces/navigation';

import { getLanguageFromLocale } from '~/i18n';

import { useAuthenticationStore } from '~/store/authentication';

import MainNav from '~/components/navigation/MainNav.vue';
import SignIn from '~/components/authentication/SignIn.vue';
import Notifications from '~/components/notifications/Notifications.vue';

import { AdjustmentsHorizontalIcon, HomeIcon } from '~/helpers/icons';

const authenticationStore = useAuthenticationStore();
const { t } = useI18n();

const navItems = computed<NavItemDefinition[]>(() => ([
    {
        label: t('dashboard'),
        to: { name: 'home' },
        icon: HomeIcon,
    },
    {
        label: t('properties'),
        to: { name: 'properties' },
        icon: AdjustmentsHorizontalIcon,
    },
]));
const pageClasses = computed<string[]>(() => {
    const classes = [];
    if (!authenticationStore.user) classes.push('page--center');
    return classes;
});

authenticationStore.setUser();
const raw = navigator.language;
const language = getLanguageFromLocale(raw);
useI18n().locale.value = language;
</script>

<template lang="pug">
div(
    class="page"
    :class="pageClasses"
)
    template(v-if="authenticationStore.user")
        MainNav(
            :nav-items
        )
        main
            router-view
    SignIn(v-else)
div(id="dialogs")
div(id="loading-indicator-beam-wrapper")
Notifications
</template>
