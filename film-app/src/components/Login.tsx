import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {Paper, Card, CardContent, TextField, Button, Alert, AlertTitle} from '@mui/material';
import NavigationBar from "./NavigationBar";
import CSS from "csstype";
import {useAuthStore} from "../store/authentication";
import axios from "axios";
import {useFilmStore} from "../store/film";
import NotFound from "./404NotFound";

interface User {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const authentication = useAuthStore(state => state.authentication)
    const setAuthentication = useAuthStore(state => state.setAuthentication)
    const userId = useAuthStore(state => state.userId)
    const setUserId = useAuthStore(state => state.setUserId)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [postForm, setPostForm] = React.useState(false)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const navigate = useNavigate();



    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPostForm(true);

        if (email && password) {
            const user: User = {
                email,
                password,
            };

        } else {
            setError('Please provide both email and password.');
        }
    };

    useEffect(() => {
        if (authentication === '' && postForm) {
            setPostForm(false);
            const loginData = { email: email, password: password }
            const postLoginForm = () => {
                let url = 'http://localhost:4941/api/v1/users/login'
                axios.post(url, loginData)
                    .then((response) => {
                        setAuthentication(response.data.token)
                        setUserId(response.data.userId)
                        navigate('/myProfile');
                    }, (error) => {
                        setErrorFlag(true)
                        setErrorMessage(error.response.statusText)
                    }) }
            postLoginForm()
        }
    }, [handleFormSubmit]);

    const loginCardStyles: CSS.Properties = {
        display: "inline-block",
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '30%',
        height: '60%',
        margin: '20 auto',
        padding: "50px",
        textAlign: "center"
    }
    const loginData = { email: email, password: password }
    if (authentication !== '') {
        return <NotFound/>
    }

    return (

        <Paper elevation={3} style={{ padding: '150px' }}>
            <NavigationBar />
            <Card sx={loginCardStyles}>
                <CardContent>
                    <h1>Login</h1>
                    <form onSubmit={handleFormSubmit}>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <TextField
                                label="Email"
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleEmailChange}
                                fullWidth
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <TextField
                                label="Password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={handlePasswordChange}
                                fullWidth
                                required
                            />
                        </div>
                        {error && <p>{error}</p>}
                        <Button type="submit">Login</Button>
                        <p>{authentication}</p>
                    </form>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                        {errorFlag ?
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                {errorMessage}
                            </Alert>: ""}
                    </div>
                </CardContent>
            </Card>
        </Paper>
    );
};

export default LoginPage;
