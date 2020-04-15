import { cyan } from "@material-ui/core/colors";

describe('Cypress', () => {
    let today;
    let month;
    beforeEach(() => {
        today = new Date();
        month = new Date();

    })

    it('Logging In', () => {
        cy.visit('localhost:3000')
        cy.get('#loginButton').click()
    });

    // it('visits the app', () => {
    //     cy.visit('http://localhost:3000')
    // });

    // it('logins in to the app', () => {
    //     cy.visit('localhost:3000')
    //     cy.get('#loginButton').click()
    //     cy.get('[aria-label="SpeedDial example"]').click();
    //     cy.get('[title="Add Event"]').click();
    //     cy.get('[data-testid="eventTitleInput"').type('stupid event');
    //     cy.get('[data-testid="startDateInput"').click();
    //     cy.get('[class="MuiPickersCalendar-week"]').eq(4).get('[role="presentation"').eq(40).click();
    //     cy.get('[role="presentation"]').eq(1).click({force: true});
    //     // cy.get('[class="MuiPickersCalendar-week"]').eq(4).get('[role="presentation"').eq(40).click();
    //     // cy.contains('Submit').click({force: true})
    // });

    it('Add item - "Cookies"', () => {
        cy.get('[aria-label="menu"]').click();
        cy.wait(2000)
        cy.contains('Shopping List').click();
        cy.get('[id="addItem"]').click().type('Cookies');
        cy.get('[type="submit"]').click();
        expect(cy.contains('Cookies')).to.exist;
    });

    it('Remove item - "Cookies"', () => {
        cy.wait(500)
        cy.get('[aria-label="shoppingListItemCB"]').last().click();
        cy.contains('Cookies').should('not.exist')
    })

    it("Close shopping list", () => {
        cy.wait(1000)
        cy.contains('Shopping List').click();
    })

    it("Close app drawer", () => {
        cy.wait(1000)
        cy.get('[aria-label="menu"]').click();
    })

    it("Click next -> Go to next month", () => {
        let nextMonth = month;
        nextMonth.setDate(1);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth = nextMonth.toLocaleString('default', { month: 'long' });
        cy.wait(1000);
        cy.get(".rbc-btn-group>button").eq(2).click();
        expect(cy.contains(nextMonth)).to.exist;
    })

    it("Click today", () => {
        let currMonth = month
        currMonth.setDate(1)
        currMonth.setMonth(currMonth.getMonth() + 0)
        currMonth = currMonth.toLocaleString('default', { month: 'long' })
        cy.wait(1000)
        cy.get(".rbc-btn-group>button").eq(0).click()
        expect(cy.get('.rbc-toolbar-label').contains(currMonth))
        expect(cy.get('.rbc-now').contains(today.getDate()))
    })

    it("Click prev -> Go to previous month", () => {
        let prevMonth = month;
        prevMonth.setDate(1);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        prevMonth = prevMonth.toLocaleString('default', { month: 'long' })
        cy.wait(1000)
        cy.get(".rbc-btn-group>button").eq(1).click()
        expect(cy.contains(prevMonth)).to.exist;
    })

    it("notifications", () => {
        cy.get('.MuiSpeedDial-fab').click()

        cy.get('[style="position: absolute; width: 50px; height: 50px; bottom: 20vh; right: 5vw; z-index: 10;"]').click()

        // --- event dropdown does not get populated ----
        // cy.wait(3000)
        cy.get('#demosimple-select').click()
        cy.get('.MuiList-root > [tabindex="0"]').click()
        cy.get(':nth-child(2) > .MuiInputBase-root > .MuiInputBase-input').type("ueckerhc@mail.gvsu.edu")
        cy.get(':nth-child(3) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type("616-309-0991")
        cy.get('#demo-simple-select').click()
        cy.get('[data-value="2"]').click()

        //click close
        cy.wait(1000)
        //cy.get('.MuiTypography-root > .MuiButtonBase-root').click()
        cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click()
    })


});