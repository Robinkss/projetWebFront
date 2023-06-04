import React, { useEffect, useState , useContext} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Navigate, Link , useNavigate, useLocation} from "react-router-dom";
import {decodeToken} from 'react-jwt';
import GlobalSnackbar from '../../components/GlobalSnackBar/GlobalSnackbar';


import { Button } from '@mui/material';
import styles from './Artiste.module.scss';

function Artiste(){
    const [songs, setSongs] = useState(null);
    const [errorSongs, setErrorSongs] = useState(null);
    const [artist, setArtist] = useState(null);
    const location = useLocation();
    const user = location.state.user;
    const [isFollowed, setIsFollowed] = useState(false);
    const [isYourself, setIsYourself] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [imageURLs, setImageURLs] = useState([]);
    console.log("user");
    console.log(user);

    const [snackBar, setSnackBar] = useState({
        open: false,
        severity:null,
        message: null
      });

    async function getImageSong(id_song) {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/songs/image/${id_song}`, { responseType: 'arraybuffer' });
        const image = new Blob([response.data], { type: 'image/jpeg' });
        const imageURL = URL.createObjectURL(image);
        console.log(imageURL);
        return imageURL;
    } catch (error) {
        console.log(error);
        throw error;
    }
    }
    
      // Evénement qui permet de fermer le snackbar
    useEffect(() => {
        if (snackBar.open) {
          const timer = setTimeout(() => {
            setSnackBar((prevSnackBar) => ({
              ...prevSnackBar,
              open: false
            }));
          }, 4000);
      
          return () => {
            clearTimeout(timer);
          };
        }
      }, [snackBar]);

    const handleFollow = () => {
        if(!isConnected){
            setSnackBar({
                open: true,
                severity:'error',
                message: "Vous devez être connecté pour suivre un artiste"
            });
        }
        try{
            console.log("follow");
            const token = Cookies.get('token');
            const decodedToken = decodeToken(token);
            const id_member = decodedToken.id_member;
            console.log("token");
            console.log(token);
            axios.post(`${process.env.REACT_APP_API_URL}/members/follow`, {
                userId: id_member,
                idFollowed: user,
                },{
                headers: {
                    Authorization: `Bearer ${token}`,
                }
                    
              }).then(response => {
                console.log(response);
                setIsFollowed(true); 
            }).catch(error => {
                console.log(error);
            });
        }catch(error){
            setSnackBar({
                open: true,
                severity:'error',
                message: "Vous devez être connecté pour suivre un artiste"
            });
        }


    }

    const handleUnFollow = () => {
        console.log("follow");
        const token = Cookies.get('token');
        const decodedToken = decodeToken(token);
        const id_member = decodedToken.id_member;
        axios.delete(`${process.env.REACT_APP_API_URL}/members/unfollow`, {
            data:{
            userId: id_member,
            idUnfollowed: user,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(response => {
            console.log(response);
            setIsFollowed(false); 
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        console.log("user :"+user);
        if(user){
            console.log("KEGJISGRIGGRIYIGGIRGIEYGIY");
            try{
                const token = Cookies.get('token');
                const decodedToken = decodeToken(token);
                const id_member = decodedToken.id_member;
                setIsConnected(true);
            }catch(error){    
                setIsConnected(false);        
            }
        }   
            


        const fetchSongs = async () => {
            try{
                if(user){
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/members/songs/${user}`);
                    setSongs(response.data);
                    const imagePromises = response.data.map(item => getImageSong(item.id_song));
                    const urls = await Promise.all(imagePromises);
                    setImageURLs(urls);
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
        const fetchUser = async () => {
            try{
                if(user){
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/members/${user}`);
                    console.log("response.data :");
                    setArtist(response.data);
                    console.log(response.data);
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

        const fetchIsFollowed = async () => {
            try{
                if(user){
                    try{
                        const token = Cookies.get('token');
                        const decodedToken = decodeToken(token);
                        const id_member = decodedToken.id_member;
                        if(id_member === user){
                            setIsYourself(true);
                        }
                        const response = await axios.get(`${process.env.REACT_APP_API_URL}/members/isFollow/${id_member}/${user}`,{
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }).then(response => {
                            if(response.data === true){
                                console.log("true");
                                setIsFollowed(true);
                            }else{
                                console.log("false");
                                setIsFollowed(false);
                            }
                        }).catch(error => {
                            console.log(error);
                        });
                    }catch(error){
                        setIsConnected(false);
                    }
                    
                }
            }catch(error){
                console.log(error);
            }
        };

        fetchSongs();
        fetchUser();
        fetchIsFollowed();

    },[]);

    return(
        <div className={styles.mainContainer}>
            <GlobalSnackbar snackbar={snackBar} setSnackbar={setSnackBar} vertical='bottom' horizontal='left' />
            {artist && (
                <div className={styles.artistContainer}>
                    <div className={styles.artistInfos} >
                        <h1>{artist.member_name}</h1>
                        <p>{artist.member_description}</p>
                        {!isYourself && (
                            <>
                            {isFollowed ? (
                                <Button variant="contained" color="primary" onClick={()=> handleUnFollow()}>Ne plus suivre</Button>
                            ) : (
                            <Button variant="contained" color="primary" onClick={()=> handleFollow()}>Suivre</Button>
                            )}
                            </>
                        )
                        }
                        
                    </div>
                    <div className={styles.artistSongs}>
                        <h2>Ses morceaux</h2>
                        <div className={styles.songsContainer}>
                            {songs && songs.map((song, index) => (
                                <div className={styles.songContainer}>
                                    {/* <img src={`${process.env.REACT_APP_API_URL}/images/songs/${song.id_song}.jpg`} alt="Cover song"/> */}
                                    <img src={imageURLs[index]} alt="Cover song"/>
                                    <p className={styles.name}>{artist.member_name}</p>
                                    <p className={styles.hyphen}>-</p>
                                    <p className={styles.titre}>{song.song_name}</p>
                                    <audio controls src={`${process.env.REACT_APP_API_URL}/songs/${song.id_song}.mp3`}>
                                    </audio>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Artiste;
