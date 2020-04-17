import { wait } from "@testing-library/react"

describe("Chore List", () => {


    it('Add new chore - "Do the dishes"', () => {
        //cy.get('.MuiExpansionPanelSummary-content > div > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root > path').click()
        cy.get('.MuiExpansionPanelSummary-content > div > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
        cy.get('#outlined-basic').type("Do the dishes")
        cy.get("#child_list").select("family_manager_cal.child@yahoo.com")
        cy.wait(1500)
        cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click()
    })

    it('Add new chore - "Take out trash"', () => {
        //cy.get('.MuiExpansionPanelSummary-content > div > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root > path').click()
        cy.get('.MuiExpansionPanelSummary-content > div > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
        cy.get('#outlined-basic').type("Take out trash")
        cy.get("#child_list").select("family_manager_cal.child@yahoo.com")
        cy.wait(1500)
        cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click()
    })

    it("Click chore list", () => {
        //cy.get('.MuiBox-root-452 > .MuiPaper-root > #panel1a-header > .MuiExpansionPanelSummary-content').click()
        cy.wait(1000)
        cy.get('.MuiBox-root-452 > .MuiPaper-root > #panel1a-header').click()
    })

    it('Remove chore - "Take out trash"', () => {
        cy.wait(1000)
        cy.get(':nth-child(2) > .MuiListItemSecondaryAction-root > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click()
    })


})