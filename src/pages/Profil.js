import React, { useEffect, useState , useContext} from 'react';
import axios from 'axios';
import {decodeToken} from 'react-jwt';
import Cookies from 'js-cookie';
import { Navigate, Link , useNavigate} from "react-router-dom";
import { AuthContext } from '../components/AuthContext/AuthContext';

function Profil(){
    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(Cookies.get('token'));
    const [isDeleted, setIsDeleted] = useState(false);

    function handleDeleteAccount(){
        console.log('Token :');
        console.log(token);
        axios.delete(`http://localhost:3001/members/delete/${user}`, {
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
            }catch(error){
                console.error('Erreur lors du décodage du token :', error);
                setUser(null);
            }
        };
        extractIdMemberFromToken();
    }, [token]);

    if(isDeleted){
        return <Navigate to="/signup" />
    }
    return (
        
        <body>
            User : {user}
            <button onClick={handleDeleteAccount}>
                Supprimer mon compte
            </button>
        </body>                                     
    );
}




export default Profil;