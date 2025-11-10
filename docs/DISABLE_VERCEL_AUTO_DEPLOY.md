# Disable Vercel's Automatic Deployments

## The Problem

Vercel has **two separate deployment systems**:

1. **Vercel's Built-in CI/CD** - Automatically deploys on every push (ignores your tests)
2. **Your GitHub Actions Workflow** - Only deploys when tests pass

Right now, BOTH are running, which is why your code deploys even when tests fail!

## The Solution

You need to **disable Vercel's automatic deployments** so only GitHub Actions controls deployments.

---

## Method 1: Disable in Vercel Dashboard (Recommended)

### Step 1: Go to Vercel Project Settings

1. Log in to https://vercel.com
2. Select your `faleproxy` project
3. Go to **Settings** → **Git**

### Step 2: Configure Ignored Build Step

Scroll down to **"Ignored Build Step"** section and add this command:

```bash
git diff HEAD^ HEAD --quiet .
```

Or use this more explicit version:

```bash
exit 0
```

**What this does:** 
- Returns exit code 0 (success) immediately
- Tells Vercel to skip the build entirely
- Vercel won't deploy anything automatically
- Only GitHub Actions will deploy

### Step 3: Save Changes

Click **Save** and verify the setting is applied.

---

## Method 2: Use vercel.json (Alternative)

Add an `ignoreCommand` to your `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/app.js"
    }
  ],
  "git": {
    "deploymentEnabled": false
  },
  "github": {
    "enabled": false,
    "silent": true,
    "autoJobCancelation": true
  }
}
```

**Note:** The `git.deploymentEnabled` option may not be available in all Vercel plans.

---

## Method 3: Disconnect Vercel's GitHub Integration

### Complete Disconnect (Most Reliable)

1. Go to Vercel Dashboard → Your Project
2. Go to **Settings** → **Git**
3. Click **"Disconnect"** under GitHub Integration
4. Confirm disconnection

**What this does:**
- Completely removes Vercel's automatic deployment
- Only GitHub Actions can deploy (using `VERCEL_TOKEN`)
- You have full control over when deployments happen

**Pros:**
- ✅ Guaranteed to stop auto-deployments
- ✅ Complete control via GitHub Actions
- ✅ Tests MUST pass before deployment

**Cons:**
- ❌ No automatic preview deployments for PRs
- ❌ Must manage all deployments via GitHub Actions

---

## Verify It's Working

### Test 1: Push with Failing Tests

1. Keep the failing test uncommented in `tests/deployment-protection.test.js`
2. Commit and push to main:
   ```bash
   git add tests/deployment-protection.test.js
   git commit -m "test: verify Vercel doesn't auto-deploy"
   git push origin main
   ```
3. Check Vercel Dashboard:
   - ✅ Should see NO new deployment
   - ✅ Production URL should NOT change
4. Check GitHub Actions:
   - ❌ Tests should FAIL
   - ⊘ Deploy job should be SKIPPED

### Test 2: Push with Passing Tests

1. Comment out the failing test
2. Commit and push:
   ```bash
   git add tests/deployment-protection.test.js
   git commit -m "fix: tests passing"
   git push origin main
   ```
3. Check GitHub Actions:
   - ✅ Tests should PASS
   - ✅ Deploy job should RUN
4. Check Vercel Dashboard:
   - ✅ Should see NEW deployment (from GitHub Actions)
   - ✅ Production URL should update

---

## Understanding the Two Systems

### Vercel's Built-in CI/CD (What You Need to Disable)

```
Push to GitHub
    ↓
Vercel detects push
    ↓
Vercel builds & deploys
    ↓
❌ IGNORES YOUR TESTS ❌
    ↓
Production updated (even if tests fail!)
```

### Your GitHub Actions Workflow (What You Want)

```
Push to GitHub
    ↓
GitHub Actions runs tests
    ↓
Tests pass? → Yes → Deploy to Vercel
              ↓
              No → Skip deployment
    ↓
Production only updated if tests pass ✅
```

---

## Recommended Setup

**Best Practice:** Use Method 3 (Disconnect) + GitHub Actions for everything

1. **Disconnect Vercel's GitHub integration**
2. **Use GitHub Actions for all deployments**
3. **Add preview deployments to GitHub Actions** (optional)

### Optional: Add Preview Deployments to GitHub Actions

If you want preview deployments for PRs, add this to `.github/workflows/ci.yml`:

```yaml
  deploy-preview:
    needs: test
    if: |
      success() &&
      github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18.x'
        
    - name: Install Vercel CLI
      run: npm install --global vercel@latest
      
    - name: Pull Vercel Environment Information
      run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      
    - name: Build Project Artifacts
      run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      
    - name: Deploy Project Artifacts to Vercel (Preview)
      run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
```

This gives you preview deployments for PRs, but only after tests pass!

---

## Summary

**Current Problem:**
- Vercel deploys automatically (ignores tests)
- GitHub Actions also deploys (respects tests)
- Result: Code deploys even when tests fail

**Solution:**
1. Disable Vercel's automatic deployments (Method 1, 2, or 3)
2. Keep GitHub Actions as the only deployment method
3. Now tests MUST pass before deployment

**After Fix:**
- ✅ Tests fail → No deployment
- ✅ Tests pass → Deployment happens
- ✅ Full control over production deployments
