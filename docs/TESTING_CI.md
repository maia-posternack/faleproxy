# Testing CI/CD Pipeline

## Important: Disable Vercel Auto-Deployments

By default, Vercel deploys ALL branches automatically, bypassing your CI checks. To ensure tests must pass before deployment:

### Step 1: Disable Vercel's Automatic Deployments

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Git**
3. Under **Production Branch**, keep it as `main` or `master`
4. Under **Deploy Hooks**, disable:
   - ❌ **Automatically deploy all branches** (or set to "Preview" only)
5. **Enable**: ✅ **Wait for CI checks to pass before deploying**
6. Save changes

### Step 2: Verify GitHub Actions is the Only Deployment Method

After disabling auto-deployments:
- Vercel will NOT deploy automatically on push
- Only your GitHub Actions workflow will trigger deployments
- Tests MUST pass before deployment happens

---

## Method 1: Test with Intentional Failure

1. **Create a feature branch:**
   ```bash
   git checkout -b test-ci-protection
   ```

2. **Uncomment the failing test in `tests/deployment-protection.test.js`:**
   ```javascript
   test('INTENTIONAL FAILURE - Remove before merging', () => {
     expect(true).toBe(false);
   });
   ```

3. **Commit and push:**
   ```bash
   git add tests/deployment-protection.test.js
   git commit -m "test: verify CI blocks deployment on test failure"
   git push origin test-ci-protection
   ```

4. **Create a Pull Request to main**

5. **Verify in GitHub Actions:**
   - ✅ Test job should FAIL
   - ✅ Deploy job should be SKIPPED (not run at all)

6. **Clean up:**
   - Re-comment the failing test
   - Push again to see tests pass
   - Merge the PR

## Method 2: Test Locally with Act

Install act (GitHub Actions local runner):

```bash
# macOS
brew install act

# Or with curl
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

Run the workflow locally:

```bash
# Test the entire workflow
act push

# Test only the test job
act -j test

# Test with a specific event
act push -e .github/workflows/test-event.json
```

**Note:** Act has limitations and may not perfectly replicate GitHub's environment, especially for Vercel deployments.

## Method 3: Branch Protection Rules

Set up branch protection in GitHub to enforce CI checks:

1. Go to your repo → Settings → Branches
2. Add rule for `main` branch
3. Enable "Require status checks to pass before merging"
4. Select your CI workflow as required
5. Enable "Require branches to be up to date before merging"

This ensures no one can merge code that fails tests.

## What to Verify

When testing deployment protection, confirm:

- [ ] Tests run on both Node.js 18.x and 20.x
- [ ] If ANY test fails on ANY version, deploy job is skipped
- [ ] Deploy job only runs on main/master branch
- [ ] Deploy job shows "skipped" status when tests fail
- [ ] Vercel production URL is NOT updated when tests fail
- [ ] Coverage reports are uploaded even if deployment is skipped

## Expected GitHub Actions Flow

### ✅ When Tests Pass (main branch):
```
test (18.x) → ✓ Success
test (20.x) → ✓ Success
deploy      → ✓ Success (runs and deploys)
```

### ❌ When Tests Fail (main branch):
```
test (18.x) → ✗ Failed
test (20.x) → ✓ Success
deploy      → ⊘ Skipped (doesn't run)
```

### ✅ When Tests Pass (PR):
```
test (18.x) → ✓ Success
test (20.x) → ✓ Success
deploy      → ⊘ Skipped (not main branch)
```
