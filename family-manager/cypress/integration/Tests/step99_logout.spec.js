import { wait } from "@testing-library/react"


describe("Logout", () => {
    it("Click logout button", () => {
        cy.wait(3000)
        cy.get('.MuiToolbar-root > .MuiButton-root').click()
    })
})