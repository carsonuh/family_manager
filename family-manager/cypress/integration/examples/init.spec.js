import { cyan } from "@material-ui/core/colors";

describe('Cypress', () => {
    it('Is working', () => {
        expect(true).to.equal(true);
    });

    // it('visits the app', () => {
    //     cy.visit('http://localhost:3000')
    // });

    it('logins in to the app', () => {
        cy.visit('http://localhost:3000')
        cy.get('#loginButton').click()
        cy.get('#identifierId')
        .type('ihatethis')
    });
});