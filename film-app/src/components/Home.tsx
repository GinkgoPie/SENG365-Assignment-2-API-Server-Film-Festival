import React from 'react';
import NavigationBar from './NavigationBar';
import { Paper, Typography } from '@mui/material';
import CSS from 'csstype';

const Home: React.FC = () => {
    const videoPath = `${process.env.PUBLIC_URL}/Film/homePage.mp4`;

    const containerStyles: CSS.Properties = {
        position: 'relative',
    };

    const card: CSS.Properties = {

        display: 'block',
        width: '100%',
        height: '100vh', // Adjusted height to cover the entire screen
        position: 'relative', // Added position property
    };

    const textStyles: CSS.Properties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        textAlign: 'center',
        fontFamily: 'Lobster, cursive',
        fontWeight: 400, // Adjust the font weight as needed
        fontSize: '3rem', // Adjust the font size as needed
    };

    React.useEffect(() => {
        // Load the Lobster font asynchronously
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Lobster&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        return () => {
            // Clean up by removing the added link when the component is unmounted
            document.head.removeChild(link);
        };
    }, []);

    return (
        <div style={containerStyles}>
            <NavigationBar />
            <Paper elevation={3} style={card}>
                <video
                    autoPlay
                    loop
                    muted
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                >
                    <source src={videoPath} type="video/mp4" />
                </video>
                <div style={textStyles}>
                    <Typography variant="h5" color="text.secondary" style={{ fontFamily: 'Lobster, cursive' }}>
                        <p>Discover and explore the world of movies</p>
                    </Typography>
                </div>
            </Paper>
        </div>
    );
};

export default Home;
