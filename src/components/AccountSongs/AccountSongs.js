import React, { useEffect, useState, useContext} from 'react';
import axios from 'axios';
import GlobalSnackbar from '../../components/GlobalSnackBar/GlobalSnackbar';
import styles from "./AccountSongs.module.scss";

function AccountSongs({user, token}){
    const [songs, setSongs] = useState(null);
    const [errorSongs, setErrorSongs] = useState(null);

    const [snackBar, setSnackBar] = useState({
        open: false,
        severity:null,
        message: null
      });

    useEffect(() => {
        const fetchSongs = async () => {
            try{
                if(user){
                    const response = await axios.get(`https://projet-web-back.onrender.com/members/songs/${user}`);
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
                                <img src={`https://projet-web-back.onrender.com/images/songs/${song.id_song}.jpg`} alt="Photo de profil"/>
                                <p className={styles.titre}>{song.song_name}</p>
                                <audio controls src={`https://projet-web-back.onrender.com/songs/${song.id_song}.mp3`}>
                                </audio>
                                
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