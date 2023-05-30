import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styles from "./Admin.module.scss";
import { Button} from '@mui/material';
import Cookies from 'js-cookie';
import GlobalSnackbar from '../../components/GlobalSnackBar/GlobalSnackbar';

function Admin(){

    const [users, setUsers] = useState(null);
    const [token, setToken] = useState(Cookies.get('token'));
    const [snackBar, setSnackBar] = useState({
        open: false,
        severity:null,
        message: null
      });

    function handleBanUser(userId){
        if(Cookies.get('admin') !== undefined && Cookies.get('admin') === 'true' ){

            axios.delete(`${process.env.REACT_APP_API_URL}/members/delete/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(response => {
                console.log("Membre banni !");
                users.filter(user => user.id_member !== userId);
                setSnackBar({
                    open: true,
                    severity: "success",
                    message: `Le membre numéro ${userId} a bien été banni !`
                })
            }).catch(error => {
                console.log(error);
            });
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

    // Récupère tous les utilisateurs
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/members`);
                setUsers(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUsers();
    }, [users]);

    if(Cookies.get('admin') !== 'true' || Cookies.get('admin') === undefined){
        window.location.href = '/';
    }
    
    return (
        
        <body>
            <GlobalSnackbar snackbar={snackBar} setSnackbar={setSnackBar} vertical='bottom' horizontal='left' />
            <div className={styles.mainContainer}>
                <h1>Administration</h1>
                <div className={styles.usersSection}>
                    <h2>Bannir des utilisateurs</h2>
                    <div className={styles.usersContainer}>
                    {users && users.map((user) => (
                        <div className={styles.user}>
                            <img src='./images/default_avatar.png' alt="Photo de profil"/>
                            <p className={styles.identifiant}>Identifiant : {user.id_member}</p>
                            <p className={styles.pseudo}>Pseudo : {user.member_name}</p>
                            <Button onClick={() => handleBanUser(user.id_member)} className={styles.button} color='error' variant='outlined' >Bannir</Button>
                        </div>
                    ))}
                    </div>
                </div>
                
            </div>
            
        </body>                                     
    );
}



export default Admin;