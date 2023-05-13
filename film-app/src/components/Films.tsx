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
import {useFilmStore} from "../store/film";
import {useLocation} from "react-router-dom";
import {useGenresStore} from "../store/genre";
const FilmList = () => {
    const films = useFilmStore(state => state.films)
    const setFilms = useFilmStore(state => state.setFilms)
    const genres = useGenresStore(state => state.genres)
    const setGenres = useGenresStore(state => state.setGenres)
    const ageRatings: AgeRating[] = ["G", "PG", "M", "R13", "R15", "R16", "R18", "RP"];
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const { search } = useLocation();
    const [query, setQuery] = React.useState<string>(new URLSearchParams(search).get('q')||'');
    const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
    const [selectedAgeRatings, setSelectedAgeRatings] = React.useState<string[]>([]);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [filmsPerPage, setFilmsPerPage] = React.useState<number>(10);

    React.useEffect(() => {
        const getGenres = () => { axios.get('https://seng365.csse.canterbury.ac.nz/api/v1/films/genres')
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


    const handleSearch = (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if (query !== '') {
            window.location.href = `/films?q=${query}`;
        } else {
            window.location.href = `/films`;
        }

    };

    const handleInputChange = (event: { target: { value: any; }; }) => {
        setQuery(event.target.value);
    };


    const handleAgeRatingSelection = (event: SelectChangeEvent<string[]>) => {
        setSelectedAgeRatings(event.target.value as string[]);
        setFilms(films.filter((film) =>
            selectedAgeRatings.includes(film.ageRating)));
    };
    const handleGenreSelection = (event: SelectChangeEvent<string[]>) => {
        setSelectedGenres(event.target.value as string[]);
        setFilms(films.filter(film =>
            selectedGenres.includes(film.genreId.toString())));
    };

    React.useEffect(() => {
        const getFilms = () => {
            let url = 'https://seng365.csse.canterbury.ac.nz/api/v1/films'
            if (query !== '') {
                url = url + '?q=' + query
            }
            if (selectedGenres.length > 0) {
                genres.forEach((genre) => {
                    url = url + `&genreId=${genre.genreId}`
                });
            }
            if (selectedAgeRatings.length > 0) {
                genres.forEach((ageRating) => {
                    url = url + `&ageRatings=${ageRating}`
                });
            }
            axios.get(url)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setFilms(response.data.films)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                }) }
        getFilms()
    }, [setFilms, query, selectedGenres, selectedAgeRatings])
    const film_rows = () => {
        const indexOfLastFilm = currentPage * filmsPerPage;
        const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
        const currentFilms = films.slice(indexOfFirstFilm, indexOfLastFilm);
        return currentFilms.map((film: Film) => {
            return <FilmListObject key={film.filmId} film={film} />;
        });
    };

    const pageCount = Math.ceil(films.length / filmsPerPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "block",
        width: "90%" }

    return (
        <Paper elevation={3} style={card}>
            <form onSubmit={handleSearch} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", margin: "auto", padding: "20px" }}>
                <input type="text" value={query} onChange={handleInputChange} style={{ margin: "0px 5px" , width: '400px', height: '60px'}} />
                <Button type="submit" variant="contained" sx={{ margin: "0px 5px" }}>Search</Button>
            </form>
            <FormControl sx={{ margin: "0px 5px", width: '400px', height: '60px'}}>
                <InputLabel id="genre-filter-label">Genre</InputLabel>
                <Select
                    labelId="genre-filter-label"
                    id="genre-filter"
                    multiple
                    value={selectedGenres}
                    onChange={handleGenreSelection}
                    input={<OutlinedInput label="Genre" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={{
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left"
                        },
                        transformOrigin: {
                            vertical: "top",
                            horizontal: "left"
                        }
                    }}
                >
                    {genres.map((genre) => (
                        <MenuItem key={genre.genreId} value={genre.name}>
                            <Checkbox checked={selectedGenres.indexOf(genre.name) > -1} />
                            <ListItemText primary={genre.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{ margin: "0px 5px", width: '400px', height: '60px' }}>
                <InputLabel id="age-rating-filter-label">Age Rating</InputLabel>
                <Select
                    labelId="age-rating-filter-label"
                    id="age-rating-filter"
                    multiple
                    value={selectedAgeRatings}
                    onChange={handleAgeRatingSelection}
                    input={<OutlinedInput label="Age Rating" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={{
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left"
                        },
                        transformOrigin: {
                            vertical: "top",
                            horizontal: "left"
                        }
                    }}
                >
                    {ageRatings.map((ageRating) => (
                        <MenuItem key={ageRating} value={ageRating}>
                            <Checkbox checked={selectedAgeRatings.indexOf(ageRating) > -1} />
                            <ListItemText primary={ageRating} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                {errorFlag ?
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                    : ""}
                {film_rows()}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", margin: "auto", padding: "20px" }}>
                <Pagination count={pageCount} page={currentPage} onChange={handlePageChange} />
            </div>
        </Paper>

    ) }

export default FilmList;