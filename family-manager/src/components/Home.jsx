import React, { useState, useEffect } from 'react';
import { auth, provider } from '../firebase.js';
import SharedCalendar from './SharedCalendar.jsx';
import EmptyCalendar from './EmptyCalendar.jsx';
import ShoppingList from './ShoppingList.jsx';
import ChildrenTasks from './ChildrenTasks.jsx';
import Grid from '@material-ui/core/Grid';
import Head from "./NavBar.jsx"
import { teal } from '@material-ui/core/colors';
import {createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

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
            });
    }

    const myTheme = createMuiTheme({
        palette: {
          primary: {
            main: teal[600],
          },
          secondary: {
              main: "#f7b82f"
          }
        },
      });

    /**
     * Renders a blank calendar when not logged in, renders calendar with user data when logged in
     */
        return (
           
            <div>
                 <ThemeProvider theme={myTheme}>
                {user !== null ?
                    <div>
                        
                        <Head loginAction={logout} login={true} userEmail={user.email} usersName={user.displayName} theme={myTheme}/>
                        {/* <button onClick={this.logout}>Log Out</button> */}
                        {/* <SharedCalendar userEmail={user.email} usersName={user.displayName}/> */}

                        {/* <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <ShoppingList userEmail={user.email}/>
                            </Grid>

                            <Grid item xs={4}>
                            <ChildrenTasks userEmail={user.email}/>
                            </Grid>
                        </Grid> */}
                        
                    </div>
                :
                    <div>
                        <Head loginAction={login} login={false} />
                        {/* <button onClick={() => login()}>Log In</button> */}
                        {/*<EmptyCalendar />*/}
                    </div>
                }   
                </ThemeProvider>
            </div>
        )
}

export default Home;