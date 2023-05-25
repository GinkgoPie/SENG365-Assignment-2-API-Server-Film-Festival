import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import FilmList from "./components/Films";
import FilmPage from "./components/Film";
import Home from "./components/Home"
import RegisterPage from "./components/Register";
import LoginPage from "./components/Login";
import ProfilePage from "./components/Profile";
import CreateFilmPage from "./components/CreateFilm";
import MyFilmPage from "./components/MyFilms";
import EditProfilePage from "./components/EditProfile";
import EditFilmPage from "./components/EditFilm";
import NotFoundPage from "./components/404NotFound";

function App() { return (

    <div className="App"> <Router>
      <div> <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/films" element={<FilmList />} />
          <Route path='/films/:id' element={<FilmPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/myProfile' element={<ProfilePage />} />
          <Route path='/createFilm' element={<CreateFilmPage />} />
          <Route path='/myFilms' element={<MyFilmPage />} />
          <Route path='/404NotFound' element={<NotFoundPage />} />
          <Route path='/editProfile' element={<EditProfilePage />} />
          <Route path='/editFilm/:id' element={<EditFilmPage />} />
      </Routes> </div>
    </Router> </div>
);
}


export default App;

