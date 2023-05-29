import React, { useEffect, useState , useContext} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Navigate, Link , useNavigate, useLocation} from "react-router-dom";

import { Button } from '@mui/material';
import styles from './Artiste.module.scss';

function Artiste(){
    const [songs, setSongs] = useState(null);
    const [errorSongs, setErrorSongs] = useState(null);
    const location = useLocation();
    const user = location.state.user;
    console.log("user");
    console.log(user);

    useEffect(() => {
        const fetchSongs = async () => {
            try{
                if(user){
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/members/songs/${user}`);
                    setSongs(response.data);
                }
            }catch(error){
                setErrorSongs("Error");
                if (error.response && error.response.status === 404) {
                    setErrorSongs('404 - Not Found');
                } else {
                    setErrorSongs('Unable to fetch data from server');
                }
            }
        };

        fetchSongs();
    },[]);

    return(
        <div className={styles.mainContainer}>
            <Button variant="contained" color="primary">Suivre</Button>
        </div>
    )
}

export default Artiste;
