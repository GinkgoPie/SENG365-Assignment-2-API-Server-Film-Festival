import {create} from 'zustand';
interface FilmsState {
    films: Film[];
    setFilms: (films: Array<Film>) => void;

    //editFilm: (film: film, newUsername: string) => void;

    removeFilm: (film: Film) => void;
}

const getLocalStorage = (key: string): Film[] => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value:Array<Film>) => window.localStorage.setItem(key, JSON.stringify(value));

const useStore = create<FilmsState>((set) => ({

    films: getLocalStorage('films') || [],
    setFilms: (films: Film[]) => set(() => {
        setLocalStorage('films', films)
        return {films: films} }),
    // editFilm: (film: User, newUsername) => set((state) => {
    //     const temp = state.users.map(u => u.user_id === user.user_id ?
    //         ({...u, username: newUsername} as User): u) setLocalStorage('users', temp)
    //     return {users: temp}
    // }),
    removeFilm: (film: Film) => set((state) => {
        setLocalStorage('films', state.films.filter(f => f.filmId !== film.filmId))
        return {films: state.films.filter(f => f.filmId !== film.filmId)}
    })

}))
export const useFilmStore = useStore;