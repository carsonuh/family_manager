describe("Logging in", () => {
    it('Logging In', () => {
        cy.visit('localhost:3000')
        cy.get('#loginButton').click()
    });
})