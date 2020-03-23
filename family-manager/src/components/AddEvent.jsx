import React from 'react';
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


function AddEvent({addEvent, toggleAddEvent}) {

    let [newEvent, setNewEvent] = React.useState({ eventTitle: "My New Event", eventStartDate: null, eventEndDate: null });

    let handleNewEventTitle = (e) => {
        let newEventDetails = {...newEvent};
        newEventDetails.eventTitle = e;
        setNewEvent(newEventDetails);
    }

    let handleNewEventStart = (e) => {
        let newEventDetails = {...newEvent};
        newEventDetails.eventStartDate = e;
        setNewEvent(newEventDetails);
    }

    let handleNewEventEnd = (e) => {
        let newEventDetails = {...newEvent};
        newEventDetails.eventEndDate = e;
        setNewEvent(newEventDetails);
    }

    let createAndSendEvent = () => {
        let newEventData = {...newEvent};
        addEvent(newEventData);
    }

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
               <Button variant="contained" color="primary" onClick={createAndSendEvent}>Submit</Button>
               <Button variant="contained" color="primary" onClick={toggleAddEvent}>Close</Button>
            </form>
        </div>
    )
}

export default AddEvent;