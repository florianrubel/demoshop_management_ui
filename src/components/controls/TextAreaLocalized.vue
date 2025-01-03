<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { getDefaultDescriptionLocalized, getAvailableLanguages } from '~/helpers/misc';

import Button from '~/components/controls/Button.vue';
import TextArea from '~/components/controls/TextArea.vue';

const { locale } = useI18n();

const emit = defineEmits<{
    'update:model-value': [modelValue: string],
}>();

const props = defineProps<{
    modelValue: string | null;
    label?: string;
}>();

const selectedLanguage = ref<string>(locale.value.toString());
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
                v-for="language in getAvailableLanguages()"
                :key="language"
                type="button"
                :active="language === selectedLanguage"
                @click="selectedLanguage = language"
            ) {{ language }}

    div(
        v-for="language in getAvailableLanguages()"
        :key="language"
    )
        TextArea(
            v-show="selectedLanguage === language"
            v-model="modelValueLocalized[language]"
            :label="props.label"
            @update:model-value="handleUpdate"
        )
</template>
