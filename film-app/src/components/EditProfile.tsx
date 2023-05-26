import axios from 'axios';
import React, {useState} from "react";
import CSS from 'csstype';
import {
    Paper,
    AlertTitle,
    Alert,
    Button, Card, CardContent, TextField, CardMedia
} from "@mui/material";
import NavigationBar from "./NavigationBar";
import {useNavigate} from "react-router-dom";
import {useAuthStore} from "../store/authentication";
import NotFound from "./404NotFound";

interface dataForm {
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    currentPassword?:string,
}

const EditProfile: React.FC = () => {
    const authentication = useAuthStore((state) => state.authentication);
    const userId = useAuthStore((state) => state.userId);
    const firstName = useAuthStore((state) => state.firstName);
    const [oldFirstName, setOldFirstName] = useState(firstName);
    const setFirstName = useAuthStore((state) => state.setFirstName);
    const lastName = useAuthStore((state) => state.lastName);
    const [oldLastName, setOldLastName] = useState<string>(lastName);
    const setLastName= useAuthStore((state) => state.setLastName);
    const email= useAuthStore((state) => state.email);
    const [oldEmail, setOldEmail] = useState<string>(email);
    const setEmail= useAuthStore((state) => state.setEmail);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const supportedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const [imageType, setImageType] = useState<any | null>(null);
    const navigate = useNavigate();
    const [profileImageError, setProfileImageError] = useState('');
    const [validationErrors, setValidationErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        currentPassword: ''
    });
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const updateProfileImage = () => {
        if (!profilePicture) {
            setProfileImageError('No image chosen for update');
            return
        } else if (!supportedImageTypes.includes(imageType)) {
            setProfileImageError('Please select an image file in JPEG, PNG, or GIF format.');
        }

        if (profilePicture) {
            console.log('Try profile upload');
            axios
                .put(`http://localhost:4941/api/v1/users/${userId}/image`, profilePicture, {
                    headers: {
                        'X-Authorization': authentication,
                        'Content-Type': imageType
                    },
                })
                .then(() => {
                    console.log('Put profile successfully');
                    window.location.href = "/myProfile";
                })
                .catch((error) => {
                    console.log('Updated profile failed');
                    setErrorFlag(true);
                    setErrorMessage(error.response.statusText);
                });
        }
    };

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files?.[0];
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                setProfilePicture(file);
                setImageType(file.type);
            };
            fileReader.readAsDataURL(file);
        }else {
            setProfilePicture(null);
            setImageType(null);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPassword(e.target.value);
    };

    const isValidEmail = (email: string) => {
        // Simple email validation regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            currentPassword: ''
        }

        const editProfileForm : dataForm = {};

        if (firstName !== oldFirstName){
            if (firstName.trim() === '') {
                newErrors.firstName = 'First name can not be empty';
            } else {
                editProfileForm.firstName = firstName;
            }
        }

        if (lastName !== oldLastName){
            if (lastName.trim() === '') {
                newErrors.lastName = 'Last name can not be empty';
            } else {
                editProfileForm.lastName = lastName;
            }
        }

        if (email !== oldEmail){
            if (email.trim() === '') {
                newErrors.email = 'Email can not be empty';
            } else if (!isValidEmail(email)) {
                newErrors.email = 'Invalid email format';
            } else {
                editProfileForm.email = email;
            }
        }

        if (password !== '') {
            if (currentPassword === '') {
                newErrors.currentPassword = 'Current password is required to update your password'
            } else if (password === currentPassword) {
                newErrors.password = 'New password should be different to your old password'
            } else if (password.trim().length < 6) {
                newErrors.password = 'Passwords should be at least 6 characters long';
            } else {
                editProfileForm.password = password;
                editProfileForm.currentPassword = currentPassword;
            }
        }


        setValidationErrors(newErrors)



        if (Object.values(newErrors).every(value => value === '')) {
            let url = 'http://localhost:4941/api/v1/users/' + userId
            axios.patch(url, editProfileForm, {
                headers: {
                    'X-Authorization': authentication
                }})
                .then((response) => {
                    console.log('Edit profile form submitted successfully');
                    console.log(response.status);
                    window.location.href = "/myProfile";
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.response.statusText)
                })
        }


    };

    const editProfileCardStyles: CSS.Properties = {
        display: "inline-block",
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '30%',
        height: '60%',
        margin: '20 auto',
        padding: "50px",
        textAlign: "center"
    };

    const containerStyles: CSS.Properties = {
        display: 'grid',
        gap: '1rem',
    };

    const deleteProfileImage = () => {
        setProfilePicture(null)
        setImageType(null)
        axios
            .delete(`http://localhost:4941/api/v1/users/${userId}/image`, {
                headers: {
                    'X-Authorization': authentication
                },
            })
            .then(() => {
                console.log('Delete profile successfully');
                window.location.href = "/myProfile";
            })
            .catch((error) => {
                console.log('Delete profile failed');
                setErrorFlag(true);
                setErrorMessage(error.response.statusText);
            });
    }

    if (authentication ==='') {
        return <NotFound />
    }

    return (
        <Paper elevation={3} style={{padding: '20px'}}>
            <NavigationBar/>
            <Card sx={editProfileCardStyles}>
                <CardMedia
                    component="img"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        objectFit: "contain",
                        width: "50%",
                        height: "50%",
                        borderRadius: "50%",
                        margin: "auto",
                        textAlign: "center"
                    }}
                    image={`http://localhost:4941/api/v1/users/${userId}/image`}
                    alt="Movie poster"
                    onError={(e) => {
                        e.currentTarget.src = "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png";
                    }}
                />
                <div style={{ margin: '30px' }}>
                    <label htmlFor="filmImage" style={{ margin: '30px' }}>Edit profile image: </label>
                    <input
                        style={{ margin: '30px' }}
                        type="file"
                        id="profilePicture"
                        name="profilePicture"
                        accept="image/jpeg, image/png, image/gif"
                        onChange={handleProfilePictureChange}
                    />
                    <div>
                        <Button onClick={updateProfileImage} sx={{ backgroundColor: 'gray', color: 'white', margin: '30px'}}>
                            Update profile image
                        </Button>
                        <Button onClick={deleteProfileImage} sx={{ backgroundColor: 'gray', color: 'white' }}>
                            Remove profile image
                        </Button>
                    </div>
                    {profileImageError && <span style={{ color: 'red' }}>{profileImageError}</span>}

                </div>
            </Card>
            <Card sx={editProfileCardStyles}>

                <CardContent>
                    <h2>Edit Profile</h2>
                    <form onSubmit={handleSubmit}>

                        <div style={containerStyles}>
                            <TextField
                                label="First Name"
                                type="text"
                                name="firstName"
                                value={firstName}
                                fullWidth
                                onChange={handleFirstNameChange}
                            />
                            {validationErrors.firstName && <span style={{ color: 'red' }}>{validationErrors.firstName}</span>}

                            <TextField
                                label="Last Name"
                                type="text"
                                name="lastName"
                                value={lastName}
                                onChange={handleLastNameChange}
                                fullWidth
                            />
                            {validationErrors.lastName && <span style={{ color: 'red' }}>{validationErrors.lastName}</span>}

                            <TextField
                                label="Email"
                                type="email"
                                name="email"
                                value={email}
                                fullWidth
                                onChange={handleEmailChange}
                            />
                            {validationErrors.email && <span style={{ color: 'red' }}>{validationErrors.email}</span>}


                            <TextField
                                label="New Password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={password}
                                onChange={handlePasswordChange}
                                fullWidth
                            />
                            {validationErrors.password && <span style={{ color: 'red' }}>{validationErrors.password}</span>}

                            <TextField
                                label="Current Password"
                                type={showPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={currentPassword}
                                onChange={handleCurrentPasswordChange}
                                fullWidth
                            />
                            {validationErrors.currentPassword && <span style={{ color: 'red' }}>{validationErrors.currentPassword}</span>}



                            <Button onClick={togglePasswordVisibility}>
                                {showPassword ? 'Hide Password' : 'Show Password'}
                            </Button>
                        </div>

                        <Button type="submit" variant="contained" sx={{ margin: "25px 5px", backgroundColor: 'gray', color: '#ffffff' }}>
                            Save Changes
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

export default EditProfile;
