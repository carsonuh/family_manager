import React from 'react';
import { render, fireEvent, screen, waitForElement } from '@testing-library/react';
import RemindersForm from '../components/Reminders.jsx';
import '@testing-library/jest-dom';
import UserEvent from '@testing-library/user-event';


/**
 * Tests validation and various characteristics of the event reminders form
 */
describe('reminders form', () => {
    let props;
    let container;

    beforeEach(() => {
        props = {
            toggleReminderForm: jest.fn(),
            events: [
                {
                    end: "Fri Apr 05 2020 00:00:00 GMT-0400 (Eastern Daylight Time)",
                    endZip: "49301",
                    id: "285987",
                    owner: "nabzvali@gmail.com",
                    start: "Thu Apr 04 2020 00:00:00 GMT-0400 (Eastern Daylight Time)",
                    startZip: "88888",
                    title: "Nabeel",
                    visibility: "public",
                    },
                    {
                    end: "Mon Apr 27 2020 06:00:00 GMT-0400 (Eastern Daylight Time)",
                    endZip: "",
                    id: "919126",
                    owner: "valin@mail.gvsu.edu",
                    start: "Mon Apr 27 2020 00:00:00 GMT-0400 (Eastern Daylight Time)",
                    startZip: "",
                    title: "Test",
                    visibility: "public",
                    },
                    {
                    end: "Mon Apr 27 2020 00:00:00 GMT-0400 (Eastern Daylight Time)",
                    endZip: "",
                    id: "844816",
                    owner: "nabzvali@gmail.com",
                    start: "Sun Apr 26 2020 00:00:00 GMT-0400 (Eastern Daylight Time)",
                    startZip: "",
                    title: "Bingo",
                    visibility: "public",
                    }
            ]
        };
       container = render(<RemindersForm {...props} />);
    });

    it("Form Renders correctly", () => {
        
        //Input test id's for this form
        let inputs = ['eventSelect', 'emailInput', 'phoneInput', 'timeSelect'];

        //Loop through and validate that each exist
        for (let input of inputs) {
            expect(screen.getByTestId(input)).toBeTruthy();
        }

        //Check the submit button exists
        expect(screen.getByText('Submit')).toBeTruthy();

        //The heading of the dialog should render
        expect(screen.getByText('Reminder Signup')).toBeTruthy();

        //Close button should render
        expect(screen.getByLabelText('close')).toBeTruthy();
    });

    it("Events in the event drop down filter and appear correctly", () => {
        
        //Find the event input and click it
        let eventSelectButton = screen.getAllByRole('button')[1];
        UserEvent.click(eventSelectButton);

        expect(screen.getByText('Bingo')).toBeTruthy();
        expect(screen.getByText('Test')).toBeTruthy();
    });

    it("Times in the remind me dropdown render correctly", () => {

        //Get the remind me when button
        let remindMeWhen = screen.getAllByRole('button')[2];

        //Click it
        UserEvent.click(remindMeWhen);
        
        //The three times for reminders should appear
        expect(screen.getByText('10 Minutes')).toBeTruthy();
        expect(screen.getByText('1 Hour')).toBeTruthy();
        expect(screen.getByText('1 Day')).toBeTruthy();

    });

    it("Validation fails if an empty form is submitted", () => {

        //Get the submit button
        let submitButton = screen.getByText('Submit');

        //Click the submit button and we should see a warning
        fireEvent.click(submitButton);

        expect(screen.getByText('Invalid Title')).toBeTruthy();
    });

    it("Validation fails if everything but a title is selected", () => {

        //Obtain all the inputs
        let emailInput = screen.getByTestId('emailInput');  
        let phoneInput = screen.getByTestId('phoneInput');
        let eventReminderSelectButton = screen.getAllByRole('button')[2];

        //Email and phone inputs should start out blank
        expect(emailInput.value).toBeFalsy();
        expect(phoneInput.value).toBeFalsy();

        //Add valid data to the phone and email inputs
        fireEvent.change(emailInput, { target: { value: 'test@gmail.com'}});
        fireEvent.change(phoneInput, { target: { value: '111-111-1111'}});

        //Email and phone inputs should have updates
        expect(emailInput.value).toEqual('test@gmail.com');
        expect(phoneInput.value).toEqual('111-111-1111');
        
        //Select when the reminder is wanted
        UserEvent.click(eventReminderSelectButton);
        expect(screen.getByText('10 Minutes')).toBeTruthy();

        //Get the submit button and click it
        fireEvent.click(screen.getByText('Submit'));

        expect(props.toggleReminderForm).toHaveBeenCalledTimes(0);
        expect(screen.getByText("Invalid Title")).toBeTruthy();

    });

    it("Validation fails if email or phone inputs aren't completed", () => {

        //Get the text & email inputs
        let emailInput = screen.getByTestId('emailInput');  
        let phoneInput = screen.getByTestId('phoneInput');

        //Get the drop down inputs
        let eventSelectButton = screen.getAllByRole('button')[1];
        let remindMeWhen = screen.getAllByRole('button')[2];

        //Select the event we want the reminder for
        UserEvent.click(eventSelectButton);
        fireEvent.click(screen.getByText('Bingo'));
   
        //Select when the reminder is wanted
        UserEvent.click(remindMeWhen);
        expect(screen.getByText('10 Minutes')).toBeTruthy();

        //Get the submit button and click it
        fireEvent.click(screen.getByText('Submit'));

        expect(props.toggleReminderForm).toHaveBeenCalledTimes(0);
        expect(screen.getByText("Select your event, when you want the reminder, email, phone number, or both!")).toBeTruthy();
        expect(emailInput.value).toBeFalsy();
        expect(phoneInput.value).toBeFalsy();
    });

    it("Validation fails if reminder offset isn't selected", () => {

        //Get text inputs
        let emailInput = screen.getByTestId('emailInput');  
        let phoneInput = screen.getByTestId('phoneInput');

        //Get the drop down inputs
        let eventSelectButton = screen.getAllByRole('button')[1];

        //Select the event we want the reminder for
        UserEvent.click(eventSelectButton);
        fireEvent.click(screen.getByText('Bingo'));

        //Email and phone inputs should start out blank
        expect(emailInput.value).toBeFalsy();
        expect(phoneInput.value).toBeFalsy();

        //Add valid data to the phone and email inputs
        fireEvent.change(emailInput, { target: { value: 'test@gmail.com'}});
        fireEvent.change(phoneInput, { target: { value: '111-111-1111'}});

        //Email and phone inputs should have updates
        expect(emailInput.value).toEqual('test@gmail.com');
        expect(phoneInput.value).toEqual('111-111-1111');
   
        //Get the submit button and click it
        fireEvent.click(screen.getByText('Submit'));

        expect(props.toggleReminderForm).toHaveBeenCalledTimes(0);
        expect(screen.getByText("Select your event, when you want the reminder, email, phone number, or both!")).toBeTruthy();
        expect(emailInput.value).toBeTruthy();
        expect(phoneInput.value).toBeTruthy();
    });

    it("Validation fails if A bad email is selected", () => {

        //Get text input
        let emailInput = screen.getByTestId('emailInput');  

        //Get the drop down inputs
        let eventSelectButton = screen.getAllByRole('button')[1];
        let remindMeWhen = screen.getAllByRole('button')[2];

        //Select the event we want the reminder for
        UserEvent.click(eventSelectButton);
        fireEvent.click(screen.getByText('Bingo'));

        //Email and phone inputs should start out blank
        expect(emailInput.value).toBeFalsy();

        //Add valid data to the email inputs
        fireEvent.change(emailInput, { target: { value: 'testgmail.com'}});

        //Select when the reminder is wanted
        UserEvent.click(remindMeWhen);
        fireEvent.click(screen.getByText('10 Minutes'));

        //Get the submit button and click it
        fireEvent.click(screen.getByText('Submit'));

        expect(props.toggleReminderForm).toHaveBeenCalledTimes(0);
        expect(screen.getByText("Invalid Email")).toBeTruthy();
    });

    it("Validation fails if A bad phone number is selected", () => {

        //Get text input
        let phoneInput = screen.getByTestId('phoneInput');  

        //Get the drop down inputs
        let eventSelectButton = screen.getAllByRole('button')[1];
        let remindMeWhen = screen.getAllByRole('button')[2];

        //Select the event we want the reminder for
        UserEvent.click(eventSelectButton);
        fireEvent.click(screen.getByText('Bingo'));

        //Email and phone inputs should start out blank
        expect(phoneInput.value).toBeFalsy();

        //Add invalid date data to the phone input
        fireEvent.change(phoneInput, { target: { value: '111-111a1111'}});

        //Select when the reminder is wanted
        UserEvent.click(remindMeWhen);
        fireEvent.click(screen.getByText('10 Minutes'));

        //Get the submit button and click it
        fireEvent.click(screen.getByText('Submit'));

        expect(props.toggleReminderForm).toHaveBeenCalledTimes(0);
        expect(screen.getByText("Invalid Phone Number")).toBeTruthy();
    });

    it("Validation fails if both phone and email are invalid", () => {

        //Get text inputs
        let emailInput = screen.getByTestId('emailInput');  
        let phoneInput = screen.getByTestId('phoneInput');

        //Get the drop down inputs
        let eventSelectButton = screen.getAllByRole('button')[1];
        let remindMeWhen = screen.getAllByRole('button')[2];

        //Select the event we want the reminder for
        UserEvent.click(eventSelectButton);
        fireEvent.click(screen.getByText('Bingo'));

        //Email and phone inputs should start out blank
        expect(emailInput.value).toBeFalsy();
        expect(phoneInput.value).toBeFalsy();

        //Add valid data to the phone and email inputs
        fireEvent.change(emailInput, { target: { value: 'testgmail.com'}});
        fireEvent.change(phoneInput, { target: { value: '111111-1111'}});

        //Select when the reminder is wanted
        UserEvent.click(remindMeWhen);
        fireEvent.click(screen.getByText('10 Minutes'));

        //Get the submit button and click it
        fireEvent.click(screen.getByText('Submit'));

        expect(props.toggleReminderForm).toHaveBeenCalledTimes(0);
        expect(screen.getByText("Invalid Phone Number")).toBeTruthy();
    });

    it("Email submission with all intervals - valid test", () => {

        //Get email input
        let emailInput = screen.getByTestId('emailInput');  

        //Get the drop down inputs
        let eventSelectButton = screen.getAllByRole('button')[1];
        let remindMeWhen = screen.getAllByRole('button')[2];

        //Select the event we want the reminder for
        UserEvent.click(eventSelectButton);
        fireEvent.click(screen.getByText('Bingo'));

        //Email input should start out blank
        expect(emailInput.value).toBeFalsy();

        //Add valid data to the phone and email inputs
        fireEvent.change(emailInput, { target: { value: 'valin@mail.gvsu.edu'}});

        let reminderIntervals = ['10 Minutes', '1 Hour', '1 Day'];

         //Select when the reminder is wanted
         for (let i = 0; i < reminderIntervals.length; i++) {
             UserEvent.click(remindMeWhen);
             fireEvent.click(screen.getByText(reminderIntervals[i]));
             fireEvent.click(screen.getByText('Submit'));
             expect(screen.queryByText("Invalid Phone Number")).not.toBeInTheDocument();
             expect(screen.queryByText("Invalid Email")).not.toBeInTheDocument();;
             expect(screen.queryByText("Select your event, when you want the reminder, email, phone number, or both!")).not.toBeInTheDocument();
             expect(screen.queryByText("Invalid Title")).not.toBeInTheDocument();
         }
    });

    it("Phone submission with all intervals - valid test", () => {

        //Get phone input
        let phoneInput = screen.getByTestId('phoneInput');  

        //Get the drop down inputs
        let eventSelectButton = screen.getAllByRole('button')[1];
        let remindMeWhen = screen.getAllByRole('button')[2];

        //Select the event we want the reminder for
        UserEvent.click(eventSelectButton);
        fireEvent.click(screen.getByText('Bingo'));

        //Phone input should start out blank
        expect(phoneInput.value).toBeFalsy();

        //Add valid data to the phone input
        fireEvent.change(phoneInput, { target: { value: '111-111-1111'}});

        let reminderIntervals = ['10 Minutes', '1 Hour', '1 Day'];

         //Select when the reminder is wanted
         for (let i = 0; i < reminderIntervals.length; i++) {
             UserEvent.click(remindMeWhen);
             fireEvent.click(screen.getByText(reminderIntervals[i]));
             fireEvent.click(screen.getByText('Submit'));
             expect(screen.queryByText("Invalid Phone Number")).not.toBeInTheDocument();
             expect(screen.queryByText("Invalid Email")).not.toBeInTheDocument();;
             expect(screen.queryByText("Select your event, when you want the reminder, email, phone number, or both!")).not.toBeInTheDocument();
             expect(screen.queryByText("Invalid Title")).not.toBeInTheDocument();
         }
    });

    it("Phone submission with all intervals - valid test", () => {

        //Get both inputs
        let phoneInput = screen.getByTestId('phoneInput');  
        let emailInput = screen.getByTestId('emailInput');  

        //Get the drop down inputs
        let eventSelectButton = screen.getAllByRole('button')[1];
        let remindMeWhen = screen.getAllByRole('button')[2];

        //Select the event we want the reminder for
        UserEvent.click(eventSelectButton);
        fireEvent.click(screen.getByText('Bingo'));

        //Phone and email input should start out blank
        expect(phoneInput.value).toBeFalsy();
        expect(emailInput.value).toBeFalsy();

        //Add valid data to both inputs
        fireEvent.change(phoneInput, { target: { value: '111-111-1111'}});
        fireEvent.change(emailInput, { target: { value: 'valin@mail.gvsu.edu'}});

        let reminderIntervals = ['10 Minutes', '1 Hour', '1 Day'];

         //Select when the reminder is wanted
         for (let i = 0; i < reminderIntervals.length; i++) {
             UserEvent.click(remindMeWhen);
             fireEvent.click(screen.getByText(reminderIntervals[i]));
             fireEvent.click(screen.getByText('Submit'));
             expect(screen.queryByText("Invalid Phone Number")).not.toBeInTheDocument();
             expect(screen.queryByText("Invalid Email")).not.toBeInTheDocument();;
             expect(screen.queryByText("Select your event, when you want the reminder, email, phone number, or both!")).not.toBeInTheDocument();
             expect(screen.queryByText("Invalid Title")).not.toBeInTheDocument();
         }
    });

    it("close callback should be triggered when close button is clicekd", () => {

        //Get the close button from the virtual dom and click it
        let closeButton = screen.getByLabelText('close');
        fireEvent.click(closeButton);

        expect(props.toggleReminderForm).toBeCalledTimes(1);
    });
});