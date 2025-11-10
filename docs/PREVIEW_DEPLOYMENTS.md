# Preview Deployments

Your CI/CD workflow now supports **automatic preview deployments** for branches and pull requests!

## How It Works

### 🎯 Three Deployment Types

1. **Production Deployment** (main/master branch)
   - Runs when: Push to main or master
   - Deploys to: Production URL
   - Requires: All tests pass

2. **PR Preview Deployment** (pull requests)
   - Runs when: Pull request created/updated
   - Deploys to: Unique preview URL
   - Requires: All tests pass
   - Bonus: Automatically comments preview URL on PR

3. **Branch Preview Deployment** (feature branches)
   - Runs when: Push to any non-main branch
   - Deploys to: Unique preview URL
   - Requires: All tests pass

---

## Workflow Behavior

### When You Push to a Feature Branch:

```
Push to feature-branch
    ↓
Run tests (18.x & 20.x)
    ↓
Tests pass? → Yes → Deploy to preview URL
              ↓
              No → Skip deployment
```

**Result:** You get a preview URL in the GitHub Actions logs

### When You Create a Pull Request:

```
Create PR to main
    ↓
Run tests (18.x & 20.x)
    ↓
Tests pass? → Yes → Deploy to preview URL
              ↓     → Post comment on PR with URL
              No → Skip deployment
```

**Result:** Preview URL is automatically commented on your PR! 🎉

### When You Push to Main:

```
Push to main
    ↓
Run tests (18.x & 20.x)
    ↓
Tests pass? → Yes → Deploy to PRODUCTION
              ↓
              No → Skip deployment
```

**Result:** Production URL is updated

---

## Finding Your Preview URLs

### For Pull Requests:
1. Go to your PR on GitHub
2. Look for the bot comment: "🚀 Preview Deployment Ready!"
3. Click the preview URL

### For Feature Branches:
1. Go to GitHub Actions tab
2. Click on the workflow run
3. Open the "deploy-preview-branch" job
4. Look for "Preview URL: https://..." in the logs

### In Vercel Dashboard:
1. Go to your Vercel project
2. Click on "Deployments"
3. You'll see all preview deployments listed
4. Each has a unique URL

---

## Example Workflow

### Scenario: Adding a New Feature

```bash
# 1. Create a feature branch
git checkout -b add-new-feature

# 2. Make your changes
# Edit files...

# 3. Commit and push
git add .
git commit -m "feat: add new feature"
git push origin add-new-feature
```

**What happens:**
- ✅ Tests run automatically
- ✅ If tests pass → Preview deployment created
- ✅ Preview URL appears in Actions logs
- ✅ You can test your changes on the preview URL

```bash
# 4. Create a pull request
# Go to GitHub and create PR
```

**What happens:**
- ✅ Tests run again
- ✅ If tests pass → New preview deployment
- ✅ Bot comments preview URL on your PR
- ✅ Team can review changes on preview URL

```bash
# 5. Merge to main
# Click "Merge" on GitHub
```

**What happens:**
- ✅ Tests run on main
- ✅ If tests pass → Production deployment
- ✅ Changes go live on production URL

---

## Preview URL Format

Vercel preview URLs typically look like:

- **PR Preview:** `https://faleproxy-git-feature-branch-username.vercel.app`
- **Branch Preview:** `https://faleproxy-abc123.vercel.app`
- **Production:** `https://faleproxy.vercel.app` (or your custom domain)

Each preview deployment gets a unique URL that persists until you delete it.

---

## Benefits

### ✅ Safe Testing
- Test changes in production-like environment
- No risk to production site
- Each branch/PR gets isolated preview

### ✅ Easy Collaboration
- Share preview URLs with team
- Get feedback before merging
- QA can test on real URLs

### ✅ Automatic Cleanup
- Vercel automatically manages old previews
- No manual deployment management needed

### ✅ CI/CD Protection
- Previews only deploy if tests pass
- Same quality checks as production
- Consistent deployment process

---

## Customization

### Change Preview Comment Format

Edit `.github/workflows/ci.yml` line 114:

```yaml
body: `## 🚀 Preview Deployment Ready!\n\n✅ Tests passed\n🔗 Preview URL: ${url}\n\n*Deployed from commit ${{ github.sha }}*`
```

Customize the message to your liking!

### Disable PR Comments

Remove or comment out the "Comment Preview URL on PR" step (lines 104-115).

### Add More Environments

You can add staging, development, or other environments by creating additional jobs with different conditions.

---

## Troubleshooting

### Preview deployment not running?
- Check if tests passed (previews only deploy after tests pass)
- Verify you're on a non-main branch or PR
- Check GitHub Actions logs for errors

### Preview URL not appearing in PR comment?
- Verify the `actions/github-script@v7` action has permissions
- Check if the deployment step succeeded
- Look in Actions logs for the URL

### Preview shows old code?
- Vercel caches aggressively
- Try hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- Check if the deployment actually ran in Actions

### "Project not found" error?
- Verify `VERCEL_PROJECT_ID` is correct
- Check `VERCEL_ORG_ID` is set
- Ensure `VERCEL_TOKEN` has access to the project

---

## Testing Preview Deployments

### Test 1: Feature Branch Preview

```bash
git checkout -b test-preview
echo "Testing preview" >> README.md
git add README.md
git commit -m "test: preview deployment"
git push origin test-preview
```

Check GitHub Actions → Should see `deploy-preview-branch` job run

### Test 2: PR Preview with Comment

1. Create PR from your test branch
2. Watch GitHub Actions
3. Look for bot comment on PR with preview URL
4. Click URL to verify it works

### Test 3: Production Protection

```bash
# On main branch with failing test
git checkout main
# Uncomment failing test in tests/deployment-protection.test.js
git add tests/deployment-protection.test.js
git commit -m "test: verify production protection"
git push origin main
```

Expected:
- ❌ Tests fail
- ⊘ Production deployment skipped
- ✅ Production URL unchanged

---

## Summary

✅ **Preview deployments are now enabled!**

- Push to any branch → Get preview URL
- Create PR → Get preview URL + automatic comment
- Push to main (tests pass) → Production deployment
- Tests fail → No deployment (production or preview)

🎉 **Your workflow now supports the full development lifecycle!**
