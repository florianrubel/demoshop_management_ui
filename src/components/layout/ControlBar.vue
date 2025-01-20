<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import TextField from '~/components/controls/TextField.vue';

const { t } = useI18n();

const props = defineProps<{
    title: string;
    showSearch?: boolean;
    searchQuery?: string | number | null;
}>();

const emit = defineEmits<{
    'update:search-query': [searchTerm: string | number | null | undefined],
}>();
</script>

<template lang="pug">
div(class="control-bar")
    div(class="control-bar__title") {{ props.title }}
    div(
        v-if="showSearch"
        class="control-bar__search"
    )
        TextField(
            :model-value="props.searchQuery"
            :placeholder="t('search')"
            @update:model-value="emit('update:search-query', $event)"
        )
    div(class="control-bar__actions")
        slot(name="actions")
</template>
