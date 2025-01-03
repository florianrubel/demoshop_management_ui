<script lang="ts" setup>
import {
    computed,
} from 'vue';
import { useI18n } from 'vue-i18n';

import { formatDateTime } from '~/helpers/misc';

const { locale } = useI18n();
const props = defineProps<{
    isoString?: string | null;
}>();

const formatted = computed<string>(() => `${formatDateTime(props.isoString, locale.value)}`);
</script>

<template lang="pug">
span {{ formatted }}
</template>
