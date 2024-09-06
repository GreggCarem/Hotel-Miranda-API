describe("Login Component", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Should log in successfully with correct credentials", () => {
    cy.get('[data-cy="username"]').type("johndoe");
    cy.get('[data-cy="password"]').type("password123");
    cy.get('[data-cy="submit"]').click();
    cy.url().should("include", "/dashboard");
  });

  it("Should show an error with incorrect credentials", () => {
    cy.get('[data-cy="username"]').type("wronguser");
    cy.get('[data-cy="password"]').type("wrongpassword");
    cy.get('[data-cy="submit"]').click();
    cy.contains("Invalid username or password").should("be.visible");
  });

  const protectedRoutes = [
    "/bookings",
    "/users",
    "/rooms",
    "/contact",
    "/dashboard",
  ];

  protectedRoutes.forEach((route) => {
    it(`should redirect from ${route} to / if not authenticated`, () => {
      cy.visit(route, { failOnStatusCode: false });
      cy.url().should("include", "/");
    });
  });
});
