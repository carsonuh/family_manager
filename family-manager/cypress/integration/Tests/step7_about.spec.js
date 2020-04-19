describe("About page", () => {

    it("Open drawer", () => {
        cy.get('[aria-label="menu"]').click();
        cy.wait(2000)
    })

    it("Click about", () => {
        cy.get(':nth-child(7) > .MuiButtonBase-root').click()
        cy.get('.MuiDialogContent-root').scrollTo('center', { duration: 5000 })
        cy.get('.MuiDialogContent-root').scrollTo('bottom', { duration: 5000 })
        cy.get('.MuiDialog-paper > .MuiPaper-root > .MuiToolbar-root > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
    })
})