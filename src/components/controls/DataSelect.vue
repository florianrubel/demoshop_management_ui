<script lang="ts" setup>
import {
    computed, ref, watch,
} from 'vue';

import type { UuidViewModel } from '~api/interfaces/api';
import type { SelectOption } from '~/interfaces/ui';

import Select from '~/components/controls/Select.vue';

const emits = defineEmits(['update:model-value', 'update:value']);

const props = defineProps<{
    modelValue: string | null | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service: any;
    labelProperty: string;
    required?: boolean;
    searchable?: boolean;
    orderBy?: string;
    placeholderOption?: SelectOption<string | null>;
}>();

const isLoading = ref<boolean>(false);
const records = ref<UuidViewModel[]>([]);
const modelValueRecord = ref<UuidViewModel | null>(null);
const errors = ref<string[]>([]);

const options = computed<SelectOption<string>[]>(() => records.value.map((record) => ({
    value: record.id,
    label: record[props.labelProperty as keyof UuidViewModel] as string,
})));

function emitInput(value: string | null | undefined): void {
    emits('update:model-value', value);
    emits('update:value', value ? records.value.find(({ id }) => id === value) : null);
}

async function loadOptions(): Promise<void> {
    isLoading.value = true;
    errors.value = [];
    try {
        const res = await props.service.getMultiple({ pageSize: -1, orderBy: props.orderBy });
        records.value = res.data;
    } catch {
        errors.value = ['loading failed'];
    }
    isLoading.value = false;
}

async function loadValue(): Promise<void> {
    modelValueRecord.value = null;
    if (!props.modelValue) return;
    isLoading.value = true;
    errors.value = [];
    try {
        const res = await props.service.getOneOrDefault(props.modelValue);
        modelValueRecord.value = res.data;
    } catch {
        errors.value = ['loading failed'];
    }
    isLoading.value = false;
}

watch(() => props.modelValue, () => {
    loadOptions();
    loadValue();
});

loadOptions();
loadValue();
</script>

<template lang="pug">
Select(
    :model-value="props.modelValue"
    :options
    :errors
    :required="props.required"
    :searchable="props.searchable"
    :placeholder-option="props.placeholderOption"
    @update:model-value="emitInput"
)
</template>
