import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="container">
            <h1>404 - Page Not Found</h1>
            <img src="https://example.com/404-image.png" alt="404 Error" />
            <p>The page you are looking for does not exist.</p>
            <Link to="/">Return to Home</Link>
        </div>
    );
};

export default NotFound;