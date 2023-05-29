import logo from './logo.svg';
import './App.css';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header/Header';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Admin from './pages/Admin/Admin';
import Profil from './pages/Profil';
import Cookies from 'js-cookie';
import './App.scss';
import {BrowserRouter, Routes, Route, Link, useLocation} from "react-router-dom";



function App() {

  return (
      
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login token={Cookies.get('token')} />} />
        </Routes>
      </BrowserRouter>
    
  );
}

export default App;
