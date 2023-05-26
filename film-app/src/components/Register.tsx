import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, Button, Card, CardContent, Paper, TextField } from '@mui/material';
import CSS from 'csstype';
import axios from "axios";
import NavigationBar from "./NavigationBar";
import { useAuthStore } from "../store/authentication";
import {Link, useNavigate} from "react-router-dom";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [postForm, setPostForm] = React.useState(false)
    const authentication = useAuthStore(state => state.authentication)
    const setAuthentication = useAuthStore(state => state.setAuthentication)
    const userId = useAuthStore(state => state.userId)
    const setUserId = useAuthStore(state => state.setUserId)
    const [registerSuccess, setRegisterSuccess] = React.useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imageType, setImageType] = useState<any | null>(null);
    const supportedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            const file = files?.[0] || null;
            if (file) {
                const fileReader = new FileReader();
                fileReader.onloadend = () => {
                    setImage(file);
                    setImageType(file.type);
                };
                fileReader.readAsDataURL(file);
            } else {
                setImage(null);
                setImageType(null);
            }
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const isValidEmail = (email: string) => {
        // Simple email validation regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Perform validation
        const newErrors = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            image: '',
        };

        if (formData.firstName.trim() === '') {
            newErrors.firstName = 'First name is required';
        }

        if (formData.lastName.trim() === '') {
            newErrors.lastName = 'Last name is required';
        }

        if (formData.email.trim() === '') {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (formData.password.trim() === '') {
            newErrors.password = 'Password is required';
        }

        if (formData.confirmPassword.trim() === '') {
            newErrors.confirmPassword = 'Confirm password is required';
        } else if (formData.password.trim().length < 6) {
            newErrors.confirmPassword = 'Passwords should be at least 6 characters long';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }


        if (image && !supportedImageTypes.includes(imageType)) {
            newErrors.image = 'Please select an image file in JPEG, PNG, or GIF format.';
        }


        // Update errors state
        setErrors(newErrors);

        // If there are no errors, perform form submission
        if (Object.values(newErrors).every(value => value === '')) {
            // Perform registration logic here
            console.log('Form submitted successfully');
            let url = 'http://localhost:4941/api/v1/users/register'
            const { confirmPassword, ...formDataWithoutConfirmPassword } = formData;
            axios.post(url, formDataWithoutConfirmPassword)
                .then((response) => {
                    console.log(response);
                    setUserId(response.data.userId)
                    const loginData = { email: formData.email, password: formData.password }
                    let url = 'http://localhost:4941/api/v1/users/login'
                    axios.post(url, loginData)
                        .then((response) => {
                            console.log('Logging in successfully');
                            setAuthentication(response.data.token)
                            setUserId(response.data.userId)
                            if (image !== null) {
                                console.log('Try profile upload');

                                axios
                                    .put(`http://localhost:4941/api/v1/users/${response.data.userId}/image`, image, {
                                        headers: {
                                            'X-Authorization': response.data.token,
                                            'Content-Type': imageType
                                        },
                                    })
                                    .then((response) => {
                                        console.log('Put profile successfully');
                                        navigate(`/myProfile`);
                                    })
                                    .catch((error) => {
                                        setErrorFlag(true);
                                        setErrorMessage(error.response.statusText);
                                    });
                            }
                            navigate(`/myProfile`);
                        }, (error) => {
                            setErrorFlag(true)
                            setErrorMessage(error.response.statusText)
                        })

                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.response.statusText)
                })

        }
    };

    const containerStyles: CSS.Properties = {
        display: 'grid',
        gap: '1rem',
    };

    const registerCardStyles: CSS.Properties = {
        display: "inline-block",
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '30%',
        height: '60%',
        margin: '20 auto',
        padding: "50px",
        textAlign: "center"
    };

    return (
        <Paper elevation={3} style={{ padding: '150px' }}>
            <NavigationBar />
            <Card sx={registerCardStyles}>
                <CardContent>
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={containerStyles}>
                            <TextField
                                label="First Name"
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            {errors.firstName && <span>{errors.firstName}</span>}

                            <TextField
                                label="Last Name"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            {errors.lastName && <span>{errors.lastName}</span>}

                            <TextField
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            {errors.email && <span>{errors.email}</span>}

                            <TextField
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                fullWidth
                                required
                            />

                            <TextField
                                label="Confirm Password"
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
                            <Button onClick={togglePasswordVisibility}>
                                {showPassword ? 'Hide Password' : 'Show Password'}
                            </Button>
                            {errors.password && <span>{errors.password}</span>}
                            <div style={{ margin: '30px' }}>
                                <label htmlFor="filmImage">Profile image: </label>
                                <input
                                    type="file"
                                    id="filmImage"
                                    name="filmImage"
                                    accept="image/jpeg, image/png, image/gif"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <Button type="submit" variant="contained" sx={{ margin: "25px 5px", backgroundColor: "#025464", color: '#ffffff' }}>
                            Register
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

                </CardContent>
            </Card>
        </Paper>
    );
};

export default RegisterPage;
