// Getter function for VITE_LANGUAGES
export const getLanguages = (): string[] => {
    const languages = import.meta.env.VITE_LANGUAGES;
    if (!languages) {
        throw new Error('Environment variable VITE_LANGUAGES is not defined.');
    }
    return languages.split(',');
};

// Getter function for VITE_CONTENT_LANGUAGES
export const getContentLanguages = (): string[] => {
    const contentLanguages = import.meta.env.VITE_CONTENT_LANGUAGES;
    if (!contentLanguages) {
        throw new Error('Environment variable VITE_CONTENT_LANGUAGES is not defined.');
    }
    return contentLanguages.split(',');
};

// Getter function for VITE_SUPERADMIN_USER
export const getSuperAdminUser = (): string => {
    const superAdminUser = import.meta.env.VITE_SUPERADMIN_USER;
    if (!superAdminUser) {
        throw new Error('Environment variable VITE_SUPERADMIN_USER is not defined.');
    }
    return superAdminUser;
};

// Getter function for VITE_SUPERADMIN_PASS
export const getSuperAdminPass = (): string => {
    const superAdminPass = import.meta.env.VITE_SUPERADMIN_PASS;
    if (!superAdminPass) {
        throw new Error('Environment variable VITE_SUPERADMIN_PASS is not defined.');
    }
    return superAdminPass;
};

// Getter function for VITE_CDN_BASE_URL
export const getCdnBaseUrl = (): string => {
    const cdnBaseUrl = import.meta.env.VITE_CDN_BASE_URL;
    if (!cdnBaseUrl) {
        throw new Error('Environment variable VITE_CDN_BASE_URL is not defined.');
    }
    return cdnBaseUrl;
};
