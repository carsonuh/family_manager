import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ShoppingList from "../components/ShoppingList"
import "@testing-library/jest-dom"

describe("Shopping List", () => {

    let props;
    let handleClick;
    let updateStorage;

    beforeEach(() => {
        props = {
            userEmail: "carsonueckerherman@gmail.com"
        }
        handleClick = jest.fn()
        updateStorage = jest.fn()

        render(<ShoppingList {...props} />);
    });

    it("List renders correctly", () => {
        let buttons = ["add"];
        let inputs = ["itemInput"];

        // Shopping list should be displayed on page
        expect(screen.getByText("Shopping List")).toBeTruthy();

        // buttons should have been render
        for (let button of buttons) {
            expect(screen.getByLabelText(button)).toBeTruthy();
        }

        // inputs should have been render
        for (let input of inputs) {
            expect(screen.getByTestId(input)).toBeTruthy();
        }
    })

    it("Clicking expand icon should expand shopping list", () => {
        let expandButton = screen.getByLabelText("expand");

        // click the expand icon
        fireEvent.click(expandButton);

        // shopping list should be displayed
        expect(screen.getByLabelText("list")).toBeTruthy()
    })

    it("When creating a new item", () => {
        let input = screen.getByTestId("itemInput");

        fireEvent.change(input, { target: { value: "item" } });
        expect(input.value).toBe("item")
    })
})