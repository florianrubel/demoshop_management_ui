import { defineStore } from 'pinia';

import { type TokenUser } from '~api/interfaces/authentication/signIn';

import { deleteTokens, getAccessToken, getTokenUser } from '~api/helpers/authentication';

export interface AuthenticationStoreState {
    user: TokenUser | null;
    isLoaded: boolean;
}

export const useAuthenticationStore = defineStore('authentication', {
    state: (): AuthenticationStoreState => ({
        user: null,
        isLoaded: false,
    }),
    actions: {
        setUser(): void {
            const accessToken: string | null = getAccessToken();
            if (accessToken) {
                this.user = getTokenUser(accessToken);
            } else {
                this.user = null;
            }
        },
        deleteUser(): void {
            deleteTokens();
            this.user = null;
        },
    },
});
