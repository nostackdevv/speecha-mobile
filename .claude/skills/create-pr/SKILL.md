---
name: create-pr
description: 'Stage, commit, push current changes and create a PR. Use when user wants to create a PR, push changes, or open a pull request.'
---

# Create PR

Stage, commit, push, and create a PR using `gh` CLI.

## Prerequisites

- Must NOT be on main/master branch
- Must have uncommitted changes
- `gh` CLI authenticated (`gh auth status`)

## Steps

1. **Check branch and auth**
   - `git branch --show-current` — if on main/master, stop
   - `gh auth status` — verify authenticated

2. **Review changes**
   - `git status` — show what will be committed

3. **Stage and commit**
   - `git add -A` (skip .env/secrets)
   - Commit with descriptive message + `Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>`

4. **Push and create PR**
   - `git push -u origin {branch}`
   - `gh pr create --base main --title "{title}" --body "{body}"`

## PR Body Format

```markdown
## Summary
- Bullet points of changes

## Test plan
- [ ] Verification steps

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Safety

- Never push to main directly
- Never use --force
- Skip .env, credentials, secrets
