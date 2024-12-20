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

export function getAvailableLanguages(): string[] {
    return import.meta.env.VITE_LANGUAGES.split(',');
}

export function getDefaultDescriptionLocalized() {
    const tmp: Record<string, string> = {};

    getAvailableLanguages().forEach((language) => {
        tmp[language] = '';
    });

    return tmp;
}
