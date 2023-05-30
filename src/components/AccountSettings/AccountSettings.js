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
import GlobalSnackbar from '../../components/GlobalSnackBar/GlobalSnackbar';

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
    const [snackBar, setSnackBar] = useState({
        open: false,
        severity:null,
        message: null
      });


    function handleChangePseudo(event){
        setPseudo(event.target.value);
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

    function updatePseudo(){
        axios.put(`${process.env.REACT_APP_API_URL}/members/updateName/`, {
            id: user,
            name: pseudo,
            },{
            headers: {
                Authorization: `Bearer ${token}`,
            }
                
          }).then(response => {
            setIsPseudoActive(false);
            setSnackBar({
                open: true,
                severity: "success",
                message: `Pseudo modifié !`
            })

            console.log(response);
        }).catch(error => {
            console.log(error);
        });
    }

    function updateMail(){
        axios.put(`${process.env.REACT_APP_API_URL}/members/updateMail/`, {
            id: user,
            mail: email,
            },{
            headers: {
                Authorization: `Bearer ${token}`,
            }
                
          }).then(response => {
            setIsEmailActive(false);
            setSnackBar({
                open: true,
                severity: "success",
                message: `Email modifié !`
            })
            console.log(response);
        }).catch(error => {
            console.log(error);
        });
    }

    function updatePassword(){
        axios.put(`${process.env.REACT_APP_API_URL}/members/updatePassword/`, {
            id: user,
            password: password,
            },{
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(response => {
            setIsPasswordActive(false);
            setSnackBar({
                open: true,
                severity: "success",
                message: `Mot de passe modifié !`
            })
            console.log(response);
        }).catch(error => {
            console.log(error);
        });
    }

    function updateDescription(){
        axios.put(`${process.env.REACT_APP_API_URL}/members/updateDescription/`, {
            id: user,
            description: description,
            },{
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(response => {
            setIsDescriptionActive(false);
            setSnackBar({
                open: true,
                severity: "success",
                message: `Description modifiée !`
            })
            console.log(response);
        }).catch(error => {
            console.log(error);
        });
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
        axios.delete(`${process.env.REACT_APP_API_URL}/members/delete/${user}`, {
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
                    
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/members/${user}`);
                    
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
                    <GlobalSnackbar snackbar={snackBar} setSnackbar={setSnackBar} vertical='bottom' horizontal='left' />
                    <div className={styles.title}>Mes informations personnelles :</div>
                    <div className={styles.datas}>
                        <div className={styles.row}>
                            <label className={styles.label} htmlFor="pseudo">Pseudo :</label>
                            <input className={styles.input} onChange={handleChangePseudo} type="text" id="pseudo" name="pseudo" disabled={!isPseudoActive} value={pseudo} />
                            <Button onClick={setIsPseudoActiveTrue} ><img className={styles.edit} src='./images/edit.png' alt="Edit" /></Button>
                            <Button hidden={!isPseudoActive} onClick={()=> updatePseudo() } ><img hidden={!isPseudoActive} className={styles.edit} src='./images/submit.png' alt="Edit" /></Button>
                        </div>
                        <div className={styles.row}>
                            <label className={styles.label} htmlFor="email">Email :</label>
                            <input className={styles.input} onChange={handleChangeMail} type="text" id="email" name="email" disabled={!isEmailActive} value={email} />
                            <Button onClick={setIsEmailActiveTrue} ><img className={styles.edit} src='./images/edit.png' alt="Edit" /></Button>
                            <Button hidden={!isEmailActive} onClick={()=>updateMail()} ><img hidden={!isEmailActive} className={styles.edit} src='./images/submit.png' alt="Edit" /></Button>
                        </div>
                        <div className={styles.row}>
                            <label className={styles.label} htmlFor="password">Mot de passe :</label>
                            <input className={styles.input} onChange={handleChangePassword} type="password" id="password" name="password" disabled={!isPasswordActive} value={password} />
                            <Button onClick={setIsPasswordActiveTrue} ><img className={styles.edit} src='./images/edit.png' alt="Edit" /></Button>
                            <Button hidden={!isPasswordActive} onClick={()=>updatePassword()} ><img hidden={!isPasswordActive} className={styles.edit} src='./images/submit.png' alt="Edit" /></Button>
                        </div>
                        <div className={styles.row}>
                            <label className={styles.label} htmlFor="desc">Description :</label>
                            <textarea className={styles.input} onChange={handleChangeDesc} id="desc" name="desc" disabled={!isDescriptionActive} value={description} />
                            <Button onClick={setIsDescriptionActiveTrue} ><img className={styles.edit} src='./images/edit.png' alt="Edit" /></Button>
                            <Button hidden={!isDescriptionActive} onClick={()=> updateDescription()} ><img hidden={!isDescriptionActive} className={styles.edit} src='./images/submit.png' alt="Edit" /></Button>
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
