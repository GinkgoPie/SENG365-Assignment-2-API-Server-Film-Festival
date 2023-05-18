import React, { useState } from 'react';
import {Button, Card, CardContent, Paper, TextField} from '@mui/material';
import CSS from 'csstype';
import axios from "axios";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePicture: null,
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

    React.useEffect(() => {
        const postRegisterForm = () => {
            let url = 'https://seng365.csse.canterbury.ac.nz/api/v1/users/register'
            const { confirmPassword, ...formDataWithoutConfirmPassword } = formData;
            axios.post(url, formDataWithoutConfirmPassword)
                .then((response) => {
                    console.log(response);
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(url)
                }) }
        postRegisterForm()
    }, [setErrors])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            const file = files?.[0] || null;
            setFormData((prevData) => ({ ...prevData, [name]: file }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };
    const isValidEmail = (email: string) => {
        // Simple email validation regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);    const isValidEmail = (email: string) => {
        // Simple email validation regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }};

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Perform validation
        const newErrors = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
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
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Update errors state
        setErrors(newErrors);

        // If there are no errors, perform form submission
        if (Object.values(newErrors).every(value => value === '')) {
            // Perform registration logic here
            console.log('Form submitted successfully');

    };};



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
    }
    return (
        <Paper elevation={3} style={{ padding: '150px' }}>
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
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            {errors.password && <span>{errors.password}</span>}

                            <TextField
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            {errors.confirmPassword && <span>{errors.confirmPassword}</span>}

                            <div>
                                <label htmlFor="profilePicture">Profile Picture (Optional) : </label>
                                <input
                                    type="file"
                                    id="profilePicture"
                                    name="profilePicture"
                                    accept="image/jpeg, image/png, image/gif"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <Button type="submit" variant="contained" sx={{ margin: "25px 5px", backgroundColor:"#025464" , color: '#ffffff'}}>
                            Register
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Paper>  )

}

export default RegisterPage;
