import React, { useEffect, useState, useContext} from 'react';
import axios from 'axios';
import GlobalSnackbar from '../../components/GlobalSnackBar/GlobalSnackbar';
import styles from "./AccountSongs.module.scss";
import { Button } from '@mui/material';

function AccountSongs({user, token}){
    const [songs, setSongs] = useState(null);
    const [errorSongs, setErrorSongs] = useState(null);

    const [snackBar, setSnackBar] = useState({
        open: false,
        severity:null,
        message: null
      });

    function deleteSong(id_song){
        console.log("delete");
        console.log(id_song);
        axios.delete(`${process.env.REACT_APP_API_URL}/songs/delete/${id_song}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(response => {
            console.log(response);
            setSnackBar({
                open: true,
                severity:'success',
                message: 'Musique supprimée'
            });
            setSongs(songs.filter((song) => song.id_song !== id_song));
        }).catch(error => {
            console.log(error);
            setSnackBar({
                open: true,
                severity:'error',
                message: 'Erreur lors de la suppression de la musique'
            });
        });
    }

    
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
        <>
        <GlobalSnackbar snackbar={snackBar} setSnackbar={setSnackBar} vertical='bottom' horizontal='left' />
            <div className={styles.mainContainer}>
                <h1>Mes musiques</h1>
                <div className={styles.musiques}>
                    {songs ? (
                        songs.map((song) => (
                            <div className={styles.musique}>
                                <img src={`${process.env.REACT_APP_API_URL}/images/songs/${song.id_song}.jpg`} alt="Photo de profil"/>
                                <p className={styles.titre}>{song.song_name}</p>
                                <audio controls src={`${process.env.REACT_APP_API_URL}/songs/${song.id_song}.mp3`}>
                                </audio>
                                <Button className={styles.button} onClick={()=> deleteSong(song.id_song)} color='error' variant='outlined' >
                                    Supprimer
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p>Vous n'avez pas encore de musique</p>
                    )}
                    
                    {/* {users && users.map((user) => (
                        <div className={styles.user}>
                            <img src='./images/default_avatar.png' alt="Photo de profil"/>
                            <p className={styles.identifiant}>Identifiant : {user.id_member}</p>
                            <p className={styles.pseudo}>Pseudo : {user.member_name}</p>
                            <Button onClick={() => handleBanUser(user.id_member)} className={styles.button} color='error' variant='outlined' >Bannir</Button>
                        </div>
                    ))} */}
                    
                </div>
                
            </div>
        </>
        
    );
}

export default AccountSongs;