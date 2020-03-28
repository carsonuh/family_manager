import React from 'react';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import NotificationService from '../Services/NotificationService';
import {
    MuiPickersUtilsProvider,
    DatePicker,
    TimePicker
} from '@material-ui/pickers';

const CalendarStyles = {
    editFormContainer: {
        height: "500px",
        width: "500px",
        margin: "0 auto",
        marginTop: "50px"
    }
}

let tempStyles = {
    minWidth: 120
}

function EditEvent({ userEventData, editCallback, deleteCallback, closeCallback, userEmail }) {

    

    let [userEvent, setUserEvent] = React.useState({ ...userEventData });
    let [reminderChecked, setReminderChecked] = React.useState(false);
    let [reminderData, setReminderData] = React.useState({ phoneNumber: "", email: "", eventTitle: "", reminderDateOffset: "", eventDate: "" });
    let [privateChecked, setPrivateChecked] = React.useState(userEmail == userEventData.visibility);

    const handleStartDateChange = (e) => {
        let start = new Date(e);
        let userEventData = { ...userEvent };
        userEventData.eventStart = start;
        setUserEvent(userEventData);
    }

    const handleEndDateChange = (e) => {
        let userEventData = { ...userEvent };
        userEventData.eventEnd = e._d;
        setUserEvent(userEventData);
    }

    const handleTitleChange = (e) => {
        let userEventData = { ...userEvent };
        userEventData.eventTitle = e.target.value;
        setUserEvent(userEventData);
    }

    const editEvent = () => {
        let updatedEvent = { ...userEvent };

        let reminderDataToSend = { ...reminderData };
        let tempDate = updatedEvent.eventStart;
        let finalDate = moment(tempDate).format('MM/DD/YYYY') + " At " + moment(tempDate).format('h:mm A');
        reminderDataToSend.eventTitle = updatedEvent.eventTitle;
        reminderDataToSend.eventDate = finalDate;

        
        if (privateChecked) {
            console.log('here')
            updatedEvent.visibility = userEmail;
        } else {
            updatedEvent.visibility = "public"
        }

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
        editCallback(updatedEvent);
    }

    const deleteEvent = () => {
        let updatedEvent = { ...userEvent };
        deleteCallback(updatedEvent);
    }

    const handleClose = () => {
        closeCallback();
    }

    let togglePrivateChecked = () => setPrivateChecked(!privateChecked);

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
        <div style={CalendarStyles.editFormContainer}>
            Edit
            <form>
                <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                    <DatePicker
                        //   variant="inline"
                        format="MM/DD/YYYY"
                        margin="normal"
                        label="Start Date"
                        value={userEvent.eventStart}
                        onChange={date => handleStartDateChange(date)}
                    />
                    <DatePicker
                        //   variant="inline"
                        format="MM/DD/YYYY"
                        margin="normal"
                        label="End Date"
                        value={userEvent.eventEnd}
                        onChange={date => handleEndDateChange(date)}
                    />
                    <TimePicker
                        autoOk
                        label="Start Time"
                        value={userEvent.eventStart}
                        onChange={time => handleStartDateChange(time)}
                    />
                    <TimePicker
                        autoOk
                        label="End Time"
                        value={userEvent.eventEnd}
                        onChange={time => handleEndDateChange(time)}
                    />
                    <TextField label="Event Title" value={userEvent.eventTitle} onChange={title => handleTitleChange(title)} />
                </MuiPickersUtilsProvider>
                <Button variant="contained" color="primary" onClick={editEvent}>Submit</Button>
                <Button variant="contained" color="primary" onClick={deleteEvent}>Delete Event</Button>
                <Button variant="contained" color="primary" onClick={handleClose}>Close</Button>
                <FormControlLabel
                    control={<Checkbox name="check" onClick={toggleRemindersChecked} checked={reminderChecked} />}
                    label="Signup For Reminders"
                    
                />
                {
                    userEmail == userEvent.owner ?
                        <div>
                            <FormControlLabel
                                control={<Checkbox name="check" onClick={togglePrivateChecked} checked={privateChecked} />}
                                label="Make this Event Private"
                            />
                        </div>
                    :
                        <div></div>
                }

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

export default EditEvent;