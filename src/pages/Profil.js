import React, { useEffect, useState , useContext} from 'react';
import axios from 'axios';
import {decodeToken} from 'react-jwt';
import Cookies from 'js-cookie';
import { Navigate, Link , useNavigate} from "react-router-dom";
import { AuthContext } from '../components/AuthContext/AuthContext';
import { Button } from '@mui/material';
import styles from "./Profil.module.scss";
import Upload from '../components/Upload/Upload';
import AccountSettings from '../components/AccountSettings/AccountSettings';
import AccountSongs from '../components/AccountSongs/AccountSongs';

function Profil(){
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(Cookies.get('token'));
    const [dataUser, setDataUser] = useState(null);
    const [errorDataUser, setErrorDataUser] = useState(null);
    const [errorSongs, setErrorSongs] = useState(null);
    const [songs, setSongs] = useState(null);
    const [image, setImage] = useState(null);
    const [selectedButton, setSelectedButton] = useState(null);



    async function getImage(id_user){
        try {
            const response = await axios.get(`https://projet-web-back.onrender.com/members/image/${id_user}`, { responseType: 'arraybuffer' });
            const image = new Blob([response.data], { type: 'image/png' });
            const imageURL = URL.createObjectURL(image);
            console.log(imageURL);
            return imageURL;
          } catch (error) {
            console.log(error);
            throw error;
          }
    }

    async function handleSelectedButton(onglet){
        setSelectedButton(onglet);

    }
    
    useEffect(() => {
        
        const extractIdMemberFromToken = () => {
            try{
                const decodedToken = decodeToken(token);
                const id_member = decodedToken.id_member;
                setUser(id_member);
            }catch(error){
                console.error('Erreur lors du décodage du token :', error);
                setUser(null);
            }
        };

        
        extractIdMemberFromToken();
        
    }, [token]);

    /*
     * Récupération de toutes les données de l'utilisateur
     - Données principales
     - Données des chansons
     - Données des albums
     - Données des suivis
    */
    useEffect(() => {
        const fetchData = async () => {
            try{
                if(user){
                    const response = await axios.get(`https://projet-web-back.onrender.com/members/${user}`);
                    setDataUser(response.data);
                    console.log(response.data);
                    try{
                        const imagePromise = getImage(response.data.id_member);
                        const imageURL = await Promise.resolve(imagePromise);
                        setImage(imageURL); 
                    }catch(error){
                        setImage(null);
                    }
                    
                }
            }catch(error){
                setErrorDataUser("Error");
                if (error.response && error.response.status === 404) {
                    setErrorDataUser('404 - Not Found');
                } else {
                    setErrorDataUser('Unable to fetch data from server');
                }
            }
        };
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
                    
        fetchData();
        fetchSongs();
    }, [user]);


    return (
        
        <body>
            <div className={styles.container}>
                <div className={styles.toolBar}>
                    <div className={styles.imageContainer}>
                        {image ? (
                            <img className={styles.image} src={image} alt="profil"/>
                        ) : (
                            <img className={styles.image} src="./images/default_avatar.png" alt="profil"/>
                        )}
                             
                    </div>                    
                    <div className={styles.option} onClick={() =>handleSelectedButton("accountSettings")}>Mon compte</div>
                    <div className={styles.option} onClick={() => handleSelectedButton("songs")}>Mes chansons</div>
                    <div className={styles.option} onClick={() => handleSelectedButton("albums")}>Mes albums</div>
                    <div className={styles.option} onClick={() => handleSelectedButton("upload")}>Upload</div>
                    <div className={styles.option} onClick={() => handleSelectedButton("follows")}>Suivis</div>

                </div>
                <div className={styles.content}>
                {(selectedButton === 'accountSettings' || selectedButton === null) && (
                    <AccountSettings user={user} token={token}/>
                )}
                {selectedButton === 'songs' && (
                    // Afficher les chansons
                    <AccountSongs user={user} token={token}/>
                )}
                {selectedButton === 'albums' && (
                    // Afficher les albums
                    <p>Mes albums :</p>
                )}
                {selectedButton === 'upload' && (
                    // Afficher les albums
                    <Upload user={user} token={token}/>
                )}
                {selectedButton === 'follows' && (
                    // Afficher les suivis
                    <p>Mes suivis :</p>
                )}
                </div>
            </div>

            
            
            
            
        </body>                                     
    );
}




export default Profil;