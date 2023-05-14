import styles from "./Discover.module.scss";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
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

export default function Album() {

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() =>{
        axios.get('http://localhost:3001/genres')
        .then(response => {
            setData(response.data);
            console.log(data);
        })
        .catch(error => {
            setError("Error")
            if (error.response && error.response.status === 404) {
            setError('404 - Not Found');
            } else {
            setError('Unable to fetch data from server');
            }
        });
    }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <h1>TODO Genres</h1>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {error ?  (
            <p>{error}</p>
            ) : (
                data.map((item) => (
                    <Grid item key={item.id_genre} xs={12} sm={6} md={4}>
                      <Card
                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                      >
                        <CardMedia
                          component="img"
                          sx={{
                            // 16:9
                            pt: '56.25%',
                          }}
                          image={`./images/genres/${item.genre_name}.jpg`}
                          alt="random"
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {item.genre_name}
                          </Typography>
                          <Typography>
                            {item.genre_description}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small">Parcourir</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
            )
            }
            
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}

function Discover(){
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() =>{
        axios.get('http://localhost:3001/genres')
        .then(response => {
            setData(response.data);
            console.log(data);
        })
        .catch(error => {
            setError("Error")
            if (error.response && error.response.status === 404) {
            setError('404 - Not Found');
            } else {
            setError('Unable to fetch data from server');
            }
        });
    }, []);
    return (
        <div className={styles.container}>
            {error ? (
            <p>{error}</p>
            ) : (
            data.map(item => (
                <p key={item.id_genre}>{item.genre_name}</p>
            ))
            )}
      </div>
            
        
        
    );
}

