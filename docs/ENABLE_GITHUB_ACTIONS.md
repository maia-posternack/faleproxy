# Enable GitHub Actions and Verify CI/CD Protection

## Step 1: Enable GitHub Actions

If this is a forked repository, GitHub Actions are disabled by default for security reasons.

### Enable Actions:

1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/faleproxy`
2. Click on the **Actions** tab
3. If you see a message about workflows being disabled, click **"I understand my workflows, go ahead and enable them"**
4. Alternatively, go to **Settings** → **Actions** → **General**
5. Under "Actions permissions", select:
   - ✅ **Allow all actions and reusable workflows**
6. Click **Save**

## Step 2: Add Required Secrets

Your workflow needs the Vercel token to deploy:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add:
   - **Name:** `VERCEL_TOKEN`
   - **Value:** Your Vercel token (get it from https://vercel.com/account/tokens)
4. Click **Add secret**

### How to Get Your Vercel Token:

1. Go to https://vercel.com/account/tokens
2. Click **Create Token**
3. Give it a name (e.g., "GitHub Actions")
4. Set scope to your project
5. Copy the token (you won't see it again!)
6. Add it to GitHub secrets as shown above

## Step 3: Verify Workflow Protection

Your workflow is already configured with triple protection:

### ✅ Protection Mechanisms in Place:

```yaml
deploy:
  needs: test                    # ← Waits for test job to complete
  if: |
    success() &&                 # ← Only runs if tests succeed
    (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master')
                                 # ← Only runs on main/master branch
```

### What This Means:

- ✅ Tests run on Node.js 18.x AND 20.x
- ✅ If ANY test fails on ANY version → deployment is SKIPPED
- ✅ If ALL tests pass on ALL versions → deployment proceeds to production
- ✅ Pull requests run tests but NEVER deploy to production
- ✅ Only main/master branch pushes can trigger production deployment

## Step 4: Test the Protection

Now that you have the failing test uncommented in `tests/deployment-protection.test.js`:

### Option A: Test on a Feature Branch (Recommended)

```bash
# 1. Create a feature branch
git checkout -b test-ci-protection

# 2. Commit the failing test
git add tests/deployment-protection.test.js
git commit -m "test: verify CI blocks deployment on failure"

# 3. Push to GitHub
git push origin test-ci-protection

# 4. Create a Pull Request to main

# 5. Watch GitHub Actions:
# - Go to https://github.com/YOUR_USERNAME/faleproxy/actions
# - You should see:
#   ✗ test (18.x) - FAILED
#   ✗ test (20.x) - FAILED  
#   ⊘ deploy - SKIPPED (not run at all)
```

### Option B: Test on Main Branch (Use with Caution)

```bash
# 1. Commit the failing test
git add tests/deployment-protection.test.js
git commit -m "test: verify CI blocks deployment on failure"

# 2. Push to main
git push origin main

# 3. Watch GitHub Actions:
# - Tests will FAIL
# - Deploy will be SKIPPED
# - Production will NOT be updated

# 4. Fix it immediately:
# - Comment out the failing test
# - Commit and push again
# - Tests will PASS
# - Deploy will RUN
```

## Step 5: Disable Vercel Auto-Deployments

**IMPORTANT:** Vercel deploys automatically by default, bypassing your CI checks!

### Configure Vercel to Respect CI:

1. Go to Vercel Dashboard → Your Project
2. Navigate to **Settings** → **Git**
3. Find **"Ignored Build Step"** section
4. Add this command:
   ```bash
   if [ "$VERCEL_GIT_COMMIT_REF" != "main" ] && [ "$VERCEL_GIT_COMMIT_REF" != "master" ]; then exit 0; else exit 1; fi
   ```
5. This tells Vercel to ignore auto-deployments and let GitHub Actions handle it

### Alternative: Use vercel.json

Your `vercel.json` already has:
```json
{
  "github": {
    "silent": true,
    "autoJobCancelation": true
  }
}
```

This helps, but you may still need to configure the ignored build step in Vercel's dashboard.

## Step 6: Verify Everything Works

### Checklist:

- [ ] GitHub Actions are enabled on your repository
- [ ] `VERCEL_TOKEN` secret is added to GitHub
- [ ] Workflow file exists at `.github/workflows/ci.yml`
- [ ] Tests are currently failing (intentional test uncommented)
- [ ] Push to a branch and verify:
  - [ ] Tests run automatically
  - [ ] Tests fail as expected
  - [ ] Deploy job is skipped
  - [ ] Production URL is NOT updated
- [ ] Comment out the failing test
- [ ] Push again and verify:
  - [ ] Tests pass
  - [ ] Deploy job runs (on main/master only)
  - [ ] Production URL is updated

## Expected Workflow Behavior

### ✅ Successful Deployment (main branch, tests pass):
```
Push to main
  ↓
Run tests (18.x) → ✓ Pass
Run tests (20.x) → ✓ Pass
  ↓
Deploy to Vercel Production → ✓ Success
  ↓
Production URL updated
```

### ❌ Blocked Deployment (main branch, tests fail):
```
Push to main
  ↓
Run tests (18.x) → ✗ Fail
Run tests (20.x) → ✗ Fail
  ↓
Deploy to Vercel Production → ⊘ Skipped
  ↓
Production URL unchanged (safe!)
```

### ✅ PR Testing (feature branch, tests pass):
```
Push to feature branch
  ↓
Run tests (18.x) → ✓ Pass
Run tests (20.x) → ✓ Pass
  ↓
Deploy to Vercel Production → ⊘ Skipped (not main branch)
  ↓
Production URL unchanged
```

## Troubleshooting

### Actions Not Running?
- Check if Actions are enabled: Settings → Actions → General
- Verify workflow file is in `.github/workflows/` directory
- Check workflow syntax with GitHub's workflow validator

### Deploy Job Running When Tests Fail?
- Verify the `needs: test` line exists
- Check the `if: success()` condition is present
- Review GitHub Actions logs for the exact failure point

### Vercel Still Auto-Deploying?
- Configure "Ignored Build Step" in Vercel dashboard
- Or disconnect Vercel's GitHub integration and only use GitHub Actions

### Missing VERCEL_TOKEN?
- Create token at https://vercel.com/account/tokens
- Add to GitHub: Settings → Secrets → Actions → New secret
- Name must be exactly `VERCEL_TOKEN`

## Next Steps

1. **Enable GitHub Actions** (if disabled)
2. **Add VERCEL_TOKEN secret**
3. **Test with the failing test** (already uncommented)
4. **Verify deployment is blocked**
5. **Fix the test and verify deployment works**
6. **Configure Vercel to stop auto-deploying**

Your CI/CD pipeline is properly configured! 🎉
