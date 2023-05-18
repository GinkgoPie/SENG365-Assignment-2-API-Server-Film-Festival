import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import CSS from 'csstype';

const NavigationBar: React.FC = () => {
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
        link.href =
            'https://fonts.googleapis.com/css2?family=Satisfy&display=swap';
        link.rel = 'stylesheet';

        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    return (
        <AppBar position="static" style={navigationStyles}>
            <Toolbar>
                <Typography variant="h6" component="div" style={{ fontFamily: 'Satisfy, cursive', flexGrow: 1  }}>
                    Name TBD
                </Typography>
                <Button component={Link} to="/films" color="inherit">
                    Films
                </Button>
                <Button component={Link} to="/register" color="inherit">
                    Sign up
                </Button>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavigationBar;
