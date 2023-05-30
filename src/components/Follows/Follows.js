import React, { useEffect, useState, useContext} from 'react';
import axios from 'axios';
import GlobalSnackbar from '../../components/GlobalSnackBar/GlobalSnackbar';
import styles from "./Follows.module.scss";

function AccountSongs({user, token}){
    const [follows, setFollows] = useState(null);
    const [errorFollows, setErrorFollows] = useState(null);

    const [snackBar, setSnackBar] = useState({
        open: false,
        severity:null,
        message: null
      });

    useEffect(() => {
        const fetchFollows = async () => {
            try{
                if(user){
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/members/follows/${user}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }).then(response => {
                        setFollows(response.data);
                    }).catch(error => {
                        console.log(error);
                    }
                    );
                }
            }catch(error){
                setErrorFollows("Error");
                if (error.response && error.response.status === 404) {
                    setErrorFollows('404 - Not Found');
                } else {
                    setErrorFollows('Unable to fetch data from server');
                }
            }
        };
        fetchFollows();
    },[]);

    return(
        <>
        <GlobalSnackbar snackbar={snackBar} setSnackbar={setSnackBar} vertical='bottom' horizontal='left' />
            <div className={styles.mainContainer}>
                <h1>Mes abonnements</h1>
                <div className={styles.abonnements}>
                    {follows ? (
                        follows.map((follow) => (
                            <div className={styles.abonnement}>
                                <p className={styles.name}>{follow.suit}</p>                      
                            </div>
                        ))
                    ) : (
                        <p>Vous ne suivez encore personne...</p>
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