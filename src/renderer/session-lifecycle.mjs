// Pure session lifecycle helpers. Keeping the rules outside app.js makes the
// desktop session controls testable without Electron.

export function isWorkspaceSession(panel) {
  return !!panel && ['claude', 'shell', 'harness', 'run', 'acp'].includes(panel.kind);
}

export function sessionState(panel) {
  if (!panel) return 'unknown';
  if (panel.exited) return 'exited';
  if (panel.stopping) return 'stopping';
  if (panel.attention) return 'attention';
  if (panel.oneShot && panel.commandDone) return 'finished';
  if (panel.working) return 'working';
  return 'running';
}

export function sessionAction(panel) {
  if (!isWorkspaceSession(panel)) return 'none';
  if (panel.exited) return 'restart';
  if (panel.stopping) return 'none';
  return 'stop';
}

// Restarting a session must preserve the workspace and agent identity, but not
// renderer-only state such as the old id, exit/stopping flags, or attention.
export function restartOptions(panel) {
  if (!isWorkspaceSession(panel)) return null;
  const out = {
    kind: panel.kind,
    title: panel.title,
    titleSource: panel.titleSource,
    code: panel.code,
    chipKind: panel.chipKind,
    cwd: panel.cwd,
    command: panel.command,
    program: panel.program,
    args: Array.isArray(panel.args) ? [...panel.args] : panel.args,
    seed: panel.seed,
    cont: panel.cont,
    sid: panel.sid,
    acpSid: panel.acpSid,
    agentId: panel.agentId,
    purpose: panel.purpose,
    watchDone: panel.watchDone,
    oneShot: panel.oneShot,
  };
  // A completed one-shot is a historical command, not a resumable conversation.
  // Restarting it should run the command again, so clear completion state only.
  return out;
}
