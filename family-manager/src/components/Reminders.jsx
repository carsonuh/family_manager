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

const useStyles = makeStyles({
    root: {
        margin: 0,
        padding: 16
    },
    title: {
        background: 'linear-gradient(45deg, #2196F3 10%, #21CBF3 90%)',
        color: '#FFFFFF'
    },
    closeButton: {
        position: 'absolute',
        right: '8px',
        top: '8px',
        color: '#FFFFFF',
    },
})

function Reminders({toggleReminderForm, events}) {
    const [open, setOpen] = React.useState(true);
    const theme = useTheme();
    const classes = useStyles();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
    let [reminderData, setReminderData] = React.useState({ phoneNumber: "", email: "", eventTitle: "", reminderDateOffset: "", eventDate: "" });
    let [userEvents, setUserEvents] = React.useState([...events]);
    let [openSnackbar, setOpenSnackbar] = React.useState(false)
    let [alertMessage, setAlertMessage] = React.useState("");


    useEffect(() => {
        filterEvents();
    }, []);

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

    const handleClose = () => {
        toggleReminderForm();
        setOpen(false)
    }

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

    const submitNotification = () => {

        let reminderDataToSend = { ...reminderData };
        let tempDate = reminderDataToSend.eventTitle.start;
        let finalDate = moment(tempDate).format('MM/DD/YYYY') + " At " + moment(tempDate).format('h:mm A');
        reminderDataToSend.eventTitle = reminderData.eventTitle.title;
        reminderDataToSend.eventDate = finalDate;

        if (reminderDataToSend.email.length > 0 && reminderDataToSend.phoneNumber.length > 0 && reminderDataToSend.reminderDateOffset) {
            if (!isValidPhone(reminderDataToSend.phoneNumber)) {
                setAlertMessage("Invalid Phone Number");
                setOpenSnackbar(true);
                return;
            }

            if (!isValidEmail(reminderDataToSend.email)) {
                setAlertMessage("Invalid Email");
                setOpenSnackbar(true);
                return
            }

            // NotificationService.forwardNotificationSignup(reminderDataToSend);
            console.log('got both');
        } else if (reminderDataToSend.email.length > 0 && reminderDataToSend.reminderDateOffset) {
            if (isValidEmail(reminderDataToSend.email)) {
                console.log('valid email')
                //NotificationService.forwardNotificationSignup(reminderDataToSend);
            } else {
                setAlertMessage("Invalid Email");
                setOpenSnackbar(true);
            }
            console.log('got email');
        } else if (reminderDataToSend.phoneNumber.length > 0 && reminderDataToSend.reminderDateOffset) {
            if (isValidPhone(reminderDataToSend.phoneNumber)) {
                console.log('valid phoen');
                // NotificationService.forwardNotificationSignup(reminderDataToSend);
            } else {
                setAlertMessage("Invalid Phone Number");
                setOpenSnackbar(true);
            }
            console.log('got phone');
        } else {
            console.log('got nothing');
            setAlertMessage("Select your event, when you want the reminder, email, phone number, or both!");
            setOpenSnackbar(true);
        }
    }

    function isValidEmail(email) {

        if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return true;
        }
        return false;
    }

    function isValidPhone(phoneNumber) {
        if (/^[1-9]\d{2}-\d{3}-\d{4}/.test(phoneNumber)) {
            return true;
        }
        return false;
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };


    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    return (
        <div>     
            <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} disableBackdropClick>
                <DialogTitle className={classes.title}>
                    Reminder Signup
                    <IconButton className={classes.closeButton} onClick={handleClose}>
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
                        />
                    <div>
                        <TextField 
                            label="Phone Number" 
                            value={reminderData.phoneNumber} 
                            onChange={handleReminderPhone} 
                            style={{minWidth: '150px', marginTop: '10px'}}
                            fullWidth
                            placeholder="XXX-XXX-XXXX"
                        />    
                    </div>
                    <FormControl fullWidth style={{minWidth: '150px', marginTop: '10px'}}>
                         <InputLabel id="demo-simple-select-label">Remind Me In</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={reminderData.reminderDateOffset}
                            onChange={handleTimeOffset}
                        >
                            <MenuItem value={1}>10 Minutes</MenuItem>
                            <MenuItem value={2}>1 Hour</MenuItem>
                            <MenuItem value={3}>1 Day</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions style={{justifyContent:'center', marginTop:'20px'}}>
                <Button 
                                variant="contained" 
                                color="secondary" 
                                onClick={submitNotification}>
                                    Submit
                            </Button>
                </DialogActions>
                
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity="error">
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </Dialog>        
      </div>
    )
}

export default Reminders;