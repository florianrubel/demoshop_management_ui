<script setup lang="ts">
import { computed, useSlots } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

import ButtonContent from '~/components/controls/ButtonContent.vue';

const slots = useSlots();

interface Props {
    type?: string;
    outline?: boolean;
    blank?: boolean;
    disabled?: boolean;
    loading?: boolean;
    to?: RouteLocationRaw;
    href?: string;
    block?: boolean;
    active?: boolean;
    fullWidth?: boolean;
    noWrap?: boolean;
    square?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    type: undefined,
    outline: false,
    blank: false,
    disabled: false,
    loading: false,
    to: undefined,
    href: undefined,
    active: undefined,
    square: false,
});

const classes = computed<string[]>(() => {
    const tmp = ['button'];
    if (props.outline) tmp.push('button--outline');
    if (props.blank) tmp.push('button--blank');
    if (props.type === 'primary') tmp.push('button--primary');
    if (props.type === 'secondary') tmp.push('button--secondary');
    if (props.type === 'success') tmp.push('button--success');
    if (props.type === 'warning') tmp.push('button--warning');
    if (props.type === 'error') tmp.push('button--error');
    if (props.type === 'info') tmp.push('button--info');
    if (props.loading) tmp.push('button--loading');
    if (props.disabled) tmp.push('button--disabled');
    if (props.block) tmp.push('button--block');
    if (props.active) tmp.push('button--active');
    if (props.fullWidth) tmp.push('button--full-width');
    if (props.noWrap) tmp.push('button--no-wrap');
    if (props.square) tmp.push('button--square');
    return tmp;
});

</script>
<template lang="pug">
a(
    v-if="(!props.loading && !props.disabled) && props.href"
    :class="classes"
    :href="props.href"
    target="_blank"
    rel="noopener noreferrer"
)
    ButtonContent(:loading="props.loading")
        template(
            v-if="slots.iconLeft"
            #iconLeft
        )
            slot(name="iconLeft")
        template(#default)
            slot
        template(
            v-if="slots.iconRight"
            #iconRight
        )
            slot(name="iconRight")

router-link(
    v-else-if="(!props.loading && !props.disabled) && props.to"
    :class="classes"
    :to="props.to"
)
    ButtonContent(:loading="props.loading")
        template(
            v-if="slots.iconLeft"
            #iconLeft
        )
            slot(name="iconLeft")
        template(#default)
            slot
        template(
            v-if="slots.iconRight"
            #iconRight
        )
            slot(name="iconRight")

button(
    v-else
    :class="classes"
    :disabled="props.disabled || props.loading"
    type="button"
)
    ButtonContent(:loading="props.loading")
        template(
            v-if="slots.iconLeft"
            #iconLeft
        )
            slot(name="iconLeft")
        template(#default)
            slot
        template(
            v-if="slots.iconRight"
            #iconRight
        )
            slot(name="iconRight")
</template>
