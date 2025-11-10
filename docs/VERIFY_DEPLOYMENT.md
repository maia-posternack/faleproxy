# Verify Deployment Setup

## Required GitHub Secrets

Your workflow needs these 3 secrets to deploy to Vercel:

### 1. VERCEL_TOKEN
- **What:** Your Vercel API token
- **Get it:** https://vercel.com/account/tokens
- **How to add:**
  1. Go to your GitHub repo → Settings → Secrets and variables → Actions
  2. Click "New repository secret"
  3. Name: `VERCEL_TOKEN`
  4. Value: (paste your token)

### 2. VERCEL_ORG_ID
- **What:** Your Vercel organization/team ID
- **Where to find it:**
  - Option A: Check `.vercel/project.json` (if you ran `vercel link` locally)
  - Option B: Vercel Dashboard → Settings → General → look for "Team ID" or "Org ID"
- **How to add:**
  1. GitHub repo → Settings → Secrets and variables → Actions
  2. Click "New repository secret"
  3. Name: `VERCEL_ORG_ID`
  4. Value: (paste your org ID)

### 3. VERCEL_PROJECT_ID
- **What:** Your specific project ID
- **Where to find it:**
  - Option A: Check `.vercel/project.json` (if you ran `vercel link` locally)
  - Option B: Vercel Dashboard → Your Project → Settings → General → "Project ID"
- **How to add:**
  1. GitHub repo → Settings → Secrets and variables → Actions
  2. Click "New repository secret"
  3. Name: `VERCEL_PROJECT_ID`
  4. Value: (paste your project ID)

---

## How to Get IDs from .vercel/project.json

If you've run `vercel link` locally, you'll have a `.vercel/project.json` file:

```json
{
  "orgId": "team_xxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxx"
}
```

- `orgId` → Use for `VERCEL_ORG_ID`
- `projectId` → Use for `VERCEL_PROJECT_ID`

**Note:** The `.vercel` folder should be in your `.gitignore` (don't commit it!)

---

## How to Get IDs from Vercel Dashboard

### Get VERCEL_ORG_ID:
1. Go to https://vercel.com
2. Click on your profile/team name (top right)
3. Go to **Settings**
4. Look for "Team ID" or "Organization ID"
5. Copy the ID (looks like `team_xxxxxxxxxxxxx`)

### Get VERCEL_PROJECT_ID:
1. Go to your Vercel project
2. Click **Settings**
3. Go to **General** tab
4. Look for "Project ID"
5. Copy the ID (looks like `prj_xxxxxxxxxxxxx`)

---

## Verify Secrets Are Set

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. You should see 3 repository secrets:
   - ✅ `VERCEL_TOKEN`
   - ✅ `VERCEL_ORG_ID`
   - ✅ `VERCEL_PROJECT_ID`

---

## Test the Deployment

Now that everything is configured, let's test it!

### Step 1: Commit and Push

```bash
# Make sure the failing test is commented out
git add .
git commit -m "fix: configure Vercel deployment with org and project IDs"
git push origin main
```

### Step 2: Watch GitHub Actions

1. Go to: `https://github.com/YOUR_USERNAME/faleproxy/actions`
2. Click on the latest workflow run
3. You should see:
   - ✅ **test (18.x)** - Should pass
   - ✅ **test (20.x)** - Should pass
   - ✅ **deploy** - Should run and succeed

### Step 3: Check Vercel

1. Go to your Vercel dashboard
2. You should see a new deployment
3. The deployment should be marked as "Production"
4. Source should show "GitHub Actions" or similar

### Step 4: Verify Production URL

Visit your production URL - it should show the latest changes!

---

## Expected Workflow Output

### Successful Deployment:

```
test (18.x)
  ✓ Install dependencies
  ✓ Run tests
  ✓ Upload coverage report
  
test (20.x)
  ✓ Install dependencies
  ✓ Run tests
  ✓ Upload coverage report

deploy
  ✓ Setup Node.js
  ✓ Install Vercel CLI
  ✓ Pull Vercel Environment Information
  ✓ Build Project Artifacts
  ✓ Deploy Project Artifacts to Vercel
  
🎉 Deployment successful!
```

---

## Troubleshooting

### Error: "Project not found"
- **Cause:** `VERCEL_PROJECT_ID` is incorrect or missing
- **Fix:** Double-check the project ID in Vercel dashboard

### Error: "Unauthorized"
- **Cause:** `VERCEL_TOKEN` is invalid or expired
- **Fix:** Generate a new token and update the secret

### Error: "Team not found"
- **Cause:** `VERCEL_ORG_ID` is incorrect
- **Fix:** Verify the org/team ID in Vercel settings

### Deploy job is skipped
- **Cause:** Tests are failing OR not on main/master branch
- **Fix:** 
  - Check test results
  - Make sure you're pushing to main/master
  - Verify the `if` condition in the workflow

### Deploy job runs but fails at "Pull Vercel Environment Information"
- **Cause:** Missing or incorrect secrets
- **Fix:** Verify all 3 secrets are set correctly

---

## Test Deployment Protection

Once deployment is working, test that it blocks failed tests:

### Step 1: Uncomment the Failing Test

In `tests/deployment-protection.test.js`:
```javascript
test('INTENTIONAL FAILURE - Remove before merging', () => {
  expect(true).toBe(false);
});
```

### Step 2: Push to Main

```bash
git add tests/deployment-protection.test.js
git commit -m "test: verify deployment protection"
git push origin main
```

### Step 3: Verify Protection Works

Check GitHub Actions:
- ❌ Tests should FAIL
- ⊘ Deploy should be SKIPPED
- ✅ Vercel should NOT show a new deployment
- ✅ Production URL should be unchanged

### Step 4: Fix and Verify

Comment out the test again and push:
```bash
git add tests/deployment-protection.test.js
git commit -m "fix: tests passing again"
git push origin main
```

Check GitHub Actions:
- ✅ Tests should PASS
- ✅ Deploy should RUN
- ✅ Vercel should show a new deployment
- ✅ Production URL should update

---

## Summary

✅ **Setup Complete When:**
- All 3 secrets are configured in GitHub
- Workflow file has `env` section with org and project IDs
- Vercel auto-deploy is disabled
- Tests pass and deployment succeeds
- Failed tests block deployment

🎉 **Your CI/CD pipeline is now fully functional!**
