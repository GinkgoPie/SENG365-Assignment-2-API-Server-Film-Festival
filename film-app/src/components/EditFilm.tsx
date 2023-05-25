import React, { useState } from 'react';
import {
    Paper,
    TextField,
    Button,
    Typography,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Alert, AlertTitle, CardMedia
} from '@mui/material';
import {useAuthStore} from '../store/authentication';
import {useGenresStore} from "../store/genre";
import axios from 'axios';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import NavigationBar from "./NavigationBar";
import {useNavigate, useParams} from "react-router-dom";
import NotFound from "./404NotFound";
import CSS from "csstype";




interface PatchFilm {
    title?: string;
    description?: string;
    genreId?: number;
    releaseDate?: string;
    ageRating?: string;
    runtime?: number;

}

const EditFilm: React.FC = () => {
    const { id } = useParams();
    const [filmFull, setFilmFull] = React.useState<FilmFull>();
    const patchFilm : PatchFilm = {};
    const authentication = useAuthStore((state) => state.authentication);
    const genres = useGenresStore(state => state.genres)
    const ageRatings: AgeRating[] = ['G', 'PG', 'M', 'R13', 'R16', 'R18'];
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [genreId, setGenre] = useState(-1);
    const [date, setDate] = useState<Date | null>(null);
    const [releaseDate, setReleaseDate] = useState<string|null>();
    const [ageRating, setAgeRating] = useState<string>('');
    const [numReviews,setNumReviews] = useState<number>();
    const [runtime, setRuntime] = useState<number | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const supportedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const navigate = useNavigate();
    const [validationErrors, setValidationErrors] = useState({
        title: '',
        description: '',
        genreId: '',
        releaseDate: '',
        ageRating:'',
        runtime: '',
        image: ''
    });



    React.useEffect(() => {
        const getFilmFull = () => {
            let url = 'https://seng365.csse.canterbury.ac.nz/api/v1/films/' + id

            axios.get(url)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setFilmFull(response.data)
                    setDescription(response.data.description)
                    setTitle(response.data.title)
                    setAgeRating(response.data.ageRating)
                    setGenre(response.data.genreId)
                    setRuntime(response.data.runtime)
                    setNumReviews(response.data.numReviews)
                    setReleaseDate(response.data.releaseDate)
                    setDate(new Date(response.data.releaseDate))
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                    navigate('/404NotFound');
                }) }
        getFilmFull()
    }, [])

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    const handleGenreChange = (event: SelectChangeEvent<number>) => {
        const selected = event.target.value as number;
        setGenre(selected);
    };
    function formatDate(date: Date): string {
        const year = date.getFullYear().toString().padStart(4, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }



    const handleReleaseDateChange = (date: Date | null) => {
        setReleaseDate(formatDate(date!));
    };

    const handleAgeRatingChange = (event: SelectChangeEvent<string>) => {
        setAgeRating(event.target.value as string);
    };

    const handleRuntimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRuntime(Number(event.target.value));
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setImage(event.target.files[0]);
        }
    };






    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();


        const newErrors = {
            title: '',
            description: '',
            genreId: '',
            releaseDate: '',
            ageRating:'',
            runtime: '',
            image: ''
        }


        if (image && !supportedImageTypes.includes(image.type)) {
            newErrors.image='Please select an image file in JPEG, PNG, or GIF format.';
        }

        if (title && title !== filmFull?.title){
            patchFilm.title = title;
        }

        if (description && description !== filmFull?.description){
            patchFilm.description = description;
        }

        if (runtime && runtime !== filmFull?.runtime){
            patchFilm.runtime = runtime;
        }

        if (genreId && genreId !== filmFull?.genreId){
            patchFilm.genreId = genreId;
        }

        if (ageRating && ageRating !== filmFull?.ageRating){
            patchFilm.ageRating = ageRating;
        }

        if (releaseDate && releaseDate !== filmFull?.releaseDate){
            patchFilm.releaseDate = releaseDate;
        }


        setValidationErrors(newErrors);
        if (Object.values(newErrors).every(value => value === '')) {
            axios
                .patch(`https://seng365.csse.canterbury.ac.nz/api/v1/films/`+ id, patchFilm, {
                    headers: {
                        'X-Authorization': authentication,
                    },
                })
                .then(() => {

                    if (image) {
                        axios
                            .put(`https://seng365.csse.canterbury.ac.nz/api/v1/films/${id}/image`, image, {
                                headers: {
                                    'X-Authorization': authentication,
                                    'Content-Type': image.type
                                },
                            })
                            .then(() => {
                                navigate(`/films/${id}`);
                            })
                            .catch((error) => {
                                setErrorFlag(true);
                                setErrorMessage(error.response.statusText);
                            });
                    }
                    navigate(`/films/${id}`);
                })
                .catch((error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.response.statusText);
                });

        }



    };


    if (authentication === '') {
        return <NotFound/>
    }
    return (
        <Paper elevation={3} style={{padding: '120px', maxWidth: '500px', margin: '0 auto'}}>
            <NavigationBar />
            <Typography variant="h5" component="div" style={{marginBottom: '20px'}}>
                Edit Film
            </Typography>
            <CardMedia
                    component="img"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        objectFit: 'contain',
                        width: '100%',
                        height: '100%',
                        margin: '50px'}}
                    image={'https://seng365.csse.canterbury.ac.nz/api/v1/films/' + id + '/image'}
                    alt="Movie poster"
                    onError={(e) => {
                        e.currentTarget.src = 'https://qph.cf2.quoracdn.net/main-qimg-1a4bafe2085452fdc55f646e3e31279c-lq';
                    }}
                />

            <form onSubmit={handleFormSubmit}>
                <TextField
                    label="Title"
                    value={title}
                    onChange={handleTitleChange}
                    fullWidth
                    required
                    style={{marginBottom: '10px'}}
                />
                {validationErrors.title && <span style={{ color: 'red' }}>{validationErrors.title}</span>}
                <TextField
                    label="Description"
                    value={description}
                    onChange={handleDescriptionChange}
                    multiline
                    rows={4}
                    fullWidth
                    required
                    style={{marginBottom: '10px'}}
                />
                {validationErrors.description && <span style={{ color: 'red' }}>{validationErrors.description}</span>}
                <TextField
                    label="Runtime"
                    type="number"
                    value={runtime}
                    onChange={handleRuntimeChange}
                    fullWidth
                    style={{ marginBottom: '10px' }}
                />
                {validationErrors.runtime && <span style={{ color: 'red' }}>{validationErrors.runtime}</span>}
                <InputLabel id="genre-label" required>Genre</InputLabel>
                <Select
                    labelId="genre-label"
                    id="genre"
                    value={genreId}
                    onChange={handleGenreChange}
                    renderValue={() =>
                        genres.find((eachGenre) => eachGenre.genreId === filmFull?.genreId)?.name
                    }
                    fullWidth
                    required
                    style={{ marginBottom: '10px' }}
                >
                    {genres.map((genre) => (
                        <MenuItem key={genre.genreId} value={genre.genreId}>
                            {genre.name}
                        </MenuItem>
                    ))}
                </Select>
                {validationErrors.genreId && <span style={{ color: 'red' }}>{validationErrors.genreId}</span>}

                <InputLabel id="age-rating-label">Age Rating</InputLabel>
                <Select
                    labelId="age-rating-label"
                    id="ageRating"
                    value={ageRating}
                    onChange={handleAgeRatingChange}
                    fullWidth
                    style={{ marginBottom: '10px' }}
                >
                    {ageRatings.map((ageRating) => (
                        <MenuItem key={ageRating} value={ageRating}>
                            {ageRating}
                        </MenuItem>
                    ))}
                </Select>
                {validationErrors.ageRating && <span style={{ color: 'red' }}>{validationErrors.ageRating}</span>}

                <div style={{ margin: '20px' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Release Date"
                            value={date}
                            onChange={handleReleaseDateChange}
                        />
                    </LocalizationProvider>
                </div>
                {validationErrors.releaseDate && <span style={{ color: 'red' }}>{validationErrors.releaseDate}</span>}
                <div style={{ margin: '30px' }}>
                    <label htmlFor="filmImage" >Update film image: </label>
                    <input
                        type="file"
                        id="filmImage"
                        name="filmImage"
                        accept="image/jpeg, image/png, image/gif"
                        onChange={handleImageChange}
                    />
                </div>
                {validationErrors.image && <span style={{ color: 'red' }}>{validationErrors.image}</span>}
                <Button type="submit" variant="contained" color="primary">
                    Edit Film
                </Button>
            </form>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                {errorFlag ?
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                    : ""}
            </div>
        </Paper>
    );
};

export default EditFilm;
