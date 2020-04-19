import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { Dialog, DialogContent, DialogActions } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import moment from 'moment';
import NotificationService from '../Services/NotificationService'
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

//Component local styles
const useStyles = makeStyles({
    root: {
        margin: 0,
        padding: 16
    },
    closeButton: {
        position: 'absolute',
        right: '8px',
        top: '8px',
        color: '#FFFFFF',
    },
})

/**
 * When open, this class is the reminder signup form
 * @param {open/close the form} toggleReminderForm
 * @param {the array of events} events 
 */
function Reminders({toggleReminderForm, events}) {

    //Initialize state and styles for the component
    const [open, setOpen] = React.useState(true);
    const theme = useTheme();
    const classes = useStyles();
    let [reminderData, setReminderData] = React.useState({ phoneNumber: "", email: "", eventTitle: "", reminderDateOffset: "", eventDate: "" });
    let [userEvents, setUserEvents] = React.useState([...events]);
    let [openSnackbar, setOpenSnackbar] = React.useState(false)
    let [alertMessage, setAlertMessage] = React.useState({message: "", severity: ""});

    //The dialog becomes a full screen dialog when screen is <= XS
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    //On loading of the component filter out the events that have passed from the array
    useEffect(() => {
        filterEvents();
    }, []);

    /**
     * Filters out the events that have passed from the array of events
     */
    function filterEvents() {
        let eventsTemp = [...events];
        let eventsFinal = [];

        let now = moment();

        for (let i = 0; i < eventsTemp.length; i++) {
            let end = moment(eventsTemp[i].end);
            if (now.isBefore(end)) {
                eventsFinal.push(eventsTemp[i]);
            }
        }
        setUserEvents(eventsFinal);
    }

    /**
     * When close is clicked, close the dialog and update the boolean
     */
    const handleClose = () => {
        toggleReminderForm();
        setOpen(false)
    }

    //The 4 methods below update the saved state when the various fields are updated
    let handleReminderEmail = email => {
        let reminderD = { ...reminderData };
        reminderD.email = email.target.value;
        setReminderData(reminderD);
    }
    
    let handleReminderPhone = phoneNumber => {
        let reminderD = { ...reminderData };
        reminderD.phoneNumber = phoneNumber.target.value;
        setReminderData(reminderD);
    }
    
    const handleTimeOffset = handleTimeOffset => {
        let reminderD = { ...reminderData };
        reminderD.reminderDateOffset = handleTimeOffset.target.value;
        setReminderData(reminderD);
    };

    const handleEventTitle = eventTitle => {
        let reminderD = { ...reminderData };
        reminderD.eventTitle = eventTitle.target.value;
        setReminderData(reminderD);
    }

    /**
     * Submits a notification signup to the API upon receiving valid ata
     */
    const submitNotification = () => {

        //Build a local object of event data to send to the notification signup service
        let reminderDataToSend = { ...reminderData };
        let tempDate = reminderDataToSend.eventTitle.start;

        //Reformat the date from a moment object to a readable format
        let finalDate = moment(tempDate).format('MM/DD/YYYY') + " At " + moment(tempDate).format('h:mm A');
        reminderDataToSend.eventTitle = reminderData.eventTitle.title;
        reminderDataToSend.eventDate = finalDate;

        //If the user didn't select an event throw an alert
        if (!reminderDataToSend.eventTitle) {
            setAlertMessage({message: "Invalid Title", severity: "error"});
            setOpenSnackbar(true);
            return;
        }

        //If the user entered both an email and phone number valid them and send the data to the service
        if (reminderDataToSend.email.length > 0 && reminderDataToSend.phoneNumber.length > 0 && reminderDataToSend.reminderDateOffset) {
            if (!isValidPhone(reminderDataToSend.phoneNumber)) {
                setAlertMessage({message: "Invalid Phone Number", severity: "error"});
                setOpenSnackbar(true);
                return;
            }

            if (!isValidEmail(reminderDataToSend.email)) {
                setAlertMessage({message: "Invalid Email", severity: "error"});
                setOpenSnackbar(true);
                return
            }

            NotificationService.forwardNotificationSignup(reminderDataToSend, notificationResponse);
        } else if (reminderDataToSend.email.length > 0 && reminderDataToSend.reminderDateOffset) {
            if (isValidEmail(reminderDataToSend.email)) {
                NotificationService.forwardNotificationSignup(reminderDataToSend, notificationResponse);
            } else {
                setAlertMessage({message: "Invalid Email", severity: "error"});
                setOpenSnackbar(true);
                return;
            }
        } else if (reminderDataToSend.phoneNumber.length > 0 && reminderDataToSend.reminderDateOffset) {
            if (isValidPhone(reminderDataToSend.phoneNumber)) {
                NotificationService.forwardNotificationSignup(reminderDataToSend, notificationResponse);
            } else {
                setAlertMessage({message: "Invalid Phone Number", severity: "error"});
                setOpenSnackbar(true);
                return;
            }
        } else {
            //If the user didn't enter anything throw an alert
            setAlertMessage({message: "Select your event, when you want the reminder, email, phone number, or both!", severity: "error"});
            setOpenSnackbar(true);
            return;
        }
    }

    /**
     * Callback function executed after notificaton signup API has been called
     * @param {API call response} response 
     */
    const notificationResponse = (response) => {
        if (response.status === 200) {
            setAlertMessage({message: "Reminder Submitted!", severity: "success"});
            setOpenSnackbar(true);
            clearForm();
        } else {
            setAlertMessage({message: "Reminder Signup Failure, Please Try Again!", severity: "error"});
            setOpenSnackbar(true);
        }
    }

    /**
     * Validates the users email based on the regex string below
     * The regex string was sourced from: https://emailregex.com/
     * @param {user's email} email 
     */
    function isValidEmail(email) {
        // eslint-disable-next-line
        if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return true;
        }
        return false;
    }

    /**
     * Validates the users phone number based on the regex string below
     * The regex string was sourced from: https://stackoverflow.com/questions/123559/how-to-validate-phone-numbers-using-regex
     * @param {user's phone phoneNumber} phoneNumber 
     */
    function isValidPhone(phoneNumber) {
        if (/^[1-9]\d{2}-\d{3}-\d{4}/.test(phoneNumber)) {
            return true;
        }
        return false;
    }

    //Closes the alert if the user clicks on the 'X'
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    //Clears the alert form, this is executed after a successful signup
    const clearForm = () => {
        setReminderData({phoneNumber: "", email: "", eventTitle: "", reminderDateOffset: "", eventDate: ""})
    }

    //Renders an alert popup based on the props passed in
    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    return (
        <div>     
            <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} disableBackdropClick>
                <DialogTitle className={classes.title}>
                    Reminder Signup
                    <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent style={{justifyContent: 'center'}}>
                <FormControl fullWidth style={{minWidth: '150px'}}>
                        <InputLabel id="demo-simple-select-label">Event</InputLabel>
                        <Select
                            labelId="demosimple-select-label"
                            id="demosimple-select"
                            value={reminderData.eventTitle}
                            onChange={handleEventTitle}
                            data-testid = "eventSelect"
                        > 
                        {userEvents.map((event) => (
                            <MenuItem key={event.id} value={event}>{event.title}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                        <TextField 
                            label="Email" 
                            value={reminderData.email} 
                            onChange={handleReminderEmail} 
                            style={{minWidth: '150px', marginTop: '10px'}}
                            fullWidth
                            placeholder="sample@sample.com"
                            inputProps={{"data-testid": "emailInput"}}
                        />
                    <div>
                        <TextField 
                            label="Phone Number" 
                            value={reminderData.phoneNumber} 
                            onChange={handleReminderPhone} 
                            style={{minWidth: '150px', marginTop: '10px'}}
                            fullWidth
                            placeholder="XXX-XXX-XXXX"
                            inputProps={{"data-testid": "phoneInput"}}
                        />    
                    </div>
                    <FormControl fullWidth style={{minWidth: '150px', marginTop: '10px'}}>
                         <InputLabel id="demo-simple-select-label">Remind Me In</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={reminderData.reminderDateOffset}
                            onChange={handleTimeOffset}
                            data-testid = "timeSelect"
                        >
                            <MenuItem value={1}>10 Minutes</MenuItem>
                            <MenuItem value={2}>1 Hour</MenuItem>
                            <MenuItem value={3}>1 Day</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions style={{marginTop:'20px'}}>
                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        onClick={submitNotification}>
                        Submit
                    </Button>
                </DialogActions>
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={alertMessage.severity}>
                        {alertMessage.message}
                    </Alert>
                </Snackbar>
            </Dialog>        
      </div>
    )
}

export default Reminders;