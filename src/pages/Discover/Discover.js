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
//import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://projet-web-front.onrender.com/">
        Unearth
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const theme = createTheme();

export default function Discover() {

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [imageURLs, setImageURLs] = useState([]);
    const [isWaiting, setIsWaiting] = useState(true);
    
    async function getImage(genre_name) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/genres/image/${genre_name}`, { responseType: 'arraybuffer' });
        const image = new Blob([response.data], { type: 'image/jpeg' });
        const imageURL = URL.createObjectURL(image);
        console.log(imageURL);
        return imageURL;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
    
    

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/genres`);
          
          setData(response.data);
          console.log(data);
          const imagePromises = response.data.map(item => getImage(item.genre_name));
          const urls = await Promise.all(imagePromises);
          setImageURLs(urls);
          setIsWaiting(false);
        } catch (error) {
          setError("Error");
          if (error.response && error.response.status === 404) {
            console.log("ICI");
            setError('404 - Not Found');
          } else {
            setError('Unable to fetch data from server');
          }
        }
      };
    
      fetchData();
    }, []);

    


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Container sx={{ py: 8 }} maxWidth="md">
        <h1>Parcourez par genres</h1>
          <Grid container spacing={4}>
            {error ?  (
            <p>{error}</p>
            ) : (
                data.map((item, index) => (
                    <Grid item key={item.id_genre} xs={12} sm={6} md={4}>
                      <Card
                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                      >
                        {isWaiting 
                          ? <CircularProgress />
                          : <CardMedia
                          component="img"
                          sx={{
                            // 16:9
                            pt: '0%',
                          }}
                          //image={`./images/genres/${item.genre_name}.jpg`}
                          image={imageURLs[index]}
                          alt="random"
                        />
                        }
                        
                        
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {item.genre_name}
                          </Typography>
                          <Typography>
                            {item.genre_description}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small"><Link to={`/${item.id_genre}`} state={{ genre: item }}>Parcourir</Link></Button>
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



