<script setup lang="ts">
import Page from '~/components/layout/Page.vue';
import PropertyValueCacheService from '~/sharedLib/api/src/services/propertyValueCache/propertyValueCacheService';
import { useAuthenticationStore } from '~/store/authentication';
import { PropertyValueCacheHub } from '~/sharedLib/api/src/signalR/propertyValueCacheHub';
import { onUnmounted } from 'vue';

const authenticationStore = useAuthenticationStore();

const propertyValueCacheService = new PropertyValueCacheService(
    () => authenticationStore.setUser(),
    () => authenticationStore.deleteUser(),
);

const propertyValueCacheHub = new PropertyValueCacheHub();

async function buildCache(): Promise<void> {
    try {
        await propertyValueCacheService.buildCache();
    } catch (error) {
        console.log(error);
    }
}

async function created() {
    await propertyValueCacheHub.startConnection();
}

onUnmounted(async () => {
    await propertyValueCacheHub.stopConnection();
});

created();
</script>

<template lang="pug">
Page
    button(
        type="button"
        @click="buildCache()"
    ) buildCache
</template>
