import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {Delete, Edit} from "@mui/icons-material";
import {useFilmStore} from "../store/film";
import {useGenresStore} from "../store/genre";
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
import NavigationBar from "./NavigationBar";
import {useAuthStore} from "../store/authentication";


interface MyReview {
    rating: number;
    review?: string;

}


const FilmPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const authentication = useAuthStore((state) => state.authentication);
    const userId = useAuthStore((state) => state.userId);
    const [filmFull, setFilmFull] = React.useState<FilmFull>();
    const genres = useGenresStore(state => state.genres)
    const [reviews, setReviews] = React.useState<Review[]>();
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('')
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [openEditDialog, setOpenEditDialog] = React.useState(false)
    const [openReviewDialog, setOpenReviewDialog] = React.useState(false)
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const films = useFilmStore(state => state.films)
    const deleteFilmFromStore = useFilmStore((state) => state.removeFilm);
    const [rating, setRating] = React.useState<number | null>(null)
    const [review, setReview] = React.useState<string | null>(null)
    const [reviewErrorFlag, setReviewErrorFlag] = React.useState(false)
    const [reviewErrorMessage, setReviewErrorMessage] = React.useState('')

    const ReviewFilm = () => {
        if (rating === null) {
            setReviewErrorFlag(true);
            setReviewErrorMessage('You must enter a valid rating')
            return
        }

        const myReview: MyReview = {
            rating
        }
        if (review !== null) {
            myReview.review = review
        }

        axios
            .post(`http://localhost:4941/api/v1/films/${id}/reviews`, myReview, {
                headers: {
                    'X-Authorization': authentication
                },
            })
            .then(() => {
                setOpenReviewDialog(false)
                setReviewErrorFlag(false)
                window.location.reload();
            })
            .catch((error) => {
                setReviewErrorFlag(true);
                setReviewErrorMessage(error.response.statusText);
            });


    }

    const handleReviewClick = (event: React.MouseEvent) => {
        if (authentication === '') {
            setErrorFlag(true);
            setErrorMessage('Please login or sign up first to review.')
        }else{
            event.stopPropagation();
            setOpenReviewDialog(true);
        }

    };


    React.useEffect(() => {
        const getFilmFull = () => {
            let url = 'http://localhost:4941/api/v1/films/' + id

            axios.get(url)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setFilmFull(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                    navigate('/404NotFound');
                }) }
        getFilmFull()
    }, [id])

    React.useEffect(() => {
        const getReviews = () => {
            let url = 'http://localhost:4941/api/v1/films/' + id + '/reviews'

            axios.get(url)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setReviews(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString() )
                }) }
        getReviews()
    }, [id, handleReviewClick])

    const userCardStyles: CSS.Properties = {
        display: "inline-block",
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '70%',
        height: '60%',
        margin: '0 auto',
        padding: "80px",
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
        return 'http://localhost:4941/api/v1/users/' + filmFull.directorId + '/image'
    }

    const getDirector = () => {
        if (filmFull === undefined) {
            return <div><p>Director not found.</p></div>
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
        return 'http://localhost:4941/api/v1/films/' + filmFull?.filmId + '/image'
    }

    const getSimilarFilms = () => {
        const similarFilms =  films.filter(film => film.filmId !== filmFull?.filmId && (film.genreId === filmFull?.genreId || film.directorId === filmFull?.directorId));
        return similarFilms.map((film: Film) => {
                return <FilmListObject key={film.filmId} film={film} />;
            })
    };

    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
    };

    const handleReviewDialogClose = () => {
        setOpenReviewDialog(false);
    };





    const handleDeleteClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setOpenDeleteDialog(true);
    };


    const handleEditClick = (event?: React.MouseEvent) => {
        if (event) {
            event.stopPropagation();
        }
        if (filmFull!.numReviews >= 1 ) {
            window.alert("Cannot edit a film that has been reviewed!");
            window.close();
            return
        }
        if (filmFull!.releaseDate < new Date().toISOString()) {
            window.alert("Cannot edit a film that has been released!");
            window.close();
            return
        }
        navigate(`/editFilm/${filmFull?.filmId}`);
    };



    const deleteFilm = () => {
        setOpenDeleteDialog(false);
        const confirmDelete = window.confirm("Are you sure about deleting this film?");



        if (confirmDelete) {
            if (filmFull?.numReviews === 0 && filmFull!.releaseDate > new Date().toISOString()) {
                window.alert("Cannot delete a film that has not been released with 0 review !\"");
                window.close();
                return
            }
            axios
                .delete(
                    `http://localhost:4941/api/v1/films/`+id,
                    {
                        headers: {
                            "X-Authorization": authentication,
                        },
                    }
                )
                .then(() => {
                    const film:Film = filmFull!
                    deleteFilmFromStore(film);
                    navigate('/myFilms');
                })
                .catch((error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.response.statusText);
                });
        }
    };


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function getReviewsContent() {
        if (reviews?.length === 0) {
            return (<th>No reviews yet.</th>)
        }
        return (
            <table>
                <thead>
                <tr>
                    <th>Reviewer</th>
                    <th>Name</th>
                    <th>Rating</th>handleEditClick
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
                            image={'http://localhost:4941/api/v1/users/' + review.reviewerId + '/image'}
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
        }, 800);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRating(Number(event.target.value));
    };

    const handleReviewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReview(event.target.value);
    };




    if (isLoading) {
        return <LoadingPage />;
    }  else {
        return (
            <Paper elevation={3} style={{ padding: '20px' }}>
                <NavigationBar />
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
                            {filmFull?.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            <FaFilm /> {filmFull?.ageRating}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Release date: {filmFull?.releaseDate.slice(0,10)}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Genre: {getFilmGenre(filmFull!)}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {getDirector()}
                        </Typography>
                        <Typography component="legend">
                            <p>Rating:</p>
                            <Rating name="customized-10" value={filmFull?.rating||null} readOnly max={10} />
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Description: {filmFull?.description}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            <Button onClick={handleOpen}>{filmFull?.numReviews} reviews</Button>
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
                        {userId !== filmFull?.directorId &&(
                            <Button color="primary" onClick={handleReviewClick}>
                                Add review
                            </Button>
                        )}
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                            {errorFlag &&
                                <Alert severity="error">
                                    <AlertTitle>Error</AlertTitle>
                                    {errorMessage}
                                </Alert>}
                        </div>
                    </CardContent>
                    <CardActions>
                        {userId === filmFull?.directorId && (
                            <IconButton color="error" onClick={handleDeleteClick}>
                                <Delete />
                            </IconButton>
                        )}
                        {userId === filmFull?.directorId && (
                            <IconButton color="primary" onClick={handleEditClick}>
                                <Edit />
                            </IconButton>
                        )}
                    </CardActions>
                    {/* Add review Dialog */}
                    <Dialog
                        open={openReviewDialog}
                        onClose={handleReviewDialogClose}
                        maxWidth="sm"
                        fullWidth
                    >
                        <DialogTitle>Add a review</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="rating"
                                label="Rating (1-10)"
                                type="number"
                                onChange={handleRatingChange}
                                inputProps={{ min: 0, max: 10 }}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="comment"
                                label="Comment"
                                onChange={handleReviewChange}
                                multiline
                                rows={4}
                                fullWidth
                            />
                            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                                {reviewErrorFlag &&
                                    <Alert severity="error">
                                        <AlertTitle>Error</AlertTitle>
                                        {reviewErrorMessage}
                                    </Alert>}
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleReviewDialogClose}>Cancel</Button>
                            <Button onClick={ReviewFilm} color="error">
                                Post
                            </Button>
                        </DialogActions>
                    </Dialog>
                    {/* Delete Dialog */}
                    <Dialog
                        open={openDeleteDialog}
                        onClose={handleDeleteDialogClose}
                        maxWidth="sm"
                        fullWidth
                    >
                        <DialogTitle>Delete Film</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete the film?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                            <Button onClick={deleteFilm} color="error">
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Card>
                <Typography variant="h4" color="text.secondary" padding='20px'>
                    Films you might like...
                </Typography>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                    {getSimilarFilms()}
                </div>

            </Paper>)
    }
}

export default FilmPage