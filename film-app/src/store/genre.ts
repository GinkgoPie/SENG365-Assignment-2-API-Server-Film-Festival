import {create} from 'zustand';
interface GenresState {
    genres: Genre[];
    setGenres: (genres: Array<Genre>) => void;

}

const getLocalStorage = (key: string): Genre[] => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value:Array<Genre>) => window.localStorage.setItem(key, JSON.stringify(value));

const useStore = create<GenresState>((set) => ({

    genres: getLocalStorage('genres') || [],
    setGenres: (genres: Genre[]) => set(() => {
        setLocalStorage('genres', genres)
        return {genres: genres} })


}))
export const useGenresStore = useStore;