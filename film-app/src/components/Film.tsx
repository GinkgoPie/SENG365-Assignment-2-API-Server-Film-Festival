import React, {useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {Delete, Edit} from "@mui/icons-material";
import {useFilmStore} from "../store/film";
import {useGenresStore} from "../store/genre";
import {useUsersStore} from "../store/user";
import NotFound from "./404NotFound"
import {
    Alert, AlertTitle,
    Button, Card, CardActions, CardContent, CardMedia, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, IconButton, Paper, Rating, TextField, Typography
} from "@mui/material";
import CSS from 'csstype';
import { FaFilm } from 'react-icons/fa';
import LoadingPage from "./Loading";
import FilmListObject from "./FilmListObject";
interface IFilmProps {
    filmFull: FilmFull
}

interface IGenreProps {
    genre: Genre
}


const FilmPage = () => {
    const { id } = useParams();
    const [filmFull, setFilmFull] = React.useState<FilmFull>();
    const genres = useGenresStore(state => state.genres)
    const [reviews, setReviews] = React.useState<Review[]>();
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [openEditDialog, setOpenEditDialog] = React.useState(false)
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const films = useFilmStore(state => state.films)
    const setFilms = useFilmStore(state => state.setFilms)
    React.useEffect(() => {
        const getFilmFull = () => {
            let url = 'https://seng365.csse.canterbury.ac.nz/api/v1/films/' + id

            axios.get(url)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setFilmFull(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(url)
                }) }
        getFilmFull()
    }, [id, filmFull])

    React.useEffect(() => {
        const getReviews = () => {
            let url = 'https://seng365.csse.canterbury.ac.nz/api/v1/films/' + id + '/reviews'

            axios.get(url)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setReviews(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(url)
                }) }
        getReviews()
    }, [id])

    const userCardStyles: CSS.Properties = {
        display: "inline-block",
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '70%',
        height: '60%',
        margin: '0 auto',
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

    const getDirectorImagePath = (filmFull: FilmFull) => {
        return 'https://seng365.csse.canterbury.ac.nz/api/v1/users/' + filmFull.directorId + '/image'
    }

    const getDirector = () => {
        if (filmFull === undefined) {
            return <p>Director not found.</p>
        } else {
            return (
                <Card>
                    <CardContent>
                        <Typography variant="body1">
                            Director: {filmFull.directorFirstName} {filmFull.directorLastName}
                        </Typography>
                    </CardContent>
                    <CardMedia
                        component="img"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            objectFit: "contain",
                            width: "15%",
                            height: "15%",
                            borderRadius: "50%",
                            margin: "auto",
                            textAlign: "center"
                        }}
                        image={getDirectorImagePath(filmFull)}
                        alt="Director image not found"
                        onError={(e) => {
                            e.currentTarget.src = "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png";
                        }}
                    />
                </Card>
            );
        }
    }

    const getFileImagePath = () => {
        return 'https://seng365.csse.canterbury.ac.nz/api/v1/films/' + filmFull?.filmId + '/image'
    }

    const getSimilarFilms = () => {
        const similarFilms =  films.filter(film => film.filmId !== filmFull?.filmId && (film.genreId === filmFull?.genreId || film.directorId === filmFull?.directorId));
        return similarFilms.map((film: Film) => {
                return <FilmListObject key={film.filmId} film={film} />;
            })
    };


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function getReviewsContent() {
        return (
            <table>
                <thead>
                <tr>
                    <th>Reviewer</th>
                    <th>Name</th>
                    <th>Rating</th>
                    <th>Comment</th>
                </tr>
                </thead>
                <tbody>
                {reviews?.map((review, index) => (
                    <tr key={index}>
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
                                textAlign: "center",
                                padding: '20px'
                            }}
                            image={'https://seng365.csse.canterbury.ac.nz/api/v1/users/' + review.reviewerId + '/image'}
                            alt="Reviewer image not found"
                            onError={(e) => {
                                e.currentTarget.src = "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png";
                            }}
                        />
                        <td style={{ padding: '30px'  }}>{review.reviewerFirstName} {review.reviewerLastName}</td>
                        <td style={{ padding: '30px'  }}><Rating name="customized-10" value={review.rating||null} readOnly max={10} /></td>
                        <td style={{ padding: '30px'  }}>{review.review}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    if (isLoading) {
        return <LoadingPage />;
    }
    if (filmFull === undefined) {
        return <NotFound />;
    } else {
        return (
            <Paper elevation={3} style={{ padding: '20px' }}>
                <Card sx={userCardStyles}>
                    <CardMedia
                        component="img"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            objectFit: 'contain',
                            width: '100%',
                            height: '100%',}}
                        image={getFileImagePath()}
                        alt="Movie poster"
                        onError={(e) => {
                            e.currentTarget.src = 'https://qph.cf2.quoracdn.net/main-qimg-1a4bafe2085452fdc55f646e3e31279c-lq';
                        }}
                    />
                    <CardContent>
                        <Typography variant="h4">
                            {filmFull.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            <FaFilm /> {filmFull.ageRating}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Release date: {filmFull.releaseDate.slice(0,10)}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Genre: {getFilmGenre(filmFull)}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {getDirector()}
                        </Typography>
                        <Typography component="legend">
                            <p>Rating:</p>
                            <Rating name="customized-10" value={filmFull.rating||null} readOnly max={10} />
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Description: {filmFull.description}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            <Button onClick={handleOpen}>{filmFull.numReviews} reviews</Button>
                            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                                <DialogTitle>Reviews</DialogTitle>
                                <DialogContent>
                                    <Typography variant="body1" color="text.secondary">
                                        {getReviewsContent()}
                                    </Typography>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose}>Close</Button>
                                </DialogActions>
                            </Dialog>
                        </Typography>
                    </CardContent>
                </Card>
                <Typography variant="h4" color="text.secondary" padding='20px'>
                    Films you might like...
                </Typography>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                    {errorFlag ?
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>
                        : ""}
                    {getSimilarFilms()}
                </div>

            </Paper>)
    }
}

export default FilmPage