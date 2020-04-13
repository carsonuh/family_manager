import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import AddForm from '../components/AddEvent.jsx';
import '@testing-library/jest-dom';
import moment from 'moment';

describe('Add Event Form', () => {

    let props;
    let mockPreventDefault;

    beforeEach(() => {
        props = {
            addEvent: jest.fn(),
            toggleAddEventForm: jest.fn(),
            userEmail: 'valin@mail.gvsu.edu',
            openIt: true
        }
        mockPreventDefault = jest.fn();
        render(<AddForm {...props} />);
    });

    it("Form Renders Correctly", () => {

        let inputList = ['Start Date', 'End Date', 'Start Time', 'End Time', 'Private event'];

        //Dialog Title Should Render Correctly
        expect(screen.getByText("Add Event")).toBeTruthy();

        //Inputs Should Render Correctly
        for (let input of inputList) {
            expect(screen.getByText(input)).toBeTruthy();
        }

        expect(screen.getByPlaceholderText('Title')).toBeTruthy();
    });

    it("Valid form input changes propagate correctly", () => {
        //Grab the title input by its placeholder text
        let titleInput = screen.getByPlaceholderText('Title');


        let startDateInput = screen.getByTestId('startDateInput');
        let endDateInput = screen.getByTestId('endDateInput');
        let submitButton = screen.getByText('Submit');

        //Select the start Date
        fireEvent.click(startDateInput);
        let startDay = screen.getByText('27');
        fireEvent.click(startDay);

        //Select The End Date, get [1] because both prompts will be open
        fireEvent.click(endDateInput);
        let endDay = screen.getAllByText('28')[1];
        fireEvent.click(endDay);

        //Add text to the inputs
        fireEvent.change(titleInput, { target: { value: 'My Test Event'}});
        fireEvent.click(submitButton);

        expect(screen.getByPlaceholderText('Title').value).toBe('My Test Event');
        expect(screen.getByTestId('startDateInput').value).toBe('04/27/2020');
        expect(screen.getByTestId('endDateInput').value).toBe('04/28/2020');
        
        //If add event is called that means the input validation passed
        expect(props.addEvent).toHaveBeenCalledTimes(1);
    });

    it("Validation fails when title is empty", () => {

        //Grab the submit button, so we can click it
        let submitButton = screen.getByText('Submit');

        //Obtain the start and end date inputs
        let startDateInput = screen.getByTestId('startDateInput');
        let endDateInput = screen.getByTestId('endDateInput');

        //Select the start Date
        fireEvent.click(startDateInput);
        let startDay = screen.getByText('26');
        fireEvent.click(startDay);
 
        //Select The End Date, get [1] because both prompts will be open
        fireEvent.click(endDateInput);
        let endDay = screen.getAllByText('27')[1];
        fireEvent.click(endDay);

        fireEvent.click(submitButton);

        expect(screen.getByText("Form is missing information")).toBeTruthy();
        expect(props.addEvent).toBeCalledTimes(0);
    });

    it("Validation fails when start date is before today's date", () => {

        //Grab the submit button, so we can click it
        let submitButton = screen.getByText("Submit");

        //Obtain the start and end date inputs
        let endDateInput = screen.getByTestId('endDateInput');

        //Dont select the start date, it will default to midnight of the current day
        
        //Select The End Date, get [1] because both prompts will be open
        fireEvent.click(endDateInput);
        let endDay = screen.getByText('27');
        fireEvent.click(endDay);
    
        fireEvent.click(submitButton);

        expect(screen.getByText("End Date cannot be before or equal to the Start Date, Start Date cannot be before now!")).toBeTruthy();
        expect(props.addEvent).toBeCalledTimes(0);
    });

    it("Validation fails when start date is equal to today's date", () => {

        //Grab the submit button so we can click it
        let submitButton = screen.getByText("Submit");

        //When the form opens initially both start and end date are equal

        //Click the submit button
        fireEvent.click(submitButton);

        expect(screen.getByText("End Date cannot be before or equal to the Start Date, Start Date cannot be before now!")).toBeTruthy();
        expect(props.addEvent).toBeCalledTimes(0);
    });

    it("Validation fails when end date is before start date", () => {

        //Grab the submit button so we can click it
        let submitButton = screen.getByText("Submit");

        //Obtain the start and end date inputs
        let startDateInput = screen.getByTestId('startDateInput');
        let endDateInput = screen.getByTestId('endDateInput');
   
        //Select the start Date
        fireEvent.click(startDateInput);
        let startDay = screen.getByText('26');
        fireEvent.click(startDay);
    
        //Select The End Date, get [1] because both prompts will be open
        fireEvent.click(endDateInput);
        let endDay = screen.getAllByText('25')[1];
        fireEvent.click(endDay);

        //Click the submit button
        fireEvent.click(submitButton);

        expect(screen.getByText("End Date cannot be before or equal to the Start Date, Start Date cannot be before now!")).toBeTruthy();
        expect(props.addEvent).toBeCalledTimes(0);
    });

    it("Validation passes on a valid form with private checked", () => {
        //Grab the title input by its placeholder text
        let titleInput = screen.getByPlaceholderText('Title');

        //Grab the other input fields and the submit button
        let startDateInput = screen.getByTestId('startDateInput');
        let endDateInput = screen.getByTestId('endDateInput');
        let privateCheck = screen.getByTestId('privateCheck');
        let submitButton = screen.getByText('Submit');
 
        //Select the start Date
        fireEvent.click(startDateInput);
        let startDay = screen.getByText('27');
        fireEvent.click(startDay);
 
        //Select The End Date, get [1] because both prompts will be open
        fireEvent.click(endDateInput);
        let endDay = screen.getAllByText('28')[1];
        fireEvent.click(endDay);
 
        //Add text to the inputs and tick the private check
        fireEvent.change(titleInput, { target: { value: 'My Test Event'}});
        fireEvent.click(privateCheck);

        fireEvent.click(submitButton);
 
        expect(screen.getByPlaceholderText('Title').value).toBe('My Test Event');
        expect(screen.getByTestId('startDateInput').value).toBe('04/27/2020');
        expect(screen.getByTestId('endDateInput').value).toBe('04/28/2020');
         
        let eventData = {
            eventEndDate: "2020-04-28T04:00:00.000Z",
            eventEndZip: "",
            eventStartDate: "2020-04-27T04:00:00.000Z",
            eventStartZip: "",
            eventTitle: "My Test Event",
            owner: "valin@mail.gvsu.edu",
            visibility: "valin@mail.gvsu.edu",
        };

        //If add event is called that means the input validation passed
        expect(props.addEvent).toHaveBeenCalledTimes(1);
        // expect(props.addEvent).toHaveBeenCalledWith(expect.objectContaining(eventData))
    });

    it("Form closes when X is clicked", () => {

        //Grab the submit button so we can click it
        let closeButton = screen.getByLabelText('close');
        
        //Click the close button
        fireEvent.click(closeButton);

        expect(props.addEvent).toBeCalledTimes(0);
        expect(props.toggleAddEventForm).toBeCalledTimes(1);
    });
});

