import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Discover from './Discover/Discover';
import SongsByGenre from './SongsByGenre/SongsByGenre';
import { useLocation } from 'react-router-dom';

function Home(){
    
    const [genre, setGenre] = useState(null);

    

    return (
        
        <body>
            {genre ? (
                <SongsByGenre genre={genre} />
            ) : (
            <Discover genre={genre} setGenre={setGenre} />
            )}

        </body>                                     
    );
}



export default Home;