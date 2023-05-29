import React, { useEffect, useState, useContext} from 'react';
import axios from 'axios';
import { Navigate, Link , useNavigate} from "react-router-dom";
import { AuthContext } from '../AuthContext/AuthContext';
import { Button, TextField, Box, Grid, FormControl, MenuItem, 
    InputLabel, Input, Container, CssBaseline, Typography,
     } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from 'js-cookie';
import styles from "./AccountSettings.module.scss";
import { Label } from '@mui/icons-material';

export default function AccountSettings({user, token}) {
    const [dataUser, setDataUser] = useState(null);
    const [errorDataUser, setErrorDataUser] = useState(null);
    const [isDeleted, setIsDeleted] = useState(false);
    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
    const [pseudo, setPseudo] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [description, setDescription] = useState(null);

    const [isPseudoActive, setIsPseudoActive] = useState(false);
    const [isEmailActive, setIsEmailActive] = useState(false);
    const [isPasswordActive, setIsPasswordActive] = useState(false);
    const [isDescriptionActive, setIsDescriptionActive] = useState(false);




    function handleChangePseudo(event){
        setPseudo(event.target.value);
    }

    function handleChangeMail(event){
        setEmail(event.target.value);
    }

    function handleChangePassword(event){
        setPassword(event.target.value);
    }

    function handleChangeDesc(event){
        setDescription(event.target.value);
    }

    function setIsPseudoActiveTrue(){
        setIsPseudoActive(true);
        setIsEmailActive(false);
        setIsPasswordActive(false);
        setIsDescriptionActive(false);
    }

    function setIsEmailActiveTrue(){
        setIsPseudoActive(false);
        setIsEmailActive(true);
        setIsPasswordActive(false);
        setIsDescriptionActive(false);
    }

    function setIsPasswordActiveTrue(){
        setIsPseudoActive(false);
        setIsEmailActive(false);
        setIsPasswordActive(true);
        setIsDescriptionActive(false);
    }

    function setIsDescriptionActiveTrue(){
        setIsPseudoActive(false);
        setIsEmailActive(false);
        setIsPasswordActive(false);
        setIsDescriptionActive(true);
    }

    function handleDeleteAccount(){
        console.log('Token :');
        console.log(token);
        axios.delete(`https://projet-web-back.onrender.com/members/delete/${user}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(response => {
            console.log("Compte supprimé !");
            Cookies.remove('token');
            Cookies.remove('id_member');
            setIsAuthenticated(false);
            setIsDeleted(true); 
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            try{
                if(user){
                    
                    const response = await axios.get(`https://projet-web-back.onrender.com/members/${user}`);
                    
                    setDataUser(response.data);
                    console.log("response.data :");
                    console.log(response.data);
                    setPseudo(response.data.member_name);
                    console.log("nice");
                    setEmail(response.data.member_mail);
                    setPassword(response.data.member_password);
                    setDescription(response.data.member_description);
                    console.log(response.data);
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
        fetchData();
    }, [user]);

    if(isDeleted){
        return <Navigate to="/signup" />
    }
    return (
        <>
        {errorDataUser ?  (
            <p>{errorDataUser}</p>
        ) 
        : 
        dataUser && (
                <div className={styles.container}>
                    <div className={styles.title}>Mes informations personnelles :</div>
                    <div className={styles.datas}>
                        <div className={styles.row}>
                            <label className={styles.label} htmlFor="pseudo">Pseudo :</label>
                            <input className={styles.input} onChange={handleChangePseudo} type="text" id="pseudo" name="pseudo" disabled={!isPseudoActive} value={pseudo} />
                            <Button onClick={setIsPseudoActiveTrue} ><img className={styles.edit} src='./images/edit.png' alt="Edit" /></Button>
                            <Button hidden={!isPseudoActive} ><img hidden={!isPseudoActive} className={styles.edit} src='./images/submit.png' alt="Edit" /></Button>
                        </div>
                        <div className={styles.row}>
                            <label className={styles.label} htmlFor="email">Email :</label>
                            <input className={styles.input} onChange={handleChangeMail} type="text" id="email" name="email" disabled={!isEmailActive} value={email} />
                            <Button onClick={setIsEmailActiveTrue} ><img className={styles.edit} src='./images/edit.png' alt="Edit" /></Button>
                            <Button hidden={!isEmailActive} ><img hidden={!isEmailActive} className={styles.edit} src='./images/submit.png' alt="Edit" /></Button>
                        </div>
                        <div className={styles.row}>
                            <label className={styles.label} htmlFor="password">Mot de passe :</label>
                            <input className={styles.input} onChange={handleChangePassword} type="password" id="password" name="password" disabled={!isPasswordActive} value={password} />
                            <Button onClick={setIsPasswordActiveTrue} ><img className={styles.edit} src='./images/edit.png' alt="Edit" /></Button>
                            <Button hidden={!isPasswordActive} ><img hidden={!isPasswordActive} className={styles.edit} src='./images/submit.png' alt="Edit" /></Button>
                        </div>
                        <div className={styles.row}>
                            <label className={styles.label} htmlFor="desc">Description :</label>
                            <textarea className={styles.input} onChange={handleChangeDesc} id="desc" name="desc" disabled={!isDescriptionActive} value={description} />
                            <Button onClick={setIsDescriptionActiveTrue} ><img className={styles.edit} src='./images/edit.png' alt="Edit" /></Button>
                            <Button hidden={!isDescriptionActive} ><img hidden={!isDescriptionActive} className={styles.edit} src='./images/submit.png' alt="Edit" /></Button>
                        </div>
                        <Button onClick={handleDeleteAccount} color='error' variant='outlined'>
                            Supprimer mon compte
                        </Button>
                    </div>
                    
                </div>
                
        )}
        </> 
    )
}
