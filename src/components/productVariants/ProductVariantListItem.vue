<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { CheckIcon, PencilIcon, XMarkIcon } from '~/helpers/icons';
import { numberToLocaleString } from '~/helpers/misc';

import PriceFormatter from '~/components/formatters/PriceFormatter.vue';
import type { HydratedProductVariant } from '~/composables/products/productVariantFactory';
import Button from '~/components/controls/Button.vue';

const { t, locale } = useI18n();

const props = defineProps<{
    productVariant: HydratedProductVariant;
}>();

</script>

<template lang="pug">
div(class="product-variant-list-item")
    div(class="product-variant-list-item__properties")
        div(class="product-variant-list-item__property")
            div(class="product-variant-list-item__property-name") {{ t('price') }}
            div(class="product-variant-list-item__property-value")
                PriceFormatter(:price="props.productVariant.priceInCents")

        div(
            v-for="{ id, relationId, name, value } in props.productVariant.booleanProperties"
            :key="`_${id}_${relationId}`"
            class="product-variant-list-item__property"
        )
            div(class="product-variant-list-item__property-name") {{ name }}
            div(class="product-variant-list-item__property-value")
                CheckIcon(
                    v-if="value"
                    class="icon text--success"
                )
                XMarkIcon(
                    v-else
                    class="icon text--error"
                )

        div(
            v-for="{ id, relationId, name, value } in props.productVariant.numericProperties"
            :key="`_${id}_${relationId}`"
            class="product-variant-list-item__property"
        )
            div(class="product-variant-list-item__property-name") {{ name }}
            div(class="product-variant-list-item__property-value") {{ numberToLocaleString(locale, value) }}

        div(
            v-for="{ id, relationId, name, value } in props.productVariant.stringProperties"
            :key="`_${id}_${relationId}`"
            class="product-variant-list-item__property"
        )
            div(class="product-variant-list-item__property-name") {{ name }}
            div(class="product-variant-list-item__property-value") {{ value }}

    div(class="product-variant-list-item__spacer")

    div(class="product-variant-list-item__action")
        Button(
            :blank="true"
        )
            PencilIcon

</template>
