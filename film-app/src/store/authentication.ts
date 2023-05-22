import {create} from 'zustand';
interface AuthState {
    authentication: string;

    userId: number;

    email: string;

    firstName: string;

    lastName: string;

    setAuthentication: (authentication: string) => void;

    setUserId: (userId: number) => void

    setEmail: (authentication: string) => void;
    setFirstName: (authentication: string) => void;
    setLastName: (authentication: string) => void;

}

const getAuthLocalStorage = (key: string): string => JSON.parse(window.localStorage.getItem(key) as string);
const setAuthLocalStorage = (key: string, value:string) => window.localStorage.setItem(key, JSON.stringify(value));

const getUserIdStorage = (key: string): number => JSON.parse(window.localStorage.getItem(key) as string);
const setUserIdStorage = (key: string, value:number) => window.localStorage.setItem(key, JSON.stringify(value));

const useStore = create<AuthState>((set) => ({
    authentication: getAuthLocalStorage('authentication') || '',
    userId: getUserIdStorage('userId') || -1,
    email: getAuthLocalStorage('email') || '',
    firstName: getAuthLocalStorage('firstName') || '',
    lastName: getAuthLocalStorage('lastName') || '',
    setAuthentication: (authentication: string) => set(() => {
        setAuthLocalStorage('authentication', authentication)
        return {authentication: authentication} }),

    setUserId: (userId: number) => set( () => {
        setUserIdStorage('userId', userId)
        return {userId: userId}
    }),

    setEmail: (email: string) => set(() => {
        setAuthLocalStorage('email', email)
        return {email: email} }),

    setFirstName: (firstName: string) => set(() => {
        setAuthLocalStorage('firstName', firstName)
        return {firstName: firstName} }),

    setLastName: (lastName: string) => set(() => {
        setAuthLocalStorage('lastName', lastName)
        return {lastName: lastName} }),


    }))
export const useAuthStore = useStore;