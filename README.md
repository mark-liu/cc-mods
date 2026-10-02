# cc-mods

Claude Code mods: in-process TypeScript plugin hooks, published as a plugin marketplace.

Mods need Claude Code 2.1.287 or later. The module hook API is early access and changes between releases, so expect breakage on upgrade.

## Install

```
/plugin marketplace add mark-liu/cc-mods
/plugin install dash-scrub@cc-mods
/plugin install reminder-trim@cc-mods
```

## Plugins

### dash-scrub

Rewrites em and en dashes in assistant prose before the message is stored, so the transcript and the rendered reply never carry them.

- Unspaced dash between digits becomes a hyphen: `110` + dash + `155` reads `110-155`
- Spaced or bare dash in prose becomes a comma; a leading dash becomes a `-` bullet; a trailing dash is dropped
- Code spans, backtick and tilde fences, and URLs pass through untouched; lines are never joined

Scope: assistant `text` blocks only (`session.append`, response door). Files, commit messages and tool inputs are not touched.

Layout: pure logic in `hooks/scrub.ts`, the hook in `hooks/register.ts`, tests in `hooks/scrub.test.ts`.

### reminder-trim

Keeps the engine's task and todo list reminders ("The task tools haven't been used recently...") out of the model's context. They fire every few turns in any session that does not use the task tools: about 2,500 injections a month on one heavy user's machine.

- Drops `task_reminder` and `todo_reminder` through `prompt.attachment`; every other attachment passes through
- The transcript keeps the engine's record; only the model's copy is left out

## Develop

```
claude plugin validate plugins/<name>
claude plugin test plugins/<name>
```

Load a working copy without installing: `CLAUDE_CODE_PLUGIN_DIRS=/path/to/plugins/<name> claude`.

## Licence

MIT
