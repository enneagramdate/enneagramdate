"use strict";
describe('App', () => {
    it('successfully loads', () => {
        cy.wait(3000);
        cy.visit('http://localhost:9999');
    });
});
