<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { CheckIcon, XMarkIcon } from '~/helpers/icons';

import Button from '~/components/controls/Button.vue';

const { t } = useI18n();

const props = defineProps<{
    embedded?: boolean;
    closable?: boolean;
    title?: string;
    saveAndCancel?: boolean;
    disableSaving?: boolean;
    disableCancel?: boolean;
    hasChanges?: boolean;
    isLoading?: boolean;
    scrollOverflow?: boolean;
    fullHeight?: boolean;
    fixFullHeight?: boolean;
}>();

const emit = defineEmits(['close', 'save']);

const classes = computed<string[]>(() => {
    const tmp: string[] = [];
    if (props.embedded) tmp.push('panel--embedded');
    if (props.scrollOverflow) tmp.push('panel--scroll-overflow');
    if (props.fullHeight) tmp.push('panel--full-height');
    if (props.fixFullHeight) tmp.push('panel--fix-full-height');
    return tmp;
});
</script>

<template lang="pug">
div(
    class="panel"
    :class="classes"
)
    div(
        v-if="props.title"
        class="panel__header"
    )
        h2 {{ props.title }}
        Button(
            :blank="true"
            :on-background="true"
            @click="emit('close')"
        )
            XMarkIcon
    div(class="panel__content")
        slot
    div(
        v-if="props.saveAndCancel"
        class="panel__actions"
    )
        hr
        Button(
            :disabled="props.disableCancel"
            :type="props.hasChanges === false ? 'primary' : 'error'"
            @click="emit('close')"
        ) {{ props.hasChanges === false ? t('close') : t('cancel') }}
            template(#iconLeft)
                XMarkIcon(class="icon")
        Button(
            :disabled="props.isLoading || props.disableSaving"
            :loading="props.isLoading"
            @click="emit('save')"
        ) {{ props.hasChanges === false ? t('noChanges') : t('save') }}
            template(#iconLeft)
                CheckIcon(class="icon")
</template>
