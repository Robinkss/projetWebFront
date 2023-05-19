import * as React from 'react';
import Cookies from 'js-cookie';
import {decodeToken} from 'react-jwt';
import axios from 'axios';  
import { Navigate, Link , useNavigate} from "react-router-dom";
import { useState, useEffect, useContext} from 'react';
import { AuthContext } from '../components/AuthContext/AuthContext';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
//import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GlobalSnackbar from '../components/GlobalSnackBar/GlobalSnackbar';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" to='/'>
        Unearth
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignInSide({}) {
  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
  //const [connected, setConnected] = useState(false);
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity:null,
    message: null
  });

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
    if(data.get("email")=="" || data.get("password") == ""){
      setSnackBar({
        open: true,
        severity: "warning",
        message: "Tous les champs sont obligatoires !"
      })
      return;
    }
    
    axios.post('http://localhost:3001/members/login', {
      mail: data.get('email'),
      password: data.get('password'),
    }).then(response => {
      const {token} = response.data;
      const decodedToken = decodeToken(token);
      const id_member = decodedToken.id_member;
      Cookies.set('token', token, {expires: 1, secure: true});
      Cookies.set('id_member', id_member, {expires: 1, secure: true});
      console.log("Utilisateur connecté !");
      setIsAuthenticated(true);
      
    }).catch(error => {
      setSnackBar({
        open: true,
        severity: "error",
        message: "Tous les champs sont obligatoires !"
      })
      console.log(error);
    });
  };

  if (isAuthenticated) {
    return <Navigate to="/"/>;
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalSnackbar snackbar={snackBar} setSnackbar={setSnackBar} vertical='bottom' horizontal= 'right'/>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(./images/bg_login.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Se souvenir"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Se connecter
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Mot-de-passe oublié ?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to='/signup' variant="body2">
                    Pas encore membre ? Inscrivez-vous !
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}