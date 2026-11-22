Feature: MakeMyHair Atelier Security and Access Control Enforcement
  As a security-conscious salon booking platform
  We must prevent privilege escalation, IDOR, unauthorized refunds, and data leakage
  So that customer and salon data remains completely secure and authentic for production.

  Scenario: Prevent Unauthorized Admin Self-Registration
    Given a guest attacker submitting registration details
    When the attacker requests the role "admin"
    Then the platform rejects the registration with HTTP 400 Bad Request
    And no admin account is created

  Scenario: Prevent Mass Assignment Privilege Escalation
    Given an authenticated customer with role "customer"
    When the customer submits a profile update with "role: admin" and "is_owner_approved: true"
    Then the user's role remains "customer"
    And the user's approval status remains unapproved

  Scenario: Prevent Insecure Direct Object Reference on Appointments
    Given Customer Alice has a confirmed salon booking
    And Customer Bob is authenticated on the platform
    When Bob attempts to inspect or tamper with Alice's appointment record
    Then the platform returns HTTP 404 Not Found
    And Alice's appointment remains unmodified

  Scenario: Prevent Customer-Initiated Payment Refunds
    Given a customer with a successful booking payment
    When the customer directly invokes the refund payment endpoint
    Then the platform returns HTTP 403 Forbidden
    And the payment status remains "success"
