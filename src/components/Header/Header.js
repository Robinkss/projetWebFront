import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";


function Header() {
    const [isConnected, setIsConnected] = useState(false);
    const [toggleMenu, setToggleMenu] = useState(false);
    const [largeur, setLargeur] = useState(window.innerWidth);

    function toggleNavSmallScreen(){
        setToggleMenu(!toggleMenu);
    }

    useEffect(() => {

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
            {(toggleMenu || largeur > 500) && (
                <ul className={styles.liste}>
                    <li className={styles.items}><Link to='/'>Home</Link></li>
                    {isConnected                   
                        ? <li className={styles.items}><Link to='/profil'>Mon profil</Link></li>
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
        // <div className={styles.header}>
        //     <header className={styles.main}>
        //         <div className={styles.container}>
        //             <div className={styles.logo}>
        //                 <Link to='/'>
        //                     <img src='./images/logo.png' alt='Logo Unearth' />
        //                 </Link>
                        
        //             </div>
        //             <div className={styles.nav}>
        //                 <div className={styles.search}>
        //                     <input type='search' placeholder='Rechercher' />
        //                     <div className={styles.icon}>
        //                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
        //                             <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        //                         </svg>

        //                     </div>
        //                 </div>
        //                 <nav className={styles.links}>
        //                     <ul>
        //                         <li><Link to="/">Home</Link></li>
        //                     </ul>
        //                 </nav>
        //                 <div className={styles.user}>
        //                     {isConnected ? 
        //                     (<div className={styles.avatar}>
        //                         <img src='./images/default_avatar.png' alt='user' />
        //                     </div>) 
        //                     :
        //                     <nav className={styles.links}>
        //                         <ul>
        //                             <li><Link to="/login" className={styles.login}>Connexion</Link></li>
        //                             <li><Link to="/signUp" className={styles.login}>Inscription</Link></li>
        //                         </ul>                            
        //                     </nav>                    
        //                     }
        //                 </div>
        //                 {/* <div className={styles.dropdown} onClick={() => toggleDropdown()}>
        //                     <div className={dropdownIsOpen ? `${styles.dropdownIcon} ${styles.reverse}` : `${styles.dropdownIcon}`}>
        //                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        //                             <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
        //                         </svg>
        //                     </div>
        //                 </div> */}
        //             </div>
        //         </div>
        //     </header>
        // </div>
    );
}


export default Header;