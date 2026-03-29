Execute a plan using wave-based parallel execution with fresh agent contexts.

This command takes a plan (a markdown file with numbered tasks) and executes it by grouping tasks into dependency waves, then dispatching each wave's tasks to fresh subagents in parallel. This fights context rot — each agent gets a clean 200K context with only what it needs.

## Input

Expects either:
- A path to a plan file (e.g. `docs/plans/feature-plan.md`)
- Or "the current plan" if one is obvious from context

The plan should have numbered tasks/steps. Tasks can optionally declare dependencies on other tasks.

## Process

### Phase 1: Analyse and Group

1. **Read the plan file** completely.

2. **Extract all tasks** — look for numbered steps, checkboxes, or `### Task N:` headings. For each task, note:
   - Task number/ID
   - What it does (summary)
   - Files it will create or modify
   - Dependencies (explicit `depends on Task X` or implicit from file overlap)

3. **Build a dependency graph** — a task depends on another if:
   - It explicitly says so
   - It reads/modifies a file that a prior task creates
   - It imports/uses something a prior task defines

4. **Group into waves:**
   - **Wave 1**: Tasks with no dependencies (can all run in parallel)
   - **Wave 2**: Tasks that depend only on Wave 1 tasks
   - **Wave 3**: Tasks that depend on Wave 1 or 2 tasks
   - And so on...

5. **Present the wave plan to the user** for approval before executing.

### Phase 2: Execute Waves

For each wave, in order:

1. **Spawn one Agent per task** using the Agent tool with `isolation: "worktree"` for parallel safety.
2. Each agent gets: the full plan (for context), its specific task, CLAUDE.md, and prior wave outputs.
3. **Wait for all agents in the wave to complete.**
4. **Verify:** Check expected files exist and git commits landed.
5. **Report wave completion** with task/commit/status table.
6. **Proceed to next wave.**

### Phase 3: Wrap Up

1. Run the project's test suite to verify integration.
2. Report final status with all commits.
3. Summarise anything that needs manual attention.

## Fallback: Sequential Mode

If the user prefers or agents are unavailable, execute tasks in order within the current context with wave-aware progress tracking.

## Key Principle

Each parallel agent gets a FRESH context — no accumulated context rot. The orchestrator stays lean: read, group, spawn, verify, report. Adapted from GSD (get-shit-done).
