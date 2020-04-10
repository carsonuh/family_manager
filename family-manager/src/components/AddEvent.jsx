import React, { useState } from 'react';
import {
    MuiPickersUtilsProvider,
    DatePicker,
    TimePicker
} from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { makeStyles, useTheme} from '@material-ui/core/styles';
import { Dialog, DialogContent, DialogTitle, IconButton, Switch, FormGroup, DialogActions, Snackbar, } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
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

    etitle: {
        fontSize: "20px",
    },

    elements: {
        width: '50%'
    }

}));


function AddEvent({ addEvent, toggleAddEventForm, userEmail, openIt }) {

    let [newEvent, setNewEvent] = React.useState({ eventTitle: "", eventStartDate: moment().format("ll"), eventEndDate: moment().format("ll"), visibility: "", owner: "", eventStartZip: "", eventEndZip: "" });
    let [privateChecked, setPrivateChecked] = React.useState(false);
    let [open, setOpen] = useState(openIt)
    let [openSnackbar, setOpenSnackbar] = useState(false)
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
    let [alertMessage, setAlertMessage] = React.useState("");


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

    function isValidDate(startDate, endDate) {
        let dateNow = moment();
        let start = moment(startDate);
        let end = moment(endDate);
        if (end.isBefore(start) || start.isSame(end) || start.isBefore(dateNow)) {
            return false;
        } else {
            return true;
        }
    }

    let createAndSendEvent = () => {
        let newEventData = { ...newEvent };

        if (!isValidDate(newEvent.eventStartDate, newEvent.eventEndDate)) {
            setAlertMessage("End Date cannot before or equal to the Start Date, Start Date cannot be before now!");
            return setOpenSnackbar(true);
        }

        if (newEventData.eventTitle !== "" && newEventData.eventStartDate !== null && newEventData.eventEndDate !== null) {
            if (privateChecked) {
                newEventData.visibility = userEmail;
            } else (
                newEventData.visibility = "public"
            )
            newEventData.owner = userEmail;
            addEvent(newEventData);
        } else {
            setAlertMessage("Form is missing information");
            return setOpenSnackbar(true)
        }

        setOpen(false)
    }

    let togglePrivateChecked = () => {
        setPrivateChecked(!privateChecked);
    }

    const toggleClose = () => {
        toggleAddEventForm();
        setOpen(false);
    }

    return (

   
        <div>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullScreen={fullScreen}
                disableBackdropClick
            >




                <DialogTitle>
                    {"Add Event"}

                    <IconButton aria-label="close" className={classes.closeButton} onClick={() => toggleClose()}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent >

                    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>

                        <FormGroup row={true} className={classes.row}>
                            <TextField
                                className={classes.etitle}
                                label=""
                                placeholder="Title"
                                value={newEvent.eventTitle}
                                onChange={title => handleNewEventTitle(title)}
                                fullWidth
                                required

                                style={{ marginTop: "10px", textSize: "18px" }}
                                inputProps={{
                                    style: { fontSize: 20 }
                                }}
                            />
                        </FormGroup>

                        <FormGroup row={true} className={classes.row}>
                            <DatePicker
                                disablePast
                                disableToolbar
                                variant="inline"
                                format="MM/DD/YYYY"
                                margin="dense"
                                label="Start Date"
                                value={newEvent.eventStartDate}
                                onChange={date => handleNewEventStart(date)}
                                className={classes.elements}
                                // KeyboardButtonProps={{
                                //     'aria-label': 'change date',
                                // }}
                                required

                            />
                            <DatePicker
                                disablePast
                                disableToolbar
                                variant="inline"
                                format="MM/DD/YYYY"
                                margin="dense"
                                label="End Date"
                                value={newEvent.eventEndDate}
                                onChange={date => handleNewEventEnd(date)}
                                className={classes.elements}
                                required
                            />
                        </FormGroup>


                        <FormGroup row={true} className={classes.row}>
                            <TimePicker
                                autoOk
                                variant="inline"
                                disableToolbar
                                label="Start Time"
                                value={newEvent.eventStartDate}
                                onChange={time => handleNewEventStart(time)}
                                className={classes.elements}
                                required
                            />
                            <TimePicker
                                autoOk
                                variant="inline"
                                disableToolbar
                                label="End Time"
                                value={newEvent.eventEndDate}
                                onChange={time => handleNewEventEnd(time)}
                                className={classes.elements}
                                required
                            />
                        </FormGroup>
                    </MuiPickersUtilsProvider>

                    <FormGroup row={true} className={classes.row}>
                        <FormControlLabel
                            control={<Switch name="check" color="secondary" onChange={togglePrivateChecked} checked={privateChecked} />}
                            label="Private event"
                            className={classes.elements}
                        />
                    </FormGroup>


                </DialogContent>


                <DialogActions>
                    <Button variant="outlined" className={classes.submit} color="secondary" onClick={createAndSendEvent}>Submit</Button>
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

export default AddEvent;