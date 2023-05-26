import axios from 'axios';
import React from "react";
import CSS from 'csstype';
import {
    Paper,
    AlertTitle,
    Alert,
    Pagination,
    FormControl,
    InputLabel,
    OutlinedInput,
    MenuItem,
    Checkbox, ListItemText, Select, Button, SelectChangeEvent
} from "@mui/material";
import FilmListObject from "./FilmListObject";
import NavigationBar from "./NavigationBar";
import {useFilmStore} from "../store/film";
import {useLocation, useNavigate} from "react-router-dom";
import {useGenresStore} from "../store/genre";
import {useAuthStore} from "../store/authentication";
const MyFilmList = () => {
    const authentication = useAuthStore((state) => state.authentication);
    const userId = useAuthStore((state) => state.userId);
    const films = useFilmStore(state => state.films)
    const setFilms = useFilmStore(state => state.setFilms)
    const [myFilms, setMyFilms] = React.useState<Film[]>([]);
    const [reviewedFilms, setReviewedFilms] = React.useState<Film[]>([]);
    const genres = useGenresStore(state => state.genres)
    const setGenres = useGenresStore(state => state.setGenres)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const { search } = useLocation();
    const [query, setQuery] = React.useState<string>(new URLSearchParams(search).get('q')||'');
    const [selectedGenres, setSelectedGenres] = React.useState<number[]>([]);
    const [selectedAgeRatings, setSelectedAgeRatings] = React.useState<string[]>([]);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [filmsPerPage, setFilmsPerPage] = React.useState<number>(10);
    const [url, setUrl] = React.useState<string>('');
    const [selectedSortOption, setSelectedSortOption] = React.useState("");
    const navigate = useNavigate();

    React.useEffect(() => {

        const getGenres = () => { axios.get('http://localhost:4941/api/v1/films/genres')
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setGenres(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            }) }
        getGenres()
    }, [setGenres])

    React.useEffect(() => {
        const getAllFilms = () => {
            const url = 'http://localhost:4941/api/v1/films'

            setUrl(url);
            axios.get(url)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setFilms(response.data.films)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                }) }
        getAllFilms()
    }, [setFilms])





    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };



    const handleUrlSymbol = (url: String)  => {
        if (url.includes("/films?")) {
            return url+`&`;
        } else {
            return url +'?'
        }
    };


    React.useEffect(() => {
        const getMyFilms = () => {
            let url = 'http://localhost:4941/api/v1/films?directorId=' + userId
            setUrl(url);
            axios.get(url)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setMyFilms(response.data.films)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                }) }
        getMyFilms()
        const getReviewedFilms = () => {

            let url = 'http://localhost:4941/api/v1/films?reviewerId=' + userId
            setUrl(url);
            axios.get(url)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setReviewedFilms(response.data.films)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                }) }
        getReviewedFilms()
    }, [setReviewedFilms])
    const film_related = () => {
        const indexOfLastFilm = currentPage * filmsPerPage;
        const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
        const relatedFilms = myFilms.concat(reviewedFilms);
        const currentFilms = relatedFilms.slice(indexOfFirstFilm, indexOfLastFilm);
        return currentFilms.map((film: Film) => {
            return <FilmListObject key={film.filmId} film={film} />;
        });
    };

    const pageCount = Math.ceil(myFilms.length / filmsPerPage);


    const card: CSS.Properties = {
        padding: "60px",
        margin: "20px",
        display: "block",
        width: "90%" }


    if (authentication === '') {
        navigate('/404NotFound')
    }
    return (
        <div>
            <NavigationBar />
            <Paper elevation={3} style={card}>

                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                    {errorFlag ?
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>
                        : ""}
                    {film_related()}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", margin: "auto", padding: "20px" }}>
                    <Pagination count={pageCount} page={currentPage} onChange={handlePageChange} />
                </div>
            </Paper>
        </div>


    ) }

export default MyFilmList;