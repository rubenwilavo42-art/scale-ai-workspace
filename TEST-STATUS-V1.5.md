# ScalAI V1.5 — test status

- Notification policy tests: **6/6 pass**.
- Full automated suite: **1284/1298 pass**.
- **14 failures** remain and are pre-existing environment/platform failures: browser-sharing, bundle-install, one child-launch case, macOS notarize/review-build/updater checks, repository-shape checks, and zsh-dependent run-done tests.
- Electron UI smoke test could not run in this environment because dependencies are not installed (`electron: not found`). This is explicitly not counted as a successful UI validation.
- Main/preload/notification JavaScript syntax checks pass.
