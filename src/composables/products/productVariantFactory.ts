import { ref, computed, type Ref } from 'vue';

import axios from 'axios';
import { useI18n } from 'vue-i18n';
import { useAuthenticationStore } from '~/store/authentication';

import type { CreateBooleanProperty, PatchBooleanProperty, ViewBooleanProperty } from '~/sharedLib/api/src/interfaces/pim/properties/booleanProperty';
import type { CreateNumericProperty, PatchNumericProperty, ViewNumericProperty } from '~/sharedLib/api/src/interfaces/pim/properties/numericProperty';
import type { CreateStringProperty, PatchStringProperty, ViewStringProperty } from '~/sharedLib/api/src/interfaces/pim/properties/stringProperty';
import type { ViewProductVariant } from '~/sharedLib/api/src/interfaces/pim/productVariant';
import type AbstractDefaultService from '~/sharedLib/api/src/services/abstractDefaultService';
import type { SearchParameters, UuidViewModel } from '~/sharedLib/api/src/interfaces/api';
import type {
    CreateProductVariantBooleanProperty,
    PatchProductVariantBooleanProperty,
    ProductVariantBooleanPropertyPaginationParameters,
    ViewProductVariantBooleanProperty,
} from '~/sharedLib/api/src/interfaces/pim/productVariantBooleanProperty';
import type {
    CreateProductVariantNumericProperty,
    PatchProductVariantNumericProperty,
    ProductVariantNumericPropertyPaginationParameters,
    ViewProductVariantNumericProperty,
} from '~/sharedLib/api/src/interfaces/pim/productVariantNumericProperty';
import type {
    CreateProductVariantStringProperty,
    PatchProductVariantStringProperty,
    ProductVariantStringPropertySearchParameters,
    ViewProductVariantStringProperty,
} from '~/sharedLib/api/src/interfaces/pim/productVariantStringProperty';

import BooleanPropertyService from '~/sharedLib/api/src/services/pim/properties/booleanPropertyService';
import NumericPropertyService from '~/sharedLib/api/src/services/pim/properties/numericPropertyService';
import StringPropertyService from '~/sharedLib/api/src/services/pim/properties/stringPropertyService';
import ProductVariantBooleanPropertyService from '~/sharedLib/api/src/services/pim/productVariantBooleanPropertyService';
import ProductVariantNumericPropertyService from '~/sharedLib/api/src/services/pim/productVariantNumericPropertyService';
import ProductVariantStringPropertyService from '~/sharedLib/api/src/services/pim/productVariantStringPropertyService';

import { useNotificationStore } from '~/store/notifications';

export interface HydratedProperty<t> {
    id: string;
    name: string;
    value: t;
    relationId: string;
}

export type HydratedBooleanProperty = HydratedProperty<boolean>;

export interface HydratedNumericProperty extends HydratedProperty<number> {
    minValue: number | null;
    maxValue: number | null;
}

export interface HydratedStringProperty extends HydratedProperty<string> {
    allowedValues: string[] | null;
}

export interface HydratedProductVariant extends ViewProductVariant {
    booleanProperties: Record<string, HydratedBooleanProperty>;
    numericProperties: Record<string, HydratedNumericProperty>;
    stringProperties: Record<string, HydratedStringProperty>;
}

export type PoolKey =
    'booleanProperties' |
    'numericProperties' |
    'stringProperties' |
    'productVariantBooleanProperties' |
    'productVariantNumericProperties' |
    'productVariantStringProperties';

export default function useProductVariantFactory(productVariants: Ref<ViewProductVariant[]>) {
    const { t } = useI18n();

    const authenticationStore = useAuthenticationStore();
    const notificationStore = useNotificationStore();

    const booleanPropertyService = new BooleanPropertyService(
        () => authenticationStore.setUser(),
        () => authenticationStore.deleteUser(),
    );
    const numericPropertyService = new NumericPropertyService(
        () => authenticationStore.setUser(),
        () => authenticationStore.deleteUser(),
    );
    const stringPropertyService = new StringPropertyService(
        () => authenticationStore.setUser(),
        () => authenticationStore.deleteUser(),
    );
    const productVariantBooleanPropertyService = new ProductVariantBooleanPropertyService(
        () => authenticationStore.setUser(),
        () => authenticationStore.deleteUser(),
    );
    const productVariantNumericPropertyService = new ProductVariantNumericPropertyService(
        () => authenticationStore.setUser(),
        () => authenticationStore.deleteUser(),
    );
    const productVariantStringPropertyService = new ProductVariantStringPropertyService(
        () => authenticationStore.setUser(),
        () => authenticationStore.deleteUser(),
    );

    const productVariantBooleanProperties = ref<ViewProductVariantBooleanProperty[]>([]);
    const productVariantNumericProperties = ref<ViewProductVariantNumericProperty[]>([]);
    const productVariantStringProperties = ref<ViewProductVariantStringProperty[]>([]);

    const booleanProperties = ref<ViewBooleanProperty[]>([]);
    const numericProperties = ref<ViewNumericProperty[]>([]);
    const stringProperties = ref<ViewStringProperty[]>([]);

    const hydratedProductVariants = ref<HydratedProductVariant[]>([]);

    const productVariantIds = computed<string[]>(() => productVariants.value.map(({ id }) => id));

    const abortControllers = ref<Record<PoolKey, AbortController | null>>({
        booleanProperties: null,
        numericProperties: null,
        stringProperties: null,
        productVariantBooleanProperties: null,
        productVariantNumericProperties: null,
        productVariantStringProperties: null,
    });

    async function loadRelation<
        ViewType,
        CreateType,
        PatchType,
        SearchParametersType,
    >(
        service: AbstractDefaultService<
            ViewType,
            CreateType,
            PatchType,
            SearchParametersType
        >,
        pool: Ref<ViewType[]>,
        poolKey: PoolKey,
    ) {
        const abortController = abortControllers.value[poolKey];
        if (abortController) {
            abortController.abort();
        }
        try {
            abortControllers.value[poolKey] = new AbortController();
            // @ts-expect-error This is too abstract for ts to parse it correctly.
            const res = await service.getMultiple({
                pageSize: -1,
                productVariantIds: productVariantIds.value.join(','),
            }, abortControllers.value[poolKey]?.signal);
            // The ref is expected to change its value.
            // eslint-disable-next-line no-param-reassign
            pool.value = res.data;
        } catch (error) {
            if (!axios.isCancel(error)) {
                notificationStore.addNotification({
                    text: t('dataNotLoaded'),
                    type: 'error',
                });
            }
        }
        abortControllers.value[poolKey] = null;
    }

    async function loadProperty<
    ViewType,
    CreateType,
    PatchType,
    SearchParametersType,
>(
        service: AbstractDefaultService<
            ViewType,
            CreateType,
            PatchType,
            SearchParametersType
        >,
        pool: Ref<ViewType[]>,
        poolKey: PoolKey,
        ids: string[],
    ) {
        const abortController = abortControllers.value[poolKey];
        if (abortController) {
            abortController.abort();
        }
        if (!ids.length) return;
        try {
            abortControllers.value[poolKey] = new AbortController();
            const res = await service.getMultipleByIdsByPost(
                [...new Set(ids)],
                undefined,
                abortControllers.value[poolKey]?.signal,
            );
            // The ref is expected to change its value.
            // eslint-disable-next-line no-param-reassign
            pool.value = res.data;
            // @ts-expect-error Ts cannot resolve this at this location.
            pool.value.sort((a, b) => (a.name > b.name ? 1 : -1));
        } catch (error) {
            if (!axios.isCancel(error)) {
                notificationStore.addNotification({
                    text: t('dataNotLoaded'),
                    type: 'error',
                });
            }
        }
        abortControllers.value[poolKey] = null;
    }

    async function loadRelations(): Promise<void> {
        await Promise.all([
            loadRelation<
                ViewProductVariantBooleanProperty,
                CreateProductVariantBooleanProperty,
                PatchProductVariantBooleanProperty,
                ProductVariantBooleanPropertyPaginationParameters
            >(
                productVariantBooleanPropertyService,
                productVariantBooleanProperties,
                'productVariantBooleanProperties',
            ),
            loadRelation<
                ViewProductVariantNumericProperty,
                CreateProductVariantNumericProperty,
                PatchProductVariantNumericProperty,
                ProductVariantNumericPropertyPaginationParameters
            >(
                productVariantNumericPropertyService,
                productVariantNumericProperties,
                'productVariantNumericProperties',
            ),
            loadRelation<
                ViewProductVariantStringProperty,
                CreateProductVariantStringProperty,
                PatchProductVariantStringProperty,
                ProductVariantStringPropertySearchParameters
            >(
                productVariantStringPropertyService,
                productVariantStringProperties,
                'productVariantStringProperties',
            ),
        ]);
    }

    async function loadProperties(): Promise<void> {
        await Promise.all([
            loadProperty<
                ViewBooleanProperty,
                CreateBooleanProperty,
                PatchBooleanProperty,
                SearchParameters
            >(
                booleanPropertyService,
                booleanProperties,
                'booleanProperties',
                productVariantBooleanProperties.value.map(({ propertyId }) => propertyId),
            ),
            loadProperty<
                ViewNumericProperty,
                CreateNumericProperty,
                PatchNumericProperty,
                SearchParameters
            >(
                numericPropertyService,
                numericProperties,
                'numericProperties',
                productVariantNumericProperties.value.map(({ propertyId }) => propertyId),
            ),
            loadProperty<
                ViewStringProperty,
                CreateStringProperty,
                PatchStringProperty,
                SearchParameters
            >(
                stringPropertyService,
                stringProperties,
                'stringProperties',
                productVariantStringProperties.value.map(({ propertyId }) => propertyId),
            ),
        ]);
    }

    function getPropertyMap<ViewType extends UuidViewModel>(pool: Ref<ViewType[]>): Record<string, ViewType> {
        const map: Record<string, ViewType> = {};
        pool.value.forEach((property) => {
            map[property.id] = property;
        });
        return map;
    }

    async function hydrate(): Promise<void> {
        await loadRelations();
        await loadProperties();

        const booleanPropertiesMap = getPropertyMap<ViewBooleanProperty>(booleanProperties);
        const numericPropertiesMap = getPropertyMap<ViewNumericProperty>(numericProperties);
        const stringPropertiesMap = getPropertyMap<ViewStringProperty>(stringProperties);

        hydratedProductVariants.value = productVariants.value.map((productVariant) => {
            const booleanRelations = productVariantBooleanProperties.value.filter(({ productVariantId }) => productVariantId === productVariant.id);
            const numericRelations = productVariantNumericProperties.value.filter(({ productVariantId }) => productVariantId === productVariant.id);
            const stringRelations = productVariantStringProperties.value.filter(({ productVariantId }) => productVariantId === productVariant.id);

            const hydrated: HydratedProductVariant = {
                ...productVariant,
                booleanProperties: {},
                numericProperties: {},
                stringProperties: {},
            };

            const variantBooleanProperties = booleanRelations.map((relation) => ({
                id: booleanPropertiesMap[relation.propertyId].id,
                name: booleanPropertiesMap[relation.propertyId].name,
                relationId: relation.id,
                value: relation.value,
            }));
            variantBooleanProperties.forEach((property) => {
                hydrated.booleanProperties[property.name] = property;
            });

            const variantNumericProperties = numericRelations.map((relation) => ({
                id: numericPropertiesMap[relation.propertyId].id,
                name: numericPropertiesMap[relation.propertyId].name,
                relationId: relation.id,
                value: relation.value,
                minValue: numericPropertiesMap[relation.propertyId].minValue,
                maxValue: numericPropertiesMap[relation.propertyId].maxValue,
            }));
            variantNumericProperties.forEach((property) => {
                hydrated.numericProperties[property.name] = property;
            });

            const variantStringProperties = stringRelations.map((relation) => ({
                id: stringPropertiesMap[relation.propertyId].id,
                name: stringPropertiesMap[relation.propertyId].name,
                relationId: relation.id,
                value: relation.value,
                allowedValues: stringPropertiesMap[relation.propertyId].allowedValues,
            }));
            variantStringProperties.forEach((property) => {
                hydrated.stringProperties[property.name] = property;
            });

            return hydrated;
        });
    }

    return {
        hydratedProductVariants,

        booleanProperties,
        numericProperties,
        stringProperties,

        productVariantBooleanProperties,
        productVariantNumericProperties,
        productVariantStringProperties,

        hydrate,
    };
}
