import React, { useEffect, useState , useContext} from 'react';
import axios from 'axios';
import {decodeToken} from 'react-jwt';
import Cookies from 'js-cookie';
import { Navigate, Link , useNavigate} from "react-router-dom";
import { AuthContext } from '../components/AuthContext/AuthContext';

function Profil(){
    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [dataUser, setDataUser] = useState(null);
    const [token, setToken] = useState(Cookies.get('token'));
    const [isDeleted, setIsDeleted] = useState(false);
    const [error, setError] = useState(null);

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
        
        const extractIdMemberFromToken = () => {
            try{
                const decodedToken = decodeToken(token);
                const id_member = decodedToken.id_member;
                setUser(id_member);
                console.log('OUIIII');
            }catch(error){
                console.error('Erreur lors du décodage du token :', error);
                setUser(null);
            }
        };

        
        extractIdMemberFromToken();
        
    }, [token]);

    useEffect(() => {
        const fetchData = async () => {
            try{
                if(user){
                    const response = await axios.get(`https://projet-web-back.onrender.com/members/${user}`);
                    setDataUser(response.data);
                    console.log(response.data);
                }else{
                    console.log('PAS OUF');
                }
            }catch(error){
                setError("Error");
                if (error.response && error.response.status === 404) {
                    setError('404 - Not Found');
                } else {
                    setError('Unable to fetch data from server');
                }
            }
        };
        fetchData();
    }, [user]);


    if(isDeleted){
        return <Navigate to="/signup" />
    }
    return (
        
        <body>
            {error ?  (
            <p>{error}</p>
            ) : dataUser && (
                <ul>
                    <li>Pseudo : {dataUser.member_name}</li>
                    <li>Mail : {dataUser.member_mail}</li>  
                </ul>
            )
            
            }
            
                

        </body>                                     
    );
}




export default Profil;