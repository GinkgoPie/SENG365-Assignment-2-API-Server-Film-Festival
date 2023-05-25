import React, { useEffect } from 'react';
import axios from 'axios';
import {useAuthStore} from "../store/authentication";
import NotFound from "./404NotFound"
import {
    Alert, AlertTitle,
    Button,
    Card,
    CardContent,
    CardMedia,
    Paper,
    Typography
} from "@mui/material";
import NavigationBar from "./NavigationBar";
import {FaFilm} from "react-icons/fa";
import CSS from "csstype";
import LoadingPage from "./Loading";
import {Link} from "react-router-dom";


const UserProfilePage: React.FC = () => {
    const authentication = useAuthStore(state => state.authentication)
    const userId = useAuthStore(state => state.userId)
    const setUserId = useAuthStore(state => state.setUserId)
    const email = useAuthStore(state => state.email)
    const setEmail = useAuthStore(state => state.setEmail)
    const firstName = useAuthStore(state => state.firstName)
    const setFirstName = useAuthStore(state => state.setFirstName)
    const lastName = useAuthStore(state => state.lastName)
    const setLastName = useAuthStore(state => state.setLastName)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        if (authentication !== '') {

            const getUserInfo = () => {
                axios.get('https://seng365.csse.canterbury.ac.nz/api/v1/users/' + userId, {
                    headers: {
                        'X-Authorization': authentication,
                    },})
                    .then((response) => {
                        setEmail(response.data.email);
                        setFirstName(response.data.firstName);
                        setLastName(response.data.lastName);
                    }, (error) => {
                        setErrorFlag(true)
                        setErrorMessage(error.response.statusText)
                    }) }
            getUserInfo()
        }
    }, []);

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

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => {
            clearTimeout(timer);
        };
    }, []);


    if (errorFlag || authentication ==='') {
        return <NotFound />
    }

    if (isLoading) {
        return <LoadingPage />;
    }  else {
        return (
            <Paper elevation={3} style={{padding: '20px'}}>
                <NavigationBar/>
                <Card sx={userCardStyles}>
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
                        image={`https://seng365.csse.canterbury.ac.nz/api/v1/users/${userId}/image`}
                        alt="Movie poster"
                        onError={(e) => {
                            e.currentTarget.src = "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png";
                        }}
                    />
                    <CardContent>
                        <Typography variant="h4">
                            First name: {firstName}
                        </Typography>
                        <Typography variant="h4">
                            Last Name: {lastName}
                        </Typography>
                        <Typography variant="h4">
                            Email: {email}
                        </Typography>
                    </CardContent>
                    <Button component={Link} to="/editProfile" sx={{ backgroundColor: 'gray', color: 'white' }}>
                        Edit my profile
                    </Button>
                </Card>
                <div style={{display: "flex", flexWrap: "wrap", justifyContent: "flex-start"}}>
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

};


export default UserProfilePage;
