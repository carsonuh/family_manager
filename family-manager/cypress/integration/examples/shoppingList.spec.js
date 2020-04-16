describe("Shopping list", () => {

    it("Open drawer", () => {
        cy.get('[aria-label="menu"]').click();
        cy.wait(2000)
    })

    it("Open shopping list", () => {
        cy.contains('Shopping List').click();
    })

    it('Add item - "Cookies"', () => {
        cy.get('[id="addItem"]').click().type('Cookies');
        cy.get('[type="submit"]').click();
        expect(cy.contains('Cookies')).to.exist;

    });

    // it('Add item - "Pretzels"', () => {
    //     cy.get('[id="addItem"]').click().type('Pretzels');
    //     cy.get('[type="submit"]').click();
    //     expect(cy.contains('Pretzels')).to.exist;
    //     cy.wait(500)
    // });

    // it('Add item - "Ice cream"', () => {
    //     cy.get('[id="addItem"]').click().type('Ice cream');
    //     cy.get('[type="submit"]').click();
    //     expect(cy.contains('Ice cream')).to.exist;
    //     cy.wait(500)
    // });

    it('Remove item - "Cookies"', () => {
        cy.wait(2000)
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
})