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

import {
    MuiPickersUtilsProvider,
    DatePicker,
    TimePicker
} from '@material-ui/pickers';
import { makeStyles, useTheme } from '@material-ui/core';
import { useEffect } from 'react';


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
        marginLeft: '45%'
    },
    firstElementWidth: {
        width: '49%'
    },
    secondElementWidth: {
        width: '49%',
        marginLeft: '2%',
        marginTop: '16px'
    }
});

function EditEvent({ userEventData, editCallback, deleteCallback, closeCallback, userEmail, isChild }) {

    let [userEvent, setUserEvent] = React.useState({ ...userEventData });
    let [privateChecked, setPrivateChecked] = React.useState(userEmail == userEventData.visibility);
    let [detailsMode, setDetailsMode] = React.useState(true);
    let [openSnackbar, setOpenSnackbar] = React.useState(false)
    let [buttonVisibility, setButtonVisibility] = React.useState(true);
    let [mapVisible, setMapVisible] = React.useState(false);
    let [isUserChild, setIsUserChild] = React.useState(isChild);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
    const classes = useStyles();

    useEffect(() => {
        editButtonValid();
        shouldMapDisplay();
    }, []);

    const shouldMapDisplay = () => {
        let dateNow = moment();
        if (userEventData.startZip !== userEventData.endZip && dateNow.isBefore(userEvent.eventEnd)) {
            setMapVisible(true);
        }
    }

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

    function isValidDate(startDate, endDate) {
        let start = moment(startDate);
        let end = moment(endDate);
        if (end.isBefore(start) || start.isSame(end)) {
            return false;
        } else {
            return true;
        }
    }

    function isValidZipcode(zipcode) {
        if (zipcode.length === 0) {
            return false;
        }
        if (/^\d{5}$/.test(zipcode)) {
            return true;
        }
        return false;
    }

    const editEvent = () => {
        let updatedEvent = { ...userEvent };

        if (!isValidDate(updatedEvent.eventStart, updatedEvent.eventEnd)) {
            setOpenSnackbar(true);
            return;
        }

        if (!isValidZipcode(updatedEvent.startZip) || !isValidZipcode(updatedEvent.endZip)) {
            updatedEvent.startZip = "";
            updatedEvent.endZip = "";
        }


        if (privateChecked) {
            updatedEvent.visibility = userEmail;
        } else {
            updatedEvent.visibility = "public"
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

    function editButtonValid() {
        let dateNow = moment();
        if (!dateNow.isBefore(userEvent.eventEnd)) {
            setButtonVisibility(false);
        }
    }

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    return (
        <div>
            <Dialog onClose={handleClose} open={true} fullScreen={fullScreen}>
                <DialogTitle>
                    Event Details
                    <IconButton className={classes.closeButton} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                    {
                        buttonVisibility === true && !isUserChild ?
                            <div>
                                <IconButton className={classes.deleteButton} onClick={deleteEvent}>
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton className={classes.editButton} onClick={toggleDetailsMode}>
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

                            />
                            <TimePicker
                                autoOk
                                variant="inline"
                                label="Start Time"
                                value={userEvent.eventStart}
                                onChange={time => handleStartDateChange(time)}
                                className={classes.secondElementWidth}
                                disabled={detailsMode}
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
                            />
                            <TimePicker
                                autoOk
                                label="End Time"
                                value={userEvent.eventEnd}
                                onChange={time => handleEndDateChange(time)}
                                className={classes.secondElementWidth}
                                disabled={detailsMode}
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
                    } */}
                    <div>
                        {

                            detailsMode === true && mapVisible === true ?
                                <div>
                                    {/* <span style={{color:'green'}}>Test</span> */}
                                    <GMap startZip={userEvent.startZip} endZip={userEvent.endZip} />
                                </div>
                                :
                                <div>
                                </div>
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
                        End Date cannot be before or equal to the Start Date!
        </Alert>
                </Snackbar>
            </Dialog>
        </div>
    )
}

export default EditEvent;