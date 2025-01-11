<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import PictureExplorer from '~/components/controls/PictureExplorer.vue';
import { getCdnBaseUrl } from '~/helpers/env';

const { t } = useI18n();

const model = defineModel<string[]>();

const props = defineProps<{
    label?: string;
}>();

const showPictureExplorer = ref<boolean>(false);

function handleFilesSelected(files: string[]): void {
    model.value = files;
    showPictureExplorer.value = false;
}

function deselectPicture(file: string): void {
    model.value = model.value?.filter((fFile) => fFile !== file);
}
</script>

<template lang="pug">
div(
    class="select-picture"
)
    label(v-if="props.label") {{ props.label }}
    div(class="select-picture__input")
        div(
            v-for="picture in model"
            :key="picture"
            class="select-picture__select"
            @click="deselectPicture(picture)"
        )
            span(
                class="select-picture__picture"
                :style="`background-image: url('${getCdnBaseUrl()}/${picture}')`"
            )
            span(class="select-picture__hint") {{ t('deselectImageHint') }}

        button(
            class="select-picture__select"
            @click="showPictureExplorer = true"
        )
            span(
                class="select-picture__picture"
            )
            span(class="select-picture__hint") {{ t('selectImageHint') }}

    PictureExplorer(
        v-if="showPictureExplorer"
        :pre-selected-files="model"
        :multiple="true"
        @files-selected="handleFilesSelected"
        @cancel="showPictureExplorer = false"
    )

</template>
