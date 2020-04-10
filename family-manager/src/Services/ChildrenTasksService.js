import firebase from '../firebase.js';


export default class ChildrenTasksService {
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
                        let childrenTasks = doc.data().childrenTasks;
                        console.log(childrenTasks)
                    
                        let myChildren = doc.data().children;
                        console.log(myChildren)


                        let isMasterUser = doc.data().masterUser === email ? true : false;


                        callback({childrenTasks, myChildren, isMasterUser});

                    } else {
                        console.log('Counldnt find user data');
                    }
                })
                .catch((error) => {
                    console.log("error fetching existing user data! " + error);
                })
        } 
    }

    realTime(callback, fireDocId) {
        const db = firebase.firestore();
        db.collection("UserCalendarData").doc(fireDocId)
                .onSnapshot((doc) => {

                    let childrenTasks = doc.data().childrenTasks;

                    console.log("Current data: ", childrenTasks);
                    callback({childrenTasks});
                });
    }
}