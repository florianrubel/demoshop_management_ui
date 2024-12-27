<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { ViewBooleanProperty } from '~/sharedLib/api/src/interfaces/pim/properties/booleanProperty';

import BooleanPropertyService from '~/sharedLib/api/src/services/pim/properties/booleanPropertyService';

import { useAuthenticationStore } from '~/store/authentication';
import { useNotificationStore } from '~/store/notifications';

import CreatePatchBooleanProperty from '~/components/products/properties/booleanProperty/CreatePatchBooleanProperty.vue';
import ControlBar from '~/components/layout/ControlBar.vue';
import Button from '~/components/controls/Button.vue';
import { PlusIcon } from '~/helpers/icons';

const { t } = useI18n();

const authenticationStore = useAuthenticationStore();
const notificationStore = useNotificationStore();

const booleanPropertyService = new BooleanPropertyService(
    authenticationStore.setUser,
    authenticationStore.deleteUser,
);

const booleanProperties = ref<ViewBooleanProperty[]>([]);
const isLoading = ref<boolean>(false);
const showCreate = ref<boolean>(false);
const showEditFor = ref<string | null>(null);

async function load(): Promise<void> {
    isLoading.value = true;
    try {
        const res = await booleanPropertyService.getMultiple();
        booleanProperties.value = res.data;
    } catch {
        notificationStore.addNotification({
            text: t('dataNotLoaded'),
            type: 'error',
        });
    }
    isLoading.value = false;
}

load();
</script>

<template lang="pug">
div
    ControlBar(
        :title="t('booleanProperties')"
        :show-search="true"
    )
        template(#actions)
            Button
                template(#iconLeft)
                    PlusIcon(class="icon")
                template(#default) {{ t('create') }}

    CreatePatchBooleanProperty(
        v-if="showCreate || showEditFor"
        :edit-id="showEditFor"
    )
</template>
