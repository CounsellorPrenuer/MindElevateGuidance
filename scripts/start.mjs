import { spawn } from 'node:child_process';

const child = spawn(process.execPath, ['./node_modules/vite/bin/vite.js', 'preview', '--host', '0.0.0.0', '--port', '4173'], {
  stdio: 'inherit',
  shell: false,
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
