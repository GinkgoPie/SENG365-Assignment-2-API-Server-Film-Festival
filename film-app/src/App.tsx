import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import FilmList from "./components/Films";
function App() { return (

    <div className="App"> <Router>
      <div> <Routes>
          <Route path="/films" element={<FilmList />} />
      </Routes> </div>
    </Router> </div>
); }


export default App;