import React, { useEffect, useState } from 'react';
import {AppBar, Toolbar, Typography, Button, Menu, MenuItem, Alert, AlertTitle} from '@mui/material';
import { Link } from 'react-router-dom';
import CSS from 'csstype';
import { useAuthStore } from '../store/authentication';
import axios from 'axios';

const NavigationBar: React.FC = () => {
    const authentication = useAuthStore((state) => state.authentication);
    const setAuthentication = useAuthStore((state) => state.setAuthentication);
    const setUserId = useAuthStore((state) => state.setUserId);
    const setEmail = useAuthStore((state) => state.setEmail);
    const setFirstName = useAuthStore((state) => state.setFirstName);
    const setLastName = useAuthStore((state) => state.setLastName);
    const isAuthenticated = authentication !== '';
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const onLogout = () => {

        axios
            .post(`http://localhost:4941/api/v1/users/logout`,{}, {
                headers: {
                    'X-Authorization': authentication,
                },
            })
            .then(() => {
                console.log('Log out successfully')
                setAuthentication('');
                setUserId(-1);
                setEmail('');
                setFirstName('');
                setLastName('');
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.response.statusText);
            });

    };

    const navigationStyles: CSS.Properties = {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 2,
        background: 'linear-gradient(45deg, #F4EEE0, #393646)',
        fontFamily: 'Satisfy, cursive',
    };

    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Satisfy&display=swap';
        link.rel = 'stylesheet';

        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    return (
        <AppBar position="static" style={navigationStyles}>
            <Toolbar>
                <Typography variant="h6" component="div" style={{ fontFamily: 'Satisfy, cursive', flexGrow: 1 }}>
                    Film Festival
                </Typography>
                {errorFlag ?
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                    : ""}
                <Button component={Link} to="/films" color="inherit">
                    Films
                </Button>
                {!isAuthenticated && (
                    <>
                        <Button component={Link} to="/register" color="inherit">
                            Sign up
                        </Button>
                        <Button component={Link} to="/login" color="inherit">
                            Login
                        </Button>
                    </>
                )}
                {isAuthenticated && (
                    <>
                        <Button onClick={handleMenuOpen} color="inherit">
                            Dashboard
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <MenuItem component={Link} to="/myProfile" onClick={handleMenuClose}>
                                My Profile
                            </MenuItem>
                            <MenuItem component={Link} to="/createFilm" onClick={handleMenuClose}>
                                Create a Film
                            </MenuItem>
                            <MenuItem component={Link} to="/myFilms" onClick={handleMenuClose}>
                                My Films
                            </MenuItem>
                        </Menu>
                        <Button onClick={onLogout} component={Link} to="/" color="inherit">
                            Log out
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavigationBar;
