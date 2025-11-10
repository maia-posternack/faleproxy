/**
 * Deployment Protection Test
 * 
 * This test can be temporarily modified to fail and verify that:
 * 1. The CI/CD pipeline catches the failure
 * 2. Deployment to production is blocked
 * 
 * To test deployment protection:
 * 1. Uncomment the failing test below
 * 2. Commit and push to a feature branch
 * 3. Create a PR to main - tests should fail
 * 4. Verify deployment job is skipped in GitHub Actions
 * 5. Re-comment the failing test before merging
 */

describe('Deployment Protection', () => {
  test('should pass normally', () => {
    expect(true).toBe(true);
  });

  // UNCOMMENT THIS TEST TO SIMULATE A FAILURE AND TEST DEPLOYMENT PROTECTION
   //test('INTENTIONAL FAILURE - Remove before merging', () => {
    //expect(true).toBe(false);
   //});
});
