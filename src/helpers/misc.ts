import { getContentLanguages } from '~/helpers/env';

export function getUniqueId(): string {
    return `_${Math.random().toString(36).substr(2, 9)}`;
}

export function setPageTitle(titleParts: string[]): void {
    const fixedTitle = 'CinemaNexus';
    document.title = `${titleParts.join(' / ')} - ${fixedTitle}`;
}

export function decapitalizeFirstLetter(value: string): string {
    return value.charAt(0).toLocaleLowerCase() + value.slice(1);
}

export function sortAsc(value: never[]) {
    const copy = value.splice(0);
    copy.sort((a, b) => (a < b ? -1 : 1));
    return copy;
}

export function getDefaultDescriptionLocalized() {
    const tmp: Record<string, string> = {};

    getContentLanguages().forEach((language) => {
        tmp[language] = '';
    });

    return tmp;
}

export function numberToLocaleString(locale: string | undefined, value: number, minimumFractionDigits = 2, maximumFractionDigits = 2): string {
    return value.toLocaleString(locale, { minimumFractionDigits, maximumFractionDigits });
}

export function formatDateTime(isoString?: string | null, locale?: string): string {
    if (!isoString) return '';
    const dateTime = new Date(isoString);

    return (new Intl.DateTimeFormat(locale || 'en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })).format(dateTime);
}

export function arraysAreEqual<T>(array1: T[], array2: T[]): boolean {
    // Check if the arrays are the same length
    if (array1.length !== array2.length) {
        return false;
    }

    // Compare each element in the arrays
    for (let i = 0; i < array1.length; i += 1) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }

    return true;
}
