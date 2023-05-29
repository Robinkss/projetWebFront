import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate} from "react-router-dom";
import styles from "./Header.module.scss";
import { AuthContext } from '../AuthContext/AuthContext';
import Cookies from 'js-cookie';

function Header() {
    //const [isConnected, setIsConnected] = useState(isConnect);
    const authCtx = useContext(AuthContext);
    const isConnected = authCtx.isAuthenticated;
    const isAdmin = authCtx.isAdmin;
    const [toggleMenu, setToggleMenu] = useState(false);
    const [largeur, setLargeur] = useState(window.innerWidth);
    const navigate = useNavigate();

    function toggleNavSmallScreen(){
        setToggleMenu(!toggleMenu);
    }

    function handleDeconnect(){
        Cookies.remove('token');
        Cookies.remove('id_member');
        Cookies.remove('admin');
        authCtx.setIsAuthenticated(false); 
        authCtx.setIsAdmin(false);
        console.log('token supprimé');
        console.log(Cookies.get('token'));
    }

    useEffect(() => {
        
        if (Cookies.get('token') !== undefined){
            authCtx.setIsAuthenticated(true);
        }

        if (Cookies.get('admin') !== undefined && Cookies.get('admin') === 'true'){
            authCtx.setIsAdmin(true);
        }

        const changeWidth = () => {
            setLargeur(window.innerWidth);

            if(window.innerWidth > 500){
                setToggleMenu(false);
            }
        }

        window.addEventListener('resize', changeWidth);

        return () => {
            window.removeEventListener('resize', changeWidth);
        }
    }, [])

    return (
        <nav>
            <div className={styles.unearth}>
                <img alt='Logo  Unearth' src='./images/logo.png'/>
                <h1>Unearth</h1>
            </div>    
            {(toggleMenu || largeur > 500) && (
                <ul className={styles.liste}>
                    <li className={styles.items}><Link to='/'>Home</Link></li>
                    {isConnected                   
                        ?<> <li className={styles.items}><Link to='/profil'>Mon profil</Link></li>
                        {isAdmin && <li className={styles.items}><Link to='/admin'>Admin</Link></li>}
                        <li className={styles.items}><Link to='/' onClick={handleDeconnect}>Se déconnecter</Link></li></>
                        :
                        <>
                        <li className={styles.items}><Link to='/signup'>Inscription</Link></li>
                        <li className={styles.items}><Link to='/login'>Connexion</Link></li></>
                    }
                </ul>                    
            )}    
            <div onClick={toggleNavSmallScreen} className={styles.btn} >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
                </svg>
            </div>

        </nav>
    );
}


export default Header;