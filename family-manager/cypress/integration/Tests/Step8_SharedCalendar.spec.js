describe('Shared Calendar Functionality Test', () => {
    it('Valid events can be added', () => {
        
        //Click the option spinner and select add event
        cy.get('[aria-label="SpeedDial example"]').click();
        cy.get('[title="Add Event"]').click();

        //Fill out the title and date/time fields
        cy.get('[data-testid="eventTitleInput"').type('Test Event');
        cy.get('[data-testid="startDateInput"').click();
        cy.get('[class="MuiPickersCalendar-week"]').eq(4).get('[role="presentation"').eq(50).click();
        cy.get('[data-testid="endDateInput"').click();
        cy.get('[class="MuiPickersCalendar-week"]').eq(4).get('[role="presentation"').eq(52).click();
        cy.get('[data-testid="endTimeInput"]').click();
        cy.get('[class="MuiPickersClock-squareMask"]').click(0,223);

        //Click the submit button to add the event
        cy.contains('Submit').click({force: true});

        cy.wait(2000);
        expect(cy.contains('Test Event')).to.exist;
    });

    it('Events can be edited', () => {
        //Refresh the page first to make sure the data went to the DB
        cy.reload();
        cy.contains('Test Event').click();
        cy.get('[aria-label="edit"]').click();
        cy.get('[data-testid="titleInput"').clear().type('My Cool Event');
        cy.get('[data-testid="startDateInput"').click();
        cy.get('[class="MuiPickersCalendar-week"]').eq(4).get('[role="presentation"').eq(51).click();
        cy.get('[data-testid="startZipInput"]').type(49301);
        cy.get('[data-testid="endZipInput"]').type(49546);

        //Click the submit button to edit the event
        cy.contains('Submit').click({force: true});

        cy.wait(2000);
        expect(cy.contains('My Cool Event')).to.exist;
    });

    it('Google Maps and weather data appear correctly', () => {
        //Refresh the page first to make sure the data went to the DB
        cy.reload();
        cy.wait(4000);

        cy.contains('My Cool Event').click({force: true});
        
        //Validate that the google and weather divs appear, they only appear
        //if data and api requests were succesfull
        expect(cy.get('[id="gMap"]')).to.exist;
        expect(cy.get('[id="weather"]')).to.exist;

        cy.wait(10000);
        //Test the close button
        cy.get('[aria-label="close"]').click();
    });

    it('Events can be deleted', () => {
        //Refresh the page first to make sure the data went to the DB
        cy.reload();
        cy.wait(2000);
        cy.contains('My Cool Event').click({force: true});

        cy.wait(2000);
        //Click the delete button to delete the event
        cy.get('[aria-label="delete"]').click();
        expect(cy.contains('My Cool Event has been deleted!')).to.exist;
    });
});