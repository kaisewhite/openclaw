1. `pm-agent` creates tasks as `backlog` and assigns to `architect-agent`
2. `architect-agent` uses `lead-architect` skill to validate scope, acceptance criteria, dependencies, files touched, and implementation plan
3. `architect-agent` assigns to `qa-agent`
4. `qa-agent` uses `strict-tdd` skill to define test cases first:
   - unit
   - integration
   - e2e
   - edge cases
   - regression cases
     Then updates the issue with branch naming, test plan, and pass/fail criteria

5. `qa-agent` assigns to `fullstack-agent`
6. `fullstack-agent` implements strictly against the test plan and acceptance criteria
7. `fullstack-agent` does **not** mark complete yet — instead assigns back to `qa-agent`
8. `qa-agent` validates:
   - tests exist and are correct
   - implementation satisfies intended behavior
   - no regressions
   - no shortcuts / test cheating

9. If QA passes, assign back to `architect-agent`
10. `architect-agent` performs final design/code review, confirms architectural alignment, and creates PR for dev
11. Only then mark task `completed`

Cleaner status model:

- `backlog` → created by PM
- `planned` → architect clarified it
- `test-designed` → QA finished TDD spec
- `in-progress` → fullstack implementing
- `in-review` → QA validating implementation
- `ready-for-pr` → architect final review
- `completed` → PR opened / merged, depending on your definition

Best practical tweak:

**Split QA into two responsibilities**

- **QA Spec Phase**: writes tests first
- **QA Validation Phase**: verifies implementation after coding

That makes the workflow much more robust and much more staff-engineer-approved.
