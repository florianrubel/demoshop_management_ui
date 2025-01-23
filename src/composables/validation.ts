import { useI18n } from 'vue-i18n';
import {
    DEFAULT_INPUT_MAX_LENGTH, DEFAULT_INPUT_MIN_LENGTH, INT32_MAX, INT32_MIN,
} from '~/constants/app';
import { numberToLocaleString } from '~/helpers/misc';

export default function useValidation() {
    const { t } = useI18n();

    function limitedString(
        value: string | undefined | null,
        minLength: number = DEFAULT_INPUT_MIN_LENGTH,
        maxLength: number = DEFAULT_INPUT_MAX_LENGTH,
        allowEmpty: boolean = false,
    ): string | undefined {
        if (allowEmpty && !value) return undefined;

        return value && value.length >= minLength && value.length <= maxLength
            ? undefined
            : t('errorLimitedString', { min: minLength, max: maxLength });
    }

    function limitedInt32(value: number | undefined | null, min: number = INT32_MIN, max: number = INT32_MAX): string | undefined {
        if (!value) return undefined;
        if (value < min) return t('int32TooSmall', { min: numberToLocaleString(undefined, min, 0, 0) });
        if (value > max) return t('int32TooLarge', { max: numberToLocaleString(undefined, max, 0, 0) });
        return undefined;
    }

    return {
        limitedString,
        limitedInt32,
    };
}
