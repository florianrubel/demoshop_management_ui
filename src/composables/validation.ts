import { useI18n } from 'vue-i18n';

export default function useValidation() {
    const { t } = useI18n();
    function limitedString(value: string | undefined | null, minLength: number, maxLength: number, allowEmpty: boolean = false): string | undefined {
        if (allowEmpty && !value) return undefined;
        return value && value.length >= minLength && value.length <= maxLength ? undefined : t('errorLimitedString', { min: minLength, max: maxLength });
    }

    return {
        limitedString,
    };
}
