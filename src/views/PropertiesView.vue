<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { TabItem } from '~/interfaces/navigation';

import Tabs from '~/components/navigation/Tabs.vue';
import Page from '~/components/layout/Page.vue';
import Panel from '~/components/layout/Panel.vue';
import BooleanProperties from '~/components/products/properties/booleanProperty/BooleanProperties.vue';
import NumericProperties from '~/components/products/properties/numericProperty/NumericProperties.vue';
import StringProperties from '~/components/products/properties/stringProperty/StringProperties.vue';

const { t } = useI18n();

type View = 'boolean' | 'numeric' | 'string';

const currentView = ref<View>('boolean');

const tabs = computed<TabItem<View>[]>(() => [
    { value: 'boolean', label: t('booleanProperties')},
    { value: 'numeric', label: t('numericProperties')},
    { value: 'string', label: t('stringProperties')},
]);

</script>

<template lang="pug">
Page
    Panel
        Tabs(
            v-model="currentView"
            :tabs
        )
        div(v-if="currentView === 'boolean'")
            BooleanProperties
        div(v-if="currentView === 'numeric'")
            NumericProperties
        div(v-if="currentView === 'string'")
            StringProperties
</template>
