<script setup lang="ts">
import TextField from '~/components/controls/TextField.vue';

const props = defineProps<{
    title: string;
    showSearch?: boolean;
    searchTerm?: string;
}>();

const emit = defineEmits<{
    'update:searchTerm': [searchTerm: string | undefined],
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
            :model-value="props.searchTerm"
            @update:model-value="emit('update:searchTerm', props.searchTerm)"
        )
    div(class="control-bar__actions")
        slot(name="actions")
</template>
