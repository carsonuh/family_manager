describe("Settings", () => {
    it("Open settings", () => {
        cy.get(':nth-child(6) > .MuiButtonBase-root').click()
    })

    it("Add click add", () => {
        cy.get('.MuiListSubheader-root > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
        cy.get('.MuiDialogContent-root > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type("family_manager_cal.child@yahoo.com")
        cy.get('.MuiFormControlLabel-root').click()
        cy.get('.MuiDialogActions-root > :nth-child(2)').click()
        cy.wait(1000)
        cy.get('.MuiDialog-paper > .MuiPaper-root > .MuiToolbar-root > .MuiButtonBase-root').click()
        cy.reload()
    })

    it("Open drawer", () => {
        cy.get('[aria-label="menu"]').click();
        cy.wait(2000)
    })

})