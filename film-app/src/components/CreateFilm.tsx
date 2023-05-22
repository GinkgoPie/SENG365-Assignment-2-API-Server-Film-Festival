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
    FilledTextFieldProps,
    OutlinedTextFieldProps,
    StandardTextFieldProps,
    TextFieldVariants,
    Alert, AlertTitle
} from '@mui/material';
import {useAuthStore} from '../store/authentication';
import {useGenresStore} from "../store/genre";
import axios from 'axios';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import NavigationBar from "./NavigationBar";
import {useNavigate} from "react-router-dom";
import NotFound from "./404NotFound";



interface Film {
    title: string;
    description: string;
    genreId: number;
    releaseDate?: String;
    ageRating?: string;
    runtime?: number;

}

const CreateFilm: React.FC = () => {
    const authentication = useAuthStore((state) => state.authentication);
    const userId = useAuthStore((state) => state.userId);
    const genres = useGenresStore(state => state.genres)
    const ageRatings: AgeRating[] = ['G', 'PG', 'M', 'R13', 'R16', 'R18'];
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [genreId, setGenre] = useState(-1);
    const [date, setDate] = useState<Date | null>(null);
    const [releaseDate, setReleaseDate] = useState<string | null>(null);
    const [ageRating, setAgeRating] = useState<string | null>(null);
    const [runtime, setRuntime] = useState<number | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [filmId, setFilmId] = useState(-1);
    const [error, setError] = useState('');
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const supportedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const navigate = useNavigate();


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

        // Perform validation on form data
        if (!title || !description || !genreId || !image) {
            setError('Please provide all required information.');
            return;
        }

        const imageFile = (event.target as HTMLFormElement)["filmImage"].files?.[0];
        const imageType = imageFile.type;
        if (!supportedImageTypes.includes(imageType)) {
            setErrorFlag(true);
            setErrorMessage('Please select an image file in JPEG, PNG, or GIF format.');
            return;
        }


        const film: Film = {
            title,
            description,
            genreId,

        };
        if (releaseDate!==null) {
            film.releaseDate = releaseDate
        }

        if (ageRating!==null) {
            film.ageRating = ageRating
        }

        if (runtime!==null) {
            film.runtime = runtime
        }




        axios
            .post(`https://seng365.csse.canterbury.ac.nz/api/v1/films`, film, {
                headers: {
                    'X-Authorization': authentication,
                },
            })
            .then((response) => {
                setFilmId(response.data.filmId);

                if (image) {
                    axios
                        .put(`https://seng365.csse.canterbury.ac.nz/api/v1/films/${response.data.filmId}/image`, image, {
                            headers: {
                                'X-Authorization': authentication,
                                'Content-Type': imageType
                            },
                        })
                        .then((response) => {
                            navigate(`/myFilms`);
                        })
                        .catch((error) => {
                            setErrorFlag(true);
                            setErrorMessage(error.response.statusText);
                        });
                }
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.response.statusText);
            });
    };
    if (authentication === '') {
        return <NotFound/>
    }
    return (
        <Paper elevation={3} style={{padding: '120px', maxWidth: '500px', margin: '0 auto'}}>
            <NavigationBar />
            <Typography variant="h5" component="div" style={{marginBottom: '20px'}}>
                Create a Film
            </Typography>
            <form onSubmit={handleFormSubmit}>
                <TextField
                    label="Title"
                    value={title}
                    onChange={handleTitleChange}
                    fullWidth
                    required
                    style={{marginBottom: '10px'}}
                />
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
                <TextField
                    label="Runtime"
                    type="number"
                    value={runtime}
                    onChange={handleRuntimeChange}
                    fullWidth
                    style={{ marginBottom: '10px' }}
                />
                <InputLabel id="genre-label" required>Genre</InputLabel>
                <Select
                    labelId="genre-label"
                    id="genre"
                    value={genreId}
                    onChange={handleGenreChange}
                    renderValue={(genre) =>
                        genres.find((eachGenre) => eachGenre.genreId === genreId)?.name
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
                <InputLabel id="age-rating-label">Age Rating</InputLabel>
                <Select
                    labelId="age-rating-label"
                    id="ageRating"
                    value={ageRating!}
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
                <div style={{ margin: '20px' }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Release Date"
                            value={date}
                            onChange={handleReleaseDateChange}
                        />
                    </LocalizationProvider>
                </div>

                <div style={{ margin: '30px' }}>
                    <label htmlFor="filmImage" >Image: </label>
                    <input
                        type="file"
                        id="filmImage"
                        name="filmImage"
                        accept="image/jpeg, image/png, image/gif"
                        onChange={handleImageChange}
                        required
                    />
                </div>
                {error && <Typography color="error" style={{ marginBottom: '10px' }}>{error}</Typography>}
                <Button type="submit" variant="contained" color="primary">
                    Create Film
                </Button>
            </form>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                {errorFlag ?
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                        {error}
                    </Alert>
                    : ""}
            </div>
        </Paper>
    );
};

export default CreateFilm;
