import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config";

export interface UserPrefs {
    reputation: number;
}

interface IAuthStore {
    session: Models.Session | null;
    jwt: string | null;
    user: Models.User<UserPrefs> | null;
    hydrated: boolean;

    setHydrated(): void;
    verifySession(): Promise<void>;
    login(
        email: string,
        password: string
    ): Promise<{
        success: boolean;
        error?: AppwriteException | null;
    }>;
    createAccount(
        name: string,
        email: string,
        password: string
    ): Promise<{
        success: boolean;
        error?: AppwriteException | null;
    }>;
    logout(): Promise<void>;
}

export const useAuthStore = create<IAuthStore>()(
    persist(
        immer((set) => ({
            session: null,
            jwt: null,
            user: null,
            hydrated: false,

            setHydrated() {
                set({ hydrated: true });
            },

            async verifySession() {
                try {
                    const session = await account.getSession("current");
                    set({ session });
                } catch (error) {
                    // If verification fails, we should clear the state
                    set({ session: null, jwt: null, user: null });
                }
            },

            async login(email: string, password: string) {
                try {
                    const session = await account.createEmailPasswordSession(email, password);
                    const [user, { jwt }] = await Promise.all([
                        account.get<UserPrefs>(),
                        account.createJWT(),
                    ]);

                    if (!user.prefs?.reputation) {
                        // We can't use await inside produce if we were using it directly, but we are inside the async action
                        // However, to update state we use set.
                        // The updatePrefs call is an external side effect.
                        await account.updatePrefs<UserPrefs>({
                            reputation: 0,
                        });
                        // Refetch user to get updated prefs? Or just perform optimistically?
                        // account.get() returns the user with prefs, but we just updated them remotely.
                        // Ideally we should update the local user object with the new pref.
                        user.prefs.reputation = 0;
                    }

                    set({ session, user, jwt });

                    return { success: true };
                } catch (error: any) {
                    console.log(error);
                    return {
                        success: false,
                        error: error instanceof AppwriteException ? error : null,
                    };
                }
            },

            async createAccount(name: string, email: string, password: string) {
                try {
                    await account.create(ID.unique(), email, password, name);
                    return { success: true };
                } catch (error: any) {
                    console.log(error);
                    return {
                        success: false,
                        error: error instanceof AppwriteException ? error : null,
                    };
                }
            },

            async logout() {
                try {
                    await account.deleteSessions();
                    set({ session: null, jwt: null, user: null });
                } catch (error) {
                    console.log(error);
                }
            },
        })),
        {
            name: "auth",
            onRehydrateStorage() {
                return (state, error) => {
                    if (!error) state?.setHydrated();
                };
            },
        }
    )
);
