import { cyan } from "@material-ui/core/colors";

describe('Cypress', () => {
    it('Is working', () => {
        expect(true).to.equal(true);
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

    it('test', () => {
        cy.visit('localhost:3000')
        cy.get('#loginButton').click()
        cy.get('[aria-label="menu"]').click();
        cy.wait(2000)
        cy.contains('Shopping List').click();
        cy.get('[id="addItem"]').click().type('cookies');
        cy.get('[type="submit"]').click();
        expect(cy.contains('cookies')).to.exist;
    });
});