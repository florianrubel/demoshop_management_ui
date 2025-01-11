<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { getDefaultDescriptionLocalized } from '~/helpers/misc';
import { getContentLanguages } from '~/helpers/env';

import Button from '~/components/controls/Button.vue';
import RichTextArea from '~/components/controls/RichTextArea.vue';

const { locale } = useI18n();

const emit = defineEmits<{
    'update:model-value': [modelValue: string],
}>();

const props = defineProps<{
    modelValue: string | null | undefined;
    label?: string;
}>();

const selectedLanguage = ref<string>(locale.value);
const modelValueLocalized = ref<Record<string, string>>(getDefaultDescriptionLocalized());

function handleUpdate(newValue: string) {
    const newValueString = JSON.stringify({
        ...modelValueLocalized.value,
        [selectedLanguage.value]: newValue,
    });
    if (newValueString !== props.modelValue) {
        emit('update:model-value', newValueString);
    }
}

watch(() => props.modelValue, () => {
    const newValue = props.modelValue ? JSON.parse(props.modelValue) : getDefaultDescriptionLocalized();
    if (props.modelValue !== JSON.stringify(modelValueLocalized.value)) {
        modelValueLocalized.value = newValue;
    }
});

</script>

<template lang="pug">
div()
    div(class="flex")
        Button(
                v-for="language in getContentLanguages()"
                :key="language"
                type="button"
                :active="language === selectedLanguage"
                @click="selectedLanguage = language"
            ) {{ language }}

    div(
        v-for="language in getContentLanguages()"
        :key="language"
    )
        RichTextArea(
            v-show="selectedLanguage === language"
            v-model="modelValueLocalized[language]"
            :label="props.label"
            @update:model-value="handleUpdate"
        )
</template>
