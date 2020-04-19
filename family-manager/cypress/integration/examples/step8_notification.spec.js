describe("Notifications", () => {
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
        cy.get('.MuiTypography-root > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()

    })
})