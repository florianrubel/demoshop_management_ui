<script lang="ts" setup>
import axios from 'axios';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { getCdnBaseUrl } from '~/helpers/env';

import FilesService from '~/sharedLib/api/src/services/cdn/filesService';

import { useAuthenticationStore } from '~/store/authentication';
import { useNotificationStore } from '~/store/notifications';

import Dialog from '~/components/dialogs/Dialog.vue';
import LoadingWrapper from '~/components/layout/LoadingWrapper.vue';
import { CheckIcon } from '~/helpers/icons';

const { t } = useI18n();

const emit = defineEmits<{
    'file-selected': [fileName: string],
    'files-selected': [fileNames: string[]],
    'cancel': [],
}>();

const props = defineProps<{
    multiple?: boolean;
    preSelectedFiles?: string[];
}>();

const authentictionStore = useAuthenticationStore();
const notificationStore = useNotificationStore();

const files = ref<string[]>([]);
const isLoading = ref<boolean>(false);
const selectedFiles = ref<string[]>([]);

const filesService = new FilesService(
    () => authentictionStore.setUser(),
    () => authentictionStore.deleteUser(),
);

function created(): void {
    selectedFiles.value = props.preSelectedFiles || [];
    getFiles();
}

async function getFiles(): Promise<void> {
    isLoading.value = true;

    try {
        const res = await filesService.listFiles();
        files.value = res.data;
    } catch (error) {
        if (!axios.isCancel(error)) {
            notificationStore.addNotification({
                text: t('dataNotLoaded'),
                type: 'error',
            });
        }
    }

    isLoading.value = false;
}

function selectFile(file: string): void {
    if (!props.multiple) {
        emit('file-selected', file);
        return;
    }
    if (selectedFiles.value.includes(file)) {
        selectedFiles.value = selectedFiles.value.filter((fFile) => fFile !== file);
    } else {
        selectedFiles.value.push(file);
    }
}

created();

</script>

<template lang="pug">
Dialog(
    :title="t('fileExplorer')"
    :full-size="true"
    :save-and-cancel="props.multiple"
    @close="emit('cancel')"
    @save="emit('files-selected', selectedFiles)"
)
    LoadingWrapper(
        :is-loading

    )
        div(class="picture-explorer")
            button(
                v-for="file in files"
                :key="file"
                type="button"
                class="picture-explorer__picture-wrapper"
                :class="{ 'picture-explorer__picture-wrapper--selected': selectedFiles.includes(file) }"
                @click="selectFile(file)"
            )
                span(
                    class="picture-explorer__picture"
                    :class="{ 'picture-explorer__picture--selected': selectedFiles.includes(file) }"
                    :style="`background-image: url('${getCdnBaseUrl()}/${file}')`"
                )
                    span(
                        class="picture-explorer__checked"
                    )
                        CheckIcon

</template>
