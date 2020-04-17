describe("Calendar nav controls", () => {

    let today;
    let month;
    beforeEach(() => {
        today = new Date();
        month = new Date();
    })

    it("Close app drawer", () => {
        cy.wait(1000)
        cy.get('[aria-label="menu"]').click();
    })

    it("Click next -> Go to next month", () => {
        let nextMonth = month;
        nextMonth.setDate(1);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth = nextMonth.toLocaleString('default', { month: 'long' });
        cy.wait(1000);
        cy.get(".rbc-btn-group>button").eq(2).click();
        expect(cy.contains(nextMonth)).to.exist;
    })

    it("Click today", () => {
        let currMonth = month
        currMonth.setDate(1)
        currMonth.setMonth(currMonth.getMonth() + 0)
        currMonth = currMonth.toLocaleString('default', { month: 'long' })
        cy.wait(3000)
        cy.get(".rbc-btn-group>button").eq(0).click()
        expect(cy.get('.rbc-toolbar-label').contains(currMonth))
        expect(cy.get('.rbc-now').contains(today.getDate()))
    })

    it("Click prev -> Go to previous month", () => {
        let prevMonth = month;
        prevMonth.setDate(1);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        prevMonth = prevMonth.toLocaleString('default', { month: 'long' })
        cy.wait(3000)
        cy.get(".rbc-btn-group>button").eq(1).click()
        expect(cy.contains(prevMonth)).to.exist;
    })
})