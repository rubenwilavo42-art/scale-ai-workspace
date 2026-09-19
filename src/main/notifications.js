// Small, policy-only notification helper. Electron's Notification is injected
// by main.js so this module stays deterministic and testable without a desktop.
function shouldNotify({ enabled = true, appFocused = false, deliberate = false, code = 0, kind = 'session' } = {}) {
  if (!enabled || appFocused || deliberate) return false;
  return kind === 'session' || Number(code) !== 0;
}

function notificationCopy({ title = 'Agent', code = 0, note = '' } = {}) {
  const failed = Number(code) !== 0;
  return {
    title: failed ? `${title} · attention` : `${title} · terminé`,
    body: failed ? (note || 'La session s’est arrêtée avec une erreur.') : 'La session a terminé son travail.',
  };
}

module.exports = { shouldNotify, notificationCopy };
