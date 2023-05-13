import {create} from 'zustand';
interface UsersState {
    userReturn: UserReturn;
    setUserReturn: (userReturn: UserReturn) => void;
    users: UserReturn[];

    addUser: (id:number, userReturn: UserReturn, users: UserReturn[]) => void;
    setUsers: (users: Array<UserReturn>) => void;

}

const getLocalStorage = (key: string): any => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value:any) => window.localStorage.setItem(key, JSON.stringify(value));


const useStore = create<UsersState>((set) => ({
    userReturn: getLocalStorage('userReturn'),
    users: getLocalStorage('users') || [],

    setUserReturn: (userReturn: UserReturn) => set(()=>{
        setLocalStorage('userReturn', userReturn)
        return {userReturn: userReturn}
    }),
    addUser: (id:number, userReturn: UserReturn, users: UserReturn[]) => set(()=>{
        userReturn.id = id
        users.push(userReturn)
        setLocalStorage('users', users)
        return {users: users}
    }),

    setUsers: (users: UserReturn[]) => set(() => {
        setLocalStorage('users', users)
        return {users: users} })

}))
export const useUsersStore = useStore;