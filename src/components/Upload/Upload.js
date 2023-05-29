import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Grid, FormControl, MenuItem, 
    InputLabel, Input, Container, CssBaseline, Typography,
     } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Select from '@mui/material/Select';
import GlobalSnackbar from '../GlobalSnackBar/GlobalSnackbar';
import { type } from '@testing-library/user-event/dist/type';

const theme = createTheme();

export default function Upload({user, token}) {
  const [songName, setSongName] = useState('');
  const [songImage, setSongImage] = useState('');
  const [genres, setGenres] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [song, setSong] = useState(null); 
  const [error, setError] = useState(null);
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity:null,
    message: null
  });
  const [songId, setSongId] = useState(null);


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

  // On récupère tous les genres pour les proposer dans le formulaire
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://projet-web-back.onrender.com/genres');
        setGenres(response.data);
      } catch (error) {
        setError("Error");
        if (error.response && error.response.status === 404) {
          setError('404 - Not Found');
        } else {
          setError('Unable to fetch data from server');
        }
      }
    };
  
    fetchData();
  }, []);

  const handleSongNameChange = (event) => {
    setSongName(event.target.value);
    };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Faites quelque chose avec le fichier, par exemple l'enregistrer dans le state songImage
    setSongImage(file);
  };

  const handleSongChange = (event) => {
    const file = event.target.files[0];
    // Faites quelque chose avec le fichier, par exemple l'enregistrer dans le state song
    setSong(file);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Créez un nouvel objet FormData
    const formData = new FormData(event.currentTarget);
    

    //Vérification des champs vide
    if(formData.get("songName")=="" || formData.get("genre") == "" || formData.get("songImage") == null || formData.get("song") == null){
      setSnackBar({
        open: true,
        severity: "warning",
        message: "Tous les champs sont obligatoires !"
      })
      return;
    }
    
    console.log("songName : " + formData.get("songName"));
    console.log("genre : " + formData.get("genre"));
    console.log(typeof formData.get("genre"));
    console.log("songImage : " + formData.get("songImage"));
    console.log("song : " + formData.get("song"));

    axios.post('https://projet-web-back.onrender.com/songs/create', {
      songName: formData.get("songName"),
      genre: parseInt(formData.get("genre")),
      id_member: user,
      }, {
      headers: {
          Authorization: `Bearer ${token}`
      },
    
    }).then(response => {
      const newSong = response.data;
      const idSong = newSong.id_song;
      setSongId(idSong);
      console.log("idSong : " + idSong);
      // Envoi de l'image

      // Envoi de la musique

      const formDataFiles = new FormData();

      // Ajout de l'image
      formDataFiles.append("songImage", songImage, `${idSong}.jpg`);

      // Ajout de l'audio
      formDataFiles.append("song", song, `${idSong}.mp3`);

      console.log("formDataFiles : ");
      console.log(formDataFiles.get("songImage"));
      console.log(formDataFiles.get("song"));
      // Envoi de l'image et de l'audio
      axios.post(`https://projet-web-back.onrender.com/songs/upload/${idSong}`, formDataFiles, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }).then(response => {
        // Succès de l'envoi de l'image et de l'audio
        console.log("Succès de l'envoi de l'image et de l'audio");
        setSnackBar({
          open: true,
          severity: "success",
          message: "Musique ajoutée avec succès !"
        })
      }).catch(error => {
        console.log("Erreur lors de l'envoi de l'image et/ou de l'audio");
        // Erreur lors de l'envoi de l'image et/ou de l'audio
      });
  
      
    }).catch(error => {
      setSnackBar({
        open: true,
        severity: "error",
        message: "Impossible d'ajouter la musique !"
      })
      console.log(error);
    });
  
  };
  

  return (
    <ThemeProvider theme={theme}>  
      <Container component="main" maxWidth="xs">
      <GlobalSnackbar snackbar={snackBar} setSnackbar={setSnackBar} vertical='bottom' horizontal='right' />
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Ajouter une musique
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }} enctype="multipart/form-data">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="songName"
                  name="songName"
                  required
                  fullWidth
                  id="songName"
                  label="Nom de la musique"
                  autoFocus
                  onChange={handleSongNameChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl required fullWidth>
                    <InputLabel id="genre">Genre</InputLabel>
                    <Select
                        labelId="genre"
                        id="demo-simple-select"
                        value={selectedGenre}
                        label="Genre *"
                        name='genre'
                        required
                        onChange={handleGenreChange}    
                    >
                        {genres?.map((item) => (
                        <MenuItem key={item.id_genre} value={item.id_genre}>
                            {item.genre_name}
                        </MenuItem>
                        ))}
                    </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="songImage">Cover de la musique</InputLabel>
                <Input
                type="file"
                id="songImage"
                name = "songImage"
                required
                onChange={handleFileChange}
                />
                
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="song">Musique</InputLabel>
                <Input
                type="file"
                id="song"
                name="song"
                required
                onChange={handleSongChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Ajouter
            </Button>
          </Box>
        </Box>   
      </Container>
    </ThemeProvider>           
    );
}
