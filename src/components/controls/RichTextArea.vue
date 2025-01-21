<script lang="ts" setup>
import {
    withDefaults, ref,
    computed, // onMounted,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { Ckeditor, useCKEditorCloud } from '@ckeditor/ckeditor5-vue';

import type { EditorConfig, EventInfo } from 'ckeditor5';
import { DEFAULT_INPUT_MAX_LENGTH } from '~/constants/app';

import { getUniqueId } from '~api/helpers/misc';

const { locale } = useI18n();

const emits = defineEmits(['focus', 'blur', 'enter']);

const cloud = useCKEditorCloud({
    version: '44.1.0',
    premium: false,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editor = computed<any>(() => {
    if (!cloud.data.value) {
        return null;
    }
    return cloud.data.value.CKEditor.ClassicEditor;
});
const config = computed<EditorConfig | undefined>(() => {
    if (!cloud.data.value) {
        return undefined;
    }

    const {
        Bold, Essentials, Italic, Mention, Paragraph, Undo, Link, List, Heading, SourceEditing,
    } = cloud.data.value.CKEditor;

    return {
        plugins: [Bold, Essentials, Italic, Mention, Paragraph, Undo, Link, List, Heading, SourceEditing],
        toolbar: ['undo', 'redo', '|', 'heading', '|', 'bold', 'italic', '|', 'numberedList', 'bulletedList', '|', 'link', '|', 'sourceEditing'],
        language: {
            ui: locale.value.substring(0, 2),
        },
    };
});

interface Props {
    maxLength?: number;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    success?: boolean;
    errors?: string[];
}
const props = withDefaults(defineProps<Props>(), {
    maxLength: DEFAULT_INPUT_MAX_LENGTH,
    label: undefined,
    placeholder: undefined,
    disabled: false,
    readonly: false,
    required: false,
    success: false,
    errors: () => [],
});

const model = defineModel<string | null>();

const id = ref<string>(getUniqueId());
const isFocused = ref<boolean>(false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function emitFocus(event: EventInfo<string, unknown>, _editor: unknown): any {
    isFocused.value = true;
    emits('focus', event);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function emitBlur(event: EventInfo<string, unknown>, _editor: unknown): any {
    isFocused.value = false;
    emits('blur', event);
}
</script>

<template lang="pug">
div(class="richtextarea")
    Ckeditor(
        :id
        :editor
        :config
        :maxlength="props.maxLength"
        :placeholder="props.placeholder"
        :model-value="`${model}` || ''"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :label="props.label"
        @input="model = $event"
        @focus="emitFocus"
        @blur="emitBlur"
    )
    div(
        v-for="error in errors"
        :key="error"
        class="text-area__error"
    ) {{ error }}
</template>
