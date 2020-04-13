import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import EditForm from '../components/EditEvent.jsx';
import '@testing-library/jest-dom';
import moment from 'moment';

describe('Add Event Form', () => {

    let props;

    beforeEach(() => {
        props = {
            key: 16,
            editCallback: jest.fn(),
            deleteCallback: jest.fn(),
            closeCallback: jest.fn(),
            userEmail: 'valin@mail.gvsu.edu',
            isChild: false,
            userEventData: {
                eventStart: '04/27/2020',
                eventEnd: '04/28/2020',
                eventTitle: 'My Test Event',
                id: 23123,
                owner: 'valin@mail.gvsu.edu',
                visibility: 'public',
                endZip: '',
                startZip: ''
            }
        }
        render(<EditForm {...props} />);
    });

    it("Form Renders Correctly", () => {

        let buttons = ['edit', 'delete', 'close'];
        let inputList = ['titleInput', 'startTimeInput', 'endDateInput', 'endTimeInput', 'privateCheck', 'startZipInput', 'endZipInput'];

        //Dialog Title Should Render Correctly
        expect(screen.getByText("Event Details")).toBeTruthy();
    
        //Buttons should render correctly
        for (let button of buttons) {
            expect(screen.getByLabelText(button)).toBeTruthy();
        }

        //Inputs Should Render Correctly and they should be disabled
        for (let input of inputList) {
            expect(screen.getByTestId(input)).toBeTruthy();
            expect(screen.getByTestId(input).disabled).toBeTruthy();
        }
    });

    it("Clicking edit icon updates enables form inputs", () => {

        let inputList = ['titleInput', 'startTimeInput', 'endDateInput', 'endTimeInput', 'privateCheck', 'startZipInput', 'endZipInput'];

         //Before clicking edit Inputs Should Render Correctly and they should be disabled
        for (let input of inputList) {
            expect(screen.getByTestId(input)).toBeTruthy();
            expect(screen.getByTestId(input).disabled).toBeTruthy();
        }

        //Get the edit button
        let editButton = screen.getByLabelText('edit');

        //Click the edit button
        fireEvent.click(editButton);

        //Inputs should render correctly and they should be disabled
        for (let input of inputList) {
            expect(screen.getByTestId(input)).toBeTruthy();
            expect(screen.getByTestId(input).disabled).toBeFalsy();
        }
    });

    it("Clicking the delete icon triggers the delete callback", () => {
        //Get the delete button
        let deleteButton = screen.getByLabelText('delete');

        //Click the delete button
        fireEvent.click(deleteButton);

        //Delete callback should be called
        expect(props.deleteCallback).toBeCalledTimes(1);
    }); 

    it("Clicking the close icon triggers the close callback", () => {
        //Get the close button
        let closeButton = screen.getByLabelText('close');

        //Click the close button
        fireEvent.click(closeButton);

        //Close callback should be triggered once
        expect(props.closeCallback).toBeCalledTimes(1);
    });

    it("A child user should not be able to edit or delete events", () => {
        props = {
            key: 16,
            editCallback: jest.fn(),
            deleteCallback: jest.fn(),
            closeCallback: jest.fn(),
            userEmail: 'valin@mail.gvsu.edu',
            isChild: true,
            userEventData: {
                eventStart: '04/27/2020',
                eventEnd: '04/28/2020',
                eventTitle: 'My Test Event',
                id: 23123,
                owner: 'valin@mail.gvsu.edu',
                visibility: 'public',
                endZip: '',
                startZip: ''
            }
        }
        render(<EditForm {...props} />);

        expect(screen.getAllByLabelText('close')).toBeTruthy();

        //Get the edit & delete button
        let editButton = screen.getByLabelText('edit');
        let deleteButton = screen.getByLabelText('delete');

        //Click the edit button
        fireEvent.click(editButton);
        fireEvent.click(deleteButton);

        //Edit and delete button callbacks shouldn't be called
        expect(props.editCallback).toBeCalledTimes(0);
        expect(props.deleteCallback).toBeCalledTimes(0);
    });

    it("Validation fails if user removes title", () => {
        
        //Get the title input box and edit button
        let titleInput = screen.getByTestId('titleInput');
        let editButton = screen.getByLabelText('edit');
        
        //Click the edit button
        fireEvent.click(editButton);

        //Now the submit button should be visible
        let submitButton = screen.getByText('Submit');

        //Check it's current value
        expect(titleInput.value).toBe('My Test Event');

        //Update the value to nothing
        fireEvent.change(titleInput, { target: { value: ''}});

        //Check titles updated value
        expect(titleInput.value).toBe('');

        fireEvent.click(submitButton);

        expect(props.editCallback).toBeCalledTimes(0);
        expect(screen.getByText("Missing Title!")).toBeTruthy();
    });

    it("Validation fails if start date and end date are the same", () => {
        //Obtain the start and end date inputs
        let startDateInput = screen.getByTestId('startDateInput');
        let endDateInput = screen.getByTestId('endDateInput');      
        
        //Validated their current values
        expect(startDateInput.value).toBe('04/27/2020');
        expect(endDateInput.value).toBe('04/28/2020');

        //Toggle the edit form
        let editButton = screen.getByLabelText('edit');
        fireEvent.click(editButton);

        //Select the start date make it the end date
        fireEvent.click(startDateInput);
        let startDate = screen.getByText('28');
        fireEvent.click(startDate);

        //Get the submit button
        let submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        expect(props.editCallback).toBeCalledTimes(0);
        expect(screen.getByText("End Date cannot be before or equal to the Start Date!")).toBeTruthy();
    });

    it("Validation fails if the user moves the end date before the start date", () => {
        //Obtain the end date input
        let endDateInput = screen.getByTestId('endDateInput');

        //Validate its current value
        expect(endDateInput.value).toBe('04/28/2020');

        //Toggle the edit form
        let editButton = screen.getByLabelText('edit');
        fireEvent.click(editButton);

        //Select an end date before the start date
        fireEvent.click(endDateInput);
        let endDate = screen.getByText('20');
        fireEvent.click(endDate);

        //Get the submit button and click it
        let submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        expect(props.editCallback).toBeCalledTimes(0);
        expect(screen.getByText('End Date cannot be before or equal to the Start Date!')).toBeTruthy();
    });

    it("Non-numeric zipcodes are cleared from edited data", () => {
        //Obtain the start and end zipcode input fields
        let startZip = screen.getByTestId('startZipInput');
        let endZip = screen.getByTestId('endZipInput');

        //Toggle the edit form
        let editButton = screen.getByLabelText('edit');
        fireEvent.click(editButton);

        //Start and end zips should be nothing before editing
        expect(startZip.value).toBe('');
        expect(endZip.value).toBe('');

        //Update the values
        fireEvent.change(startZip, { target: { value: '111dfafd11'}});
        fireEvent.change(endZip, { target: { value: 'aaaaa'}});

        expect(startZip.value).toBe('111dfafd11');
        expect(endZip.value).toBe('aaaaa');

        //Get the submit button and click it
        let submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);        

        let data ={"endZip": "", "eventEnd": "04/28/2020", "eventStart": "04/27/2020", "eventTitle": "My Test Event", "id": 23123, "owner": "valin@mail.gvsu.edu", "startZip": "", "visibility": "public"};

        //Edit callback should be called but, the zipcodes should be empty
        expect(props.editCallback).toBeCalledTimes(1);
        expect(props.editCallback).toBeCalledWith(data);
    });

    it('Invalid numeric zipcodes should be cleared from data', () =>{
        //Obtain the start and end zipcode input fields
        let startZip = screen.getByTestId('startZipInput');
        let endZip = screen.getByTestId('endZipInput');
   
        //Toggle the edit form
        let editButton = screen.getByLabelText('edit');
        fireEvent.click(editButton);
   
        //Start and end zips should be nothing before editing
        expect(startZip.value).toBe('');
        expect(endZip.value).toBe('');
   
        //Update the values
        fireEvent.change(startZip, { target: { value: '11111'}});
        fireEvent.change(endZip, { target: { value: '99999'}});
   
        expect(startZip.value).toBe('11111');
        expect(endZip.value).toBe('99999');
   
        //Get the submit button and click it
        let submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);        
   
        let data ={"endZip": "", "eventEnd": "04/28/2020", "eventStart": "04/27/2020", "eventTitle": "My Test Event", "id": 23123, "owner": "valin@mail.gvsu.edu", "startZip": "", "visibility": "public"};
   
        //Edit callback should be called but, the zipcodes should be empty
        expect(props.editCallback).toBeCalledTimes(1);
        expect(props.editCallback).toBeCalledWith(data);
    });

    it("An event which is in the past should not be editable or deleteable", () => {
        props = {
            key: 16,
            editCallback: jest.fn(),
            deleteCallback: jest.fn(),
            closeCallback: jest.fn(),
            userEmail: 'valin@mail.gvsu.edu',
            isChild: true,
            userEventData: {
                eventStart: '04/01/2020',
                eventEnd: '04/02/2020',
                eventTitle: 'My Test Event',
                id: 23123,
                owner: 'valin@mail.gvsu.edu',
                visibility: 'public',
                endZip: '',
                startZip: ''
            }
        }
        render(<EditForm {...props} />);

        expect(screen.getAllByLabelText('close')).toBeTruthy();

        //Get the edit & delete button
        let editButton = screen.getByLabelText('edit');
        let deleteButton = screen.getByLabelText('delete');

        //Click the edit button
        fireEvent.click(editButton);
        fireEvent.click(deleteButton);

        //Edit and delete button callbacks shouldn't be called, because they're not visible
        expect(props.editCallback).toBeCalledTimes(0);
        expect(props.deleteCallback).toBeCalledTimes(0);
    });

    it("Event is updated on valid title update", () => {
        
        //Get the title input box and edit button
        let titleInput = screen.getByTestId('titleInput');
        let editButton = screen.getByLabelText('edit');
        
        //Click the edit button
        fireEvent.click(editButton);

        //Now the submit button should be visible
        let submitButton = screen.getByText('Submit');

        //Check it's current value
        expect(titleInput.value).toBe('My Test Event');

        //Update the value
        fireEvent.change(titleInput, { target: { value: 'My New Event'}});

        //Check titles updated value
        expect(titleInput.value).toBe('My New Event');

        fireEvent.click(submitButton);

        let data ={"endZip": "", "eventEnd": "04/28/2020", "eventStart": "04/27/2020", "eventTitle": "My New Event", "id": 23123, "owner": "valin@mail.gvsu.edu", "startZip": "", "visibility": "public"};

        expect(props.editCallback).toBeCalledTimes(1);
        expect(props.editCallback).toBeCalledWith(data);
    });

    it("Event is updated on valid date update", () => {
        //Obtain the start and end date inputs
        let startDateInput = screen.getByTestId('startDateInput');
        let endDateInput = screen.getByTestId('endDateInput');      
        
        //Validated their current values
        expect(startDateInput.value).toBe('04/27/2020');
        expect(endDateInput.value).toBe('04/28/2020');

        //Toggle the edit form
        let editButton = screen.getByLabelText('edit');
        fireEvent.click(editButton);

        //Select the start date, update it
        fireEvent.click(startDateInput);
        let startDate = screen.getByText('26');
        fireEvent.click(startDate);

        //Select the end date, update it
        fireEvent.click(endDateInput);
        let endDate = screen.getAllByText('28')[1];
        fireEvent.click(endDate);

        //Get the submit button
        let submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        expect(props.editCallback).toBeCalledTimes(1);
    });

    it('Event Data is updated on valid zipcode change', () =>{
        //Obtain the start and end zipcode input fields
        let startZip = screen.getByTestId('startZipInput');
        let endZip = screen.getByTestId('endZipInput');
   
        //Toggle the edit form
        let editButton = screen.getByLabelText('edit');
        fireEvent.click(editButton);
   
        //Start and end zips should be nothing before editing
        expect(startZip.value).toBe('');
        expect(endZip.value).toBe('');
   
        //Update the values
        fireEvent.change(startZip, { target: { value: '49301'}});
        fireEvent.change(endZip, { target: { value: '49401'}});
   
        expect(startZip.value).toBe('49301');
        expect(endZip.value).toBe('49401');
   
        //Get the submit button and click it
        let submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);        
   
        let data ={"endZip": "49401", "eventEnd": "04/28/2020", "eventStart": "04/27/2020", "eventTitle": "My Test Event", "id": 23123, "owner": "valin@mail.gvsu.edu", "startZip": "49301", "visibility": "public"};
   
        //Edit callback should be called but, the zipcodes should be empty
        expect(props.editCallback).toBeCalledTimes(1);
        expect(props.editCallback).toBeCalledWith(data);
    });

    it('Event data is updated on private button toggle', () =>{
        //Obtain the private button checkbox
        let privateButton = screen.getByTestId('privateCheck');

        //Toggle Edit
        let editButton = screen.getByLabelText('edit');
        fireEvent.click(editButton);

        //Check the private button
        fireEvent.click(privateButton);

        //Get the submit button and click it
        let submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);        
   
        //Visibility param updated with user's email to indicate only they can see it
        let data ={"endZip": "", "eventEnd": "04/28/2020", "eventStart": "04/27/2020", "eventTitle": "My Test Event", "id": 23123, "owner": "valin@mail.gvsu.edu", "startZip": "", "visibility": "valin@mail.gvsu.edu"};
   
        //Edit callback should be called but, the zipcodes should be empty
        expect(props.editCallback).toBeCalledTimes(1);
        expect(props.editCallback).toBeCalledWith(data);
    });

    it('Testing a valid change to all inputs', () => {

        //Get all of the inputs
        let titleInput = screen.getByTestId('titleInput');
        let startDateInput = screen.getByTestId('startDateInput');
        let endDateInput = screen.getByTestId('endDateInput'); 
        let startZip = screen.getByTestId('startZipInput');
        let endZip = screen.getByTestId('endZipInput');
        let privateButton = screen.getByTestId('privateCheck');

        //Toggle Edit
        let editButton = screen.getByLabelText('edit');
        fireEvent.click(editButton);

        //Update the title
        fireEvent.change(titleInput, { target: { value: 'My New Event'}});

        //Select the start and end date, update then
        fireEvent.click(startDateInput);
        let startDate = screen.getByText('26');
        fireEvent.click(startDate);
        
        //Select the end date, update it
        fireEvent.click(endDateInput);
        let endDate = screen.getAllByText('28')[1];
        fireEvent.click(endDate);

        //Update the zipcodes
        fireEvent.change(startZip, { target: { value: '49301'}});
        fireEvent.change(endZip, { target: { value: '49401'}});
   
        expect(startZip.value).toBe('49301');
        expect(endZip.value).toBe('49401');

        //Check the private button
        fireEvent.click(privateButton);

        //Get the submit button and click it
        let submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);        
      
        //Edit callback should be called but, the zipcodes should be empty
        expect(props.editCallback).toBeCalledTimes(1);
    });
});

