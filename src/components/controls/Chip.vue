<script setup lang="ts">
import { computed } from 'vue';
import { PlusIcon, XMarkIcon } from '~/helpers/icons';

const emit = defineEmits(['clicked']);

const props = defineProps<{
    text: string;
    addable?: boolean;
    removable?: boolean;
    image?: string | null;
}>();

const classes = computed<string[]>(() => {
    const tmp: string[] = [];
    if (props.removable) tmp.push('chip--removable');
    if (props.addable) tmp.push('chip-addable');
    return tmp;
});

function handleClick() {
    if (props.removable) emit('clicked');
    if (props.addable) emit('clicked');
}
</script>

<template lang="pug">
button(
    class="chip"
    :class="classes"
    type="button"
    @click="handleClick"
)
    div(
        v-if="props.image"
        class="chip__image"
        :style="`background-image: url('${props.image}')`"
        :alt="text"
    )
    span {{ props.text }}
    PlusIcon(
        v-if="props.addable"
        class="icon"
    )
    XMarkIcon(
        v-if="props.removable"
        class="icon"
    )
</template>
