import React, { Fragment } from 'react';
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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NotificationService from '../Services/NotificationService';


let tempStyles = {
    minWidth: 120
}

function AddEvent({ addEvent, toggleAddEvent, userEmail }) {

    let [newEvent, setNewEvent] = React.useState({ eventTitle: "My New Event", eventStartDate: null, eventEndDate: null, visibility: "", owner: "", eventStartZip: "", eventEndZip: ""});
    let [reminderData, setReminderData] = React.useState({ phoneNumber: "", email: "", eventTitle: "", reminderDateOffset: "", eventDate: ""});
    let [reminderChecked, setReminderChecked] = React.useState(false);
    let [privateChecked, setPrivateChecked] = React.useState(false);


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

    let createAndSendEvent = () => {
        let newEventData = { ...newEvent };
        let reminderDataToSend = { ...reminderData }; 
        let tempDate = newEvent.eventStartDate;
        let finalDate = moment(tempDate).format('MM/DD/YYYY') + " At " + moment(tempDate).format('h:hh A');

        reminderDataToSend.eventTitle = newEventData.eventTitle;
        reminderDataToSend.eventDate = finalDate;

        if (privateChecked) {
            newEventData.visibility = userEmail;
        } else (
            newEventData.visibility = "public"
        )

        newEventData.owner = userEmail;
        
        addEvent(newEventData);
        //Check if remdinder was checked and the data is filled then call the reminder service
        if (reminderChecked) {
            if (reminderData.email.length > 0 && reminderData.phoneNumber.length > 0 && reminderData.reminderDateOffset) {
                NotificationService.forwardNotificationSignup(reminderDataToSend);
                console.log('got both');
            } else if (reminderData.email.length > 0 && reminderData.reminderDateOffset) {
                NotificationService.forwardNotificationSignup(reminderDataToSend);
                console.log('got email');
            } else if (reminderData.phoneNumber.length > 0 && reminderData.reminderDateOffset) {
                NotificationService.forwardNotificationSignup(reminderDataToSend);
                console.log('got phone');
            } else {
                console.log('got nothing');
            }
        }
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
    
    return (
        <div>
            <form>
                <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                    <DatePicker
                        //   variant="inline"
                        format="MM/DD/YYYY"
                        margin="normal"
                        label="Start Date"
                        value={newEvent.eventStartDate}
                        onChange={date => handleNewEventStart(date)}
                    />
                    <DatePicker
                        //   variant="inline"
                        format="MM/DD/YYYY"
                        margin="normal"
                        label="End Date"
                        value={newEvent.eventEndDate}
                        onChange={date => handleNewEventEnd(date)}
                    />
                    <TimePicker
                        autoOk
                        label="Start Time"
                        value={newEvent.eventStartDate}
                        onChange={time => handleNewEventStart(time)}
                    />
                    <TimePicker
                        autoOk
                        label="End Time"
                        value={newEvent.eventEndDate}
                        onChange={time => handleNewEventEnd(time)}
                    />
                    <TextField label="Event Title" value={newEvent.eventTitle} onChange={title => handleNewEventTitle(title)} />
                </MuiPickersUtilsProvider>
                <FormControlLabel
                    control={<Checkbox name="check" onClick={toggleRemindersChecked} checked={reminderChecked} />}
                    label="Signup For Reminders"
                />
                <FormControlLabel
                    control={<Checkbox name="check" onClick={togglePrivateChecked} checked={privateChecked} />}
                    label="Make this Event Private"
                />
                <Button variant="contained" color="primary" onClick={createAndSendEvent}>Submit</Button>
                <Button variant="contained" color="primary" onClick={toggleAddEvent}>Close</Button>
            </form>
            <div>
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
            </div>

        </div>
    )
}

export default AddEvent;