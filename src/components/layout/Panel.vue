<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { CheckIcon, XMarkIcon } from '~/helpers/icons';

import Button from '~/components/controls/Button.vue';

const { t } = useI18n();

interface Props {
    embedded?: boolean;
    closable?: boolean;
    title?: string;
    saveAndCancel?: boolean;
    disableSaving?: boolean;
    isLoading?: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits(['close', 'save']);

const classes = computed<string[]>(() => {
    if (props.embedded) return ['panel--embedded'];
    return [];
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
    slot
    div(
        v-if="props.saveAndCancel"
        class="margin-top--x2 flex flex--justify-between"
    )
        Button(
            :disabled="props.disableSaving"
            type="error"
            @click="emit('close')"
        ) {{ t('cancel') }}
            template(#iconLeft)
                XMarkIcon(class="icon")
        Button(
            :disabled="props.isLoading || props.disableSaving"
            :loading="props.isLoading"
            @click="emit('save')"
        ) {{ t('save') }}
            template(#iconLeft)
                CheckIcon(class="icon")
</template>
