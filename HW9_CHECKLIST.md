# HW9 Completion Checklist

## ✅ Completed Items

### 1. GitHub Secrets Configuration
- [ ] **VERCEL_TOKEN** - Added to GitHub secrets
- [ ] **VERCEL_ORG_ID** - Added to GitHub secrets  
- [ ] **VERCEL_PROJECT_ID** - Added to GitHub secrets

**How to verify:**
- Go to: `https://github.com/YOUR_USERNAME/faleproxy/settings/secrets/actions`
- Confirm all 3 secrets are listed

---

### 2. Fix Code to Pass Tests
- [x] **Unit tests fixed** - Case-insensitive replacement logic
- [x] **Integration tests fixed** - Refactored to use supertest
- [x] **All tests passing** - 9/9 tests pass with 100% coverage

**How to verify:**
```bash
npm run test:ci
```
Should show: "Tests: 9 passed, 9 total"

---

### 3. CI/CD Workflow Configuration
- [x] **Workflow file created** - `.github/workflows/ci.yml`
- [x] **Production deployment** - Only on main/master when tests pass
- [x] **Preview deployments** - On feature branches and PRs
- [x] **Test protection** - Blocks deployment when tests fail
- [x] **Environment variables** - VERCEL_ORG_ID and VERCEL_PROJECT_ID configured

**How to verify:**
- Check `.github/workflows/ci.yml` exists
- Verify `deploy` job has `needs: test` and `success()` check
- Verify `deploy-preview` and `deploy-preview-branch` jobs exist

---

### 4. GitHub Actions Enabled
- [ ] **Actions enabled** - Workflows can run

**How to verify:**
- Go to: `https://github.com/YOUR_USERNAME/faleproxy/actions`
- Should see workflow runs (not "Workflows disabled")

---

### 5. Vercel Auto-Deploy Disabled
- [x] **vercel.json updated** - Git deployment disabled
- [ ] **Vercel dashboard configured** - Auto-deploy disabled OR GitHub integration disconnected

**How to verify:**
- Push with failing test → Vercel should NOT deploy
- Only GitHub Actions should control deployments

---

### 6. Feature Branch with Changes
- [x] **Minor change made** - Updated index.html with "(confirming preview wooohoooooo)"
- [ ] **Branch created** - Feature branch pushed to GitHub
- [ ] **Tests pass on branch** - GitHub Actions shows green checkmarks
- [ ] **Preview deployment created** - Vercel shows preview URL

**Current status:** You have changes ready, need to commit and push

---

### 7. Confirm Branch Preview Deployment
- [ ] **Push to feature branch**
- [ ] **Tests pass in GitHub Actions**
- [ ] **Preview URL generated** - Check GitHub Actions logs or Vercel dashboard
- [ ] **Preview shows changes** - Visit preview URL to see "(confirming preview wooohoooooo)"

---

### 8. Merge to Main
- [ ] **Feature branch merged to main** (optional: rebase first)
- [ ] **Tests pass on main**
- [ ] **Production deployment triggered**
- [ ] **Production URL updated** - Should NOT show "(confirming preview wooohoooooo)"

---

### 9. Repository Sharing
- [ ] **Share with ssayer-lgtm** - Added as collaborator
- [ ] **Share with kingshukkundu** - Added as collaborator

**How to do this:**
1. Go to: `https://github.com/YOUR_USERNAME/faleproxy/settings/access`
2. Click "Add people"
3. Add both usernames with "Read" access

---

### 10. Submission Template
- [ ] **Git repo name** - Added to submission
- [ ] **Vercel production URL** - Added to submission
- [ ] **Vercel preview URL** - Added to submission
- [ ] **GitHub commit link** (from HW8) - Full commit URL format

---

## 📋 What You Still Need To Do

### Immediate Actions:

1. **Verify GitHub Secrets Are Set**
   ```
   Go to: https://github.com/YOUR_USERNAME/faleproxy/settings/secrets/actions
   Confirm: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
   ```

2. **Enable GitHub Actions** (if disabled)
   ```
   Go to: https://github.com/YOUR_USERNAME/faleproxy/actions
   Click "Enable workflows" if needed
   ```

3. **Disable Vercel Auto-Deploy**
   ```
   Option A: Vercel Dashboard → Settings → Git → Ignored Build Step: "exit 0"
   Option B: Vercel Dashboard → Settings → Git → Disconnect GitHub integration
   ```

4. **Commit and Push Your Feature Branch**
   ```bash
   git checkout -b hw9-preview-test
   git add .
   git commit -m "feat: test preview deployment"
   git push origin hw9-preview-test
   ```

5. **Verify Preview Deployment**
   - Go to GitHub Actions
   - Wait for tests to pass
   - Check `deploy-preview-branch` job for preview URL
   - Visit preview URL to confirm changes

6. **Create Pull Request** (Optional but recommended)
   - Create PR from feature branch to main
   - Verify tests pass
   - Check for bot comment with preview URL

7. **Merge to Main**
   ```bash
   git checkout main
   git merge hw9-preview-test
   # OR rebase first:
   # git checkout hw9-preview-test
   # git rebase main
   # git checkout main
   # git merge hw9-preview-test
   git push origin main
   ```

8. **Verify Production Deployment**
   - Go to GitHub Actions
   - Wait for tests to pass
   - Check `deploy` job succeeds
   - Visit production URL
   - Confirm it shows "Faleproxy" (without the preview text)

9. **Share Repository**
   ```
   Go to: https://github.com/YOUR_USERNAME/faleproxy/settings/access
   Add: ssayer-lgtm (Read access)
   Add: kingshukkundu (Read access)
   ```

10. **Fill Out Submission Template**
    - Git repo: `https://github.com/YOUR_USERNAME/faleproxy`
    - Production URL: `https://faleproxy.vercel.app` (or your custom domain)
    - Preview URL: (get from GitHub Actions logs)
    - HW8 commit link: (if applicable, full commit URL)

---

## 🧪 Testing Checklist

### Test 1: Preview Deployment Works
```bash
# On feature branch
git checkout -b test-preview
echo "test" >> README.md
git add README.md
git commit -m "test: preview"
git push origin test-preview
```
**Expected:** Tests pass → Preview deploys → URL in Actions logs

### Test 2: Failed Tests Block Deployment
```bash
# Uncomment failing test
# In tests/deployment-protection.test.js, uncomment lines 22-24
git add tests/deployment-protection.test.js
git commit -m "test: verify protection"
git push origin test-preview
```
**Expected:** Tests fail → No preview deployment

### Test 3: Production Deployment Works
```bash
# Fix tests, merge to main
# Comment out failing test again
git add tests/deployment-protection.test.js
git commit -m "fix: tests passing"
git checkout main
git merge test-preview
git push origin main
```
**Expected:** Tests pass → Production deploys

---

## 📝 Submission Template Example

```
Git Repository: https://github.com/YOUR_USERNAME/faleproxy

Vercel Production URL: https://faleproxy.vercel.app

Vercel Preview URL: https://faleproxy-git-hw9-preview-test-YOUR_USERNAME.vercel.app

HW8 Commit Link (if applicable): https://github.com/YOUR_USERNAME/faleproxy/commit/COMMIT_HASH

Notes:
- All tests passing (9/9)
- CI/CD configured to block failed deployments
- Preview deployments working on feature branches
- Production deployments working on main branch
```

---

## ⚠️ Important Notes

### About the Preview Text
Your current change adds "(confirming preview wooohoooooo)" to the brand name. 

**Before merging to main, you should:**
1. Test on preview branch (keep the text)
2. Get your preview URL for submission
3. **Remove the preview text before merging to main**
4. Production should show clean "Faleproxy" without test text

### Commit Link Format (from HW8)
If you need to reference a failing test commit from HW8:
- ✅ Correct: `https://github.com/USERNAME/faleproxy/commit/7e8db6561b5b94a7573314f8bb03bb93e8eafe89`
- ❌ Wrong: `https://github.com/USERNAME/faleproxy`
- ❌ Wrong: `https://github.com/USERNAME/faleproxy/hw8`

---

## 🎯 Quick Verification Commands

```bash
# Check if tests pass
npm run test:ci

# Check current branch
git branch

# Check remote branches
git branch -r

# Check GitHub Actions status (in browser)
# https://github.com/YOUR_USERNAME/faleproxy/actions

# Check Vercel deployments (in browser)
# https://vercel.com/YOUR_USERNAME/faleproxy
```

---

## ✅ Final Checklist Before Submission

- [ ] All 3 GitHub secrets configured
- [ ] GitHub Actions enabled
- [ ] Vercel auto-deploy disabled
- [ ] Tests passing locally (`npm run test:ci`)
- [ ] Feature branch pushed with changes
- [ ] Preview deployment successful (URL obtained)
- [ ] Merged to main (without preview text)
- [ ] Production deployment successful
- [ ] Repository shared with both users
- [ ] Submission template filled out with all URLs
- [ ] All links tested and working

---

## 🆘 If Something's Not Working

### Tests Failing?
- Run `npm run test:ci` locally
- Check error messages
- Verify all test files are correct

### Deployment Not Triggering?
- Verify GitHub secrets are set
- Check GitHub Actions is enabled
- Review workflow file syntax
- Check Actions logs for errors

### Preview Not Showing Changes?
- Hard refresh browser (Cmd+Shift+R)
- Check correct preview URL
- Verify deployment completed in Actions

### Production Deploying When Tests Fail?
- Verify Vercel auto-deploy is disabled
- Check workflow has `needs: test` and `success()`
- Review Actions logs

---

**You're almost done! Just need to push your changes and verify the deployments work.** 🚀
