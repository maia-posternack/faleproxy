# 🚀 Deployment Setup Checklist

Your CI/CD workflow is **already configured** to block production deployments when tests fail!

## Quick Start: 3 Steps to Enable

### 1️⃣ Enable GitHub Actions

Go to: `https://github.com/YOUR_USERNAME/faleproxy/actions`

- If you see "Workflows disabled", click **"Enable workflows"**
- Or go to **Settings** → **Actions** → **General** → Enable all actions

### 2️⃣ Add Vercel Token Secret

1. Get token: https://vercel.com/account/tokens (create new token)
2. Add to GitHub: **Settings** → **Secrets and variables** → **Actions**
3. Create secret:
   - Name: `VERCEL_TOKEN`
   - Value: (paste your Vercel token)

### 3️⃣ Disable Vercel Auto-Deploy ⚠️ CRITICAL

**Why:** Vercel deploys automatically on every push, ignoring your tests!

Go to Vercel Dashboard → Your Project → **Settings** → **Git**

#### Option A: Add Ignored Build Step (Easiest)

Scroll to **"Ignored Build Step"** and enter:
```bash
exit 0
```

This tells Vercel to skip all automatic builds.

#### Option B: Disconnect GitHub Integration (Most Reliable)

1. In **Settings** → **Git**
2. Click **"Disconnect"** under GitHub Integration
3. Confirm disconnection

**After this:** Only GitHub Actions can deploy (using `VERCEL_TOKEN`)

📖 **Detailed guide:** See `docs/DISABLE_VERCEL_AUTO_DEPLOY.md`

---

## ✅ Your Workflow Protection

Your `.github/workflows/ci.yml` already has:

```yaml
deploy:
  needs: test              # Waits for tests
  if: |
    success() &&           # Only if tests pass
    (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master')
                           # Only on main/master
```

### What This Means:

- ✅ Tests run on Node.js 18.x **AND** 20.x
- ✅ **ALL** tests must pass on **ALL** versions
- ✅ If **any** test fails → deployment **SKIPPED**
- ✅ Only main/master branch → production deployment
- ✅ Pull requests → tests run, no deployment

---

## 🧪 Test the Protection

### Option 1: Test on Feature Branch (Safe)

```bash
git checkout -b test-protection
# Uncomment failing test in tests/deployment-protection.test.js
git add tests/deployment-protection.test.js
git commit -m "test: verify deployment protection"
git push origin test-protection
# Create PR and watch Actions tab - deploy should be SKIPPED
```

### Option 2: Check GitHub Actions

1. Go to: `https://github.com/YOUR_USERNAME/faleproxy/actions`
2. Push any commit to main
3. Watch the workflow:
   - ✓ test (18.x)
   - ✓ test (20.x)
   - ✓ deploy (only runs if both tests pass)

---

## 📚 Detailed Documentation

- **Full Setup Guide**: `docs/ENABLE_GITHUB_ACTIONS.md`
- **Testing Guide**: `docs/TESTING_CI.md`
- **Test File**: `tests/deployment-protection.test.js`

---

## 🎯 Current Status

- ✅ Workflow file configured
- ✅ Test protection enabled
- ✅ Coverage reports uploaded
- ✅ Preview deployments enabled
- ⏳ **TODO**: Enable GitHub Actions
- ⏳ **TODO**: Add VERCEL_TOKEN secret
- ⏳ **TODO**: Disable Vercel auto-deploy

## 🚀 New: Preview Deployments

Your workflow now supports automatic preview deployments:

- **Feature branches** → Get preview URL in Actions logs
- **Pull requests** → Get preview URL + automatic comment on PR
- **Main branch** → Production deployment

📖 **Full guide:** See `docs/PREVIEW_DEPLOYMENTS.md`

Once you complete the 3 steps above, your deployment protection will be fully active! 🛡️
