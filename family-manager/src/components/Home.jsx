import React, { useState, useEffect } from 'react';
import { auth, provider } from '../firebase.js';
import Head from "./NavBar.jsx"
import HomeView from "./HomeView"

/**
 * Home Component, Displays the home page and calendar component
 */
    function Home() {
    
        const [user, setUser] = useState(null);
    
    /**
     * Checks the users previous session state to see if they were logged in
     * If they were, keep them logged in
     */
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            }
        });
    }, []);

    /**
     * Executes firebase auth to launch google signin
     */
    function login() {
        return auth.signInWithPopup(provider)
            .then((result) => {
               setUser(result.user);
            });
    }

    /**
     * Executes a logout with firebase auth
     */
    let logout = () => {
       return auth.signOut()
            .then(() => {
               setUser(null);
               refresh();
            });
    }

    let refresh = () => {
        window.location.reload(true);
    }

    /**
     * Renders a blank calendar when not logged in, renders calendar with user data when logged in
     */
        return (
            <div>
                {user !== null ?
                    <div>
                        <Head loginAction={logout} login={true} userEmail={user.email} usersName={user.displayName} />
                    </div>
                        :
                    <div>
                        <Head loginAction={login} login={false} />
                        <HomeView />
                    </div>
                }   
            </div>
        )
}

export default Home;