<script lang="ts" setup>
import {
    computed, withDefaults,
} from 'vue';
import { numberToLocaleString } from '~/helpers/misc';

const props = withDefaults(defineProps<{
    price: number;
}>(), {
    price: 0,
});

const formatted = computed<string>(() => `${numberToLocaleString(undefined, props.price / 100, 2, 2)} €`);
</script>

<template lang="pug">
span {{ formatted }}
</template>
