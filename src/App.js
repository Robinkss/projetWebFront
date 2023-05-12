import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Home from './pages/Home';
import './App.scss';
import {BrowserRouter, Routes, Route} from "react-router-dom";



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
    <div className="App">
      <Home/>
      <div>
        {error ? (
          <p>{error}</p>
        ) : (
          data.map(item => (
            <p key={item.id_member}>{item.member_mail}</p>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
