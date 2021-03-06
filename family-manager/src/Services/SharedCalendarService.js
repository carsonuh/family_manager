import firebase from '../firebase.js';

/**
 * This class acts as a service layer between the firebase cloud storage
 * and the front end, it supports various operations to fetch data from
 * the DB
 */
export default class SharedCalendarService {

    /**
     * Checks to see if a signed in user has data in the DB
     * Returns a boolean of the above condition into the callback
     * @param {callback function} callback 
     */
    checkIfUserExists(callback, userEmail) {
        //Connect to the firebase DB
        const db = firebase.firestore();

        let userExists = false;
        //Query the DB to see if the users email is present
        db.collection("UserCalendarData").where("email", "==", userEmail)
            .get()
            .then((querySnapshot) => {

                //If the email isn't present, the user doesn't exist
                if (querySnapshot.size === 0) {
                    userExists = false;
                } else {
                    //If the email does exist, update the firestore document ID in state
                    // this.setState({ fireDocId: querySnapshot.docs[0].id });
                    userExists = true;
                }

                if (userExists) {
                    callback(userExists, querySnapshot.docs[0].id);
                } else {
                    callback(userExists, "null");
                }
            })
            .catch((error) => {
                console.log("Error Getting Documents! " + error);
            });
    }

     /**
     * Loads user data into the calendar via a DB call and a state update
     * @param {whether a user exists} userExists 
     */
    fetchUserData(userExists, callback, email, fireDocId) {
        //If a user exists pull their event data from the DB
        if (userExists) {
            const db = firebase.firestore();
            db.collection("UserCalendarData").doc(fireDocId)
                .get()
                .then((doc) => {
                    if (doc) {
                        let returnedData = doc.data().events;
                        //Firebase returns time in the form of seconds from EPOCH
                        //toDate() converts it into a useable format
                        for (let i = 0; i < returnedData.length; i++) {
                            returnedData[i].start = returnedData[i].start.toDate();
                            returnedData[i].end = returnedData[i].end.toDate();
                        }

                        let isMasterUser = doc.data().masterUser === email ? true : false;
                        callback({returnedData, isMasterUser});
                    } else {
                        console.log('Counldnt find user data');
                    }
                })
                .catch((error) => {
                    console.log("error fetching existing user data! " + error);
                })
        } else {
            this.checkSharedUser(callback, email)
        }
    }

    /**
     * Queries the DB to see if the current user is in any shared calendar field
     * @param {callback to execute with data returned} callback 
     * @param {user's email} email 
     */
    checkSharedUser(callback, email) {
        //Check to see if the user is included in any shared calendar
         //Connect to the firebase DB
         const db = firebase.firestore();
         let userType = 0;
         //Query the DB to see if the users email is present
         db.collection("UserCalendarData").where("sharedUsers", "array-contains", email)
             .get()
             .then((querySnapshot) => {
                 //If the email isn't present, the user doesn't exist
                 if (querySnapshot.size === 0) {
                     userType = 1;
                     callback(userType, null);
                 } else {
                     //If the email does exist, update the firestore document ID in state
                     userType = 2;
                     callback(userType, querySnapshot.docs[0].id)
                 }
             })
             .catch((error) => {
                 console.log("Error Getting Documents! " + error);
             });
    }

    /**
     * If a user is completely new, a new DB entry is created for them.
     * If an existing calendar has been shared with them, that data
     * will be fetched
     * @param {1 or 2 depending on if the user is new or shared} userType 
     * @param {callback to execute with returned data} callback 
     * @param {user object containing the users email and name} user 
     * @param {the document id in the database} fireDocId 
     */
    loadNewOrSharedUser(userType, callback, user, fireDocId) {
        if (userType === 1) {
            //This block is executed if it's a users first time logging in

            //Create an entry in the DB for the new user, update the doc ref
            //with the one retuned from add()
            const db = firebase.firestore();
            db.collection("UserCalendarData").add({
                email: user.userEmail,
                name: user.userName,
                masterUser: user.userEmail,
                events: [],
                sharedUsers: [],
                children: [],
                childrenTasks: [],
                shoppingList: []
            }).then((docRef) => {
                callback({fireDocId: docRef.id, masterUser: true, type: 1})
            })
            .catch((error) => {
                console.log("error submitting first time user data" + error);
            })
        } else {
            //load shared data
            const db = firebase.firestore();
            db.collection("UserCalendarData").doc(fireDocId)
                .get()
                .then((doc) => {
                    if (doc) {
                        let returnedData = doc.data().events;
                        //Firebase returns time in the form of seconds from EPOCH
                        //toDate() converts it into a useable format
                        for (let i = 0; i < returnedData.length; i++) {
                            returnedData[i].start = returnedData[i].start.toDate();
                            returnedData[i].end = returnedData[i].end.toDate();
                        }
                        // this.setState({ events: returnedData });
                        callback(returnedData)
                    } else {
                        console.log('Counldnt find user data');
                    }
                })
                .catch((error) => {
                    console.log("error fetching existing user data! " + error);
                })
        }
    }

    /**
     * Queries the DB to determine if the users email is included
     * in the children array, if they are, it means they're a child
     * @param {callback to execute with the returned data} callback 
     * @param {the users email} userEmail 
     */
    checkIfUserIsChild(callback, userEmail) {

        const db = firebase.firestore();
        //Query the db to see if the email is in the children array
        db.collection("UserCalendarData").where("children", "array-contains", userEmail)
        .get()
        .then((querySnapshot) => {

            if (querySnapshot.size === 0) {
                callback(false);
            } else {
                callback(true);
            }
        })
        .catch((error) => {
            console.log("Error Getting Documents! " + error);
        });
    }
}