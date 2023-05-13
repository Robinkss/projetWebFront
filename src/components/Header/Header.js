import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";


function Header() {
    const [isConnected, setIsConnected] = useState(false);
    const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

    function toggleDropdown(){
        setDropdownIsOpen(!dropdownIsOpen);
    }

    return (
        <div className={styles.header}>
            <header className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.logo}>
                        <Link to='/'>
                            <img src='./images/logo.png' alt='Logo Unearth' />
                        </Link>
                    </div>
                    <div className={styles.nav}>
                        <div className={styles.search}>
                            <input type='search' placeholder='Rechercher' />
                            <div className={styles.icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>

                            </div>
                        </div>
                        <nav className={styles.links}>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                            </ul>
                        </nav>
                        <div className={styles.user}>
                            {isConnected ? (<div className={styles.avatar}>
                                <img src='./images/default_avatar.png' alt='user' />
                            </div>) : <Link to="/login" className={styles.login}>Connexion</Link>}
                        </div>
                        <div className={styles.dropdown} onClick={() => toggleDropdown()}>
                            <div className={dropdownIsOpen ? `${styles.dropdownIcon} ${styles.reverse}` : `${styles.dropdownIcon}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className={dropdownIsOpen ? `${styles.submenu} ${styles.active}` : `${styles.submenu}`}>
                <div className={styles.container}>
                    <div className={styles.links}>
                        <ul>
                            <li><Link to='/'>Rap</Link></li>
                            <li><Link to='/'>Rock</Link></li>
                            <li><Link to='/'>RnB</Link></li>
                            <li><Link to='/'>Electro</Link></li>
                            <li><Link to='/'>Soul</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Header;