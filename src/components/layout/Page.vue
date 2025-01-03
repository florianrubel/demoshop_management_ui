<script setup lang="ts">
const props = defineProps<{
    centerContent?: boolean;
}>();
</script>

<template lang="pug">
div(
    class="page"
    :class="{ 'page--center': props.centerContent }"
)
    div(class="page__content")
        slot
</template>
