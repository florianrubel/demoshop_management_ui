<script lang="ts" setup>
import {
    withDefaults,
} from 'vue';
import { useI18n } from 'vue-i18n';

import type { NavItemDefinition } from '~/interfaces/navigation';

import { PowerIcon } from '~/helpers/icons';

import { useAuthenticationStore } from '~/store/authentication';

import BrandLogo from '~/components/navigation/BrandLogo.vue';


const { t } = useI18n();

const authenticationStore = useAuthenticationStore();

interface Props {
    navItems: NavItemDefinition[];
}
withDefaults(defineProps<Props>(), {
    navItems: () => [],
});
</script>

<template lang="pug">
nav(class="main-nav")
    router-link(
        class="main-nav__logo"
        :to="{ name: 'home' }"
    )
        BrandLogo(:light="true")

    div(class="main-nav__items")
        router-link(
            v-for="navItem in navItems"
            :key="navItem.label"
            :to="navItem.to"
            class="main-nav__item"
        )
            div(
                v-if="navItem.icon"
                class="main-nav__item-icon"
            )
                component(
                    :is="navItem.icon"
                    class="icon"
                )
            div(class="main-nav__item-label") {{ navItem.label }}

        button(
            class="main-nav__item"
            type="button"
            @click="authenticationStore.deleteUser()"
        )
            div(class="main-nav__item-icon")
                PowerIcon(class="icon")
            div(class="main-nav__item-label") {{ t('signout') }}
</template>
