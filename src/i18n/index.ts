import { createI18n, type I18nOptions } from 'vue-i18n';
import messagesEnUs from '~/i18n/en-US.json';
import messagesDeDe from '~/i18n/de-DE.json';

export const messages = {
    'en-US': messagesEnUs,
    'de-DE': messagesDeDe,
};

export const defaultLocale = 'de-DE';

export function getLanguageFromLocale(locale: string): string {
    if (locale.length === 2) {
        return locale.toLocaleLowerCase();
    }
    let parts = locale.split('-');
    if (parts.length > 0) {
        if (parts[0].length === 2) {
            return parts[0].toLocaleLowerCase();
        }
    }
    parts = locale.split('_');
    if (parts.length > 0) {
        if (parts[0].length === 2) {
            return parts[0].toLocaleLowerCase();
        }
    }
    return defaultLocale;
}

// 2. Create i18n instance with options
export const i18nOptions: I18nOptions = {
    legacy: false,
    locale: defaultLocale, // set locale
    fallbackLocale: defaultLocale, // set fallback locale
    messages, // set locale messages
    // If you need to specify other options, you can set other options
    // ...
    warnHtmlInMessage: 'off',
};

const i18n = createI18n(i18nOptions);

export default i18n;
