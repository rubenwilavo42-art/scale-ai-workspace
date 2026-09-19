'use strict';

const fs = require('node:fs');
const path = require('node:path');
const fsActions = require('./fs-actions');
const permissions = require('./agent-permissions');

const OPERATIONS = Object.freeze({
  read: 'read', createFile: 'create-file', createFolder: 'create-folder',
  write: 'write', move: 'move', rename: 'rename', duplicate: 'duplicate',
  import: 'import', trash: 'trash',
});

function realInside(root, target) {
  const r0 = permissions.insideWorkspace(root, root) ? path.resolve(root) : null;
  if (!r0 || typeof target !== 'string' || !target.trim()) return false;
  try {
    const realRoot = fs.realpathSync(r0);
    const abs = path.resolve(target);
    const realTarget = fs.existsSync(abs) ? fs.realpathSync(abs) : fs.realpathSync(path.dirname(abs));
    const rel = path.relative(realRoot, realTarget);
    return rel === '' || (!rel.startsWith('..' + path.sep) && rel !== '..' && !path.isAbsolute(rel));
  } catch (_) {
    return permissions.insideWorkspace(root, target);
  }
}

function requestFor({ operation, agentId, workspaceRoot, cwd, target, command }) {
  const opLabel = operation === OPERATIONS.read ? 'Lire un fichier' : 'Modifier le workspace';
  return {
    kind: `file-${operation}`,
    agentId,
    workspaceRoot,
    cwd,
    command: command || `${opLabel} : ${target || workspaceRoot}`,
    scope: 'file-ops',
    credentialAccess: false,
  };
}

async function authorize(input, sendPermission) {
  const { workspaceRoot, cwd, target, operation } = input;
  if (!permissions.validateWorkspace({ workspaceRoot, cwd }).ok) {
    return { ok: false, decision: 'deny', error: 'Action bloquée : le répertoire de travail est hors du workspace.' };
  }
  if (target && !realInside(workspaceRoot, target)) {
    return { ok: false, decision: 'deny', error: 'Action bloquée : le chemin cible est hors du workspace.' };
  }
  const request = requestFor(input);
  const result = await permissions.requestPermission(request, sendPermission);
  if (result.ok && result.decision === 'session') permissions.rememberSession(request);
  return result;
}

async function execute(input, sendPermission) {
  const auth = await authorize(input, sendPermission);
  if (!auth.ok) return auth;
  const { operation, workspaceRoot: root } = input;
  switch (operation) {
    case OPERATIONS.createFile: return fsActions.newFile({ root, dir: input.dir, name: input.name });
    case OPERATIONS.createFolder: return fsActions.newFolder({ root, dir: input.dir, name: input.name });
    case OPERATIONS.write: {
      const target = permissions.insideWorkspace(root, input.target) ? path.resolve(input.target) : null;
      if (!target) return { ok: false, error: 'Target outside workspace' };
      try {
        fs.writeFileSync(target, String(input.content ?? ''), 'utf8');
        return { ok: true, path: target };
      } catch (e) { return { ok: false, error: e.message }; }
    }
    case OPERATIONS.move: return fsActions.movePath({ root, src: input.src, destDir: input.destDir });
    case OPERATIONS.rename: return fsActions.renamePath({ root, src: input.src, name: input.name });
    case OPERATIONS.duplicate: return fsActions.duplicatePath({ root, src: input.src });
    case OPERATIONS.import: return fsActions.importPaths({ root, destDir: input.destDir, srcPaths: input.srcPaths });
    case OPERATIONS.trash: return fsActions.trashPath({ root, path: input.target, trashFn: input.trashFn || (p => require('electron').shell.trashItem(p)) });
    case OPERATIONS.read: {
      const target = path.resolve(input.target);
      try { return { ok: true, path: target, content: fs.readFileSync(target, 'utf8') }; }
      catch (e) { return { ok: false, error: e.message }; }
    }
    default: return { ok: false, error: 'Unknown file operation' };
  }
}

module.exports = { OPERATIONS, realInside, requestFor, authorize, execute };
