<script setup lang="ts">
const props = defineProps<{
    vertical?: boolean;
}>();
</script>

<template lang="pug">
    div(class="brand-logo" :class="{ 'brand-logo--vertical': props.vertical }")
        img(class="brand-logo__icon" src="/favicon.svg" alt="CinemaNexus Logo")
        img(class="brand-logo__name" src="/cinema-nexus.svg" alt="CinemaNexus Name")
</template>
