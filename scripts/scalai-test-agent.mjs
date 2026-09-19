#!/usr/bin/env node
// ScalAI development-only agent. It behaves like a long-lived CLI so the
// desktop shell can exercise PTY/session lifecycle without a provider account.
const readline = await import('node:readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
console.log('\x1b[1;32mScalAI Test Agent\x1b[0m');
console.log('Mode développement · aucun compte IA · aucun accès réseau');
console.log('Tapez une instruction. Ctrl+C pour arrêter.');
rl.setPrompt('\n\x1b[32m❯\x1b[0m ');
rl.prompt();
rl.on('line', (line) => {
  const input = line.trim();
  if (!input) return rl.prompt();
  if (/^(exit|quit|quitter)$/i.test(input)) return rl.close();
  console.log(`\x1b[90m[ScalAI] reçu :\x1b[0m ${input}`);
  setTimeout(() => {
    console.log('\x1b[32m✓\x1b[0m Session active — réponse de test générée.');
    console.log('\x1b[90m✓ PTY · workspace · session · événements testés\x1b[0m');
    rl.prompt();
  }, 180);
});
rl.on('close', () => { console.log('\n\x1b[90mScalAI Test Agent arrêté.\x1b[0m'); process.exit(0); });
