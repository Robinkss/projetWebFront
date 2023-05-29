import React, { useEffect, useState, useContext} from 'react';
import axios from 'axios';
import styles from "./SongsByGenre.module.scss"
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";



function SongsByGenre(){
    const [songs, setSongs] = useState(null);
    const [errorSongs, setErrorSongs] = useState(null);
    const location = useLocation();
    console.log("genre")
    console.log(location.state.genre.id_genre);

    // Récupération des musiques d'un genre
    useEffect(() => {
        const fetchSongs = async () => {
            try{
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/songs/genre/${location.state.genre.id_genre}`);
                setSongs(response.data);
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
    }
    ,[]);

    return(
        <div className={styles.mainContainer}>
            <h1>{location.state.genre.genre_name}</h1>
            <div className={styles.musiques}>
                {songs ? (
                    songs.map((song) => (
                        <div className={styles.musique}>
                            <img src={`${process.env.REACT_APP_API_URL}/images/songs/${song.id_song}.jpg`} alt="Cover song"/>
                            <p className={styles.name}><Link to={`/artiste/${song.member.member_name}`} state={{ user: song.id_member }} >{song.member.member_name}</Link></p>
                            <p className={styles.hyphen}>-</p>
                            <p className={styles.titre}>{song.song_name}</p>
                            <audio controls src={`${process.env.REACT_APP_API_URL}/songs/${song.id_song}.mp3`}>
                            </audio>
                        </div>
                    ))
                ) : (
                    <p>Il n'y a pas encore de musique dans ce genre</p>
                )}
            </div>
        </div>
    )
}


export default SongsByGenre;