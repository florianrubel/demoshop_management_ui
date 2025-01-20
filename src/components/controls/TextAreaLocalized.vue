<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { getDefaultDescriptionLocalized } from '~/helpers/misc';
import { getContentLanguages } from '~/helpers/env';

import TextArea from '~/components/controls/TextArea.vue';
import Select from '~/components/controls/Select.vue';
import type { SelectOption } from '~/interfaces/ui';

const { locale } = useI18n();

const contentLanguages = getContentLanguages();

const model = defineModel<Record<string, string | null | undefined>>({ default: getDefaultDescriptionLocalized() });

const props = defineProps<{
    label?: string;
}>();

const selectedLanguage = ref<string>(locale.value.toString());
// const currentModel = ref<string | null | undefined>(null);

const tabs = computed<SelectOption<string>[]>(() => contentLanguages.map((language) => ({
    value: language,
    label: language,
})));

// function handleUpdate(value: string | null | undefined): void {
//     // eslint-disable-next-line no-console
//     console.log(value);
//     model.value = {
//         ...model.value,
//         [selectedLanguage.value]: value,
//     };
// }

// watch(model, () => {
//     currentModel.value = model.value[selectedLanguage.value];
// });

</script>

<template lang="pug">
div()
    Select(
        v-model="selectedLanguage"
        :options="tabs"
    )

    div(
        v-for="language in getContentLanguages()"
        :key="language"
    )
        TextArea(
            v-show="selectedLanguage === language && model"
            v-model="model[selectedLanguage]"
            :label="props.label"
        )
</template>
