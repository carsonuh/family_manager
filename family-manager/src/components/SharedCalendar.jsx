import React, { Component } from 'react';
import firebase from '../firebase.js';
import { Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

//setup time localizer
const localizer = momentLocalizer(moment);

const CalendarStyles = {
    calendarContainer: {
        height: "750px",
        width: "75%",
        margin: "0 auto"
    }
}

/**
 * This is the shared calendar that displays user data
 * Data is stored in firebase
 */
class SharedCalendar extends Component {
    constructor(props){
        super(props);

        //Initialize usersName and userEmail via props passed in from the parent
        this.state = {
            user: null,
            usersName: this.props.usersName,
            userEmail: this.props.userEmail, 
            fireDocId: null,
            events: [],
        };
        
        this.fetchUserData = this.fetchUserData.bind(this);
        this.checkIfUserExists = this.checkIfUserExists.bind(this);
        this.updateStorage = this.updateStorage.bind(this);
    }

    /**
     * The initial user data retrival call
     */
    componentDidMount() {
        //Upon loading the component, check to see if a user exists
        //Return data into the callback and execute a data update
        this.checkIfUserExists(this.fetchUserData)
    }

    /**
     * Checks to see if a signed in user has data in the DB
     * Returns a boolean of the above condition into the callback
     * @param {callback function} callback 
     */
    checkIfUserExists(callback) {
        //Connect to the firebase DB
        const db = firebase.firestore();

        //Query the DB to see if the users email is present
        db.collection("UserCalendarData").where("email", "==", this.state.userEmail)
            .get()
            .then((querySnapshot) => {
                let userExists = false;

                //If the email isn't present, the user doesn't exist
                if(querySnapshot.size === 0) {
                    userExists = false;
                } else {
                    //If the email does exist, update the firestore document ID in state
                    this.setState({fireDocId: querySnapshot.docs[0].id});
                    userExists = true;
                }
                callback(userExists)
            })
            .catch((error) => {
                console.log("Error Getting Documents! " + error);
            });
    }

    /**
     * Loads user data into the calendar via a DB call and a state update
     * @param {whether a user exists} userExists 
     */
    fetchUserData(userExists) {

        //If a user exists pull their event data from the DB
        if(userExists) {
            console.log('user exists, fetching data');
            const db = firebase.firestore();
            db.collection("UserCalendarData").doc(this.state.fireDocId)
                .get()
                .then((doc) => {
                    if(doc) {
                        let returnedData = doc.data().events;

                        //Firebase returns time in the form of seconds from EPOCH
                        //toDate() converts it into a useable format
                        for(let i = 0; i < returnedData.length; i++) {
                            returnedData[i].start = returnedData[i].start.toDate();
                            returnedData[i].end = returnedData[i].end.toDate();
                        }
                        this.setState({events: returnedData});
                    } else {
                        console.log('Counldnt find user data');
                    }
                })
                .catch((error) => {
                    console.log("error fetching existing user data! " + error);
                })
        } else {
            //This block is executed if it's a users first time logging in
            alert("Welcome, Start by adding some data to the calendar");
            
            //Create an entry in the DB for the new user, update the doc ref
            //with the one retuned from add()
            const db = firebase.firestore();
            db.collection("UserCalendarData").add({
                email: this.state.userEmail,
                name: this.state.usersName,
                events: []
            }).then((docRef) => {
                this.setState({fireDocId: docRef});
            })
            .catch((error) => {
                console.log("error submitting first time user data" + error); 
            })
        }
    }

    /**
     * When a new event is added send it to the DB 
     * @param {new event data} eventData 
     */
    updateStorage(eventData) {
        const db = firebase.firestore();
        const userRef = db.collection("UserCalendarData").doc(this.state.fireDocId).update({
            events: firebase.firestore.FieldValue.arrayUnion(eventData)
        });
    }

    /**
     * Called when a date is selected on the calendar, 
     * Updates the components event list in state, calls a 
     * method to send the new event to the DB
     */
    handleSelect = ({ start, end }) => {
        const title = window.prompt('Enter Event Name');
        if (title)
            this.setState({
                events: [
                    ...this.state.events,
                    {
                        title, 
                        start,
                        end
                    },
                ],
            });
        this.updateStorage({title, start, end});
    }

    render() {
        return(
            <div style={CalendarStyles.calendarContainer}>
                <Calendar
                    selectable
                    localizer={localizer}
                    events={this.state.events}
                    startAccess="start"
                    endAccessor="end"
                    onSelectEvent={event => alert(event.title)}
                    onSelectSlot={this.handleSelect}
                />
            </div>
        )
    }
}

export default SharedCalendar;
