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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import NotificationService from '../Services/NotificationService';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import { grey } from '@material-ui/core/colors';
import Weather from './Weather.jsx';
import useWindowDimensions from './windowDimensions.jsx';


import {
    MuiPickersUtilsProvider,
    DatePicker,
    TimePicker
} from '@material-ui/pickers';
import { withStyles, makeStyles } from '@material-ui/core';
import MyComponents from './GoogleMap';
import { styles } from '@material-ui/pickers/views/Clock/Clock';

const CalendarStyles = {
    editFormContainer: {
        height: "500px",
        width: "500px",
        margin: "0 auto",
        marginTop: "50px"
    }
}

let tempStyles = {
    width: '325px'
}

let useStyles = makeStyles({
    root: {
        margin: 0,
        padding: 16
    },
    closeButton: {
        position: 'absolute',
        right: '8px',
        top: '8px',
        color: grey[500],
    },
    deleteButton: {
        position: 'absolute',
        right: '40px',
        top: '8px',
        color: grey[500],
    },
    editButton: {
        position: 'absolute',
        right: '72px',
        top: '8px',
        color: grey[500],
    },
    eventTitle: {
        width: '325px'
    },
    eventStartDate: {
        width: '155px'
    },
    eventStartTime: {
        marginTop: '16px',
        width: '155px',
        marginLeft: '15px'
    },
    checkBoxes: {
        marginTop: '10px',
        marginRight: '200px'
    },
    zipcodeBoxStart: {
        width: '155px',
        marginTop: '16px'
    },
    zipcodeBoxEnd: {
        width: '155px',
        marginLeft: '15px',
        marginTop: '16px'
    },
    centerButton: {
        marginRight: '143px',
        marginTop: '10px'
    },
    weather: {
        marginLeft: '130px'
    }
});

function EditEvent({ userEventData, editCallback, deleteCallback, closeCallback, userEmail }) {

    let [userEvent, setUserEvent] = React.useState({ ...userEventData });
    let [reminderChecked, setReminderChecked] = React.useState(false);
    let [reminderData, setReminderData] = React.useState({ phoneNumber: "", email: "", eventTitle: "", reminderDateOffset: "", eventDate: "" });
    let [privateChecked, setPrivateChecked] = React.useState(userEmail == userEventData.visibility);
    let [detailsMode, setDetailsMode] = React.useState(true);
    const { height, width } = useWindowDimensions();
    const classes = useStyles();

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

    const handleStartZipChange = (e) => {
        let userEventData = { ...userEvent };
        userEventData.startZip = e.target.value;
        setUserEvent(userEventData);
    }

    const handleEndZipChange = (e) => {
        let userEventData = { ...userEvent };
        userEventData.endZip = e.target.value;
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


    const toggleDetailsMode = () => setDetailsMode(!detailsMode);

    return (
        <div>
            <Dialog onClose={handleClose} open={true} scroll={'body'}>
                <DialogTitle className={classes.root}>
                    Event Details
                    <IconButton className={classes.closeButton} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                    <IconButton className={classes.deleteButton} onClick={deleteEvent}>
                        <DeleteIcon />
                    </IconButton>
                    <IconButton className={classes.editButton} onClick={toggleDetailsMode}>
                        <EditIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent style={{justifyContent: 'center'}}>
                    {
                        console.log(width)
                    }
                    <TextField
                        label="Event Title"
                        value={userEvent.eventTitle}
                        onChange={title => handleTitleChange(title)}
                        className={classes.eventTitle}
                        disabled={detailsMode}
                        style={{
                            width: width < '440' ? '270px' : '325px'
                        }}
                    />
                    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
                        <div>
                            <DatePicker
                                variant="inline"
                                format="MM/DD/YYYY"
                                margin="normal"
                                label="Start Date"
                                value={userEvent.eventStart}
                                onChange={date => handleStartDateChange(date)}
                                className={classes.eventStartDate}
                                disabled={detailsMode}
                                style={{
                                    width: width < '440' ? '270px' : '155px'
                                }}
                            />
                            <TimePicker
                                autoOk
                                variant="inline"
                                label="Start Time"
                                value={userEvent.eventStart}
                                onChange={time => handleStartDateChange(time)}
                                className={classes.eventStartTime}
                                disabled={detailsMode}
                                style={{
                                    width: width < '440' ? '270px' : '155px',
                                    marginLeft: width < '440' ? '0px' : '15px',
                                    marginTop: width < '440' ? '8px' : '16px'
                                }}
                            />
                        </div>
                        <div>
                            <DatePicker
                                variant="inline"
                                format="MM/DD/YYYY"
                                margin="normal"
                                label="End Date"
                                value={userEvent.eventEnd}
                                onChange={date => handleEndDateChange(date)}
                                className={classes.eventStartDate}
                                disabled={detailsMode}
                                style={{
                                    width: width < '440' ? '270px' : '155px'
                                }}
                            />
                            <TimePicker
                                autoOk
                                label="End Time"
                                value={userEvent.eventEnd}
                                onChange={time => handleEndDateChange(time)}
                                className={classes.eventStartTime}
                                disabled={detailsMode}
                                style={{
                                    width: width < '440' ? '270px' : '155px',
                                    marginLeft: width < '440' ? '0px' : '15px',
                                    marginTop: width < '440' ? '8px' : '16px'
                                }}
                            />
                        </div>
                    </MuiPickersUtilsProvider>
                    <div>
                        <TextField
                            label="Your Zipcode"
                            value={userEvent.startZip || ''}
                            onChange={zip => handleStartZipChange(zip)}
                            disabled={detailsMode}
                            className={classes.zipcodeBoxStart}
                            style={{
                                width: width < '440' ? '270px' : '155px',
                                marginTop: width < '440' ? '8px' : '16px'
                            }}
                        />
                        <TextField
                            label="Event Zipcode"
                            value={userEvent.endZip || ''}
                            onChange={zip => handleEndZipChange(zip)}
                            className={classes.zipcodeBoxEnd}
                            disabled={detailsMode}
                            style={{
                                width: width < '440' ? '270px' : '155px',
                                marginLeft: width < '440' ? '0px' : '15px',
                                marginTop: width < '440' ? '8px' : '16px'
                            }}
                        />
                    </div>
                    {
                        userEmail == userEvent.owner ?
                            <div className={classes.checkBoxes}>
                                <FormControlLabel
                                    control={
                                        <Checkbox name="check"
                                            onClick={togglePrivateChecked}
                                            checked={privateChecked}
                                            disabled={detailsMode}
                                        />}
                                    label="Private Event"
                                />
                            </div>
                            :
                            <div></div>
                    }
                    {/* {
                        detailsMode === true ?
                            <div>{
                                userEvent.endZip.length >= 5 ?
                                    <div className={classes.weather}>
                                        <Weather
                                            zipcode={userEventData.endZip}

                                        />
                                    </div>
                                    :
                                    <div></div>
                            }</div>
                            :
                            <div>
                            </div>
                    }
                    <div>
                        {
                            detailsMode === true ?
                                <div>
                                    <GMap startZip={userEvent.startZip} endZip={userEvent.endZip} />
                                </div>
                                :
                                <div>
                                </div>
                        }
                    </div> */}
                </DialogContent>
                <DialogActions style={{justifyContent: 'center'}}>
                            <Button style={{ visibility: detailsMode === true ? 'hidden' : 'visible' }} variant="contained" color="primary" onClick={editEvent}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default EditEvent;