describe('App', () => {
  it('successfully loads', () => {
    cy.wait(3000);
    cy.visit('http://localhost:9999');
  });

  it('signs up 2 new users to DB', () => {
    cy.viewport(1000, 1000);
    cy.visit('http://localhost:9999/signup');
    // FIRST USER
    cy.get('.form-control').within(() => {
      cy.get('input[name=email]').type('test1@gmail.com');
      cy.get('input[name=password]').type('test');
      cy.get('input[name=name]').type('test');
      cy.get('select[name=enneagramType]').select('2');
      cy.get('input[name=birthday]').type('2000-10-10');
      cy.get('input[name=address]').type('24 Sussex Drive Ottawa ON');
      cy.get('select[name=gender]').select('Male');
      cy.get('select[name=seeking-gender]').select('Female');
      cy.get('select[name=relationship-type]').select('Serious');
      cy.get('input[name=radius]').type('2000');
      cy.get('input[name=age-range-low]').type('18');
      cy.get('input[name=age-range-high]').type('118');
      // 10 sec delay to manually upload image file
      // cy.get('span[aria-label=add]').click().wait(10000);
      // cy.get('input[type="file"]').as('fileInput');
      // cy.fixture('test.png').then((fileContent) => {
      //   cy.get('@fileInput').attachFile({
      //     fileContent: fileContent.toString(),
      //     fileName: 'test.png',
      //     mimeType: 'image/png',
      //   });
      // });
      // @ts-ignore
      cy.upload_file('test.png', 'image/png', 'input[type="file"]');
      // cy.contains('test.png');

      cy.get('button').click();
    });
    cy.url().should('eq', 'http://localhost:9999/recs');
    // SECOND USER THAT WILL MATCH WITH FIRST USER
    cy.visit('http://localhost:9999/signup');
    cy.get('.form-control').within(() => {
      cy.get('input[name=email]').type('test2@gmail.com');
      cy.get('input[name=password]').type('test');
      cy.get('input[name=name]').type('test');
      cy.get('select[name=enneagramType]').select('8');
      cy.get('input[name=birthday]').type('2000-10-10');
      cy.get('input[name=address]').type('24 Sussex Drive Ottawa ON');
      cy.get('select[name=gender]').select('Female');
      cy.get('select[name=seeking-gender]').select('Male');
      cy.get('select[name=relationship-type]').select('Serious');
      cy.get('input[name=radius]').type('2000');
      cy.get('input[name=age-range-low]').type('18');
      cy.get('input[name=age-range-high]').type('118');
      // 10 sec delay to manually upload image file
      cy.get('span[aria-label=add]').click().wait(10000);
      cy.get('button').click();
    });
    cy.url().should('eq', 'http://localhost:9999/recs');
  });

  it('successfully logs in first user, who likes the second user', () => {
    cy.visit('http://localhost:9999/login');
    cy.get('input[name=email]').type('test1@gmail.com');
    cy.get('input[name=password]').type('test');
    cy.get('button').click();
    cy.url().should('eq', 'http://localhost:9999/recs');
    // likes second user
    cy.get('.btn-success').click();
  });

  it('successfully logs in second user, who likes the first user and receives a match alert', () => {
    cy.visit('http://localhost:9999/login');
    cy.get('input[name=email]').type('test2@gmail.com');
    cy.get('input[name=password]').type('test');
    cy.get('button').click();
    cy.url().should('eq', 'http://localhost:9999/recs');
    // likes first user
    cy.get('.btn-success').click();
    // receives match alert
    cy.on('window:alert', (str) => {
      expect(str).to.equal(`You just matched with test!`);
    });
  });

  it('second user logs in, confirms the match, and starts a chat with matched (first) user', () => {
    cy.visit('http://localhost:9999/login');
    cy.get('input[name=email]').type('test2@gmail.com');
    cy.get('input[name=password]').type('test');
    cy.get('button').click();
    cy.url().should('eq', 'http://localhost:9999/recs');
    cy.get('button').filter(':contains("Matches")').click();
    cy.url().should('eq', 'http://localhost:9999/matches');
    cy.get('button').filter(':contains("Chat")').click();
    cy.get('input').type('test message');
    cy.get('button').filter(':contains("Send")').click();
    cy.get('.chat-bubble').then((bubble) => {
      expect(bubble).to.have.text('test message');
    });
  });

  // Chats are not yet persisted anywhere (in cache or DB), so not able to test as users would use the chat rooms.
});
