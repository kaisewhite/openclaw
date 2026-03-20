# Agent Workflow Enforcement Spec

## Status

- Draft
- Date: 2026-03-19
- Scope: `infrastructure/` first, `openclaw/` runtime follow-up only if required

## Problem Statement

The current agent team does not behave like a reliable software delivery team. Repeated failures observed in Slack and Linear handling include:

- agents acting on comments that did not reassign ownership
- incomplete implementation handoffs to QA
- QA staying blocked or re-running checks for too long without decisive handback
- weak progress reporting that requires manual follow-up from the user
- cross-project and cross-repo context contamination
- fabricated or weakly verified environment blockers

These failures create stalled tickets, duplicate work, unclear ownership, and constant management overhead.

## Evidence Summary

Primary evidence comes from:

- `/Users/kaisewhite/Downloads/Mostrom, LLC Slack export Feb 16 2026 - Mar 18 2026/development`

Representative examples:

- ownership confusion and unauthorized acknowledgements:
  - `development/2026-03-17.json:1506`
  - `development/2026-03-18.json:5202`
  - `development/2026-03-18.json:5284`
- repeated closeout workflow correction:
  - `development/2026-03-17.json:2740`
- QA loop and delayed handback:
  - `development/2026-03-17.json:1900`
  - `development/2026-03-16.json:2427`
- environment blocker claims contradicted by available tools/access:
  - `development/2026-03-06.json:1204`
  - `development/2026-03-14.json:10550`
  - `development/2026-03-16.json:630`
- scope contamination:
  - `development/2026-03-03.json:7763`
  - `development/2026-03-14.json:3832`
  - `development/2026-03-14.json:3873`
- missing proactive updates:
  - `development/2026-03-16.json:1048`
  - `development/2026-03-18.json:3264`
  - `development/2026-03-18.json:3492`

## Goals

- establish a strict operating model for ownership, execution, handoff, and escalation
- make agents behave like a coordinated team instead of independent responders
- reduce silent stalls by enforcing time-based and state-based follow-up
- ensure implementation and QA closeouts mutate the actual system of record
- prevent scope contamination across repos, tickets, and projects
- force environment verification before any blocker claim

## Non-Goals

- redesign the entire agent architecture in one step
- add new business workflows unrelated to delivery discipline
- depend on user intervention for routine follow-up
- solve every issue through longer prompts alone

## Desired Operating Model

Agents should operate as a managed delivery team with explicit state transitions.

Core properties:

- one ticket has one current owner
- comments do not transfer ownership
- state transitions require concrete system-of-record mutations
- blocked work must escalate quickly and explicitly
- status updates happen on cadence without user prompting
- PM is responsible for workflow enforcement, not just planning
- PM enforcement must have a circuit breaker so escalation does not loop forever

## System of Record

The system of record for work execution is:

- Linear issue assignment
- Linear issue status
- Linear issue comments
- Git branch and commit references when implementation exists

Slack is the coordination surface, not the source of truth for ticket ownership.

Dispatcher policy:

- assignment and reassignment events may be announced in `#development`
- Linear comment events should not be mirrored into the shared Slack channel
- assigned agents must read Linear comments directly before starting work and before major handoffs

Runtime enforcement note:

- dispatcher comment mirroring is a routing concern, not just a prompt concern
- the dispatcher lambda must enforce assignment-only shared-channel notifications
- this enforcement has already been moved into the lambda/runtime layer and must remain there

## Ownership Rules

### Rule 1: Only explicit assignment transfers ownership

Allowed ownership transfer signals:

- Linear assignee changed to the agent
- dispatcher assignment event tied to that assignee change

Disallowed ownership transfer signals:

- a new Linear comment
- another agent mentioning the ticket
- a Slack thread update
- `Needs Review` status by itself without the corresponding assignment

### Rule 2: Non-owners do not pick up execution

If an agent sees a comment on a ticket it does not own, it may:

- add a short clarification if directly mentioned and asked a question
- point back to the current assignee or PM

It may not:

- acknowledge execution start
- run the task
- post misleading status as if it owns the work

### Rule 3: PM may intervene without taking ticket ownership

The PM agent may follow up, request status, or demand corrective action in Slack without becoming the implementer or QA owner.

Slack identity rule:

- do not turn Linear assignee emails into Slack mention syntax
- in Slack follow-ups, use plain agent IDs/display names unless a real Slack `<@U...>` token is already known
- valid agent names for Slack copy are `architect-agent`, `fullstack-agent`, `codex-agent`, `qa-agent`, and `pm-agent`
- do not include `@mostrom.io` email identities anywhere in Slack output, even as plain text; use `Kaise` for the human user and plain agent IDs for the apps
- only real Slack users may be tagged with Slack mention tokens; agent apps are not Slack users and must remain plain-text labels

## Ticket Lifecycle State Machine

### Implementation Flow

1. `Todo` or `In Progress` assigned to implementation agent
2. implementation agent completes code and verification
3. implementation agent updates Linear with:
   - branch or `main`
   - commit hash
   - concise implementation summary
   - verification evidence
4. implementation agent sets state to `Needs Review`
5. implementation agent assigns `qa-agent@mostrom.io`

Implementation is not complete until steps 3 through 5 are done.

### QA Flow

1. `Needs Review` assigned to QA
2. QA validates against the branch or `main` specified by the issue/comments
3. QA posts one of:
   - `QA PASS`
   - `QA FAIL`
   - `QA BLOCKED`
4. QA must include evidence, repro steps, and the exact failure or pass basis
5. QA mutates the Linear ticket status and assignee in the same closeout action window as the verdict
6. On `QA FAIL`, QA reassigns to the implementation owner or the correct next owner

QA validation is not complete until the verdict is posted and the ticket is moved to the correct next owner/state.

### QA Validation Cycle Definition

One QA validation cycle means:

1. read the issue and current comments and identify the source-of-truth validation artifact
2. check out or open that artifact once
3. run one primary automated validation pass for the changed behavior
4. perform one focused manual verification sweep of the acceptance criteria when the workflow requires manual confirmation

Retry policy:

- one retry is allowed only for clearly transient infrastructure failure or explicit flaky-test evidence
- missing artifacts, branch mismatches, or reproducible product failures are not retry cases
- after the primary pass, manual sweep, and any single allowed retry, QA must mutate the ticket with `PASS`, `FAIL`, or `BLOCKED` within 10 minutes
- once the verdict is posted, the matching Linear status/assignee mutation must be complete within 2 minutes, and the expected norm is same-action closeout
- if the retry still fails:
  - `QA FAIL` when the behavior is broken
  - `QA BLOCKED` when infrastructure/external dependency prevents verdict and the next owner is named

### Blocked Flow

Blocked is a terminal decision for the current validation/execution cycle, not an open-ended status diary.

Every blocked update must include:

- exact blocker
- actions already attempted
- why the blocker cannot be resolved by the current agent
- who must take the next action
- immediate reassignment or explicit PM escalation if required

Ownership rule for blocked tickets:

- do not leave a blocked ticket assigned to the blocked agent after the blocker is posted
- if the next owner is clear, reassign immediately to that owner
- if the next owner is not clear, assign `pm-agent@mostrom.io` for triage and state exactly what routing decision is needed
- do not leave the assignee blank as a substitute for routing

## Role Contracts

### PM Agent

The PM agent is the workflow enforcer.

Responsibilities:

- poll active assigned issues on a fixed cadence
- inspect state, assignee, most recent update time, and latest Linear comment
- detect stalled tickets, broken handoffs, missing updates, and wrong ownership
- post directed follow-ups in `#development` (`C0AGWNWB2MV`)
- pressure the specific owner to take the next required action
- escalate if the owner does not respond or mutate the ticket correctly

The PM agent should not wait for the user to ask for updates.

PM escalation circuit breaker:

- first stale-state detection: PM posts one directed follow-up in `#development`
- second consecutive PM cycle with no ticket mutation or new evidence: PM posts one escalation in `#development` and one Linear comment
- third consecutive PM cycle with no correction: PM must take coordination action itself, reassigning to the obvious next owner or to `pm-agent@mostrom.io` for coordination triage, and stop repeating the same reminder without new evidence
- human escalation is reserved for exceptions:
  - multiple agents appear operationally down
  - no valid next owner can be determined after PM triage
  - product, priority, or business input from Kaise is actually required

PM auto-mutation stance:

- PM may reassign stale or incorrectly owned tickets and may correct workflow-routing states when the right next owner is obvious
- PM may not auto-pass QA, auto-close implementation, or claim technical completion without owner evidence

### Implementation Agents

Implementation agents must:

- read the issue and all comments before acting
- confirm repo and branch source of truth before code work
- not claim done before Linear is updated and QA is assigned
- hand work to QA with enough context to validate quickly

### QA Agent

QA must operate with decisive closure.

QA must:

- use the issue-defined branch or `main` if that is the ticket source of truth
- perform one focused validation cycle
- fail fast if the implementation artifact is missing, unverifiable, or clearly broken
- hand back quickly when the issue is implementation-related
- avoid spending hours in re-check loops without a verdict
- post the decisive verdict within 10 minutes of completing the main validation work; "finalizing report" is not a valid prolonged state

## Heartbeat and Update Rules

### Cadence

Every active ticket must receive:

- a startup acknowledgement after assignment
- a progress update every 30 minutes while actively executing for implementation, architecture, and PM scoping work
- a progress update every 20 minutes while actively executing QA validation work
- an immediate blocker update when blocked
- an immediate closeout update on pass, fail, or handoff

Assigned agents must not rely on Slack comment mirrors for context refresh. They must re-read current Linear comments before:

- starting execution
- posting a blocker verdict
- handing off to QA
- issuing a QA pass/fail/block verdict

### Required Update Content

Each update must contain:

- current action or current blocker
- what changed since the last update
- next action
- ETA to next update or closure

### PM Enforcement Loop

PM heartbeat cadence should check:

- tickets with no update past role-specific SLA
- QA tickets stuck in `Needs Review`
- implementation tickets missing branch/commit context
- tickets in a state inconsistent with the current assignee
- tickets with comments but no corrective action after user instruction

When PM finds a violation, PM follows the circuit breaker:

1. direct follow-up in `#development`
2. escalation in `#development` plus a Linear comment if the next PM cycle still shows no correction
3. coordination reassignment or PM triage ownership if the third PM cycle still shows no correction

For stale QA specifically:

- PM must not leave a ticket sitting on `qa-agent@mostrom.io` without a verdict after the third PM cycle
- if QA claims validation is complete or nearly complete and still has not posted the decisive verdict within 10 minutes, PM treats that as stale immediately
- if QA posts the verdict but leaves the ticket state/assignee unchanged for more than 2 minutes, PM treats that as stale immediately
- if the implementation artifact or branch source of truth is still unclear, PM reassigns back to the implementation owner with an explicit validation blocker note
- if implementation evidence is sufficient but QA is non-responsive, PM assigns `pm-agent@mostrom.io` for coordination triage and continues routing the ticket without waiting on Kaise
- PM only escalates to Kaise if QA staleness appears to be part of a broader system outage or there is no valid fallback routing decision

PM must not spam repeated identical reminders without new evidence.

### Daily PM Standup

- PM posts one consolidated daily standup at `9:00 AM America/New_York` in `#development` (`C0AGWNWB2MV`)
- this is a cron-triggered report, not a replacement for live progress updates
- the standup includes one section each for:
  - `architect-agent`
  - `fullstack-agent`
  - `codex-agent`
  - `qa-agent`
- each section must include:
  - worked in last 24 hours
  - current focus
  - blockers or missing handoff steps
  - required next action
- if there is no credible artifact or ticket evidence for claimed progress, PM must say that explicitly

## Environment and Tooling Rules

Agents may not claim they are blocked by missing tools, env vars, or permissions until they have:

- checked installed tools on PATH
- checked accessible environment variables
- attempted permitted installs/remediation
- verified the actual failing command and exact error

Any blocker report about tooling must include:

- command attempted
- exact error
- remediation attempts
- whether install or config changes are possible in the current environment

## Scope Isolation Rules

Before starting work, the assigned agent must confirm:

- exact repo
- exact ticket
- exact branch source of truth
- exact acceptance criteria or validation target

Agents may not post updates from one project into another ticket thread.

## Prompt and Config Enforcement Requirements

This behavior should not live in one oversized `SOUL.md`.

Recommended placement:

- shared cross-team execution invariants in shared `AGENTS.md`
- role-specific tool verification and action rules in per-agent `TOOLS.md`
- role-specific mission and completion contract in per-agent `SOUL.md`
- cadence and stale-work checks in per-agent `HEARTBEAT.md`
- PM-specific enforcement loop in `pm-agent/HEARTBEAT.md` and `pm-agent/SOUL.md`
- PM daily standup rules in `pm-agent/SOUL.md` and bootstrap cron config

## Proposed Implementation Phases

### Phase 1: Prompt-Level Enforcement in `infrastructure/`

Update prompt assets so rules are explicit and role-specific:

- shared `AGENTS.md`
  - ownership transfer rules
  - state machine invariants
  - closeout requirements
  - scope isolation requirements
- `pm-agent/SOUL.md`
  - PM owns workflow enforcement
  - PM must proactively poll and follow up
- `pm-agent/HEARTBEAT.md`
  - specific stale-ticket checks
  - specific channel and escalation behavior
  - escalation circuit breaker with retry ceiling
- `qa-agent/SOUL.md`
  - fail-fast QA handback
  - no long re-check loops
  - one-cycle definition with explicit retry policy
- `qa-agent/TOOLS.md`
  - environment verification before blocker claims
- implementation agent `SOUL.md` and `TOOLS.md`
  - no done state before full handoff mutation
  - branch/repo validation at start

### Phase 1.5: Runtime Routing Enforcement in `infrastructure/`

Because dispatcher comment mirroring is a routing problem, not just a prompt problem:

- keep comment events disabled for shared-channel dispatcher notifications
- keep assignment/reassignment notifications enabled
- require assigned agents to read Linear comments directly from the issue
- do not defer this enforcement to `openclaw/` unless evidence shows the lambda/runtime path is still leaking shared comment notifications

### Phase 2: Config Tightening in `infrastructure/properties/`

Adjust runtime defaults if needed:

- heartbeat cadence to support PM oversight and active ticket follow-up
- memory behavior for durable rule retention
- pruning settings compatible with the stronger heartbeat model

### Phase 3: Runtime Audit in `openclaw/` Only If Needed

If prompts/config are correct but behavior still fails, audit:

- Slack event routing for comments vs assignments
- heartbeat execution and posting reliability
- prompt injection at runtime
- session continuity and memory application

Do not start with `openclaw/` changes unless runtime evidence shows the infrastructure changes are present but ignored.

## Acceptance Criteria

The new operating model is working when:

- agents stop acknowledging tickets they do not own
- implementation tickets consistently land in `Needs Review` with QA assignment and branch/commit evidence
- QA closes with `PASS`, `FAIL`, or `BLOCKED` quickly instead of staying in loops
- PM posts follow-ups in `#development` without user prompting
- PM posts one evidence-based daily standup at 9 AM ET without user prompting
- stale tickets are surfaced automatically
- blocker claims contain real command evidence and remediation attempts
- cross-project contamination drops to near zero

## Metrics To Watch

- average time from assignment to first acknowledgement
- average time between progress updates on active tickets
- average time between progress updates by role SLA (30m implementation/architecture/PM, 20m QA)
- percentage of implementation tickets handed off with full Linear metadata
- percentage of QA tickets closed in one validation cycle
- count of user-requested status updates per week
- count of wrong-owner acknowledgements
- count of cross-project posting incidents

## Risks

- too much prompt text can dilute enforceability if rules are duplicated across files
- PM follow-up can become noisy if cadence is too aggressive without filtering
- runtime event ambiguity may still exist if dispatcher/comment triggers regress from assignment-only behavior

## Open Questions

- whether PM needs a stronger triage state than temporary PM ownership for non-responsive tickets
- whether explicit watchdog jobs beyond PM standup and heartbeat are still needed after observing live behavior
- whether any residual comment-triggered ownership confusion remains after the assignment-only dispatcher change

## Recommended Next Step

Implement Phase 1 plus the targeted runtime/bootstrap pieces already justified:

- patch shared and per-agent prompt files to encode this operating model
- keep the implementation targeted to PM, QA, and implementation agents
- seed the PM daily standup cron job at bootstrap
- keep dispatcher shared-channel notifications assignment-only
- deploy and observe real ticket behavior before deciding whether `openclaw/` runtime work is required
