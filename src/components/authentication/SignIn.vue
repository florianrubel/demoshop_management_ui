<script lang="ts" setup>
import {
    computed, ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

import { AtSymbolIcon, KeyIcon, EyeIcon, EyeSlashIcon } from '~/helpers/icons';
import { saveTokens } from '~api/helpers/authentication';

import { useAuthenticationStore } from '~/store/authentication';

import SignInService from '~api/services/authentication/signInService';

import Notification from '~/components/notifications/Notification.vue';
import Button from '~/components/controls/Button.vue';
import TextField from '~/components/controls/TextField.vue';
import BrandLogo from '~/components/navigation/BrandLogo.vue';

const { t } = useI18n();
const authenticationStore = useAuthenticationStore();
const signInService = new SignInService();

interface FormProperties {
    email: string;
    password: string;
}

const getDefaultFormProperties = (): FormProperties => ({
    email: import.meta.env.VITE_SUPERADMIN_USER,
    password: import.meta.env.VITE_SUPERADMIN_PASS,
});

const form = ref<FormProperties>(getDefaultFormProperties());
const showPassword = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const signInFailed = ref<boolean>(false);

const canSignIn = computed<boolean>(() => {
    const emailValid = form.value.email.length > 0;
    const passwordValid = form.value.password.length > 0;
    return emailValid && passwordValid;
});

async function signIn(): Promise<void> {
    if (!canSignIn.value) return;
    signInFailed.value = false;
    isLoading.value = true;
    try {
        const res = await signInService.signIn({
            userName: form.value.email,
            password: form.value.password,
        });
        saveTokens(res.data);
        authenticationStore.setUser();
    } catch {
        signInFailed.value = true;
    }
    isLoading.value = false;
}
</script>

<template lang="pug">
div(class="flex flex--full-size-center-screen")
    div(class="panel")
        div(class="flex flex--center")
            BrandLogo(:vertical="true")
        div(
            class="flex__item flex flex--center"
            style="width: clamp(300px, 50vw, 600px);"
        )
            div(class="flex flex--justify-center flex--column flex--gap margin-top")
                h2(class="text--center") Management UI

                Notification(:on-surface="true") {{ t('siginInExplanation') }}

                TextField(
                    v-model="form.email"
                    type="email"
                    :label="t('email')"
                    :readonly="isLoading"
                )
                    template(#iconLeft)
                        AtSymbolIcon(class="icon")

                TextField(
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    :label="t('password')"
                    :readonly="isLoading"
                    @keyup.enter="signIn"
                )
                    template(#iconLeft)
                        KeyIcon(class="icon")
                    template(#iconRight)
                        EyeIcon(
                            v-if="showPassword"
                            class="icon"
                            :title="t('hidePassword')"
                            @click="showPassword = false"
                        )
                        EyeSlashIcon(
                            v-else
                            class="icon"
                            :title="t('showPassword')"
                            @click="showPassword = true"
                        )

                div(class="margin-top")
                    Button(
                        :loading="isLoading"
                        :disabled="!canSignIn"
                        :full-width="true"
                        @click="signIn"
                    ) {{ t('signIn') }}

                Notification(
                    v-if="signInFailed"
                    class="margin-top"
                    type="error"
                ) {{ t('signInFailed') }}
</template>
