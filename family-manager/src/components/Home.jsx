import React, { Component } from 'react';
import { auth, provider } from '../firebase.js';
import SharedCalendar from './SharedCalendar.jsx';
import EmptyCalendar from './EmptyCalendar.jsx';

/**
 * Home Component, Displays the home page and calendar component
 */
class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null
        }

        //Bind class functions
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    /**
     * Checks the users previous session state to see if they were logged in
     * If they were, keep them logged in
     */
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user});
            }
        });
    }

    /**
     * Executes firebase auth to launch google signin
     */
    login() {
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                this.setState({
                    user
                });
            });
    }

    /**
     * Executes a logout with firebase auth
     */
    logout() {
        auth.signOut()
            .then(() => {
                this.setState({
                    user: null
                });
            });
    }

    /**
     * Renders a blank calendar when not logged in, renders calendar with user data when logged in
     */
    render() {
        return (
            <div>
                {this.state.user ?
                    <div>
                        <button onClick={this.logout}>Log Out</button>
                        <SharedCalendar userEmail={this.state.user.email} usersName={this.state.user.displayName}/>
                    </div>
                :
                    <div>
                        <button onClick={this.login}>Log In</button>
                        <EmptyCalendar />
                    </div>
                }   
            </div>
        )
    }
}

export default Home;