import { defineStore } from 'pinia';
import { deleteTokens, getAccessToken, getTokenUser } from '@api/helpers/authentication';

import { type TokenUser } from '@api/interfaces/authentication/signIn';

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
        deleteUser(deleteOnly = false): void {
            if (this.user) {
                if (deleteOnly) {
                    deleteTokens();
                    this.user = null;
                } else {
                    deleteTokens();
                    this.user = null;
                }
            } else {
                deleteTokens();
            }
        },
    },
});
