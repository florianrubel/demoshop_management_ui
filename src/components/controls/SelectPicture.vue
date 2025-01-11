<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { getCdnBaseUrl } from '~/helpers/env';

import PictureExplorer from '~/components/controls/PictureExplorer.vue';

const { t } = useI18n();

const model = defineModel<string>();

const props = defineProps<{
    label?: string;
}>();

const showPictureExplorer = ref<boolean>(false);

function handleFileSelected(file: string): void {
    model.value = file;
    showPictureExplorer.value = false;
}
</script>

<template lang="pug">
div(
    class="select-picture"
)
    label(v-if="props.label") {{ props.label }}
    div(class="select-picture__input")
        button(
            class="select-picture__select"
            @click="showPictureExplorer = true"
        )
            span(
                class="select-picture__picture"
                :style="`background-image: url('${getCdnBaseUrl()}/${model}')`"
            )
            span(class="select-picture__hint") {{ t('selectImageHint') }}

    PictureExplorer(
        v-if="showPictureExplorer"
        @file-selected="handleFileSelected"
        @cancel="showPictureExplorer = false"
    )

</template>
