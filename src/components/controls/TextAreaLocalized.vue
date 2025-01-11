<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { TabItem } from '~/interfaces/navigation';

import { getDefaultDescriptionLocalized } from '~/helpers/misc';
import { getContentLanguages } from '~/helpers/env';

import TextArea from '~/components/controls/TextArea.vue';
import Tabs from '~/components/navigation/Tabs.vue';

const { locale } = useI18n();

const modelValue = defineModel<Record<string, string>>(getDefaultDescriptionLocalized());

const props = defineProps<{
    label?: string;
}>();

const selectedLanguage = ref<string>(locale.value.toString());

const tabs = computed<TabItem<string>[]>(() => getContentLanguages().map((language) => ({
    value: language,
    label: language,
})));

</script>

<template lang="pug">
div()
    Tabs(
        v-model="selectedLanguage"
        :tabs
    )

    div(
        v-for="language in getContentLanguages()"
        :key="language"
    )
        TextArea(
            v-if="selectedLanguage === language && modelValue"
            v-model="modelValue[language]"
            :label="props.label"
        )
</template>
