describe('ui: DashboardLayout component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=dashboardlayout--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to ui!');
    });
});
