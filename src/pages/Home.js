import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header/Header';
import Discover from '../components/Discover/Discover';

function Home(){
    return (
        <>
            <Header/>
            <body>
                <Discover/>
            </body>
            
        </>
            
        
        
    );
}



export default Home;