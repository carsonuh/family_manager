import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DisplayItem from "../components/DisplayItem"
import "@testing-library/jest-dom"

describe("Display Item", () => {
    let props;
    let mockPreventDefault;
    beforeEach( () => {
        props = {
            key: 1,
            item: "Cookies",
            completed: false,
            handleChange: jest.fn()
        }
        mockPreventDefault = jest.fn()
        render(<DisplayItem {...props} />)
    })

    it("Renders correctly", () => {
        let items = ["shoppingListItem", "shoppingListItemCB"];

        for(let item of items) {
            expect(screen.getByLabelText(item)).toBeTruthy()
        }
    })

    it("When item is checked off", () => {

        // checkbox item
        let cb = screen.getByLabelText("shoppingListItemCB");

        // click checkbox
        fireEvent.click(cb);
       // fireEvent.change({item: "Cookies"})
        // when check box is clicked
        expect(props.handleChange).toHaveBeenCalled
    })

 
})