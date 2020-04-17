import { wait } from "@testing-library/react";

describe("Remove child account", () => {
    it("Open settings", () => {
        cy.get(':nth-child(6) > .MuiButtonBase-root').click()
    })

    it("Remove child", () => {
        cy.wait(1000)
        cy.get(':nth-child(3) > .MuiListItem-container > .MuiListItemSecondaryAction-root > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click();
        cy.wait(2000)
        cy.get('.MuiDialog-paper > .MuiPaper-root > .MuiToolbar-root > .MuiButtonBase-root').click()
    })

})