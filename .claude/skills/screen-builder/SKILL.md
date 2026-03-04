---
name: screen-builder
description: Build a complete screen from Figma design through a 4-agent pipeline. Provide a Figma URL and screen name to auto-implement, review, test, and verify. Usage /screen-builder <figma-url> <ScreenName>
---

# Screen Builder Pipeline

Autonomous multi-agent pipeline that takes a Figma URL and produces a fully implemented, reviewed, and verified screen.

## Input Parsing

Extract from the user's input:
- **Figma URL**: Parse `fileKey` and `nodeId` from the URL
  - Format: `figma.com/design/:fileKey/:fileName?node-id=:nodeId`
  - Convert `-` to `:` in nodeId (e.g., `1-2` → `1:2`)
  - For branch URLs: `figma.com/design/:fileKey/branch/:branchKey/:fileName` → use branchKey as fileKey
- **Screen name**: PascalCase name for the screen (e.g., `Results`, `Progress`, `Friends`)

If either is missing, ask the user to provide it.

## Pipeline Execution

Run all 4 steps sequentially. Do NOT pause for user input between steps. Each agent runs, fixes issues, verifies, and hands off automatically.

### Step 1: Design Implementation

Invoke the `design-implementer` agent:

```
Implement the [ScreenName] screen from Figma design.
Figma fileKey: [fileKey]
Figma nodeId: [nodeId]

Create the screen component at /components/screens/[ScreenName]/index.tsx with co-located sub-components.
Create thin route at /app/[screen-name].tsx.
Follow all CLAUDE.md conventions.
Run npm run verify when done — fix any errors until it passes.
Provide your implementation report when complete.
```

Log status when done, proceed immediately to Step 2.

### Step 2: Architecture Review

Invoke the `logic-architect` agent:

```
Review and fix the [ScreenName] screen that was just implemented.
Mode: Review + Fix

Files to review:
- /components/screens/[ScreenName]/index.tsx (and any co-located sub-components)
- /app/[screen-name].tsx (route file)
- Any hooks that were created or modified

Check composition pattern, hook reuse, state flow, re-renders, data pipeline, type safety, error handling, and convention compliance.
Fix all issues directly.
Run npm run verify when done — fix any errors until it passes.
Provide your architecture review report when complete.
```

Log status when done, proceed immediately to Step 3.

### Step 3: Visual Testing

Invoke the `visual-tester` agent:

```
Compare the [ScreenName] screen implementation against its Figma design.
Figma fileKey: [fileKey]
Figma nodeId: [nodeId]

If dev server is running (npm run start:mcp:ios), take screenshots and compare visually.
If not, do code-level analysis: read NativeWind classes and compare against design-specs.md tokens.

Fix any visual mismatches directly by editing NativeWind classes.
Run npm run verify when done — fix any errors until it passes.
Provide your visual testing report when complete.
```

Log status when done, proceed immediately to Step 4.

### Step 4: Code Quality

Invoke the `code-guardian` agent:

```
Final quality sweep for the [ScreenName] screen.

Review all files created/modified in this pipeline:
- /components/screens/[ScreenName]/ (all files)
- /app/[screen-name].tsx
- Any new hooks, icons, or constants added

Check pattern compliance, performance, security, and accessibility.
Fix all issues directly.
Run npm run verify as the FINAL gate — this must pass.
Provide your code quality report when complete.
```

Log status when done.

## Summary Report

After all 4 agents complete, output the final summary:

```
## Screen Builder Complete: [ScreenName]

### Files Created/Modified
- (consolidated list from all agents)

### Pipeline Results
| Step                   | Status | Details                    |
|------------------------|--------|----------------------------|
| Design Implementation  | PASS/FAIL | (brief summary)        |
| Architecture Review    | PASS/FAIL | (brief summary)        |
| Visual Testing         | PASS/FAIL | (brief summary)        |
| Code Quality           | PASS/FAIL | (brief summary)        |

### Agent Reports

#### Design Implementation
(summary from agent 1)

#### Architecture Review
(summary from agent 2)

#### Visual Testing
(summary from agent 3)

#### Code Quality
(summary from agent 4)

### Overall: PASS / FAIL
```

## Error Recovery

- If any agent fails to get verify passing after 3 attempts, log the failure and continue to the next agent (the next agent may fix the remaining issues)
- If the final code-guardian cannot get verify passing, report the specific failures in the summary so the user can address them manually
- If the Figma URL is invalid or design context cannot be fetched, stop the pipeline and ask the user for a corrected URL

## Notes

- The `design-implementer` uses opus model for best code generation quality
- The other 3 agents use sonnet for cost efficiency
- Each agent has access to project memory for learning patterns across sessions
- The visual-tester falls back to code-level analysis if no dev server is running
