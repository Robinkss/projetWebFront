import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, Link } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
//import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Snackbar, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Login from './Login';
import GlobalSnackbar from '../components/GlobalSnackBar/GlobalSnackbar';
//import isemail from "isemail";


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {

  const [snackBar, setSnackBar] = useState({
    open: false,
    severity:null,
    message: null
  });

  const [isSignUp, setIsSignUp] = useState(false);

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
  

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });

    //Vérification des champs vide
    if(data.get("email")=="" || data.get("pseudo")== "" || data.get("password") == "" || data.get("passwordConfirm") == ""){
      setSnackBar({
        open: true,
        severity: "warning",
        message: "Tous les champs sont obligatoires !"
      })
      return;
    }

    //Vérification cohérence mot de passe
    if(data.get("password")!=data.get("passwordConfirm")){
      setSnackBar({
        open: true,
        severity: "warning",
        message: "Les deux mots de passe ne correspondent pas !"
      })
      return;
    }

    axios.post('https://projet-web-back.onrender.com/members/signup', {
      mail: data.get('email'), 
      name: data.get('pseudo'),
      password: data.get('password'),
      description: "",
      photo: "test", 
      admin: false
    }).then(response => {
      setSnackBar({
        open: true,
        severity: response.data.severity,
        message: response.data.message
      })
      setIsSignUp(true);
      
    }).catch(error => {
      setSnackBar({
        open: true,
        severity:error.response.data.severity,
        message: error.response.data.message
      })
      
    })
      
  };
  if (isSignUp){
    return (
      <Navigate to='/login'/>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalSnackbar snackbar={snackBar} setSnackbar={setSnackBar} vertical='bottom' horizontal='left'/>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="pseudo"
                  name="pseudo"
                  required
                  fullWidth
                  id="pseudo"
                  label="Pseudo"
                  autoFocus
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordConfirm"
                  label="Confirm Password"
                  type="password"
                  id="passwordConfirm"
                  autoComplete="confirm new password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to='/login' variant="body2">
                  Déjà membre ? Connectez-vous !
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />      
      </Container>
    </ThemeProvider>
  );
}