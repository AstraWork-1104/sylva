# Sylva: a shared ChatGPT–Codex development workflow

**Status:** proposal for review, 11 October 2026. No integration or repository settings have been changed. This file is the sole deliverable of this investigation.

## Decision

**Recommended architecture (proposal):** use **GitHub as the active development ledger**: one Issue for each approved task, one task branch, and one Pull Request (PR) for the result. Keep source code and durable technical specifications in the repository. Keep Google Drive for the existing product documentation and decisions that are still authored there; link to the authoritative document from the Issue instead of copying it. Put a short `AGENTS.md` in the repository only after the end-to-end access test succeeds. The user launches Codex with a short command; agents handle discovery and file changes. The user makes product decisions and authorizes merges.

The pivotal precondition is **not yet verified**: a fresh Codex *cloud* task and a separate ChatGPT conversation must both be able to read the private Issue/PR and the linked Drive document with their own connections. This desktop chat's connections do not prove cloud or cross-chat access. Until that test passes, do not retire the current Drive `ACTIVE_TASK` pointer or alter standing instructions.

| Alternative | Advantage | Why it is not the default |
| --- | --- | --- |
| Drive task + `ACTIVE_TASK` + GitHub PR (current pattern) | Already readable and writable in this desktop chat; concise unique pointer | Two mutable status records must be synchronized; cloud Drive access is unverified, and the preceding TASK-0002 stopped because its authorized cloud workspace was unavailable |
| GitHub Issue + branch + PR **(recommended)** | Task, code and result have stable links and one development history; a cloud repository checkout and GitHub connector can discover them | ChatGPT Issue writing and independent private-PR reading still need a real cross-conversation test |
| Custom MCP/plugin, GitHub Actions dispatcher, or Agents API | Could reduce the remaining launch step | Adds credentials, operating cost, failure modes and maintenance before the simple native path is proven |

This is an architectural recommendation, not a migration. The current Drive pointer and documents remain authoritative until the owner accepts a tested replacement.

## Evidence and boundaries

**Observed in this desktop chat:** the Google Drive connector read the Sylva instructions, `ACTIVE_TASK`, and linked TASK-0002, then wrote and read back `BLOCKED` status in the last two documents. The GitHub connector read the private `AstraWork-1104/sylva` metadata and `main` root, found only `README.md` on `main`, read the existing audit report on another branch, and created this report branch. These actions demonstrate the local connected tools, not access from Codex Cloud or another ChatGPT conversation. This report's GitHub commit/PR, if successful, will additionally prove this chat's GitHub write capability. A previous audit's failed `gh` API call despite working Git transport is a concrete warning that clone/push credentials and Issue/PR API rights are separate; see [the earlier audit](https://github.com/AstraWork-1104/sylva/blob/docs/workflow-audit-20261011/docs/WORKFLOW_AUDIT.md). Its GitHub-centered design is a proposal, not an implemented Sylva workflow.

**Sourced product capabilities:** [OpenAI's Cloud environment guide](https://learn.chatgpt.com/docs/environments/cloud-environments) says a published environment checks out selected GitHub repositories into isolated cloud tasks, and documents its setup and access controls. It does **not** establish that this user's Google Drive connector is exposed to a particular cloud task. [OpenAI's Codex prompting guide](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide) documents automatic discovery of repository `AGENTS.md` by Codex CLI; use a small root file for durable repository rules, not task briefs. [OpenAI's guidance on skills and prompts](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) warns that excessive standing instructions and skills consume context and can conflict. [GitHub branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches) can require PRs, reviews and checks; availability and settings for this private repo remain to be checked before adoption.

**Three implemented or documented comparison patterns (sourced, not Sylva deployments):**

1. [GitHub Copilot cloud agent tutorial](https://docs.github.com/en/copilot/tutorials/cloud-agent/improve-a-project): an issue is defined and assigned to an agent; repository instructions are read; the agent produces a draft PR, requests human review, and a person merges. The assignment is a human launch step. This supports issue-to-agent-to-PR handoff without a second task database.
2. [Codex Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environments) plus the [Codex `AGENTS.md` discovery mechanism](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide): a person selects a published repository environment and starts a task; the agent uses repository context in an isolated workspace. The docs establish a feasible mechanism, not that Sylva's particular cloud environment or Drive connection is configured.
3. The maintained [OpenHands GitHub Action](https://github.com/OpenHands/openhands-github-action/blob/main/README.md) contains concrete `workflow_dispatch`, scheduled, prompt-file and issue-prompt examples. It proves that automatic launch is technically possible, while its API key, GitHub Actions configuration and polling illustrate overhead Sylva need not take on for one user and one active task.

| Pattern | Task source | Instruction discovery | Launch and result | Human step | Sylva fit |
| --- | --- | --- | --- | --- | --- |
| Copilot cloud agent | GitHub Issue | Repo instructions | Issue assignment → PR | Define/assign, review/merge | Strong handoff model; another agent/product is unnecessary |
| Codex Cloud | User task + repo | Repo `AGENTS.md` | Cloud task → changes/PR when configured | Start task, review/merge | Preferred execution path, subject to access test |
| OpenHands Action | Prompt/issue in workflow | Checked-out repo/prompt file | Action trigger → agent output | Setup, secrets, review | Only if native short-command path proves inadequate |
| Proposed Sylva | One GitHub Issue | Short `AGENTS.md` + Issue links | Short user command → branch/PR | Product decision, launch, merge | Lowest process cost if both connected clients pass validation |

None of these examples proves unattended ChatGPT-to-Codex dispatch in Sylva. The design intentionally uses the acceptable short user instruction.

## Ownership and minimal structure

| Owner | Canonical content | Agent access rule |
| --- | --- | --- |
| Google Drive | Existing product decisions, exploratory design and any document expressly kept there | ChatGPT edits approved product docs; Issue links the exact document/section. Codex reads only linked material when necessary. No mirrored task brief. |
| GitHub Issue | One actionable approved task: outcome, acceptance criteria, constraints, source links, verification and any open decision | ChatGPT creates/updates it after user approval. Exactly one Issue carries `codex-ready` at a time; Codex verifies the unique match before starting. |
| GitHub repository | Code and durable technical specs; later a short root `AGENTS.md` | Codex reads relevant paths, edits on one branch; main changes only by approved PR. |
| GitHub PR | Result, diff, checks, unrun checks, risks and review conversation | Codex links the Issue and asks for review. ChatGPT reads the PR/diff independently. Corrections stay on the same branch and PR. |
| User | Product decisions, task authorization, optional short Codex launch and merge approval | Agents never infer merge approval from a completed task or a green check. |

Proposed future layout, **not created by this report**:

```text
README.md                     project entry point
AGENTS.md                     concise durable repository rules
docs/<technical-topic>.md     only specs needed for ongoing development
source/...                    plugin code when implementation begins
```

Avoid a separate task Markdown file per Issue, a duplicate Drive task, `CODEBASE_MAP.md`, automation status files, and CI scaffolding before real checks exist. Keep links rather than replicated prose. For an investigation whose result is a durable report, one report file in a task branch is appropriate.

## End-to-end operating procedure

1. **Discuss and decide (user + ChatGPT).** ChatGPT reads only relevant existing Drive docs and repo context. It records the user's approved decision in the canonical product document if one exists. It creates one concise GitHub Issue, with acceptance criteria, explicit exclusions, linked source documents and a check plan. It marks that Issue `codex-ready` only after ensuring there is no other ready Issue. No automatic task begins from discussion alone.
2. **Launch (user).** The user says: “In `AstraWork-1104/sylva`, execute the unique `codex-ready` Issue.” The exact Issue URL is a safer fallback when labels/search are unavailable; no task text or file transfer is required.
3. **Discover and claim (Codex).** In the approved cloud repository environment, Codex finds exactly one ready Issue, checks for an existing branch/PR, reads `AGENTS.md`, the Issue, and only necessary linked documents/files. If zero or multiple Issues match, it stops and reports the ambiguity. It marks the Issue in progress only if the API permits; otherwise the branch/PR is the progress signal. It uses a task-specific branch from current `main`.
4. **Work and save (Codex).** Codex changes only authorized paths, runs focused checks possible in its environment, commits and opens one PR targeting `main` (a draft PR is fine while unfinished). The PR body links the Issue and states what changed, exact checks and outcomes, what was impossible, and any product decision needed. For a research task, commit one report file. Do not claim 3ds Max/Corona runtime verification from a cloud Linux environment; that needs a licensed Windows host later.
5. **Review (user + ChatGPT).** The user says: “Review the Sylva result.” ChatGPT finds the PR linked to the current Issue, reads the Issue, changed files/diff, checks and linked source docs, and reports acceptance-criterion findings. It writes a focused correction request to the same Issue/PR if supported; Codex continues on the same branch/PR. ChatGPT's review is advice; the user decides whether to accept and authorizes any merge.
6. **Close and recover.** After authorized merge, close the Issue (or let a verified closing keyword do it) and remove the ready label. On interruption, first inspect the Issue, branch, commits and PR; resume existing work rather than creating a duplicate. An uncertain write is read back before retrying. If a connector lacks a needed operation, preserve the current record and report the precise missing permission.

**Concrete example (proposal, not executed):** The user approves Library Browser thumbnail scaling. ChatGPT updates the authoritative product description in Drive, creates “Adjust Library Browser thumbnail scale” as the sole `codex-ready` Issue with a link to that section and measurable UI behavior. The user gives the short launch command. Codex reads the Issue and relevant files, creates one branch, implements and checks the behavior, then opens a PR linked to the Issue. ChatGPT later reads the PR and diff without pasted files, checks the acceptance criteria, and requests a correction on the same PR if needed. The user approves the final behavior and merge. The PR and Issue retain the technical history; the product doc retains the approved behavior.

## Configuration, permissions and resource use

1. **Connections:** confirm ChatGPT can read/write Issues and read private PR diffs in `AstraWork-1104/sylva`; confirm Codex Cloud can read the private repo/Issue, create a branch/PR, and read only task-linked Drive docs if required. Test each *operation* in the actual execution surface. Connector visibility in this desktop chat is insufficient evidence for other surfaces. If cloud Drive is unavailable, put the minimum task-critical excerpt into the Issue once, with a link to the original; do not maintain a second synchronized task document.
2. **Cloud environment:** publish an isolated environment for the one repository using the [official setup path](https://learn.chatgpt.com/docs/environments/cloud-environments). Do not install extra software or grant broad network access just to prove handoff. The environment's permissions and network policy govern what it can retrieve.
3. **Repository instructions:** after validation, propose a very short root `AGENTS.md`: repository purpose, unique ready-Issue lookup, branch/PR convention, relevant checks, no direct `main` changes or merge without approval, and honest runtime validation limits. Keep task detail in the Issue and technical details near code.
4. **Review controls:** after owner approval, configure `main` protection and human approval; require only checks that actually exist and are reliable. GitHub permission to push a branch does not imply API permission to create Issues or PRs. A successful GitHub connector call also does not prove native Git transport from another environment.
5. **Context economy:** start with one Issue/PR URL, read targeted links, then inspect changed paths and diffs. Do not search all Drive archives or repeat whole specs in prompts. Keep `AGENTS.md` concise; use a nested instruction file only for a real local exception. Use one active Issue, one branch and one PR per task; reuse them on retry. Fetch current versions before writes, keep reports only when they are an actual deliverable, and stop optional testing once the stated risk is checked. No token/usage savings are claimed numerically without measurement.

## Risks, fallback and adoption

- **Cross-surface permissions are the main blocker.** The private repository is readable in this chat and this report branch was creatable, but cloud Drive access, separate ChatGPT Issue writing, and separate-conversation PR retrieval remain unverified. An agent cannot “independently” cross those boundaries until its own connection is tested.
- **A single-label ready queue needs discipline.** Two ready Issues make the short command ambiguous. ChatGPT should enforce uniqueness and Codex should fail closed on ambiguity. Labels are pointers, not an extra task database.
- **State can diverge during migration.** The current Drive `ACTIVE_TASK` is `BLOCKED` for TASK-0002. Leave it and existing task documents intact until the owner decides whether to resume, supersede or archive them. Do not silently create the same active task in GitHub.
- **Cloud and local execution differ.** Cloud environments have isolated workspaces and access controls; local app connectors and native Git credentials may differ. 3ds Max/Corona behavior cannot be certified without the appropriate installed runtime and test host.
- **Fallback:** if the Issue handoff fails but both agents can reach the existing Drive pointer, keep the present single Drive task + pointer and use GitHub PRs as results, with one explicitly checked status sync. If cloud Drive fails but GitHub works, the Issue holds the task-critical brief and links to Drive background material for ChatGPT; Codex reports inaccessible links rather than guessing. Do not add a custom bot until a real missing link survives these tests.

**Smallest validation experiment before changing instructions or task storage:**

1. In a separate ChatGPT conversation, ask it to read this private report and an existing private PR, then create a disposable, clearly marked test Issue with a short task; verify its URL and readback.
2. In a genuine Codex Cloud task for this repo, use only the short discovery command. Verify it finds that exact Issue, reads its content and one linked Drive document (or records that Drive is unavailable), and can create a disposable branch and draft PR with a one-line test file. Inspect the actual result and permissions; remove the disposable artifact afterward with explicit owner approval.
3. Back in a separate ChatGPT conversation, ask it to find the PR from the Issue and accurately summarize the changed line without pasted content.
4. If all three pass, review a migration PR for a short `AGENTS.md`, then switch future *new* tasks to Issues. Decide explicitly how to dispose of the old Drive pointer. If a step fails, document the failing operation and use the narrow fallback above; do not claim seamlessness.

## Source links

- [Codex Cloud environment setup and limitations](https://learn.chatgpt.com/docs/environments/cloud-environments)
- [Codex `AGENTS.md` discovery](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide)
- [OpenAI guidance on concise agent instructions](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra)
- [GitHub Copilot issue-to-PR tutorial](https://docs.github.com/en/copilot/tutorials/cloud-agent/improve-a-project)
- [OpenHands GitHub Action, actual workflow configuration examples](https://github.com/OpenHands/openhands-github-action/blob/main/README.md)
- [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [Previous Sylva audit, treated as a proposal](https://github.com/AstraWork-1104/sylva/blob/docs/workflow-audit-20261011/docs/WORKFLOW_AUDIT.md)
