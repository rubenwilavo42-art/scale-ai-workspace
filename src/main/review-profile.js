const fs = require('fs');
const os = require('os');
const path = require('path');

// Select before Electron initializes storage. Never reuse a review directory,
// and never claim ownership of a directory supplied by the caller.
function createReviewProfile({ argv, normalPath, packaged, reviewBuild = false, homePath = os.homedir() }) {
  const persistent = reviewBuild || argv.includes('--review');
  const review = persistent || argv.some((arg) => arg === '--review' || arg === '--demo' || arg === '--screenshot'
    || arg.startsWith('--scene=') || arg.startsWith('--theme='));
  const index = argv.indexOf('--user-data');
  const explicit = index >= 0 && argv[index + 1];
  // A review profile on Desktop makes even background cache/settings activity
  // request protected-folder access. Reject that developer launch configuration
  // before Electron opens storage; never probe or migrate protected files here.
  if (review && explicit) {
    const target = path.resolve(explicit);
    // Resolve, not join: a root-relative homePath (no drive letter) would
    // otherwise get a Windows drive letter from cwd on `target`'s side only,
    // via `resolve`, and never match here via plain `join` — silently
    // disabling this guard on Windows for any caller that didn't supply a
    // fully drive-qualified homePath.
    if (['Desktop', 'Documents', 'Downloads'].some(name => {
      const protectedPath = path.resolve(homePath, name);
      return target === protectedPath || target.startsWith(protectedPath + path.sep);
    })) throw new Error('Review data must be outside Desktop, Documents and Downloads. Use --review without --user-data for a persistent Application Support profile.');
  }
  const owned = review && !persistent && !explicit;
  const directory = explicit ? path.resolve(explicit)
    : persistent ? path.join(homePath, 'Library', 'Application Support', 'ScalAI Review')
      : owned ? fs.mkdtempSync(path.join(os.tmpdir(), 'nami-review-'))
      : normalPath + (packaged ? '' : '-dev');
  return {
    review,
    path: directory,
    cleanup() {
      if (owned) fs.rmSync(directory, { recursive: true, force: true });
    },
  };
}

module.exports = { createReviewProfile };
