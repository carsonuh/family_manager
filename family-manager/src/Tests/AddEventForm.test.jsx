import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import AddForm from '../components/AddEvent.jsx';
import '@testing-library/jest-dom';

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

        //Add text to the input
        fireEvent.change(titleInput, { target: { value: 'My Test Event'}});
        expect(screen.getByPlaceholderText('Title').value).toBe('My Test Event');
    });
});

