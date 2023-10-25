/// <reference types="cypress" />

import 'cypress-file-upload';
// @ts-ignore
Cypress.Commands.add('upload_file', (fileName, fileType = '', selector) => {
  cy.get(selector).then((subject) => {
    // @ts-ignore
    cy.fixture(fileName, 'base64').then((content) => {
      const el = subject[0];
      // @ts-ignore
      const testFile = new File([content], fileName, { type: fileType });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      el.files = dataTransfer.files;
    });
  });
});

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
