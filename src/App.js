import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import './App.scss';
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";



function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() =>{
      axios.get('http://localhost:3001/members')
      .then(response => {
         setData(response.data);
         console.log(data);
      })
      .catch(error => {
        setError("Error")
        if (error.response && error.response.status === 404) {
          setError('404 - Not Found');
        } else {
          setError('Unable to fetch data from server');
        }
      });
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/home" element={<Home/>}/>
        </Routes>
      </BrowserRouter>
      
    </>
    
  );
}

export default App;
