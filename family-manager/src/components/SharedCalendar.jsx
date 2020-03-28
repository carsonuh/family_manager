import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import firebase from '../firebase.js';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SharedCalendarService from '../Services/SharedCalendarService.js';
import AddEvent from './AddEvent.jsx';
import EditEvent from './EditEvent.jsx';
import moment from 'moment';

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
    constructor(props) {
        super(props);

        //Initialize usersName and userEmail via props passed in from the parent
        this.state = {
            user: null,
            usersName: this.props.usersName,
            userEmail: this.props.userEmail,
            masterUser: false,
            fireDocId: null,
            events: [],
            showEditForm: false,
            showShareField: false,
            userEventTitle: "null",
            userEventStart: "null",
            userEventEnd: "null",
            userEventId: 0,
            userEventOwner: "null",
            userEventVisbility: "null",
            emailToShare: "null",
            childChecked: false,
            isChild: false,
            showEventForm: false,
        };

        this.updateStorage = this.updateStorage.bind(this);
        this.handleShow = this.handleShow.bind(this);

        this.sharedCalendarService = new SharedCalendarService();
    }

    /**
     * The initial user data retrival call
     */
    componentDidMount() {
        //Upon loading the component, check to see if a user exists
        //Return data into the callback and execute a data update
         this.sharedCalendarService.checkIfUserExists(this.userExists, this.state.userEmail);
         this.sharedCalendarService.checkIfUserIsChild(this.isChild, this.state.userEmail);
    }

    userExists = (e, fireDocId) => {
        let userEmail = this.state.userEmail;
        if (e) {
            this.setState({ fireDocId: fireDocId });
            this.sharedCalendarService.fetchUserData(true, this.loadData, userEmail, this.state.fireDocId);
        } else {
            this.sharedCalendarService.fetchUserData(false, this.newUser, userEmail);
        }
    } 

    loadData = (returnedUserData) => {
        let eventData = returnedUserData.returnedData.filter(event => event.visibility == "public" || event.visibility == this.state.userEmail);
        this.setState({events: eventData, masterUser: returnedUserData.isMasterUser});
    }

    newUser = (userType, fireDocId) => {
        if (userType == 1) {
            alert("Welcome, Start by adding some data to the calendar");
            this.sharedCalendarService.loadNewOrSharedUser(userType, this.loadData2, {userEmail: this.state.userEmail, userName: this.state.usersName});
        } 
        else if (userType == 2) {
            this.setState({fireDocId: fireDocId});
            this.sharedCalendarService.loadNewOrSharedUser(userType, this.loadData2, null, this.state.fireDocId)
        }
    }

    loadData2 = (returnedUserData) => {
        if (returnedUserData.type == 1) {
            this.setState({fireDocId: returnedUserData.fireDocId, masterUser: true});
        } else {
            let eventData = returnedUserData.filter(event => event.visibility == "public" || event.visibility == this.state.userEmail);
            this.setState({events: eventData});
        }
    }

    isChild = (returnedData) => {
        if (returnedData) {
            this.setState({isChild: true});
        } else {
            this.setState({isChild: false});
        }
    }

    /**
     * When a new event is added send it to the DB 
     * @param {new event data} eventData 
     */
    updateStorage(eventData) {

        let newEvent = {
            title: eventData.title,
            start: eventData.start,
            end: eventData.end,
            id: eventData.id,
            visibility: eventData.visibility,
            owner: eventData.owner
        }

        const db = firebase.firestore();
        const userRef = db.collection("UserCalendarData").doc(this.state.fireDocId).update({
            events: firebase.firestore.FieldValue.arrayUnion(newEvent)
        });
    }

    /**
     * Called when the user clicks update when editing an event,
     * updates local array of events and sends an update to the DB
     */
    editEventInStorage = (editedEvent) => {
        let updatedEvent = {
            title: editedEvent.eventTitle,
            start: new Date(editedEvent.eventStart),
            end: new Date(editedEvent.eventEnd),
            id: editedEvent.id,
            owner: editedEvent.owner,
            visibility: editedEvent.visibility
        }

        //Store the events in a local array and then update the event that was modified
        let eventArray = [...this.state.events];
        let eventToRemove = eventArray.map((item) => item.id).indexOf(updatedEvent.id);
        eventArray.splice(eventToRemove, 1);
        eventArray.push(updatedEvent)
        this.setState({ events: eventArray });

        const db = firebase.firestore();
        db.collection("UserCalendarData").doc(this.state.fireDocId).update({
            events: [...eventArray]
        });

        this.setState({ showEditForm: false });
    }

    /**
     * Callend when the user clicks delete when editing an event,
     * updates local array of events and sends an update to the DB
     */
    deleteEventInStorage = (eventToDelete) => {
        console.log('here')
        let updatedEvent = {
            title: eventToDelete.eventTitle,
            start: eventToDelete.eventStart,
            end: eventToDelete.eventEnd
        }

        //Remove the selected event from the local event array, then update state with the new event array
        let eventArray = [...this.state.events];
        let eventToRemove = eventArray.map((item) => item.title).indexOf(updatedEvent.title);
        eventArray.splice(eventToRemove, 1);
        this.setState({ events: eventArray });

        const db = firebase.firestore();
        db.collection("UserCalendarData").doc(this.state.fireDocId).update({
            events: [...eventArray]
        });

        this.setState({ showEditForm: false });
    }

    /**
     * Called when a date is selected on the calendar, 
     * Updates the components event list in state, calls a 
     * method to send the new event to the DB
     */
    
    addEvent = (newEventData) => {
        const newEvent = {...newEventData};
        let title = newEvent.eventTitle;
        let start = new Date(newEvent.eventStartDate);
        let end = new Date(newEvent.eventEndDate);
        let visibility = newEventData.visibility;
        let owner = newEventData.owner;
        let id = Math.floor(Math.random() * 1000000);
        this.setState({
             events: [
                 ...this.state.events,
                 {
                     title,
                     start,
                     end,
                     id,
                     visibility,
                     owner
                 }
             ]
         }, () => console.log(this.state.events));
         this.updateStorage({title, start, end, id, visibility, owner});
    }

    shareCalendar = (e) => {
        e.preventDefault();
        const db = firebase.firestore();
        let emailToShare = this.state.emailToShare;
        let isChild = this.state.childChecked;
        db.collection("UserCalendarData").doc(this.state.fireDocId).update({
            sharedUsers: firebase.firestore.FieldValue.arrayUnion(emailToShare)
        });

        //If the added email was a child, add them to the child array in the db
        if (isChild) {
            db.collection("UserCalendarData").doc(this.state.fireDocId).update({
                children: firebase.firestore.FieldValue.arrayUnion(emailToShare)
            })
        }
    }

    handleClose = () => this.setState({ showEditForm: false });
    toggleShareField = () => this.setState({ showShareField: !this.state.showShareField });

    handleShow(event) {
        this.setState({
            userEventTitle: event.title.toString(),
            userEventStart: event.start.toString(),
            userEventEnd: event.end.toString(),
            userEventId: event.id.toString(),
            userEventOwner: event.owner.toString(),
            userEventVisbility: event.visibility.toString(),
            showEditForm: true
        });
    }



    handleEmailShare = (e) => this.setState({ emailToShare: e.target.value })

    handleChildChecked = () => this.setState({childChecked: !this.state.childChecked});



    toggleAddEventForm = () => this.setState({showEventForm: !this.state.showEventForm});

    render() {
        return (
            <div>
                <div style={CalendarStyles.calendarContainer}>
                    <Calendar
                        // selectable
                        localizer={localizer}
                        events={this.state.events}
                        startAccess="start"
                        endAccessor="end"
                        onSelectEvent={event => this.handleShow(event)}
                    />
                </div>
                <div>
                    <Button variant="contained" color="primary" onClick={this.toggleAddEventForm}>Add Event</Button>
                    {this.state.showEventForm && !this.state.isChild ?
                         <AddEvent 
                            addEvent={(newEvent) => this.addEvent(newEvent)} 
                            toggleAddEvent={this.toggleAddEventForm}
                            userEmail={this.state.userEmail}
                        />
                     :
                        <div></div>
                    }
                </div>
                <div>
                {this.state.showEditForm && !this.state.isChild ?
                        <div>  
                            <EditEvent 
                                key={this.state.userEventId} 
                                userEventData={{
                                    eventStart: this.state.userEventStart, 
                                    eventEnd: this.state.userEventEnd, 
                                    eventTitle: this.state.userEventTitle,
                                    id: this.state.userEventId,
                                    owner: this.state.userEventOwner,
                                    visibility: this.state.userEventVisbility
                                }}
                                editCallback={event => this.editEventInStorage(event)}
                                deleteCallback={event => this.deleteEventInStorage(event)}
                                closeCallback={this.handleClose}
                                userEmail={this.state.userEmail}
                            />
                        </div>
                        :
                        <div></div>
                    }
                </div>
                <div>
                    {
                        this.state.masterUser ?
                            <button variant="contained" color="primary" onClick={this.toggleShareField}>Share Calendar</button>
                            :
                            <div></div>
                    }
                    {
                        this.state.showShareField ?
                            <div>
                                <TextField label="Enter Email to Share" onChange={emailToShare => this.handleEmailShare(emailToShare)} />
                                <Button variant="contained" color="primary" onClick={this.shareCalendar}>Share</Button>
                                <FormControlLabel 
                                    control={<Checkbox checked={this.state.childChecked} onChange={this.handleChildChecked} name="check"/>}
                                    label="Is this a child?"
                                />
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
