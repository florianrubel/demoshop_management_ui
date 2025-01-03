<script lang="ts" setup>
import {
    computed,
} from 'vue';
import { useI18n } from 'vue-i18n';

import type { NavItemDefinition } from '~/interfaces/navigation';

import { AdjustmentsHorizontalIcon, HomeIcon } from '~/helpers/icons';

import { getLanguageFromLocale } from '~/i18n';

import { useAuthenticationStore } from '~/store/authentication';

import MainNav from '~/components/navigation/MainNav.vue';
import SignIn from '~/components/authentication/SignIn.vue';
import Notifications from '~/components/notifications/Notifications.vue';
import Page from '~/components/layout/Page.vue';

const authenticationStore = useAuthenticationStore();
const { t, availableLocales } = useI18n();

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

authenticationStore.setUser();
const raw = navigator.language;
const language = getLanguageFromLocale(raw);
const foundLocale = availableLocales.find((availableLocale) => availableLocale.toLocaleLowerCase().startsWith(language));
if (foundLocale) useI18n().locale.value = foundLocale;
</script>

<template lang="pug">
template(v-if="authenticationStore.user")
    MainNav(
        :nav-items
    )
    router-view
Page(
    v-else
    :center-content="true"
)
    SignIn
div(id="dialogs")
div(id="loading-indicator-beam-wrapper")
Notifications
</template>
