import firebase from '../firebase.js';


export default class SettingService {
     /**
     * Loads user data into the calendar via a DB call and a state update
     * @param {whether a user exists} userExists 
     */
    fetchUserData(userExists, email, callback,fireDocId) {
        //If a user exists pull their event data from the DB
        if (userExists) {
            console.log('user exists, fetching data');
            const db = firebase.firestore();
            db.collection("UserCalendarData").doc(fireDocId)
                .get()
                .then((doc) => {
                    if (doc) {
                        let sharedUsers = doc.data().sharedUsers;
                        console.log(sharedUsers)
                    
                        let myChildren = doc.data().children;
                        console.log(myChildren)

                        let isMasterUser = doc.data().masterUser === email ? true : false;

                        let childTasks = doc.data().childrenTasks;


                        callback({sharedUsers, myChildren, isMasterUser, childTasks});

                    } else {
                        console.log('Counldnt find user data');
                    }
                })
                .catch((error) => {
                    console.log("error fetching existing user data! " + error);
                })
        } 
    }
}