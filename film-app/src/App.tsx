import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, useParams} from "react-router-dom";
import FilmList from "./components/Films";
import FilmPage from "./components/Film";
import Home from "./components/Home"
import RegisterPage from "./components/Register";

function App() { return (

    <div className="App"> <Router>
      <div> <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/films" element={<FilmList />} />
          <Route path='/films/:id' element={<FilmPage />} />
          <Route path='/register' element={<RegisterPage />} />
      </Routes> </div>
    </Router> </div>
);
}


export default App;

