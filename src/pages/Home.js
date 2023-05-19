import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Discover from '../components/Discover/Discover';
import { useLocation } from 'react-router-dom';

function Home(){
    
    return (
        
        <body>
            <Discover />
        </body>                                     
    );
}



export default Home;