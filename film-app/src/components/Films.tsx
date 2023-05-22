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
import {useLocation} from "react-router-dom";
import {useGenresStore} from "../store/genre";
const FilmList = () => {
    const films = useFilmStore(state => state.films)
    const setFilms = useFilmStore(state => state.setFilms)
    const genres = useGenresStore(state => state.genres)
    const setGenres = useGenresStore(state => state.setGenres)
    const ageRatings: AgeRating[] = ['G', 'PG', 'M', 'R13', 'R16', 'R18'];
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
        const options = event.target.value as string[];
        setSelectedAgeRatings(options);
    };

    const handleGenreSelection = (event: SelectChangeEvent<number[]>) => {
        const selected = event.target.value as number [];
        setSelectedGenres(selected);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    const handleSortChange = (event: SelectChangeEvent<string>) => {
        const selected = event.target.value as string;
        setSelectedSortOption(selected);
    };

    const handleUrlSymbol = (url: String)  => {
        if (url.includes("/films?")) {
            return url+`&`;
        } else {
            return url +'?'
        }
    };


    React.useEffect(() => {
        const getFilms = () => {
            let url = 'https://seng365.csse.canterbury.ac.nz/api/v1/films'
            if (query !== '') {
                url = url + '?q=' + query
            }
            if (selectedGenres.length > 0) {
                for (const genre of selectedGenres) {
                    url = handleUrlSymbol(url);
                    url = url + `genreIds=${genre}`
                }
            }
            if (selectedAgeRatings.length > 0) {
                for (const ageRating of selectedAgeRatings) {
                    url = handleUrlSymbol(url);
                    url = url + `ageRatings=${ageRating}`
                }
            }
            if (selectedSortOption !== '') {
                url = handleUrlSymbol(url);
                url = url + `sortBy=${selectedSortOption}`

            }
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
        getFilms()
    }, [setFilms, selectedGenres, selectedAgeRatings, selectedSortOption])
    const film_rows = () => {
        const indexOfLastFilm = currentPage * filmsPerPage;
        const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
        const currentFilms = films.slice(indexOfFirstFilm, indexOfLastFilm);
        return currentFilms.map((film: Film) => {
            return <FilmListObject key={film.filmId} film={film} />;
        });
    };

    const pageCount = Math.ceil(films.length / filmsPerPage);


    const card: CSS.Properties = {
        padding: "60px",
        margin: "20px",
        display: "block",
        width: "90%" }



    return (
        <div>
            <NavigationBar />
            <Paper elevation={3} style={card}>
                <form onSubmit={handleSearch} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", margin: "auto", padding: "20px" }}>
                    <input type="text" value={query} onChange={handleInputChange} style={{ margin: "0px 5px" , width: '400px', height: '60px'}} />
                    <Button type="submit" variant="contained" sx={{ margin: "0px 5px" }}>Search</Button>
                </form>
                <p>{selectedSortOption}</p>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "auto", padding: "20px" }}>
                    <FormControl sx={{ margin: "0px 5px", width: '200px', height: '60px' }}>
                        <InputLabel id="sort-by-label">Sort By</InputLabel>
                        <Select
                            labelId="sort-by-label"
                            id="sort-by"
                            value={selectedSortOption}
                            onChange={handleSortChange}
                            input={<OutlinedInput label="Sort By" />}
                        >
                            <MenuItem value={'ALPHABETICAL_ASC'}>Title (A-Z)</MenuItem>
                            <MenuItem value={'ALPHABETICAL_DESC'}>Title (Z-A)</MenuItem>
                            <MenuItem value={'RATING_ASC'}>Rating (Lowest to Highest)</MenuItem>
                            <MenuItem value={'RATING_DESC'}>Rating (Highest to Lowest)</MenuItem>
                            <MenuItem value={'RELEASED_ASC'}>Release Date (Oldest to Newest)</MenuItem>
                            <MenuItem value={'RELEASED_DESC'}>Release Date (Newest to Oldest)</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ margin: "0px 5px", width: '400px', height: '60px'}}>
                        <InputLabel id="genre-filter-label">Genre</InputLabel>
                        <Select
                            labelId="genre-filter-label"
                            id="genre-filter"
                            multiple
                            value={selectedGenres}
                            onChange={handleGenreSelection}
                            input={<OutlinedInput label="Genre" />}
                            renderValue={(selected) =>
                                selected?.map((id) => genres.find((genre) => genre.genreId === id)?.name).join(", ")
                            }
                            MenuProps={{
                                anchorOrigin: {
                                    vertical: "bottom",
                                    horizontal: "left",
                                },
                                transformOrigin: {
                                    vertical: "top",
                                    horizontal: "left",
                                },
                            }}
                        >
                            {genres.map((genre) => (
                                <MenuItem key={genre.genreId} value={genre.genreId}>
                                    <Checkbox checked={selectedGenres.indexOf(genre.genreId) > -1} />
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
                </div>
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
        </div>


    ) }

export default FilmList;