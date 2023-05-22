import React from "react";
import axios from "axios";
import FilmPage from "./Film"
import {Delete, Edit, Padding} from "@mui/icons-material";
import {useFilmStore} from "../store/film";
import {useGenresStore} from "../store/genre";
import {useUsersStore} from "../store/user";
import {
    Button, Card, CardActions, CardContent, CardMedia, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, IconButton, Rating, TextField, Typography
} from "@mui/material";
import CSS from 'csstype';
import { FaFilm } from 'react-icons/fa';
import { FaStar } from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import {useAuthStore} from "../store/authentication";
interface IFilmProps {
    film: Film
}

interface IGenreProps {
    genre: Genre
}

interface IUserProps {
    user: User
}




const FilmListObject = (filmProps: IFilmProps) => {
    const navigate = useNavigate();
    const authentication = useAuthStore((state) => state.authentication);
    const userId = useAuthStore((state) => state.userId);
    const [film] = React.useState<Film>(filmProps.film);
    const genres = useGenresStore((state) => state.genres);
    const userReturn = useUsersStore((state) => state.userReturn);
    const setUserReturn = useUsersStore((state) => state.setUserReturn);
    const users = useUsersStore((state) => state.users);
    const addUser = useUsersStore((state) => state.addUser);
    const [username, setUsername] = React.useState("");
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const deleteFilmFromStore = useFilmStore((state) => state.removeFilm);






    const userCardStyles: CSS.Properties = {
        display: "inline-block",
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: "40%",
        width: "25%",
        margin: "auto",
        padding: "10px",
        textAlign: "center"
    }

    const getFilmGenre = (film: Film) => {
        return genres.map((genre: Genre) => {
           if (genre.genreId === film.genreId) {
               return genre.name
           }
        });
    }

    const getDirectorImagePath = (film: Film) => {
        return 'https://seng365.csse.canterbury.ac.nz/api/v1/users/' + film.directorId + '/image'
    }

    const getDirector = () => {
        return(
            <Card>
                <CardContent>
                    <Typography variant="body1">
                        Director: {film.directorFirstName} {film.directorLastName}
                    </Typography>
                </CardContent>
                <CardMedia
                    component="img"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        objectFit: "contain",
                        width: "30%",
                        height: "30%",
                        borderRadius: "50%",
                        margin: "auto",
                        textAlign: "center"
                    }}
                    image={getDirectorImagePath(film)}
                    alt="Director image not found"
                    onError={(e) => {
                        e.currentTarget.src = "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png";
                    }}
                />
            </Card>
        );
    }

    const getFileImagePath = () => {
        return 'https://seng365.csse.canterbury.ac.nz/api/v1/films/' + film.filmId + '/image'
    }





    return (
        <Card sx={userCardStyles}>
            <Link to={`/films/${film.filmId}`} style={{ textDecoration: "none" }}>
            <CardMedia
                component="img"
                sx={{ objectFit: "contain" }}
                image={getFileImagePath()}
                alt="Movie poster"
                onError={(e) => {
                    e.currentTarget.src = 'https://qph.cf2.quoracdn.net/main-qimg-1a4bafe2085452fdc55f646e3e31279c-lq';
                }}
            />
            <CardContent>
            <Typography variant="h4">
                {film.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                <FaFilm /> {film.ageRating}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Release date: {film.releaseDate.slice(0,10)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
               Genre: {getFilmGenre(film)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                {getDirector()}
            </Typography>
            <Typography component="legend">
                <p>Rating:</p>
                <Rating name="customized-10" value={film.rating||null} readOnly max={10} />
            </Typography>
            </CardContent>
            </Link>
        </Card> )
}

    export default FilmListObject