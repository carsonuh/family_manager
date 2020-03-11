import React, { Component } from 'react';
import { Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

//setup time localizer
const localizer = momentLocalizer(moment);

//Test event array
const testEvents = [
    {
        allDay: true,
        end: new Date('March 10, 2020 07:50:00'),
        start: new Date('March 10, 2020 08:00:00'),
        title: 'Empty'
    }
]

//Styles for the calendar, all styles will be moved to a single CSS file later on
const CalendarStyles = {
    calendarContainer: {
        height: "750px",
        width: "75%",
        margin: "0 auto"
    }
}

/**
 * This is a bare calendar that's displayed when a user isn't logged in
 */
class EmptyCalendar extends Component {
    constructor(props){
        super(props);
        this.state = {
            events: [],
        }
    }

    render() {
        return(
            <div style={CalendarStyles.calendarContainer}>
                <Calendar
                    localizer={localizer}
                    events={testEvents}
                    startAccess="start"
                    endAccessor="end"
                />
            </div>
        )
    }
}

export default EmptyCalendar;
