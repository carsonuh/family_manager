import React, { Component } from 'react';
import {
    MuiPickersUtilsProvider,
    DatePicker,
    TimePicker
  } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MomentUtils from '@date-io/moment';
import firebase from '../firebase.js';
import { Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';



//TODO: On form for adding a user, specify if they are a child. If so, add that info to the DB
//Under the child we can have a list of tasks


//setup time localizer
const localizer = momentLocalizer(moment);

const CalendarStyles = {
    calendarContainer: {
        height: "750px",
        width: "75%",
        margin: "0 auto"
    },
    editFormContainer: {
        height: "500px",
        width: "500px",
        margin: "0 auto",
        marginTop: "50px"
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
            showEditForm: false,
            userEventTitle: "null",
            userEventStart: "null",
            userEventEnd: "null",
        };
        
        this.fetchUserData = this.fetchUserData.bind(this);
        this.checkIfUserExists = this.checkIfUserExists.bind(this);
        this.updateStorage = this.updateStorage.bind(this);
        this.handleShow = this.handleShow.bind(this);
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
                        console.log(returnedData);
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
                this.setState({fireDocId: docRef.id});
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
     * Called when the user clicks update when editing an event,
     * updates local array of events and sends an update to the DB
     */
    editEventInStorage = () => {
        let updatedEvent = {
            title: this.state.userEventTitle,
            start: new Date(this.state.userEventStart),
            end: new Date (this.state.userEventEnd)
        }

        //Store the events in a local array and then update the event that was modified
        let eventArray = [...this.state.events];
        let eventToRemove = eventArray.map((item) => item.title).indexOf(updatedEvent.title);
        eventArray.splice(eventToRemove, 1);
        eventArray.push(updatedEvent)
        this.setState({events: eventArray});

         const db = firebase.firestore();
         db.collection("UserCalendarData").doc(this.state.fireDocId).update({
             events: [...eventArray]
         });
    }

    /**
     * Callend when the user clicks delete when editing an event,
     * updates local array of events and sends an update to the DB
     */
    deleteEventInStorage = () => {
        let updatedEvent = {
            title: this.state.userEventTitle,
            start: new Date(this.state.userEventStart),
            end: new Date (this.state.userEventEnd)
        }

        //Remove the selected event from the local event array, then update state with the new event array
        let eventArray = [...this.state.events];
        let eventToRemove = eventArray.map((item) => item.title).indexOf(updatedEvent.title);
        eventArray.splice(eventToRemove, 1);
        this.setState({events: eventArray});

        const db = firebase.firestore();
        db.collection("UserCalendarData").doc(this.state.fireDocId).update({
            events: [...eventArray]
        });
    }

    /**
     * Called when a date is selected on the calendar, 
     * Updates the components event list in state, calls a 
     * method to send the new event to the DB
     */
    handleSelect = ({ start, end }) => {
        const title = window.prompt('Enter Event Name');
        if (title) {
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
        } else {
            console.log("User didn't complete event info. Doing nothing/")
        }
    }

    handleClose = () => this.setState({showEditForm: false})

    handleShow(event) {
        this.setState({
            userEventTitle: event.title.toString(), 
            userEventStart: moment.utc(event.start).format('LLL').toString(), 
            userEventEnd: moment.utc(event.end).format('LLL').toString(), 
            showEditForm: true
        });
    }

    handleStartDateChange = (e) => this.setState({userEventStart: e._d});
    handleEndDateChange = (e) => this.setState({userEventEnd: e._d});
    handleTitleChange = (e) => this.setState({userEventTitle: e.target.value});

    render() {
        return(
        <div>
            <div style={CalendarStyles.calendarContainer}>
                <Calendar
                    selectable
                    localizer={localizer}
                    events={this.state.events}
                    startAccess="start"
                    endAccessor="end"
                    onSelectEvent={event => this.handleShow(event)}
                    onSelectSlot={this.handleSelect}
                />
            </div>
            <div>
                {this.state.showEditForm ? 
                   <div style={CalendarStyles.editFormContainer}>
                        Edit Form 
                        <form>
                            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                                <DatePicker 
                                //   variant="inline"
                                  format="MM/DD/YYYY"
                                  margin="normal"
                                  label="Start Date"
                                  value={this.state.userEventStart}     
                                  onChange={date => this.handleStartDateChange(date)}   
                                />
                                <DatePicker 
                                //   variant="inline"
                                  format="MM/DD/YYYY"
                                  margin="normal"
                                  label="End Date"
                                  value={this.state.userEventEnd}
                                  onChange={date => this.handleEndDateChange(date)}
                                />
                                <TimePicker
                                  autoOk 
                                  label="Start Time"
                                  value={this.state.userEventStart}
                                  onChange={time => this.handleStartDateChange(time)}
                                />
                                <TimePicker
                                  autoOk 
                                  label="End Time"
                                  value={this.state.userEventEnd}
                                  onChange={time => this.handleEndDateChange(time)}
                                />
                                <TextField label="Event Title" value={this.state.userEventTitle} onChange={title => this.handleTitleChange(title)} />
                            </MuiPickersUtilsProvider>
                            <Button variant="contained" color="primary" onClick={this.editEventInStorage}>Submit</Button>
                            <Button variant="contained" color="primary" onClick={this.deleteEventInStorage}>Delete Event</Button>
                            <Button variant="contained" color="primary" onClick={this.handleClose}>Close</Button>

                        </form>
                   </div>
                   :
                   <div></div> 
                }
            </div>
        </div>

        )
    }
}

export default SharedCalendar;
