// ScalAI Agent Manager helpers. Pure planning/normalization lives here so the
// renderer never needs to know how a CLI reports its version or capabilities.
const { execFile } = require('node:child_process');

function normalizeVersion(stdout, stderr = '') {
  const text = `${stdout || ''}\n${stderr || ''}`;
  const m = text.match(/\b(v?\d+\.\d+(?:\.\d+)?(?:[-+][0-9A-Za-z.-]+)?)\b/);
  return m ? m[1].replace(/^v(?=\d)/, '') : '';
}

function versionCommand(agent) {
  if (!agent || !agent.bin) return null;
  return { file: agent.bin, args: ['--version'] };
}

function runVersion(agent, { exec = execFile, timeout = 7000 } = {}) {
  const spec = versionCommand(agent);
  if (!spec) return Promise.resolve({ ok: false, version: '', error: 'Agent inconnu.' });
  return new Promise((resolve) => {
    exec(spec.file, spec.args, { timeout }, (err, stdout, stderr) => {
      if (err && !stdout && !stderr) return resolve({ ok: false, version: '', error: err.message });
      const version = normalizeVersion(stdout, stderr);
      resolve({ ok: !!version, version, error: version ? '' : (err ? err.message : 'Version introuvable.') });
    });
  });
}

function capabilitySummary(agent) {
  const lc = agent && agent.lifecycle || {};
  return {
    install: !!(agent && agent.install),
    detect: !!(agent && agent.bin),
    status: !!(lc.statusCmd || (lc.statusFichiers && lc.statusFichiers.length)),
    signIn: !!lc.login,
    signOut: !!lc.logout,
    switchAccount: !!(lc.switchCmd || (lc.login && lc.logout)),
    healthCheck: !!lc.health,
    accountPage: !!lc.accountUrl,
    config: !!lc.configPath,
  };
}

function managerState(agent, status, version) {
  const caps = capabilitySummary(agent);
  const installed = !!(agent && agent.found);
  return {
    id: agent && agent.id || '',
    installed,
    path: installed ? (agent.path || '') : '',
    pathShort: installed ? (agent.pathShort || '') : '',
    version: version && version.version || '',
    versionKnown: !!(version && version.version),
    signedIn: status && typeof status.signedIn === 'boolean' ? status.signedIn : null,
    identity: status && status.label || '',
    capabilities: caps,
  };
}

module.exports = { normalizeVersion, versionCommand, runVersion, capabilitySummary, managerState };
