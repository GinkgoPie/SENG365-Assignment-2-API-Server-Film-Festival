import axios from 'axios';
import React from "react";
import CSS from 'csstype';
import {Paper, AlertTitle, Alert} from "@mui/material";
import FilmListObject from "./FilmListObject";
import {useFilmStore} from "../store/film";
import {useLocation} from "react-router-dom";
const FilmList = () => {
    const films = useFilmStore(state => state.films)
    const setFilms = useFilmStore(state => state.setFilms)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const { search } = useLocation();
    const query = new URLSearchParams(search).get('q');
    React.useEffect(() => {
        const getFilms = () => {
            let url = 'https://seng365.csse.canterbury.ac.nz/api/v1/films'
            if (query !== null) {
                url = url + '?q=' + query
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
    }, [setFilms])
    const film_rows = () => {
        return films.map((film: Film) => {
            return <FilmListObject key={film.filmId} film={film} />;
        });
    };

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        display: "block",
        width: "90%" }

    return (
        <Paper elevation={3} style={card}>
            <h1>FilmList</h1>
            <div style={{display:"inline-block", maxWidth:"965px",
                minWidth:"320"}}>
                {errorFlag?
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                    :""}
                {film_rows()}
            </div>
        </Paper>
    ) }

export default FilmList;