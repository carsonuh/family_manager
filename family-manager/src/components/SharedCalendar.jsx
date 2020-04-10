import React, { Component } from 'react';
import firebase from '../firebase.js';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SharedCalendarService from '../Services/SharedCalendarService.js';
import AddEvent from './AddEvent.jsx';
import EditEvent from './EditEvent.jsx';
import moment from 'moment';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Reminders from './Reminders.jsx';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import TodayIcon from '@material-ui/icons/TodayRounded';
import BackIcon from '@material-ui/icons/ArrowBackIosRounded';
import NextIcon from '@material-ui/icons/ArrowForwardIosRounded';
import "./Calendar.css";
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';


//setup time localizer
const localizer = momentLocalizer(moment);


const CalendarStyles = {

    
    calendarContainer: {
        margin: "auto",
        marginTop: "10px",
        height: window.innerHeight-(window.innerHeight*.08),
        flexGrow:1,
        width: "99.5%",
    },

    buttonIcons: {
        fontSize: "24px",
        cursor: "pointer"
    }
}

let actions = [
    { icon: <CalendarTodayIcon />, name: 'Add Event', operation: 'AddEvent' },
    { icon: <NotificationsIcon />, name: 'Reminders', operation: 'AddRem' },
];



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
            startZip: "null",
            endZip: "null",
            emailToShare: "null",
            childChecked: false,
            isChild: false,
            showEventForm: false,
            showReminderForm: false,
            open: false,
            openSnackbar: false,
            alert: {
                alertMessage: "",
                severity: ""
            },
            loaded: props.loadedCallback
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
        this.setState({view: this.props.view})
    }

    


    userExists = (e, fireDocId) => {
        let userEmail = this.state.userEmail;
        if (e) {
            this.state.loaded()
            this.setState({ fireDocId: fireDocId });
            this.sharedCalendarService.fetchUserData(true, this.loadData, userEmail, this.state.fireDocId);
        } else {
            this.sharedCalendarService.fetchUserData(false, this.newUser, userEmail);
        }
    }

    loadData = (returnedUserData) => {
        let eventData = returnedUserData.returnedData.filter(event => event.visibility === "public" || event.visibility === this.state.userEmail);
        this.setState({ events: eventData, masterUser: returnedUserData.isMasterUser });
    }

    newUser = (userType, fireDocId) => {
        if (userType === 1) {
            alert("Welcome, Start by adding some data to the calendar");
            this.sharedCalendarService.loadNewOrSharedUser(userType, this.loadData2, { userEmail: this.state.userEmail, userName: this.state.usersName });
        }
        else if (userType === 2) {
            this.setState({ fireDocId: fireDocId });
            this.sharedCalendarService.loadNewOrSharedUser(userType, this.loadData2, null, this.state.fireDocId)
        }
    }

    loadData2 = (returnedUserData) => {
        this.state.loaded()
        if (returnedUserData.type === 1) {
            this.setState({ fireDocId: returnedUserData.fireDocId, masterUser: true });
        } else {
            let eventData = returnedUserData.filter(event => event.visibility === "public" || event.visibility === this.state.userEmail);
            this.setState({ events: eventData });
        }
    }

    isChild = (returnedData) => {
        if (returnedData) {
            this.setState({ isChild: true });
            this.filterActions();
        } else {
            this.setState({ isChild: false });
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
            owner: eventData.owner,
            startZip: eventData.startZip,
            endZip: eventData.endZip
        }

        const db = firebase.firestore();
        db.collection("UserCalendarData").doc(this.state.fireDocId).update({
            events: firebase.firestore.FieldValue.arrayUnion(newEvent)
        });
        this.setState({alert: {message: `${newEvent.title} has been added`, severity: "success"}, openSnackbar:true});
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
            visibility: editedEvent.visibility,
            startZip: editedEvent.startZip,
            endZip: editedEvent.endZip
        }

        //Store the events in a local array and then update the event that was modified
        let eventArray = [...this.state.events];
        let eventArrayFiltered = eventArray.filter(event => event.id != updatedEvent.id);
        let eventToRemove = eventArray.find(event => event.id == updatedEvent.id);
        eventArrayFiltered.push(updatedEvent)
        this.setState({ events: eventArrayFiltered });
        const db = firebase.firestore();
        db.collection("UserCalendarData").doc(this.state.fireDocId).update({
            events: firebase.firestore.FieldValue.arrayRemove(eventToRemove)
        });

        db.collection("UserCalendarData").doc(this.state.fireDocId).update({
            events: firebase.firestore.FieldValue.arrayUnion(updatedEvent)
        });

        this.setState({ showEditForm: false });
        this.setState({alert: {message: `${updatedEvent.title} has been updated!`, severity: "success"}, openSnackbar:true});
    }

    /**
     * Callend when the user clicks delete when editing an event,
     * updates local array of events and sends an update to the DB
     */
    deleteEventInStorage = (eventToDelete) => {
        let updatedEvent = {
            title: eventToDelete.eventTitle,
            start: eventToDelete.eventStart,
            end: eventToDelete.eventEnd,
            id: eventToDelete.id
        }

        //Remove the selected event from the local event array, then update state with the new event array
        let eventArray = [...this.state.events];
        let eventToRemove = eventArray.find(event => event.id == updatedEvent.id);
        eventArray.splice(eventArray.indexOf(eventToRemove), 1);
        this.setState({ events: eventArray });

        const db = firebase.firestore();
        db.collection("UserCalendarData").doc(this.state.fireDocId).update({
            events: firebase.firestore.FieldValue.arrayRemove(eventToRemove)
        });

        this.setState({ showEditForm: false });
        this.setState({alert: {message: `${updatedEvent.title} has been deleted!`, severity: "success"}, openSnackbar:true});

    }

    /**
     * Called when a date is selected on the calendar, 
     * Updates the components event list in state, calls a 
     * method to send the new event to the DB
     */

    addEvent = (newEventData) => {
        const newEvent = { ...newEventData };
        let title = newEvent.eventTitle;
        let start = new Date(newEvent.eventStartDate);
        let end = new Date(newEvent.eventEndDate);
        let visibility = newEventData.visibility;
        let owner = newEventData.owner;
        let id = Math.floor(Math.random() * 1000000);
        let startZip = newEventData.eventStartZip;
        let endZip = newEventData.eventEndZip;
        this.setState({
            events: [
                ...this.state.events,
                {
                    title,
                    start,
                    end,
                    id,
                    visibility,
                    owner,
                    startZip,
                    endZip
                }
            ]
        });
        this.updateStorage({ title, start, end, id, visibility, owner, startZip, endZip });
        this.setState({showEventForm: false})
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

    handleShow(event) {
        this.setState({
            userEventTitle: event.title.toString(),
            userEventStart: event.start.toString(),
            userEventEnd: event.end.toString(),
            userEventId: event.id.toString(),
            userEventOwner: event.owner.toString(),
            userEventVisbility: event.visibility.toString(),
            startZip: event.startZip.toString(),
            endZip: event.endZip.toString(),
            showEditForm: true
        });
    }

    handleClose = () => this.setState({ showEditForm: false });
    toggleShareField = () => this.setState({ showShareField: !this.state.showShareField });
    handleEmailShare = (e) => this.setState({ emailToShare: e.target.value })
    handleChildChecked = () => this.setState({ childChecked: !this.state.childChecked });
    toggleAddEventForm = () => this.setState({ showEventForm: !this.state.showEventForm });
    toggleReminderForm = () => this.setState({showReminderForm: false});

    toggleSpeedClose = () => this.setState({ open: false });
    toggleSpeedOpen = () => this.setState({ open: true });

    handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({openSnackbar: false});
    };


    handleSpeed(e, operation) {
        if (operation === "AddEvent") {
            this.setState({showEventForm: true})
        } else {
            this.setState({showReminderForm: true})
        }
        this.setState({open: false});
    }

    filterActions() {
        if (this.state.isChild === true) {
            actions.shift();
        }
    }

    render() {
        return (
            <div style={{height: '100%', width: '100%'}}>
                <div style={CalendarStyles.calendarContainer}>

           
                <Calendar
                        // selectable
                        localizer={localizer}
                        events={this.state.events}
                        startAccessor="start"
                        endAccessor="end"
                        onSelectEvent={event => this.handleShow(event)}
                        defaultView={"month"}
                        views={["month"]}
                        messages = {{
                            previous : <BackIcon style={CalendarStyles.buttonIcons} />,
                            next: <NextIcon style={CalendarStyles.buttonIcons} />,
                            today: <TodayIcon style={CalendarStyles.buttonIcons} />
                            
                        }}
                    
                    />
                

                    <div style={{position:'absolute', width: '50px', height: '50px', bottom: '20vh', right: '5vw', zIndex:10}}>
                        <SpeedDial
                            ariaLabel="SpeedDial example"
                            icon={<SpeedDialIcon />}
                            onClose={this.toggleSpeedClose}
                            onOpen={this.toggleSpeedOpen}
                            open={this.state.open}
                            direction={'up'}
                        >
                            {actions.map((action) => (
                                <SpeedDialAction
                                    key={action.name}
                                    icon={action.icon}
                                    tooltipTitle={action.name}
                                    onClick={(e) => {
                                        this.handleSpeed(e, action.operation)
                                    }}
                                />
                            ))}
                        </SpeedDial>
                </div>
            </div>
            <div>
                {this.state.showEventForm && !this.state.isChild ?
                    <AddEvent
                        addEvent={(newEvent) => this.addEvent(newEvent)}
                        toggleAddEventForm={this.toggleAddEventForm}
                        userEmail={this.state.userEmail}
                        openIt = {true}
                    />
                    :
                    <div></div>
                }
            </div>
            <div>
                {this.state.showReminderForm ?
                    <Reminders
                        toggleReminderForm={this.toggleReminderForm}
                        events={this.state.events}
                    />
                    :
                    <div></div>
                }
            </div>
            <div>
                {this.state.showEditForm ?
                    <div>
                        <EditEvent
                            key={this.state.userEventId}
                            userEventData={{
                                eventStart: this.state.userEventStart,
                                eventEnd: this.state.userEventEnd,
                                eventTitle: this.state.userEventTitle,
                                id: this.state.userEventId,
                                owner: this.state.userEventOwner,
                                visibility: this.state.userEventVisbility,
                                endZip: this.state.endZip,
                                startZip: this.state.startZip
                            }}
                            editCallback={event => this.editEventInStorage(event)}
                            deleteCallback={event => this.deleteEventInStorage(event)}
                            closeCallback={this.handleClose}
                            userEmail={this.state.userEmail}
                            isChild={this.state.isChild}
                        />
                    </div>
                    :
                    <div></div>
                }
            </div>
            <div>
                <Snackbar open={this.state.openSnackbar} autoHideDuration={4000} onClose={this.handleSnackbarClose}>
                    <Alert onClose={this.handleSnackbarClose} severity={this.state.alert.severity} variant="filled">
                        {this.state.alert.message}
                    </Alert>
                </Snackbar>
            </div>
        </div >
        )
    }
}

export default SharedCalendar;
