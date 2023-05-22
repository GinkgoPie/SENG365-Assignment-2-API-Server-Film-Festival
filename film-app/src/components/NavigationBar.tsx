import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import CSS from 'csstype';
import { useAuthStore } from '../store/authentication';

const NavigationBar: React.FC = () => {
    const authentication = useAuthStore((state) => state.authentication);
    const setAuthentication = useAuthStore((state) => state.setAuthentication);
    const isAuthenticated = authentication !== '';
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const onLogout = () => {
        setAuthentication('');
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
                    Name TBD
                </Typography>
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
