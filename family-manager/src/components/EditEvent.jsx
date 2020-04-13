import React from 'react';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Weather from './Weather.jsx';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import GMap from './GoogleMap.jsx';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import usZips from 'us-zips/map';

import {
    MuiPickersUtilsProvider,
    DatePicker,
    TimePicker
} from '@material-ui/pickers';
import { makeStyles, useTheme } from '@material-ui/core';
import { useEffect } from 'react';

//Use material ui to create a style object for this component
let useStyles = makeStyles({
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
    deleteButton: {
        position: 'absolute',
        right: '40px',
        top: '8px',
        color: '#FFFFFF',
    },
    editButton: {
        position: 'absolute',
        right: '72px',
        top: '8px',
        color: '#FFFFFF',
    },
    checkBoxes: {
        marginTop: '10px',
        marginRight: '200px'
    },
    centerButton: {
        marginRight: '143px',
        marginTop: '10px'
    },
    weather: {
        marginLeft: '42%'
    },
    firstElementWidth: {
        width: '49%'
    },
    secondElementWidth: {
        width: '49%',
        marginLeft: '2%',
        marginTop: '16px'
    },
    commuteTimeDiv: {
        position: 'absolute',
        zIndex: 1,
        bottom: '30%',
        right: '42%',
        height: '25px',
        width: '117px',
        backgroundColor: 'white',
        textAlign: 'center',
        borderRadius: '3px'
    }
});

/**
 * This component is the edit/event details dialog that apperas when a user clicks on an event
 * @param {User Event data object} userEventData
 * @param {Callback triggered with updated event data} editCallback
 * @param {callback triggerd when the delete button is clicked} deleteCallback
 * @param {callback triggered when the close button is clicked} closeCallback
 * @param {the users email} userEmail
 * @param {whether or not the user is a child} isChild
 */
function EditEvent({ userEventData, editCallback, deleteCallback, closeCallback, userEmail, isChild }) {

    //Setup all the required state variables based on data passed in and known local settings
    let [userEvent, setUserEvent] = React.useState({ ...userEventData });
    let [privateChecked, setPrivateChecked] = React.useState(userEmail === userEventData.visibility);
    let [detailsMode, setDetailsMode] = React.useState(true);
    let [openSnackbar, setOpenSnackbar] = React.useState(false)
    let [buttonVisibility, setButtonVisibility] = React.useState(true);
    let [mapVisible, setMapVisible] = React.useState(false);
    let [isUserChild] = React.useState(isChild);
    let [commuteTime, setCommuteTime] = React.useState("");
    let [alertMessage, setAlertMessage] = React.useState("");

    //Establish the styling state for the component
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
    const classes = useStyles();

    //When the component runs call a functions to determine whether or not to render
    //The edit and delete buttons and the google map
    useEffect(() => {
        editButtonValid();
        shouldMapDisplay();
    });

    /**
     * Determines whether or not the map should display based on the zip codes provided.
     * If there are no zip codes provided or the event is over, don't display the map
     */
    const shouldMapDisplay = () => {
        let dateNow = moment();
        if (userEventData.startZip !== userEventData.endZip && dateNow.isBefore(userEvent.eventEnd)) {
            setMapVisible(true);
        }
    }

    /**
     * The next five methods handle changes for all the input fields
     * The parameters are the changes made to the input
     */

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

    /**
     * Returns true or false depending on whether the date is valid
     * Valid conditions: End date cannot be before the start date and the 
     * events end date and start date cannot be exactly the same
     * @param {event's start date} startDate 
     * @param {event's end date} endDate 
     */
    function isValidDate(startDate, endDate) {
        //Convert the dates from strings to moment objects, so we can perform comparisons
        let start = moment(startDate);
        let end = moment(endDate);

        if (end.isBefore(start) || start.isSame(end)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Determines whether a entered zipcode is valid
     * Valid conditions: Zip code must exist and the string must not be empty
     * @param {the zipcode entered} zipcode 
     */
    function isValidZipcode(zipcode) {
        if (zipcode.length === 0) {
            return false;
        }

        //Make sure the zipcode is a five digit number
        if (/^\d{5}$/.test(zipcode)) {

            //Us the usZips library to check to see that the zipcode exists
            if (usZips.get(zipcode)) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    /**
     * This function is called when the user clicks submit,
     * it validates the updated info, if any, then returns the info 
     * to the parent component, the shared calendar.
     */
    const editEvent = () => {
        let updatedEvent = { ...userEvent };

        //If the event doesn't have a title, throw an alert
        if (updatedEvent.eventTitle.length === 0) {
            setAlertMessage("Missing Title!")
            setOpenSnackbar(true);
            return
        }

        //If the event's dates are not valid throw an alert
        if (!isValidDate(updatedEvent.eventStart, updatedEvent.eventEnd)) {
            setAlertMessage("End Date cannot be before or equal to the Start Date!")
            setOpenSnackbar(true);
            return;
        }

        //If the entered zipcodes are not valid, remove what the user entered.disabled
        //We don't throw an alert, because these are optional fields
        if (!isValidZipcode(updatedEvent.startZip) || !isValidZipcode(updatedEvent.endZip)) {
            updatedEvent.startZip = "";
            updatedEvent.endZip = "";
        }

        //If the user has made the event private, update the visibility to the users email
        //If not private, make the visibility public
        if (privateChecked) {
            updatedEvent.visibility = userEmail;
        } else {
            updatedEvent.visibility = "public"
        }

        editCallback(updatedEvent);
    }

    /**
     * When the user clicks delete, call the delete callback with the event.
     */
    const deleteEvent = () => {
        let updatedEvent = { ...userEvent };
        deleteCallback(updatedEvent);
    }

    /**
     * If the user clicks close, trigger the callback and the parent will close the dialog
     */
    const handleClose = () => {
        closeCallback();
    }

    let togglePrivateChecked = () => setPrivateChecked(!privateChecked);
    const toggleDetailsMode = () => setDetailsMode(!detailsMode);

    /**
     * This function determines whether or not to show the edit button. 
     * IF the event is in the past, do not show the edit button.
     */
    function editButtonValid() {
        let dateNow = moment();
        if (!dateNow.isBefore(userEvent.eventEnd)) {
            setButtonVisibility(false);
        }
    }

    /**
     * Renders the alert box that appears on validation errors
     * @param {message to render alert with} props 
     */
    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    /**
     * Called by the google maps component with the commute time.
     * @param {commute time to event location} data 
     */
    const setCTime = (data) => {
        setCommuteTime(data);
    }

    return (
        <div>
            <Dialog onClose={handleClose} open={true} fullScreen={fullScreen}>
                <DialogTitle>
                    Event Details
                    <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                    {
                        buttonVisibility === true && !isUserChild ?
                            <div>
                                <IconButton aria-label="delete" className={classes.deleteButton} onClick={deleteEvent}>
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton aria-label="edit" className={classes.editButton} onClick={toggleDetailsMode}>
                                    <EditIcon />
                                </IconButton>
                            </div>
                        :
                            <div></div>
                    }

                </DialogTitle>
                <DialogContent style={{ justifyContent: 'center' }}>
                    <TextField
                        label="Event Title"
                        value={userEvent.eventTitle}
                        onChange={title => handleTitleChange(title)}
                        disabled={detailsMode}
                        fullWidth
                        inputProps={{"data-testid": "titleInput"}}
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
                                className={classes.firstElementWidth}
                                disabled={detailsMode}
                                inputProps={{"data-testid": "startDateInput"}}
                            />
                            <TimePicker
                                autoOk
                                variant="inline"
                                label="Start Time"
                                value={userEvent.eventStart}
                                onChange={time => handleStartDateChange(time)}
                                className={classes.secondElementWidth}
                                disabled={detailsMode}
                                inputProps={{"data-testid": "startTimeInput"}}
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
                                className={classes.firstElementWidth}
                                disabled={detailsMode}
                                inputProps={{"data-testid": "endDateInput"}}
                            />
                            <TimePicker
                                autoOk
                                label="End Time"
                                value={userEvent.eventEnd}
                                onChange={time => handleEndDateChange(time)}
                                className={classes.secondElementWidth}
                                disabled={detailsMode}
                                inputProps={{"data-testid": "endTimeInput"}}
                            />
                        </div>
                    </MuiPickersUtilsProvider>
                    <div>
                        <TextField
                            label="Your Zipcode"
                            value={userEvent.startZip || ''}
                            onChange={zip => handleStartZipChange(zip)}
                            disabled={detailsMode}
                            className={classes.firstElementWidth}
                            inputProps={{"data-testid": "startZipInput"}}
                        />
                        <TextField
                            label="Event Zipcode"
                            value={userEvent.endZip || ''}
                            onChange={zip => handleEndZipChange(zip)}
                            className={classes.zipcodeBoxEnd}
                            disabled={detailsMode}
                            style={{
                                width: '49%',
                                marginLeft: '2%'
                            }}
                            inputProps={{"data-testid": "endZipInput"}}
                        />
                    </div>
                    {
                        userEmail === userEvent.owner ?
                            <div className={classes.checkBoxes}>
                                <FormControlLabel
                                    control={
                                        <Checkbox name="check"
                                            inputProps={{"data-testid": "privateCheck"}}
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
                    {
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

                            detailsMode === true && mapVisible === true ?
                                <div>
                                    <GMap startZip={userEvent.startZip} endZip={userEvent.endZip} setTime={setCTime}/>
                                </div>
                                :
                                <div>
                                </div>
                        }
                    </div>
                    <div>
                        {
                            detailsMode === true && mapVisible === true?
                            <div> <div>
                            {
                                commuteTime.length > 0 ?
                            <div className={classes.commuteTimeDiv}>{commuteTime}</div>
                                :
                                <div></div>
                            }
                        </div></div>
                            :
                            <div></div>
                        }
                    </div>
                   

                </DialogContent>
                <DialogActions>
                            <Button 
                                style={{ visibility: detailsMode === true ? 'hidden' : 'visible' }} 
                                variant="outlined" 
                                color="secondary" 
                                onClick={editEvent}>Submit
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

export default EditEvent;