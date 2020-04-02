import React, { Fragment, useState } from 'react';
import {
    MuiPickersUtilsProvider,
    DatePicker,
    TimePicker
} from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NotificationService from '../Services/NotificationService';
import { Dialog, DialogContent, DialogTitle, IconButton, Switch, FormGroup, DialogActions, Snackbar, Al } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { blue } from '@material-ui/core/colors';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MuiAlert from '@material-ui/lab/Alert';


let tempStyles = {
    minWidth: 120
}

const useStyles = makeStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    title: {
        background: 'linear-gradient(45deg, #2196F3 10%, #21CBF3 90%)',
        color: '#FFFFFF'
    },

    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: '#FFFFFF',
    },

    submit: {
        position: 'relative',
        right: theme.spacing(1),
        bottom: theme.spacing(1),
    },

    row: {
        marginBottom: theme.spacing(2),
    },

    etitle:{
        fontSize: "20px",
    },

    elements: {
        width: '50%'
    }

  }));
  

function AddEvent({ addEvent, toggleAddEvent, userEmail }) {

    let [newEvent, setNewEvent] = useState({ eventTitle: "", eventStartDate: moment().format("ll"), eventEndDate: moment().format("ll"), visibility: "", owner: ""});
    let [reminderData, setReminderData] = useState({ phoneNumber: "", email: "", eventTitle: "", reminderDateOffset: "", eventDate: ""});
    let [reminderChecked, setReminderChecked] = useState(false);
    let [privateChecked, setPrivateChecked] = useState(false);

    let [open, setOpen] = useState(true)
    let [openSnackbar, setOpenSnackbar] = useState(false)
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));


    let handleNewEventTitle = (e) => {
        let newEventDetails = { ...newEvent };
        newEventDetails.eventTitle = e.target.value;
        setNewEvent(newEventDetails);
    }

    let handleNewEventStart = (e) => {
        let newEventDetails = { ...newEvent };
        newEventDetails.eventStartDate = e;
        setNewEvent(newEventDetails);
    }

    let handleNewEventEnd = (e) => {
        let newEventDetails = { ...newEvent };
        newEventDetails.eventEndDate = e;
        setNewEvent(newEventDetails);
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

    let createAndSendEvent = () => {

      
      
            let newEventData = { ...newEvent };

        if(newEventData.eventTitle !== "" && newEventData.eventStartDate !== null && newEventData.eventEndDate !== null){
        //let reminderDataToSend = { ...reminderData }; 
        let tempDate = newEvent.eventStartDate;
        let finalDate = moment(tempDate).format('MM/DD/YYYY') + " At " + moment(tempDate).format('h:hh A');

        //reminderDataToSend.eventTitle = newEventData.eventTitle;
        //reminderDataToSend.eventDate = finalDate;

        if (privateChecked) {
            newEventData.visibility = userEmail;
        } else (
            newEventData.visibility = "public"
        )

        newEventData.owner = userEmail;
        addEvent(newEventData);
        }

        else {
            return setOpenSnackbar(true)
        }
        
        


        

        
       
        //Check if remdinder was checked and the data is filled then call the reminder service
        // if (reminderChecked) {
        //     if (reminderData.email.length > 0 && reminderData.phoneNumber.length > 0 && reminderData.reminderDateOffset) {
        //         NotificationService.forwardNotificationSignup(reminderDataToSend);
        //         console.log('got both');
        //     } else if (reminderData.email.length > 0 && reminderData.reminderDateOffset) {
        //         NotificationService.forwardNotificationSignup(reminderDataToSend);
        //         console.log('got email');
        //     } else if (reminderData.phoneNumber.length > 0 && reminderData.reminderDateOffset) {
        //         NotificationService.forwardNotificationSignup(reminderDataToSend);
        //         console.log('got phone');
        //     } else {
        //         console.log('got nothing');
        //     }
        // }

        setOpen(false)
    }

    let togglePrivateChecked = () => {
        setPrivateChecked(!privateChecked);
    }
    
    let toggleRemindersChecked = () => {
        setReminderChecked(!reminderChecked);
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
    
                  

    const classes = useStyles();
    return (
        
        <div>
                <Dialog 
                open={open} 
                onClose={() => setOpen(false)}
                fullScreen={fullScreen}
                >




                    <DialogTitle className={classes.title}>
                        {"New Event"}

                        <IconButton aria-label="close" className={classes.closeButton} onClick={() => setOpen(false)}>
                            <CloseIcon />
                            </IconButton>
                    </DialogTitle>

                    <DialogContent >

                    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>

                    <FormGroup row="true" className={classes.row}>
                        <TextField 
                        className={classes.etitle} 
                        label="" 
                        placeholder="Title" 
                        value={newEvent.eventTitle} 
                        onChange={title => handleNewEventTitle(title)} 
                        fullWidth
                        required
                        />
                    </FormGroup>
                    
                    <FormGroup row="true" className={classes.row}>
                        <DatePicker
                            disablePast
                            variant="inline"
                            format="MM/DD/YYYY"
                            margin="normal"
                            label="Start Date"
                            value={newEvent.eventStartDate}
                            onChange={date => handleNewEventStart(date)}
                            className={classes.elements}
                            required
                            
                        />
                        <DatePicker
                            disablePast
                            variant="inline"
                            format="MM/DD/YYYY"
                            margin="normal"
                            label="End Date"
                            value={newEvent.eventEndDate}
                            onChange={date => handleNewEventEnd(date)}
                            className={classes.elements}
                            required
                        /> 
                    </FormGroup>
                    

                    <FormGroup row="true" className={classes.row}>
                    <TimePicker
                        autoOk
                        label="Start Time"
                        value={newEvent.eventStartDate}
                        onChange={time => handleNewEventStart(time)}
                        className={classes.elements}
                        required
                    />
                    <TimePicker
                        autoOk
                        label="End Time"
                        value={newEvent.eventEndDate}
                        onChange={time => handleNewEventEnd(time)}
                        className={classes.elements}
                        required
                    />
                    </FormGroup>
                </MuiPickersUtilsProvider>

                <FormGroup row="true" className={classes.row}>
                    {/* <FormControlLabel
                        control={<Switch name="check" color="Primary" onChange={toggleRemindersChecked} checked={reminderChecked} />}
                        label="Reminders"
                        className={classes.elements}
                    /> */}
                    <FormControlLabel
                        control={<Switch name="check" color="Primary" onChange={togglePrivateChecked} checked={privateChecked} />}
                        label="Private event"
                        className={classes.elements}
                    />
                </FormGroup>
                
                    
                </DialogContent>


                <DialogActions>
                    <Button variant="contained" className={classes.submit} color="secondary" onClick={createAndSendEvent}>Submit</Button>
                </DialogActions>



                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error">
          Form is missing information
        </Alert>
         </Snackbar>
                </Dialog>


                
            

            {/* <div>
                {
                    reminderChecked === true ?
                        <form>
                            <TextField label="Email" value={reminderData.email} onChange={handleReminderEmail} />
                            <TextField label="Phone Number" value={reminderData.phoneNumber} onChange={handleReminderPhone} />
                            <FormControl style={tempStyles}>
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
                        </form>
                        :
                        <div></div>
                }
            </div> */}

       


      

       
        </div>
    )
}

export default AddEvent;